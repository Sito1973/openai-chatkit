"""Google OAuth authentication for ChatKit."""

from __future__ import annotations

import os
import secrets
from typing import Any, Mapping

from authlib.integrations.httpx_client import AsyncOAuth2Client
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, RedirectResponse
from itsdangerous import URLSafeTimedSerializer

router = APIRouter(prefix="/auth", tags=["auth"])

# Cookie settings
AUTH_COOKIE_NAME = "chatkit_auth"
AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7  # 7 days

# Google OAuth configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GOOGLE_AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

# Secret key for signing cookies (generate a random one if not set)
SECRET_KEY = os.getenv("AUTH_SECRET_KEY", secrets.token_hex(32))
serializer = URLSafeTimedSerializer(SECRET_KEY)


def get_base_url(request: Request) -> str:
    """Get the base URL from the request, handling proxies."""
    # Check for forwarded headers (common in reverse proxy setups)
    forwarded_proto = request.headers.get("x-forwarded-proto", "http")
    forwarded_host = request.headers.get("x-forwarded-host", request.headers.get("host", "localhost"))
    return f"{forwarded_proto}://{forwarded_host}"


def create_oauth_client(redirect_uri: str) -> AsyncOAuth2Client:
    """Create an OAuth2 client for Google."""
    return AsyncOAuth2Client(
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        redirect_uri=redirect_uri,
        scope="openid email profile",
    )


def set_auth_cookie(response: RedirectResponse | JSONResponse, user_data: Mapping[str, Any]) -> None:
    """Set the authentication cookie with user data."""
    token = serializer.dumps(dict(user_data))
    response.set_cookie(
        key=AUTH_COOKIE_NAME,
        value=token,
        max_age=AUTH_COOKIE_MAX_AGE,
        httponly=True,
        samesite="lax",
        secure=is_prod(),
        path="/",
    )


def get_user_from_cookie(request: Request) -> Mapping[str, Any] | None:
    """Get user data from the authentication cookie."""
    token = request.cookies.get(AUTH_COOKIE_NAME)
    if not token:
        return None
    try:
        # Token expires after 7 days
        user_data = serializer.loads(token, max_age=AUTH_COOKIE_MAX_AGE)
        return user_data
    except Exception:
        return None


def is_prod() -> bool:
    """Check if running in production."""
    env = (os.getenv("ENVIRONMENT") or os.getenv("NODE_ENV") or "").lower()
    return env == "production"


@router.get("/login/google")
async def login_google(request: Request) -> RedirectResponse:
    """Redirect to Google OAuth login."""
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        return RedirectResponse(url="/?error=oauth_not_configured", status_code=302)

    base_url = get_base_url(request)
    redirect_uri = f"{base_url}/auth/callback/google"

    client = create_oauth_client(redirect_uri)

    # Generate state for CSRF protection
    state = secrets.token_urlsafe(32)

    # Store state in a short-lived cookie
    authorization_url, _ = client.create_authorization_url(
        GOOGLE_AUTHORIZE_URL,
        state=state,
    )

    response = RedirectResponse(url=authorization_url, status_code=302)
    response.set_cookie(
        key="oauth_state",
        value=state,
        max_age=600,  # 10 minutes
        httponly=True,
        samesite="lax",
        secure=is_prod(),
        path="/",
    )
    return response


@router.get("/callback/google")
async def callback_google(request: Request) -> RedirectResponse:
    """Handle Google OAuth callback."""
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        return RedirectResponse(url="/?error=oauth_not_configured", status_code=302)

    # Verify state
    state = request.query_params.get("state")
    stored_state = request.cookies.get("oauth_state")

    if not state or state != stored_state:
        return RedirectResponse(url="/?error=invalid_state", status_code=302)

    # Check for errors
    error = request.query_params.get("error")
    if error:
        return RedirectResponse(url=f"/?error={error}", status_code=302)

    code = request.query_params.get("code")
    if not code:
        return RedirectResponse(url="/?error=no_code", status_code=302)

    base_url = get_base_url(request)
    redirect_uri = f"{base_url}/auth/callback/google"

    client = create_oauth_client(redirect_uri)

    try:
        # Exchange code for token
        token = await client.fetch_token(
            GOOGLE_TOKEN_URL,
            code=code,
        )

        # Get user info
        client.token = token
        resp = await client.get(GOOGLE_USERINFO_URL)
        user_info = resp.json()

        # Extract relevant user data
        user_data = {
            "id": user_info.get("sub"),
            "email": user_info.get("email"),
            "name": user_info.get("name"),
            "picture": user_info.get("picture"),
        }

        # Redirect to app with auth cookie
        response = RedirectResponse(url="/", status_code=302)
        set_auth_cookie(response, user_data)

        # Clear the state cookie
        response.delete_cookie(key="oauth_state", path="/")

        return response

    except Exception as e:
        print(f"OAuth error: {e}")
        return RedirectResponse(url="/?error=oauth_failed", status_code=302)


@router.get("/me")
async def get_current_user(request: Request) -> JSONResponse:
    """Get the current authenticated user."""
    user = get_user_from_cookie(request)
    if not user:
        return JSONResponse({"authenticated": False}, status_code=401)
    return JSONResponse({"authenticated": True, "user": user})


@router.post("/logout")
async def logout(request: Request) -> JSONResponse:
    """Log out the current user."""
    response = JSONResponse({"success": True})
    response.delete_cookie(key=AUTH_COOKIE_NAME, path="/")
    return response

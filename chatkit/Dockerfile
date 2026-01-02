# Force git update
# Build frontend

FROM node:20-alpine as frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend ./
RUN npm run build

# Build backend and serve
FROM python:3.11-slim
WORKDIR /app

# Install backend dependencies
COPY backend/pyproject.toml .
RUN pip install .

# Copy backend code
COPY backend/ .

# Copy frontend build to static directory
# We place it at /app/static so it matches the relative path search in main.py
COPY --from=frontend-builder /app/frontend/dist /app/static

# Expose port (Easypanel usually detects this or uses PORT env)
EXPOSE 8000

# Environment variables
ENV PORT=8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

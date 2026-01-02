import { useEffect, useState } from "react";
import { ChatKitPanel } from "./components/ChatKitPanel";
import { LoginPage } from "./components/LoginPage";
import { useAuth } from "./lib/useAuth";

export default function App() {
  const { isLoading, isAuthenticated, user, login, logout } = useAuth();
  const [urlError, setUrlError] = useState<string | null>(null);

  // Check for error in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    if (error) {
      setUrlError(error);
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} error={urlError} />;
  }

  // Show chat with user info
  return (
    <main className="flex min-h-screen flex-col bg-slate-100 dark:bg-slate-950">
      {/* Header with user info */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          {user?.picture && (
            <img
              src={user.picture}
              alt={user.name}
              className="h-8 w-8 rounded-full"
            />
          )}
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {user?.name || user?.email}
          </span>
        </div>
        <button
          onClick={logout}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          Cerrar sesion
        </button>
      </header>

      {/* Chat panel */}
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <ChatKitPanel />
        </div>
      </div>
    </main>
  );
}

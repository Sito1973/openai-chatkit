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
    <main className="flex h-[100dvh] flex-col bg-gradient-to-br from-amber-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Header with logo and user info */}
      <header className="sticky top-0 z-10 flex-shrink-0 border-b border-amber-200/50 bg-white/95 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-6 sm:py-3 lg:px-8">
          {/* Logo and company name */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/logo.png"
              alt="Cocinando Sonrisas Logo"
              className="h-8 w-8 sm:h-12 sm:w-12"
            />
            <div>
              <h1 className="text-sm font-bold text-amber-600 sm:text-lg">
                Agente Odoo
              </h1>
              <p className="hidden text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400 xs:block sm:text-sm">
                COCINANDO SONRISAS
              </p>
            </div>
          </div>

          {/* User info and logout */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              {user?.picture && (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-7 w-7 rounded-full ring-2 ring-amber-200 dark:ring-amber-800 sm:h-8 sm:w-8"
                />
              )}
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow active:scale-95 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 sm:px-4 sm:py-2 sm:text-sm"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Welcome message and Chat panel */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-2 sm:p-4">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden">
          {/* Welcome message - smaller on mobile */}
          <div className="mb-2 flex-shrink-0 text-center sm:mb-3">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 sm:text-xl">
              Bienvenido, <span className="text-amber-600">{user?.name?.split(" ")[0]}</span>
            </h2>
          </div>
          <div className="min-h-0 flex-1">
            <ChatKitPanel userName={user?.name || undefined} />
          </div>
        </div>
      </div>
    </main>
  );
}

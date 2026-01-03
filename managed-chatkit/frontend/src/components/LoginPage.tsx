interface LoginPageProps {
  onLogin: () => void;
  error?: string | null;
}

export function LoginPage({ onLogin, error }: LoginPageProps) {
  return (
    <div className="flex h-[100dvh] flex-col bg-gradient-to-br from-amber-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-amber-200/50 bg-white/80 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 sm:justify-start sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
          <img
            src="/logo.png"
            alt="Cocinando Sonrisas Logo"
            className="h-10 w-10 sm:h-14 sm:w-14"
            loading="eager"
            fetchPriority="high"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-base font-bold text-amber-600 sm:text-xl lg:text-2xl">
              Agente Odoo
            </h1>
            <p className="text-xs font-medium tracking-wide text-slate-600 dark:text-slate-400 sm:text-base">
              COCINANDO SONRISAS
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center overflow-auto p-3 sm:p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl dark:bg-slate-800 sm:rounded-2xl sm:p-8">
          <div className="mb-6 text-center sm:mb-8">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 sm:mb-4 sm:h-16 sm:w-16">
              <img src="/logo.png" alt="" className="h-8 w-8 sm:h-10 sm:w-10" loading="eager" />
            </div>
            <h2 className="mb-1 text-xl font-bold text-slate-900 dark:text-white sm:mb-2 sm:text-2xl">
              Bienvenido
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Inicia sesion para acceder al asistente
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400 sm:mb-6 sm:p-4">
              {error === "oauth_not_configured" && "OAuth no esta configurado. Contacta al administrador."}
              {error === "invalid_state" && "Error de seguridad. Intenta de nuevo."}
              {error === "oauth_failed" && "Error al iniciar sesion. Intenta de nuevo."}
              {error === "no_code" && "Error en la autenticacion. Intenta de nuevo."}
              {!["oauth_not_configured", "invalid_state", "oauth_failed", "no_code"].includes(error) && error}
            </div>
          )}

          <button
            onClick={onLogin}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-[0.98] dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 sm:text-base"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar con Google
          </button>

          <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400 sm:mt-6 sm:text-sm">
            Al iniciar sesion, aceptas nuestros terminos de uso
          </p>
        </div>
      </main>
    </div>
  );
}

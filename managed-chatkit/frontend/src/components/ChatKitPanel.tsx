import { useMemo, useEffect, useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { createClientSecretFetcher, workflowId } from "../lib/chatkitSession";

interface ChatKitPanelProps {
  userName?: string;
  theme?: "light" | "dark" | "system";
}

// Hook to detect system dark mode preference
function useTheme(preference: "light" | "dark" | "system" = "system") {
  const [isDark, setIsDark] = useState(() => {
    if (preference !== "system") return preference === "dark";
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (preference !== "system") {
      setIsDark(preference === "dark");
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [preference]);

  return isDark ? "dark" : "light";
}

export function ChatKitPanel({ userName, theme = "system" }: ChatKitPanelProps) {
  const resolvedTheme = useTheme(theme);

  const getClientSecret = useMemo(
    () => createClientSecretFetcher(workflowId, "/api/create-session", userName),
    [userName]
  );

  const chatkit = useChatKit({
    api: { getClientSecret },
    theme: {
      colorScheme: resolvedTheme,
    },
    composer: {
      attachments: {
        enabled: true,
        maxCount: 5,
        maxSize: 10485760,
      },
    },
    startScreen: {
      greeting: "¿En qué puedo ayudarte hoy?",
      prompts: [
        {
          icon: "chart-line",
          label: "Ventas por fecha",
          prompt: "Buscar ventas de una fecha específica",
        },
        {
          icon: "users",
          label: "Asistencia",
          prompt: "Consultar registros de entrada y salida de un colaborador",
        },
      ],
    },
    locale: "es",
  });

  return (
    <div className="flex h-full w-full overflow-hidden rounded-xl shadow-lg transition-colors sm:rounded-2xl">
      <ChatKit control={chatkit.control} className="h-full w-full" />
    </div>
  );
}

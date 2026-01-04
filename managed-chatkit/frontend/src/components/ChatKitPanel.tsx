import { useMemo, useEffect, useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { createClientSecretFetcher, workflowId } from "../lib/chatkitSession";

interface ChatKitPanelProps {
  userName?: string;
}

// Hook to detect system color scheme (dark/light)
function useSystemTheme(): "dark" | "light" {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return theme;
}

// ChatKit options for customization (theme is dynamic, set in component)
const chatKitOptions = {
  composer: {
    attachments: { enabled: true },
    placeholder: "Escribe tu mensaje...",
  },
  startScreen: {
    greeting: "¿En qué puedo ayudarte hoy?",
    prompts: [
      {
        label: "Ventas por fecha",
        prompt: "Buscar ventas de una fecha específica",
        icon: "chart",
      },
      {
        label: "Buscar Registros control de acceso",
        prompt: "Consultar registros de entrada y salida de un colaborador",
        icon: "user",
      },
    ],
  },
};

export function ChatKitPanel({ userName }: ChatKitPanelProps) {
  const systemTheme = useSystemTheme();

  const getClientSecret = useMemo(
    () => createClientSecretFetcher(workflowId, "/api/create-session", userName),
    [userName]
  );

  // Log options for debugging
  useEffect(() => {
    console.log("[ChatKitPanel] Initializing with options:", chatKitOptions);
    console.log("[ChatKitPanel] workflowId:", workflowId);
    console.log("[ChatKitPanel] userName:", userName);
    console.log("[ChatKitPanel] systemTheme:", systemTheme);
  }, [userName, systemTheme]);

  const chatkit = useChatKit({
    api: { getClientSecret },
    theme: systemTheme,
    ...chatKitOptions,
  });

  // Log chatkit state
  useEffect(() => {
    console.log("[ChatKitPanel] chatkit.control:", chatkit.control);
  }, [chatkit.control]);

  return (
    <div className="flex h-full w-full overflow-hidden rounded-xl shadow-lg transition-colors sm:rounded-2xl">
      <ChatKit control={chatkit.control} className="h-full w-full" />
    </div>
  );
}

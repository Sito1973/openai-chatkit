import { useMemo, useEffect } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { createClientSecretFetcher, workflowId } from "../lib/chatkitSession";

interface ChatKitPanelProps {
  userName?: string;
}

// ChatKit options for customization
const chatKitOptions = {
  theme: "dark" as const,
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
  const getClientSecret = useMemo(
    () => createClientSecretFetcher(workflowId, "/api/create-session", userName),
    [userName]
  );

  // Log options for debugging
  useEffect(() => {
    console.log("[ChatKitPanel] Initializing with options:", chatKitOptions);
    console.log("[ChatKitPanel] workflowId:", workflowId);
    console.log("[ChatKitPanel] userName:", userName);
  }, [userName]);

  const chatkit = useChatKit({
    api: { getClientSecret },
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

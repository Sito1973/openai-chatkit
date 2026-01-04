import { useMemo } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { createClientSecretFetcher, workflowId } from "../lib/chatkitSession";

interface ChatKitPanelProps {
  userName?: string;
}

export function ChatKitPanel({ userName }: ChatKitPanelProps) {
  const getClientSecret = useMemo(
    () => createClientSecretFetcher(workflowId, "/api/create-session", userName),
    [userName]
  );

  const chatkit = useChatKit({
    api: { getClientSecret },
    theme: "dark",
    composer: {
      attachments: { enabled: true },
      placeholder: "Escribe tu mensaje...",
    },
    startScreen: {
      greeting: "¿En qué puedo ayudarte hoy?",
      prompts: [
        {
          name: "Ventas por fecha",
          prompt: "Buscar ventas de una fecha específica",
          icon: "search",
        },
        {
          name: "Asistencia",
          prompt: "Consultar registros de entrada y salida de un colaborador",
          icon: "users",
        },
      ],
    },
  });

  return (
    <div className="flex h-full w-full overflow-hidden rounded-xl shadow-lg transition-colors sm:rounded-2xl">
      <ChatKit control={chatkit.control} className="h-full w-full" />
    </div>
  );
}

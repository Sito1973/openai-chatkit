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
    composer: {
      // Enable file attachments (images, PDFs, etc.)
      attachments: { enabled: true },
    },
  });

  return (
    <div className="flex h-full w-full overflow-hidden rounded-xl bg-white shadow-lg transition-colors dark:bg-slate-900 sm:rounded-2xl">
      <ChatKit control={chatkit.control} className="h-full w-full" />
    </div>
  );
}

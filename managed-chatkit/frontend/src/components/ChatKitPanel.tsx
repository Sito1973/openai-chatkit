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
    composer: {
      // Enable file attachments (images, PDFs, etc.)
      attachments: { enabled: true },
    },
  });

  return (
    <div className="flex h-full w-full overflow-hidden rounded-xl shadow-lg transition-colors sm:rounded-2xl">
      <ChatKit
        control={chatkit.control}
        className="h-full w-full"
        theme={resolvedTheme}
        locale="es"
      />
    </div>
  );
}

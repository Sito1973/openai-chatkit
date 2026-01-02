const readEnvString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

/**
 * Workflow ID can come from:
 * 1. VITE_CHATKIT_WORKFLOW_ID env var (baked at build time)
 * 2. Server-side CHATKIT_WORKFLOW_ID or VITE_CHATKIT_WORKFLOW_ID env var (runtime)
 *
 * If not set at build time, we'll send null and let the backend use its env var.
 */
export const workflowId: string | null = (() => {
  const id = readEnvString(import.meta.env.VITE_CHATKIT_WORKFLOW_ID);
  if (!id || id.startsWith("wf_replace")) {
    // Don't throw - let the backend handle it with its own env var
    console.warn(
      "VITE_CHATKIT_WORKFLOW_ID not set at build time. " +
      "The backend will use CHATKIT_WORKFLOW_ID or VITE_CHATKIT_WORKFLOW_ID from its environment."
    );
    return null;
  }
  return id;
})();

export function createClientSecretFetcher(
  workflow: string | null,
  endpoint = "/api/create-session"
) {
  return async (currentSecret: string | null) => {
    if (currentSecret) return currentSecret;

    // Build request body - only include workflow if we have an ID
    const body: Record<string, unknown> = {};
    if (workflow) {
      body.workflow = { id: workflow };
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      client_secret?: string;
      error?: string;
    };

    if (!response.ok) {
      throw new Error(payload.error ?? "Failed to create session");
    }

    if (!payload.client_secret) {
      throw new Error("Missing client secret in response");
    }

    return payload.client_secret;
  };
}

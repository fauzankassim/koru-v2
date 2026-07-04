import OpenAI from "openai";

interface AgentProvider {
  name: string;
  client: OpenAI;
  model: string;
}

// Add more providers here as you get keys for them. Order matters —
// first provider in the list is tried first; later ones are fallbacks.
// All of these expose an OpenAI-compatible /chat/completions endpoint,
// so we can reuse the same `openai` SDK for all of them.
function buildProviders(): AgentProvider[] {
  const providers: AgentProvider[] = [];

  if (process.env.GROQ_API_KEY) {
    providers.push({
      name: "groq",
      client: new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
      }),
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    });
  }

  if (process.env.OPENROUTER_API_KEY) {
    providers.push({
      name: "openrouter",
      client: new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      }),
      model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
    });
  }

  if (process.env.CEREBRAS_API_KEY) {
    providers.push({
      name: "cerebras",
      client: new OpenAI({
        apiKey: process.env.CEREBRAS_API_KEY,
        baseURL: "https://api.cerebras.ai/v1",
      }),
      model: process.env.CEREBRAS_MODEL || "llama-3.3-70b",
    });
  }

  if (process.env.GEMINI_API_KEY) {
    providers.push({
      name: "gemini",
      client: new OpenAI({
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      }),
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });
  }
  return providers;
}

// Detects "this provider is out of quota / rate-limited right now" errors,
// as opposed to real bugs (bad prompt, malformed request, auth issues)
// which should surface immediately instead of silently failing over.
function isQuotaError(err: unknown): boolean {
  const status = (err as { status?: number })?.status;
  if (status === 429 || status === 402) return true;

  const message = err instanceof Error ? err.message.toLowerCase() : "";
  return (
    message.includes("rate limit") ||
    message.includes("quota") ||
    message.includes("insufficient_quota") ||
    message.includes("too many requests")
  );
}

/**
 * Calls the first available provider, and falls over to the next one
 * only on quota/rate-limit errors. Only one provider is ever active
 * per call — this is sequential fallback, not parallel racing.
 */
export async function generateJSON<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const providers = buildProviders();
  if (providers.length === 0) {
    throw new Error(
      "No AI provider configured. Set at least GROQ_API_KEY in your .env.local."
    );
  }

  let lastError: unknown;

  for (const provider of providers) {
    try {
      const completion = await provider.client.chat.completions.create({
        model: provider.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const raw = completion.choices[0]?.message?.content;
      if (!raw) throw new Error(`Empty response from ${provider.name}`);

      try {
        return JSON.parse(raw) as T;
      } catch {
        throw new Error(`${provider.name} returned invalid JSON: ${raw.slice(0, 200)}`);
      }
    } catch (err) {
      lastError = err;
      if (isQuotaError(err)) {
        console.warn(`[agent] ${provider.name} is out of quota, falling back to next provider…`);
        continue;
      }
      // Non-quota error — don't mask it by trying other providers.
      throw err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("All configured AI providers failed.");
}
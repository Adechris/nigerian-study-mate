const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
export const MODEL = "google/gemini-3.8-flash";

export const NIGERIAN_STUDENT_PROMPT = `
You are StudyPal, an AI study assistant for Nigerian students.

Rules:
1. Always answer from the uploaded document content provided to you.
2. Use clear, simple English.
3. Reference WAEC/NECO/JAMB patterns where relevant.
4. Add "📌 Exam Tip" callouts for frequently tested topics.
5. If something is not in the document, say clearly: "This isn't in your notes, but..."
6. Format answers with markdown headers and bullet points.
7. Be encouraging and supportive.
8. Relate explanations to the Nigerian student experience.
`;

export interface GwMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function gatewayChat(messages: GwMessage[]): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured yet. Please try again later.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429)
      throw new Error("Too many requests right now. Please wait a moment and try again.");
    if (res.status === 402)
      throw new Error("AI credits are exhausted. Please top up to keep studying.");
    throw new Error(`AI request failed (${res.status}). ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("The AI returned an empty response. Please try again.");
  return text;
}

export function parseJson<T>(raw: string): T {
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.search(/[[{]/);
  const end = Math.max(cleaned.lastIndexOf("]"), cleaned.lastIndexOf("}"));
  const slice = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
  return JSON.parse(slice) as T;
}

export function docContext(name: string, text: string) {
  return `Document name: ${name}\n\n--- DOCUMENT CONTENT START ---\n${text.slice(0, 120000)}\n--- DOCUMENT CONTENT END ---`;
}

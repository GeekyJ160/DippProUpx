import { createServerFn } from "@tanstack/react-start";

export type DippyTurn = { role: "user" | "assistant"; text: string };

export type DippyInput = {
  message: string;
  history: DippyTurn[];
  bpm: number;
  key: string | null;
  genre: string;
  mood: string;
  lyrics: string;
};

export type DippyResult = { ok: true; text: string } | { ok: false; error: string };

export const askDippy = createServerFn({ method: "POST" })
  .validator((input: DippyInput): DippyInput => {
    const message = input.message.trim().slice(0, 2000);
    return {
      message,
      bpm: input.bpm,
      key: input.key,
      genre: input.genre,
      mood: input.mood,
      lyrics: (input.lyrics ?? "").slice(0, 1500),
      history: (input.history ?? []).slice(-8).map((turn) => ({
        role: turn.role === "user" ? "user" : "assistant",
        text: turn.text.slice(0, 2000),
      })),
    };
  })
  .handler(async ({ data }): Promise<DippyResult> => {
    if (!data.message) return { ok: false, error: "Say something first" };

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "Dippy is not available right now" };

    const pocket = [data.genre, data.mood, `${data.bpm} BPM`, data.key ? `key ${data.key}` : null]
      .filter(Boolean)
      .join(", ");

    const system = `You are Dippy, the producer inside DIPP PRO.
Answer in short, concrete production and songwriting advice.
Current session: ${pocket}.
Current lyrics, if any:
${data.lyrics.trim() || "(none yet)"}
If they ask for a hook or lines, write performable lyrics with a [Hook] header and nothing else.
Otherwise stay under 120 words. No markdown fences. Do not claim you heard their audio file.`;

    const messages = [
      { role: "system", content: system },
      ...data.history.map((turn) => ({ role: turn.role, content: turn.text })),
      { role: "user", content: data.message },
    ];

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 400,
        temperature: 0.7,
        messages,
      }),
    });

    if (!res.ok) return { ok: false, error: `Dippy could not answer (${res.status})` };

    const body = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    const text = (body.choices[0]?.message.content ?? "").trim();
    if (!text) return { ok: false, error: "Dippy sent an empty reply" };
    return { ok: true, text };
  });

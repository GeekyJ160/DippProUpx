import { createServerFn } from "@tanstack/react-start";

export const VOICES = [
  { id: "eve", label: "Eve" },
  { id: "leo", label: "Leo" },
  { id: "ara", label: "Ara" },
  { id: "luna", label: "Luna" },
  { id: "orion", label: "Orion" },
  { id: "sal", label: "Sal" },
  { id: "rex", label: "Rex" },
  { id: "aurora", label: "Aurora" },
] as const;

export type VoiceResult =
  | { ok: true; mime: string; b64: string }
  | { ok: false; error: string };

export const synthesizeCover = createServerFn({ method: "POST" })
  .validator((input: { text: string; voiceId: string }) => input)
  .handler(async ({ data }): Promise<VoiceResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "AI is not available right now" };

    const text = data.text.trim().slice(0, 480);
    if (!text) return { ok: false, error: "No lyrics to sing" };

    const allowed = VOICES.map((v) => v.id) as readonly string[];
    const voiceId = allowed.includes(data.voiceId) ? data.voiceId : "eve";

    const res = await fetch("https://api.x.ai/v1/tts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, voice_id: voiceId, language: "en" }),
    });

    if (!res.ok) return { ok: false, error: `Voice API error ${res.status}` };

    const buf = Buffer.from(await res.arrayBuffer());
    if (!buf.length) return { ok: false, error: "Empty voice response" };
    const mime = res.headers.get("content-type") ?? "audio/mpeg";
    return { ok: true, mime, b64: buf.toString("base64") };
  });

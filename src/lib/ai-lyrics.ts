import { createServerFn } from "@tanstack/react-start";

export const GENRES = [
  "Hip-Hop",
  "Trap",
  "R&B",
  "Melodic Rap",
  "Afrobeats",
  "Pop",
  "Rock",
  "Jazz",
  "Country",
  "Electronic",
] as const;

export const MOODS = [
  "Triumphant",
  "Emotional",
  "Aggressive",
  "Romantic",
  "Dark",
  "Celebratory",
] as const;

export const LENGTHS = [
  { value: "8", label: "8 bars" },
  { value: "16", label: "16 bars" },
  { value: "32", label: "Full song" },
] as const;

export type LyricInput = {
  topic: string;
  genre: string;
  mood: string;
  length: string;
  photoDataUrl?: string | null;
  mode?: "full" | "hook" | "verse" | "rewrite";
  existing?: string;
  bpm?: number | null;
  key?: string | null;
  writingToBeat?: boolean;
};

export type LyricResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

type ChatContent =
  | string
  | Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } }
    >;

async function callGrok(system: string, user: ChatContent): Promise<LyricResult> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "AI is not available right now" };
  }

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      max_tokens: 900,
      temperature: 0.9,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    return { ok: false, error: `xAI API error ${res.status}` };
  }

  const body = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  const text = (body.choices[0]?.message.content ?? "").trim();
  if (!text) return { ok: false, error: "Empty response from the model" };
  return { ok: true, text };
}

function lengthGuide(len: string): string {
  if (len === "8") return "Write about 8 bars (8 lyric lines plus a short hook).";
  if (len === "32") {
    return "Write a full song: Title, Verse 1, Pre-Chorus, Chorus, Verse 2, Bridge, Chorus.";
  }
  return "Write about 16 bars: Title, Verse 1, Pre-Chorus, Chorus, Verse 2.";
}

function pocketGuide(data: LyricInput): string {
  const parts: string[] = [];
  if (data.bpm) parts.push(`${data.bpm} BPM`);
  if (data.key) parts.push(`key of ${data.key}`);
  if (!parts.length) return "";
  const pocket = parts.join(", ");
  if (data.writingToBeat) {
    return `Write to this instrumental: ${pocket}. Cadence, line length, and stress must sit in that ${data.bpm ?? ""} BPM ${data.genre} pocket — the performer will rap or sing over this beat. Count bars tightly to the requested length.`;
  }
  return `Target pocket: ${pocket}.`;
}

const SYSTEM = `You are a professional songwriter for DIPP PRO RhymeForge.
Write original, performable lyrics. No explanations, no markdown fences.
Use section headers like [Title], [Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Bridge], [Hook].
Favor multi-syllable rhymes, concrete images, and a singable cadence.
Keep language clean enough to perform live. Do not mention being an AI.`;

export const generateLyrics = createServerFn({ method: "POST" })
  .validator((input: LyricInput) => input)
  .handler(async ({ data }): Promise<LyricResult> => {
    const mode = data.mode ?? "full";
    const topic = data.topic.trim() || "building something from nothing";
    const pocket = pocketGuide(data);
    let instruction = "";

    if (mode === "hook") {
      instruction = `Write a 4–8 line [Hook] / [Chorus] only. Genre: ${data.genre}. Mood: ${data.mood}. ${pocket} Subject: ${topic}`;
    } else if (mode === "verse") {
      instruction = `Write one new [Verse] (8 lines) that continues this draft. Genre: ${data.genre}. Mood: ${data.mood}. ${pocket}\n\nExisting draft:\n${data.existing ?? topic}`;
    } else if (mode === "rewrite") {
      instruction = `Rewrite these lyrics for denser multi-syllable rhymes and tighter flow. Keep the meaning and section structure. Genre: ${data.genre}. Mood: ${data.mood}. ${pocket}\n\n${data.existing ?? topic}`;
    } else {
      instruction = `Write original ${data.genre} lyrics. Mood: ${data.mood}. ${lengthGuide(data.length)} ${pocket}\nSubject / story:\n${topic}`;
    }

    const user: ChatContent = data.photoDataUrl
      ? [
          {
            type: "text",
            text: `${instruction}\n\nA photo is attached for visual inspiration — fold its mood, colors, and setting into the imagery.`,
          },
          { type: "image_url", image_url: { url: data.photoDataUrl } },
        ]
      : instruction;

    return callGrok(SYSTEM, user);
  });

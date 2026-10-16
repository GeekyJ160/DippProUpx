import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-lyrics-BWwWlNq4.js
async function callGrok(system, user) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available right now"
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 900,
			temperature: .9,
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: user
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI API error ${res.status}`
	};
	const text = ((await res.json()).choices[0]?.message.content ?? "").trim();
	if (!text) return {
		ok: false,
		error: "Empty response from the model"
	};
	return {
		ok: true,
		text
	};
}
function lengthGuide(len) {
	if (len === "8") return "Write about 8 bars (8 lyric lines plus a short hook).";
	if (len === "32") return "Write a full song: Title, Verse 1, Pre-Chorus, Chorus, Verse 2, Bridge, Chorus.";
	return "Write about 16 bars: Title, Verse 1, Pre-Chorus, Chorus, Verse 2.";
}
function pocketGuide(data) {
	const parts = [];
	if (data.bpm) parts.push(`${data.bpm} BPM`);
	if (data.key) parts.push(`key of ${data.key}`);
	if (!parts.length) return "";
	const pocket = parts.join(", ");
	if (data.writingToBeat) return `Write to this instrumental: ${pocket}. Cadence, line length, and stress must sit in that ${data.bpm ?? ""} BPM ${data.genre} pocket — the performer will rap or sing over this beat. Count bars tightly to the requested length.`;
	return `Target pocket: ${pocket}.`;
}
var SYSTEM = `You are a professional songwriter for DIPP PRO RhymeForge.
Write original, performable lyrics. No explanations, no markdown fences.
Use section headers like [Title], [Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Bridge], [Hook].
Favor multi-syllable rhymes, concrete images, and a singable cadence.
Keep language clean enough to perform live. Do not mention being an AI.`;
var generateLyrics_createServerFn_handler = createServerRpc({
	id: "15bbdc1540f83a212fb8796a31cac10525c17bd63208bf3eca0bece0ac717e39",
	name: "generateLyrics",
	filename: "src/lib/ai-lyrics.ts"
}, (opts) => generateLyrics.__executeServer(opts));
var generateLyrics = createServerFn({ method: "POST" }).validator((input) => input).handler(generateLyrics_createServerFn_handler, async ({ data }) => {
	const mode = data.mode ?? "full";
	const topic = data.topic.trim() || "building something from nothing";
	const pocket = pocketGuide(data);
	let instruction = "";
	if (mode === "hook") instruction = `Write a 4–8 line [Hook] / [Chorus] only. Genre: ${data.genre}. Mood: ${data.mood}. ${pocket} Subject: ${topic}`;
	else if (mode === "verse") instruction = `Write one new [Verse] (8 lines) that continues this draft. Genre: ${data.genre}. Mood: ${data.mood}. ${pocket}\n\nExisting draft:\n${data.existing ?? topic}`;
	else if (mode === "rewrite") instruction = `Rewrite these lyrics for denser multi-syllable rhymes and tighter flow. Keep the meaning and section structure. Genre: ${data.genre}. Mood: ${data.mood}. ${pocket}\n\n${data.existing ?? topic}`;
	else instruction = `Write original ${data.genre} lyrics. Mood: ${data.mood}. ${lengthGuide(data.length)} ${pocket}\nSubject / story:\n${topic}`;
	return callGrok(SYSTEM, data.photoDataUrl ? [{
		type: "text",
		text: `${instruction}\n\nA photo is attached for visual inspiration — fold its mood, colors, and setting into the imagery.`
	}, {
		type: "image_url",
		image_url: { url: data.photoDataUrl }
	}] : instruction);
});
//#endregion
export { generateLyrics_createServerFn_handler };

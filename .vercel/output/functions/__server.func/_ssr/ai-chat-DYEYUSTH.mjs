import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-chat-DYEYUSTH.js
var askDippy_createServerFn_handler = createServerRpc({
	id: "faa9e3877374fcae5276cff1b127004e96b661fc19a475e9cb1558fdecc4b768",
	name: "askDippy",
	filename: "src/lib/ai-chat.ts"
}, (opts) => askDippy.__executeServer(opts));
var askDippy = createServerFn({ method: "POST" }).validator((input) => {
	return {
		message: input.message.trim().slice(0, 2e3),
		bpm: input.bpm,
		key: input.key,
		genre: input.genre,
		mood: input.mood,
		lyrics: (input.lyrics ?? "").slice(0, 1500),
		history: (input.history ?? []).slice(-8).map((turn) => ({
			role: turn.role === "user" ? "user" : "assistant",
			text: turn.text.slice(0, 2e3)
		}))
	};
}).handler(askDippy_createServerFn_handler, async ({ data }) => {
	if (!data.message) return {
		ok: false,
		error: "Say something first"
	};
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Dippy is not available right now"
	};
	const messages = [
		{
			role: "system",
			content: `You are Dippy, the producer inside DIPP PRO.
Answer in short, concrete production and songwriting advice.
Current session: ${[
				data.genre,
				data.mood,
				`${data.bpm} BPM`,
				data.key ? `key ${data.key}` : null
			].filter(Boolean).join(", ")}.
Current lyrics, if any:
${data.lyrics.trim() || "(none yet)"}
If they ask for a hook or lines, write performable lyrics with a [Hook] header and nothing else.
Otherwise stay under 120 words. No markdown fences. Do not claim you heard their audio file.`
		},
		...data.history.map((turn) => ({
			role: turn.role,
			content: turn.text
		})),
		{
			role: "user",
			content: data.message
		}
	];
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 400,
			temperature: .7,
			messages
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Dippy could not answer (${res.status})`
	};
	const text = ((await res.json()).choices[0]?.message.content ?? "").trim();
	if (!text) return {
		ok: false,
		error: "Dippy sent an empty reply"
	};
	return {
		ok: true,
		text
	};
});
//#endregion
export { askDippy_createServerFn_handler };

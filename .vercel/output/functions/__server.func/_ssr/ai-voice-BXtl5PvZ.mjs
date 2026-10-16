import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-voice-BXtl5PvZ.js
var VOICES = [
	{
		id: "eve",
		label: "Eve"
	},
	{
		id: "leo",
		label: "Leo"
	},
	{
		id: "ara",
		label: "Ara"
	},
	{
		id: "luna",
		label: "Luna"
	},
	{
		id: "orion",
		label: "Orion"
	},
	{
		id: "sal",
		label: "Sal"
	},
	{
		id: "rex",
		label: "Rex"
	},
	{
		id: "aurora",
		label: "Aurora"
	}
];
var synthesizeCover_createServerFn_handler = createServerRpc({
	id: "7887e3622fe4c444a6d87ede238fd49f63e5fc4f9a37f32cfd6a4b67199d2352",
	name: "synthesizeCover",
	filename: "src/lib/ai-voice.ts"
}, (opts) => synthesizeCover.__executeServer(opts));
var synthesizeCover = createServerFn({ method: "POST" }).validator((input) => input).handler(synthesizeCover_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available right now"
	};
	const text = data.text.trim().slice(0, 480);
	if (!text) return {
		ok: false,
		error: "No lyrics to sing"
	};
	const voiceId = VOICES.map((v) => v.id).includes(data.voiceId) ? data.voiceId : "eve";
	const res = await fetch("https://api.x.ai/v1/tts", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			text,
			voice_id: voiceId,
			language: "en"
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Voice API error ${res.status}`
	};
	const buf = Buffer.from(await res.arrayBuffer());
	if (!buf.length) return {
		ok: false,
		error: "Empty voice response"
	};
	return {
		ok: true,
		mime: res.headers.get("content-type") ?? "audio/mpeg",
		b64: buf.toString("base64")
	};
});
//#endregion
export { synthesizeCover_createServerFn_handler };

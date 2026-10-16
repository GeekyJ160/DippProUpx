import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { i as signOut, t as authClient } from "./client-B40BzJxt.mjs";
import { a as hasGateSessionMarker } from "./server-CZwn7wUB.mjs";
import { C as ImagePlus, E as ChevronRight, S as Library, T as Download, _ as Pause, b as MicVocal, c as Sparkles, d as Scissors, f as Save, g as PenLine, h as Play, i as Upload, l as Share2, m as Plus, n as Waves, o as Trash2, p as RefreshCw, r as Volume2, s as Square, t as X, u as Send, v as Music2, w as Heart, x as MicOff, y as Mic } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as authMiddleware } from "./middleware-DJv7xoix.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BtXMuwbn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function AuthSlot() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-11 w-20 animate-pulse rounded-md bg-elevated" });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/login",
		className: "inline-flex h-11 items-center rounded-md border border-border bg-elevated px-4 text-sm font-medium",
		children: "Sign in"
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
var synthesizeCover = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("7887e3622fe4c444a6d87ede238fd49f63e5fc4f9a37f32cfd6a4b67199d2352"));
function estimateBpm(buffer) {
	const data = buffer.getChannelData(0);
	const sr = buffer.sampleRate;
	const hop = Math.floor(sr * .01);
	const energy = [];
	for (let i = 0; i + hop < data.length; i += hop) {
		let sum = 0;
		for (let j = 0; j < hop; j++) sum += Math.abs(data[i + j]);
		energy.push(sum / hop);
	}
	const flux = [0];
	for (let i = 1; i < energy.length; i++) flux.push(Math.max(0, energy[i] - energy[i - 1]));
	const mean = flux.reduce((a, b) => a + b, 0) / flux.length;
	const peaks = [];
	for (let i = 1; i < flux.length - 1; i++) if (flux[i] > flux[i - 1] && flux[i] > flux[i + 1] && flux[i] > mean * 1.4) peaks.push(i);
	const gaps = peaks.slice(1).map((p, i) => (p - peaks[i]) * .01).filter((x) => x > .25 && x < 1.6);
	if (!gaps.length) return {
		bpm: 120,
		confidence: .2
	};
	const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
	let bpm = Math.round(60 / avg);
	while (bpm < 70) bpm *= 2;
	while (bpm > 180) bpm = Math.round(bpm / 2);
	const confidence = Math.min(1, gaps.length / 40);
	return {
		bpm,
		confidence
	};
}
var NOTE_NAMES = [
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B"
];
function estimateKey(buffer) {
	const data = buffer.getChannelData(0);
	const sr = buffer.sampleRate;
	const bins = new Array(12).fill(0);
	const step = Math.max(1, Math.floor(data.length / 8e3));
	const window = 2048;
	for (let start = 0; start + window < data.length; start += window * 4) {
		let bestLag = 0;
		let best = 0;
		const minLag = Math.floor(sr / 800);
		const maxLag = Math.floor(sr / 70);
		for (let lag = minLag; lag < maxLag; lag += 2) {
			let corr = 0;
			for (let i = 0; i < window; i += step) corr += data[start + i] * data[start + i + lag];
			if (corr > best) {
				best = corr;
				bestLag = lag;
			}
		}
		if (!bestLag) continue;
		const freq = sr / bestLag;
		const midi = Math.round(69 + 12 * Math.log2(freq / 440));
		bins[(midi % 12 + 12) % 12] += 1;
	}
	let root = 0;
	for (let i = 1; i < 12; i++) if (bins[i] > bins[root]) root = i;
	const majorThird = bins[(root + 4) % 12];
	return bins[(root + 3) % 12] > majorThird ? `${NOTE_NAMES[root]}m` : NOTE_NAMES[root];
}
function analyzeBeat(buffer) {
	const tempo = estimateBpm(buffer);
	const key = estimateKey(buffer);
	const bpm = tempo.bpm;
	const minor = /m$/.test(key);
	let genre = "Hip-Hop";
	if (bpm < 82) genre = "R&B";
	else if (bpm < 100) genre = "Hip-Hop";
	else if (bpm < 110) genre = "Melodic Rap";
	else if (bpm < 118) genre = "Afrobeats";
	else if (bpm < 130) genre = "Pop";
	else if (bpm < 150) genre = "Trap";
	else genre = "Electronic";
	let mood = "Triumphant";
	if (minor && bpm >= 120) mood = "Aggressive";
	else if (minor && bpm < 90) mood = "Emotional";
	else if (minor) mood = "Dark";
	else if (bpm >= 125) mood = "Celebratory";
	else if (bpm < 90) mood = "Romantic";
	return {
		bpm,
		confidence: tempo.confidence,
		key,
		genre,
		mood,
		duration: buffer.duration
	};
}
function centerCancel(buffer) {
	const out = new OfflineAudioContext(2, buffer.length, buffer.sampleRate).createBuffer(2, buffer.length, buffer.sampleRate);
	const l = buffer.getChannelData(0);
	const r = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : buffer.getChannelData(0);
	const x = out.getChannelData(0);
	const y = out.getChannelData(1);
	for (let i = 0; i < buffer.length; i++) {
		const v = (l[i] - r[i]) * .72;
		x[i] = v;
		y[i] = v;
	}
	return out;
}
function bufferToWav(buffer) {
	const ch = buffer.numberOfChannels;
	const n = buffer.length;
	const ab = /* @__PURE__ */ new ArrayBuffer(44 + n * ch * 2);
	const v = new DataView(ab);
	let p = 0;
	const w = (s) => {
		for (const c of s) v.setUint8(p++, c.charCodeAt(0));
	};
	const u32 = (x) => {
		v.setUint32(p, x, true);
		p += 4;
	};
	const u16 = (x) => {
		v.setUint16(p, x, true);
		p += 2;
	};
	w("RIFF");
	u32(36 + n * ch * 2);
	w("WAVEfmt ");
	u32(16);
	u16(1);
	u16(ch);
	u32(buffer.sampleRate);
	u32(buffer.sampleRate * ch * 2);
	u16(ch * 2);
	u16(16);
	w("data");
	u32(n * ch * 2);
	for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) {
		const x = Math.max(-1, Math.min(1, buffer.getChannelData(c)[i]));
		v.setInt16(p, x < 0 ? x * 32768 : x * 32767, true);
		p += 2;
	}
	return new Blob([ab], { type: "audio/wav" });
}
function freqToNote(freq) {
	if (freq < 50 || freq > 2e3) return {
		name: "—",
		midi: -1
	};
	const midi = Math.round(69 + 12 * Math.log2(freq / 440));
	return {
		name: NOTE_NAMES[(midi % 12 + 12) % 12],
		midi
	};
}
function detectPitch(samples, sampleRate) {
	const minLag = Math.floor(sampleRate / 900);
	const maxLag = Math.floor(sampleRate / 70);
	let bestLag = 0;
	let best = 0;
	for (let lag = minLag; lag < maxLag; lag++) {
		let corr = 0;
		for (let i = 0; i < samples.length - lag; i++) corr += samples[i] * samples[i + lag];
		if (corr > best) {
			best = corr;
			bestLag = lag;
		}
	}
	if (!bestLag || best < .01) return 0;
	return sampleRate / bestLag;
}
function trimBuffer(buffer, startPct, endPct) {
	const a = Math.max(0, Math.min(1, startPct));
	const b = Math.max(a + .02, Math.min(1, endPct));
	const start = Math.floor(buffer.length * a);
	const end = Math.floor(buffer.length * b);
	const len = Math.max(1, end - start);
	const out = new OfflineAudioContext(buffer.numberOfChannels, len, buffer.sampleRate).createBuffer(buffer.numberOfChannels, len, buffer.sampleRate);
	for (let c = 0; c < buffer.numberOfChannels; c++) out.getChannelData(c).set(buffer.getChannelData(c).subarray(start, start + len));
	return out;
}
function reduceNoise(buffer) {
	const out = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate).createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
	const thresh = .018;
	for (let c = 0; c < buffer.numberOfChannels; c++) {
		const src = buffer.getChannelData(c);
		const dst = out.getChannelData(c);
		let prev = 0;
		for (let i = 0; i < src.length; i++) {
			const hp = src[i] - prev * .97;
			prev = src[i];
			const a = Math.abs(hp);
			dst[i] = a < thresh ? hp * (a / thresh) * .35 : hp;
		}
	}
	return out;
}
function addEcho(buffer, delayMs = 280, mix = .32) {
	const delay = Math.floor(delayMs / 1e3 * buffer.sampleRate);
	const out = new OfflineAudioContext(buffer.numberOfChannels, buffer.length + delay, buffer.sampleRate).createBuffer(buffer.numberOfChannels, buffer.length + delay, buffer.sampleRate);
	for (let c = 0; c < buffer.numberOfChannels; c++) {
		const src = buffer.getChannelData(c);
		const dst = out.getChannelData(c);
		dst.set(src);
		for (let i = 0; i < src.length; i++) dst[i + delay] += src[i] * mix;
	}
	return out;
}
async function mixOntoTrack(bedUrl, vocalBlob, vocalGain = .82) {
	const ac = new AudioContext();
	const bed = await ac.decodeAudioData(await (await fetch(bedUrl)).arrayBuffer());
	const vocal = await ac.decodeAudioData(await vocalBlob.arrayBuffer());
	const sr = ac.sampleRate;
	const length = Math.max(bed.length, vocal.length);
	const offline = new OfflineAudioContext(2, length, sr);
	const bedSrc = offline.createBufferSource();
	bedSrc.buffer = bed;
	const bedGain = offline.createGain();
	bedGain.gain.value = .92;
	bedSrc.connect(bedGain);
	bedGain.connect(offline.destination);
	bedSrc.start(0);
	const vSrc = offline.createBufferSource();
	vSrc.buffer = vocal;
	const g = offline.createGain();
	g.gain.value = vocalGain;
	vSrc.connect(g);
	g.connect(offline.destination);
	vSrc.start(0);
	const out = await offline.startRendering();
	await ac.close();
	return URL.createObjectURL(bufferToWav(out));
}
function b64ToBlob(b64, mime) {
	const bin = atob(b64);
	const bytes = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
	return new Blob([bytes], { type: mime });
}
var DEFAULT_MIX = {
	gains: {
		drums: 82,
		bass: 74,
		harmony: 58,
		lead: 48,
		vocals: 86
	},
	mute: {
		drums: false,
		bass: false,
		harmony: false,
		lead: false,
		vocals: false
	},
	solo: null
};
var NOTE_INDEX = {
	C: 0,
	"C#": 1,
	Db: 1,
	D: 2,
	"D#": 3,
	Eb: 3,
	E: 4,
	F: 5,
	"F#": 6,
	Gb: 6,
	G: 7,
	"G#": 8,
	Ab: 8,
	A: 9,
	"A#": 10,
	Bb: 10,
	B: 11
};
var GENRE_BPM = {
	"Hip-Hop": 92,
	Trap: 140,
	"R&B": 86,
	"Melodic Rap": 98,
	Afrobeats: 112,
	Pop: 118,
	Rock: 128,
	Jazz: 102,
	Country: 108,
	Electronic: 124
};
var MOOD_PROG = {
	Triumphant: [
		[
			0,
			4,
			7
		],
		[
			7,
			11,
			14
		],
		[
			9,
			12,
			16
		],
		[
			5,
			9,
			12
		]
	],
	Emotional: [
		[
			9,
			12,
			16
		],
		[
			5,
			9,
			12
		],
		[
			0,
			4,
			7
		],
		[
			7,
			11,
			14
		]
	],
	Aggressive: [
		[
			0,
			3,
			7
		],
		[
			8,
			12,
			15
		],
		[
			10,
			14,
			17
		],
		[
			0,
			3,
			7
		]
	],
	Romantic: [
		[
			0,
			4,
			7
		],
		[
			9,
			12,
			16
		],
		[
			5,
			9,
			12
		],
		[
			7,
			11,
			14
		]
	],
	Dark: [
		[
			0,
			3,
			7
		],
		[
			5,
			8,
			12
		],
		[
			8,
			12,
			15
		],
		[
			7,
			10,
			14
		]
	],
	Celebratory: [
		[
			0,
			4,
			7
		],
		[
			5,
			9,
			12
		],
		[
			7,
			11,
			14
		],
		[
			0,
			4,
			7
		]
	]
};
function midiToHz(m) {
	return 440 * 2 ** ((m - 69) / 12);
}
function envGain(ctx, t, a, d, peak) {
	const g = ctx.createGain();
	g.gain.setValueAtTime(1e-4, t);
	g.gain.exponentialRampToValueAtTime(peak, t + a);
	g.gain.exponentialRampToValueAtTime(1e-4, t + a + d);
	return g;
}
function noiseBuffer(ctx, seconds) {
	const n = Math.floor(ctx.sampleRate * seconds);
	const buf = ctx.createBuffer(1, n, ctx.sampleRate);
	const d = buf.getChannelData(0);
	for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
	return buf;
}
function drumPattern(genre) {
	if (genre === "Trap") return {
		kick: [
			1,
			0,
			0,
			0,
			0,
			0,
			1,
			0,
			1,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		],
		snare: [
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			1
		],
		hat: [
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1
		]
	};
	if (genre === "Afrobeats") return {
		kick: [
			1,
			0,
			0,
			1,
			0,
			0,
			1,
			0,
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0
		],
		snare: [
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0
		],
		hat: [
			1,
			0,
			1,
			1,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			1,
			1,
			0,
			1,
			0
		]
	};
	if (genre === "Rock" || genre === "Electronic") return {
		kick: [
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0
		],
		snare: [
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0
		],
		hat: genre === "Electronic" ? [
			0,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			1,
			0
		] : [
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0
		]
	};
	if (genre === "Jazz" || genre === "R&B") return {
		kick: [
			1,
			0,
			0,
			1,
			0,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			1,
			0,
			0
		],
		snare: [
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0
		],
		hat: [
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			1,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0
		]
	};
	return {
		kick: [
			1,
			0,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			1,
			0,
			0
		],
		snare: [
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0
		],
		hat: [
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			1
		]
	};
}
function makeArrangement(genre, mood, length, keyName, bpmOverride) {
	const bpm = bpmOverride && bpmOverride > 40 ? Math.round(bpmOverride) : GENRE_BPM[genre] ?? 120;
	const bars = length === "8" ? 8 : length === "32" ? 32 : 16;
	const minor = /Aggressive|Dark|Emotional/.test(mood) || /m$/.test(keyName ?? "");
	let root = 57;
	if (keyName) {
		const idx = NOTE_INDEX[keyName.replace("m", "")];
		if (idx != null) root = 48 + idx;
	}
	return {
		bpm,
		root,
		minor,
		bars,
		genre,
		mood,
		swing: genre === "Jazz" || genre === "R&B" ? .18 : genre === "Hip-Hop" ? .08 : 0
	};
}
function arrangementKey(a) {
	const n = [
		"C",
		"C#",
		"D",
		"D#",
		"E",
		"F",
		"F#",
		"G",
		"G#",
		"A",
		"A#",
		"B"
	][(a.root % 12 + 12) % 12];
	return a.minor ? `${n}m` : n;
}
function mixGain(mix, id) {
	if (mix.mute[id]) return 0;
	if (mix.solo && mix.solo !== id) return 0;
	return mix.gains[id] / 100;
}
function scheduleKick(ctx, dest, t, vel) {
	const osc = ctx.createOscillator();
	osc.type = "sine";
	osc.frequency.setValueAtTime(160, t);
	osc.frequency.exponentialRampToValueAtTime(42, t + .12);
	const g = envGain(ctx, t, .004, .22, .9 * vel);
	osc.connect(g);
	g.connect(dest);
	osc.start(t);
	osc.stop(t + .28);
}
function scheduleSnare(ctx, dest, noise, t, vel) {
	const src = ctx.createBufferSource();
	src.buffer = noise;
	const hp = ctx.createBiquadFilter();
	hp.type = "highpass";
	hp.frequency.value = 900;
	const g = envGain(ctx, t, .002, .12, .35 * vel);
	src.connect(hp);
	hp.connect(g);
	g.connect(dest);
	src.start(t);
	src.stop(t + .16);
	const tone = ctx.createOscillator();
	tone.type = "triangle";
	tone.frequency.value = 190;
	const tg = envGain(ctx, t, .002, .1, .18 * vel);
	tone.connect(tg);
	tg.connect(dest);
	tone.start(t);
	tone.stop(t + .14);
}
function scheduleHat(ctx, dest, noise, t, vel) {
	const src = ctx.createBufferSource();
	src.buffer = noise;
	const hp = ctx.createBiquadFilter();
	hp.type = "highpass";
	hp.frequency.value = 7e3;
	const g = envGain(ctx, t, .001, .04, .12 * vel);
	src.connect(hp);
	hp.connect(g);
	g.connect(dest);
	src.start(t);
	src.stop(t + .06);
}
function scheduleBass(ctx, dest, t, hz, dur, vel) {
	const osc = ctx.createOscillator();
	osc.type = "sawtooth";
	osc.frequency.value = hz;
	const filt = ctx.createBiquadFilter();
	filt.type = "lowpass";
	filt.frequency.setValueAtTime(420, t);
	filt.frequency.exponentialRampToValueAtTime(160, t + dur * .8);
	const g = envGain(ctx, t, .01, dur, .28 * vel);
	osc.connect(filt);
	filt.connect(g);
	g.connect(dest);
	osc.start(t);
	osc.stop(t + dur + .02);
}
function scheduleChord(ctx, dest, t, freqs, dur, vel) {
	for (const hz of freqs) {
		const osc = ctx.createOscillator();
		osc.type = "triangle";
		osc.frequency.value = hz;
		const g = envGain(ctx, t, .03, dur * .95, .08 * vel);
		osc.connect(g);
		g.connect(dest);
		osc.start(t);
		osc.stop(t + dur + .04);
	}
}
function scheduleLead(ctx, dest, t, hz, dur, vel) {
	const osc = ctx.createOscillator();
	osc.type = "square";
	osc.frequency.value = hz;
	const filt = ctx.createBiquadFilter();
	filt.type = "lowpass";
	filt.frequency.value = 1800;
	const g = envGain(ctx, t, .008, dur, .07 * vel);
	osc.connect(filt);
	filt.connect(g);
	g.connect(dest);
	osc.start(t);
	osc.stop(t + dur + .02);
}
function stepTime(bpm, swing, step) {
	const six = 60 / bpm / 4;
	return six + (step % 2 === 1 ? six * swing : 0);
}
function scheduleBar(ctx, buses, noise, arr, bar, t0) {
	const prog = MOOD_PROG[arr.mood] ?? MOOD_PROG.Triumphant;
	const chord = prog[bar % prog.length];
	const rootMidi = arr.root;
	const freqs = chord.map((iv) => midiToHz(rootMidi + iv + 12));
	const bassHz = midiToHz(rootMidi + chord[0] % 12 - 12);
	const pat = drumPattern(arr.genre);
	let t = t0;
	const barDur = 60 / arr.bpm * 4;
	scheduleChord(ctx, buses.harmony, t0, freqs, barDur * .92, 1);
	for (let s = 0; s < 16; s++) {
		const dt = stepTime(arr.bpm, arr.swing, s);
		if (pat.kick[s]) scheduleKick(ctx, buses.drums, t, s === 0 ? 1 : .78);
		if (pat.snare[s]) scheduleSnare(ctx, buses.drums, noise, t, .9);
		if (pat.hat[s]) scheduleHat(ctx, buses.drums, noise, t, s % 2 ? .55 : .85);
		if (pat.kick[s]) scheduleBass(ctx, buses.bass, t, bassHz, dt * 1.6, 1);
		if (s === 0 || s === 8) {
			const leadIv = chord[(bar + s) % chord.length] + 12;
			scheduleLead(ctx, buses.lead, t, midiToHz(rootMidi + leadIv + 12), dt * 3, 1);
		}
		t += dt;
	}
}
function makeBuses(ctx, mix, master) {
	const buses = {};
	[
		"drums",
		"bass",
		"harmony",
		"lead",
		"vocals"
	].forEach((id) => {
		const g = ctx.createGain();
		g.gain.value = mixGain(mix, id);
		g.connect(master);
		buses[id] = g;
	});
	return buses;
}
function songDuration(arr) {
	return arr.bars * (60 / arr.bpm) * 4;
}
async function bounceArrangement(arr, mix, vocal) {
	const sr = 44100;
	const dur = songDuration(arr);
	const ctx = new OfflineAudioContext(2, Math.ceil(sr * dur), sr);
	const master = ctx.createGain();
	master.gain.value = .9;
	const comp = ctx.createDynamicsCompressor();
	comp.threshold.value = -16;
	comp.ratio.value = 3;
	master.connect(comp);
	comp.connect(ctx.destination);
	const buses = makeBuses(ctx, mix, master);
	const noise = noiseBuffer(ctx, .2);
	const barDur = 60 / arr.bpm * 4;
	for (let b = 0; b < arr.bars; b++) scheduleBar(ctx, buses, noise, arr, b, b * barDur);
	if (vocal && mixGain(mix, "vocals") > 0) {
		const src = ctx.createBufferSource();
		src.buffer = vocal;
		src.connect(buses.vocals);
		src.start(barDur * Math.min(8, Math.max(0, arr.bars - 8)));
	}
	return ctx.startRendering();
}
async function bounceToUrl(arr, mix, vocal) {
	const buf = await bounceArrangement(arr, mix, vocal);
	return URL.createObjectURL(bufferToWav(buf));
}
var LivePlayer = class {
	ctx = null;
	timer = null;
	nextBar = 0;
	nextTime = 0;
	buses = null;
	noise = null;
	playing = false;
	arrangement = null;
	mix = DEFAULT_MIX;
	onBar = null;
	get isPlaying() {
		return this.playing;
	}
	async start(arr, mix) {
		this.stop();
		this.arrangement = arr;
		this.mix = mix;
		const ctx = new AudioContext();
		this.ctx = ctx;
		if (ctx.state === "suspended") await ctx.resume();
		const master = ctx.createGain();
		master.gain.value = .9;
		master.connect(ctx.destination);
		this.buses = makeBuses(ctx, mix, master);
		this.noise = noiseBuffer(ctx, .2);
		this.nextBar = 0;
		this.nextTime = ctx.currentTime + .05;
		this.playing = true;
		this.tick();
	}
	setMix(mix) {
		this.mix = mix;
		if (!this.buses) return;
		Object.keys(this.buses).forEach((id) => {
			this.buses[id].gain.value = mixGain(mix, id);
		});
	}
	stop() {
		this.playing = false;
		if (this.timer != null) window.clearTimeout(this.timer);
		this.timer = null;
		this.ctx?.close();
		this.ctx = null;
		this.buses = null;
	}
	tick = () => {
		if (!this.playing || !this.ctx || !this.arrangement || !this.buses || !this.noise) return;
		const ctx = this.ctx;
		const arr = this.arrangement;
		const barDur = 60 / arr.bpm * 4;
		while (this.nextTime < ctx.currentTime + .35) {
			const bar = this.nextBar % arr.bars;
			scheduleBar(ctx, this.buses, this.noise, arr, bar, this.nextTime);
			this.onBar?.(bar);
			this.nextBar += 1;
			this.nextTime += barDur;
		}
		this.timer = window.setTimeout(this.tick, 80);
	};
};
var livePlayer = new LivePlayer();
function extractSingable(lyrics, maxChars = 420) {
	if (!lyrics.trim()) return "";
	return (lyrics.split(/\n(?=\[)/).find((p) => /\[(chorus|hook)/i.test(p)) ?? lyrics).replace(/\[[^\]]*]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxChars);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-150 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "border border-border bg-elevated text-fg hover:bg-surface",
			ghost: "text-muted hover:bg-elevated hover:text-fg",
			danger: "bg-danger text-fg hover:opacity-90"
		},
		size: {
			default: "h-11 rounded-md px-4 text-sm",
			sm: "h-9 rounded-sm px-3 text-sm",
			lg: "h-12 rounded-lg px-5 text-sm",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl border border-border bg-surface p-5 sm:p-6", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: cn("font-display text-xl font-semibold tracking-tight", className),
		...props
	});
}
function CardDesc({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("mt-1 text-sm text-muted", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium text-muted", className),
		...props
	});
}
var Select = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
	ref,
	className: cn("h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none focus:border-accent", className),
	...props,
	children
}));
Select.displayName = "Select";
var LYRICS_KEY = "dipp_lyrics";
var DRAFT_KEY = "dipp_draft";
var MODE_KEY = "dipp_mode";
function persistDraft(partial) {
	if (typeof window === "undefined") return;
	try {
		const current = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "{}");
		localStorage.setItem(DRAFT_KEY, JSON.stringify({
			...current,
			...partial
		}));
	} catch {}
}
var useStudio = create((set, get) => ({
	mode: "pick",
	tab: "create",
	prompt: "",
	genre: "Hip-Hop",
	mood: "Triumphant",
	length: "16",
	lyrics: "",
	bpm: 92,
	key: null,
	songId: null,
	localId: null,
	title: "Untitled",
	photoDataUrl: null,
	beatUrl: null,
	beatName: null,
	arrangement: null,
	mix: DEFAULT_MIX,
	trackUrl: null,
	vocalUrl: null,
	voiceId: "eve",
	playing: false,
	setMode: (mode) => {
		if (typeof window !== "undefined") localStorage.setItem(MODE_KEY, mode);
		set({
			mode,
			tab: mode === "pick" ? "create" : mode === "studio" ? "daw" : "create"
		});
	},
	setTab: (tab) => set({ tab }),
	setPrompt: (prompt) => {
		persistDraft({ prompt });
		set({ prompt });
	},
	setGenre: (genre) => {
		persistDraft({ genre });
		set({ genre });
	},
	setMood: (mood) => {
		persistDraft({ mood });
		set({ mood });
	},
	setLength: (length) => {
		persistDraft({ length });
		set({ length });
	},
	setLyrics: (lyrics) => {
		if (typeof window !== "undefined") localStorage.setItem(LYRICS_KEY, lyrics);
		persistDraft({ lyrics });
		set({ lyrics });
	},
	setBpm: (bpm) => {
		persistDraft({ bpm });
		set({ bpm });
	},
	setKey: (key) => set({ key }),
	setSongId: (songId) => set({ songId }),
	setLocalId: (localId) => set({ localId }),
	setTitle: (title) => {
		persistDraft({ title });
		set({ title });
	},
	setPhotoDataUrl: (photoDataUrl) => set({ photoDataUrl }),
	setBeat: (beatUrl, beatName) => {
		const prev = get().beatUrl;
		if (prev && prev !== beatUrl) URL.revokeObjectURL(prev);
		set({
			beatUrl,
			beatName
		});
	},
	setArrangement: (arrangement) => set({ arrangement }),
	setMix: (mix) => set({ mix }),
	setTrackUrl: (trackUrl) => set({ trackUrl }),
	setVocalUrl: (vocalUrl) => set({ vocalUrl }),
	setVoiceId: (voiceId) => {
		persistDraft({ voiceId });
		set({ voiceId });
	},
	setPlaying: (playing) => set({ playing }),
	rebuildArrangement: () => {
		const s = get();
		const arr = makeArrangement(s.genre, s.mood, s.length, s.key, s.beatUrl ? s.bpm : null);
		set({
			arrangement: arr,
			bpm: arr.bpm,
			key: s.key ?? arrangementKey(arr)
		});
		return arr;
	},
	loadLocal: () => {
		if (typeof window === "undefined") return;
		try {
			const lyrics = localStorage.getItem(LYRICS_KEY) ?? "";
			const modeRaw = localStorage.getItem(MODE_KEY);
			const mode = modeRaw === "writer" || modeRaw === "studio" ? modeRaw : "pick";
			const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "{}");
			set({
				mode,
				tab: mode === "studio" ? "daw" : "create",
				lyrics: draft.lyrics ?? lyrics,
				prompt: draft.prompt ?? "",
				genre: draft.genre ?? "Hip-Hop",
				mood: draft.mood ?? "Triumphant",
				length: draft.length ?? "16",
				bpm: typeof draft.bpm === "number" ? draft.bpm : 92,
				voiceId: typeof draft.voiceId === "string" ? draft.voiceId : "eve",
				title: typeof draft.title === "string" ? draft.title : "Untitled"
			});
		} catch {}
	},
	applySong: (s) => {
		set({
			songId: s.id,
			localId: null,
			title: s.title,
			lyrics: s.lyrics,
			prompt: s.prompt,
			genre: s.genre,
			mood: s.mood,
			length: s.length,
			bpm: s.bpm ?? 92,
			tab: "lyrics"
		});
		if (typeof window !== "undefined") localStorage.setItem(LYRICS_KEY, s.lyrics);
	},
	applyLocal: (s) => {
		set({
			songId: null,
			localId: s.id,
			title: s.title,
			lyrics: s.lyrics,
			prompt: s.prompt,
			genre: s.genre,
			mood: s.mood,
			length: s.length,
			bpm: s.bpm ?? 92,
			tab: "lyrics"
		});
		if (typeof window !== "undefined") localStorage.setItem(LYRICS_KEY, s.lyrics);
	}
}));
function CoverPanel() {
	const { lyrics, voiceId, setVoiceId, vocalUrl, setVocalUrl, setTrackUrl, arrangement, mix, rebuildArrangement, setPlaying, beatUrl } = useStudio();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [preview, setPreview] = (0, import_react.useState)(vocalUrl);
	async function makeCover() {
		const text = extractSingable(lyrics);
		if (!text) {
			toast.error("Write or generate lyrics first");
			return;
		}
		setBusy(true);
		try {
			const result = await synthesizeCover({ data: {
				text,
				voiceId
			} });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			const blob = b64ToBlob(result.b64, result.mime);
			const url = URL.createObjectURL(blob);
			setVocalUrl(url);
			setPreview(url);
			livePlayer.stop();
			if (beatUrl) setTrackUrl(await mixOntoTrack(beatUrl, blob));
			else {
				const ctx = new AudioContext();
				const vocal = await ctx.decodeAudioData(await blob.arrayBuffer());
				await ctx.close();
				const arr = arrangement ?? rebuildArrangement();
				setTrackUrl(await bounceToUrl(arr, mix, vocal));
			}
			setPlaying(true);
			toast.success("Voice cover ready");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Cover failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[1.3fr_0.7fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Voice cover" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Render the hook with a vocalist voice and mix it onto the current beat." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "voice",
					children: "Voice"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					id: "voice",
					value: voiceId,
					onChange: (e) => setVoiceId(e.target.value),
					children: VOICES.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: v.id,
						children: v.label
					}, v.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 rounded-md bg-bg px-3 py-3 text-sm text-muted",
				children: extractSingable(lyrics) || "No singable lines yet — generate a draft in Create first."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-5 w-full",
				size: "lg",
				disabled: busy,
				onClick: () => void makeCover(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), busy ? "Rendering cover…" : "Create voice cover"]
			}),
			preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
				className: "mt-4 w-full",
				controls: true,
				src: preview
			}) : null
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your take" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Record a dry vocal over the beat, then mix it in Studio." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 flex items-start gap-2 text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "mt-0.5 size-4 shrink-0" }), "Use Live to check pitch, then import the recording in the vocal remover to build an instrumental bed for a cover."]
			})
		] })]
	});
}
var GENRES = [
	"Hip-Hop",
	"Trap",
	"R&B",
	"Melodic Rap",
	"Afrobeats",
	"Pop",
	"Rock",
	"Jazz",
	"Country",
	"Electronic"
];
var MOODS = [
	"Triumphant",
	"Emotional",
	"Aggressive",
	"Romantic",
	"Dark",
	"Celebratory"
];
var LENGTHS = [
	{
		value: "8",
		label: "8 bars"
	},
	{
		value: "16",
		label: "16 bars"
	},
	{
		value: "32",
		label: "Full song"
	}
];
var generateLyrics = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("15bbdc1540f83a212fb8796a31cac10525c17bd63208bf3eca0bece0ac717e39"));
/** Extensions first — iOS Files greys out Downloads MP3s if accept is only `audio/*`. */
var AUDIO_ACCEPT = ".mp3,.MP3,.wav,.WAV,.m4a,.M4A,.aac,.AAC,.ogg,.oga,.flac,.mp4,.mpeg,.mpg,.aiff,.aif,.caf,.webm,.opus";
var AUDIO_EXT = /\.(mp3|wav|wave|m4a|aac|ogg|oga|flac|mp4|m4v|mpeg|mpg|aiff|aif|caf|webm|opus)$/i;
function looksLikeAudio(file) {
	if (file.type.startsWith("audio/") || file.type.startsWith("video/")) return true;
	return AUDIO_EXT.test(file.name);
}
function AudioCtor() {
	const w = window;
	const Ctor = w.AudioContext ?? w.webkitAudioContext;
	if (!Ctor) throw new Error("This browser cannot decode audio");
	return Ctor;
}
function decodeWithContext(ctx, raw) {
	const copy = raw.slice(0);
	try {
		const result = ctx.decodeAudioData(copy);
		if (result && typeof result.then === "function") return result;
	} catch {}
	return new Promise((resolve, reject) => {
		ctx.decodeAudioData(raw.slice(0), resolve, reject);
	});
}
async function decodeAudioFile(file) {
	const ctx = new (AudioCtor())();
	if (ctx.state === "suspended") ctx.resume().catch(() => void 0);
	const raw = await file.arrayBuffer();
	try {
		const buffer = await decodeWithContext(ctx, raw);
		await ctx.close().catch(() => void 0);
		return buffer;
	} catch (err) {
		await ctx.close().catch(() => void 0);
		throw err;
	}
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	ref,
	className: cn("min-h-32 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-subtle focus:border-accent", className),
	...props
}));
Textarea.displayName = "Textarea";
function readPhoto(file) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const url = URL.createObjectURL(file);
		img.onload = () => {
			const scale = Math.min(1, 768 / Math.max(img.width, img.height));
			const canvas = document.createElement("canvas");
			canvas.width = Math.round(img.width * scale);
			canvas.height = Math.round(img.height * scale);
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				reject(/* @__PURE__ */ new Error("canvas"));
				return;
			}
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			URL.revokeObjectURL(url);
			resolve(canvas.toDataURL("image/jpeg", .72));
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("image"));
		};
		img.src = url;
	});
}
function peaksFromBuffer(buffer, bars = 48) {
	const data = buffer.getChannelData(0);
	const size = Math.max(1, Math.floor(data.length / bars));
	const peaks = [];
	for (let i = 0; i < bars; i++) {
		let sum = 0;
		let count = 0;
		const start = i * size;
		for (let j = 0; j < size; j += 64) {
			sum += Math.abs(data[start + j] ?? 0);
			count += 1;
		}
		peaks.push(count ? sum / count : 0);
	}
	const max = Math.max(...peaks, .001);
	return peaks.map((value) => value / max);
}
function CreatePanel() {
	const { prompt, genre, mood, length, lyrics, bpm, key, photoDataUrl, beatUrl, beatName, setPrompt, setGenre, setMood, setLyrics, setTab, setPhotoDataUrl, setBeat, setTitle, setSongId, rebuildArrangement, setTrackUrl, mix, setPlaying, mode, setBpm, setKey } = useStudio();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [readingBeat, setReadingBeat] = (0, import_react.useState)(false);
	const [peaks, setPeaks] = (0, import_react.useState)([]);
	const [beatPlaying, setBeatPlaying] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("Drop a beat to write to it, or start with a photo / text idea.");
	const photoRef = (0, import_react.useRef)(null);
	const beatRef = (0, import_react.useRef)(null);
	const beatAudioRef = (0, import_react.useRef)(null);
	const lengthLabel = LENGTHS.find((l) => l.value === length)?.label ?? "16 bars";
	async function onPhoto(file) {
		if (!file) return;
		try {
			setPhotoDataUrl(await readPhoto(file));
		} catch {
			toast.error("Could not read that image");
		}
	}
	async function onBeat(file) {
		if (!file) return;
		if (!looksLikeAudio(file)) {
			toast.error("Use an MP3, WAV, M4A, or similar audio file");
			return;
		}
		setReadingBeat(true);
		setStatus("Reading the beat…");
		const url = URL.createObjectURL(file);
		try {
			const buffer = await decodeAudioFile(file);
			const analysis = analyzeBeat(buffer);
			setPeaks(peaksFromBuffer(buffer));
			setBeat(url, file.name);
			setBpm(analysis.bpm);
			setKey(analysis.key);
			setGenre(analysis.genre);
			setMood(analysis.mood);
			setTrackUrl(url);
			setStatus(`Writing to ${file.name} · ${analysis.bpm} BPM · ${analysis.key} · ${analysis.genre} / ${analysis.mood}`);
			toast.success(`${analysis.bpm} BPM · ${analysis.key} · ${analysis.genre}`);
		} catch {
			setBeat(url, file.name);
			setTrackUrl(url);
			setStatus(`Loaded ${file.name}. Couldn’t read BPM/key on this file — you can still write to it.`);
			toast.message("Beat loaded. BPM/key skipped.");
		} finally {
			setReadingBeat(false);
		}
	}
	async function onCreate() {
		setBusy(true);
		setStatus("Writing lyrics to the pocket…");
		try {
			const result = await generateLyrics({ data: {
				topic: prompt,
				genre,
				mood,
				length,
				photoDataUrl,
				mode: "full",
				bpm,
				key,
				writingToBeat: Boolean(beatUrl)
			} });
			if (!result.ok) {
				setStatus(result.error);
				toast.error(result.error);
				return;
			}
			setLyrics(result.text);
			setSongId(null);
			const titleLine = result.text.split("\n").find((l) => l.trim());
			setTitle((titleLine ?? "Untitled").replace(/^\[Title]\s*/i, "").replace(/[\[\]]/g, "").trim() || "Untitled");
			rebuildArrangement();
			livePlayer.stop();
			if (beatUrl) {
				setTrackUrl(beatUrl);
				setPlaying(true);
				setStatus("Lyrics locked to your beat. Play it below, then edit or add a voice cover.");
			} else {
				setStatus("Building the beat…");
				const arr = rebuildArrangement();
				setTrackUrl(await bounceToUrl(arr, mix));
				setPlaying(true);
				setStatus("Track ready. Play it below, then edit lyrics or open a voice cover.");
			}
			toast.success("Song ready");
			setTab(mode === "studio" ? "daw" : "lyrics");
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Generation failed";
			setStatus(msg);
			toast.error(msg);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[1.4fr_0.8fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Turn an idea into a song" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					genre,
					" · ",
					mood,
					" · ",
					lengthLabel,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ml-2 font-medium text-accent",
						onClick: () => setTab("settings"),
						children: "Change in Settings"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Drop the beat you want to write to. We read BPM, key, and style so the lyrics sit in the pocket." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "prompt",
					children: "Text prompt"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "prompt",
					value: prompt,
					onChange: (e) => setPrompt(e.target.value),
					placeholder: "A victorious late-night anthem about building something from nothing…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Beat / instrumental" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: beatRef,
						id: "beat-file",
						type: "file",
						accept: AUDIO_ACCEPT,
						className: "sr-only",
						onChange: (e) => {
							const f = e.target.files?.[0];
							e.target.value = "";
							onBeat(f);
						}
					}),
					beatUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-bg p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-2 truncate text-sm font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music2, { className: "size-4 shrink-0 text-accent" }), beatName ?? "Uploaded beat"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted",
										children: [
											bpm,
											" BPM · ",
											key ?? "key unknown"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "size-9",
											"aria-label": beatPlaying ? "Pause beat" : "Play beat",
											onClick: () => {
												const el = beatAudioRef.current;
												if (!el) return;
												if (el.paused) el.play();
												else el.pause();
											},
											children: beatPlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "sm",
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												htmlFor: "beat-file",
												children: "Replace"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "size-9",
											onClick: () => {
												beatAudioRef.current?.pause();
												setBeatPlaying(false);
												setPeaks([]);
												setBeat(null, null);
												setStatus("Beat cleared. Drop another, or Create without one.");
											},
											"aria-label": "Remove beat",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
										})
									]
								})]
							}),
							peaks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex h-12 items-end gap-0.5",
								"aria-hidden": "true",
								children: peaks.map((peak, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 rounded-sm bg-accent",
									style: { height: `${Math.max(8, peak * 100)}%` }
								}, index))
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
								ref: beatAudioRef,
								className: "hidden",
								src: beatUrl,
								onPlay: () => setBeatPlaying(true),
								onPause: () => setBeatPlaying(false),
								onEnded: () => setBeatPlaying(false)
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						htmlFor: "beat-file",
						onDragOver: (e) => e.preventDefault(),
						onDrop: (e) => {
							e.preventDefault();
							onBeat(e.dataTransfer.files[0]);
						},
						className: "flex min-h-24 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-bg px-4 py-5 text-sm text-muted hover:border-accent/40 hover:text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music2, { className: "size-4" }), readingBeat ? "Reading the beat…" : "Drop or attach MP3 / WAV / M4A"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Photo inspiration" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: photoRef,
						type: "file",
						accept: "image/*",
						className: "hidden",
						onChange: (e) => void onPhoto(e.target.files?.[0])
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => photoRef.current?.click(),
						onDragOver: (e) => e.preventDefault(),
						onDrop: (e) => {
							e.preventDefault();
							onPhoto(e.dataTransfer.files[0]);
						},
						className: "flex min-h-20 items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-bg px-4 py-5 text-sm text-muted hover:border-accent/40 hover:text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4" }), photoDataUrl ? "Replace photo" : "Drop or attach a photo"]
					}),
					photoDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: photoDataUrl,
						alt: "Inspiration",
						className: "mt-1 max-h-40 w-full rounded-md object-cover"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-5 w-full",
				size: "lg",
				disabled: busy || readingBeat,
				onClick: () => void onCreate(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), busy ? "Creating…" : beatUrl ? "Write to this beat" : "Create song"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 rounded-md border border-dashed border-border bg-bg px-3 py-3 text-sm text-muted",
				children: status
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Song blueprint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
			className: "mt-4 divide-y divide-border",
			children: [
				["Beat", beatName ?? "None — we'll make one"],
				["Genre", genre],
				["Mood", mood],
				["Length", lengthLabel],
				["BPM", String(bpm)],
				["Key", key ?? "—"],
				["Draft", lyrics.trim() ? "Ready" : "Not created"]
			].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 py-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "shrink-0 text-muted",
					children: k
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "truncate text-right font-medium text-accent",
					children: v
				})]
			}, k))
		})] })]
	});
}
var TRACKS = [
	{
		id: "drums",
		label: "Drums"
	},
	{
		id: "bass",
		label: "Bass"
	},
	{
		id: "harmony",
		label: "Harmony"
	},
	{
		id: "lead",
		label: "Lead"
	},
	{
		id: "vocals",
		label: "Vocals"
	}
];
function DawPanel() {
	const { mix, setMix, arrangement, rebuildArrangement, genre, mood, bpm, key, setTrackUrl, setPlaying, playing } = useStudio();
	const [bar, setBar] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		livePlayer.onBar = setBar;
		return () => {
			livePlayer.onBar = null;
		};
	}, []);
	function patch(next) {
		setMix(next);
		livePlayer.setMix(next);
	}
	async function play() {
		const arr = arrangement ?? rebuildArrangement();
		await livePlayer.start(arr, mix);
		setPlaying(true);
	}
	function stop() {
		livePlayer.stop();
		setPlaying(false);
		setBar(0);
	}
	async function bounce() {
		const arr = arrangement ?? rebuildArrangement();
		toast.message("Bouncing mix…");
		setTrackUrl(await bounceToUrl(arr, mix));
		setPlaying(true);
		toast.success("Mix bounced");
	}
	const bars = arrangement?.bars ?? 16;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-4 sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Studio DAW" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDesc, { children: [
				genre,
				" · ",
				mood,
				" · ",
				bpm,
				" BPM · ",
				key ?? "—"
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => void play(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}), " Play"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: stop,
						children: [playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {}), " Stop"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => void bounce(),
						children: "Bounce mix"
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-w-[520px] space-y-2",
				children: TRACKS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid items-center gap-2 sm:grid-cols-[92px_1fr_160px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: cn("h-8 rounded-sm px-2 text-xs", mix.mute[t.id] ? "bg-elevated text-subtle" : "bg-bg text-fg"),
									onClick: () => patch({
										...mix,
										mute: {
											...mix.mute,
											[t.id]: !mix.mute[t.id]
										}
									}),
									children: "M"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: cn("h-8 rounded-sm px-2 text-xs", mix.solo === t.id ? "bg-accent text-accent-fg" : "bg-bg text-muted"),
									onClick: () => patch({
										...mix,
										solo: mix.solo === t.id ? null : t.id
									}),
									children: "S"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: t.label
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative h-8 overflow-hidden rounded-sm bg-bg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-y-0 bg-accent/25",
								style: { width: `${(bar + 1) / bars * 100}%` }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 grid",
								style: { gridTemplateColumns: `repeat(${bars}, 1fr)` },
								children: Array.from({ length: bars }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("border-r border-border/60", i === bar && playing ? "bg-accent/40" : "") }, i))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 100,
							value: mix.gains[t.id],
							className: "w-full accent-accent",
							onChange: (e) => patch({
								...mix,
								gains: {
									...mix.gains,
									[t.id]: Number(e.target.value)
								}
							})
						})
					]
				}, t.id))
			})
		})]
	});
}
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
}).handler(createSsrRpc("faa9e3877374fcae5276cff1b127004e96b661fc19a475e9cb1558fdecc4b768"));
var Input = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	ref,
	className: cn("h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-subtle focus:border-accent", className),
	...props
}));
Input.displayName = "Input";
var SUGGESTIONS = [
	"808 bassline tips",
	"How do I mix vocals?",
	"Write a hook for this track",
	"Chord ideas in this key",
	"Sidechain the kick"
];
function DippyPanel() {
	const { bpm, key, genre, mood, lyrics, setLyrics, setTab } = useStudio();
	const [draft, setDraft] = (0, import_react.useState)("");
	const [turns, setTurns] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function send(text) {
		const message = (text ?? draft).trim();
		if (!message || busy) return;
		setDraft("");
		setError(null);
		const history = turns;
		setTurns((current) => [...current, {
			role: "user",
			text: message
		}]);
		setBusy(true);
		try {
			const result = await askDippy({ data: {
				message,
				history,
				bpm,
				key,
				genre,
				mood,
				lyrics
			} });
			if (!result.ok) {
				setError(result.error);
				return;
			}
			setTurns((current) => [...current, {
				role: "assistant",
				text: result.text
			}]);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Dippy could not answer");
		} finally {
			setBusy(false);
		}
	}
	function dropIn(text) {
		const next = lyrics.trim() ? `${lyrics.trim()}\n\n${text.trim()}` : text.trim();
		setLyrics(next);
		setTab("lyrics");
		toast.success("Dropped into lyrics");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "flex min-h-[32rem] flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Dippy" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDesc, { children: [
				"Producer chat for this session · ",
				genre,
				" · ",
				mood,
				" · ",
				bpm,
				" BPM",
				key ? ` · ${key}` : ""
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex min-h-64 flex-1 flex-col gap-3 overflow-y-auto rounded-lg border border-border bg-bg p-3",
				children: [
					turns.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Ask about the mix, the pocket, or a hook. Dippy can see the lyrics already on the page."
					}) : turns.map((turn, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: turn.role === "user" ? "ml-auto max-w-[85%]" : "max-w-[85%]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-1 text-xs font-medium text-muted",
								children: turn.role === "user" ? "You" : "Dippy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: turn.role === "user" ? "rounded-lg border border-border bg-elevated px-3 py-2 text-sm leading-relaxed" : "rounded-lg border border-border bg-surface px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap",
								children: turn.text
							}),
							turn.role === "assistant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-2",
								variant: "ghost",
								size: "sm",
								onClick: () => dropIn(turn.text),
								children: "Drop into lyrics"
							}) : null
						]
					}, `${turn.role}-${index}`)),
					busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Dippy is writing…"
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-2 overflow-x-auto pb-1",
				children: SUGGESTIONS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					onClick: () => void send(item),
					className: "h-9 shrink-0 rounded-md border border-border bg-elevated px-3 text-xs text-muted hover:text-fg disabled:opacity-40",
					children: item
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 flex gap-2",
				onSubmit: (event) => {
					event.preventDefault();
					send();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: draft,
					onChange: (event) => setDraft(event.target.value),
					placeholder: "Ask Dippy about this track",
					disabled: busy
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					disabled: busy || !draft.trim(),
					"aria-label": "Send",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {}), "Send"]
				})]
			})
		]
	});
}
var KEY = "dipp_library";
function read() {
	if (typeof window === "undefined") return [];
	try {
		const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]");
		if (!Array.isArray(raw)) return [];
		return raw.filter(isProject);
	} catch {
		return [];
	}
}
function write(projects) {
	localStorage.setItem(KEY, JSON.stringify(projects));
}
function isProject(value) {
	if (!value || typeof value !== "object") return false;
	const row = value;
	return typeof row.id === "string" && typeof row.title === "string" && typeof row.lyrics === "string" && typeof row.prompt === "string" && typeof row.genre === "string" && typeof row.mood === "string" && typeof row.length === "string" && (row.bpm === null || typeof row.bpm === "number") && typeof row.timestamp === "number";
}
function listLocalProjects() {
	return read().sort((a, b) => b.timestamp - a.timestamp);
}
function upsertLocalProject(input) {
	const projects = read();
	const next = {
		id: (input.id ? projects.find((p) => p.id === input.id) : void 0)?.id ?? input.id ?? crypto.randomUUID(),
		title: input.title.trim() || "Untitled",
		lyrics: input.lyrics,
		prompt: input.prompt,
		genre: input.genre,
		mood: input.mood,
		length: input.length,
		bpm: input.bpm,
		timestamp: Date.now()
	};
	write([next, ...projects.filter((p) => p.id !== next.id)]);
	return next;
}
function deleteLocalProject(id) {
	write(read().filter((p) => p.id !== id));
}
function mergeLocalProjects(incoming) {
	const current = read();
	const ids = new Set(current.map((p) => p.id));
	const added = incoming.filter((p) => !ids.has(p.id));
	write([...added, ...current]);
	return added.length;
}
function downloadJson(filename, data) {
	const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function formatProjectDate(timestamp) {
	return new Date(timestamp).toLocaleString(void 0, {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit"
	});
}
function LibraryPanel() {
	const applyLocal = useStudio((s) => s.applyLocal);
	const setTab = useStudio((s) => s.setTab);
	const importRef = (0, import_react.useRef)(null);
	const [projects, setProjects] = (0, import_react.useState)(() => listLocalProjects());
	function refresh() {
		setProjects(listLocalProjects());
	}
	async function importLibrary(file) {
		if (!file) return;
		try {
			const parsed = JSON.parse(await file.text());
			const valid = (Array.isArray(parsed) ? parsed : [parsed]).filter(isProject);
			if (!valid.length) {
				toast.error("That file has no DIPP projects");
				return;
			}
			const added = mergeLocalProjects(valid);
			refresh();
			toast.success(added ? `Imported ${added} project${added === 1 ? "" : "s"}` : "Those projects are already here");
		} catch {
			toast.error("Could not read that JSON file");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, { className: "size-5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Project library" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Saved in this browser. Export a JSON backup before you clear site data." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: importRef,
						type: "file",
						accept: "application/json,.json",
						className: "hidden",
						onChange: (event) => {
							importLibrary(event.target.files?.[0]);
							event.target.value = "";
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "sm",
						onClick: () => importRef.current?.click(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {}), "Import JSON"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "sm",
						disabled: !projects.length,
						onClick: () => downloadJson("dipp-pro-library.json", projects),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Export library"]
					})
				]
			})]
		}) }), !projects.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "flex min-h-72 flex-col items-center justify-center text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, { className: "size-7 text-accent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 font-display text-lg font-semibold",
					children: "No saved projects yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-sm text-sm leading-relaxed text-muted",
					children: "Generate or write lyrics, then save the project from the Lyrics workspace."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "mt-5",
					onClick: () => setTab("create"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), "Create a track"]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
			children: projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex min-h-72 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "truncate text-base font-semibold",
								children: project.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: formatProjectDate(project.timestamp)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 rounded-full border border-border bg-elevated px-2.5 py-1 text-xs font-medium text-muted",
							children: project.genre
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2 text-xs font-medium text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-bg px-2.5 py-1",
							children: project.mood
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-bg px-2.5 py-1",
							children: project.length
						})]
					}),
					project.prompt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 line-clamp-2 text-xs leading-relaxed text-muted",
						children: project.prompt
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 line-clamp-6 whitespace-pre-wrap text-sm leading-relaxed text-fg/80",
						children: project.lyrics
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto flex flex-wrap gap-2 pt-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								size: "sm",
								onClick: () => {
									applyLocal({
										id: project.id,
										title: project.title,
										lyrics: project.lyrics,
										prompt: project.prompt,
										genre: project.genre,
										mood: project.mood,
										length: project.length,
										bpm: project.bpm
									});
								},
								children: ["Open", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => downloadJson(`${project.title}.json`, project),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Export"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "danger",
								size: "sm",
								onClick: () => {
									deleteLocalProject(project.id);
									refresh();
									toast.success(`Deleted ${project.title}`);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), "Delete"]
							})
						]
					})
				]
			}, project.id))
		})]
	});
}
function LivePanel() {
	const bpm = useStudio((s) => s.bpm);
	const [listening, setListening] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)("—");
	const [freq, setFreq] = (0, import_react.useState)(0);
	const [level, setLevel] = (0, import_react.useState)(0);
	const streamRef = (0, import_react.useRef)(null);
	const ctxRef = (0, import_react.useRef)(null);
	const rafRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => () => stop(), []);
	function stop() {
		cancelAnimationFrame(rafRef.current);
		streamRef.current?.getTracks().forEach((t) => t.stop());
		streamRef.current = null;
		ctxRef.current?.close();
		ctxRef.current = null;
		setListening(false);
	}
	async function start() {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		streamRef.current = stream;
		const ctx = new AudioContext();
		ctxRef.current = ctx;
		const src = ctx.createMediaStreamSource(stream);
		const analyser = ctx.createAnalyser();
		analyser.fftSize = 2048;
		src.connect(analyser);
		const buf = new Float32Array(analyser.fftSize);
		setListening(true);
		const tick = () => {
			analyser.getFloatTimeDomainData(buf);
			let rms = 0;
			for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
			rms = Math.sqrt(rms / buf.length);
			setLevel(Math.min(1, rms * 8));
			const hz = detectPitch(buf, ctx.sampleRate);
			if (hz > 60) {
				setFreq(Math.round(hz));
				setNote(freqToNote(hz).name);
			}
			rafRef.current = requestAnimationFrame(tick);
		};
		tick();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Live pitch" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDesc, { children: [
			"Check your note against the current ",
			bpm,
			" BPM pocket."
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex items-end gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-6xl font-semibold tracking-tight",
				children: note
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 font-mono text-sm text-muted",
				children: freq ? `${freq} Hz` : "Waiting"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-16 flex-1 overflow-hidden rounded-md bg-bg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-accent",
					style: { width: `${Math.round(level * 100)}%` }
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			className: "mt-6",
			onClick: () => listening ? stop() : void start(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {}), listening ? "Stop mic" : "Start mic"]
		})
	] });
}
var STOP = /* @__PURE__ */ new Set([
	"the",
	"a",
	"an",
	"and",
	"or",
	"to",
	"of",
	"in",
	"on",
	"my",
	"i",
	"you",
	"we"
]);
function lastWord(line) {
	return line.toLowerCase().replace(/[^a-z0-9'\s]/g, " ").trim().split(/\s+/).filter((w) => w && !STOP.has(w)).at(-1) ?? "";
}
function rhymeTail(word) {
	return word.slice(-3);
}
function analyzeFlow(lyrics) {
	const lines = lyrics.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("["));
	const tails = lines.map(lastWord).map(rhymeTail).filter(Boolean);
	const counts = /* @__PURE__ */ new Map();
	for (const t of tails) counts.set(t, (counts.get(t) ?? 0) + 1);
	const rhymeHits = [...counts.values()].filter((n) => n > 1).reduce((a, b) => a + b, 0);
	const bars = lines.length;
	const density = bars ? Math.min(1, rhymeHits / bars) : 0;
	return {
		lines: lines.length,
		bars,
		rhymeHits,
		density
	};
}
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6d6482416e7cd22cc25878415ecb974b8b6bd0dba5d07162c878882136879939"));
var saveSong = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("264047e15321919f45c1637d4a61d50ef3307e29a04e3eb2bae8f95b5dd428c4"));
createServerFn({ method: "POST" }).validator((id) => id).middleware([authMiddleware]).handler(createSsrRpc("12bdf98dc2a47279ec62781589224202a5273d07e6478b13a6e7b253324d3059"));
function LyricsPanel({ onSaved }) {
	const { lyrics, setLyrics, genre, mood, prompt, length, bpm, key, title, songId, setSongId, setTitle, beatUrl, localId, setLocalId } = useStudio();
	const user = useCurrentUser();
	const [busy, setBusy] = (0, import_react.useState)(null);
	const flow = (0, import_react.useMemo)(() => analyzeFlow(lyrics), [lyrics]);
	async function runTool(mode) {
		if (mode !== "hook" && !lyrics.trim()) {
			toast.error("Write something first");
			return;
		}
		setBusy(mode);
		try {
			const result = await generateLyrics({ data: {
				topic: prompt,
				genre,
				mood,
				length: mode === "rewrite" ? "8" : length,
				mode,
				existing: lyrics,
				bpm,
				key,
				writingToBeat: Boolean(beatUrl)
			} });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			if (mode === "hook" || mode === "verse") setLyrics(`${lyrics.trim()}\n\n${result.text}`.trim());
			else setLyrics(result.text);
			toast.success(mode === "rewrite" ? "Rewritten" : "Added");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed");
		} finally {
			setBusy(null);
		}
	}
	async function onSave() {
		if (!lyrics.trim()) {
			toast.error("Nothing to save");
			return;
		}
		setBusy("save");
		try {
			const first = lyrics.split("\n").find((l) => l.trim() && !l.startsWith("["));
			const nextTitle = title && title !== "Untitled" ? title : (first ?? "Untitled").slice(0, 72);
			const local = upsertLocalProject({
				id: localId ?? void 0,
				title: nextTitle,
				lyrics,
				prompt,
				genre,
				mood,
				length,
				bpm
			});
			setLocalId(local.id);
			setTitle(local.title);
			if (user) {
				const row = await saveSong({ data: {
					id: songId ?? void 0,
					title: nextTitle,
					lyrics,
					prompt,
					genre,
					mood,
					length,
					bpm
				} });
				if (row) setSongId(row.id);
				toast.success("Saved on this device and to your account");
			} else toast.success("Saved in this browser");
			onSaved?.();
		} catch {
			toast.error("Could not save");
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[1.5fr_0.8fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Lyrics writer" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Edit every line. Tools rewrite, add a hook, or drop a verse." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				className: "mt-5 min-h-96 font-mono text-sm leading-relaxed",
				value: lyrics,
				onChange: (e) => setLyrics(e.target.value),
				placeholder: "[Title]\n[Verse 1]\n…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						disabled: !!busy,
						onClick: () => void runTool("hook"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}),
							" ",
							busy === "hook" ? "Writing…" : "Add hook"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						disabled: !!busy,
						onClick: () => void runTool("verse"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, {}),
							" ",
							busy === "verse" ? "Writing…" : "Add verse"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						disabled: !!busy,
						onClick: () => void runTool("rewrite"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {}),
							" ",
							busy === "rewrite" ? "Rewriting…" : "Rewrite denser"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						disabled: !!busy,
						onClick: () => void onSave(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {}),
							" ",
							busy === "save" ? "Saving…" : "Save"
						]
					})
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Flow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
			className: "mt-4 divide-y divide-border text-sm",
			children: [
				["Lines", String(flow.lines)],
				["Bars", String(flow.bars)],
				["Rhyme hits", String(flow.rhymeHits)],
				["Density", `${Math.round(flow.density * 100)}%`]
			].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-muted",
					children: k
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "font-medium text-accent",
					children: v
				})]
			}, k))
		})] })]
	});
}
function ModeGate() {
	const setMode = useStudio((s) => s.setMode);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto grid min-h-[70vh] max-w-4xl place-items-center px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted uppercase",
					children: "DIPP PRO · RhymeForge"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl font-semibold tracking-tight",
					children: "Make your own song"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
					children: "Turn a photo, a text idea, or your own beat into lyrics and a track. Start in Writer to draft fast, or open Studio for a DAW with stems, covers, and a vocal remover."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setMode("writer"),
						className: "rounded-2xl border border-border bg-surface p-6 text-left hover:border-accent/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-5 text-accent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 font-display text-xl font-semibold",
								children: "Writer mode"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "Drop a beat or a photo, pick a vibe, hit Create. Lyrics lock to the BPM and key, then you can edit and share."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setMode("studio"),
						className: "rounded-2xl border border-border bg-surface p-6 text-left hover:border-accent/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicVocal, { className: "size-5 text-accent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 font-display text-xl font-semibold",
								children: "Studio mode"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "A compact DAW: mix stems, voice covers, vocal remover, trim, echo, and noise cleanup."
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => setMode("writer"),
						children: "Skip to writer"
					})
				})
			]
		})
	});
}
function clock(seconds) {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
	const whole = Math.floor(seconds);
	return `${Math.floor(whole / 60)}:${(whole % 60).toString().padStart(2, "0")}`;
}
function PlayerBar() {
	const { trackUrl, title, lyrics, playing, setPlaying, arrangement, mix } = useStudio();
	const audioRef = (0, import_react.useRef)(null);
	const [time, setTime] = (0, import_react.useState)(0);
	const [duration, setDuration] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const el = audioRef.current;
		if (!el || !trackUrl) return;
		setTime(0);
		setDuration(0);
		el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
	}, [trackUrl, setPlaying]);
	if (!trackUrl && !arrangement) return null;
	async function toggle() {
		const el = audioRef.current;
		if (trackUrl && el) {
			if (el.paused) {
				await el.play();
				setPlaying(true);
			} else {
				el.pause();
				setPlaying(false);
			}
			return;
		}
		if (arrangement) {
			if (livePlayer.isPlaying) {
				livePlayer.stop();
				setPlaying(false);
			} else {
				await livePlayer.start(arrangement, mix);
				setPlaying(true);
			}
		}
	}
	async function share() {
		const text = `${title}\n\n${lyrics}`.trim();
		try {
			if (navigator.share) await navigator.share({
				title: title || "DIPP PRO song",
				text
			});
			else {
				await navigator.clipboard.writeText(text);
				toast.success("Lyrics copied");
			}
		} catch {}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "secondary",
					onClick: () => void toggle(),
					"aria-label": playing ? "Pause" : "Play",
					children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-medium",
							children: title || "Untitled"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0 text-xs tabular-nums text-muted",
							children: trackUrl ? `${clock(time)} / ${clock(duration)}` : "Live mix"
						})]
					}), trackUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "mt-2 w-full accent-[var(--accent)]",
						type: "range",
						min: 0,
						max: duration || 0,
						step: .1,
						value: Math.min(time, duration || 0),
						"aria-label": "Playback position",
						onChange: (e) => {
							const next = Number(e.target.value);
							const el = audioRef.current;
							if (!el) return;
							el.currentTime = next;
							setTime(next);
						}
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => void share(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {}), "Share"]
				})
			]
		}), trackUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
			ref: audioRef,
			className: "hidden",
			src: trackUrl,
			onLoadedMetadata: (e) => setDuration(e.currentTarget.duration || 0),
			onTimeUpdate: (e) => setTime(e.currentTarget.currentTime),
			onPlay: () => setPlaying(true),
			onPause: () => setPlaying(false),
			onEnded: () => setPlaying(false)
		}) : null]
	});
}
function SettingsPanel() {
	const { genre, setGenre, mood, setMood, length, setLength, bpm, setBpm, voiceId, setVoiceId, title, setTitle } = useStudio();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Settings" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "These stick in this browser and feed Create, Chat, Studio, and voice covers." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "settings-title",
						children: "Project title"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "settings-title",
						value: title,
						onChange: (e) => setTitle(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "settings-bpm",
						children: "BPM"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "settings-bpm",
						type: "number",
						min: 60,
						max: 200,
						value: bpm,
						onChange: (e) => {
							const next = Number(e.target.value);
							if (Number.isFinite(next)) setBpm(Math.min(200, Math.max(60, Math.round(next))));
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "settings-genre",
						children: "Genre"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "settings-genre",
						value: genre,
						onChange: (e) => setGenre(e.target.value),
						children: GENRES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: item }, item))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "settings-mood",
						children: "Mood"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "settings-mood",
						value: mood,
						onChange: (e) => setMood(e.target.value),
						children: MOODS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: item }, item))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "settings-length",
						children: "Length"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "settings-length",
						value: length,
						onChange: (e) => setLength(e.target.value),
						children: LENGTHS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item.value,
							children: item.label
						}, item.value))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "settings-voice",
						children: "Cover voice"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "settings-voice",
						value: voiceId,
						onChange: (e) => setVoiceId(e.target.value),
						children: VOICES.map((voice) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: voice.id,
							children: voice.label
						}, voice.id))
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-6",
			variant: "secondary",
			onClick: () => {
				setGenre("Hip-Hop");
				setMood("Triumphant");
				setLength("16");
				setBpm(92);
				setVoiceId("eve");
			},
			children: "Reset defaults"
		})
	] });
}
function StoryPanel() {
	const { setPrompt, setLyrics, setTab, setMood, setGenre, setSongId, setTitle, rebuildArrangement, mix, setTrackUrl, setPlaying } = useStudio();
	const [beginning, setBeginning] = (0, import_react.useState)("");
	const [moments, setMoments] = (0, import_react.useState)("");
	const [details, setDetails] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onCreate() {
		const parts = [
			beginning,
			moments,
			details
		].map((s) => s.trim()).filter(Boolean);
		if (!parts.length) {
			toast.error("Add at least one part of the story");
			return;
		}
		const topic = parts.join(". ");
		setPrompt(topic);
		setMood("Emotional");
		setGenre("Hip-Hop");
		setBusy(true);
		try {
			const result = await generateLyrics({ data: {
				topic,
				genre: "Hip-Hop",
				mood: "Emotional",
				length: "16",
				mode: "full"
			} });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			setLyrics(result.text);
			setSongId(null);
			const titleLine = result.text.split("\n").find((l) => l.trim());
			setTitle((titleLine ?? "Untitled").replace(/^\[Title]\s*/i, "").replace(/[\[\]]/g, "").trim() || "Untitled");
			livePlayer.stop();
			setTrackUrl(await bounceToUrl(rebuildArrangement(), mix));
			setPlaying(true);
			toast.success("Personal song created");
			setTab("lyrics");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Generation failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[1.4fr_0.8fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Give them a song about them" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "The details only you know become the heart of the track." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "beginning",
					children: "Your beginning"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "beginning",
					className: "min-h-24",
					value: beginning,
					onChange: (e) => setBeginning(e.target.value),
					placeholder: "Where did your story start?"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "moments",
					children: "Your moments"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "moments",
					className: "min-h-24",
					value: moments,
					onChange: (e) => setMoments(e.target.value),
					placeholder: "A night, a joke, a habit only they have…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "details",
					children: "The details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "details",
					className: "min-h-24",
					value: details,
					onChange: (e) => setDetails(e.target.value),
					placeholder: "What should the hook say?"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-5 w-full",
				size: "lg",
				disabled: busy,
				onClick: () => void onCreate(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {}), busy ? "Writing…" : "Make the song"]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Story ingredients" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "What the lyric draft will use" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: [
					["Beginning", beginning],
					["Moments", moments],
					["Details", details]
				].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-bg p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-medium text-muted",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-relaxed text-fg/80",
						children: value.trim() || "Not added yet"
					})]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-relaxed text-muted",
				children: "Specific places, sensory details, and real moments produce a more memorable lyric starting point."
			})
		] })]
	});
}
function Badge({ className, variant = "default", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", variant === "accent" ? "bg-accent text-accent-fg" : "border border-border bg-elevated text-muted", className),
		...props
	});
}
function waveformPoints(buffer, bins = 96) {
	const data = buffer.getChannelData(0);
	const size = Math.max(1, Math.floor(data.length / bins));
	const points = [];
	for (let i = 0; i < bins; i += 1) {
		let peak = 0;
		const start = i * size;
		for (let j = 0; j < size; j += 16) peak = Math.max(peak, Math.abs(data[start + j] ?? 0));
		points.push(peak);
	}
	const max = Math.max(...points, .001);
	return points.map((n) => n / max);
}
function StudioPanel() {
	const { bpm, key, setBpm, setKey, setTrackUrl } = useStudio();
	const fileRef = (0, import_react.useRef)(null);
	const playerRef = (0, import_react.useRef)(null);
	const sourceRef = (0, import_react.useRef)(null);
	const urlRef = (0, import_react.useRef)(null);
	const [objectUrl, setObjectUrl] = (0, import_react.useState)(null);
	const [instrumental, setInstrumental] = (0, import_react.useState)(null);
	const [wave, setWave] = (0, import_react.useState)([]);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [trimStart, setTrimStart] = (0, import_react.useState)(0);
	const [trimEnd, setTrimEnd] = (0, import_react.useState)(100);
	const [status, setStatus] = (0, import_react.useState)("Import a stereo track to remove vocals, trim, reduce noise, or add echo.");
	(0, import_react.useEffect)(() => {
		return () => {
			if (urlRef.current) URL.revokeObjectURL(urlRef.current);
		};
	}, []);
	function rememberUrl(next) {
		if (urlRef.current && urlRef.current !== next) URL.revokeObjectURL(urlRef.current);
		urlRef.current = next;
		setObjectUrl(next);
		if (next) setTrackUrl(next);
	}
	function pushBuffer(buffer, note) {
		sourceRef.current = buffer;
		setWave(waveformPoints(buffer));
		rememberUrl(URL.createObjectURL(bufferToWav(buffer)));
		setStatus(note);
	}
	async function onFile(file) {
		if (!file) return;
		if (!looksLikeAudio(file)) {
			toast.error("Use an MP3, WAV, M4A, or similar audio file");
			return;
		}
		const url = URL.createObjectURL(file);
		setInstrumental(null);
		try {
			const buffer = await decodeAudioFile(file);
			sourceRef.current = buffer;
			setWave(waveformPoints(buffer));
			const tempo = estimateBpm(buffer);
			const detectedKey = estimateKey(buffer);
			setBpm(tempo.bpm);
			setKey(detectedKey);
			rememberUrl(url);
			setStatus(`Decoded · ${tempo.bpm} BPM · ${detectedKey}. Click the waveform to scrub.`);
			toast.success(`${tempo.bpm} BPM · ${detectedKey}`);
		} catch {
			rememberUrl(url);
			setWave([]);
			setStatus("Loaded the file. This device couldn’t decode it for BPM/key or vocal remove.");
			toast.message("File loaded. Analysis skipped.");
		}
	}
	function onRemove() {
		const buffer = sourceRef.current;
		if (!buffer || buffer.numberOfChannels < 2) {
			setStatus("Load a stereo audio file first.");
			return;
		}
		const out = centerCancel(buffer);
		setInstrumental(bufferToWav(out));
		pushBuffer(out, "Center-channel vocals reduced. Results vary by mix.");
		toast.success("Vocals reduced");
	}
	function onDownload() {
		const blob = instrumental;
		if (blob) {
			const a = document.createElement("a");
			a.href = URL.createObjectURL(blob);
			a.download = "DIPP-PRO-instrumental.wav";
			a.click();
			return;
		}
		if (objectUrl) {
			const a = document.createElement("a");
			a.href = objectUrl;
			a.download = "DIPP-PRO-edit.wav";
			a.click();
			return;
		}
		setStatus("Load or process a track first.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Vocal remover & cleanup" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Pull an instrumental, trim a section, reduce noise, or add echo — then drop it under a cover." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			ref: fileRef,
			id: "studio-audio-file",
			type: "file",
			accept: AUDIO_ACCEPT,
			className: "sr-only",
			onChange: (e) => {
				const f = e.target.files?.[0];
				e.target.value = "";
				onFile(f);
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			htmlFor: "studio-audio-file",
			onDragOver: (e) => e.preventDefault(),
			onDrop: (e) => {
				e.preventDefault();
				onFile(e.dataTransfer.files[0]);
			},
			className: "mt-5 flex min-h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-bg px-4 py-8 text-sm text-muted hover:border-accent/40 hover:text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-5" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Drop or tap to upload" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-subtle",
					children: "MP3, WAV, M4A, MP4"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "accent",
					children: ["BPM ", bpm || "—"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: ["KEY ", key ?? "—"] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					className: "w-auto",
					defaultValue: "1",
					onChange: (e) => {
						if (playerRef.current) playerRef.current.playbackRate = Number(e.target.value);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "0.75",
							children: "0.75×"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "1",
							children: "1×"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "1.25",
							children: "1.25×"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "1.5",
							children: "1.5×"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					onClick: onRemove,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, {}), " Remove vocals"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					onClick: () => {
						if (!sourceRef.current) return setStatus("Load a file first.");
						pushBuffer(reduceNoise(sourceRef.current), "Noise reduced.");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waves, {}), " Reduce noise"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => {
						if (!sourceRef.current) return setStatus("Load a file first.");
						pushBuffer(addEcho(sourceRef.current), "Echo added.");
					},
					children: "Add echo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					onClick: onDownload,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), " Download"]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-2 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
				"Trim start ",
				trimStart,
				"%"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "range",
				min: 0,
				max: 90,
				value: trimStart,
				className: "mt-2 w-full accent-accent",
				onChange: (e) => setTrimStart(Number(e.target.value))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
				"Trim end ",
				trimEnd,
				"%"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "range",
				min: 10,
				max: 100,
				value: trimEnd,
				className: "mt-2 w-full accent-accent",
				onChange: (e) => setTrimEnd(Number(e.target.value))
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			className: "mt-3",
			variant: "secondary",
			onClick: () => {
				if (!sourceRef.current) return setStatus("Load a file first.");
				pushBuffer(trimBuffer(sourceRef.current, trimStart / 100, trimEnd / 100), "Section trimmed.");
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, {}), " Apply trim"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
			ref: playerRef,
			controls: true,
			src: objectUrl ?? void 0,
			className: "mt-4 w-full",
			onTimeUpdate: (event) => {
				const el = event.currentTarget;
				setProgress(el.duration ? el.currentTime / el.duration : 0);
			}
		}),
		wave.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Scrub waveform",
			className: "mt-3 flex h-16 w-full items-end gap-px rounded-md bg-bg px-1 py-2",
			onClick: (event) => {
				const el = playerRef.current;
				if (!el?.duration) return;
				const rect = event.currentTarget.getBoundingClientRect();
				const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
				el.currentTime = ratio * el.duration;
				setProgress(ratio);
			},
			children: wave.map((peak, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: index / wave.length <= progress ? "bg-accent" : "bg-muted/40",
				style: {
					height: `${Math.max(8, peak * 100)}%`,
					width: "100%"
				}
			}, index))
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-4 rounded-md border border-dashed border-border bg-bg px-3 py-3 text-sm text-muted",
			children: [status, wave.length ? " Click the waveform to scrub. BPM estimation and center-channel vocal reduction run locally from decoded samples." : ""]
		})
	] });
}
var PRIMARY = {
	writer: [
		{
			id: "create",
			label: "Create"
		},
		{
			id: "lyrics",
			label: "Lyrics"
		},
		{
			id: "dippy",
			label: "Chat"
		},
		{
			id: "daw",
			label: "Studio"
		}
	],
	studio: [
		{
			id: "daw",
			label: "Studio"
		},
		{
			id: "create",
			label: "Create"
		},
		{
			id: "lyrics",
			label: "Lyrics"
		},
		{
			id: "dippy",
			label: "Chat"
		}
	]
};
var MORE = {
	writer: [
		{
			id: "cover",
			label: "Voice cover"
		},
		{
			id: "story",
			label: "Story song"
		},
		{
			id: "library",
			label: "Library"
		},
		{
			id: "settings",
			label: "Settings"
		}
	],
	studio: [
		{
			id: "cover",
			label: "Voice cover"
		},
		{
			id: "studio",
			label: "Vocal remover"
		},
		{
			id: "live",
			label: "Live"
		},
		{
			id: "library",
			label: "Library"
		},
		{
			id: "settings",
			label: "Settings"
		}
	]
};
function Home() {
	const tab = useStudio((s) => s.tab);
	const setTab = useStudio((s) => s.setTab);
	const bpm = useStudio((s) => s.bpm);
	const mode = useStudio((s) => s.mode);
	const setMode = useStudio((s) => s.setMode);
	const trackUrl = useStudio((s) => s.trackUrl);
	const arrangement = useStudio((s) => s.arrangement);
	const loadLocal = useStudio((s) => s.loadLocal);
	const [moreOpen, setMoreOpen] = (0, import_react.useState)(false);
	const moreRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!moreOpen) return;
		function close(event) {
			if (!moreRef.current?.contains(event.target)) setMoreOpen(false);
		}
		document.addEventListener("mousedown", close);
		return () => document.removeEventListener("mousedown", close);
	}, [moreOpen]);
	(0, import_react.useEffect)(() => {
		loadLocal();
	}, [loadLocal]);
	if (mode === "pick") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mx-auto flex max-w-6xl items-center justify-between px-4 pt-5 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "font-display text-2xl font-semibold tracking-tight",
				children: ["DIPP ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-accent",
					children: "PRO"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeGate, {})]
	});
	const primary = PRIMARY[mode];
	const more = MORE[mode];
	const moreActive = more.find((item) => item.id === tab);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("mx-auto min-h-screen max-w-6xl px-4 pt-5 sm:px-6", trackUrl || arrangement ? "pb-32" : "pb-16"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-display text-2xl font-semibold tracking-tight",
						children: ["DIPP ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-accent",
							children: "PRO"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "RhymeForge"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex rounded-md border border-border p-0.5",
						role: "group",
						"aria-label": "Mode",
						children: ["writer", "studio"].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								if (mode !== item) {
									setMoreOpen(false);
									setMode(item);
								}
							},
							className: cn("h-9 rounded-sm px-3 text-sm font-medium", mode === item ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"),
							children: item === "writer" ? "Writer" : "Studio"
						}, item))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: bpm
							}), " BPM"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mt-6 flex gap-2 overflow-x-auto pb-1",
				children: [primary.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setMoreOpen(false);
						setTab(t.id);
					},
					className: cn("h-11 shrink-0 rounded-md border px-4 text-sm font-medium transition-colors duration-150", tab === t.id ? "border-accent bg-accent text-accent-fg" : "border-border bg-elevated text-muted hover:text-fg"),
					children: t.label
				}, t.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					ref: moreRef,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-expanded": moreOpen,
						"aria-haspopup": "menu",
						onClick: () => setMoreOpen((open) => !open),
						className: cn("h-11 rounded-md border px-4 text-sm font-medium", moreActive ? "border-accent bg-accent text-accent-fg" : "border-border bg-elevated text-muted hover:text-fg"),
						children: moreActive ? moreActive.label : "More"
					}), moreOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "menu",
						className: "absolute left-0 z-30 mt-2 min-w-44 rounded-md border border-border bg-surface p-1 shadow-sm",
						children: more.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "menuitem",
							onClick: () => {
								setTab(item.id);
								setMoreOpen(false);
							},
							className: cn("block w-full rounded-sm px-3 py-2 text-left text-sm", tab === item.id ? "bg-elevated text-fg" : "text-muted hover:bg-elevated hover:text-fg"),
							children: item.label
						}, item.id))
					}) : null]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mt-5",
				children: [
					tab === "create" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreatePanel, {}) : null,
					tab === "lyrics" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LyricsPanel, {}) : null,
					tab === "cover" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoverPanel, {}) : null,
					tab === "daw" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DawPanel, {}) : null,
					tab === "studio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioPanel, {}) : null,
					tab === "story" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryPanel, {}) : null,
					tab === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LivePanel, {}) : null,
					tab === "library" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryPanel, {}) : null,
					tab === "dippy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DippyPanel, {}) : null,
					tab === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, {}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "mt-12 text-center text-xs text-subtle",
				children: ["DIPP PRO ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: "RhymeForge"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerBar, {})
		]
	});
}
//#endregion
export { Home as component };

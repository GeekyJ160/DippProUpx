import { bufferToWav } from "@/lib/audio-engine";

export type MixId = "drums" | "bass" | "harmony" | "lead" | "vocals";

export type MixState = {
  gains: Record<MixId, number>;
  mute: Record<MixId, boolean>;
  solo: MixId | null;
};

export const DEFAULT_MIX: MixState = {
  gains: { drums: 82, bass: 74, harmony: 58, lead: 48, vocals: 86 },
  mute: { drums: false, bass: false, harmony: false, lead: false, vocals: false },
  solo: null,
};

export type Arrangement = {
  bpm: number;
  root: number;
  minor: boolean;
  bars: number;
  genre: string;
  mood: string;
  swing: number;
};

const NOTE_INDEX: Record<string, number> = {
  C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5,
  "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11,
};

export const GENRE_BPM: Record<string, number> = {
  "Hip-Hop": 92,
  Trap: 140,
  "R&B": 86,
  "Melodic Rap": 98,
  Afrobeats: 112,
  Pop: 118,
  Rock: 128,
  Jazz: 102,
  Country: 108,
  Electronic: 124,
};

const MOOD_PROG: Record<string, number[][]> = {
  Triumphant: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]],
  Emotional: [[9, 12, 16], [5, 9, 12], [0, 4, 7], [7, 11, 14]],
  Aggressive: [[0, 3, 7], [8, 12, 15], [10, 14, 17], [0, 3, 7]],
  Romantic: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]],
  Dark: [[0, 3, 7], [5, 8, 12], [8, 12, 15], [7, 10, 14]],
  Celebratory: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]],
};

function midiToHz(m: number) {
  return 440 * 2 ** ((m - 69) / 12);
}

function envGain(ctx: BaseAudioContext, t: number, a: number, d: number, peak: number) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  return g;
}

function noiseBuffer(ctx: BaseAudioContext, seconds: number) {
  const n = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

type Pattern = { kick: number[]; snare: number[]; hat: number[] };

function drumPattern(genre: string): Pattern {
  if (genre === "Trap") {
    return {
      kick: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      hat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    };
  }
  if (genre === "Afrobeats") {
    return {
      kick: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
      hat: [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
    };
  }
  if (genre === "Rock" || genre === "Electronic") {
    return {
      kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      hat: genre === "Electronic"
        ? [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]
        : [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    };
  }
  if (genre === "Jazz" || genre === "R&B") {
    return {
      kick: [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
      hat: [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0],
    };
  }
  return {
    kick: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    hat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
  };
}

export function makeArrangement(
  genre: string,
  mood: string,
  length: string,
  keyName?: string | null,
  bpmOverride?: number | null,
): Arrangement {
  const bpm =
    bpmOverride && bpmOverride > 40 ? Math.round(bpmOverride) : (GENRE_BPM[genre] ?? 120);

  const bars = length === "8" ? 8 : length === "32" ? 32 : 16;
  const minor = /Aggressive|Dark|Emotional/.test(mood) || /m$/.test(keyName ?? "");
  let root = 57;
  if (keyName) {
    const name = keyName.replace("m", "");
    const idx = NOTE_INDEX[name];
    if (idx != null) root = 48 + idx;
  }
  const swing = genre === "Jazz" || genre === "R&B" ? 0.18 : genre === "Hip-Hop" ? 0.08 : 0;
  return { bpm, root, minor, bars, genre, mood, swing };
}

export function arrangementKey(a: Arrangement): string {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const n = names[((a.root % 12) + 12) % 12];
  return a.minor ? `${n}m` : n;
}

function mixGain(mix: MixState, id: MixId) {
  if (mix.mute[id]) return 0;
  if (mix.solo && mix.solo !== id) return 0;
  return mix.gains[id] / 100;
}

function scheduleKick(ctx: BaseAudioContext, dest: AudioNode, t: number, vel: number) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(160, t);
  osc.frequency.exponentialRampToValueAtTime(42, t + 0.12);
  const g = envGain(ctx, t, 0.004, 0.22, 0.9 * vel);
  osc.connect(g);
  g.connect(dest);
  osc.start(t);
  osc.stop(t + 0.28);
}

function scheduleSnare(ctx: BaseAudioContext, dest: AudioNode, noise: AudioBuffer, t: number, vel: number) {
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 900;
  const g = envGain(ctx, t, 0.002, 0.12, 0.35 * vel);
  src.connect(hp);
  hp.connect(g);
  g.connect(dest);
  src.start(t);
  src.stop(t + 0.16);
  const tone = ctx.createOscillator();
  tone.type = "triangle";
  tone.frequency.value = 190;
  const tg = envGain(ctx, t, 0.002, 0.1, 0.18 * vel);
  tone.connect(tg);
  tg.connect(dest);
  tone.start(t);
  tone.stop(t + 0.14);
}

function scheduleHat(ctx: BaseAudioContext, dest: AudioNode, noise: AudioBuffer, t: number, vel: number) {
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 7000;
  const g = envGain(ctx, t, 0.001, 0.04, 0.12 * vel);
  src.connect(hp);
  hp.connect(g);
  g.connect(dest);
  src.start(t);
  src.stop(t + 0.06);
}

function scheduleBass(ctx: BaseAudioContext, dest: AudioNode, t: number, hz: number, dur: number, vel: number) {
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = hz;
  const filt = ctx.createBiquadFilter();
  filt.type = "lowpass";
  filt.frequency.setValueAtTime(420, t);
  filt.frequency.exponentialRampToValueAtTime(160, t + dur * 0.8);
  const g = envGain(ctx, t, 0.01, dur, 0.28 * vel);
  osc.connect(filt);
  filt.connect(g);
  g.connect(dest);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function scheduleChord(ctx: BaseAudioContext, dest: AudioNode, t: number, freqs: number[], dur: number, vel: number) {
  for (const hz of freqs) {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = hz;
    const g = envGain(ctx, t, 0.03, dur * 0.95, 0.08 * vel);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.04);
  }
}

function scheduleLead(ctx: BaseAudioContext, dest: AudioNode, t: number, hz: number, dur: number, vel: number) {
  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.value = hz;
  const filt = ctx.createBiquadFilter();
  filt.type = "lowpass";
  filt.frequency.value = 1800;
  const g = envGain(ctx, t, 0.008, dur, 0.07 * vel);
  osc.connect(filt);
  filt.connect(g);
  g.connect(dest);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function stepTime(bpm: number, swing: number, step: number) {
  const six = 60 / bpm / 4;
  return six + (step % 2 === 1 ? six * swing : 0);
}

function scheduleBar(
  ctx: BaseAudioContext,
  buses: Record<MixId, AudioNode>,
  noise: AudioBuffer,
  arr: Arrangement,
  bar: number,
  t0: number,
) {
  const prog = MOOD_PROG[arr.mood] ?? MOOD_PROG.Triumphant;
  const chord = prog[bar % prog.length];
  const rootMidi = arr.root;
  const freqs = chord.map((iv) => midiToHz(rootMidi + iv + 12));
  const bassHz = midiToHz(rootMidi + (chord[0] % 12) - 12);
  const pat = drumPattern(arr.genre);
  let t = t0;
  const barDur = (60 / arr.bpm) * 4;
  scheduleChord(ctx, buses.harmony, t0, freqs, barDur * 0.92, 1);
  for (let s = 0; s < 16; s++) {
    const dt = stepTime(arr.bpm, arr.swing, s);
    if (pat.kick[s]) scheduleKick(ctx, buses.drums, t, s === 0 ? 1 : 0.78);
    if (pat.snare[s]) scheduleSnare(ctx, buses.drums, noise, t, 0.9);
    if (pat.hat[s]) scheduleHat(ctx, buses.drums, noise, t, s % 2 ? 0.55 : 0.85);
    if (pat.kick[s]) scheduleBass(ctx, buses.bass, t, bassHz, dt * 1.6, 1);
    if (s === 0 || s === 8) {
      const leadIv = chord[(bar + s) % chord.length] + 12;
      scheduleLead(ctx, buses.lead, t, midiToHz(rootMidi + leadIv + 12), dt * 3, 1);
    }
    t += dt;
  }
}

function makeBuses(ctx: BaseAudioContext, mix: MixState, master: AudioNode) {
  const buses = {} as Record<MixId, GainNode>;
  (["drums", "bass", "harmony", "lead", "vocals"] as MixId[]).forEach((id) => {
    const g = ctx.createGain();
    g.gain.value = mixGain(mix, id);
    g.connect(master);
    buses[id] = g;
  });
  return buses;
}

export function songDuration(arr: Arrangement) {
  return arr.bars * (60 / arr.bpm) * 4;
}

export async function bounceArrangement(
  arr: Arrangement,
  mix: MixState,
  vocal?: AudioBuffer | null,
): Promise<AudioBuffer> {
  const sr = 44100;
  const dur = songDuration(arr);
  const ctx = new OfflineAudioContext(2, Math.ceil(sr * dur), sr);
  const master = ctx.createGain();
  master.gain.value = 0.9;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.ratio.value = 3;
  master.connect(comp);
  comp.connect(ctx.destination);
  const buses = makeBuses(ctx, mix, master);
  const noise = noiseBuffer(ctx, 0.2);
  const barDur = (60 / arr.bpm) * 4;
  for (let b = 0; b < arr.bars; b++) {
    scheduleBar(ctx, buses, noise, arr, b, b * barDur);
  }
  if (vocal && mixGain(mix, "vocals") > 0) {
    const src = ctx.createBufferSource();
    src.buffer = vocal;
    src.connect(buses.vocals);
    src.start(barDur * Math.min(8, Math.max(0, arr.bars - 8)));
  }
  return ctx.startRendering();
}

export async function bounceToUrl(
  arr: Arrangement,
  mix: MixState,
  vocal?: AudioBuffer | null,
): Promise<string> {
  const buf = await bounceArrangement(arr, mix, vocal);
  return URL.createObjectURL(bufferToWav(buf));
}

export class LivePlayer {
  private ctx: AudioContext | null = null;
  private timer: number | null = null;
  private nextBar = 0;
  private nextTime = 0;
  private buses: Record<MixId, GainNode> | null = null;
  private noise: AudioBuffer | null = null;
  private playing = false;
  arrangement: Arrangement | null = null;
  mix: MixState = DEFAULT_MIX;
  onBar: ((bar: number) => void) | null = null;

  get isPlaying() {
    return this.playing;
  }

  async start(arr: Arrangement, mix: MixState) {
    this.stop();
    this.arrangement = arr;
    this.mix = mix;
    const ctx = new AudioContext();
    this.ctx = ctx;
    if (ctx.state === "suspended") await ctx.resume();
    const master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    this.buses = makeBuses(ctx, mix, master);
    this.noise = noiseBuffer(ctx, 0.2);
    this.nextBar = 0;
    this.nextTime = ctx.currentTime + 0.05;
    this.playing = true;
    this.tick();
  }

  setMix(mix: MixState) {
    this.mix = mix;
    if (!this.buses) return;
    (Object.keys(this.buses) as MixId[]).forEach((id) => {
      this.buses![id].gain.value = mixGain(mix, id);
    });
  }

  stop() {
    this.playing = false;
    if (this.timer != null) window.clearTimeout(this.timer);
    this.timer = null;
    void this.ctx?.close();
    this.ctx = null;
    this.buses = null;
  }

  private tick = () => {
    if (!this.playing || !this.ctx || !this.arrangement || !this.buses || !this.noise) return;
    const ctx = this.ctx;
    const arr = this.arrangement;
    const barDur = (60 / arr.bpm) * 4;
    while (this.nextTime < ctx.currentTime + 0.35) {
      const bar = this.nextBar % arr.bars;
      scheduleBar(ctx, this.buses, this.noise, arr, bar, this.nextTime);
      this.onBar?.(bar);
      this.nextBar += 1;
      this.nextTime += barDur;
    }
    this.timer = window.setTimeout(this.tick, 80);
  };
}

export const livePlayer = new LivePlayer();

export function extractSingable(lyrics: string, maxChars = 420): string {
  if (!lyrics.trim()) return "";
  const chunks = lyrics.split(/\n(?=\[)/);
  const chorus = chunks.find((p) => /\[(chorus|hook)/i.test(p));
  const src = chorus ?? lyrics;
  return src.replace(/\[[^\]]*]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxChars);
}

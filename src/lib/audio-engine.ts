export type BpmResult = { bpm: number; confidence: number };

export function estimateBpm(buffer: AudioBuffer): BpmResult {
  const data = buffer.getChannelData(0);
  const sr = buffer.sampleRate;
  const hop = Math.floor(sr * 0.01);
  const energy: number[] = [];
  for (let i = 0; i + hop < data.length; i += hop) {
    let sum = 0;
    for (let j = 0; j < hop; j++) sum += Math.abs(data[i + j]);
    energy.push(sum / hop);
  }

  const flux: number[] = [0];
  for (let i = 1; i < energy.length; i++) {
    flux.push(Math.max(0, energy[i] - energy[i - 1]));
  }

  const mean = flux.reduce((a, b) => a + b, 0) / flux.length;
  const peaks: number[] = [];
  for (let i = 1; i < flux.length - 1; i++) {
    if (flux[i] > flux[i - 1] && flux[i] > flux[i + 1] && flux[i] > mean * 1.4) {
      peaks.push(i);
    }
  }

  const gaps = peaks
    .slice(1)
    .map((p, i) => (p - peaks[i]) * 0.01)
    .filter((x) => x > 0.25 && x < 1.6);

  if (!gaps.length) return { bpm: 120, confidence: 0.2 };

  const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  let bpm = Math.round(60 / avg);
  while (bpm < 70) bpm *= 2;
  while (bpm > 180) bpm = Math.round(bpm / 2);
  const confidence = Math.min(1, gaps.length / 40);
  return { bpm, confidence };
}

const NOTE_NAMES = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
] as const;

export function estimateKey(buffer: AudioBuffer): string {
  const data = buffer.getChannelData(0);
  const sr = buffer.sampleRate;
  const bins = new Array<number>(12).fill(0);
  const step = Math.max(1, Math.floor(data.length / 8000));
  const window = 2048;

  for (let start = 0; start + window < data.length; start += window * 4) {
    let bestLag = 0;
    let best = 0;
    const minLag = Math.floor(sr / 800);
    const maxLag = Math.floor(sr / 70);
    for (let lag = minLag; lag < maxLag; lag += 2) {
      let corr = 0;
      for (let i = 0; i < window; i += step) {
        corr += data[start + i] * data[start + i + lag];
      }
      if (corr > best) {
        best = corr;
        bestLag = lag;
      }
    }
    if (!bestLag) continue;
    const freq = sr / bestLag;
    const midi = Math.round(69 + 12 * Math.log2(freq / 440));
    bins[((midi % 12) + 12) % 12] += 1;
  }

  let root = 0;
  for (let i = 1; i < 12; i++) if (bins[i] > bins[root]) root = i;
  const majorThird = bins[(root + 4) % 12];
  const minorThird = bins[(root + 3) % 12];
  return minorThird > majorThird ? `${NOTE_NAMES[root]}m` : NOTE_NAMES[root];
}

export type BeatAnalysis = {
  bpm: number;
  confidence: number;
  key: string;
  genre: string;
  mood: string;
  duration: number;
};

export function analyzeBeat(buffer: AudioBuffer): BeatAnalysis {
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
    duration: buffer.duration,
  };
}


export function centerCancel(buffer: AudioBuffer): AudioBuffer {
  const ctx = new OfflineAudioContext(2, buffer.length, buffer.sampleRate);
  const out = ctx.createBuffer(2, buffer.length, buffer.sampleRate);
  const l = buffer.getChannelData(0);
  const r =
    buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : buffer.getChannelData(0);
  const x = out.getChannelData(0);
  const y = out.getChannelData(1);
  for (let i = 0; i < buffer.length; i++) {
    const v = (l[i] - r[i]) * 0.72;
    x[i] = v;
    y[i] = v;
  }
  return out;
}

export function bufferToWav(buffer: AudioBuffer): Blob {
  const ch = buffer.numberOfChannels;
  const n = buffer.length;
  const ab = new ArrayBuffer(44 + n * ch * 2);
  const v = new DataView(ab);
  let p = 0;
  const w = (s: string) => {
    for (const c of s) v.setUint8(p++, c.charCodeAt(0));
  };
  const u32 = (x: number) => {
    v.setUint32(p, x, true);
    p += 4;
  };
  const u16 = (x: number) => {
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
  for (let i = 0; i < n; i++) {
    for (let c = 0; c < ch; c++) {
      const x = Math.max(-1, Math.min(1, buffer.getChannelData(c)[i]));
      v.setInt16(p, x < 0 ? x * 32768 : x * 32767, true);
      p += 2;
    }
  }
  return new Blob([ab], { type: "audio/wav" });
}

export function freqToNote(freq: number): { name: string; midi: number } {
  if (freq < 50 || freq > 2000) return { name: "—", midi: -1 };
  const midi = Math.round(69 + 12 * Math.log2(freq / 440));
  const name = NOTE_NAMES[((midi % 12) + 12) % 12];
  return { name, midi };
}

export function detectPitch(samples: Float32Array, sampleRate: number): number {
  const minLag = Math.floor(sampleRate / 900);
  const maxLag = Math.floor(sampleRate / 70);
  let bestLag = 0;
  let best = 0;
  for (let lag = minLag; lag < maxLag; lag++) {
    let corr = 0;
    for (let i = 0; i < samples.length - lag; i++) {
      corr += samples[i] * samples[i + lag];
    }
    if (corr > best) {
      best = corr;
      bestLag = lag;
    }
  }
  if (!bestLag || best < 0.01) return 0;
  return sampleRate / bestLag;
}

export function detectOnsetEnergy(samples: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
  return sum / samples.length;
}

export function trimBuffer(buffer: AudioBuffer, startPct: number, endPct: number): AudioBuffer {
  const a = Math.max(0, Math.min(1, startPct));
  const b = Math.max(a + 0.02, Math.min(1, endPct));
  const start = Math.floor(buffer.length * a);
  const end = Math.floor(buffer.length * b);
  const len = Math.max(1, end - start);
  const ctx = new OfflineAudioContext(buffer.numberOfChannels, len, buffer.sampleRate);
  const out = ctx.createBuffer(buffer.numberOfChannels, len, buffer.sampleRate);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    out.getChannelData(c).set(buffer.getChannelData(c).subarray(start, start + len));
  }
  return out;
}

export function reduceNoise(buffer: AudioBuffer): AudioBuffer {
  const out = new OfflineAudioContext(
    buffer.numberOfChannels,
    buffer.length,
    buffer.sampleRate,
  ).createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  const thresh = 0.018;
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const src = buffer.getChannelData(c);
    const dst = out.getChannelData(c);
    let prev = 0;
    for (let i = 0; i < src.length; i++) {
      const hp = src[i] - prev * 0.97;
      prev = src[i];
      const a = Math.abs(hp);
      dst[i] = a < thresh ? hp * (a / thresh) * 0.35 : hp;
    }
  }
  return out;
}

export function addEcho(buffer: AudioBuffer, delayMs = 280, mix = 0.32): AudioBuffer {
  const delay = Math.floor((delayMs / 1000) * buffer.sampleRate);
  const out = new OfflineAudioContext(
    buffer.numberOfChannels,
    buffer.length + delay,
    buffer.sampleRate,
  ).createBuffer(buffer.numberOfChannels, buffer.length + delay, buffer.sampleRate);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const src = buffer.getChannelData(c);
    const dst = out.getChannelData(c);
    dst.set(src);
    for (let i = 0; i < src.length; i++) {
      dst[i + delay] += src[i] * mix;
    }
  }
  return out;
}

export async function mixOntoTrack(bedUrl: string, vocalBlob: Blob, vocalGain = 0.82): Promise<string> {
  const ac = new AudioContext();
  const bed = await ac.decodeAudioData(await (await fetch(bedUrl)).arrayBuffer());
  const vocal = await ac.decodeAudioData(await vocalBlob.arrayBuffer());
  const sr = ac.sampleRate;
  const length = Math.max(bed.length, vocal.length);
  const offline = new OfflineAudioContext(2, length, sr);
  const bedSrc = offline.createBufferSource();
  bedSrc.buffer = bed;
  const bedGain = offline.createGain();
  bedGain.gain.value = 0.92;
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

export function b64ToBlob(b64: string, mime: string): Blob {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

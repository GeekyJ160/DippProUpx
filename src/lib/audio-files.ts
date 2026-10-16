/** Extensions first — iOS Files greys out Downloads MP3s if accept is only `audio/*`. */
export const AUDIO_ACCEPT =
  ".mp3,.MP3,.wav,.WAV,.m4a,.M4A,.aac,.AAC,.ogg,.oga,.flac,.mp4,.mpeg,.mpg,.aiff,.aif,.caf,.webm,.opus";

const AUDIO_EXT =
  /\.(mp3|wav|wave|m4a|aac|ogg|oga|flac|mp4|m4v|mpeg|mpg|aiff|aif|caf|webm|opus)$/i;

export function looksLikeAudio(file: File): boolean {
  if (file.type.startsWith("audio/") || file.type.startsWith("video/")) return true;
  return AUDIO_EXT.test(file.name);
}

function AudioCtor(): typeof AudioContext {
  const w = window as unknown as {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  const Ctor = w.AudioContext ?? w.webkitAudioContext;
  if (!Ctor) throw new Error("This browser cannot decode audio");
  return Ctor;
}

function decodeWithContext(ctx: AudioContext, raw: ArrayBuffer): Promise<AudioBuffer> {
  const copy = raw.slice(0);
  try {
    const result = ctx.decodeAudioData(copy);
    if (result && typeof result.then === "function") return result;
  } catch {
    /* Safari callback form below */
  }
  return new Promise((resolve, reject) => {
    ctx.decodeAudioData(raw.slice(0), resolve, reject);
  });
}

export async function decodeAudioFile(file: File): Promise<AudioBuffer> {
  const ctx = new (AudioCtor())();
  if (ctx.state === "suspended") void ctx.resume().catch(() => undefined);
  const raw = await file.arrayBuffer();
  try {
    const buffer = await decodeWithContext(ctx, raw);
    await ctx.close().catch(() => undefined);
    return buffer;
  } catch (err) {
    await ctx.close().catch(() => undefined);
    throw err;
  }
}

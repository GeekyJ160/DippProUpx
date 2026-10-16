import { useRef, useState } from "react";
import { ImagePlus, Pause, Play, Sparkles, Music2, X } from "lucide-react";
import { toast } from "sonner";
import { generateLyrics, LENGTHS } from "@/lib/ai-lyrics";
import { analyzeBeat } from "@/lib/audio-engine";
import { AUDIO_ACCEPT, decodeAudioFile, looksLikeAudio } from "@/lib/audio-files";
import { bounceToUrl, livePlayer } from "@/lib/song-engine";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStudio } from "@/store/studio-store";

function readPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 768;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image"));
    };
    img.src = url;
  });
}

function peaksFromBuffer(buffer: AudioBuffer, bars = 48) {
  const data = buffer.getChannelData(0);
  const size = Math.max(1, Math.floor(data.length / bars));
  const peaks: number[] = [];
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
  const max = Math.max(...peaks, 0.001);
  return peaks.map((value) => value / max);
}

export function CreatePanel() {
  const {
    prompt, genre, mood, length, lyrics, bpm, key, photoDataUrl,
    beatUrl, beatName, setPrompt, setGenre, setMood, setLyrics, setTab,
    setPhotoDataUrl, setBeat, setTitle, setSongId, rebuildArrangement,
    setTrackUrl, mix, setPlaying, mode, setBpm, setKey,
  } = useStudio();
  const [busy, setBusy] = useState(false);
  const [readingBeat, setReadingBeat] = useState(false);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [beatPlaying, setBeatPlaying] = useState(false);
  const [status, setStatus] = useState(
    "Drop a beat to write to it, or start with a photo / text idea.",
  );
  const photoRef = useRef<HTMLInputElement>(null);
  const beatRef = useRef<HTMLInputElement>(null);
  const beatAudioRef = useRef<HTMLAudioElement>(null);
  const lengthLabel = LENGTHS.find((l) => l.value === length)?.label ?? "16 bars";

  async function onPhoto(file: File | undefined) {
    if (!file) return;
    try {
      setPhotoDataUrl(await readPhoto(file));
    } catch {
      toast.error("Could not read that image");
    }
  }

  async function onBeat(file: File | undefined) {
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
      setStatus(
        `Writing to ${file.name} · ${analysis.bpm} BPM · ${analysis.key} · ${analysis.genre} / ${analysis.mood}`,
      );
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
      const result = await generateLyrics({
        data: {
          topic: prompt,
          genre,
          mood,
          length,
          photoDataUrl,
          mode: "full",
          bpm,
          key,
          writingToBeat: Boolean(beatUrl),
        },
      });
      if (!result.ok) {
        setStatus(result.error);
        toast.error(result.error);
        return;
      }
      setLyrics(result.text);
      setSongId(null);
      const titleLine = result.text.split("\n").find((l) => l.trim());
      setTitle(
        (titleLine ?? "Untitled").replace(/^\[Title]\s*/i, "").replace(/[\[\]]/g, "").trim() || "Untitled",
      );
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

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
      <Card>
        <CardTitle>Turn an idea into a song</CardTitle>
        <p className="mt-2 text-sm text-muted">
          {genre} · {mood} · {lengthLabel}
          <button
            type="button"
            className="ml-2 font-medium text-accent"
            onClick={() => setTab("settings")}
          >
            Change in Settings
          </button>
        </p>
        <CardDesc>
          Drop the beat you want to write to. We read BPM, key, and style so the lyrics sit in the pocket.
        </CardDesc>
        <div className="mt-5 grid gap-2">
          <Label htmlFor="prompt">Text prompt</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A victorious late-night anthem about building something from nothing…"
          />
        </div>
        <div className="mt-4 grid gap-2">
          <Label>Beat / instrumental</Label>
          <input
            ref={beatRef}
            id="beat-file"
            type="file"
            accept={AUDIO_ACCEPT}
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              void onBeat(f);
            }}
          />
          {beatUrl ? (
            <div className="rounded-lg border border-border bg-bg p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 truncate text-sm font-medium">
                    <Music2 className="size-4 shrink-0 text-accent" />
                    {beatName ?? "Uploaded beat"}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {bpm} BPM · {key ?? "key unknown"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9"
                    aria-label={beatPlaying ? "Pause beat" : "Play beat"}
                    onClick={() => {
                      const el = beatAudioRef.current;
                      if (!el) return;
                      if (el.paused) void el.play();
                      else el.pause();
                    }}
                  >
                    {beatPlaying ? <Pause /> : <Play />}
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <label htmlFor="beat-file">Replace</label>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9"
                    onClick={() => {
                      beatAudioRef.current?.pause();
                      setBeatPlaying(false);
                      setPeaks([]);
                      setBeat(null, null);
                      setStatus("Beat cleared. Drop another, or Create without one.");
                    }}
                    aria-label="Remove beat"
                  >
                    <X />
                  </Button>
                </div>
              </div>
              {peaks.length ? (
                <div className="mt-3 flex h-12 items-end gap-0.5" aria-hidden="true">
                  {peaks.map((peak, index) => (
                    <span
                      key={index}
                      className="flex-1 rounded-sm bg-accent"
                      style={{ height: `${Math.max(8, peak * 100)}%` }}
                    />
                  ))}
                </div>
              ) : null}
              <audio
                ref={beatAudioRef}
                className="hidden"
                src={beatUrl}
                onPlay={() => setBeatPlaying(true)}
                onPause={() => setBeatPlaying(false)}
                onEnded={() => setBeatPlaying(false)}
              />
            </div>
          ) : (
            <label
              htmlFor="beat-file"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                void onBeat(e.dataTransfer.files[0]);
              }}
              className="flex min-h-24 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-bg px-4 py-5 text-sm text-muted hover:border-accent/40 hover:text-fg"
            >
              <Music2 className="size-4" />
              {readingBeat ? "Reading the beat…" : "Drop or attach MP3 / WAV / M4A"}
            </label>
          )}
        </div>
        <div className="mt-4 grid gap-2">
          <Label>Photo inspiration</Label>
          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => void onPhoto(e.target.files?.[0])} />
          <button
            type="button"
            onClick={() => photoRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              void onPhoto(e.dataTransfer.files[0]);
            }}
            className="flex min-h-20 items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-bg px-4 py-5 text-sm text-muted hover:border-accent/40 hover:text-fg"
          >
            <ImagePlus className="size-4" />
            {photoDataUrl ? "Replace photo" : "Drop or attach a photo"}
          </button>
          {photoDataUrl ? (
            <img src={photoDataUrl} alt="Inspiration" className="mt-1 max-h-40 w-full rounded-md object-cover" />
          ) : null}
        </div>
        <Button className="mt-5 w-full" size="lg" disabled={busy || readingBeat} onClick={() => void onCreate()}>
          <Sparkles />
          {busy ? "Creating…" : beatUrl ? "Write to this beat" : "Create song"}
        </Button>
        <p className="mt-4 rounded-md border border-dashed border-border bg-bg px-3 py-3 text-sm text-muted">{status}</p>
      </Card>
      <Card>
        <CardTitle>Song blueprint</CardTitle>
        <dl className="mt-4 divide-y divide-border">
          {[
            ["Beat", beatName ?? "None — we'll make one"],
            ["Genre", genre],
            ["Mood", mood],
            ["Length", lengthLabel],
            ["BPM", String(bpm)],
            ["Key", key ?? "—"],
            ["Draft", lyrics.trim() ? "Ready" : "Not created"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-3 py-3 text-sm">
              <dt className="shrink-0 text-muted">{k}</dt>
              <dd className="truncate text-right font-medium text-accent">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}

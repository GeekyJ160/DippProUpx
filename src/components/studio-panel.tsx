import { useEffect, useRef, useState } from "react";
import { Download, MicOff, Scissors, Volume2, Waves } from "lucide-react";
import { toast } from "sonner";
import {
  addEcho, bufferToWav, centerCancel, estimateBpm, estimateKey, reduceNoise, trimBuffer,
} from "@/lib/audio-engine";
import { AUDIO_ACCEPT, decodeAudioFile, looksLikeAudio } from "@/lib/audio-files";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useStudio } from "@/store/studio-store";

function waveformPoints(buffer: AudioBuffer, bins = 96): number[] {
  const data = buffer.getChannelData(0);
  const size = Math.max(1, Math.floor(data.length / bins));
  const points: number[] = [];
  for (let i = 0; i < bins; i += 1) {
    let peak = 0;
    const start = i * size;
    for (let j = 0; j < size; j += 16) {
      peak = Math.max(peak, Math.abs(data[start + j] ?? 0));
    }
    points.push(peak);
  }
  const max = Math.max(...points, 0.001);
  return points.map((n) => n / max);
}

export function StudioPanel() {
  const { bpm, key, setBpm, setKey, setTrackUrl } = useStudio();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const playerRef = useRef<HTMLAudioElement | null>(null);
  const sourceRef = useRef<AudioBuffer | null>(null);
  const urlRef = useRef<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [instrumental, setInstrumental] = useState<Blob | null>(null);
  const [wave, setWave] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [status, setStatus] = useState(
    "Import a stereo track to remove vocals, trim, reduce noise, or add echo.",
  );

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  function rememberUrl(next: string | null) {
    if (urlRef.current && urlRef.current !== next) URL.revokeObjectURL(urlRef.current);
    urlRef.current = next;
    setObjectUrl(next);
    if (next) setTrackUrl(next);
  }

  function pushBuffer(buffer: AudioBuffer, note: string) {
    sourceRef.current = buffer;
    setWave(waveformPoints(buffer));
    rememberUrl(URL.createObjectURL(bufferToWav(buffer)));
    setStatus(note);
  }

  async function onFile(file: File | undefined) {
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
      setStatus(
        `Decoded · ${tempo.bpm} BPM · ${detectedKey}. Click the waveform to scrub.`,
      );
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

  return (
    <Card>
      <CardTitle>Vocal remover & cleanup</CardTitle>
      <CardDesc>
        Pull an instrumental, trim a section, reduce noise, or add echo — then drop it under a cover.
      </CardDesc>
      <input
        ref={fileRef}
        id="studio-audio-file"
        type="file"
        accept={AUDIO_ACCEPT}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          void onFile(f);
        }}
      />
      <label
        htmlFor="studio-audio-file"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void onFile(e.dataTransfer.files[0]);
        }}
        className="mt-5 flex min-h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-bg px-4 py-8 text-sm text-muted hover:border-accent/40 hover:text-fg"
      >
        <Volume2 className="size-5" />
        <span>Drop or tap to upload</span>
        <span className="text-xs text-subtle">MP3, WAV, M4A, MP4</span>
      </label>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="accent">BPM {bpm || "—"}</Badge>
        <Badge>KEY {key ?? "—"}</Badge>
        <Select
          className="w-auto"
          defaultValue="1"
          onChange={(e) => {
            if (playerRef.current) playerRef.current.playbackRate = Number(e.target.value);
          }}
        >
          <option value="0.75">0.75×</option>
          <option value="1">1×</option>
          <option value="1.25">1.25×</option>
          <option value="1.5">1.5×</option>
        </Select>
        <Button variant="secondary" onClick={onRemove}><MicOff /> Remove vocals</Button>
        <Button
          variant="secondary"
          onClick={() => {
            if (!sourceRef.current) return setStatus("Load a file first.");
            pushBuffer(reduceNoise(sourceRef.current), "Noise reduced.");
          }}
        >
          <Waves /> Reduce noise
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            if (!sourceRef.current) return setStatus("Load a file first.");
            pushBuffer(addEcho(sourceRef.current), "Echo added.");
          }}
        >
          Add echo
        </Button>
        <Button variant="secondary" onClick={onDownload}><Download /> Download</Button>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div>
          <Label>Trim start {trimStart}%</Label>
          <input type="range" min={0} max={90} value={trimStart} className="mt-2 w-full accent-accent" onChange={(e) => setTrimStart(Number(e.target.value))} />
        </div>
        <div>
          <Label>Trim end {trimEnd}%</Label>
          <input type="range" min={10} max={100} value={trimEnd} className="mt-2 w-full accent-accent" onChange={(e) => setTrimEnd(Number(e.target.value))} />
        </div>
      </div>
      <Button
        className="mt-3"
        variant="secondary"
        onClick={() => {
          if (!sourceRef.current) return setStatus("Load a file first.");
          pushBuffer(trimBuffer(sourceRef.current, trimStart / 100, trimEnd / 100), "Section trimmed.");
        }}
      >
        <Scissors /> Apply trim
      </Button>
      <audio
        ref={playerRef}
        controls
        src={objectUrl ?? undefined}
        className="mt-4 w-full"
        onTimeUpdate={(event) => {
          const el = event.currentTarget;
          setProgress(el.duration ? el.currentTime / el.duration : 0);
        }}
      />
      {wave.length > 0 ? (
        <button
          type="button"
          aria-label="Scrub waveform"
          className="mt-3 flex h-16 w-full items-end gap-px rounded-md bg-bg px-1 py-2"
          onClick={(event) => {
            const el = playerRef.current;
            if (!el?.duration) return;
            const rect = event.currentTarget.getBoundingClientRect();
            const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
            el.currentTime = ratio * el.duration;
            setProgress(ratio);
          }}
        >
          {wave.map((peak, index) => (
            <span
              key={index}
              className={index / wave.length <= progress ? "bg-accent" : "bg-muted/40"}
              style={{ height: `${Math.max(8, peak * 100)}%`, width: "100%" }}
            />
          ))}
        </button>
      ) : null}
      <p className="mt-4 rounded-md border border-dashed border-border bg-bg px-3 py-3 text-sm text-muted">
        {status}
        {wave.length
          ? " Click the waveform to scrub. BPM estimation and center-channel vocal reduction run locally from decoded samples."
          : ""}
      </p>
    </Card>
  );
}

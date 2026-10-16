import { useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";
import { detectPitch, freqToNote } from "@/lib/audio-engine";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardTitle } from "@/components/ui/card";
import { useStudio } from "@/store/studio-store";

export function LivePanel() {
  const bpm = useStudio((s) => s.bpm);
  const [listening, setListening] = useState(false);
  const [note, setNote] = useState("—");
  const [freq, setFreq] = useState(0);
  const [level, setLevel] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => () => stop(), []);

  function stop() {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void ctxRef.current?.close();
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

  return (
    <Card>
      <CardTitle>Live pitch</CardTitle>
      <CardDesc>Check your note against the current {bpm} BPM pocket.</CardDesc>
      <div className="mt-6 flex items-end gap-6">
        <div>
          <div className="font-display text-6xl font-semibold tracking-tight">{note}</div>
          <div className="mt-1 font-mono text-sm text-muted">{freq ? `${freq} Hz` : "Waiting"}</div>
        </div>
        <div className="h-16 flex-1 overflow-hidden rounded-md bg-bg">
          <div className="h-full bg-accent" style={{ width: `${Math.round(level * 100)}%` }} />
        </div>
      </div>
      <Button className="mt-6" onClick={() => (listening ? stop() : void start())}>
        <Mic />
        {listening ? "Stop mic" : "Start mic"}
      </Button>
    </Card>
  );
}

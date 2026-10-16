import { useEffect, useState } from "react";
import { Pause, Play, Square } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardTitle } from "@/components/ui/card";
import { bounceToUrl, livePlayer, type MixId, type MixState } from "@/lib/song-engine";
import { cn } from "@/lib/utils";
import { useStudio } from "@/store/studio-store";

const TRACKS: { id: MixId; label: string }[] = [
  { id: "drums", label: "Drums" },
  { id: "bass", label: "Bass" },
  { id: "harmony", label: "Harmony" },
  { id: "lead", label: "Lead" },
  { id: "vocals", label: "Vocals" },
];

export function DawPanel() {
  const { mix, setMix, arrangement, rebuildArrangement, genre, mood, bpm, key, setTrackUrl, setPlaying, playing } = useStudio();
  const [bar, setBar] = useState(0);

  useEffect(() => {
    livePlayer.onBar = setBar;
    return () => {
      livePlayer.onBar = null;
    };
  }, []);

  function patch(next: MixState) {
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

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle>Studio DAW</CardTitle>
          <CardDesc>
            {genre} · {mood} · {bpm} BPM · {key ?? "—"}
          </CardDesc>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => void play()}><Play /> Play</Button>
          <Button size="sm" variant="secondary" onClick={stop}>
            {playing ? <Pause /> : <Square />} Stop
          </Button>
          <Button size="sm" variant="secondary" onClick={() => void bounce()}>Bounce mix</Button>
        </div>
      </div>
      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[520px] space-y-2">
          {TRACKS.map((t) => (
            <div key={t.id} className="grid items-center gap-2 sm:grid-cols-[92px_1fr_160px]">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className={cn("h-8 rounded-sm px-2 text-xs", mix.mute[t.id] ? "bg-elevated text-subtle" : "bg-bg text-fg")}
                  onClick={() => patch({ ...mix, mute: { ...mix.mute, [t.id]: !mix.mute[t.id] } })}
                >
                  M
                </button>
                <button
                  type="button"
                  className={cn("h-8 rounded-sm px-2 text-xs", mix.solo === t.id ? "bg-accent text-accent-fg" : "bg-bg text-muted")}
                  onClick={() => patch({ ...mix, solo: mix.solo === t.id ? null : t.id })}
                >
                  S
                </button>
                <span className="text-xs text-muted">{t.label}</span>
              </div>
              <div className="relative h-8 overflow-hidden rounded-sm bg-bg">
                <div className="absolute inset-y-0 bg-accent/25" style={{ width: `${((bar + 1) / bars) * 100}%` }} />
                <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${bars}, 1fr)` }}>
                  {Array.from({ length: bars }, (_, i) => (
                    <span key={i} className={cn("border-r border-border/60", i === bar && playing ? "bg-accent/40" : "")} />
                  ))}
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={mix.gains[t.id]}
                className="w-full accent-accent"
                onChange={(e) =>
                  patch({ ...mix, gains: { ...mix.gains, [t.id]: Number(e.target.value) } })
                }
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

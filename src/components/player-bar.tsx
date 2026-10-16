import { useEffect, useRef, useState } from "react";
import { Pause, Play, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { livePlayer } from "@/lib/song-engine";
import { useStudio } from "@/store/studio-store";

function clock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerBar() {
  const { trackUrl, title, lyrics, playing, setPlaying, arrangement, mix } = useStudio();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !trackUrl) return;
    setTime(0);
    setDuration(0);
    void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
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
      if (navigator.share) {
        await navigator.share({ title: title || "DIPP PRO song", text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Lyrics copied");
      }
    } catch {
      /* cancelled */
    }
  }

  return (
    <div className="transport fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg">
      {trackUrl ? (
        <input
          className="block w-full"
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(time, duration || 0)}
          aria-label="Playback position"
          onChange={(e) => {
            const next = Number(e.target.value);
            const el = audioRef.current;
            if (!el) return;
            el.currentTime = next;
            setTime(next);
          }}
        />
      ) : (
        <div className="h-px bg-border" />
      )}
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <Button
          size="icon"
          className="size-9 rounded-full"
          onClick={() => void toggle()}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause /> : <Play />}
        </Button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{title || "Untitled"}</div>
          <div className="font-mono text-[11px] text-subtle tabular-nums">
            {trackUrl ? `${clock(time)} / ${clock(duration)}` : "Live mix"}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => void share()}>
          <Share2 />
          Share
        </Button>
      </div>
      {trackUrl ? (
        <audio
          ref={audioRef}
          className="hidden"
          src={trackUrl}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
      ) : null}
    </div>
  );
}

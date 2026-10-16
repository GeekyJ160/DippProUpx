import { Mic2, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/store/studio-store";

export function ModeGate() {
  const setMode = useStudio((s) => s.setMode);

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-4xl place-items-center px-4 py-10">
      <div className="w-full">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">
          DIPP PRO · RhymeForge
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Make your own song
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Turn a photo, a text idea, or your own beat into lyrics and a track. Start in Writer
          to draft fast, or open Studio for a DAW with stems, covers, and a vocal remover.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("writer")}
            className="rounded-2xl border border-border bg-surface p-6 text-left hover:border-accent/40"
          >
            <PenLine className="size-5 text-accent" />
            <h2 className="mt-4 font-display text-xl font-semibold">Writer mode</h2>
            <p className="mt-2 text-sm text-muted">
              Drop a beat or a photo, pick a vibe, hit Create. Lyrics lock to
              the BPM and key, then you can edit and share.
            </p>
          </button>
          <button
            type="button"
            onClick={() => setMode("studio")}
            className="rounded-2xl border border-border bg-surface p-6 text-left hover:border-accent/40"
          >
            <Mic2 className="size-5 text-accent" />
            <h2 className="mt-4 font-display text-xl font-semibold">Studio mode</h2>
            <p className="mt-2 text-sm text-muted">
              A compact DAW: mix stems, voice covers, vocal remover, trim, echo,
              and noise cleanup.
            </p>
          </button>
        </div>
        <div className="mt-6">
          <Button variant="ghost" size="sm" onClick={() => setMode("writer")}>
            Skip to writer
          </Button>
        </div>
      </div>
    </div>
  );
}

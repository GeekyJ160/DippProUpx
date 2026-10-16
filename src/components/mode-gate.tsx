import { useStudio } from "@/store/studio-store";

export function ModeGate() {
  const setMode = useStudio((s) => s.setMode);

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-4 py-16">
      <div className="w-full">
        <p className="text-[11px] font-medium tracking-[0.16em] text-subtle uppercase">
          DIPP PRO
        </p>
        <h1 className="mt-3 max-w-lg font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Make your own song
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
          Start from a beat, a photo, or a line. Writer drafts. Studio mixes.
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("writer")}
            className="min-h-44 rounded-lg bg-fg p-5 text-left text-bg"
          >
            <p className="text-[11px] font-medium tracking-[0.14em] uppercase opacity-60">Start</p>
            <h2 className="mt-8 text-lg font-semibold">Writer</h2>
            <p className="mt-2 text-sm leading-relaxed opacity-70">
              Drop a beat, set the vibe, and write lyrics that sit on the BPM and key.
            </p>
          </button>
          <button
            type="button"
            onClick={() => setMode("studio")}
            className="min-h-44 rounded-lg border border-border bg-surface p-5 text-left hover:border-fg/30"
          >
            <p className="text-[11px] font-medium tracking-[0.14em] text-subtle uppercase">Mix</p>
            <h2 className="mt-8 text-lg font-semibold">Studio</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Mix stems, cut vocals, and clean a take without leaving the session.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

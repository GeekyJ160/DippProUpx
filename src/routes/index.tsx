import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AuthSlot } from "@/components/auth-slot";
import { CoverPanel } from "@/components/cover-panel";
import { CreatePanel } from "@/components/create-panel";
import { DawPanel } from "@/components/daw-panel";
import { DippyPanel } from "@/components/dippy-panel";
import { LibraryPanel } from "@/components/library-panel";
import { LivePanel } from "@/components/live-panel";
import { LyricsPanel } from "@/components/lyrics-panel";
import { ModeGate } from "@/components/mode-gate";
import { PlayerBar } from "@/components/player-bar";
import { SettingsPanel } from "@/components/settings-panel";
import { StoryPanel } from "@/components/story-panel";
import { StudioPanel } from "@/components/studio-panel";
import { cn } from "@/lib/utils";
import { type TabId, useStudio } from "@/store/studio-store";

export const Route = createFileRoute("/")({ component: Home });

const PRIMARY: Record<"writer" | "studio", { id: TabId; label: string }[]> = {
  writer: [
    { id: "create", label: "Create" },
    { id: "lyrics", label: "Lyrics" },
    { id: "dippy", label: "Chat" },
    { id: "daw", label: "Studio" },
  ],
  studio: [
    { id: "daw", label: "Studio" },
    { id: "create", label: "Create" },
    { id: "lyrics", label: "Lyrics" },
    { id: "dippy", label: "Chat" },
  ],
};

const MORE: Record<"writer" | "studio", { id: TabId; label: string }[]> = {
  writer: [
    { id: "cover", label: "Voice cover" },
    { id: "story", label: "Story song" },
    { id: "library", label: "Library" },
    { id: "settings", label: "Settings" },
  ],
  studio: [
    { id: "cover", label: "Voice cover" },
    { id: "studio", label: "Vocal remover" },
    { id: "live", label: "Live" },
    { id: "library", label: "Library" },
    { id: "settings", label: "Settings" },
  ],
};

function Home() {
  const tab = useStudio((s) => s.tab);
  const setTab = useStudio((s) => s.setTab);
  const bpm = useStudio((s) => s.bpm);
  const mode = useStudio((s) => s.mode);
  const setMode = useStudio((s) => s.setMode);
  const trackUrl = useStudio((s) => s.trackUrl);
  const arrangement = useStudio((s) => s.arrangement);
  const loadLocal = useStudio((s) => s.loadLocal);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    function close(event: MouseEvent) {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [moreOpen]);

  useEffect(() => {
    loadLocal();
  }, [loadLocal]);

  if (mode === "pick") {
    return (
      <div className="min-h-screen">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-6 sm:px-6">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-semibold tracking-tight">DIPP</span>
            <span className="text-[10px] font-medium tracking-[0.18em] text-subtle">PRO</span>
          </div>
          <AuthSlot />
        </header>
        <ModeGate />
      </div>
    );
  }

  const primary = PRIMARY[mode];
  const more = MORE[mode];
  const moreActive = more.find((item) => item.id === tab);

  return (
    <div
      className={cn(
        "mx-auto min-h-screen max-w-6xl px-4 pt-5 sm:px-6",
        trackUrl || arrangement ? "pb-32" : "pb-16",
      )}
    >
      <header className="sticky top-0 z-30 -mx-4 border-b border-border bg-bg px-4 sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-semibold tracking-tight">DIPP</span>
            <span className="text-[10px] font-medium tracking-[0.18em] text-subtle">PRO</span>
          </div>
          <div className="flex rounded-md border border-border p-0.5" role="group" aria-label="Mode">
            {(["writer", "studio"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  if (mode !== item) {
                    setMoreOpen(false);
                    setMode(item);
                  }
                }}
                className={cn(
                  "h-7 rounded-sm px-2.5 text-xs font-medium",
                  mode === item ? "bg-fg text-bg" : "text-muted hover:text-fg",
                )}
              >
                {item === "writer" ? "Writer" : "Studio"}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-4">
            <span className="font-mono text-xs text-muted tabular-nums">{bpm} BPM</span>
            <AuthSlot />
          </div>
        </div>

        <nav className="-mb-px flex gap-1 overflow-x-auto">
          {primary.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setMoreOpen(false);
                setTab(t.id);
              }}
              className={cn(
                "h-10 shrink-0 border-b-2 px-3 text-[13px] font-medium",
                tab === t.id ? "border-fg text-fg" : "border-transparent text-muted hover:text-fg",
              )}
            >
              {t.label}
            </button>
          ))}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              onClick={() => setMoreOpen((open) => !open)}
              className={cn(
                "h-10 border-b-2 px-3 text-[13px] font-medium",
                moreActive ? "border-fg text-fg" : "border-transparent text-muted hover:text-fg",
              )}
            >
              {moreActive ? moreActive.label : "More"}
            </button>
            {moreOpen ? (
              <div
                role="menu"
                className="absolute top-full left-0 z-30 mt-2 min-w-44 rounded-lg border border-border bg-surface p-1"
              >
                {more.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setTab(item.id);
                      setMoreOpen(false);
                    }}
                    className={cn(
                      "block h-11 w-full rounded-md px-3 text-left text-sm",
                      tab === item.id ? "bg-elevated text-fg" : "text-muted hover:bg-elevated hover:text-fg",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </nav>
      </header>

      <main className="mt-8">
        {tab === "create" ? <CreatePanel /> : null}
        {tab === "lyrics" ? <LyricsPanel /> : null}
        {tab === "cover" ? <CoverPanel /> : null}
        {tab === "daw" ? <DawPanel /> : null}
        {tab === "studio" ? <StudioPanel /> : null}
        {tab === "story" ? <StoryPanel /> : null}
        {tab === "live" ? <LivePanel /> : null}
        {tab === "library" ? <LibraryPanel /> : null}
        {tab === "dippy" ? <DippyPanel /> : null}
        {tab === "settings" ? <SettingsPanel /> : null}
      </main>

      <PlayerBar />
    </div>
  );
}

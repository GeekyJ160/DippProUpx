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
import { Badge } from "@/components/ui/badge";
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
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-5 sm:px-6">
          <div className="font-display text-2xl font-semibold tracking-tight">
            DIPP <span className="text-accent">PRO</span>
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
      <header className="flex flex-wrap items-center gap-3">
        <div>
          <div className="font-display text-2xl font-semibold tracking-tight">
            DIPP <span className="text-accent">PRO</span>
          </div>
          <p className="text-xs text-muted">RhymeForge</p>
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
                "h-9 rounded-sm px-3 text-sm font-medium",
                mode === item ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
              )}
            >
              {item === "writer" ? "Writer" : "Studio"}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="accent">
            <span className="tabular-nums">{bpm}</span> BPM
          </Badge>
          <AuthSlot />
        </div>
      </header>

      <nav className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {primary.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setMoreOpen(false);
              setTab(t.id);
            }}
            className={cn(
              "h-11 shrink-0 rounded-md border px-4 text-sm font-medium transition-colors duration-150",
              tab === t.id
                ? "border-accent bg-accent text-accent-fg"
                : "border-border bg-elevated text-muted hover:text-fg",
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
              "h-11 rounded-md border px-4 text-sm font-medium",
              moreActive
                ? "border-accent bg-accent text-accent-fg"
                : "border-border bg-elevated text-muted hover:text-fg",
            )}
          >
            {moreActive ? moreActive.label : "More"}
          </button>
          {moreOpen ? (
            <div
              role="menu"
              className="absolute left-0 z-30 mt-2 min-w-44 rounded-md border border-border bg-surface p-1 shadow-sm"
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
                    "block w-full rounded-sm px-3 py-2 text-left text-sm",
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

      <main className="mt-5">
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

      <footer className="mt-12 text-center text-xs text-subtle">
        DIPP PRO <span className="text-muted">RhymeForge</span>
      </footer>

      <PlayerBar />
    </div>
  );
}

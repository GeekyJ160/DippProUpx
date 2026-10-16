import { useMemo, useState } from "react";
import { PenLine, Plus, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { generateLyrics } from "@/lib/ai-lyrics";
import { analyzeFlow } from "@/lib/flow";
import { upsertLocalProject } from "@/lib/local-library";
import { saveSong } from "@/lib/songs";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useStudio } from "@/store/studio-store";

export function LyricsPanel({ onSaved }: { onSaved?: () => void }) {
  const {
    lyrics, setLyrics, genre, mood, prompt, length, bpm, key, title, songId, setSongId, setTitle, beatUrl,
    localId, setLocalId,
  } = useStudio();
  const user = useCurrentUser();
  const [busy, setBusy] = useState<string | null>(null);
  const flow = useMemo(() => analyzeFlow(lyrics), [lyrics]);

  async function runTool(mode: "hook" | "verse" | "rewrite") {
    if (mode !== "hook" && !lyrics.trim()) {
      toast.error("Write something first");
      return;
    }
    setBusy(mode);
    try {
      const result = await generateLyrics({
        data: {
          topic: prompt,
          genre,
          mood,
          length: mode === "rewrite" ? "8" : length,
          mode,
          existing: lyrics,
          bpm,
          key,
          writingToBeat: Boolean(beatUrl),
        },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      if (mode === "hook" || mode === "verse") {
        setLyrics(`${lyrics.trim()}\n\n${result.text}`.trim());
      } else {
        setLyrics(result.text);
      }
      toast.success(mode === "rewrite" ? "Rewritten" : "Added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(null);
    }
  }

  async function onSave() {
    if (!lyrics.trim()) {
      toast.error("Nothing to save");
      return;
    }
    setBusy("save");
    try {
      const first = lyrics.split("\n").find((l) => l.trim() && !l.startsWith("["));
      const nextTitle =
        title && title !== "Untitled" ? title : (first ?? "Untitled").slice(0, 72);
      const local = upsertLocalProject({
        id: localId ?? undefined,
        title: nextTitle,
        lyrics,
        prompt,
        genre,
        mood,
        length,
        bpm,
      });
      setLocalId(local.id);
      setTitle(local.title);
      if (user) {
        const row = await saveSong({
          data: { id: songId ?? undefined, title: nextTitle, lyrics, prompt, genre, mood, length, bpm },
        });
        if (row) setSongId(row.id);
        toast.success("Saved on this device and to your account");
      } else {
        toast.success("Saved in this browser");
      }
      onSaved?.();
    } catch {
      toast.error("Could not save");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr]">
      <Card>
        <CardTitle>Lyrics writer</CardTitle>
        <CardDesc>Edit every line. Tools rewrite, add a hook, or drop a verse.</CardDesc>
        <Textarea
          className="mt-5 min-h-96 font-mono text-sm leading-relaxed"
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder="[Title]&#10;[Verse 1]&#10;…"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" disabled={!!busy} onClick={() => void runTool("hook")}>
            <Plus /> {busy === "hook" ? "Writing…" : "Add hook"}
          </Button>
          <Button variant="secondary" disabled={!!busy} onClick={() => void runTool("verse")}>
            <PenLine /> {busy === "verse" ? "Writing…" : "Add verse"}
          </Button>
          <Button variant="secondary" disabled={!!busy} onClick={() => void runTool("rewrite")}>
            <RefreshCw /> {busy === "rewrite" ? "Rewriting…" : "Rewrite denser"}
          </Button>
          <Button disabled={!!busy} onClick={() => void onSave()}>
            <Save /> {busy === "save" ? "Saving…" : "Save"}
          </Button>
        </div>
      </Card>
      <Card>
        <CardTitle>Flow</CardTitle>
        <dl className="mt-4 divide-y divide-border text-sm">
          {[
            ["Lines", String(flow.lines)],
            ["Bars", String(flow.bars)],
            ["Rhyme hits", String(flow.rhymeHits)],
            ["Density", `${Math.round(flow.density * 100)}%`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-3">
              <dt className="text-muted">{k}</dt>
              <dd className="font-medium text-accent">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}

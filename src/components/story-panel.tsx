import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { generateLyrics } from "@/lib/ai-lyrics";
import { bounceToUrl, livePlayer } from "@/lib/song-engine";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStudio } from "@/store/studio-store";

export function StoryPanel() {
  const {
    setPrompt, setLyrics, setTab, setMood, setGenre, setSongId, setTitle,
    rebuildArrangement, mix, setTrackUrl, setPlaying,
  } = useStudio();
  const [beginning, setBeginning] = useState("");
  const [moments, setMoments] = useState("");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);

  async function onCreate() {
    const parts = [beginning, moments, details].map((s) => s.trim()).filter(Boolean);
    if (!parts.length) {
      toast.error("Add at least one part of the story");
      return;
    }
    const topic = parts.join(". ");
    setPrompt(topic);
    setMood("Emotional");
    setGenre("Hip-Hop");
    setBusy(true);
    try {
      const result = await generateLyrics({
        data: { topic, genre: "Hip-Hop", mood: "Emotional", length: "16", mode: "full" },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setLyrics(result.text);
      setSongId(null);
      const titleLine = result.text.split("\n").find((l) => l.trim());
      setTitle(
        (titleLine ?? "Untitled").replace(/^\[Title]\s*/i, "").replace(/[\[\]]/g, "").trim() || "Untitled",
      );
      livePlayer.stop();
      setTrackUrl(await bounceToUrl(rebuildArrangement(), mix));
      setPlaying(true);
      toast.success("Personal song created");
      setTab("lyrics");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
      <Card>
        <CardTitle>Give them a song about them</CardTitle>
        <CardDesc>The details only you know become the heart of the track.</CardDesc>
        <div className="mt-5 grid gap-2">
          <Label htmlFor="beginning">Your beginning</Label>
          <Textarea id="beginning" className="min-h-24" value={beginning} onChange={(e) => setBeginning(e.target.value)} placeholder="Where did your story start?" />
        </div>
        <div className="mt-4 grid gap-2">
          <Label htmlFor="moments">Your moments</Label>
          <Textarea id="moments" className="min-h-24" value={moments} onChange={(e) => setMoments(e.target.value)} placeholder="A night, a joke, a habit only they have…" />
        </div>
        <div className="mt-4 grid gap-2">
          <Label htmlFor="details">The details</Label>
          <Textarea id="details" className="min-h-24" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="What should the hook say?" />
        </div>
        <Button className="mt-5 w-full" size="lg" disabled={busy} onClick={() => void onCreate()}>
          <Heart />
          {busy ? "Writing…" : "Make the song"}
        </Button>
      </Card>
      <Card>
        <CardTitle>Story ingredients</CardTitle>
        <CardDesc>What the lyric draft will use</CardDesc>
        <div className="mt-4 space-y-3">
          {(
            [
              ["Beginning", beginning],
              ["Moments", moments],
              ["Details", details],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="rounded-lg border border-border bg-bg p-3">
              <div className="text-xs font-medium text-muted">{label}</div>
              <p className="mt-1 text-sm leading-relaxed text-fg/80">
                {value.trim() || "Not added yet"}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Specific places, sensory details, and real moments produce a more memorable lyric starting point.
        </p>
      </Card>
    </div>
  );
}

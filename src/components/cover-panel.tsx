import { useState } from "react";
import { Mic, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { synthesizeCover, VOICES } from "@/lib/ai-voice";
import { b64ToBlob, mixOntoTrack } from "@/lib/audio-engine";
import { bounceToUrl, extractSingable, livePlayer } from "@/lib/song-engine";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useStudio } from "@/store/studio-store";

export function CoverPanel() {
  const {
    lyrics, voiceId, setVoiceId, vocalUrl, setVocalUrl, setTrackUrl,
    arrangement, mix, rebuildArrangement, setPlaying, beatUrl,
  } = useStudio();
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(vocalUrl);

  async function makeCover() {
    const text = extractSingable(lyrics);
    if (!text) {
      toast.error("Write or generate lyrics first");
      return;
    }
    setBusy(true);
    try {
      const result = await synthesizeCover({ data: { text, voiceId } });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      const blob = b64ToBlob(result.b64, result.mime);
      const url = URL.createObjectURL(blob);
      setVocalUrl(url);
      setPreview(url);
      livePlayer.stop();
      if (beatUrl) {
        setTrackUrl(await mixOntoTrack(beatUrl, blob));
      } else {
        const ctx = new AudioContext();
        const vocal = await ctx.decodeAudioData(await blob.arrayBuffer());
        await ctx.close();
        const arr = arrangement ?? rebuildArrangement();
        setTrackUrl(await bounceToUrl(arr, mix, vocal));
      }
      setPlaying(true);
      toast.success("Voice cover ready");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Cover failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
      <Card>
        <CardTitle>Voice cover</CardTitle>
        <CardDesc>Render the hook with a vocalist voice and mix it onto the current beat.</CardDesc>
        <div className="mt-5 grid gap-2">
          <Label htmlFor="voice">Voice</Label>
          <Select id="voice" value={voiceId} onChange={(e) => setVoiceId(e.target.value)}>
            {VOICES.map((v) => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </Select>
        </div>
        <p className="mt-4 rounded-md bg-bg px-3 py-3 text-sm text-muted">
          {extractSingable(lyrics) || "No singable lines yet — generate a draft in Create first."}
        </p>
        <Button className="mt-5 w-full" size="lg" disabled={busy} onClick={() => void makeCover()}>
          <Sparkles />
          {busy ? "Rendering cover…" : "Create voice cover"}
        </Button>
        {preview ? <audio className="mt-4 w-full" controls src={preview} /> : null}
      </Card>
      <Card>
        <CardTitle>Your take</CardTitle>
        <CardDesc>Record a dry vocal over the beat, then mix it in Studio.</CardDesc>
        <p className="mt-6 flex items-start gap-2 text-sm text-muted">
          <Mic className="mt-0.5 size-4 shrink-0" />
          Use Live to check pitch, then import the recording in the vocal remover
          to build an instrumental bed for a cover.
        </p>
      </Card>
    </div>
  );
}

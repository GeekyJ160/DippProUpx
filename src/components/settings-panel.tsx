import { GENRES, LENGTHS, MOODS } from "@/lib/ai-lyrics";
import { VOICES } from "@/lib/ai-voice";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useStudio } from "@/store/studio-store";

export function SettingsPanel() {
  const {
    genre, setGenre, mood, setMood, length, setLength, bpm, setBpm,
    voiceId, setVoiceId, title, setTitle,
  } = useStudio();

  return (
    <Card>
      <CardTitle>Settings</CardTitle>
      <CardDesc>
        These stick in this browser and feed Create, Chat, Studio, and voice covers.
      </CardDesc>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="settings-title">Project title</Label>
          <Input id="settings-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="settings-bpm">BPM</Label>
          <Input
            id="settings-bpm"
            type="number"
            min={60}
            max={200}
            value={bpm}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (Number.isFinite(next)) setBpm(Math.min(200, Math.max(60, Math.round(next))));
            }}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="settings-genre">Genre</Label>
          <Select id="settings-genre" value={genre} onChange={(e) => setGenre(e.target.value)}>
            {GENRES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="settings-mood">Mood</Label>
          <Select id="settings-mood" value={mood} onChange={(e) => setMood(e.target.value)}>
            {MOODS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="settings-length">Length</Label>
          <Select id="settings-length" value={length} onChange={(e) => setLength(e.target.value)}>
            {LENGTHS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="settings-voice">Cover voice</Label>
          <Select id="settings-voice" value={voiceId} onChange={(e) => setVoiceId(e.target.value)}>
            {VOICES.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Button
        className="mt-6"
        variant="secondary"
        onClick={() => {
          setGenre("Hip-Hop");
          setMood("Triumphant");
          setLength("16");
          setBpm(92);
          setVoiceId("eve");
        }}
      >
        Reset defaults
      </Button>
    </Card>
  );
}

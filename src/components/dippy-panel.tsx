import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { askDippy, type DippyTurn } from "@/lib/ai-chat";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useStudio } from "@/store/studio-store";

const SUGGESTIONS = [
  "808 bassline tips",
  "How do I mix vocals?",
  "Write a hook for this track",
  "Chord ideas in this key",
  "Sidechain the kick",
];

export function DippyPanel() {
  const { bpm, key, genre, mood, lyrics, setLyrics, setTab } = useStudio();
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<DippyTurn[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(text?: string) {
    const message = (text ?? draft).trim();
    if (!message || busy) return;
    setDraft("");
    setError(null);
    const history = turns;
    setTurns((current) => [...current, { role: "user", text: message }]);
    setBusy(true);
    try {
      const result = await askDippy({
        data: { message, history, bpm, key, genre, mood, lyrics },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setTurns((current) => [...current, { role: "assistant", text: result.text }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dippy could not answer");
    } finally {
      setBusy(false);
    }
  }

  function dropIn(text: string) {
    const next = lyrics.trim() ? `${lyrics.trim()}\n\n${text.trim()}` : text.trim();
    setLyrics(next);
    setTab("lyrics");
    toast.success("Dropped into lyrics");
  }

  return (
    <Card className="flex min-h-[32rem] flex-col">
      <CardTitle>Dippy</CardTitle>
      <CardDesc>
        Producer chat for this session · {genre} · {mood} · {bpm} BPM{key ? ` · ${key}` : ""}
      </CardDesc>

      <div className="mt-5 flex min-h-64 flex-1 flex-col gap-3 overflow-y-auto rounded-lg border border-border bg-bg p-3">
        {turns.length === 0 ? (
          <p className="text-sm text-muted">
            Ask about the mix, the pocket, or a hook. Dippy can see the lyrics already on the page.
          </p>
        ) : (
          turns.map((turn, index) => (
            <div key={`${turn.role}-${index}`} className={turn.role === "user" ? "ml-auto max-w-[85%]" : "max-w-[85%]"}>
              <div className="mb-1 text-xs font-medium text-muted">
                {turn.role === "user" ? "You" : "Dippy"}
              </div>
              <div
                className={
                  turn.role === "user"
                    ? "rounded-lg border border-border bg-elevated px-3 py-2 text-sm leading-relaxed"
                    : "rounded-lg border border-border bg-surface px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap"
                }
              >
                {turn.text}
              </div>
              {turn.role === "assistant" ? (
                <Button className="mt-2" variant="ghost" size="sm" onClick={() => dropIn(turn.text)}>
                  Drop into lyrics
                </Button>
              ) : null}
            </div>
          ))
        )}
        {busy ? <p className="text-sm text-muted">Dippy is writing…</p> : null}
        {error ? <p className="text-sm text-danger">{error}</p> : null}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {SUGGESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            disabled={busy}
            onClick={() => void send(item)}
            className="h-9 shrink-0 rounded-md border border-border bg-elevated px-3 text-xs text-muted hover:text-fg disabled:opacity-40"
          >
            {item}
          </button>
        ))}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask Dippy about this track"
          disabled={busy}
        />
        <Button type="submit" disabled={busy || !draft.trim()} aria-label="Send">
          <Send />
          Send
        </Button>
      </form>
    </Card>
  );
}

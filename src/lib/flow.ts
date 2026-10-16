export type FlowReport = {
  lines: number;
  bars: number;
  rhymeHits: number;
  density: number;
};

const STOP = new Set(["the", "a", "an", "and", "or", "to", "of", "in", "on", "my", "i", "you", "we"]);

function lastWord(line: string) {
  const words = line
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w));
  return words.at(-1) ?? "";
}

function rhymeTail(word: string) {
  return word.slice(-3);
}

export function analyzeFlow(lyrics: string): FlowReport {
  const lines = lyrics
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("["));
  const tails = lines.map(lastWord).map(rhymeTail).filter(Boolean);
  const counts = new Map<string, number>();
  for (const t of tails) counts.set(t, (counts.get(t) ?? 0) + 1);
  const rhymeHits = [...counts.values()].filter((n) => n > 1).reduce((a, b) => a + b, 0);
  const bars = lines.length;
  const density = bars ? Math.min(1, rhymeHits / bars) : 0;
  return { lines: lines.length, bars, rhymeHits, density };
}

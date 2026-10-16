const KEY = "dipp_library";

export type LocalProject = {
  id: string;
  title: string;
  lyrics: string;
  prompt: string;
  genre: string;
  mood: string;
  length: string;
  bpm: number | null;
  timestamp: number;
};

function read(): LocalProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]") as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.filter(isProject);
  } catch {
    return [];
  }
}

function write(projects: LocalProject[]) {
  localStorage.setItem(KEY, JSON.stringify(projects));
}

export function isProject(value: unknown): value is LocalProject {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    typeof row.title === "string" &&
    typeof row.lyrics === "string" &&
    typeof row.prompt === "string" &&
    typeof row.genre === "string" &&
    typeof row.mood === "string" &&
    typeof row.length === "string" &&
    (row.bpm === null || typeof row.bpm === "number") &&
    typeof row.timestamp === "number"
  );
}

export function listLocalProjects(): LocalProject[] {
  return read().sort((a, b) => b.timestamp - a.timestamp);
}

export function upsertLocalProject(
  input: Omit<LocalProject, "id" | "timestamp"> & { id?: string },
): LocalProject {
  const projects = read();
  const existing = input.id ? projects.find((p) => p.id === input.id) : undefined;
  const next: LocalProject = {
    id: existing?.id ?? input.id ?? crypto.randomUUID(),
    title: input.title.trim() || "Untitled",
    lyrics: input.lyrics,
    prompt: input.prompt,
    genre: input.genre,
    mood: input.mood,
    length: input.length,
    bpm: input.bpm,
    timestamp: Date.now(),
  };
  const rest = projects.filter((p) => p.id !== next.id);
  write([next, ...rest]);
  return next;
}

export function deleteLocalProject(id: string) {
  write(read().filter((p) => p.id !== id));
}

export function mergeLocalProjects(incoming: LocalProject[]): number {
  const current = read();
  const ids = new Set(current.map((p) => p.id));
  const added = incoming.filter((p) => !ids.has(p.id));
  write([...added, ...current]);
  return added.length;
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function formatProjectDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

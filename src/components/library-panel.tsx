import { useRef, useState } from "react";
import { ChevronRight, Download, Library, Sparkles, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardTitle } from "@/components/ui/card";
import {
  deleteLocalProject,
  downloadJson,
  formatProjectDate,
  isProject,
  listLocalProjects,
  mergeLocalProjects,
  type LocalProject,
} from "@/lib/local-library";
import { useStudio } from "@/store/studio-store";

export function LibraryPanel() {
  const applyLocal = useStudio((s) => s.applyLocal);
  const setTab = useStudio((s) => s.setTab);
  const importRef = useRef<HTMLInputElement | null>(null);
  const [projects, setProjects] = useState<LocalProject[]>(() => listLocalProjects());

  function refresh() {
    setProjects(listLocalProjects());
  }

  async function importLibrary(file?: File) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      const rows = Array.isArray(parsed) ? parsed : [parsed];
      const valid = rows.filter(isProject);
      if (!valid.length) {
        toast.error("That file has no DIPP projects");
        return;
      }
      const added = mergeLocalProjects(valid);
      refresh();
      toast.success(added ? `Imported ${added} project${added === 1 ? "" : "s"}` : "Those projects are already here");
    } catch {
      toast.error("Could not read that JSON file");
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Library className="size-5 text-accent" />
              <CardTitle>Project library</CardTitle>
            </div>
            <CardDesc>
              Saved in this browser. Export a JSON backup before you clear site data.
            </CardDesc>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              ref={importRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => {
                void importLibrary(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
            <Button variant="secondary" size="sm" onClick={() => importRef.current?.click()}>
              <Upload />
              Import JSON
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!projects.length}
              onClick={() => downloadJson("dipp-pro-library.json", projects)}
            >
              <Download />
              Export library
            </Button>
          </div>
        </div>
      </Card>

      {!projects.length ? (
        <Card className="flex min-h-72 flex-col items-center justify-center text-center">
          <Library className="size-7 text-accent" />
          <h2 className="mt-4 font-display text-lg font-semibold">No saved projects yet</h2>
          <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted">
            Generate or write lyrics, then save the project from the Lyrics workspace.
          </p>
          <Button className="mt-5" onClick={() => setTab("create")}>
            <Sparkles />
            Create a track
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex min-h-72 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold">{project.title}</h2>
                  <p className="mt-1 text-xs text-muted">{formatProjectDate(project.timestamp)}</p>
                </div>
                <span className="shrink-0 rounded-full border border-border bg-elevated px-2.5 py-1 text-xs font-medium text-muted">
                  {project.genre}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-muted">
                <span className="rounded-full bg-bg px-2.5 py-1">{project.mood}</span>
                <span className="rounded-full bg-bg px-2.5 py-1">{project.length}</span>
              </div>
              {project.prompt ? (
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">{project.prompt}</p>
              ) : null}
              <p className="mt-4 line-clamp-6 whitespace-pre-wrap text-sm leading-relaxed text-fg/80">
                {project.lyrics}
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    applyLocal({
                      id: project.id,
                      title: project.title,
                      lyrics: project.lyrics,
                      prompt: project.prompt,
                      genre: project.genre,
                      mood: project.mood,
                      length: project.length,
                      bpm: project.bpm,
                    });
                  }}
                >
                  Open
                  <ChevronRight />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => downloadJson(`${project.title}.json`, project)}>
                  <Download />
                  Export
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    deleteLocalProject(project.id);
                    refresh();
                    toast.success(`Deleted ${project.title}`);
                  }}
                >
                  <Trash2 />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

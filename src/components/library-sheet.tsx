import { useEffect, useState } from "react";
import { Library, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteSong, listSongs, type SongRow } from "@/lib/songs";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/store/studio-store";

export function LibraryButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="secondary" size="sm" onClick={onClick}>
      <Library />
      Library
    </Button>
  );
}

export function LibrarySheet({
  open,
  onClose,
  refreshToken,
}: {
  open: boolean;
  onClose: () => void;
  refreshToken: number;
}) {
  const user = useCurrentUser();
  const applySong = useStudio((s) => s.applySong);
  const [songs, setSongs] = useState<SongRow[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open || !user) return;
    setBusy(true);
    listSongs()
      .then(setSongs)
      .catch(() => setSongs([]))
      .finally(() => setBusy(false));
  }, [open, user, refreshToken]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-bg/60" onClick={onClose}>
      <aside
        className="h-full w-full max-w-md overflow-y-auto border-l border-border bg-surface p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Library</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
        {!user ? (
          <p className="mt-6 text-sm text-muted">Sign in to keep songs across devices.</p>
        ) : busy ? (
          <p className="mt-6 text-sm text-muted">Loading…</p>
        ) : !songs.length ? (
          <p className="mt-6 text-sm text-muted">No saved songs yet.</p>
        ) : (
          <ul className="mt-6 space-y-2">
            {songs.map((s) => (
              <li key={s.id} className="flex items-start gap-2 rounded-lg border border-border bg-bg p-3">
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => {
                    applySong(s);
                    onClose();
                  }}
                >
                  <div className="truncate font-medium">{s.title}</div>
                  <div className="mt-1 text-xs text-muted">{s.genre} · {s.mood}</div>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  onClick={() => {
                    void deleteSong({ data: s.id }).then(() => {
                      setSongs((cur) => cur.filter((x) => x.id !== s.id));
                      toast.success("Deleted");
                    });
                  }}
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}

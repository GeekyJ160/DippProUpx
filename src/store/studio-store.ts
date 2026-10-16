import { create } from "zustand";
import {
  DEFAULT_MIX,
  arrangementKey,
  makeArrangement,
  type Arrangement,
  type MixState,
} from "@/lib/song-engine";

export type TabId =
  | "create"
  | "lyrics"
  | "studio"
  | "daw"
  | "cover"
  | "story"
  | "live"
  | "library"
  | "dippy"
  | "settings";

export type AppMode = "pick" | "writer" | "studio";

const LYRICS_KEY = "dipp_lyrics";
const DRAFT_KEY = "dipp_draft";
const MODE_KEY = "dipp_mode";

export type StudioState = {
  mode: AppMode;
  tab: TabId;
  prompt: string;
  genre: string;
  mood: string;
  length: string;
  lyrics: string;
  bpm: number;
  key: string | null;
  songId: number | null;
  localId: string | null;
  title: string;
  photoDataUrl: string | null;
  beatUrl: string | null;
  beatName: string | null;
  arrangement: Arrangement | null;
  mix: MixState;
  trackUrl: string | null;
  vocalUrl: string | null;
  voiceId: string;
  playing: boolean;
  setMode: (mode: AppMode) => void;
  setTab: (tab: TabId) => void;
  setPrompt: (v: string) => void;
  setGenre: (v: string) => void;
  setMood: (v: string) => void;
  setLength: (v: string) => void;
  setLyrics: (v: string) => void;
  setBpm: (v: number) => void;
  setKey: (v: string | null) => void;
  setSongId: (v: number | null) => void;
  setLocalId: (v: string | null) => void;
  setTitle: (v: string) => void;
  setPhotoDataUrl: (v: string | null) => void;
  setBeat: (url: string | null, name: string | null) => void;
  setArrangement: (a: Arrangement | null) => void;
  setMix: (m: MixState) => void;
  setTrackUrl: (v: string | null) => void;
  setVocalUrl: (v: string | null) => void;
  setVoiceId: (v: string) => void;
  setPlaying: (v: boolean) => void;
  rebuildArrangement: () => Arrangement;
  loadLocal: () => void;
  applySong: (s: {
    id: number;
    title: string;
    lyrics: string;
    prompt: string;
    genre: string;
    mood: string;
    length: string;
    bpm: number | null;
  }) => void;
  applyLocal: (s: {
    id: string;
    title: string;
    lyrics: string;
    prompt: string;
    genre: string;
    mood: string;
    length: string;
    bpm: number | null;
  }) => void;
};

function persistDraft(partial: Partial<StudioState>) {
  if (typeof window === "undefined") return;
  try {
    const current = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "{}") as Record<string, unknown>;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...current, ...partial }));
  } catch {
    /* ignore */
  }
}

export const useStudio = create<StudioState>((set, get) => ({
  mode: "pick",
  tab: "create",
  prompt: "",
  genre: "Hip-Hop",
  mood: "Triumphant",
  length: "16",
  lyrics: "",
  bpm: 92,
  key: null,
  songId: null,
  localId: null,
  title: "Untitled",
  photoDataUrl: null,
  beatUrl: null,
  beatName: null,
  arrangement: null,
  mix: DEFAULT_MIX,
  trackUrl: null,
  vocalUrl: null,
  voiceId: "eve",
  playing: false,
  setMode: (mode) => {
    if (typeof window !== "undefined") localStorage.setItem(MODE_KEY, mode);
    const tab = mode === "studio" ? "daw" : "create";
    set({ mode, tab: mode === "pick" ? "create" : tab });
  },
  setTab: (tab) => set({ tab }),
  setPrompt: (prompt) => {
    persistDraft({ prompt } as Partial<StudioState>);
    set({ prompt });
  },
  setGenre: (genre) => {
    persistDraft({ genre } as Partial<StudioState>);
    set({ genre });
  },
  setMood: (mood) => {
    persistDraft({ mood } as Partial<StudioState>);
    set({ mood });
  },
  setLength: (length) => {
    persistDraft({ length } as Partial<StudioState>);
    set({ length });
  },
  setLyrics: (lyrics) => {
    if (typeof window !== "undefined") localStorage.setItem(LYRICS_KEY, lyrics);
    persistDraft({ lyrics } as Partial<StudioState>);
    set({ lyrics });
  },
  setBpm: (bpm) => {
    persistDraft({ bpm } as Partial<StudioState>);
    set({ bpm });
  },
  setKey: (key) => set({ key }),
  setSongId: (songId) => set({ songId }),
  setLocalId: (localId) => set({ localId }),
  setTitle: (title) => {
    persistDraft({ title } as Partial<StudioState>);
    set({ title });
  },
  setPhotoDataUrl: (photoDataUrl) => set({ photoDataUrl }),
  setBeat: (beatUrl, beatName) => {
    const prev = get().beatUrl;
    if (prev && prev !== beatUrl) URL.revokeObjectURL(prev);
    set({ beatUrl, beatName });
  },
  setArrangement: (arrangement) => set({ arrangement }),
  setMix: (mix) => set({ mix }),
  setTrackUrl: (trackUrl) => set({ trackUrl }),
  setVocalUrl: (vocalUrl) => set({ vocalUrl }),
  setVoiceId: (voiceId) => {
    persistDraft({ voiceId } as Partial<StudioState>);
    set({ voiceId });
  },
  setPlaying: (playing) => set({ playing }),
  rebuildArrangement: () => {
    const s = get();
    const arr = makeArrangement(
      s.genre,
      s.mood,
      s.length,
      s.key,
      s.beatUrl ? s.bpm : null,
    );
    set({ arrangement: arr, bpm: arr.bpm, key: s.key ?? arrangementKey(arr) });
    return arr;
  },
  loadLocal: () => {
    if (typeof window === "undefined") return;
    try {
      const lyrics = localStorage.getItem(LYRICS_KEY) ?? "";
      const modeRaw = localStorage.getItem(MODE_KEY);
      const mode: AppMode =
        modeRaw === "writer" || modeRaw === "studio" ? modeRaw : "pick";
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "{}") as Partial<StudioState>;
      set({
        mode,
        tab: mode === "studio" ? "daw" : "create",
        lyrics: draft.lyrics ?? lyrics,
        prompt: draft.prompt ?? "",
        genre: draft.genre ?? "Hip-Hop",
        mood: draft.mood ?? "Triumphant",
        length: draft.length ?? "16",
        bpm: typeof draft.bpm === "number" ? draft.bpm : 92,
        voiceId: typeof draft.voiceId === "string" ? draft.voiceId : "eve",
        title: typeof draft.title === "string" ? draft.title : "Untitled",
      });
    } catch {
      /* ignore */
    }
  },
  applySong: (s) => {
    set({
      songId: s.id,
      localId: null,
      title: s.title,
      lyrics: s.lyrics,
      prompt: s.prompt,
      genre: s.genre,
      mood: s.mood,
      length: s.length,
      bpm: s.bpm ?? 92,
      tab: "lyrics",
    });
    if (typeof window !== "undefined") localStorage.setItem(LYRICS_KEY, s.lyrics);
  },
  applyLocal: (s) => {
    set({
      songId: null,
      localId: s.id,
      title: s.title,
      lyrics: s.lyrics,
      prompt: s.prompt,
      genre: s.genre,
      mood: s.mood,
      length: s.length,
      bpm: s.bpm ?? 92,
      tab: "lyrics",
    });
    if (typeof window !== "undefined") localStorage.setItem(LYRICS_KEY, s.lyrics);
  },
}));

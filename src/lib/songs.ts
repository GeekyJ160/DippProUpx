import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

export type SongRow = {
  id: number;
  title: string;
  lyrics: string;
  prompt: string;
  genre: string;
  mood: string;
  length: string;
  bpm: number | null;
  created_at: string;
  updated_at: string;
};

export const listSongs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<SongRow>`
      select id, title, lyrics, prompt, genre, mood, length, bpm, created_at, updated_at
      from songs
      where user_id = ${context.userId}
      order by updated_at desc
      limit 40
    `;
  });

export type SaveSongInput = {
  id?: number;
  title: string;
  lyrics: string;
  prompt: string;
  genre: string;
  mood: string;
  length: string;
  bpm?: number | null;
};

export const saveSong = createServerFn({ method: "POST" })
  .validator((input: SaveSongInput) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const title = data.title.trim() || "Untitled";
    const bpm = data.bpm ?? null;

    if (data.id) {
      const rows = await sql<SongRow>`
        update songs
        set title = ${title},
            lyrics = ${data.lyrics},
            prompt = ${data.prompt},
            genre = ${data.genre},
            mood = ${data.mood},
            length = ${data.length},
            bpm = ${bpm},
            updated_at = now()
        where id = ${data.id} and user_id = ${context.userId}
        returning id, title, lyrics, prompt, genre, mood, length, bpm, created_at, updated_at
      `;
      return rows[0] ?? null;
    }

    const rows = await sql<SongRow>`
      insert into songs (user_id, title, lyrics, prompt, genre, mood, length, bpm)
      values (${context.userId}, ${title}, ${data.lyrics}, ${data.prompt}, ${data.genre}, ${data.mood}, ${data.length}, ${bpm})
      returning id, title, lyrics, prompt, genre, mood, length, bpm, created_at, updated_at
    `;
    return rows[0] ?? null;
  });

export const deleteSong = createServerFn({ method: "POST" })
  .validator((id: number) => id)
  .middleware([authMiddleware])
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`delete from songs where id = ${id} and user_id = ${context.userId}`;
    return { ok: true as const };
  });

import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-Cw4xmW-w.mjs";
import { t as authMiddleware } from "./middleware-DJv7xoix.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/songs-BpVGUaZy.js
var listSongs_createServerFn_handler = createServerRpc({
	id: "6d6482416e7cd22cc25878415ecb974b8b6bd0dba5d07162c878882136879939",
	name: "listSongs",
	filename: "src/lib/songs.ts"
}, (opts) => listSongs.__executeServer(opts));
var listSongs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSongs_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, title, lyrics, prompt, genre, mood, length, bpm, created_at, updated_at
      from songs
      where user_id = ${context.userId}
      order by updated_at desc
      limit 40
    `;
});
var saveSong_createServerFn_handler = createServerRpc({
	id: "264047e15321919f45c1637d4a61d50ef3307e29a04e3eb2bae8f95b5dd428c4",
	name: "saveSong",
	filename: "src/lib/songs.ts"
}, (opts) => saveSong.__executeServer(opts));
var saveSong = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(saveSong_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const title = data.title.trim() || "Untitled";
	const bpm = data.bpm ?? null;
	if (data.id) return (await sql`
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
      `)[0] ?? null;
	return (await sql`
      insert into songs (user_id, title, lyrics, prompt, genre, mood, length, bpm)
      values (${context.userId}, ${title}, ${data.lyrics}, ${data.prompt}, ${data.genre}, ${data.mood}, ${data.length}, ${bpm})
      returning id, title, lyrics, prompt, genre, mood, length, bpm, created_at, updated_at
    `)[0] ?? null;
});
var deleteSong_createServerFn_handler = createServerRpc({
	id: "12bdf98dc2a47279ec62781589224202a5273d07e6478b13a6e7b253324d3059",
	name: "deleteSong",
	filename: "src/lib/songs.ts"
}, (opts) => deleteSong.__executeServer(opts));
var deleteSong = createServerFn({ method: "POST" }).validator((id) => id).middleware([authMiddleware]).handler(deleteSong_createServerFn_handler, async ({ context, data: id }) => {
	await (await getSql())`delete from songs where id = ${id} and user_id = ${context.userId}`;
	return { ok: true };
});
//#endregion
export { deleteSong_createServerFn_handler, listSongs_createServerFn_handler, saveSong_createServerFn_handler };

create table if not exists songs (
  id         serial primary key,
  user_id    text not null,
  title      text not null,
  lyrics     text not null default '',
  prompt     text not null default '',
  genre      text not null default 'Hip-Hop',
  mood       text not null default 'Triumphant',
  length     text not null default '16',
  bpm        integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists songs_user_id_idx on songs (user_id);

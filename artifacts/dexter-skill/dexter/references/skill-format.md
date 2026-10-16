# Skill format

A skill is a folder. The folder name is the skill name.

```
dexter/
  SKILL.md
  references/   # loaded only when the instructions point here
  scripts/      # only if the agent should run a file
  assets/       # templates or static files
```

`SKILL.md` starts with YAML frontmatter:

- `name`: lowercase, hyphens, matches the folder, 1–64 characters.
- `description`: what it does and when to use it, including the words a user would actually say. Max 1024 characters.

Keep `SKILL.md` short. Move long tables and examples into `references/` and link them with a relative path one level deep.

Do not invent a second install path inside the skill. Tell the user to copy the folder into their agent's skills directory.

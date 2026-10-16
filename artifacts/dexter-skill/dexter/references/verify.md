# Verify

Pick the checks that match the project. Run them. Read the output.

| Project | Check |
|---|---|
| Node / TypeScript app | typecheck, then the project's build or test script |
| Single HTML file | open it and exercise the control you changed |
| Python | run the script or the test file that covers the change |
| Skill | `name` matches the folder; description says what it does and when to use it |

A green typecheck is not enough for a UI change. Click the path the user will use.

If the dev server was already running, do not start a second one. Restart it only when the change requires a restart.

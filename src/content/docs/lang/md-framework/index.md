---
title: MD Framework
description: How a mod's code talks to the game.
---

:::caution[Placeholder section]
Prototype shows structure only. Pages to be filled after approval.
:::

## Core abstractions

- **Cue** — the building block of an MD script. Has conditions and actions.
- **Library** — reusable callable block (`purpose="run_actions"` or `purpose="cue_ref"`).
- **Action** — operations (`<set_value>`, `<create_ship>`, `<set_owner>`, `<run_actions>`, …).
- **Condition / Event** — triggers (`<event_cue_signalled>`, `<event_object_destroyed>`, `<check_value>`, …).
- **Expression** — variable access (`$x`, `.cargo.list`, `faction.argon.relationto.{X}`).

## Common questions (planned)

- *"How do I make a cue run periodically?"* → Cue → Attributes → `checktime` + `checkinterval`.
- *"How do I share state between scripts?"* → Expression → `global.$X` vs `md.X.$Y`.
- *"How do I version my mod's persistent state?"* → Cue → Attributes → `version=N` + `<patch sinceversion>`.
- *"How do I write a reusable function in MD?"* → Library → `purpose=run_actions` example.

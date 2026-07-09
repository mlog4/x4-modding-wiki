---
title: Boarding operation
description: Engine object representing an in-progress boarding action. Tracks phases, marines, target ship state. Stub page.
---

**Boarding operation** is the **engine object representing an in-progress boarding action**. When a player or NPC ship initiates boarding against a target, a boarding-operation is created and tracks the operation's lifecycle.

## Common phases

- **Approach** — boarders close on target ship
- **Infiltration** — boarders breach target hull
- **Internal combat** — marines fight target crew
- **Outcome** — capture success or failure

For full phase mechanics, see [Architectural overview: Boarding](/overviews/boarding/).

## Properties

- `.attacker` — the attacking ship
- `.target` — the boarded ship
- `.phase` — current phase
- `.marines` — boarders involved

## Common context

Boarding operations are created via:
- Player action: open Boarding menu → assign marines
- AI faction action: war subscription boarding missions
- Story actions: Erlking research arc

## Related

- [Ship](/game/objects/ship/) — boarding source and target
- [Crew](/game/factions/crew/) — marines used
- [Drop](/game/objects/drop/) — boarding pod / drop pod
- [Architectural overview: Boarding](/overviews/boarding/) — full mechanic walkthrough

---

*Stub page — full boarding operation reference coming.*

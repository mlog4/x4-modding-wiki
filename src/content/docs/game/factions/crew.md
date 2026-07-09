---
title: Crew
description: NPCs serving on a ship (pilot, captain, gunner, marines). Determines ship effectiveness. Stub page.
---

**Crew** are the **NPCs serving on a ship** — pilots, captains, gunners, engineers, marines. The crew's skill levels determine ship effectiveness, weapon accuracy, boarding success, and so on.

## Crew roles

- **Pilot** — flies S/M ships
- **Captain** — commands L/XL ships
- **Gunner** — fires turrets (M+)
- **Engineer** — repairs hull (M+)
- **Marines** — boarding force (L+)
- **Service crew** — defends ship interior

## Common access

```xml
<set_value name="$captain" exact="$ship.controlpost.aipilot"/>
<set_value name="$marines" exact="$ship.peoplerole.marine"/>
```

## Related

- [NPC](/game/characters/npc/) — generic NPC reference
- [Ship](/game/objects/ship/) — ships have crew
- [Pilot](/game/characters/) — pilot characters
- [Boarding](/overviews/boarding/) — marines used in boarding

---

*Stub page — full crew reference coming.*

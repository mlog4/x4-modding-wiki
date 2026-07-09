---
title: Aiscript Framework
description: How NPC ship behavior is defined.
---

:::caution[Placeholder section]
Prototype shows structure only. Pages to be filled after approval.
:::

## Core abstractions

- **Order definition** — `<order>` block declaring params, requires, location.
- **Interrupt** — `<handler>` block for event-driven state transitions (`<event_object_destroyed>`, `<event_object_attacked>`).
- **Attention block** — `<attention min="X">` containing the main behavior loop.

## Common questions (planned)

- *"How do I add a custom NPC order?"* → Order definition → schema + minimal example.
- *"How does aiscript differ from MD?"* → MD is cue-driven cross-script logic; aiscript is ship-attached event-driven state machines.
- *"How do I handle player attack mid-action?"* → Interrupt → `event_object_attacked` handler + `<abort_called_scripts resume="X">`.
- *"What's the relationship between MD `set_order` and aiscript orders?"* → MD signals engine to assign order; engine loads the aiscript and executes it on the ship.

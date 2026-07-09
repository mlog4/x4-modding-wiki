---
title: Destructible
description: Abstract class for objects with destruction state. Has hull, can be destroyed. Parent of most game objects. Stub page.
---

**Destructible** is the abstract X4 engine class for **objects that can be destroyed**. They have a hull, take damage, and emit `event_object_destroyed` when killed.

## Properties

- `.hull` — current hull value
- `.hullpercentage` — 0-100
- `.hullmax` — maximum hull

## Common events

- `event_object_destroyed` — destruction event
- `event_object_damaged` — damage event

## Subclasses

Most game objects inherit from destructible:
- [Ship](/game/objects/ship/)
- [Station](/game/objects/station/)
- [Module](/game/objects/module/)
- [Defensible](/game/objects/defensible/) — adds shields

## Related

- [Object](/game/objects/object/) — parent class
- [Defensible](/game/objects/defensible/) — adds shield mechanics

---

*Stub page — full destructible reference coming.*

---
title: Bullet
description: Projectile fired by a weapon. Has damage, lifetime, velocity. Sub of explosive. Stub page.
---

**Bullet** is the X4 engine class for **projectiles fired by weapons** — laser pulses, plasma bolts, etc. (Missiles are a separate subclass.)

## Properties

- `.damage` — damage dealt on hit
- `.lifetime` — how long the bullet exists
- `.velocity` — projectile speed

## Common context

Bullets are spawned by [Weapon](/game/objects/weapon/) on firing. They impact targets, deal damage, and despawn.

## Related

- [Weapon](/game/objects/weapon/) — bullet emitter
- [Explosive](/game/objects/explosive/) — parent class
- [Countermeasure](/game/objects/countermeasure/) — defensive against bullets
- [Missile](/game/objects/missile/) — guided variant

---

*Stub page — full bullet reference coming.*

---
title: Turret
description: Defensive weapon mounted on a ship/station surface. Sub-component of Defensible. Stub page.
---

A **Turret** is a **defensive weapon** mounted on a [Ship](/game/objects/ship/) or [Station](/game/objects/station/) surface. Turrets fire bullets at hostile targets — accessed via [Defensible](/game/objects/defensible/) `.turrets.*.list`.

## Properties (inherited from defensible-surface)

| Property | Type | Description |
|---|---|---|
| `.parent` | defensible | The ship/station owning this turret |
| `.weapon` | weapon | The weapon installed in the turret |
| `.target` | object | Current target (if firing) |
| `.range` | length | Effective firing range |
| `.alertlevel` | alertlevel | Turret's current alert level |

## Common context

- Turrets DEACTIVATE on alert level green (engine rule)
- Turrets fire bullets when a hostile is in range + alert level allows
- Turret macro defines firing rate / damage / arc

## Related

- [Defensible](/game/objects/defensible/) — `.turrets.*.list` exposes turrets
- [Weapon](/game/objects/weapon/) — what turrets mount
- [Bullet](/game/objects/bullet/) — what turrets fire
- [Ship](/game/objects/ship/) — has turrets
- [Loadout](/game/objects/loadout/) — turret slots filled by loadout

---

*Stub page — full turret reference coming.*

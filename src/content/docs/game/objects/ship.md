---
title: Ship
description: Mobile object owned by a faction.
---

:::caution[Placeholder]
This page is a placeholder for the prototype. Full content will be added after the structure is approved.
:::

A **Ship** is a mobile object owned by a [Faction](../factions/faction/). Ships have classes (XS/S/M/L/XL) and purposes (fight / trade / mine / transport / build).

A Ship contains:

- [Crew](../factions/crew/) — pilot, captain, engineer, marines, service crew.
- [Cargo](../economy/cargo/) — inventory.
- [Loadout](./loadout/) — weapons, shields, engines.

## What will be on this page (planned)

- **Properties (~30):** `.faction`, `.trueowner`, `.controllably`, `.isclass.ship_*`, `.hull`, `.shield`, `.cargo`, `.commander`, `.subordinates`, `.defaultorder`, `.currentorder`, `.hasorderloop`, …
- **Actions:** create/destroy/set_owner/board/commandeer/add_units (drones).
- **Libraries:** `TransferShipOwnership`, `Spawn_Ship_Formation`, `FindShipMacroForCargo`.
- **Events:** destroyed/changed_owner/attacked/arrived_at_waypoint.
- **Gotchas:** `set_player_target` is same-cluster only; ProtectPosition `destination` requires `[sector, position]` list format; cannot set `<create_order default=true>` with AttackInRange.
- **Examples:** spawning + assigning order, proper ownership transfer, listening for hull damage, finding suitable cargo macro.

## Related

- [Station](./station/) — sister object type.
- [Faction](../factions/faction/) — owner.
- [Order](../behavior/order/) — what ships do.
- [Sector](../world/sector/) — container.

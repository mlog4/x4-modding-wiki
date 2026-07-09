---
title: Module
description: Building block of a station.
---

:::caution[Placeholder]
This page is a placeholder for the prototype. Full content will be added after the structure is approved.
:::

A **Module** is a building block of a [Station](./station/). Vanilla module types:

- **Production module** — produces wares.
- **Dock module** — provides docking bays.
- **Defence module** — turrets, shields, missiles.
- **Habitation module** — workforce housing.
- **Storage module** — cargo capacity.
- **Connection module** — links other modules.

## What will be on this page (planned)

- **Properties:** `.macro`, `.ware` (for production), `.ware.resources` (recipe), `.tags`, `.iscontainer`.
- **Actions:** add to station, remove from station, pause production.
- **Libraries:** related vanilla helpers.
- **Events:** module-related signals.
- **Gotchas:** `$Mod.macro.ware.resources` works, `$Mod.products.list.{1}.resources` returns null.
- **Examples:** querying production recipe, adding new module to existing station.

## Related

- [Station](./station/) — parent container.
- [Ware](../economy/ware/) — what production modules produce.
- [Macro](../data/macro/) — module template data.

---

:::tip[Pattern]
This page demonstrates a **contained part** — a module exists only as part of a station. Its existence/identity is tied to its container.
:::

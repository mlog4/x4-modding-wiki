---
title: Economy
description: Wares, trade offers, inventory.
---

:::caution[Placeholder section]
Prototype shows structure only. Pages to be filled after approval.
:::

## Core abstractions

- **Ware** — the economic primitive (silicon, energycells, smartchips, etc.).
- **Trade offer** — buy/sell offer attached to a station for a specific ware.
- **Trade subscription** — player-subscribed trade information stream.
- **Inventory / Cargo** — what an object carries.

## Common questions (planned)

- *"How do I add ware to a ship's cargo?"* → Cargo → Actions → `<add_cargo>` / `<add_ammo>` for ammo-types.
- *"How do I read price of a buy offer?"* → Trade offer → Properties → `.price`.
- *"How do I find all stations selling ware X?"* → Ware → Actions → `find_sell_offer` chain.
- *"How do I handle ware references — string vs wareref?"* → Ware → Gotchas (`add_inventory` needs `ware.{$string}`).

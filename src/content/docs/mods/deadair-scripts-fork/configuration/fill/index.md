---
title: DA Fill
description: Station fill mechanic — tops up trade stations, wharfs, shipyards with wares by faction budget and configurable percentage bands. 15 options + 2 sub-menus (Fill Faction Menu, Fill Statistics Menu).
sidebar:
  order: 5
---

Tops up trade stations, shipyards, and wharfs with wares at adjustable intervals. Fixes vanilla's tendency to leave stations sitting half-empty when the faction economy stalls. Also handles ship-mod (paint / tuning) top-ups for the faction ship pool. Fills operate under **per-faction budget accounting** — poor factions fill less; rich factions fill more.

## In-game view

![DA Fill main menu — 15 options + 2 sub-menu links](/x4-modding-wiki/img/mods/deadair-scripts/menu-fill.jpg)

Layout:

- **Top section (`DA Fill Options`)** — 15 configurable fields covering percentage thresholds, ship-mod toggles, credit limiting, Xenon protection, and debug.
- **Bottom section (`DA Fill Menus`)** — 2 sub-menus for per-faction toggling and statistics viewing.

## Mechanic

Every `Fill Interval` minutes DA walks each faction's stations and applies the following logic per ware slot:

**For trade stations** (see [`md/deadairdynamicuniverse.xml:4158,4206`](https://github.com/mlog4/deadair_scripts)):

- If current stock **>** `Max Trading Station Ware %` of capacity → **remove** wares down to `Adjusted Max Trading Station Ware %`. (Prevents over-fill.)
- If current stock **<** `Min Trading Station Ware %` of capacity → **add** wares up to `Adjusted Min Trading Station Ware %`. (Restocks near-empty slots.)

**For shipyards and wharfs** (line 4289):

- Only the "add" path applies (shipyards never over-fill in a way that DA needs to correct).
- If current stock **<** `Min Shipyard/Wharf Ware %` → add up to `Adjusted Min Shipyard/Wharf Ware %`.
- **Xenon exception:** if `Xenon Shipbuilding Setting` is on AND the yard is Xenon-owned, the thresholds get forced to `25 / 25` regardless of your slider values. Keeps Xenon shipyards viable as a threat even if you set aggressive low thresholds.

**Budget accounting:**

- Each faction has a running Credit balance tracked in `$DAFillFactionAccounts.{faction}`. Trade wares generated at production feed the balance; every add-ware operation subtracts `AmountAdded × ware.averageprice` from it.
- If `Trading Station Credit Limit` is on (default), an add operation only takes as much as the faction can afford. Poor factions fill less.
- If `Trading Station Credit Limit` is off, DA fills up to the desired amount regardless — "free wares" mode.

## DA Fill Options

### Master + interval

| Setting | Default | Effect |
|---|---|---|
| **Enable Fill** | `Enabled` | Master toggle for the whole system. |
| **Fill Interval** | `60 min` | How often DA runs a fill pass across all faction stations. Lower = more responsive economy, higher CPU cost per tick. |

### Trade Station percentage band

Four sliders control the fill target for trade stations. The gap between `Min` and `Adjusted Min` (or `Max` and `Adjusted Max`) defines the buffer band DA operates on.

| Setting | Default | Effect |
|---|---|---|
| **Max Trading Station Ware %** | `90 %` | If a ware exceeds this % of capacity, DA removes wares. Set to `100` to never remove. |
| **Adjusted Max Trading Station Ware %** | `75 %` | Removal target — wares get pulled down to this level when the max threshold trips. |
| **Min Trading Station Ware %** | `5 %` | If a ware is below this % of capacity, DA adds wares. |
| **Adjusted Min Trading Station Ware %** | `10 %` | Add target — wares get topped up to this level when the min threshold trips. |

**Default behavior in one line:** anything below 5% gets pushed up to 10%; anything above 90% gets pulled down to 75%. Between 5% and 90%, DA leaves it alone.

### Shipyard/Wharf percentage band

Same shape, add-only:

| Setting | Default | Effect |
|---|---|---|
| **Min Shipyard/Wharf Ware %** | `5 %` | If a shipyard/wharf resource is below this % of capacity, DA adds wares. |
| **Adjusted Min Shipyard/Wharf Ware %** | `10 %` | Add target for shipyards/wharfs. |

### Ship mods

Whether DA distributes ship equipment mods along with regular wares.

| Setting | Default | Effect |
|---|---|---|
| **Enable Fill Ship Mods** | `Enabled` | Distribute ship equipment mods (engine tunings, shield mods, weapon mods) to faction shipyards. |
| **Enable Fill Fleet Ship Mods** | `Enabled` | Extend distribution to fleet-tier ships, not just capital ships. |
| **Enable Fill Ship Paint Mods** | `Enabled` | Distribute paintmods so faction ships have visual variety. |

### Special

| Setting | Default | Effect |
|---|---|---|
| **Trading Station Credit Limit** | `Enabled` | Cap add operations by the faction's own credit balance (see [Budget accounting](#mechanic)). Off = fills regardless of budget. |
| **Xenon Shipbuilding Setting** | `Enabled` | Force minimum 25 % fill on Xenon shipyards/wharfs even if your sliders are lower. Keeps Xenon viable as a threat. Off = Xenon fills by the same rules as other factions. |
| **Enable Fill Debug** | `Disabled` | Verbose `[FILL]` log lines. |

## DA Fill Menus

- **[Fill Faction Menu](./faction-menu/)** — per-faction on/off toggles for Trading Station and Ship Building Station fills. Individual factions can be excluded entirely.
- **[Fill Statistics Menu](./statistics/)** — three read-only report sections: Faction Account balances, Wares Added/Removed totals, Ships Modified counts.

## Preset scope note

Only 8 of the 15 top-level fields are in the [Configuration Presets](../presets/) scope: `Enable Fill`, `Fill Interval`, three Ship Mod toggles, `Trading Station Credit Limit`, `Xenon Shipbuilding Setting`, `Enable Fill Debug`. The **7 percentage sliders** are **not** in preset scope — switching between built-in presets keeps their values unchanged.

## Gameplay effect at recommended defaults

You can visit any trade station and reliably find wares available (unlike vanilla where stations often sit at 5-10 % fill for hours). Faction economies stay responsive; player-owned stations still have to compete on price. Rich factions (Riptide Rakers, Ministry of Finance in the observed save) fill more aggressively than poor ones (Alliance of the Word, Yaki), matching the [Faction Account](./statistics/) balances you can see in the statistics menu.

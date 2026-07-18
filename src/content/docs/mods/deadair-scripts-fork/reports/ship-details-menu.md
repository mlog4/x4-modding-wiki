---
title: Ship Details Menu
description: Per-faction detailed ship breakdown — Specialisation matrix (Object Purpose × Size) + per-ship-type counts grouped by size class.
sidebar:
  order: 7
---

Per-faction detailed ship breakdown. Two-part view: a **Specialisation matrix** at the top (Object Purpose × Size class) and a **Ship Types** listing below (per-model counts grouped by size class).

## In-game view

![Ship Details Menu — Terran Protectorate selected, Specialisation matrix + XL/L/M/S ship type breakdowns visible](/x4-modding-wiki/img/mods/deadair-scripts/report-ship-details-menu.jpg)

## Filter row

**Faction dropdown** at the top — screenshot shows `Terran Protectorate`.

## Specialisation section

Matrix of ship counts by **Object Purpose** (row) × size class (column):

### Columns

- **Object Purpose** — row label. What the ship is designed for.
- **Total** — sum across all sizes.
- **XL / L / M / S** — count within each size class.

### Object Purpose rows

- **Fight** — combat-oriented ships.
- **Auxiliary** — resupply / support (fleet auxiliaries, ammo carriers).
- **Trade** — freighters.
- **Build** — build ships (construction vessels).
- **Mine** — mining vessels.
- **Salvage** — salvage-purpose ships.
- **Dismantling** — dismantling ships.

### Observed values (Terran Protectorate)

| Purpose | Total | XL | L | M | S |
|---|---:|---:|---:|---:|---:|
| Fight | 1564 | 14 | 123 | 312 | 1115 |
| Auxiliary | 6 | 6 | 0 | 0 | 0 |
| Trade | 422 | 0 | 63 | 314 | 45 |
| Build | 15 | 15 | 0 | 0 | 0 |
| Mine | 266 | 0 | 72 | 173 | 21 |
| Salvage | 0 | 0 | 0 | 0 | 0 |
| Dismantling | 0 | 0 | 0 | 0 | 0 |

**Read:** Terran's fleet is 65% Fight (1564 / ~2273 total), 18% Trade, 12% Mine, plus 15 dedicated build ships (all XL — Terran Constructors) and 6 XL auxiliary. 0 salvage / dismantling — Terran doesn't run salvage-purpose ops.

## Ship Types section

Below the Specialisation matrix, a scrollable list of **per-ship-type counts** grouped by size class. Each row = one ship model.

### Sections in the observed view

**XL section** (4 model types visible):
- Asgard: 4
- Honshu: 6
- Kyushu: 15
- Tokyo: 10

**L section** (5 models):
- Hokkaido (Gas): 15
- Hokkaido (Mineral): 57
- Okinawa: 63
- Osaka: 81
- Syn: 42

**M section** (6 models visible):
- Baldric: 314
- Bolo (Gas): 62
- Bolo (Mineral): 111
- Falx: 89
- Jian: 71
- Katana: 152

**S section** (7 models visible):
- Frog: 45
- Gladius: 153
- Kalis: 177
- Kopis (Mineral): 21
- Kukri: 761
- Nimcha: 17
- Rapier: 7

### Read

**Terran's XL fleet is diverse** — 4 Asgards, 10 Tokyos, 15 Kyushus, 6 Honshus = 35 XL total (matches Military 20 + Auxiliary 6 + Build 15 - miscount because build ships are separate → actually matches breakdown reasonably).

**Kukri dominates S at 761** — Terran's baseline S fighter. Numerous cheap fighters vs a few expensive XLs.

**Katana at 152** = M-class fighter/gunboat, second most numerous M ship. Baldric at 314 = M mining vessel (matches 173 M mining ships).

**Osaka + Okinawa dominate L** (81 + 63 = 144 out of ~258 L). Hokkaido variants (mining L) at 57+15=72. Syn (frigate) at 42.

## Interaction with Military Ship Count / Economic Ship/Station Count

- **[Military Ship Count](./military-ship-count/)** shows totals per size (Terran XL=20, L=123, M=309, S=1113 = 1565 total military).
- **This menu's Specialisation Fight row** (Terran XL=14, L=123, M=312, S=1115 = 1564) matches military closely.

The small numeric differences (Fight 14 XL vs Military XL 20) come from category classification — 6 XL Terran Auxiliary + Build ships are counted as military in the Military report but pulled out as Auxiliary/Build in Specialisation.

## Use cases

- **Fleet composition diagnostics:** what's the faction actually flying?
- **Compare fleets:** switch dropdown between factions to see mix differences (Xenon 0 trade / all fight vs Argon balanced across purposes).
- **Modded-ship visibility:** if a compat mod added new ship types, they should appear as rows here with counts.
- **Verify fleet-cap effects:** if you're tuning [Jobs SST](../../configuration/jobs/#smart-sector-tags-sst--how-the-subsystem-works) quotas, changes should reflect in per-model counts here over time.

## Notes

- **Snapshot at menu-open** — reopen to refresh.
- **All owned ships** — includes AI-piloted and player-piloted.
- **Excludes wrecks and stations** — only functioning owned ships.
- **Modded ship types** get their own rows if the faction owns them.

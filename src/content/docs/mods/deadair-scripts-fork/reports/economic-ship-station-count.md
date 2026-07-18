---
title: Economic Ship/Station Count
description: Faction × ship-class matrix of civilian (economic) ships + Stations column. Companion to Military Ship Count for civilian economy view.
sidebar:
  order: 2
---

Faction × ship-class matrix showing civilian (non-military) ships plus a **Stations** column showing station count. Complement to [Military Ship Count](./military-ship-count/).

## In-game view

![Economic Ship/Station Count — same layout as Military but with Stations column replacing Threat Score](/x4-modding-wiki/img/mods/deadair-scripts/report-economic-ship-station-count.jpg)

## Columns

| Column | Meaning |
|---|---|
| **Faction** | Every enumerated faction. |
| **Total** | Sum of civilian ships across all size classes. |
| **XL** | XL-class civilian (auxiliary, resupply). |
| **L** | L-class (large freighters, mining vessels). |
| **M** | M-class (medium traders, miners). |
| **S** | S-class (small scouts, drones). |
| **Stations** | Total station count owned by this faction. |

## Display Mode dropdown

Same as Military Ship Count — currently visible: `Number of ships`.

## Observed values in the sample save

| Faction | Total | XL | L | M | S | Stations |
|---|---:|---:|---:|---:|---:|---:|
| Alliance of the Word | 1 | 0 | 1 | 0 | 0 | 1 |
| Antigone Republic | 48 | 0 | 12 | 35 | 1 | 24 |
| Argon Federation | 8 | 0 | 3 | 5 | 0 | 20 |
| Duke's Buccaneers | 8 | 0 | 0 | 8 | 0 | 2 |
| Fallen Families | 0 | 0 | 0 | 0 | 0 | 0 |
| Free Families | 40 | 1 | 11 | 25 | 3 | 10 |
| Godrealm of the Paranid | 177 | 2 | 20 | 146 | 9 | 46 |
| Hatikvah Free League | 24 | 0 | 2 | 22 | 0 | 9 |
| Holy Order of the Pontifex | 143 | 8 | 40 | 89 | 6 | 65 |
| Kha'ak | 0 | 0 | 0 | 0 | 0 | 58 |
| Ministry of Finance | 1 | 1 | 0 | 0 | 0 | 1 |
| Provinces Adrift | 513 | 7 | 66 | 411 | 29 | 73 |
| Quettanauts | 12 | 0 | 0 | 11 | 1 | 3 |
| Riptide Rakers | 10 | 4 | 3 | 1 | 2 | 12 |
| Scale Plate Pact | 12 | 0 | 1 | 1 | 10 | 15 |
| **Segaris Pioneers** | **419** | **8** | **61** | **313** | **37** | **47** |
| Teladi Company | 41 | 1 | 12 | 27 | 1 | 29 |
| **Terran Protectorate** | **703** | **15** | **135** | **487** | **66** | **64** |
| Val Selton | 0 | 0 | 0 | 0 | 0 | 1 |
| Vigor Syndicate | 0 | 0 | 0 | 0 | 0 | 0 |
| **Xenon** | **2140** | **0** | **0** | **2140** | **0** | **362** |
| Yaki | 0 | 0 | 0 | 0 | 0 | 1 |
| Zyarth Patriarchy | 5 | 0 | 4 | 1 | 0 | 11 |
| **Galaxy-wide** | **4305** | **47** | **371** | **3722** | **165** | **854** |

## Read the sample save

**Xenon 2140 M ships — all M, 0 XL/L/S** — makes sense, Xenon economic ships = M-class mining/collector drones. Xenon **362 stations** (biggest by count) reflects their massive galaxy-wide presence.

**Segaris + Terran + Provinces Adrift** dominate the civilian economy — 419 / 703 / 513 ships respectively. Terran + Segaris are the same lore-family (Terran side of the galaxy) so together 1122 civilian ships.

**Kha'ak: 0 ships / 58 stations** — Kha'ak deploy stations (hives, outposts) but don't run economic ships. All 58 are combat-related structures, not producers.

**Alliance of the Word: 1 ship / 1 station** — nearly extinct faction. Same as Ministry of Finance.

**Riptide Rakers: 10 civilian ships + 12 stations** — surprisingly diverse fleet (4 XL, 3 L, 1 M, 2 S) despite being pirates. The 792M Cr in their Fill Statistics balance is being spent on more infrastructure than combat.

## Compare with Military Ship Count

| Faction | Military | Economic | Stations |
|---|---:|---:|---:|
| Terran | 1565 | 703 | 64 |
| Xenon | 4598 | 2140 | 362 |
| Segaris | 366 | 419 | 47 |
| Provinces Adrift | 543 | 513 | 73 |
| Argon | 2 | 8 | 20 |
| Zyarth | 0 | 5 | 11 |

**Argon and Zyarth have stations but almost no ships** — economic infrastructure without protection. They'll get raided.

**Xenon 4598 military + 2140 economic + 362 stations** — the numeric dominance is stunning. Player likely at "hard mode" for Xenon-front sectors.

## Notes

- **Ship classification** is by ware macro / purpose tag — DA uses `purpose.trade`, `purpose.mine`, `purpose.auxiliary` etc. to bucket ships as economic.
- **Stations column** counts all stations of any type — trade stations, factories, wharves, shipyards, defense platforms.
- **Galaxy-wide totals** — 4305 civilian ships + 854 stations galaxy-wide. Combined with [Military Ship Count](./military-ship-count/) 7797 military ships → ~12k total ships in this save.

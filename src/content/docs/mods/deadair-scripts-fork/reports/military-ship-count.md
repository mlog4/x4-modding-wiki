---
title: Military Ship Count
description: Faction × ship-class matrix showing counts of active military ships in the galaxy + a computed Threat Score per faction.
sidebar:
  order: 1
---

Faction × ship-class matrix showing every military ship currently active in the galaxy, plus a computed **Threat Score** aggregating combat power into a single number.

## In-game view

![Military Ship Count — full faction table with XL/L/M/S columns + Threat Score + Galaxy-wide totals](/x4-modding-wiki/img/mods/deadair-scripts/report-military-ship-count.jpg)

## Columns

| Column | Meaning |
|---|---|
| **Faction** | Every enumerated faction (vanilla + modded). |
| **Total** | Sum of all military ships across all size classes. |
| **XL** | XL-class military (typically carriers, battleships). |
| **L** | L-class (destroyers, frigates). |
| **M** | M-class (corvettes, gunboats). |
| **S** | S-class (fighters, scouts). |
| **Threat Score** | Weighted total: XL and L contribute more per-ship than M or S. Roll-up single number for "how dangerous is this faction militarily". |

## Display Mode dropdown

Top row has a **Display Mode:** dropdown. Currently visible mode: `Number of ships`. Other likely modes: aggregate value, percentages, or per-sector density. Screenshot has just the one visible.

## Observed values in the sample save

| Faction | Total | XL | L | M | S | Threat |
|---|---:|---:|---:|---:|---:|---:|
| Alliance of the Word | 3 | 0 | 0 | 3 | 0 | 9 |
| Antigone Republic | 38 | 0 | 1 | 10 | 27 | 71 |
| Argon Federation | 2 | 0 | 0 | 0 | 2 | 2 |
| Duke's Buccaneers | 166 | 0 | 0 | 18 | 148 | 202 |
| Fallen Families | 2 | 0 | 0 | 0 | 2 | 2 |
| Free Families | 39 | 2 | 1 | 4 | 32 | 97 |
| Godrealm of the Paranid | 98 | 1 | 8 | 15 | 74 | 254 |
| Hatikvah Free League | 4 | 0 | 0 | 0 | 4 | 4 |
| Holy Order of the Pontifex | 39 | 3 | 1 | 9 | 26 | 129 |
| Kha'ak | 113 | 0 | 1 | 72 | 40 | 270 |
| Ministry of Finance | 96 | 0 | 0 | 19 | 77 | 134 |
| Provinces Adrift | 543 | 2 | 44 | 149 | 348 | 1450 |
| Quettanauts | 1 | 0 | 0 | 0 | 1 | 1 |
| Riptide Rakers | 0 | 0 | 0 | 0 | 0 | 0 |
| Scale Plate Pact | 71 | 0 | 11 | 19 | 41 | 252 |
| **Segaris Pioneers** | **366** | **5** | **32** | **72** | **257** | **1015** |
| Teladi Company | 26 | 1 | 0 | 0 | 25 | 41 |
| **Terran Protectorate** | **1565** | **20** | **123** | **309** | **1113** | **4228** |
| Val Selton | 1 | 0 | 0 | 0 | 1 | 1 |
| Vigor Syndicate | 7 | 1 | 4 | 0 | 2 | 81 |
| **Xenon** | **4598** | **342** | **14** | **1088** | **3154** | **14792** |
| Yaki | 19 | 0 | 0 | 4 | 15 | 27 |
| Zyarth Patriarchy | 0 | 0 | 0 | 0 | 0 | 0 |
| **Galaxy-wide** | **7797** | **377** | **240** | **1791** | **5389** | **23062** |

## Read the sample save

**Xenon dominate** at 4598 military ships / Threat 14792 — **64%** of the galaxy's total Threat Score. 342 XL Xenon (carriers + battleships) is massive.

**Terran Protectorate is #2** at 1565 ships / Threat 4228 — the strongest lawful faction military.

**Zyarth Patriarchy is dead** — 0 ships. Either the player wiped them out, or they've been militarily neutralized by other factions (Free Families / Segaris in this save may have absorbed their territory).

**Riptide Rakers have 0 military** but were the richest faction in [Fill Statistics](./fill-statistics/) (792M Cr). Cash without ships means they can't project power.

**Argon Federation collapsed** to 2 ships. Probably at war with Xenon losing badly.

**Kha'ak persist** at 113 ships / Threat 270 — steady if not dominant.

## Threat Score interpretation

Rough weight heuristic (inferred from the observed values):
- 1 XL ≈ 15-20 Threat points
- 1 L ≈ 5-10
- 1 M ≈ 2-3
- 1 S ≈ 1

Example: Xenon 14792 / (342×20 + 14×10 + 1088×3 + 3154×1) = 14792 / (6840 + 140 + 3264 + 3154) = 14792 / 13398 ≈ close match with slight XL weighting bump.

## Notes

- **Count is live, not tracked.** DA doesn't remember historical counts — this is a snapshot when you open the menu.
- **Excludes stations** (see Economic Ship/Station Count for civilian ships + stations).
- **Threat Score doesn't include equipment mods** — a maxed-out Xenon K counts the same as a stock K in this table. For per-ship-modifier accounting, see [DA Evolution → Xenon Ship Mods](../../configuration/evolution/xenon-ship-mods/).
- **Galaxy-wide row** at the bottom = sum of all faction rows. Useful sanity check.

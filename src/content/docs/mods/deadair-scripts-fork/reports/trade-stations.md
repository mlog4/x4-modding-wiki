---
title: 'Mlog: Trade Stations Report'
description: Compact roster of all trade stations galaxy-wide with subordinate M-trader count column. Diagnostic for the mlog094 ST subsystem.
sidebar:
  order: 10
---

Compact roster of every trade station in the galaxy with M-subordinate count and storage-capacity metrics. Primary diagnostic for [Station Subordinate Traders (ST)](../../configuration/trade-optimizer/#station-subordinate-traders-middle) — the ST subsystem attaches M-class trader ships to trade stations, and this menu shows how many each station currently has.

Introduced mlog088-089 in v3.0-beta1.

## In-game view

![Mlog Trade Stations Report — 21 trade stations across 6 factions with M subs / Cont M / L/S M columns](/x4-modding-wiki/img/mods/deadair-scripts/report-trade-stations.jpg)

Header: `Total: 21 trade stations. Capacities are raw max (m3), shown in millions.`

## Columns

| Column | Meaning |
|---|---|
| **ID** | 3-char + 3-digit station idcode (e.g. `ULE-689`, `EAS-787`). Vanilla-format engine-generated ID. |
| **Fac** | 3-letter faction shortname (`BOR`, `HAT`, `PAR`, `PIO`, `QUE`, `TEL`, `TER`). |
| **Sector** | Sector known-name. |
| **M subs** | Number of M-class subordinate ships assigned (typically ST traders). |
| **Cont M** | Container storage capacity in millions of m³. Higher = more capacity for solid goods. |
| **L/S M** | Liquid / Solid storage capacity in millions of m³. `2/2` = 2 million m³ each. `0/0` = station has no liquid/solid storage modules. |

## Sort order

Composite key: `owner.shortname + '/' + sector.knownname`. Groups stations by faction, then sorts by sector name within.

## Observed values in the sample save

**Total: 21 trade stations across 7 factions.**

### Boron (BOR) — 8 stations

| ID | Sector | M subs | Cont M | L/S M |
|---|---|---:|---:|---:|
| ULE-689 | Atreus' Clouds | 20 | 2 | 2/2 |
| UPP-498 | Barren Shores | 19 | 1 | 0/0 |
| HJK-493 | Kingdom End I | 20 | 2 | 2/2 |
| TBQ-336 | Menelaus' Oasis | 20 | 2 | 2/2 |
| QHL-166 | Ocean of Fantasy | 19 | 1 | 0/0 |
| RFZ-249 | Reflected Stars | 20 | 2 | 2/2 |
| SDF-350 | Rolk's Demise | 20 | 2 | 2/2 |
| ICZ-568 | Towering Wave | 20 | 2 | 2/2 |

### Hatikvah (HAT) — 1 station

| ID | Sector | M subs | Cont M | L/S M |
|---|---|---:|---:|---:|
| URI-598 | Circle of Deceit | 12 | 5 | 5/5 |

### Paranid (PAR) — 2 stations

| ID | Sector | M subs | Cont M | L/S M |
|---|---|---:|---:|---:|
| EAS-787 | Cardinal's Domain | 15 | 2 | 2/2 |
| VPR-887 | Pious Mists II | 11 | 2 | 2/1 |

### Pioneers (PIO — Segaris) — 3 stations

| ID | Sector | M subs | Cont M | L/S M |
|---|---|---:|---:|---:|
| FOD-798 | Circle of Deceit | 19 | 2 | 2/2 |
| TBV-616 | Gaian Prophecy | 20 | 2 | 2/2 |
| TBJ-015 | Segaris | 19 | 5 | 2/2 |

### Quettanauts (QUE) — 1 station

| ID | Sector | M subs | Cont M | L/S M |
|---|---|---:|---:|---:|
| HHJ-136 | Mitsuno's Sacrifice | 0 | 2 | 1/1 |

### Teladi (TEL) — 1 station

| ID | Sector | M subs | Cont M | L/S M |
|---|---|---:|---:|---:|
| EJC-844 | CEO's Doubt | 2 | 2 | 2/2 |

### Terran (TER) — 5 stations

| ID | Sector | M subs | Cont M | L/S M |
|---|---|---:|---:|---:|
| YZW-129 | Earth | 20 | 2 | 2/2 |
| QCY-084 | Mars | 20 | 2 | 2/2 |
| PPU-045 | Neptune | 20 | 2 | 2/2 |
| AGV-148 | Saturn 1 | 20 | 2 | 2/2 |
| XRK-683 | The Moon | 20 | 2 | 2/2 |

## Read the sample save

**Total M subs across all stations: ~ 335** — matches roughly the `Discovered: 23 | Fleet: 371` shown in the [Trade Optimizer](../../configuration/trade-optimizer/#station-subordinate-traders-middle) footer (small difference because trade-stations report shows 21 but ST tracks 23, and Fleet 371 vs summed 335 — the difference is in-transit / spinning up ST traders).

**Full-quota stations (20/20 subs)** — 12 out of 21 stations at max. Terran and most Boron stations healthy.

**Under-quota (< 20 subs):**
- Boron in Barren Shores (19) and Ocean of Fantasy (19) — slight shortfall.
- Hatikvah Circle of Deceit (12/20) — significantly under. Circle of Deceit is dangerous (contested Xenon-border sector) so trader casualties are frequent.
- Paranid Pious Mists II (11/20) — same story.
- **Quettanauts Mitsuno's Sacrifice: 0/20 subs** — ST completely failed here. Probably the station just discovered and ST hasn't spawned traders yet, OR the sector is blacklisted for ST spawning.
- **Teladi CEO's Doubt: 2/20** — same problem.

## Hatikvah Circle of Deceit exception

Note **URI-598 (HAT) has Cont M = 5 and L/S M = 5/5** — this is unusually large. All other trade stations show 2 or fewer. Hatikvah's Circle of Deceit trade station has expanded storage modules — Hatikvah lore-flavor "traders that carry a lot".

**Similarly TBJ-015 (Segaris) at Cont M = 5, L/S M = 2/2** — Segaris trade station in Segaris core sector expanded.

## Interaction with the [5-sector ST blacklist](../../configuration/trade-optimizer/#station-subordinate-traders-middle)

The mlog094 blacklist excludes Earth, Reflected Stars, Towering Wave, Atreus' Clouds, Rolk's Demise from ST spawning.

**But all 5 blacklisted sectors show ~20 M subs in the report!** This is because:

1. The blacklist was added later (mlog094) — pre-existing stations in blacklisted sectors keep their ST traders assigned.
2. The blacklist only prevents NEW ST spawning, not despawning existing traders.
3. If ST traders die in a blacklisted sector, they won't be replaced. So over time these numbers should decline.

## Sort order — reason

Source: `MlogDaTsReportBuild` in [`md/mlog_da_report_tradestations.xml`](https://github.com/mlog4/deadair_scripts) sorts by `owner.shortname + '/' + sector.knownname` for consistent per-faction grouping. Makes it easy to see all Terran stations together, all Boron stations together, etc.

## Use cases

- **Diagnose ST subsystem health:** stations with 0/quota subs = ST failed here (blacklisted? DA subsystem disabled?).
- **Verify blacklist behavior:** stations in blacklisted sectors keeping subs = pre-blacklist assignments.
- **Compare across factions:** Terran always at 20/20, Hatikvah / Paranid struggling in contested sectors.
- **Spot expansion opportunities:** stations with 5+ storage modules are "big" trade centers — attractive economic hubs.

## Notes

- **Only trade stations** — factories, wharves, shipyards, defense platforms don't appear.
- **Snapshot at menu-open** — reopen to refresh.
- **Storage in millions of m³ raw max, not fill percentage** — a station with Cont M = 5 has 5,000,000 m³ container-storage regardless of how full it is right now.
- **`0/0` L/S M** means the station has zero liquid/solid storage modules — everything routes through the container.

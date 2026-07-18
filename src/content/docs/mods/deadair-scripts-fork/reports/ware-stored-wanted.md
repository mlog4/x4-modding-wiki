---
title: Ware Stored/Wanted
description: Per-faction ware stockpile view with visual excess/shortage bars. Shows Stored/Wanted percentage plus a red/blue bar indicating supply state.
sidebar:
  order: 3
---

Per-faction ware stockpile snapshot. For each ware the faction cares about, shows what percentage of "wanted" is currently in storage, with a visual bar coding excess (blue) vs shortage (red).

## In-game view

![Ware Stored/Wanted — Alliance of the Word selected, showing 18 wares with mixed excess/shortage bars](/x4-modding-wiki/img/mods/deadair-scripts/report-ware-stored-wanted.jpg)

## Filter row

**Faction dropdown** at the top — click to open, select any enumerated faction. Screenshot shows `Alliance of the Word` selected.

## Columns

| Column | Meaning |
|---|---|
| **Ware** | Localized ware name. |
| **Stored / Wanted** | Percentage: `Stored / Wanted × 100%`. 100% = exactly at wanted level. `100%` sometimes means "cap reached and blue bar extends full width". |
| **Bar** (right side) | Visual bar. `Blue = Stored / Green = Excess / Red = Shortage`. Blue fill length = stored portion; Red overshoot = wanted-but-not-stored gap. |

**Hover** on the bar shows tooltip with raw numbers, e.g. `Stored: 9231 / Wanted: 14258` for Field Coils.

## Observed values (Alliance of the Word selected)

| Ware | Stored / Wanted | Interpretation |
|---|---:|---|
| Advanced Composites | 100% | Full. Blue bar. |
| Advanced Electronics | 64% | Some shortage. Red tail on bar. |
| Antimatter Converters | 32% | Significant shortage. Half the bar is red. |
| **Claytronics** | **0%** | Nothing stored. Entire bar red. |
| Drone Components | 69% | Small shortage. |
| Energy Cells | 100% | Full. |
| Engine Parts | 100% | Full. |
| Field Coils | 64% | Some shortage (9231 / 14258 from tooltip). |
| Hull Parts | 100% | Full. |
| Allographyne | 92% | Nearly full. |
| Medical Supplies | 93% | Nearly full. |
| Missile Components | 100% | Full. |
| Scanning Arrays | 100% | Full. |
| Shield Components | 66% | Shortage. |
| Smart Chips | 99% | Nearly full. |
| **Soja Husk** | **5%** | Severe shortage. Almost entirely red bar. |
| Turret Components | 48% | Half-empty. |
| Weapon Components | 61% | Some shortage. |

## Read this faction

**Alliance of the Word** is a small faction (per Military Ship Count = 3 ships, 1 station). Their supply chain is stressed:

- **Complete outages:** Claytronics (0%), Soja Husk (5%). If they need these for anything, they're stuck.
- **Manufactured goods OK:** Hull Parts / Engine Parts / Scanning Arrays / Missile Components / Shield Components at 100% — probably arriving from other factions via trade.
- **Mid-tier shortages:** Antimatter Converters (32%), Turret Components (48%) — moderate risk if a fresh order comes in.

## Column semantics

- **Stored** = physical units in this faction's storage across all their stations.
- **Wanted** = DA's computed "target level" for this faction — usually based on their production recipes' input needs + reserve buffer.
- **Percentage** = `Stored ÷ Wanted × 100`, capped at 100% display (but excess is still shown as a fully-blue bar).

## Read from another faction

Switching the Faction dropdown shows a different profile. For high-throughput factions like Terran or Segaris expect near-100% across the board (their economy is healthy). Struggling factions like Alliance of the Word / Zyarth show more red.

## Bar color code

| Color | Meaning |
|---|---|
| **Blue** | Stored portion (up to Wanted level). Full blue bar = 100%+. |
| **Green** | (Not visible in screenshot but code-supported) Excess above Wanted — surplus stockpile. |
| **Red** | Gap between Stored and Wanted. Long red tail = severe shortage. |

## Use cases

- **Diagnose faction health:** if most wares are red, this faction's supply chain is broken.
- **Predict AI behavior:** a faction with red-across-the-board will likely fail to sustain new construction.
- **Player trade opportunities:** a faction with Red-tier shortages will pay premium for wares you can supply.
- **Verify DA Fill effectiveness:** if [Fill](../../configuration/fill/) is enabled, factions should stay near 100% across the board. Persistent redness = Fill isn't working for that faction.

## Notes

- **All wares the faction cares about** are shown — the set of rows differs per faction (Terran has Terran-specific wares like Terran MRE that Argon doesn't).
- **Snapshot at menu-open time** — reopen to refresh.
- **Related:** [Station Storage](./station-storage/) shows the same underlying data broken down by Producer/Consumer role. [Fill Statistics](./fill-statistics/) shows what DA has done to affect these numbers over time.

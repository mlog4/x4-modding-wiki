---
title: Production Module Count
description: Per-faction table of production module counts by module type (Operational / Planned). Detailed view of production infrastructure.
sidebar:
  order: 5
---

Per-faction table showing production modules by type — how many are operational and how many are planned/under-construction. Answers "what's actually being manufactured by this faction?"

## In-game view

![Production Module Count — Terran Protectorate selected, 11 module types listed](/x4-modding-wiki/img/mods/deadair-scripts/report-production-module-count.jpg)

## Filter row

**Faction dropdown** at the top — screenshot shows `Terran Protectorate`.

## Columns

| Column | Meaning |
|---|---|
| **Module** | Named production module type (`Advanced Schematic Production`, `Terran Energy Cell Production`, etc.). |
| **Operational** | Count of these modules currently active + producing. |
| **Planned modules** | Count under construction or planned (not yet operational). |

## Observed values (Terran Protectorate)

| Module | Operational | Planned |
|---|---:|---:|
| Advanced Schematic Production | 33 | 0 |
| Computronic Substrate Production | 28 | 0 |
| Labor Union Contract Production | 3 | 0 |
| Metallic Microlattice Production | 47 | 0 |
| Military Schematic Production | 12 | 0 |
| Protein Paste Production | 6 | 0 |
| Silicon Carbide Production | 28 | 0 |
| Stimulant Production | 2 | 0 |
| **Terran Energy Cell Production** | **224** | 0 |
| Terran MRE Production | 12 | 0 |
| Terran Medical Supply Production | 20 | 0 |

## Read the sample save

**Terran has 415 operational production modules** total across 11 types. Zero planned — Terran is in a stable, not-expanding phase.

**Terran Energy Cell Production dominates at 224 modules** — 54% of Terran's production is just Energy Cells. This is the resource pyramid base — every downstream Terran factory (MRE, Medical, etc.) consumes Energy Cells, so massive redundancy prevents bottlenecks.

**Middle tier:**
- Metallic Microlattice: 47 (Terran-specific Hull-Parts-analog)
- Advanced Schematic Production: 33 (high-tech gate)
- Computronic Substrate: 28 + Silicon Carbide: 28 (electronics chain)

**Small production:**
- Terran MRE: 12 modules (food)
- Terran Medical Supply: 20 modules
- Military Schematic: 12 (military R&D)
- Labor Union Contract: 3 (very rare)
- **Stimulant Production: 2** — smallest count. Stimulants are a niche crafting/luxury ware in Terran space.

## Compare across factions

Switching to another faction shows their production profile. Typical patterns:

- **Terran / Segaris:** high vertical integration, Energy Cells + Refined Metals dominant.
- **Argon / Antigone:** balanced across manufacturing chains.
- **Godrealm of the Paranid:** heavy Advanced Composites + Antimatter chain.
- **Xenon:** All modules are Xenon-specific variants (Xenon E, Xenon L, etc.). Different module names.
- **Kha'ak:** no production modules — they don't manufacture, they spawn.
- **Pirates (Duke's / Riptide / Scale Plate):** very few modules or none — they steal rather than build.

## Planned column significance

When you see values in the Planned column, the faction is expanding — usually driven by [DA God](../../configuration/god/) if enabled, or by vanilla God engine choices. On [X4 9.0 the DA God pipeline is largely no-op](../../configuration/god/#known-issue-on-x4-90--staged-construction), so the Planned column is usually 0 across all factions in this save.

**Non-zero Planned + Operational rising over time** = faction is actively growing.
**Non-zero Planned + Operational NOT rising** = builds are stalled (Hull Parts shortage, cluster access blocked, etc.).

## Notes

- **Per module TYPE, not per station** — a station with 5 Energy Cell modules counts as 5 in the Operational column, not as 1 station.
- **Xenon module names** differ (Xenon E Production, Xenon L Production) — same concept though.
- **Modded factions** show their own module types if the compat mod registered them.
- **Wares not listed here** (e.g. resource extraction) — this menu is specifically production modules that convert inputs to outputs. Storage-only and mining-only modules don't appear.

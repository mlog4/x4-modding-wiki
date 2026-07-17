---
title: Jobs SST (Situational Sector Threat)
description: Per-faction, per-sector-role patrol quotas. Sectors classified as Critical / Core / Border / Contested with different threat weights.
---

Sectors are classified as Critical / Core / Border / Contested. Each faction has fleet quotas per sector role — Critical sectors get heavier patrols than Border. DA's runtime scheduler dynamically orders ships from faction shipyards to keep quotas met.

## Mechanic

Each faction × sector-role × ship-class combo has a Galaxy Quota (max total in the pool) and a Fleet Size (subordinates per patrol). When patrols get destroyed, DA re-queues replacements. Modded factions participate if a companion compat mod is installed; without compat you'll see "No suitable ships available!" on the modded faction's row.

> **📷 Screenshot needed:** DA Jobs → Quotas — root list of factions.
> _File: `menu-jobs-quotas-root.jpg`_

> **📷 Screenshot needed:** Argon quota page — full row list (Critical / Core / Border / Contested Patrol + L/M Trader + L/M Miner + L/M Gas Miner sliders).
> _File: `menu-jobs-quotas-argon.jpg`_

> **📷 Screenshot needed:** A modded faction row (e.g. Apus Stellar Treaty) if compat mod installed — showing full quota rows.
> _File: `menu-jobs-quotas-apus.jpg`_

## Main toggles

| Setting | Default | Effect |
|---|---|---|
| `JobsSST_Enable` | `true` | Master toggle. |
| `JobsSST_DetailedDebug` | `false` | Verbose `[JOBSSST]` log lines. |
| `JobsSST_XtremelyDetailedDebug` | `false` | Very verbose — every ship-order attempt gets logged. Diagnostic only, huge spam. |
| `JobsSST_RemoveExclusivity` | `true` | Allow multiple factions to patrol the same "Contested" sector simultaneously. Off = classical DA behavior (single dominant patroller per contested sector). |

## Per-faction quotas

The per-faction quota rows live inside **DA Jobs → Quotas → `<faction>`**. Each row is a slider pair — Galaxy Quota (total ships in the pool) + Fleet Size (subordinates per flagship). These are **not** in the preset scope (they're per-faction nested tables); they're edited directly in the per-faction submenus.

Roles per faction:

- **Critical Sector Patrol** — main-arterial defensive fleets
- **Core Sector Patrol** — inner-territory patrols
- **Border Sector Patrol** — near-hostile-neighbor patrols
- **Contested Sector Patrol** — sectors bordering Xenon or rival faction fronts
- **L Trader** — large-class trade fleet
- **M Trader** — medium-class trade fleet
- **L Miner** — large-class mining fleet
- **M Miner** — medium-class mining fleet
- **L Gas Miner** — large-class gas mining
- **M Gas Miner** — medium-class gas mining

## Gameplay effect at recommended defaults

Any given sector in a lawful faction's Core zone has 2-4 patrol groups active at any time; a Critical sector (with an important shipyard) has 4-8. Xenon incursions get repelled unless heavily outnumbered.

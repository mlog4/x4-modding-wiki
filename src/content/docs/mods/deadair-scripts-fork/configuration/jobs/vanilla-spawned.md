---
title: Vanilla Spawned Jobs Menu
description: Per-job enable/disable toggles for the 22 vanilla job IDs that DA explicitly preserves (Hatikvah scouts, Scale Plate scavengers/plunderers, Buccaneer patrols, Kha'ak fighters). Bypasses DA's SST overrides for that specific job.
sidebar:
  order: 2
---

Per-job enable/disable table for the **22 vanilla job IDs** DA has explicitly whitelisted. These are job entries from vanilla `libraries/jobs.xml` that DA leaves alone — the SST subsystem doesn't override or replace them, they run under vanilla rules. This menu is the escape hatch: turn one off if you want its ships to stop spawning entirely.

## In-game view

![Vanilla Spawned Jobs Menu — 15 visible rows of the 22-entry whitelist](/x4-modding-wiki/img/mods/deadair-scripts/jobs-vanilla-spawned.jpg)

## Columns

| Column | Meaning |
|---|---|
| **Job ID** | The vanilla job identifier from `libraries/jobs.xml` (or a DLC's jobs file). |
| **Ships** | The vanilla quota (max ship count in the pool) as defined by the base game. Displayed for reference only — not editable here. |
| **Enabled/Disabled** | Per-job DA-side toggle. Disabling adds the job ID to `$DAJobsDisabledVanillaSpawnedJobIds`, which prevents DA's job manager from queueing replacements for it. |

## The whitelist

Full list of 22 vanilla job IDs DA preserves ([`md/deadairdynamicuniverse.xml:268-272`](https://github.com/mlog4/deadair_scripts)):

### Hatikvah exploration (3 entries)

| Job ID | Purpose |
|---|---|
| `hatikvah_resourcescout_sm_deepspace_single` | S/M-class scout ships wandering deep space |
| `hatikvah_free_miner_ml_liquid_deepspace_single` | Solo M/L-class gas miners |
| `hatikvah_free_miner_l_solid_deepspace_largegroup` | L-class mining group for solid resources |

### Scale Plate Pact (7 entries)

| Job ID | Purpose |
|---|---|
| `scaleplate_plunderer_l_cluster` | L-class plunderer packs in "cluster" (border) sectors |
| `scaleplate_plunderer_l_cluster_reduced` | Same, reduced-count variant for restraint |
| `scaleplate_scavenger_m_cluster` | M-class scavengers in border sectors |
| `scaleplate_plunderer_m_cluster` | M-class plunderers in border sectors |
| `scaleplate_smuggler_s` | S-class smugglers |
| `scaleplate_scavenger_sm_deepspace` | S/M scavengers in deep space |
| `scaleplate_scavenger_m_cluster_bor_core` | M scavengers in border-core sectors |
| `scaleplate_scavenger_s_cluster_bor_core` | S scavengers in border-core sectors |
| `scaleplate_plunderer_l_cluster_bor_outer` | L plunderers in outer-border clusters |
| `scaleplate_scavenger_m_cluster_bor_outer` | M scavengers in outer-border clusters |

### Buccaneers (5 entries)

| Job ID | Purpose |
|---|---|
| `buc_patrol_m_hidden` | M-class hidden patrols |
| `buc_patrol_s_hidden` | S-class hidden patrols |
| `buc_patrol_s_hidden_antisat` | S-class anti-satellite patrols |
| `buc_plunderer_m_hidden_op` | M-class operating plunderer patrols |
| `buc_plunderer_m_hidden` | M-class hidden plunderers |
| `buc_guerilla_m_cluster` | M-class guerilla groups in cluster sectors |
| `buc_guerilla_infiltrator_s_cluster` | S-class infiltrator variants |

### Kha'ak (2 entries)

| Job ID | Purpose |
|---|---|
| `khaak_fighter_s_deepspace_single` | Solo S-class Kha'ak fighters wandering deep space |
| `khaak_fighter_s_deepspace_group` | S-class Kha'ak fighter groups |

## Observed values from the sample save

The "Ships" column shows vanilla's own quota — not something DA sets:

| Job ID | Ships (vanilla quota) |
|---|---|
| `hatikvah_resourcescout_sm_deepspace_single` | 4 |
| `hatikvah_free_miner_ml_liquid_deepspace_single` | 1 |
| `hatikvah_free_miner_l_solid_deepspace_largegroup` | 1 |
| `scaleplate_plunderer_l_cluster` | 9 |
| `scaleplate_scavenger_m_cluster` | 16 |
| `scaleplate_plunderer_m_cluster` | 8 |
| `scaleplate_smuggler_s` | 8 |
| `scaleplate_scavenger_sm_deepspace` | 9 |
| `buc_patrol_m_hidden` | 5 |
| `buc_patrol_s_hidden` | 10 |
| `buc_patrol_s_hidden_antisat` | 32 |
| `buc_plunderer_m_hidden_op` | 2 |
| `buc_plunderer_m_hidden` | 9 |
| `khaak_fighter_s_deepspace_single` | 13 |
| `khaak_fighter_s_deepspace_group` | 8 |

Total: roughly 130+ ships across the whitelist at any time.

## Why this menu exists

DA's Smart Sector Tags (SST) subsystem is aggressive — it replaces many vanilla job spawns with its own faction-role-driven scheduler. But some vanilla jobs are **too integral to the game feel** to override:

- **Hatikvah exploration:** Hatikvah gameplay identity revolves around long-range exploration and free-mining. Overriding those would break Hatikvah entirely.
- **Scale Plate scavengers/plunderers:** Their border-sector pirate/scavenger patrols are what makes Scale Plate territory feel dangerous.
- **Buccaneer hidden patrols:** Same reason for Buccaneers — they're a hidden-patrol faction by design.
- **Kha'ak deepspace fighters:** Vanilla deepspace Kha'ak encounters are the "background threat" flavor. Deleting them would make deep space feel empty.

This menu lets you turn any of them off if you want less spawn density, or you're running a modded save where a specific job conflicts with something else.

## When to disable a job

- **Fewer Kha'ak encounters:** disable `khaak_fighter_s_deepspace_single` and `khaak_fighter_s_deepspace_group` to eliminate deepspace Kha'ak wanderings entirely.
- **Less pirate pressure:** disable the Buccaneer patrols to reduce hidden ambushes in Buccaneer-adjacent sectors.
- **Cleaner Hatikvah space:** disable the Hatikvah free miners if you want their sectors less busy.
- **Performance:** disabling several high-count jobs (e.g. `buc_patrol_s_hidden_antisat` at 32 ships) reduces load in a heavy save.

## Interaction with SST

Even if you enable all 22 vanilla jobs here, they run **in addition to** SST-driven faction jobs — not instead of. The vanilla-preserved jobs supplement the SST pool, they don't replace it. Turning them all off will not stop DA from queuing its own patrols per your [Jobs Quotas](../quotas/) settings.

## Interaction with Remove Space Job Exclusivity

The [Remove Space Job Exclusivity](../#da-jobs-options) toggle on the parent menu affects how these vanilla jobs share sectors with other factions' patrols. When on (default), the vanilla-preserved jobs and other faction patrols can coexist in the same sector. When off, whichever faction "owns" a sector's exclusivity monopolizes it.

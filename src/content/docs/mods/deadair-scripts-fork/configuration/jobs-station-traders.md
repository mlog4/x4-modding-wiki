---
title: Station Traders (ST)
description: Subordinate M-class traders spawned for each player-friendly trade station. Introduced in v3.0-beta1 Phase 2+3+5v2 with a 5-sector close-neighbor blacklist.
---

Each player-friendly trade station gets a set of subordinate M-class traders that shuttle wares in/out on the player's behalf. Reduces micromanagement of a sprawling logistics network. Introduced in v3.0-beta1 Phase 2+3+5v2.

## Mechanic

On discovery of a new trade station belonging to a faction the player is `>= friend` with, DA spawns `ST_QuotaPerStation` M-class traders assigned to that station. Every `ST_ReconcileIntervalMin` minutes DA rebuilds the total roster — replaces destroyed traders, moves excess back to shipyards, migrates orphans when their parent station is destroyed.

A **5-sector blacklist** excludes trade stations that sit too close together (added mlog094 via sector.macro references for save-stability):

- Earth
- Reflected Stars
- Towering Wave
- Atreus' Clouds
- Rolk's Demise

The blacklist isn't in the menu — it's hardcoded via sector.macro in [`md/mlog_da_station_traders.xml`](https://github.com/mlog4/deadair_scripts). You can dump the runtime blacklist status via mlog_dev_bridge (developer feature).

> **📷 Screenshot needed:** DA Jobs → Station Traders submenu.
> _File: `menu-station-traders.jpg`_

## Settings

| Setting | Default | Effect |
|---|---|---|
| `ST_Enabled` | `true` | Master toggle. |
| `ST_QuotaPerStation` | `20` | M-traders per trade station. Higher = denser logistics, more CPU cost. |
| `ST_ReconcileIntervalMin` | `30` (min) | How often the reconcile pass runs (rebuild roster, cleanup dead entries). |
| `ST_DebugVerbose` | `false` | Verbose `[ST]` log lines. |

---
title: Mlog Trade Optimizer
sidebar:
  order: 10
description: Ware price cycle + Station Subordinate Traders + Production Station Traders — three subsystems that keep faction logistics fluid. 4 top options + full ST/PST controls (merged here in Phase 5v2).
---

Three logistics subsystems sharing one menu:

1. **Trade Optimizer** — cycles ware prices at trade stations and production factories to keep the price signal moving. Fixes vanilla's tendency for prices to freeze once a station reaches equilibrium, which stalls NPC trader activity.
2. **Station Subordinate Traders (ST)** — spawns and maintains subordinate M-traders for each discovered player-friendly trade station.
3. **Production Station Traders (PST)** — same idea for production factories.

**ST/PST were originally in their own submenus (v3.0-beta1 Phase 2-4). Phase 5v2 (mlog094) merged them into this Trade Optimizer menu as sub-sections.**

## In-game view

![Mlog Trade Optimizer main menu — 3 sections (Trade Optimizer + ST + PST) with live Discovered/Fleet counters](/x4-modding-wiki/img/mods/deadair-scripts/menu-trade-optimizer.jpg)

Layout:

- **Top section (`Mlog Trade Optimizer Options`)** — 4 fields controlling the price-cycle pass.
- **Middle section (`Station Subordinate Traders`)** — 4 fields + live footer showing `Discovered: N | Fleet: N`.
- **Bottom section (`Production Station Traders`)** — 4 fields + live footer.

## Mlog Trade Optimizer Options (top)

| Setting | Default | Effect |
|---|---|---|
| **Enable Trade Optimizer** | `Enabled` | Master toggle for the whole price-cycle subsystem. `$DATradeOptimizerEnable` in source. Off = no price cycling on any station. |
| **Faction Cycle Interval** | `300 s` (5 min) | How often the optimizer walks one faction's stations. Slider in seconds. Higher = fewer CPU-heavy sweeps but slower economic response. `$DATradeOptimizerInterval`. |
| **Process Trade Stations** | `Enabled` | Include trade stations in the cycle. Off = trade stations left alone (prices only move via vanilla mechanisms). `$DATradeOptimizerProcessTradeStations`. |
| **Process Production Factories** | `Enabled` | Include production factories in the cycle. Off = factories left alone. `$DATradeOptimizerProcessFactories`. |

**Why 5 min per faction:** the optimizer walks one faction at a time (round-robin). With ~25 vanilla factions, a full galaxy cycle takes ~125 minutes — deliberately slow to avoid CPU spikes and price-thrash. This is a *slow* system by design.

## Station Subordinate Traders (middle)

Introduced v3.0-beta1 Phase 2+3+5v2. Each discovered player-friendly trade station gets subordinate M-traders that shuttle wares in/out on the player's behalf.

| Setting | Default | Range | Effect |
|---|---|---|---|
| **Station Subordinate Traders** | `Enabled` | on/off | Master toggle. `md.$mlog_da_st_state.$Enabled` in source. |
| **Quota per Station** | `20` | `10..25` | M-traders spawned per discovered trade station. |
| **Reconcile Interval** | `30 min` | `5..120 min`, step 5 | How often the reconcile pass runs (rebuild roster, clean up dead, migrate orphans). |
| **Verbose Log** | `Disabled` | on/off | `[ST]` log lines. |

**Footer:** live counter `Discovered: <N stations tracked> | Fleet: <total ST ships alive>`.

**Observed in the sample save:** `Discovered: 23 | Fleet: 371` — 23 trade stations tracked, 371 ST traders alive across them. 371 / 23 ≈ 16 avg (below the quota of 20 because some stations are still spinning up + some ST casualties are being backfilled).

**5-sector blacklist** ([hardcoded](https://github.com/mlog4/deadair_scripts) at `md/mlog_da_station_traders.xml`, mlog094): Earth, Reflected Stars, Towering Wave, Atreus' Clouds, Rolk's Demise. Trade stations sitting in these sectors are excluded from ST management for save-stability reasons.

## Production Station Traders (bottom)

Introduced v3.0-beta1 Phase 4. Analog of ST for **production factories**. Each factory gets subordinate M-traders that specifically shuttle inputs/outputs for that recipe.

**PST is OFF by default** (localization label id 910 literally reads "Production Station Traders (OFF by default)"). It's opt-in — enable it if you want more logistics density. The observed save has enabled it manually.

| Setting | Default | Range | Effect |
|---|---|---|---|
| **Enable** | `Disabled` | on/off | Master toggle. `md.$mlog_da_pst_state.$Enabled`. |
| **Quota per Production Station** | `2` | `1..4` | M-traders spawned per discovered production factory. Lower than ST (`20`) because factories typically have fewer wares in play. |
| **Reconcile Interval** | `60 min` | `15..180 min`, step 5 | Reconcile pass interval. Slower than ST. |
| **Verbose Log** | `Disabled` | on/off | `[PST]` log lines. |

**Footer:** live counter `Discovered: <N factories tracked> | Fleet: <total PST ships alive>`.

**Observed in the sample save:** `Discovered: 345 | Fleet: 403` — 345 factories tracked, 403 PST traders alive. 403 / 345 ≈ 1.17 avg (below the quota of 2 — reflects heavy spawn-in-progress state or CPU-throttled spawning). 345 discovered production factories is a **lot** — this is a mid/late-game economy.

## Interaction with vanilla trade behavior

- **Vanilla NPCs still trade normally.** ST/PST traders are *additional* logistics, not replacements.
- **Player-owned trade orders take precedence** — ST/PST won't queue an order that competes with your own manual assignment.
- **The Trade Optimizer price cycle is independent** of ST/PST. You can turn off Trade Optimizer but keep ST/PST running (or vice versa) — they don't share code paths.

## Preset scope

The top-section 4 options (Trade Optimizer master + interval + 2 process toggles) are in [Configuration Presets](./presets/) scope. The **ST and PST sections are NOT** — those live in the `mlog_da_st_state` / `mlog_da_pst_state` namespaces which the preset registry doesn't touch. Presets keep your ST/PST values unchanged when switched.

## Gameplay effect at recommended defaults

- **Prices stay fluid:** even in stable saves, the top ware prices at each station cycle every ~2 hours in-game. NPC traders find profitable routes more consistently.
- **Player-friendly trade stations self-provision:** with ST enabled (default), player-friendly trade stations get automatic M-trader coverage. You still have to build them, but they staff themselves.
- **Production factories get local logistics** (with PST manually enabled): 1-2 M-traders per factory feed inputs and export outputs without you assigning them.

## Related mechanics documented elsewhere

- [DA Fill](./fill/) — separately handles the **static** side (topping up ware counts inside stations). Trade Optimizer handles the **dynamic** side (price cycling).
- [DA Jobs → SST (Smart Sector Tags)](./jobs/) — that's the *sector patrol* subsystem, unrelated to ST/PST despite the naming similarity.

## Notes

- **PST default OFF** — historical caution flag. The subsystem is stable in v3.0-beta1-mlog094 but the CPU cost scales with your factory count, so it stays opt-in.
- **Live counters update on menu open, not real-time** — the `Discovered / Fleet` numbers are read at menu-open. Reopen the menu to refresh.
- **The 5-sector ST blacklist is hardcoded** — no UI toggle. To modify it, edit `md/mlog_da_station_traders.xml` directly.

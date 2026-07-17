---
title: DA God
description: Override / augment the vanilla God engine — controls faction station creation rate, permitted build sites, upgrade behavior, and max module count.
---

Override / augment the vanilla God engine (which controls faction station creation). DA can accelerate or gate station requests, expand attempted recovery on failed builds, and change the max module count factions try to grow to.

> **📷 Screenshot needed:** DA God submenu.
> _File: `menu-god.jpg`_

## Settings

| Setting | Default | Effect |
|---|---|---|
| `God_Enable` | `true` | Master toggle. |
| `God_StationRequestInterval` | `1` (hours) | How often DA re-evaluates station creation demand. Lower = faster faction expansion. |
| `God_AllowBuildInFriendly` | `true` | Allow factions to build in each other's friendly sectors (subject to relations). |
| `God_AllowBuildInPlayer` | `true` | Allow factions to build inside player-owned sectors (subject to your relation with them). Turn off to keep player space clean. |
| `God_AttemptRecovery` | `true` | Retry failed builds after a delay. Off = one-shot attempt per plan. |
| `God_StationUpgradeEnable` | `true` | Allow factions to expand existing stations by adding modules. |
| `God_MaxModuleSetting` | `40` | Max modules a single station may grow to. Higher = megastations, more CPU. |
| `God_DetailedDebug` | `false` | Verbose `[GOD]` log lines. |
| `God_XtremelyDetailedDebug` | `false` | Very verbose — every station-request evaluation logged. |

## Gameplay effect at recommended defaults

Factions actively grow their industry. A 50-hour save typically has 15-25 more stations galaxy-wide than vanilla. `God_MaxModuleSetting = 40` is a good balance — larger stations look impressive but CPU cost grows.

## mlog094 note (v3.0-beta1)

God-created stations respect the `hasstagedconstruction` guard so they participate in DA's staged expand-station mechanic rather than one-shot instant builds.

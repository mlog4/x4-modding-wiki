---
title: DA Fill
description: Station Fill mechanic — tops up trade stations, shipyards, wharfs with wares at adjustable intervals. Fixes vanilla's half-empty stations problem.
---

Tops up trade stations, shipyards, and wharfs with wares at adjustable intervals. Fixes vanilla's tendency to leave stations sitting half-empty when faction economy stalls. Also handles ship-mod (paint/tuning) topups for the faction ship pool.

## Mechanic

Every `Fill_Interval` minutes DA walks each faction's stations. For each station, DA computes the target fill (per DA-Eco storage sizing if installed, else vanilla capacity) and orders wares up to that level. Faction-account gating prevents infinite spending — poor factions fill less. Optional `LimitByValue` throttles top-ups when the ware price is high (defer buying overpriced wares until economy stabilizes).

> **📷 Screenshot needed:** DA Fill submenu.
> _File: `menu-fill.jpg`_

## Settings

| Setting | Default | Effect |
|---|---|---|
| `Fill_Enable` | `true` | Master toggle. |
| `Fill_Interval` | `60` (min) | How often stations get topped up. Lower = more active economy, higher CPU cost. |
| `Fill_ShipModsEnable` | `true` | Include ship equipment mods (engine tunings, shield mods) in the fill pass. |
| `Fill_ShipModFleetEnable` | `true` | Extend ship-mod topups to fleet-tier ships (not just capital ships). |
| `Fill_ShipModPaintEnable` | `true` | Include paintmods so faction ships aren't all default-colored. |
| `Fill_LimitByValue` | `true` | Defer high-price wares — smoothes economy shocks. Off = fill regardless of price. |
| `Fill_XenonProtection` | `true` | Protect Xenon shipyards from over-fill exhaustion (Xenon can't use faction accounts the same way). |
| `Fill_DetailedDebug` | `false` | Verbose `[FILL]` log lines. |

## Gameplay effect at recommended defaults

You can visit any trade station and reliably find wares available (unlike vanilla where stations often sit at 5% fill for hours). Faction economies stay responsive; player-owned stations still have to compete on price.

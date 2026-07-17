---
title: 'Mlog: Extension'
description: Governs when and where factions plan new economic expansion — additional trade stations, wharfs, shipyards. 6h TTL on failed-build attempts.
sidebar:
  order: 15
---

Governs when and where factions plan new economic expansion — additional trade stations, wharfs, shipyards. Introduced in mlog062+. Uses a 6h TTL on failed-build attempts (mlog087) so that failed placements don't permanently block a cluster.

## Mechanic

The Extension observer polls faction wharf/shipyard counts every 30 min. When a faction has fewer than expected assets and a valid extension target exists (distant enough from existing owned space per `MinDist*`), it queues a build request. Failed placements are tracked with a timestamp; after 6 hours of game time the block is cleared and the cluster becomes eligible again.

For the underlying TTL mechanic details see [6h TTL on Extension Built lists](../../mechanics/#6h-ttl-on-extension-built-lists).

> **📷 Screenshot needed:** Mlog: Extension submenu, showing all Ext_* sliders.
> _File: `menu-extension.jpg`_

## Settings

| Setting | Default | Effect |
|---|---|---|
| `Ext_Enable` | `true` | Master toggle. Off = no extension planning at all. |
| `Ext_EnableLog` | `false` | Emit `[EXT]` debug lines to `script.log`. Turn on to diagnose why a build isn't happening; expect heavy spam. |
| `Ext_AllowFactionTradeStation` | `true` | Allow expansion of **trade stations** (peaceful factions). |
| `Ext_MinDistTradeStation` | `2` (jumps) | Minimum jump distance from the faction's existing trade station to allow a new one. `0` = allow same sector; `2` = must be at least 2 jumps away. Prevents clustering. |
| `Ext_AllowFactionWharfShipyard` | `true` | Allow expansion of **wharfs and shipyards** for lawful factions. |
| `Ext_MinDistFactionWharfShipyard` | `5` (jumps) | Minimum jump distance for new wharf/shipyard sites. Higher = more spread out. |
| `Ext_AllowXenonWharfShipyard` | `true` | Allow Xenon to expand their own wharfs and shipyards. |
| `Ext_MinDistXenonWharfShipyard` | `2` (jumps) | Minimum jump distance between Xenon shipyards. Lower than lawful factions since Xenon expand more aggressively. |

## Gameplay effect at recommended defaults

Every faction attempts to grow. Peaceful factions add trade stations in newly-secured sectors after ~5-15 game hours; wharfs after 20-40h. Xenon rebuild shipyards after you demolish one (unless you also cap-nuke their supply chain).

## Turn off if

You want a fixed-map, static-economy experience where factions never expand beyond their gamestart assets. Set all three `Allow*` flags to `false`.

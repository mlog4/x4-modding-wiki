---
title: Fill Faction Menu
description: Per-faction on/off toggles for Trading Station and Ship Building Station fills. Excludes individual factions from the automatic fill pass.
sidebar:
  order: 1
---

Per-faction opt-in table. Each row is one faction with **two independent toggles**: Trading Station (whether DA fills that faction's trade stations) and Ship Building Station (whether DA fills that faction's shipyards and wharfs).

## In-game view

![Fill Faction Menu — 22 factions with Trading Station + Ship Building Station toggle columns](/x4-modding-wiki/img/mods/deadair-scripts/fill-faction-menu.jpg)

## Columns

| Column | Values | Effect |
|---|---|---|
| **Faction** | Every enumerated faction (vanilla + modded) | The subject faction. |
| **Trading Station** | `Enabled` / `Disabled` | Whether DA runs the trade-station fill logic ([Max/Min percentage bands](../#trade-station-percentage-band)) on this faction's trade stations. |
| **Ship Building Station** | `Enabled` / `Disabled` | Whether DA runs the shipyard/wharf fill logic ([Min percentage band](../#shipyardwharf-percentage-band)) on this faction's yards. |

## Default state in the observed save

Most factions default to `Enabled / Enabled`. Notable exceptions:

- **Kha'ak** — `Disabled / Disabled`. Kha'ak have no economy to fill.
- **Xenon** — `Disabled / Enabled`. Xenon don't run trade stations so the trading toggle is inert, but their shipyards/wharfs get filled (subject to the [Xenon Shipbuilding Setting](../#special) master, which forces the min-25 % floor when on).

## When to disable a faction

- **Bandwidth control:** save-file CPU cost — disabling factions you never trade with cuts the tick cost. Especially useful if you have many modded factions.
- **Deliberate starvation:** you want a specific faction to remain economically weak / dying. Disable both toggles and their stations gradually run dry.
- **Modded-faction cleanup:** a compat mod added a faction that shouldn't participate in DA fill. Disable them here without touching global toggles.

## When to re-enable

- **Rescue a struggling AI:** if a faction is losing sectors because they can't afford supplies, re-enabling gives them the DA fill floor.
- **Reversing a starvation strategy:** flip both toggles back on.

## Interaction with Trading Station Credit Limit

Even when Trading Station is `Enabled` on this menu, the actual amount of fill is still capped by the faction's account balance if [Trading Station Credit Limit](../#special) is on. So enabling the row does not guarantee full-strength fills — the faction still needs credits.

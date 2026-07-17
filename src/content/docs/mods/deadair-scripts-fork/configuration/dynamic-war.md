---
title: DA Dynamic War
description: Periodic AI-to-AI relation shifts drive galaxy politics on their own. Six event types range from small nudges to instant max-relation flips.
sidebar:
  order: 2
---

Periodic AI-to-AI relation shifts drive galaxy politics on their own. Six event types range from small nudges to instant max-relation flips (declarations of war, alliance pacts, temporary favors).

## Mechanic

Every `War_Interval` minutes the war engine picks a random subset of factions (up to `War_PossibleFactionsPerEvent`) and evaluates whether the current relation state warrants an event. Event weights consider proximity, military strength, and the **fatigue system** — factions that recently participated in an event get a cool-down before they can be picked again. Optional favor system (`War_FavorsEnable`) lets factions "call in debts" from prior alliance events.

> **📷 Screenshot needed:** DA Dynamic War submenu — all sliders + toggles.
> _File: `menu-dynamic-war.jpg`_

## Settings

| Setting | Default | Effect |
|---|---|---|
| `War_Enable` | `true` | Master toggle. |
| `War_FavorsEnable` | `true` | Enable the favor system — factions can "call in debts" from past events. |
| `War_Interval` | `30` (min) | How often the war engine evaluates. Lower = more frequent shifts. |
| `War_FlavorEnable` | `true` | Enable flavor events (small, thematic relation nudges) alongside major events. |
| `War_DetailedDebug` | `false` | Verbose `[WAR]` log lines. |
| `War_RelationsFixEnable` | `true` | Periodically correct out-of-bounds relations from stray vanilla/mod events. |
| `War_PossibleFactionsPerEvent` | `4` | Max number of factions considered for a single event. Higher = larger politics ripples. |
| `War_FatigueTimer` | `120` (min) | Fatigue cool-down after a faction participates in an event. |
| `War_StatTracking` | `true` | Track war-event statistics for reports/info menus. |
| `War_Fatigue` | `true` | Enable the fatigue system. Turning off = faster / more chaotic politics. |

## Gameplay effect at recommended defaults

1-2 minor events per game hour, and a major shift (war declaration, alliance) every 8-15 hours. Feels organic. In a 100+ hour save you can watch the political map fully redraw itself.

## Turn off if

You want vanilla static faction relations. Some players prefer canonical Argon-Antigone / Split-Paranid tension without evolution.

---
title: DA Dynamic News
description: Logbook + notification feed for galaxy-scale events — sector ownership shifts, major station events, notable relation changes.
---

Logbook + notification feed for galaxy-scale events. Sector ownership shifts, major station events, notable relation changes get reported like real news bulletins.

## Mechanic

Every `News_Interval` minutes DA scans the last window of galaxy events (station losses, gate captures, ownership changes) and packages them into player-facing notifications. Optionally filtered to known-factions-only so you don't get spammed with intel about factions you've never met.

> **📷 Screenshot needed:** DA Dynamic News submenu with all toggles.
> _File: `menu-dynamic-news.jpg`_

> **📷 Screenshot needed:** In-game logbook showing a Dynamic News entry.
> _File: `news-logbook-entry.jpg`_

## Settings

| Setting | Default | Effect |
|---|---|---|
| `News_Enable` | `true` | Master toggle. |
| `News_EnableNotifications` | `true` | Show news as top-of-screen notification popups. |
| `News_EnableLogbook` | `true` | Write news to the player logbook (persistent, browsable later). |
| `News_EnableNewsStorage` | `true` | Store news history internally so the reader menu can browse past bulletins. |
| `News_Interval` | `10` (min) | How often DA generates news. Lower = more chatter. |
| `News_KnownFactionsOnly` | `true` | Only surface events involving factions you've discovered. Recommended — otherwise early-game feels overwhelming. |
| `News_DetailedDebug` | `false` | Verbose `[NEWS]` log lines. |

## Gameplay effect at recommended defaults

About one meaningful news bulletin per hour of play. Feels alive, doesn't spam. Turning `KnownFactionsOnly` off floods the log until you've discovered most factions.

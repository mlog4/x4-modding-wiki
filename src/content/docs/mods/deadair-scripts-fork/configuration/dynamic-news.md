---
title: DA Dynamic News
description: Logbook + notification feed for galaxy-scale events. Options for chatter frequency and audience filter, plus an embedded live Recent News list of the last events.
sidebar:
  order: 3
---

Logbook + notification feed for galaxy-scale events — sector ownership shifts, station starts/expansions/losses, faction reputation changes, Xenon invasions. The menu doubles as a **live event viewer**: below the option list, the "Recent News" table shows the last stored bulletins in chronological order.

## In-game view

![DA Dynamic News — 7 option fields on top + embedded Recent News table below](/x4-modding-wiki/img/mods/deadair-scripts/menu-dynamic-news.jpg)

Layout:

- **Top section (`DA Dynamic News Options`)** — 7 configurable fields.
- **Bottom section (`Recent News`)** — read-only event log with columns **Time / Origin / News**.

## Mechanic

Every `DN Interval` minutes DA scans the last window of galaxy events (station starts, module expansions, station losses, ownership changes, reputation deltas, Xenon expeditionary force spawns) and packages them into player-facing bulletins. Each bulletin is (optionally) shown as a notification popup, written to the player logbook, and stored in DA's internal News Storage so the Recent News viewer stays populated.

The **Restrict News to Known Factions** filter keeps early-game noise down — you only see events from factions you've discovered. Turning it off floods the log with intel about factions you've never met.

## Settings

| Setting | Default | Effect |
|---|---|---|
| **Enable Dynamic News** | `Enabled` | Master toggle for the whole system. |
| **Enable DN Notifications** | `Enabled` | Show news bulletins as top-of-screen notification popups. |
| **Enable DN Logbook** | `Enabled` | Write bulletins to the vanilla player logbook (persistent, browsable via the logbook UI later). |
| **Enable DN News Storage** | `Enabled` | Store bulletins in the mod's internal News Storage so the Recent News viewer stays populated. Off = viewer stays empty. |
| **DN Interval** | `10 min` | How often DA generates news. Lower = more chatter. |
| **Restrict News to Known Factions** | `Enabled` | Only surface events involving factions you've discovered. Recommended — otherwise early-game feels overwhelming. |
| **Enable DN Debug** | `Disabled` | Verbose `[NEWS]` log lines. |

## Recent News table

Read-only chronological event feed embedded in the menu.

### Columns

| Column | Meaning |
|---|---|
| **Time** | Elapsed game time when the event was recorded. Format: `Nd:HHh:MMm` (days:hours:minutes since game start). |
| **Origin** | Faction responsible for the event (or the affected pair for cross-faction events like reputation changes — e.g. "Terran Protectorate & Hatikvah Free League"). |
| **News** | Descriptive text with faction shortname, station idcode, sector name, and outcome. |

### Event types observed in the screenshot

Real events from a live save, in menu-order:

| Origin | Event | Meaning |
|---|---|---|
| Xenon | `XEN Expeditionary Force I(QRQ-807) in sector Profit Center Alpha. Invasion started in Bright Promise.` | Xenon expedition ship spawned from a target sector, staging an invasion against a neighboring sector. |
| Free Families | `New stations started: FRF Factory in Tharka's Ravine XXIV & FRF Factory in Heart of Acrimony II.` | Faction began building new stations (multiple at once). |
| Teladi Company | `Started TEL Factory(LAY-069) in Memory of Profit X to produce Scanning Arrays.` | Single new factory started with a specific recipe. Idcode + sector + product all shown. |
| Scale Plate Pact | `Started SCA Factory(SVI-890) in Sanctum Verge to produce Claytronics.` | Same shape. |
| Argon Federation | `Started ARG Factory(DKH-397) in Morning Star IV to produce Military Schematics.` | Same shape (Argon). |
| Zyarth Patriarchy | `Started ZYA Factory(IYH-476) in Family Nhuut to produce Claytronics.` | Same shape (Zyarth). |
| Teladi Company | `TEL Teladi Defence Platform in Windfall I Union Summit destroyed by Xenon.` | Existing station lost — attacker faction named. |
| Scale Plate Pact | `Expanded SCA Ship Technology Factory III(EJP-633) in Nopileos' Fortune II with 2 modules to produce Nostrop Oil. Started SCA Factory(AUO-683) in Sanctum Verge to produce Spices.` | Combined bulletin — expansion + new factory in one line. |
| Terran Protectorate & Hatikvah Free League | `Reputation lost: -5 ; Current reputation: -20` | Cross-faction reputation change (both sides affected). |
| Teladi Company | `Stations lost: TEL Teladi Defence Platform in Eighteen Billion & TEL Teladi Defence Platform in Bright Promise.` | Multiple stations lost in the same tick. |
| Windfall I Union Summit | `Windfall I Union Summit Changed Owner From Teladi Company. New Owner: Xenon` | Sector ownership shift bulletin. Origin = the sector name itself. |
| Riptide Rakers | `RIP Riptide Rakers Wharf in Avarice I destroyed by Xenon.` | Wharf loss — special (wharfs/shipyards are extra-important). |

### Categories

Reading the observed events, the news engine emits these bulletin types:

1. **New station started** — faction began a factory / defence platform / wharf / shipyard. Includes: faction shortname prefix (`FRF`, `TEL`, `SCA`, `ARG`, `ZYA`, `RIP` etc.), station type, idcode, sector, produced ware.
2. **Expanded station** — modules added to an existing station. Includes idcode + module count + new-recipe-added.
3. **Station destroyed / stations lost** — existing station taken down. Includes attacker faction name.
4. **Ownership changed** — sector switched hands. Includes previous + new owner.
5. **Reputation change** — cross-faction relation shift. Includes delta + current value.
6. **Xenon Expeditionary Force** — Xenon invasion staging notice. Includes force number, spawn sector, target sector.

Additional bulletin types not visible in the screenshot but produced by the engine may include: gate discovery, Xenon shipyard operational, faction alliance formed, faction license changes. Verifiable by comparing your live viewer with the doc.

## Gameplay effect at recommended defaults

About one meaningful news bulletin per hour of play. Feels alive, doesn't spam. In a 100+ hour save, scrolling the Recent News viewer becomes a mini "history book" of the galaxy — you can trace faction rises and falls chronologically.

Turning `Restrict News to Known Factions` off floods the log until you've discovered most factions — early-game only, later it's fine.

## Related

- [DA Dynamic War](../dynamic-war/) — most news events downstream from war engine outcomes.
- [DA God](../god/) — station-creation events surface here as "Started ... Factory" bulletins.
- [Mlog: Extension](../extension/) — expansion bulletins ("Expanded ... with 2 modules") come from this subsystem's tracker.

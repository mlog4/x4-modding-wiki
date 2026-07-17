---
title: Station Modules
description: Blueprint scan progress for station module wares. 10 module classes shown as sections — Pier / Dock Area / Production / Storage / Defence / Build / Habitation / Welfare / Processing / Connection.
sidebar:
  order: 1
---

Blueprint-progress viewer for station module wares. 10 classes are shown as sub-sections in a fixed order.

## In-game view

![Station Modules — Pier Module and Dock Area Module sections visible with completed rows](/x4-modding-wiki/img/mods/deadair-scripts/bp-station-modules.jpg)

## Sections

The page groups tracked wares under 10 class headings (source order at [`md/deadairdynamicuniversemenus.xml:6707`](https://github.com/mlog4/deadair_scripts)):

1. **Pier Module** — `class.pier` (default 20 fragments)
2. **Dock Area Module** — `class.dockarea` (default 20)
3. **Production Modules** — `class.production` (default 30)
4. **Storage Modules** — `class.storage` (default 60)
5. **Defence Modules** — `class.defencemodule` (default 40)
6. **Build Modules** — `class.buildmodule` (default 20)
7. **Habitation Modules** — `class.habitation` (default 40)
8. **Welfare Modules** — `class.welfaremodule` (default 20)
9. **Processing Modules** — `class.processingmodule` (default 20)
10. **Connection Modules** — `class.connectionmodule` (default 20)

## Observed sample-save state

**Pier Module section (24 tracked entries):**

All 24 pier variants at `0/20` scans (untouched), except:
- **Terran 3-Dock E Pier** — `completed` (green)

Full observed list: Argon 1-Dock Pier, Argon 1-Dock Short Pier, Argon 3-Dock E Pier, Argon 3-Dock T Pier, Boron 1-Dock Pier, Boron 3-Dock E Pier, Boron 4-Dock T Pier, Boron Trading Station 4-Dock Pier, Boron Trading Station Hexa-Dock Pier, Paranid 1-Dock Pier, Paranid 3-Dock E Pier, Paranid 3-Dock T Pier, Split 1-Dock Pier, Split 3-Dock E Pier, Split 4-Dock T Pier, Teladi 1-Dock Pier, Teladi 3-Dock E Pier, Teladi 3-Dock T Pier, Terran 1-Dock Pier, Terran 3-Dock E Pier (completed), Terran 3-Dock T Pier, Terran 4-Dock T Pier, Terran Trading Station Hexa-Dock Pier.

**Dock Area Module section (12 tracked entries):**

Completed: **1M6S Basic Dock Area**, **S/M Venture Sendoff Dock**, **Terran 4M10S Luxury Dock Area**.

Rest at 0/20: 1M6S Luxury Dock Area, 1M6S Standard Dock Area, 3M6S Basic Dock Area, 3M6S Luxury Dock Area, 3M6S Standard Dock Area, 8M Luxury Dock Area, Boron 4M14S Luxury Dock Area, Small & Medium Ship Showroom, Small Ship Showroom 01, Small Ship Showroom 02.

**Production Modules section** — continues below dock area (visible at bottom of screenshot but content cut off).

## Read

The player has completed **at least 4 blueprints in this category** (Terran 3-Dock E Pier + 3 Dock Area variants). Progress on the rest sits at 0/20 — meaning DA has *seen* these wares but no scans have landed yet, or the player just started scanning ship-based modules.

The presence of `Terran 4M10S Luxury Dock Area` as completed but `Small & Medium Ship Showroom` at 0/20 suggests early Terran-territory activity — makes sense with player-owned Terran assets in the observed save.

## Interaction with vanilla blueprints

Once a module blueprint is `completed` here, DA fires `add_blueprints` (line 11840+ region) to award it to the player's construction menu. From then on you can plan stations that include this module.

If a module already exists in `player.blueprints.<ware>.any.exists`, DA skips tracking it entirely — no duplicate entries.

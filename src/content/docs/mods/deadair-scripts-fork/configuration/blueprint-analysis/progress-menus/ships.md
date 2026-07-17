---
title: Ships
description: Blueprint scan progress for ship wares. 5 sections by size class — XS (drones) / S / M / L / XL.
sidebar:
  order: 2
---

Blueprint-progress viewer for ship wares. 5 sections in size order — XS through XL.

## In-game view

![Ships — XS Ships and start of S Ships sections visible](/x4-modding-wiki/img/mods/deadair-scripts/bp-ships.jpg)

## Sections

Fixed section order at [`md/deadairdynamicuniversemenus.xml:6785`](https://github.com/mlog4/deadair_scripts):

1. **XS Ships** — `class.ship_xs` (default 20 fragments — drones + laser towers)
2. **S Ships** — `class.ship_s` (default 40 — fighters + scouts)
3. **M Ships** — `class.ship_m` (default 50 — corvettes + traders + miners)
4. **L Ships** — `class.ship_l` (default 60 — destroyers + freighters)
5. **XL Ships** — `class.ship_xl` (default 60 — carriers + resupply)

## Observed sample-save state

**XS Ships (4 tracked entries), all at `0/20`:**

- Building Drone
- Cargo Drone
- Laser Tower Mk1
- Repair Drone

**S Ships (~36 tracked entries visible), all at `0/40`:**

Ares, Asp, Asp Raider, Balaur, Barracuda, Buzzard Sentinel, Buzzard Vanguard, Callisto Sentinel, Callisto Vanguard, Chimera, Courier (Mineral), Courier Sentinel, Courier Vanguard, Cutlass, Dart, Defence Drone, Discoverer Sentinel, Discoverer Vanguard, Eclipse Sentinel, Eclipse Vanguard (×2 rows — likely from mods), Elite Sentinel, Elite Sport, Elite Vanguard, F, Falcon Sentinel, Falcon Vanguard, Frog, Gas Collector Drone, Gladius, Grouper (Mineral), Guillemot Sentinel, Guillemot Vanguard, Irukandji, ...

**Read:** The list is alphabetized (source line 6788: `sort_list list="$LocWareList" sortbyvalue="loop.element.name"`). Every S-class ship the player has *seen scanned* enters here. No S-blueprints completed yet in the sample save — the player is at the point of active exploration but hasn't focused fire on ship-blueprint hunting.

The **"Defence Drone"** entry in S Ships is interesting — it's not usually player-buildable and doesn't appear in vanilla ship menus, but its ware class is `ship_s` internally so it lands in this bucket. Same for entries like `F` (a very early Egosoft placeholder name that survived in some macros).

**Duplicate rows:** the `Eclipse Vanguard` row shows twice in the screenshot — this happens when two different macros share the same display name (e.g. vanilla Argon Eclipse Vanguard + a modded variant with the same knownname). Both are tracked separately by macro but share a Ware column display.

## Interaction with the [Scan Settings](../../#scan-settings--how-it-works)

- XS ships (20 fragments) are the fastest to complete — 5-10 police scans of a specific drone type will unlock its blueprint.
- S ships (40) take 10-15 scans typically.
- M ships (50) take 15-20 scans.
- L (60) and XL (60) take 20-30+ scans — often a dedicated hunting session.

To speed things up: raise your scanner Mk (each scan awards more fragments at higher scan levels), and prioritize sectors where a specific ship type flies frequently.

## Notes

- **Ship wares are tracked by ware, not by macro** — the same ship class in different variants (Sentinel / Vanguard / Raider) each counts as a separate blueprint.
- **Modded ships** appear automatically. If you install a compat mod with new ship classes, their entries show up here once the first scan happens.
- **Ships you already own** the blueprint for don't appear here — DA filters via `player.blueprints.{ware}.any.exists`.

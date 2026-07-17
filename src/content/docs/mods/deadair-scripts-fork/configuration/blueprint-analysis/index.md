---
title: DA Blueprint Analysis
description: Police-scan blueprint acquisition. Enemy ships accumulate scan fragments across encounters; enough fragments awards the blueprint to the player. 2 options + 34-class scan-requirement table + 4-menu Progress viewer.
sidebar:
  order: 9
---

Police assets scan enemy ships for blueprint fragments. Once a ship (or station module, equipment, etc.) accumulates enough fragments across scans, the blueprint is added to the player's bank.

Originally by **Jack the Stripper**; permission to continue was granted and this fork extends the original with configurable per-class scan requirements + granular per-category progress viewing.

## In-game view

![DA Blueprint Analysis main menu — 2 options + Scan Settings 34-class table + Progress Menus link](/x4-modding-wiki/img/mods/deadair-scripts/menu-blueprint.jpg)

Layout:

- **Top section (`DA Blueprint Analysis Options`)** — 2 configurable fields.
- **Middle section (`Scan Settings`)** — 34 object-class rows, each with an "Adjust Scan Requirements" slider.
- **Bottom section (`DA Blueprint Analysis Menus`)** — 1 sub-menu: [Progress Menus](./progress-menus/).
- **Footer:** _"The original mod that inspired this was made by Jack the Stripper and permission to continue the mod was granted."_

## DA Blueprint Analysis Options

| Setting | Default | Effect |
|---|---|---|
| **Enable DA Blueprint Analysis** | `Enabled` | Master toggle. When off, `event_scan_finished` and `policeassetscannedship` signals stop feeding the tracker table. `$DABPEnable` in source. |
| **Enable BP Debug** | `Disabled` | Verbose `[BP]` log lines with per-scan diagnostics (macro id, class, fragments awarded, remaining). `$DABPDebugEnable`. |

## Scan Settings — how it works

Every unique ware DA has seen scanned enters `$DABPTracking` as a tuple `[required_count, remaining_count]`. Each subsequent scan reduces `remaining_count` by the player's scan level (0 to 4 depending on scanner Mk and short-range vs long-range scan). When `remaining_count` hits 0, the blueprint is granted.

The **required_count** starts equal to the per-class default from this menu. Change a slider here → `$DABPClassRequirements.{class}` updates → newly-tracked wares of that class start at the new value.

**Wares that had progress at the old value keep their remaining_count** but see it re-scaled if the required_count changes (line 11840: `$DABPTracking.{$LocWare} exact="[new_req, new_req]"` — restart the ware at the new required if it changes).

## Scan Settings — 34 classes with defaults

Source: [`md/deadairdynamicuniverse.xml:277-282`](https://github.com/mlog4/deadair_scripts) — `$DABPClassRequirements` table + `$DABPUnkownClassRequirement` fallback for anything not explicitly listed.

### Station module classes (10)

| Class | Default | Meaning |
|---|---|---|
| `buildmodule` | 20 | Build modules |
| `connectionmodule` | 20 | Connection modules (bridges) |
| `defencemodule` | 40 | Defence modules (turret platforms) |
| `dockarea` | 20 | Dock area modules |
| `habitation` | 40 | Habitation modules |
| `pier` | 20 | Pier modules |
| `processingmodule` | 20 | Processing modules |
| `production` | 30 | Production modules |
| `storage` | 60 | Storage modules |
| `welfaremodule` | 20 | Welfare modules |

### Ship classes (5)

| Class | Default |
|---|---|
| `ship_xs` | 20 |
| `ship_s` | 40 |
| `ship_m` | 50 |
| `ship_l` | 60 |
| `ship_xl` | 60 |

### Equipment classes (9)

| Class | Default |
|---|---|
| `engine` | 100 |
| `missile` | 20 |
| `missilelauncher` | 100 |
| `missileturret` | 100 |
| `shieldgenerator` | 100 |
| `turret` | 100 |
| `weapon` | 100 |
| `satellite` | 20 |
| `countermeasure` | 20 |

### Misc / other classes (10 + fallback)

| Class | Default |
|---|---|
| `lockbox` | 20 (via unknown fallback) |
| `mine` | 20 (via unknown fallback) |
| `navbeacon` | 20 (via unknown fallback) |
| `radar` | 20 (via unknown fallback) |
| `resourceprobe` | 20 (via unknown fallback) |
| `ventureplatform` | 20 (via unknown fallback) |
| `Unknown Object Class` | 20 (`$DABPUnkownClassRequirement`) |

**Design intent:** heavier scan requirements (100) on equipment/weapon blueprints because they're high-value and drop-per-scan is meant to be a long grind. Lower requirements (20) on infrastructure / consumables.

## DA Blueprint Analysis Menus

- **[Progress Menus](./progress-menus/)** — read-only progress viewer sub-hub with 4 category pages:
  - **[Station Modules](./progress-menus/station-modules/)** — 10 classes
  - **[Ships](./progress-menus/ships/)** — XS/S/M/L/XL
  - **[Equipment](./progress-menus/equipment/)** — turrets, engines, shields, weapons, missiles, etc.
  - **[Misc](./progress-menus/misc/)** — everything not fitting the above

## Preset scope

The 2 top-level options (Enable / Debug) are in [Configuration Presets](../presets/) scope. The **34 per-class Scan Settings sliders are NOT** — they're a nested table; switching presets keeps your slider values unchanged.

## Interaction with vanilla scanning

DA BP hooks two vanilla scan events:

- `event_scan_finished` (line 11647) — when a player-controlled ship completes a scan on an enemy ship.
- `policeassetscannedship` (line 11696) — when a player-tagged police asset scans an enemy ship.

Both feed the tracker table. Higher scan levels (better scanner Mk, shorter range) award more fragments per scan — so investing in better scanners speeds up blueprint acquisition.

## Filter — what wares are tracked

DA excludes several ware categories from tracking (line 11666):
- `tag.noplayerblueprint` / `tag.noblueprint` — vanilla flag says "not a player blueprint"
- `tag.inventory` — inventory items (not equipment blueprints)
- `tag.tradeonly` — trade wares, not blueprintable
- `tag.crafting` — crafting reagents
- `tag.missiononly` — mission-specific items
- `tag.economy` — economy wares (basic resources)
- `tag.research` — research items
- `tag.workunit` — work units

Also excluded: wares the player already has all variants of (`player.blueprints.{$LocWare}.any.exists` returns true).

## Gameplay effect at recommended defaults

- Early game: pick up S-ship blueprints in ~5-6 scans of the same type. XS drones after ~3-4 scans.
- Mid-game: sustained police-patrol coverage will slowly fill your Ship blueprint bank without dedicated hunting.
- Late game: XL blueprints and equipment (100-count) take dedicated grinding — put a police-tagged Mk3-scanner fleet in a high-traffic sector.

---
title: 'Mlog: Cheat'
description: Developer / testing helper menu — Observer mode spawns invulnerable ghost satellites (600km radar) in every sector of the galaxy for map reconnaissance.
sidebar:
  order: 12
---

Developer / testing helper menu with one toggle: **Observer mode**. Turns on = spawn an invulnerable ghost satellite with 600km radar range at the center of every sector, revealing the whole galaxy for testing/debug purposes. Turns off = destroy every satellite we spawned.

Introduced mlog062. Uses a custom satellite macro (`macro.mlog_da_observer_sat_macro`) that inherits from the vanilla Argon satellite component.

## In-game view

![Mlog Cheat menu — Observer mode toggle + live sat counter](/x4-modding-wiki/img/mods/deadair-scripts/menu-cheat.jpg)

Layout: one toggle row + one live-count status row. That's it.

## Observer mode toggle

| Setting | Default | Effect |
|---|---|---|
| **Observer mode (spawn ghost sat 600km per sector)** | `Disabled` | When ON: `find_sector multiple="true"` walks every sector → creates position at sector center `[0,0,0]` → spawns one `mlog_da_observer_sat_macro` per sector, owner = `faction.player`, invulnerable (`set_object_min_hull exact="100"` = hull cannot drop below 100% of max). When OFF: iterates `$ObserverSats` list, calls `destroy_object` on each, clears the list. `md.$mlog_da_cheat_state.$Enable_Observer` in source. |

**Live status footer:** `Active observer sats: N` where N = `md.$mlog_da_cheat_state.$ObserverSats.count`.

**Observed sample-save state:** 152 active observer sats. That equals the total sector count in the observed save — 152 sectors covered (vanilla base + Terran DLC + Boron DLC + Split DLC + Pirate DLC + mods).

## The satellite macro

Full definition at [`assets/props/equipment/satelite/macros/mlog_da_observer_sat_macro.xml`](https://github.com/mlog4/deadair_scripts):

| Property | Value | Note |
|---|---|---|
| `class` | `satellite` | Standard satellite class — engine recognizes as a normal satellite. |
| `component` | `eq_arg_satellite_01` | Reuses the vanilla Argon satellite visual. Looks identical to a normal player-owned sat. |
| `identification.name` | `Mlog Observer Sensor` | What you see if you click on it in the map. |
| `identification.deployable` | `0` | Player can't manually deploy — only the cheat menu spawns them. |
| `radar.range` | `600000` (= 600 km) | **24×** the vanilla satellite range (25 km). Enough to reveal the entire visible portion of any typical sector from center placement. |
| `hull.max` | `1` | Combined with `set_object_min_hull=100` (percent) applied at spawn = effectively indestructible. Hull can't drop below 100% of 1, i.e. always at 1. |
| `explosioneffect.strength` | `0` | No explosion visual if somehow destroyed (shouldn't happen but belt-and-suspenders). |

## Use cases

- **Development / testing:** spawn observer sats to instantly reveal the whole galaxy for save-integrity debugging. Useful when you want to see faction placements, station densities, Xenon fronts, etc. without manually flying to every sector.
- **Bug reporting:** when reporting a save-specific issue to the mod author, enabling observer mode captures full galaxy state so screenshots show the actual thing rather than the fog-of-war.
- **Save auditing:** verify that faction expansion (Mlog: Extension) is happening where you expect — the map will show every new wharf/shipyard/trade-center placement immediately.
- **Cinematic screenshots:** the ghost sats are player-owned and invisible in normal play (only appear when you click their sector on the map), so they don't interfere with gameplay.

## Undo / cleanup

- **Turn OFF the toggle** — removes all spawned observer sats via `destroy_object`. Clean.
- **If you uninstall the mod** — the sats become "orphaned" (their macro no longer exists in loaded content). Vanilla engine may not handle this gracefully; the `Observer Sats: N` field will be lost since the state table also disappears. Recommend toggling OFF before uninstalling.
- **Post-toggle-OFF notification:** shows `Mlog Cheat: Observer OFF - destroyed N sats` — confirms cleanup succeeded.

## Not in preset scope

The Observer toggle is not a persistent behavior — it's a one-shot action. Presets don't manipulate it. If it's on when you switch presets, it stays on.

## Notes

- **Not a stealth/hidden feature** — the menu is visible and works as advertised.
- **Uses vanilla satellite icon** so the sats show up on the map as normal satellites (`mapob_satellite_01`). If you want to distinguish them from real satellites, click on one and check the name: `Mlog Observer Sensor` vs whatever your real sats are named.
- **The same "custom satellite macro with expanded radar range + invulnerability via min_hull=100" pattern** is used in the author's separate Faction Radar Sharing (mlog_frs) mod — not documented on this wiki yet.
- The `md/mlog_da_cheat_menu.xml` file mentions a **placeholder "Safe mode"** feature that hasn't been specced yet — future addition, not visible in the current menu.

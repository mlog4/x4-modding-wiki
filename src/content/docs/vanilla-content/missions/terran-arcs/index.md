---
title: Terran (Cradle of Humanity) arcs
description: All 6 Terran DLC story arcs — Prelude, HQ Discovery, Core, Covert Operations, Terraforming, Yaki. Per-arc landscape with sectors, factions, key NPCs.
---

The **Cradle of Humanity DLC** (Terran) ships **6 distinct story arcs** spanning ~2.3MB of MD code. The arcs cover the Solar system (Earth, Mars, Venus, Moon, Asteroid Belt), the Pioneer faction, the Yaki pirate faction, the discovery of the Player Headquarters, and the **Terran terraforming research line** — the largest content addition vanilla has received.

## At a glance

| Arc | Script | LoC | Theme |
|---|---|---|---|
| **[Terran Prelude](/vanilla-content/missions/terran-arcs/prelude/)** | `story_terran_prelude.xml` | 807 | Mars Gate scene — first encounter with Terran-restricted core |
| **[HQ Discovery](/vanilla-content/missions/terran-arcs/hq-discovery/)** | `story_hq_discovery.xml` | 1,664 | How player finds + unlocks the Player Headquarters |
| **[Terran Core](/vanilla-content/missions/terran-arcs/core/)** | `story_terran_core.xml` | 744 | Restricted Core enforcement (persistent gameplay system, not a chapter arc) |
| **[Covert Operations](/vanilla-content/missions/terran-arcs/covert-operations/)** | `story_covert_operations.xml` | 521KB | Terran espionage — Antigone Saman, satellite/EMP/bomb covert ops (8 chapters) |
| **[Terraforming research](/vanilla-content/missions/terran-arcs/terraforming/)** | `story_terraforming.xml` | 860KB | Terran-DLC terraforming story (9 chapters Ch0-Ch8 with Torus + Betty Research Ship) |
| **[Yaki arc](/vanilla-content/missions/terran-arcs/yaki/)** | `story_yaki.xml` | 18,732 (1.1MB) | Yaki pirate faction story — LARGEST single arc in vanilla (23 chapters Ch1-Ch23) |

Plus DLC support scripts:

- `setup_dlc_terran.xml` (37KB) — DLC setup + faction initialization
- `x4ep1_war_terran.xml` (132KB) — Terran war subscriptions
- `x4ep1_trade_terran.xml` (79KB) — Terran trade subscriptions
- `yaki_supply.xml` (11KB) — Yaki supply system
- `gs_terran1.xml` (77KB) — "Terran Cadet" game start
- `gs_terran2.xml` (51KB) — "Pioneer" game start

## Solar System sectors

The Terran arcs anchor specific Solar-system sectors:

| Sector macro | Vanilla name | Arc role |
|---|---|---|
| `cluster_100_sector001` | Asteroid Belt | Terran Core — patrol restricted area |
| `cluster_101_sector001` | Mars | Terran Core + Prelude — Mars Gate scene |
| `cluster_102_sector001` | Venus | Terran Core — restricted territory |
| `cluster_104_sector001` | Earth | Terran Core — restricted core |
| `cluster_104_sector002` | Moon / Luna | Terran Core — Luna battleship patrol |
| `cluster_110_sector001` | Neptune | HQ Discovery |
| `cluster_114_sector001` | (HQ Sector) | HQ Discovery — where HQ spawns |
| `cluster_115_sector001` | Brennan's Triumph | HQ Discovery |
| `cluster_01_sector001` | Grand Exchange | HQ Discovery — start hub |

Your mod **must not** change ownership / accessibility of these sectors without considering Terran arc compatibility.

## Persistent characters

| Character | Role | Anchored where |
|---|---|---|
| **Boso Ta** | HQ scientist / Pioneer ally | HQ + Pioneer territory |
| **Pioneer** | NPC commander (HQ Discovery dialogue) | HQ Sector |
| **Terran Cadet** | Tutorial NPC (Terran Cadet game start) | Terran territory |
| **Yaki Captain/Boss** | Yaki arc main NPC | Yaki territory |
| **Various Pioneer NPCs** | Across HQ Discovery sub-cues | Multiple |

## Faction interactions

Terran arcs interact with these factions (your mod's relation changes affect arc availability):

- `faction.terran` (Terran Protectorate)
- `faction.atf` (ATF subfaction — Covert Operations heavy)
- `faction.pioneers` (Pioneer faction — HQ Discovery)
- `faction.yaki` (Yaki pirates — Yaki arc)
- `faction.terraintrigger` (alternate Terran detection check)

## Custom game start hooks

The Terran DLC adds two game starts that **directly hook** into HQ Discovery:

- `x4ep1_gamestart_terran1` — **Terran Cadet** — player starts as a Terran cadet
- `x4ep1_gamestart_terran2` — **Pioneer Variant** — player starts allied with Pioneers

HQ Discovery's `Start` condition checks `player.module == 'x4ep1_gamestart_terran1' or player.module == 'x4ep1_gamestart_terran2' or gamestart.storystate.story_hq_secret_service`. Other game starts can also trigger HQ Discovery via the `story_hq_secret_service` storystate flag.

## Mod conflict risks (Terran-specific)

- ❌ **Mods that disable Pioneer faction** break HQ Discovery
- ❌ **Mods that change `cluster_114_sector001` (HQ Sector) ownership** break HQ Discovery
- ❌ **Mods that make Yaki docile** break Yaki arc
- ❌ **Mods that change Solar-system sector ownership** break Restricted Core patrols
- ⚠ **Mods affecting `faction.atf` relations** can prematurely trigger Covert Operations
- ⚠ **Terraforming-altering mods** must respect HQ-anchored Terran terraforming arc

## Related

- [Mission encyclopedia](/vanilla-content/missions/) — landscape
- [Story arcs catalog](/vanilla-content/story-arcs/) — high-level
- [Game starts catalog](/vanilla-content/game-starts/) — Terran Cadet + Pioneer Variant starts
- [Wiki: DLC handling](/wiki/dlc-handling/) — DLC presence checks

---

*The Terran DLC adds **more story content than any other DLC** — Yaki arc alone is larger than the entire Paranid Civil War. Your mod's DLC-handling discipline matters here more than anywhere.*

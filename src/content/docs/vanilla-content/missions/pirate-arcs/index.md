---
title: Pirate DLC arcs
description: All 5 Pirate DLC story arcs — Prelude, Criminal (1.2MB), The Fan (1MB), Erlking research, Welfare 2 research. Scaleplate / Loanshark / Scavenger faction content.
---

The **Pirate DLC** (Tides of Avarice extension as x4ep1 originally, but Pirate-themed) ships **5 distinct story arcs** + the Pirate subscription system. Total content: **~2.4MB MD code**, larger than entire base game story content.

## At-a-glance

| Arc | Script | Size | Theme |
|---|---|---|---|
| **[Pirate Prelude](/vanilla-content/missions/pirate-arcs/prelude/)** | `story_pirate_prelude.xml` | 34KB | Scavenger faction introduction at gate |
| **[Criminal](/vanilla-content/missions/pirate-arcs/criminal/)** | `story_criminal.xml` | **1.2MB** | Black market + smuggling main arc (Maestro / Ace / Axiom / Chipmunk) |
| **[The Fan](/vanilla-content/missions/pirate-arcs/thefan/)** | `story_thefan.xml` | **1MB** | The Fan story — distress, scrapyard, trading network |
| **[Erlking research](/vanilla-content/missions/pirate-arcs/erlking/)** | `story_research_erlking.xml` | 40KB | HQ research arc — Erlking ship unlock |
| **[Welfare 2 research](/vanilla-content/missions/pirate-arcs/welfare-2/)** | `story_research_welfare_2.xml` | 52KB | HQ research follow-up to base-game welfare |

Plus:
- `setup_dlc_pirate.xml` (162KB) — DLC initialization
- `gs_pirate1.xml` (74KB) — Pirate game start 1
- `gs_pirate2.xml` (114KB) — Pirate game start 2

## Pirate factions

The DLC's faction stack:

| Faction | Role |
|---|---|
| `faction.scaleplate` | Scaleplate Pirates (main pirate faction — used by base war subscriptions) |
| `faction.scavenger` | Scavengers (smuggler-scavenger subfaction) |
| `faction.loanshark` | Loanshark faction (Tides of Avarice — antagonist in The Fan arc) |
| `faction.buccaneers` | Buccaneers (Riptide cross-references) |
| `faction.criminal` | Criminal faction (story_criminal references) |

## Cross-DLC sectors

The Pirate arcs touch base game sectors:

| Sector macro | Vanilla name | Used by |
|---|---|---|
| `cluster_02_sector001` | (Eighteen Billion sector) | Criminal arc |
| `cluster_08_sector001` | (Pirate hub) | Criminal arc |
| `cluster_44_sector001` | Scale Plate Green (fallback) | Criminal arc |

## Persistent characters

Pirate arc-specific NPCs (across all 5 arcs):

| Character | Arc | Role |
|---|---|---|
| **Maestro** | Criminal | Black market mentor |
| **Ace** | Criminal | Heist crew member |
| **Axiom** | Criminal | Hacking specialist |
| **Chipmunk** | Criminal | Induction NPC |
| **The Fan** | The Fan | Title character — distressed Pirate Ace |
| **Boso Ta** | Multi-arc | Cross-arc commentary (Criminal Ch1, Thefan Ch0, Erlking research) |
| **Dal Busta** | Criminal | Cross-arc mission comments |

## Mod conflict risks (Pirate-specific)

- ❌ **Pirate DLC required** — all 5 arcs fail to load without it
- ❌ **Mods that change `faction.scaleplate` / `faction.loanshark` relations** at start affect arc availability
- ❌ **Mods that disable Scavenger faction** break Pirate Prelude
- ❌ **Mods that change `cluster_02_sector001` ownership** break Criminal arc
- ⚠ **Mods adding mass illegal-ware definitions** may interfere with Police_IllegalWareFound detection
- ⚠ **Mods overriding Black Market mechanics** break Criminal Ch2 hub
- ⚠ **Research-tree mods** affect Erlking + Welfare 2 unlock paths

## Related

- [Mission encyclopedia](/vanilla-content/missions/) — landscape
- [Game starts catalog](/vanilla-content/game-starts/) — gs_pirate1 / gs_pirate2
- [Faction subscriptions catalog](/vanilla-content/faction-subscriptions/) — Scaleplate Pirate subscriptions
- [Wiki: DLC handling](/wiki/dlc-handling/) — Pirate DLC required

---

*The Pirate DLC adds the most "antihero" gameplay content — smuggling, heists, black market, scrapyard scavenging. Your mod's interference with illegal-ware mechanics, faction relations, or research progression has cascading effects across all 5 arcs.*

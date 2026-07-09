---
title: Tides of Avarice arcs
description: All 2 Tides of Avarice DLC story arcs — Unbihexium (250KB espionage main) + Cypher research arc. Sobert cover identity, multi-faction intrigue, ship claim chain.
---

The **Tides of Avarice DLC** (`ego_dlc_mini_02`) ships **2 distinct story arcs** focused on espionage gameplay — a **fake-identity cover faction system** with Sobert as the agent, ship acquisition via mysterious "Cypher" research, and multi-faction diplomatic intrigue.

## At-a-glance

| Arc | Script | Size | Theme |
|---|---|---|---|
| **[Unbihexium](/vanilla-content/missions/tides-arcs/unbihexium/)** | `story_unbihexium.xml` | 250KB | Espionage main arc — Sobert agent + Paranid cover faction + ship claim |
| **[Cypher research](/vanilla-content/missions/tides-arcs/cypher/)** | `story_research_cypher.xml` | 6KB | HQ research arc unlocked after Cypher ship claimed |

Plus DLC support scripts:
- `setup_dlc_mini_02.xml` (16KB) — DLC initialization (includes timeline.xml library + Stances)
- `gs_dlc_mini_02.xml` (5KB) — Tides of Avarice game start

## Tides factions

| Faction | Role |
|---|---|
| `faction.alliance` | Alliance (Paranid sub-faction) |
| `faction.paranid` | Godrealm Paranid |
| `faction.holyorder` | Holy Order of Pontifex |
| `faction.trinity` | Trinity (Paranid sub-faction) |
| `faction.ministry` | Teladi Ministry of Finance |
| `faction.outlaw` | Outlaw faction (Tides-introduced) |
| `faction.argon` | Argon |
| `faction.teladi` | Teladi Company |
| `faction.civilian` | Civilians |
| `faction.xenon` | Xenon |
| `faction.ownerless` | Ownerless |

## Sectors touched

Unbihexium spans 7 base game + DLC sectors:

| Sector macro | Role |
|---|---|
| `cluster_13_sector001` | Setup location |
| `cluster_14_sector001` | Setup location (Wayward Scion default sector) |
| `cluster_30_sector001` | Morning Star III |
| `cluster_31_sector001` | Heretic's End |
| `cluster_40_sector001` | Tides-specific sector |
| `cluster_41_sector001` | Tides-specific sector |
| `cluster_46_sector001` | Tides-specific sector |

## Persistent characters

Unbihexium creates 6+ persistent NPCs:

| Character | Role |
|---|---|
| **Courier** (`$CourierActor`) | Story messenger / antagonist |
| **Clone Courier** (`$CloneCourierActor`) | Clone twist mechanic — story-distinguishing duplicate |
| **Relief** (`$ReliefActor`) | Relief NPC |
| **Squadron Leader** (`$SquadronLeaderActor`) | Combat encounter NPC |
| **Betty** (`$BettyActor_v2`) | Misc story NPC |
| **Boso Ta** (anchored) | HQ research support (cross-arc) |
| **Dal Busta** (anchored) | Cross-arc oversight (cross-arc) |
| **Sobert** (`$Sobert_Fake_Identity`) | Player's cover identity — Paranid agent persona |

## The Sobert cover identity mechanic

A unique feature: the player operates under a **fake Paranid identity** ("Sobert") during Tides content. Vanilla code includes:
- `Setup_Sobert_Fake_Identity` — initialize cover identity
- `Update_Paranid_Coverfaction` — manage cover faction relations
- `Unlock_Sobert_Agent` — unlock agent capabilities
- `Recruitment_Sobert` + `Placement_Sobert` — recruit Sobert as your agent
- `Agents_Unlocked` — agent system unlocks

This is the **earliest implementation of the agents/diplomacy system** that later expanded into Kingdom End's diplomacy intro.

## Mod conflict risks (Tides-specific)

- ❌ **Tides of Avarice DLC required** — both arcs fail to load without it
- ❌ **Mods that change Paranid faction relations** at start affect Sobert cover
- ❌ **Mods that disable Outlaw faction** affect Unbihexium combat
- ❌ **Mods that disable Boso Ta + Dal Busta** break cross-arc continuity
- ❌ **Mods that override agent/recruitment mechanics** break Sobert
- ⚠ **Custom faction mods that don't register with cover-faction system** confuse Sobert paths
- ⚠ **Diplomacy mods** may collide with Embassy unlock path

## Related

- [Mission encyclopedia](/vanilla-content/missions/) — landscape
- [Unbihexium arc](/vanilla-content/missions/tides-arcs/unbihexium/) — main story
- [Cypher research](/vanilla-content/missions/tides-arcs/cypher/) — research follow-up
- [Game starts catalog](/vanilla-content/game-starts/) — Tides game start
- [Wiki: DLC handling](/wiki/dlc-handling/) — Tides of Avarice required

---

*Tides of Avarice introduces the espionage/cover-identity gameplay mechanic that later became fully realized in Kingdom End diplomacy. Your mod's interference with cover factions, agents, or research mechanics breaks both arcs simultaneously.*

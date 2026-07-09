---
title: Base game arcs (non-Paranid)
description: 6 base game story arcs beyond the Paranid Civil War — Welfare 1 research, Diplomacy intro, Embassy + Xenon Equipment research stubs, Buccaneers + Ventures ambient arcs.
---

The base game ships **7 story arcs** total. The **largest is the Paranid Civil War** (covered in its own [Paranid Civil War](/vanilla-content/missions/paranid-civil-war/) section). The other 6 are documented here:

## At a glance

| Arc | Script | LoC | Theme |
|---|---|---|---|
| **[Welfare research (Welfare 1)](/vanilla-content/missions/base-game-arcs/welfare-research/)** | `story_research_welfare_1.xml` | 2,112 | HQ research with race time trial — unlocks Welfare module |
| **[Diplomacy Intro](/vanilla-content/missions/base-game-arcs/diplomacy-intro/)** | `story_diplomacy_intro.xml` | 9,693 | HAT/Hatikvah-driven introduction to Embassy + Diplomacy system (11 parts) |
| **[Embassy + Xenon Equipment research](/vanilla-content/missions/base-game-arcs/research-stubs/)** | `story_research_embassy.xml` + `story_research_xen_equipment.xml` | 153 + 152 | Trigger-glue scripts activating Mentor Subscriptions + Quantum Shard system |
| **[Buccaneers + Ventures](/vanilla-content/missions/base-game-arcs/buccaneers-ventures/)** | `story_buccaneers.xml` + `story_ventures.xml` | 540 + 499 | Ambient encounter systems with NPC commentary trio |

Total base game story content (excluding Paranid): ~13,000 lines

## Theme classification

| Arc | Type |
|---|---|
| **Paranid Civil War** | Major plot arc (chapter-based, 2 paths) |
| **Welfare 1 research** | HQ research arc |
| **Diplomacy Intro** | Multi-part introduction (parts 1-11) |
| **Embassy research** | Trigger-glue stub |
| **Xenon Equipment research** | Trigger-glue stub |
| **Buccaneers** | Ambient encounter system |
| **Ventures** | Ambient + lifecycle system |

The base game has **diverse architectural patterns** for arcs — major chapter arc, HQ research, multi-part intro, glue stubs, ambient encounter systems. Modders can use any as a template.

## Cross-arc connections

- **Welfare 1** unlocks → **Pirate Welfare 2** (Gambling Hall) via Mentor Subscriptions
- **Diplomacy Intro** → **Embassy research** (one-shot activation when research unlocks)
- **Buccaneers** flagship → **Story arcs catalog** mentions Helianthus (page 20101 line 120901)

## Mod conflict risks (base game-wide)

Common patterns:
- ❌ **Mods that disable persistent characters** (Reen, Kat, Cline, Betty, Boso Ta, Dal Busta) break multiple arcs
- ❌ **Mods that disable HQ research** break Welfare 1 + Embassy + Xenon Equipment
- ❌ **Mods that affect police-scan mechanics** affect Diplomacy Intro
- ❌ **Mods that disable Buccaneer / Ventures factions** break ambient arcs
- ⚠ **Custom game starts** must hook into `Pt_1_Call_Initial_Delay` for Diplomacy Intro

## Related

- [Mission encyclopedia](/vanilla-content/missions/) — landscape
- [Paranid Civil War](/vanilla-content/missions/paranid-civil-war/) — base game's other arc
- [Story arcs catalog](/vanilla-content/story-arcs/) — high-level overview
- [Game starts catalog](/vanilla-content/game-starts/) — which starts hook which arcs

---

*The base game has a more architecturally diverse set of arcs than any single DLC — chapter, research, multi-part intro, glue stubs, ambient. Each pattern is a useful template for modders adding their own arcs.*

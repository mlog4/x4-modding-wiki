---
title: Mission encyclopedia
description: Per-mission detailed reference. How to find each mission in-game, what player encounters, full chain visibility, mod conflict risks per mission.
---

This is the **per-mission encyclopedia** — every vanilla mission described individually with how-to-find, prerequisites, objectives, reward, chain links, and mod conflict risks.

For high-level arc overviews see [Story arcs catalog](/vanilla-content/story-arcs/). This section is the **detailed** counterpart.

## Coverage status

Base game arcs (fully accessible from vanilla source):

| Arc | Status | Missions |
|---|---|---|
| **[Paranid civil war](/vanilla-content/missions/paranid-civil-war/)** | ✅ Complete | 30+ missions across 2 paths × 3 chapters |
| **[Welfare research (Welfare 1)](/vanilla-content/missions/base-game-arcs/welfare-research/)** | ✅ Complete | HQ research + race time trial |
| **[Diplomacy Intro](/vanilla-content/missions/base-game-arcs/diplomacy-intro/)** | ✅ Complete | 11 parts (Pt1-Pt11), HAT/Reen/Kat/Cline |
| **[Embassy + Xenon Equipment](/vanilla-content/missions/base-game-arcs/research-stubs/)** | ✅ Complete | Trigger-glue stubs |
| **[Buccaneers + Ventures](/vanilla-content/missions/base-game-arcs/buccaneers-ventures/)** | ✅ Complete | Ambient encounter systems |

DLC arcs (all DLCs now unpacked + accessible):

| Arc | Status |
|---|---|
| **[Terran arcs (CoH)](/vanilla-content/missions/terran-arcs/)** — Prelude + HQ Discovery + Core + Covert Ops + Terraforming + Yaki (23 chapters) | ✅ Complete |
| **[Boron arcs (Kingdom End)](/vanilla-content/missions/boron-arcs/)** — Prelude + Main 10ch (Ch0-Ch9 incl. Khaak Assault) + Epilogue | ✅ Started |
| **[Split arc (Split Vendetta)](/vanilla-content/missions/split-arc/)** — Caviar Heist + Funeral Break-In | ✅ Complete |
| **[Pirate arcs](/vanilla-content/missions/pirate-arcs/)** — Prelude + Criminal + Thefan + Erlking + Welfare 2 | ✅ Complete |
| **[Hyperion arc](/vanilla-content/missions/hyperion-arc/)** — Cryptid Huntress sightings chase | ✅ Complete |
| **[Tides of Avarice arcs](/vanilla-content/missions/tides-arcs/)** — Unbihexium + Cypher | ✅ Complete |
| **[Timelines arcs](/vanilla-content/missions/timelines-arcs/)** — Hub + 20+ scenarios + Boss battles + Research + Epilogue | ✅ Complete |

DLC content lives in packed `.cat`/`.dat` files in `extensions/ego_dlc_*/`. Site author unpacked via custom PowerShell extractor (`Extract-X4Cat.ps1`); ground-truth sources now available locally.

## Mission entry format

Every mission entry follows this format:

```
### Mission name (descriptive)

- Cue: technical cue name in vanilla code
- In-game text: page+id reference (so you can verify exact wording)
- Path/Chapter: where in arc
- Find in game: how player encounters
- Prerequisites: what must happen first
- Briefing summary: what NPC tells player
- Objectives: step-by-step what player does
- Where: sector references (with vanilla names)
- NPCs involved: actor list
- Reward: credits / items / relation / unlocks
- Chains to: next mission(s)
- Mod conflict risks: specific things mods can break here
```

The **in-game text** field references vanilla text constants like `{30220, 1010}` — modders can find the exact wording in vanilla `t/0001-L044.xml` (page 30220 for Paranid story, etc.).

## Why per-mission detail matters

When your mod adds content that intersects with a specific mission:

- "My mod makes Argon hostile to Paranid at game start" → which Paranid missions break? See per-mission **mod conflict risks**
- "My mod spawns custom NPC at HQ" → which story missions use HQ as anchor? See per-mission **NPCs involved**
- "My mod claims Cardinal's Redress for player" → which mission's `find_sector` breaks? See per-mission **Where**

High-level arc overviews don't answer these. Per-mission detail does.

## How to verify a mission's exact in-game text

Vanilla text strings live in packed game files. To extract:

1. Unpack vanilla with XRCatTool / X4 Customizer
2. Open `t/0001-L044.xml` (English)
3. Search for `<page id="30220">` (Paranid story page)
4. Find `<t id="X">` matching the reference in this catalog

For DLC missions, similarly extract DLC text from `extensions/ego_dlc_*/t/`.

## Related

- [Vanilla content index](/vanilla-content/) — landscape
- [Story arcs catalog](/vanilla-content/story-arcs/) — high-level overview
- [Game starts catalog](/vanilla-content/game-starts/) — which start hooks which arc
- [Mod-conflict checklist](/vanilla-content/mod-conflict-checklist/) — broader checklist
- [Story missions (technical)](/game/missions/story-mission/) — how to write your own

---

*The encyclopedia grows mission by mission. Each entry verified against vanilla source. If you spot inaccuracy, the cue reference always wins — vanilla code is ground truth.*

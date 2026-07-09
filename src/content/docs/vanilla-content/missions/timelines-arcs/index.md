---
title: Timelines DLC arcs
description: Timelines is X4's anthology DLC — 20+ standalone scenarios orchestrated via a central Scenario Hub. Mining, racing, spacesuit, trading, fleet battles, boss fights, refugee transport, plus the Hub itself.
---

The **Timelines DLC** (`ego_dlc_timelines`) is structurally unique — instead of one big story arc, it's an **anthology of 20+ standalone scenarios** orchestrated via a **Scenario Hub**. Players visit the Hub and choose individual scenarios covering different X4 themes — mining, racing, spacesuit EVA, trading, fleet battles, boss battles, refugee transport, and historical "what if" set-pieces.

Total content: **22+ scenario scripts** + Hub orchestrator + Epilogue + Research arc.

## Pages

- **[Scenario Hub](/vanilla-content/missions/timelines-arcs/scenario-hub/)** — Central orchestrator + game start (`x4ep1_gamestart_hub`)
- **[Scenarios catalog](/vanilla-content/missions/timelines-arcs/scenarios-catalog/)** — All 20+ playable scenarios organized by theme (mining / race / spacesuit / trading / fleet battle / recruitment)
- **[Boss + epic scenarios](/vanilla-content/missions/timelines-arcs/boss-scenarios/)** — Khaak Boss Battle / M0 Boss / Presidents End / Tharkas Cascade / Dragonfyre / Refugee transport
- **[Research + Epilogue](/vanilla-content/missions/timelines-arcs/research-epilogue/)** — Abandoned Ships research (5 ships) + Timelines Epilogue

## What "Timelines" means in vanilla

The DLC's premise: the player accesses historical / alternate-history "timeline" scenarios via a Hub. Each scenario is self-contained — different theme, different rules, different rewards. There's no single overarching "Timelines main story" — the **Hub IS the framework**.

This anthology structure makes Timelines **uniquely sensitive to mod conflicts** — your mod must coexist with 22+ different mission designs.

## Vanilla scripts

### Hub orchestrator
- `scenario_hub.xml` (**1,251,276 bytes** ~1.25MB) — the central hub script
- `setup_dlc_timelines.xml` (56KB) — DLC initialization

### Scenarios by theme

**Mining** (8 scripts):
- `scenario_mining_1.xml`, `_2.xml`, `_3.xml`, `_4.xml`, `_5.xml`, `_7.xml`
- `scenario_mining_lib.xml` — shared mining library

**Racing** (4 scripts):
- `scenario_race_1.xml`, `_2.xml`, `_3.xml`
- `scenario_race_lib.xml` — shared racing library

**Spacesuit EVA** (5 scripts):
- `scenario_spacesuit_1.xml`, `_2.xml`, `_3.xml`, `_4.xml`
- `scenario_spacesuit_lib.xml` — shared spacesuit library

**Trading** (3 scripts):
- `scenario_trading_1.xml`, `_2.xml`, `_3.xml`

**Fleet battles** (4 scripts):
- `scenario_fleet_battle_1.xml`, `_2.xml`, `_3.xml`
- `scenario_fleet_battle_lib.xml` — shared fleet battle library

**Combat objectives**:
- `scenario_assassinate.xml`
- `scenario_disable_capship.xml`
- `scenario_seek_and_destroy.xml`
- `scenario_weaken_fleet.xml`
- `scenario_weaken_station.xml`
- `scenario_protect_object.xml`
- `scenario_escort.xml`
- `scenario_waveattack_1.xml` + `scenario_waveattack_antigone.xml`

**Recruitment**:
- `scenario_recruitment_1.xml`

**Boss battles**:
- `scenario_khaak_boss_battle.xml` (258KB)
- `scenario_m0_boss_battle.xml` (161KB)

**Epic set-pieces**:
- `scenario_presidents_end.xml` (192KB) — "President's End" historical scenario
- `scenario_tharkas_cascade.xml` (203KB) + `scenario_tharkas_lib.xml` — Tharka's Cascade
- `scenario_dragonfyre.xml` (210KB) — "Dragonfyre" scenario

**Refugee transport** (3 scripts):
- `scenario_transport_refugees.xml` (**694KB** — largest individual scenario)
- `scenario_transport_refugees_engineer.xml` (152KB)
- `scenario_transport_refugees_escort.xml` (67KB)

### Standalone arcs
- `story_research_abandoned_ships.xml` (43KB) — HQ research unlocking 5 abandoned ships
- `story_timelines_epilogue.xml` (246KB) — post-Timelines epilogue

## Hub-based gameplay

Timelines plays differently from other DLCs:

1. Player begins at the **Scenario Hub** (custom game start `x4ep1_gamestart_hub`)
2. Hub presents available scenarios via consoles
3. Player picks a scenario → temporarily exits Hub into the scenario context
4. Scenario plays out with its own rules
5. Reward earned (`Reward_Notifications` cue)
6. Player returns to Hub
7. Next scenario unlocks

This **Hub-and-spoke architecture** is X4's only example of such structure. For modders adding scenarios: must register with Hub's `Scenario_Console_Interacted` system.

## Faction stack

Timelines scenarios involve any vanilla faction depending on scenario theme — Argon, Teladi, Paranid, Split, Boron, Terran, Yaki, Xenon, Khaak, civilian, ownerless, ministry, scaleplate, etc.

## Cross-arc connections

- **Race scenarios** end with a "Race Ship Handover" (`RaceShip_Handover` in Epilogue) — race winners receive specific ships
- **Refugee transport** scenarios connect to Tides of Avarice content thematically
- **Research arc** unlocks abandoned ships via the Hub research

## Mod conflict risks (Timelines-specific)

- ❌ **Timelines DLC required** — all 25+ scripts fail to load without it
- ❌ **Mods that change game start mechanics** affect `x4ep1_gamestart_hub`
- ❌ **Mods that override Hub-style cue infrastructure** break Scenario Hub
- ❌ **Mods that disable Khaak / Xenon / boss factions** trivialize boss scenarios
- ❌ **Mods that affect race / spacesuit / mining mechanics** break theme scenarios
- ⚠ **Mods adding mass NPC content at the Hub location** can collide with Hub actors
- ⚠ **Faction-rebalance mods** affect scenario difficulty for combat scenarios

## Related

- [Mission encyclopedia](/vanilla-content/missions/) — landscape
- [Scenario Hub](/vanilla-content/missions/timelines-arcs/scenario-hub/) — orchestrator detail
- [Game starts catalog](/vanilla-content/game-starts/) — Hub start
- [Wiki: DLC handling](/wiki/dlc-handling/) — Timelines required

---

*Timelines is X4's anthology DLC — designed to showcase X4's varied gameplay (combat / mining / racing / spacesuit / trading) within a curated framework. Your mod's interference with the Hub orchestrator silently breaks ALL scenarios.*

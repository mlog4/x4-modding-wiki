---
title: Timelines scenarios catalog
description: 20+ standalone Timelines scenarios organized by theme — mining, racing, spacesuit EVA, trading, fleet battle, combat objectives, recruitment. Each scenario is self-contained with own rules.
---

This page catalogs all **20+ Timelines scenarios** organized by theme. Each scenario is **self-contained** — own game module, own briefing, own reward. The Scenario Hub presents them for selection.

For the Hub orchestrator see [Scenario Hub](/vanilla-content/missions/timelines-arcs/scenario-hub/). For boss battles + epic set-pieces see [Boss + epic scenarios](/vanilla-content/missions/timelines-arcs/boss-scenarios/).

## Common scenario structure

All Timelines scenarios share a structural pattern:

```xml
<mdscript name="Scenario_X">
  <documentation>
    <author name="..."/>  <!-- Vanilla scenarios have AUTHOR ATTRIBUTION -->
  </documentation>
  <cues>
    <cue name="Start" module="scenario_X">
      <conditions>
        <event_game_started/>  <!-- or scenario-specific trigger -->
      </conditions>
      <actions>
        <include_actions ref="md.LIB_Scenario.ScenarioStarted"/>
        <set_value name="$Page" exact="<text page>"/>
        <set_value name="$Difficulty" exact="level.<easy/medium/hard>"/>
        <set_value name="$MissionFaction" exact="faction.<X>"/>
        <find_sector name="$MissionSector" macro="<scenario_macro>"/>
        ...
      </actions>
      <cues>
        <cue name="Setup_Scenario"/>
        <cue name="IntroCutscene"/>
        <cue name="Start_Scenario"/>
        ...
      </cues>
    </cue>
  </cues>
</mdscript>
```

Common references:
- `md.LIB_Scenario.ScenarioStarted` — Timelines scenarios library
- `$Page` — scenario-specific text page
- `$Difficulty` — `level.veryeasy` / `level.easy` / `level.medium` / `level.hard` / `level.veryhard`
- `$MissionFaction` — faction sponsoring the scenario
- `$MissionSector` — dedicated Timelines-DLC sector (custom map)

## Mining scenarios (6)

Mining-themed scenarios with custom maps.

| Scenario | Author | Theme |
|---|---|---|
| `scenario_mining_1.xml` | Lennart Funk | "Miner working for an L mining ship — Xenon scout destroyed drones, deliver ice quickly to fill the L miner" |
| `scenario_mining_2.xml` | — | (mining variant 2) |
| `scenario_mining_3.xml` | — | (mining variant 3) |
| `scenario_mining_4.xml` | — | (mining variant 4) |
| `scenario_mining_5.xml` | — | (mining variant 5) |
| `scenario_mining_7.xml` | — | (mining variant 7 — note: 6 is missing) |

`scenario_mining_lib.xml` — shared mining helper library.

### Mining 1 detail (verified from source)

- **Author**: Lennart Funk (`<author name="Lennart Funk"/>`)
- **Module**: `scenario_mining_1`
- **Text page**: 30613
- **Difficulty**: `level.veryeasy`
- **Faction**: `faction.civilian`
- **Sector macro**: `timelines_map_mining_1_cluster_001_sector_001_macro`
- **Scenario premise** (from code comment):
  > *"You're a miner working for an L mining ship. A Xenon scout destroyed the mining drones, so you have to deliver the rest of the ice as quickly as possible to fill up the L miner."*

**Player encounters**:
- Mining setup with broken drones
- Xenon scout destruction event already-occurred
- Time-pressure delivery objective (ice)

### Mod conflict risks — Mining

- ❌ **Mods that change `faction.civilian` mining behavior** affect scenario flavor
- ❌ **Mods that change ice ware definition** break mining objective
- ❌ **Mods that change L miner mechanics** affect delivery target
- ⚠ **Xenon-rebalance mods** can change scout aggression

---

## Race scenarios (3)

Racing-themed scenarios with checkpoint courses.

| Scenario | Theme |
|---|---|
| `scenario_race_1.xml` | First race scenario |
| `scenario_race_2.xml` | Second race scenario |
| `scenario_race_3.xml` | Third race scenario |

`scenario_race_lib.xml` — shared racing library (checkpoint mechanics, timer, announcer cues).

### Race 1 cue structure (verified)

- **Namespace**: `Timelines_Scenario_Race_1`
- **Cues**:
  - `Setup_Scenario` → `Call_Setup_Libraries` → `Debug`
  - `Start_Scenario`:
    - `Intro_Cutscene` (cinematic)
    - `Calls` block:
      - `AbortCallbackCue` — handle abort
      - `Enqueue_Intro_Shot` (instanced) — queue intro camera shot
      - `Call_Announcer_Intro` — announcer voice

The **Announcer system** is a hallmark of race scenarios.

### Mod conflict risks — Race

- ❌ **Mods that change race ship mechanics** affect scenarios
- ❌ **Mods that override cutscene system** affect intro cutscenes
- ⚠ **HUD mods** can collide with race UI

---

## Spacesuit EVA scenarios (4)

Spacesuit-EVA-themed scenarios.

| Scenario | Theme |
|---|---|
| `scenario_spacesuit_1.xml` | First spacesuit scenario |
| `scenario_spacesuit_2.xml` | Second spacesuit scenario |
| `scenario_spacesuit_3.xml` | Third spacesuit scenario |
| `scenario_spacesuit_4.xml` | Fourth spacesuit scenario |

`scenario_spacesuit_lib.xml` — shared spacesuit library.

### Spacesuit 1 cue structure (verified)

- **Module**: `scenario_spacesuit_1`
- **Cues**:
  - `Start` namespace
  - `StopUseCase` — stop ongoing usecase (clean state)
  - `Setup_Scenario` → `Call_Setup_Libraries`
  - `IntroCutscene` → `StopCutscene` → `CutsceneStopped` (cutscene lifecycle)
  - `Start_Scenario`:
    - `SetupMission`
    - `ShortcutUseCase` (1ms polling) — fast-path usecase handling

### Mod conflict risks — Spacesuit

- ❌ **Mods that disable spacesuit EVA** break all 4 scenarios
- ❌ **Mods that change spacesuit weapon mechanics** affect scenarios
- ⚠ **Mods adding bulk spacesuit content** can collide

---

## Trading scenarios (3)

Trading-themed scenarios with economic challenges.

| Scenario | Theme |
|---|---|
| `scenario_trading_1.xml` | First trading scenario |
| `scenario_trading_2.xml` | Second trading scenario |
| `scenario_trading_3.xml` | Third trading scenario |

### Mod conflict risks — Trading

- ❌ **Economy mods** affect ware pricing for scenarios
- ❌ **Mods that change trade station mechanics** break scenarios

---

## Fleet battle scenarios (3 + lib)

Large-scale fleet combat scenarios.

| Scenario | Theme |
|---|---|
| `scenario_fleet_battle_1.xml` | First fleet battle |
| `scenario_fleet_battle_2.xml` | Second fleet battle |
| `scenario_fleet_battle_3.xml` | Third fleet battle |

`scenario_fleet_battle_lib.xml` — shared fleet battle library.

### Mod conflict risks — Fleet Battle

- ❌ **Mods that rebalance capital-ship combat** trivialize / break scenarios
- ❌ **Mods that change carrier behavior** affect battle outcomes

---

## Combat objective scenarios (8)

Various single-objective combat scenarios.

| Scenario | Theme |
|---|---|
| `scenario_assassinate.xml` | Assassinate a target |
| `scenario_disable_capship.xml` | Disable (not destroy) a capital ship |
| `scenario_seek_and_destroy.xml` | Seek and destroy a target |
| `scenario_weaken_fleet.xml` | Weaken an enemy fleet |
| `scenario_weaken_station.xml` | Weaken an enemy station |
| `scenario_protect_object.xml` | Protect an object |
| `scenario_escort.xml` | Escort a ship |
| `scenario_waveattack_1.xml` | Survive wave attacks |
| `scenario_waveattack_antigone.xml` | Survive Antigone-faction-specific wave attacks |

### Mod conflict risks — Combat

- ❌ **Combat-rebalance mods** affect difficulty
- ❌ **Faction-relation mods** affect target / ally identification
- ❌ **Mods that disable wave-attack mechanics** break wave scenarios

---

## Recruitment scenario (1)

| Scenario | Theme |
|---|---|
| `scenario_recruitment_1.xml` | Recruit crew |

### Mod conflict risks — Recruitment

- ❌ **Mods that change crew recruitment mechanics** affect scenario
- ❌ **Mods that change NPC skill systems** affect recruitment outcomes

---

## Common code references

| Pattern | Found in |
|---|---|
| Scenario library include | `md.LIB_Scenario.ScenarioStarted` |
| Author attribution | `<documentation><author/></documentation>` |
| Scenario module | `module="scenario_X"` |
| Custom map sectors | `timelines_map_<theme>_<N>_cluster_<X>_sector_<Y>_macro` pattern |
| Difficulty | `level.veryeasy` / `level.easy` / `level.medium` / `level.hard` / `level.veryhard` |

## Related

- [Timelines arcs overview](/vanilla-content/missions/timelines-arcs/)
- [Scenario Hub](/vanilla-content/missions/timelines-arcs/scenario-hub/) — orchestrator
- [Boss + epic scenarios](/vanilla-content/missions/timelines-arcs/boss-scenarios/) — major set-pieces
- [Research + Epilogue](/vanilla-content/missions/timelines-arcs/research-epilogue/) — abandoned ships + ending
- [Wiki: DLC handling](/wiki/dlc-handling/) — Timelines required

---

*Timelines is the rare DLC where the scripts are author-attributed (vanilla scripts have `<author>` elements). Treat each scenario as its own miniature mod. Your mod's interference with mining/race/spacesuit/trading/combat mechanics propagates to multiple scenarios at once.*

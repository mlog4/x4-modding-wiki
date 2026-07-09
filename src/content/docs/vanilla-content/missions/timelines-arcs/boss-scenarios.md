---
title: Timelines boss + epic scenarios
description: Major Timelines scenarios — Khaak Boss Battle, M0 Boss, Presidents End, Tharkas Cascade, Dragonfyre, Refugee Transport. The largest individual scenarios with bespoke mechanics.
---

This page catalogs the **boss battles and epic set-piece scenarios** — the largest individual Timelines scenarios with bespoke mechanics. These are the **memorable showpiece** scenarios that span 150KB+ each.

## At a glance

| Scenario | Size | Module | Theme |
|---|---|---|---|
| **[Khaak Boss Battle](#khaak-boss-battle)** | 258KB | `scenario_khaak_boss_battle` | Fight a Khaak Destroyer boss |
| **[M0 Boss Battle](#m0-boss-battle)** | 161KB | `scenario_m0_boss_battle` | M0 (mystery) boss |
| **[Presidents End](#presidents-end)** | 192KB | `scenario_presidents_end_1` | Stealth/assassination of a President |
| **[Tharkas Cascade](#tharkas-cascade)** | 203KB | `scenario_tharkas_cascade` | Tharka-themed cascade |
| **[Dragonfyre](#dragonfyre)** | 210KB | `scenario_dragonfyre` | "Dragonfyre" mission with Warp/Regroup chapters |
| **[Transport Refugees](#transport-refugees)** | **694KB** | `scenario_transport_refugees` | Refugee transport — largest individual scenario |
| Transport Refugees Engineer | 152KB | `scenario_transport_refugees_engineer` | Engineer-themed refugee variant |
| Transport Refugees Escort | 67KB | `scenario_transport_refugees_escort` | Escort-themed refugee variant |

---

## Khaak Boss Battle

**Script**: `scenario_khaak_boss_battle.xml` (258KB)  
**Module**: `scenario_khaak_boss_battle`

### Mechanics

A boss fight against a **Khaak Destroyer**. The destroyer has dedicated firing-pattern systems:

| Cue | Mechanic |
|---|---|
| `Khaak_Destroyer_Fire_Loop` (0.1s polling) | Continuous firing loop |
| `Khaak_Destroyer_Fire_Pattern` (instanced) | Scripted firing patterns |
| `Khaak_Destroyer_Cease_Fire` (instanced) | Conditional cease-fire |
| `Background_Cues` block | Background mechanics |
| `Ch1_Track_Cause_Of_Death_Ref` (refs `LIB_Scenario.Track_Cause_Of_Death`) | Track what killed what |

### Cut content

In the source there are commented-out cues — Shield Generator mechanics, Player Ship Damaged tracking, Player Dealt Hull Damage tracking. These were **planned-but-cut** features. They suggest the boss battle was designed to track player damage taken / dealt, but vanilla shipped without those sub-mechanics.

### Mod conflict risks — Khaak Boss

- ❌ **Mods that rebalance Khaak Destroyer** affect difficulty
- ❌ **Mods that change `LIB_Scenario.Track_Cause_Of_Death`** break tracking
- ⚠ **Anti-Khaak mods** trivialize the boss

---

## M0 Boss Battle

**Script**: `scenario_m0_boss_battle.xml` (161KB)  
**Module**: `scenario_m0_boss_battle`

A boss fight against the **M0** (an unknown / hidden / unique enemy). The "M0" designation suggests a Mark-0 or original/master enemy.

### Mod conflict risks — M0 Boss

- Standard combat-rebalance mod risks apply

---

## Presidents End

**Script**: `scenario_presidents_end.xml` (192KB)  
**Module**: `scenario_presidents_end_1`

### Theme

A stealth/assassination scenario — player infiltrates a presidential location. Features distinctive visual effects per room (`VfxStartingRoom`, `VfxBridge`, `VfxCorridor1`, `VfxCorridor2`, `VfxBrig`) and a **run-blur** mechanic when the player is running.

### Mechanics

| Cue | Mechanic |
|---|---|
| `Start_Fade_In` | Cinematic fade-in |
| `VisualFx` block | Per-room visual effects |
| `Run_Blur` | Visual blur when running |
| `Player_Is_Running` (50ms polling) | Detect running state |

The **per-room VFX system** is unique to this scenario — different visual effects in different interior rooms.

### Mod conflict risks — Presidents End

- ❌ **Mods that change spacesuit movement / running** affect Run_Blur trigger
- ❌ **VFX-overhaul mods** can collide with room-specific VFX
- ⚠ **Mods that change interior room mechanics** affect the stealth flow

---

## Tharkas Cascade

**Script**: `scenario_tharkas_cascade.xml` (203KB) + `scenario_tharkas_lib.xml` (helper library)  
**Theme**: Tharka's Ravine themed cascade scenario

A Split-themed scenario named after Tharka's Cascade (the Split waterfall metaphor / family ancestor theme).

### Mod conflict risks — Tharkas Cascade

- ❌ **Mods that change Split faction behavior** affect scenario flavor
- ❌ **Mods that change Tharka's Ravine sectors** affect scenario context

---

## Dragonfyre

**Script**: `scenario_dragonfyre.xml` (210KB)  
**Module**: `scenario_dragonfyre`

### Theme

A 2-chapter scenario:

| Chapter | DEBUG cue | Theme |
|---|---|---|
| **Chapter 1** | `DEBUG_Chapter_1_Warp_Dragonfyre_Proximity` | Warp to Dragonfyre proximity |
| **Chapter 2** | `DEBUG_Chapter_2_Regroup_Fleet_Destroy_Enemies` | Regroup fleet + destroy enemies |
| **Outro** | `DEBUG_StartOutro` | Begin scenario outro |

### Mechanics

| Cue | Mechanic |
|---|---|
| `Score_Enemy_Destroyed` (instanced) | Score tracking — enemies destroyed |
| `Setup_Libraries` → `Call_Setup_Libraries` | Standard scenario setup |
| `SetupMission` | Mission setup |

The **Score system** suggests Dragonfyre has a competitive / leaderboard component — players compete on enemies-destroyed count.

### Mod conflict risks — Dragonfyre

- ❌ **Combat-rebalance mods** affect score balance
- ❌ **Fleet-management mod** affects regroup mechanic

---

## Transport Refugees

**Script**: `scenario_transport_refugees.xml` (**694KB** — LARGEST individual Timelines scenario)  
**Module**: `scenario_transport_refugees`

The Transport Refugees scenario is **larger than most full DLC stories** (694KB). Its companion scenarios `_engineer` (152KB) and `_escort` (67KB) add variant flavors.

### Mechanics

Vanilla code shows extensive DEBUG infrastructure:

| Cue | Purpose |
|---|---|
| `Debug_GetBestScores` (namespace) | Get player's best scores (debug introspection) |
| `Debug_GetPlayerRoomAndPosition` (namespace) | Player room + position (debug) |
| `Debug_TestVideoCommWhileDocked` | Test video comm while docked |
| `Debug_TestVideoCommWhileDocked_Docked` (+ `_Interval` 5s instanced) | Periodic checks while docked |
| `Debug_PlayRaidersCutscene` (+ `_Timeout` 5s checktime) | Debug: play raiders cutscene |
| `Debug_PlayStationDestructionCutscene` (+ `_Timeout` 5s) | Debug: play station destruction cutscene |
| `Debug_PlayNPCsEmbarkedCutscene` (+ `_Timeout` 5s) | Debug: play NPCs-embarked cutscene |

### Scenario events implied

The DEBUG cues reveal the scenario has these set-piece events:
- **Raiders attack cutscene** (`Debug_PlayRaidersCutscene`)
- **Station destruction cutscene** (`Debug_PlayStationDestructionCutscene`)
- **NPCs embarked cutscene** (`Debug_PlayNPCsEmbarkedCutscene`)

Plus **score tracking** (player has "best scores" to retrieve).

The scenario is **deeply cinematic** — players transport refugees through a hostile environment, with set-piece cutscenes triggered by milestones.

### Refugee Engineer + Escort variants

- `scenario_transport_refugees_engineer.xml` — engineer-themed variant (player as engineer)
- `scenario_transport_refugees_escort.xml` — escort-themed variant (player as escort)

These provide replay variety on the same refugee theme.

### Mod conflict risks — Refugees

- ❌ **Mods that change video comm mechanics while docked** break debug test (and possibly live mechanic)
- ❌ **Mods that disable cutscene system** break key cutscenes
- ❌ **Mods that change refugee NPC categories** affect spawning
- ⚠ **Score-tracking mods** can collide with leaderboard system

---

## Common patterns across boss + epic scenarios

| Pattern | Usage |
|---|---|
| `Setup_Libraries` → `Call_Setup_Libraries` | Standard initialization |
| `Background_Cues` block | Backgound mechanics running in parallel |
| `LIB_Scenario.Track_Cause_Of_Death` | Track what killed what (cause-of-death attribution) |
| Per-room VFX | Distinct visual effects in different interior rooms (Presidents End) |
| Score tracking | Leaderboard scores (Dragonfyre, Refugees) |
| Fire patterns | Scripted enemy firing patterns (Khaak Boss) |
| DEBUG chapter skips | `DEBUG_Chapter_N_*` cues for vanilla testing |

## Code references

| Concern | Cue |
|---|---|
| Khaak Destroyer firing | `Khaak_Destroyer_Fire_Loop` (0.1s) + `_Fire_Pattern` |
| Cause-of-death tracking | `LIB_Scenario.Track_Cause_Of_Death` |
| Presidents End VFX | `VisualFx` block + `Run_Blur` |
| Presidents End running detection | `Player_Is_Running` (50ms polling) |
| Dragonfyre score | `Score_Enemy_Destroyed` (instanced) |
| Refugee debug infrastructure | `Debug_GetBestScores`, etc. (in scenario_transport_refugees.xml) |
| Refugee cutscenes | `Debug_PlayRaidersCutscene`, etc. |

## Related

- [Timelines arcs overview](/vanilla-content/missions/timelines-arcs/)
- [Scenario Hub](/vanilla-content/missions/timelines-arcs/scenario-hub/) — orchestrator
- [Scenarios catalog](/vanilla-content/missions/timelines-arcs/scenarios-catalog/) — other 20+ scenarios
- [Research + Epilogue](/vanilla-content/missions/timelines-arcs/research-epilogue/) — research arc + ending
- [Wiki: DLC handling](/wiki/dlc-handling/) — Timelines required

---

*The boss + epic Timelines scenarios are the DLC's showpieces — single scenarios bigger than entire base game arcs. Khaak Boss firing patterns, Refugee cutscene set-pieces, Presidents End per-room VFX — your mod's interference with any of these breaks a memorable Timelines moment.*

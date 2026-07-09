---
title: Welfare research (Welfare 1)
description: Base game HQ research arc — meet Drek, run race time trial, unlock Welfare modules. Predecessor to Pirate DLC's Welfare 2 / Gambling Hall arc.
---

The **Welfare 1 research arc** (`story_research_welfare_1.xml`, 2112 lines) is the **base game HQ research line** for unlocking the original Welfare module. The arc spans a research announcement, meeting NPC **Drek**, completing a race time trial, and concluding with module unlock.

- **Script**: `story_research_welfare_1.xml`
- **DLC**: Base game (no DLC required)
- **MDScript version**: 4

## Sectors anchored

| Variable | Macro | Vanilla name |
|---|---|---|
| `$Anomaly_1_Sec` | `cluster_04_sector001` | Nopileos' Fortune (anomaly 1 location) |
| `$Anomaly_2_Sec` | `cluster_08_sector001` | Silent Witness (anomaly 2 location) |
| `$CutsceneSector` | `cluster_50_sector001` | (cutscene-specific sector) |

The arc references HQ-adjacent sectors dynamically (`find_sector_in_range mindistance="1" maxdistance="3"` from HQ for placement).

## Persistent character

| Character | Role |
|---|---|
| **Drek** | Race-organizer NPC, drives the time trial mission |

## Setup phase

| Cue | Purpose |
|---|---|
| `Find_Mission_Stations` (10s polling) | Periodically check for valid mission stations |
| `Research_Announcement` (10s polling) | Announce research availability |
| `Research_Announcement_Dialog` (refs LIB_Dialog.Speak_Actor) | Spoken research announcement |
| `Research_Entry_Selected` (instanced) | Player selects research at HQ |
| `ResearchStarted_SpeakEnd` (instanced) | Speak-end after research starts |

## Mission entry: "Research Announcement + Selection"

- **Cue chain**: `Check_Research_Unlocked` → `Research_Announcement` → `Research_Entry_Selected`
- **In-game name**: Welfare research available at HQ
- **Find in game**: HQ research menu, after triggers fire
- **Prerequisites**: HQ available + research-system active
- **What player encounters**:
  - 10-second polling for research announcement availability
  - Announcement dialog plays via LIB_Dialog.Speak_Actor
  - Player selects research → research begins
  - Speak-end event after start
- **Reward**: Research entry started; mission unlocks
- **Chains to**: `Start_Mission`

---

## Mission entry: "Start Mission + Supervisor"

- **Cue**: `Start_Mission` (instanced) → `Supervisor_Conv_Handler` (instanced)
- **In-game name**: First mission with supervisor
- **What player encounters**:
  - Mission starts
  - Player meets / talks to a Supervisor NPC
- **Chains to**: Drek introduction

---

## Mission entry: "Meet Drek + Race Ship Acquisition"

- **Cue chain**: `Drek_Conv_1_Start` (instanced) → `Drek_Conv_1_Next` → `Get_Race_Ship`
- **In-game name**: Meet Drek; acquire a race ship
- **Find in game**: Talk to Drek
- **What player encounters**:
  - Conversation with Drek begins (triggered by `event_conversation_started actor="$Drek"`)
  - Drek explains the welfare arc + time trial requirement
  - Player must acquire a race ship
- **NPCs involved**: Drek
- **Chains to**: `Get_Race_Ship_Conv_Start` → `Get_Race_Ship_RML` → time trial

### Mission entry: "Get Race Ship"

- **Cue chain**: `Get_Race_Ship_Conv_Start` → `Get_Race_Ship_RML` (mission library) → `Get_Race_Ship_Additional_Checks` → `Get_Race_Ship_End_Dialogue` → `Check_Race_Ship_Status`
- **In-game name**: Acquire a race ship
- **What player encounters**:
  - Race ship acquisition mission (library-managed via RML)
  - Additional checks ensure ship is valid race ship
  - End-dialogue triggers on completion
  - Status check polls for current state
- **Reward**: Race ship in fleet
- **Chains to**: Time Trial mission

---

## Mission entry: "Time Trial"

- **Cue chain**: `Time_Trial_Intro_Dialogue` (refs LIB_Dialog.Speak_Actor with `$Drek` actor) → `Time_Trial_RML` → `Time_Trial_RML_Signal`
- **In-game name**: Race time trial
- **Path/Chapter**: Welfare 1 (climax)
- **Find in game**: After race ship acquired
- **What player encounters**:
  - Drek narrates intro dialogue (via cutscene)
  - Time trial mission begins (RML-managed)
  - Player races through a course against the clock
  - Signal fires when trial completes (success or failure)
- **Where**: Race course (likely involving Anomaly sectors)
- **NPCs involved**: Drek (commentator)
- **Reward**: Time trial completion advances arc
- **Chains to**: Welfare module unlocked

---

## Player-station integration

The arc dynamically interacts with player-owned stations:

- `$SelectedPlayerStation` is referenced for nearby-sector finding
- `$ForceCasino` flag adjusts distance bounds (10 sectors if casino, 3 otherwise)

This suggests the arc has a **casino sub-mechanic** linked to player station infrastructure.

## Save migration

The arc uses standard `Check_Research_Unlocked onfail="cancel"` pattern — researches can be pre-unlocked via custom game start.

## Path completion summary

A completed Welfare 1 arc yields:

- **Welfare module unlocked** — habitation feature for player stations
- Drek as recognized contact
- Time trial completion record
- Prerequisite for Pirate-DLC [Welfare 2](/vanilla-content/missions/pirate-arcs/welfare-2/) (Gambling Hall) research

## Mod conflict risks (Welfare 1-specific)

- ❌ **Mods that disable Drek NPC** break arc
- ❌ **Mods that change race ship mechanics** break Get_Race_Ship_RML
- ❌ **Mods that change Anomaly sectors (cluster_04, cluster_08)** affect arc context
- ❌ **Mods that disable HQ research** break entire arc
- ⚠ **Race-rebalance mods** affect time trial difficulty
- ⚠ **Mods affecting player station mechanics** affect `$SelectedPlayerStation` logic

## Code references

| Concern | Cue |
|---|---|
| Research unlock check | `Check_Research_Unlocked` |
| Announcement polling | `Research_Announcement` (10s) |
| Mission stations polling | `Find_Mission_Stations` (10s) |
| Drek intro | `Drek_Conv_1_Start` (instanced) |
| Race ship acquisition | `Get_Race_Ship_RML` |
| Time trial | `Time_Trial_RML` + `Time_Trial_RML_Signal` |
| Drek intro cutscene | `Time_Trial_Intro_Dialogue` (refs LIB_Dialog.Speak_Actor) |
| Supervisor handler | `Supervisor_Conv_Handler` (instanced) |
| Casino flag | `$ForceCasino` |

## Related

- [Mission encyclopedia](/vanilla-content/missions/) — landscape
- [Pirate Welfare 2](/vanilla-content/missions/pirate-arcs/welfare-2/) — follow-up arc (Gambling Hall)
- [Story arcs catalog](/vanilla-content/story-arcs/) — high-level catalog

---

*The Welfare 1 arc is the base-game predecessor to the Pirate-DLC Welfare 2 chain. Together they unlock the full Welfare module → Gambling Hall progression. Your mod's interference with HQ research, race mechanics, or Drek NPC breaks the cumulative welfare progression.*

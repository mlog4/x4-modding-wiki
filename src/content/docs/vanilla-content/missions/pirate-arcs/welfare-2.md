---
title: Welfare 2 research arc
description: Pirate-DLC sequel to base game's Welfare research. Investigate habitation modules, plant scan devices, follow-up Boso Ta research. Unlocks Den Construction.
---

The **Welfare 2 research arc** (`story_research_welfare_2.xml`, 52KB) is the **Pirate-DLC sequel to base game's Welfare research arc** (`story_research_welfare_1.xml` in base). The arc focuses on investigating habitation modules and constructing a **Gambling Hall** (`welfare_gen_gamblinghall_01_macro` — referred to in code as "Den"/"$GamblingDenMacro").

- **Script**: `story_research_welfare_2.xml`
- **DLC**: Pirate
- **Theme**: HQ research → habitation investigation → Den construction
- **Factions touched**: faction.argon, faction.civilian, faction.player

## Prerequisites

The arc requires:
- Pirate DLC installed
- Base game Welfare research (Welfare 1) **completed**
- HQ available with research capabilities
- Boso Ta available at HQ

## Persistent character

| Character | Role |
|---|---|
| **Boso Ta** | HQ research scientist + conversation partner |

---

## Mission entry: "Research Unlocked"

### Cue: `Check_Research_Unlocked` → `First_Research_Done`

- **In-game name**: Welfare 2 research available at HQ
- **Path/Chapter**: Welfare 2 research (entry)
- **Find in game**: HQ research menu, after Welfare 1 completed
- **Prerequisites**: Welfare 1 done + Pirate DLC installed
- **What player encounters**:
  - Research entry available in HQ menu
  - Boso Ta has new conversation options
- **Reward**: Research entry available
- **Chains to**: `Boso_Conversation_Started`
- **Code reference**: `story_research_welfare_2.xml` `Check_Research_Unlocked`

---

## Mission entry: "Boso Ta Briefing"

### Cue: `Boso_Conversation_Started` → `Boso_Conversation_Started_Next` → `Boso_Conversation_Finished`

- **In-game name**: Conversation with Boso Ta about Welfare 2
- **Path/Chapter**: Welfare 2 (briefing)
- **Find in game**: Talk to Boso Ta at HQ
- **What player encounters**:
  - Boso Ta explains Welfare 2 research goals
  - Multi-section conversation
  - **Player station warning**: `Boso_Player_Station_Warning` (+ `_Ref`) — Boso warns about specific station-related implications
- **Where**: Player HQ
- **NPCs involved**: Boso Ta
- **Reward**: Briefing complete; investigation mission unlocks
- **Chains to**: `Investigate_Habitation_Inst` (Investigation phase)
- **Code reference**: `story_research_welfare_2.xml` `Boso_Conversation_*`

---

## Mission entry: "Investigate Habitation Installation"

### Cue: `Investigate_Habitation_Inst`

- **In-game name**: Investigate habitation module + plant scan device
- **Path/Chapter**: Welfare 2 (Investigation — main mission)
- **Find in game**: Active after Boso briefing
- **Prerequisites**: Boso briefing complete
- **What player encounters**:
  - **Manage stations sub-cue**: `Investigate_Habitation_Inst_Manage_Stations` — find a target habitation station
  - **Approach module**: `Investigate_Habitation_Inst_Near_Module` — detect player near module
  - **Plant scan device** — multi-step sub-mission:
    - `Investigate_Habitation_Inst_Plant_Device_Initialise` — initialize device-planting
    - `Investigate_Habitation_Inst_Plant_Device` — main planting action
    - `Investigate_Habitation_Inst_Plant_Device_In_Room` — verify player in correct room
    - `Investigate_Habitation_Inst_Plant_Device_Left_Room` — track when player leaves
    - `Investigate_Habitation_Inst_Plant_Device_Cleanup` — cleanup planted device
    - `Investigate_Habitation_Inst_Plant_Device_Cleanup_Helper` — cleanup helper
    - `Investigate_Habitation_Inst_Plant_Device_Cooldown` — cooldown timer
    - `Investigate_Habitation_Inst_Plant_Device_Reset` — reset for retry
    - `Investigate_Habitation_Inst_Plant_Device_Tick` — periodic tick
  - **Scan leak detection**:
    - `Investigate_Habitation_Inst_Scan_Leak` — scan signal leak
    - `Investigate_Habitation_Inst_Scan_Leak_Create` — create signal leak
    - `Investigate_Habitation_Inst_Scan_Leak_Reset` — reset after scan
- **Objectives**:
  - Find target habitation station
  - Travel + EVA inside (spacesuit) to specific room
  - Plant scan device
  - Wait through cooldown
  - Scan resulting signal leak
- **Where**: Target habitation station (varies by player territory)
- **NPCs involved**: Boso Ta (remote oversight)
- **Reward**: Investigation data acquired
- **Chains to**: `Construct_Den`
- **Code reference**: `story_research_welfare_2.xml` `Investigate_Habitation_Inst*` block

#### Mod conflict risks — Investigation

- ❌ **Mods that disable spacesuit EVA** break room-planting
- ❌ **Mods that change habitation module mechanics** affect target identification
- ❌ **Mods that override scan-leak mechanics** affect leak detection
- ⚠ **Mods adding signal-leak content** may collide with leak-create
- ⚠ **Player-station mods** affect Boso's station warning

---

## Mission entry: "Construct the Gambling Hall (Den)"

### Cue: `Construct_Den` → `Construct_Den_Finished`

- **In-game name**: Build a Gambling Hall on a player station
- **Path/Chapter**: Welfare 2 (Construction — climax)
- **Find in game**: After investigation complete
- **Prerequisites**: Investigation complete + sufficient resources
- **What player encounters**:
  - Player constructs a **Gambling Hall** habitation module
  - Module macro: `welfare_gen_gamblinghall_01_macro` (stored as `$GamblingDenMacro` in code)
  - Mission type: `missiontype.plot`, faction `civilian`, difficulty `level.medium`, `abortable="false"`
  - Mission name text: `{20104, 110201}`, description: `{10201, 30222152}`
  - Briefing icon: `briefing_boso_ta_01`
  - Objective: `objective.build_module` matching `$GamblingDenMacro`
  - Build process tracks via `Construct_Den_Finished` listener (matches `event.param2.{$i}.macro.ismacro.{$GamblingDenMacro}`)
- **Where**: Player station (any with construction capability)
- **NPCs involved**: Boso Ta (remote oversight, briefing actor)
- **Reward**: Gambling Hall construction complete; Welfare 2 research finalized
- **Chains to**: End of arc (Research Userdata added)
- **Code reference**: `story_research_welfare_2.xml` `Construct_Den`

#### Mod conflict risks — Construction

- ❌ **Mods that disable `welfare_gen_gamblinghall_01_macro`** break the climax
- ❌ **Mods that change habitation module recipes** affect construction
- ⚠ **Construction-rebalance mods** affect cost
- ⚠ Mission is `abortable="false"` — mods that force-abort missions may collide

---

## Save migration

`AddToResearchUserdata` — handles research userdata addition for save migration. Your mod modifying research state must respect this cue.

## Path completion summary

A completed Welfare 2 arc yields:

- **Den construction unlocked** — Pirate habitation module available
- Welfare 2 research entry marked done
- HQ research progress advanced
- Boso Ta acknowledges arc completion

## Code references

| Concern | Cue |
|---|---|
| Research unlock | `Check_Research_Unlocked` + `First_Research_Done` |
| Boso conversations | `Boso_Conversation_*` block |
| Player station warning | `Boso_Player_Station_Warning*` |
| Habitation investigation | `Investigate_Habitation_Inst*` block |
| Plant device sub-mission | `Investigate_Habitation_Inst_Plant_Device_*` |
| Scan leak detection | `Investigate_Habitation_Inst_Scan_Leak*` |
| Den construction | `Construct_Den*` |
| Research userdata patch | `AddToResearchUserdata` |

## Related

- [Pirate arcs overview](/vanilla-content/missions/pirate-arcs/)
- [Erlking research](/vanilla-content/missions/pirate-arcs/erlking/) — parallel research arc
- [Story arcs catalog](/vanilla-content/story-arcs/) — Welfare 1 base-game research

---

*The Welfare 2 arc completes the welfare research chain begun in base game. Unlocks Pirate Den construction — a specialized habitation feature. Your mod's interference with EVA, scan leaks, or habitation construction breaks the Den unlock.*

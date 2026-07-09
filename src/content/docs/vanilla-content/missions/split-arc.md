---
title: Split Vendetta arc
description: The 1.2MB Split Vendetta DLC story. Loyalists/Free Split/Fallen Families faction politics, caviar acquisition, funeral break-in, Halls of Judgement. 4+ chapters, 875 cues.
---

The **Split Vendetta** story is a **1.2MB** narrative arc (`story_split.xml`) covering the **Fallen Families** civil split, **Free Split vs Loyalists**, with elaborate set-piece missions including a Split funeral break-in heist. The arc anchors **875 cues** — second-largest individual story script after Boron.

- **Script**: `story_split.xml` (1,171,891 bytes)
- **DLC**: Split Vendetta
- **MDScript version**: 13 (heavily patched)
- **Factions involved**: faction.split, faction.freesplit, faction.fallensplit (Fallen Families), faction.fallenfamilies, faction.court, faction.argon, faction.antigone, faction.buccaneers, faction.civilian, faction.xenon, faction.ownerless

## Trigger sectors

| Sector macro | Vanilla name | Role |
|---|---|---|
| `cluster_409_sector001` | Halls of Judgement (HOJ) | Court / judgment hub |
| `cluster_410_sector001` | Tharka's Ravine II | Story content |
| `cluster_411_sector001` | (various Split sectors) | Story content |
| `cluster_412_sector001` | (various Split sectors) | Story content |
| `cluster_413_sector001` | (various Split sectors) | Story content |
| `cluster_425_sector001` | Bone Yard | Major plot hub |

## Persistent infrastructure

The arc setup creates several persistent objects:

- **Police Rattlesnake** (`Police_Rattlesnake`) — police ship that patrols early sectors; has destruction + uncovered detection cues
- **Boneyard Carrier** (`BoneYardCarrier_Setup`) — carrier with subordinate ships at Bone Yard
- **Halls of Judgement Guardian** (`HallsOfJudgement_Setup` v2, with `HallsOfJudgement_Guardian` sub-cue)
- **Skipper conversation system** (`Debug_Skipper_*`) — for testing, mirrors actual gameplay

## Patch infrastructure

Two patch systems exist:

- `PATCH_AddStoryMentors` — adds story mentors to existing saves
- `Accelerator_BoneYard_Patch` (v2) with `Warp_Back` / `Warp_Back_Ships_Patch` — fixes accelerator warp issue for in-progress saves

This signals the arc is heavily save-migration-aware. Your mod's save migration must respect these patches.

## Chapter 0 — Prerequisites

Player must build relations before arc starts. Heavy reputation gating.

### Missions

| Cue | Player action |
|---|---|
| `Ch0_Check_Prerequisites` | Auto-checks rep + state |
| `Ch0_Dal_Split_Dialog` | Dal Busta dialog explaining arc |
| `Ch0_Offer_Rumors` | Dal offers initial rumor mission |
| `Ch0_Offer_Rumors_Done` | Rumor mission complete |
| `Ch0_Prereq_Mission_Completed` | Prerequisite mission done |
| `Ch0_Prereq_Mission_Completed_Failsafe` | Save migration safety |
| `Ch0_Speak_Dal_*` | Various Dal dialog lines |
| `Ch0_Meet_Dal_Start_Ch` | Meet Dal to start Chapter 1 |
| `Ch0_Logbook` | Logbook entry added |

**Where**: Player anywhere; Dal Busta in player territory

**NPCs**: Dal Busta

**Chains to**: Chapter 1 — Arrival in Split space

---

## Chapter 1 — Arrival + Investigation

Player arrives in Split space, encounters Loyalists, transports passengers, evades police.

### Mission entries

| Cue | What it covers |
|---|---|
| `Ch1_Arrival` | Initial arrival event |
| `Ch1_Dal_Split_HQ` | Meet Dal at the HQ (Split context) |
| `Ch1_Dal_Split_Intro` / `Ch1_Dal_Split_Intro_Dialog` | Chapter intro |
| `Ch1_Suspicious_Split` | Suspicious Split activity investigation |
| `Ch1_Story_Reminder_Talk` | Reminder if player wanders |
| `Ch1_Suspicious_Split_Intel` | Intel gathering |
| `Ch1_Suspicious_Set_Stations` | Mark target stations |
| `Ch1_Suspicious_Init` | Initialize investigation phase |
| `Ch1_Passenger_Transport_Loyalist` (+ Ref) | Transport Loyalist passenger |
| `Ch1_Passenger_Transport_Check_Object` | Check transport conditions |
| `Ch1_Passenger_Transport_Contingency` | Fallback for failures |
| `Ch1_Passenger_Transport_Rescue_Actor` | Rescue passenger if ship lost |
| `Ch1_Passenger_Transport_Station_Destroyed_Init` / `_Station_Destroyed` | Recovery if station destroyed |
| `Ch1_Passenger_Died` / `Ch1_PassengerShip_Lost` | Failure paths |
| `Ch1_Passenger_Ship_Lost_Failsafe_Patch` | Save migration patch for lost-ship state |
| `Ch1_Police_Control` block | Multi-cue police-control encounter system |
| `Ch1_Police_Cutscene` | Cinematic for police engagement |
| `Ch1_Loyalist_Dialog_Topics` | Loyalist dialog options |
| `Ch1_Loyalist_Hint_*` | Hints to player |
| `Ch1_Logbook` | Logbook entry |

**Where**: Halls of Judgement → Tharka's Ravine II → other Split sectors

**NPCs involved**:
- Dal Busta
- Loyalist NPCs (multiple)
- Police officers (encounter)
- Passenger NPC

**Reward**: Loyalist intel gathered; passenger delivered; Chapter 2 unlocked

#### Police Control mechanic detail

The police-control encounter has **7+ dedicated cues**:
- `Ch1_Police_Control_Init` — initialization
- `Ch1_Police_Control_Check_Sector` (+v variants) — verify player sector
- `Ch1_Police_Control_Event` — main encounter
- `Ch1_Police_Control_Cutscene` — cinematic
- `Ch1_Police_Control_ReachedTargetSector_Ref` (+v) — destination check
- `Ch1_Police_Control_Retarget` (+ `_Objective`, `_Reached`, `_Ref`, `_Speak`) — re-target on player deviation
- `Ch1_Police_Control_Done` — completion

This is the most elaborate police-encounter in vanilla.

#### Mod conflict risks — Chapter 1

- ❌ **Mods that disable police behavior** break the police control encounter
- ❌ **Mods that affect Loyalist NPC spawning** prevent Chapter 1 progression
- ❌ **Mods that change passenger-transport mechanics** affect rescue paths
- ⚠ **Sector ownership changes in Split space** affect intel gathering
- ⚠ **Mods adding mass NPC spawning** may collide with police control NPCs

---

## Chapter 2 — Caviar Acquisition + Investigation

The famous "Caviar Heist" arc. Player must acquire Split caviar (eggs) and navigate slave-trader content. Includes the funeral preparation.

### Mission entries (selected)

| Cue | Player action |
|---|---|
| `Ch2_Accepted_Investigation` | Player accepted Chapter 2 |
| `Ch2_Brief_Funds_Mission` | Briefing on funding needed |
| `Ch2_Acquire_Caviar_Eggs_Init` | Caviar eggs acquisition starts |
| `Ch2_Aquire_Caviar` (+ `_Ref`) | Caviar acquisition mission |
| `Ch2_Acquire_Caviar_Enough_Eggs_Listener` | Listen for eggs target |
| `Ch2_Acquire_Caviar_Done_Listener` | Detection caviar ready |
| `Ch2_Acquire_Caviar_Eggs_Hint` | Hints during acquisition |
| `Ch2_Acquire_Caviar_Done` (+ `_Init`) | Acquisition completed |
| `Ch2_Caviar_Guidance` | Map guidance to caviar |
| `Ch2_Deliver_Caviar_Continue_Conversation` | Delivery conversation |
| `Ch2_Deliver_Caviar_Conversation_Done` | Conversation done |
| `Ch2_Deliver_Caviar_Ref` | Delivery library ref |
| `Ch2_Dock_At_SlaveTrader` | Dock at slave trader |
| `Ch2_EnforceSurrender_Ref` | Enforce surrender on target |
| `Ch2_Engage_GetawayShip` (+ `_Flee`, `_Objective_Attack`, `_Warning`) | Engage getaway ship |
| `Ch2_Engage_EscapedActor_Warning_Ref` | Warning about escaped actor |
| `Ch2_Find_GetawayShip` (+ `_Failed`) | Find the getaway ship |
| `Ch2_Choose_LeakStation` | Player picks signal-leak station |
| `Ch2_Create_Leak` (+ `_Resetter`) | Create signal leak |
| `Ch2_Coffin_In_Sector` / `Ch2_Coffin_Reached_Sector_Ref` | Coffin tracking |
| `Ch2_Force_Funeral` | Force funeral phase |
| `Ch2_Funeral` (+ `_Ceremony`, `_Conversations`, `_Fireworks_Init`, `_Speech`, `_Speech_Done`) | Funeral ceremony mission |

#### The Caviar Heist sub-arc

The player must:
1. Acquire caviar (eggs) — a Split delicacy + plot device
2. Optional: navigate slave-trader interaction (`Ch2_Dock_At_SlaveTrader`)
3. Deal with getaway ship attempt
4. Setup signal leak for arc continuation
5. Conduct funeral ceremony with the coffin

#### The Funeral Ceremony

- Conduct ceremony at coffin location
- Fireworks
- Speech delivery
- All choreographed via dedicated cues

### Where

Multiple Split sectors. Caviar acquisition in Free Split territory; funeral in Fallen Families court.

### NPCs involved

- Slave trader (optional engagement)
- Caviar acquisition targets
- Getaway ship pilot
- Funeral attendees (multiple)
- Dal Busta (oversight)

### Reward

Caviar acquired; funeral conducted; Chapter 3 unlocked

#### Mod conflict risks — Chapter 2

- ❌ **Mods that affect signal-leak mechanics** break Ch2_Create_Leak
- ❌ **Slaver-rebalance mods** affect slave trader encounter
- ⚠ **Mods that change Split court rituals** may collide with funeral
- ⚠ **Combat mods that change getaway ship behavior** affect engagement

---

## Chapter 3 — Funeral Break-In

The signature **Funeral Heist** — break-in to retrieve coffin contents. Includes EMP, docking-denial, and elaborate funeral cutscene mechanics.

### Mission entries (selected)

| Cue | Player action |
|---|---|
| `Ch3_Approach_Funeral` (+ `_Ref`) | Approach funeral ceremony |
| `Ch3_Boneyard` | Bone Yard sub-arc |
| `Ch3_Boso_Speak_Scan` / `Ch3_Boso_Warning_Done` | Boso Ta scan dialogue |
| `Ch3_Breakin_Briefing_Completed` / `_Done` | Break-in briefing |
| `Ch3_BreakIn_Docking` / `_Docking_Denied` / `_Done` | Docking attempt + denial path |
| `Ch3_BreakIn_EMP` (+ `_Obj`) | EMP weapon usage |
| `Ch3_Coffin_Breakin` | Coffin break-in main cue |
| `Ch3_Coffin_Breakin_UndockCoffin_Safety` | Safety check |
| `Ch3_Coffin_In_Sector` / `Ch3_Coffin_Reached_Sector_Ref` | Coffin location tracking |
| `Ch3_Conspiracy` | Conspiracy reveal |
| `Ch3_Conv_Dal` / `Ch3_Conv_Loyalist` | Conversations |
| `Ch3_Conversation_Dal_Warn` / `_Loyalist_Warn` | Warning dialogs |
| `Ch3_Dal_Funeral_Conversation` (+ `_Done`) | Dal at funeral |
| `Ch3_Dal_Surprised` | Dal's reaction |
| `Ch3_Funeral_BreakIn_Done` | Break-in success |
| `Ch3_Funeral_Cutscene` (+ `_Stop_Cutscene`) | Cinematic |
| `Ch3_Funeral_Dal_Waiting` / `Ch3_Funeral_DalToBridge` | Dal position management |
| `Ch3_Funeral_Distraction` | Distraction mechanic |
| `Ch3_Funeral_Fireworks_Init` | Fireworks |
| `Ch3_Funeral_Speech_Done` | Speech end |
| `Ch3_Funeral_Steps_Coffin_Fireworks` / `_Coffin_Undocked` | Choreography |
| `Ch3_Funeral_Undock_Safety` | Safety check on undock |
| `Ch3_FuneralSteps_GateClosed` / `_Undocked` | Gate handling |
| `Ch3_Cancel_Loyalist_Meetstation_Placement` | Cancel placement |
| `Ch3_Balaur_Refresh_Position` | Balaur (ship) reposition |
| `Ch3_Create_Leak` | Create signal leak at coffin |

### What player does

- Approach funeral ceremony (`Ch3_Approach_Funeral`)
- Receive briefing for break-in (`Ch3_Breakin_Briefing_*`)
- Use EMP to bypass docking denial (`Ch3_BreakIn_EMP`)
- Break into coffin (`Ch3_Coffin_Breakin`)
- Cause distraction (`Ch3_Funeral_Distraction`)
- Bone Yard side-content (`Ch3_Boneyard`)
- Discover conspiracy (`Ch3_Conspiracy`)

### Where

Funeral ceremony location + Bone Yard + Halls of Judgement

### NPCs

- Dal Busta (multi-position throughout funeral)
- Loyalist NPCs
- Boso Ta (scan support)
- Balaur ship + crew

### Reward

Coffin contents retrieved; conspiracy uncovered

### Mod conflict risks — Chapter 3

- ❌ **Mods that disable EMP weapons** break the docking-denial bypass
- ❌ **Mods that affect docking mechanics** break docking-denied path
- ❌ **Mods that change Halls of Judgement layout** affect break-in
- ⚠ **Funeral-cutscene mods** can collide

---

## Higher chapters

The arc continues with additional chapters (Ch4+) covering aftermath of the funeral break-in, faction-relationship shifts, and Halls of Judgement resolution. Specific Ch4+ cues exist (e.g. `Ch4_AbandonedShip` and others) — extending the encyclopedia further is feasible reading the same script.

## Game starts hooked

| Game start script | Theme |
|---|---|
| `gs_split1.xml` | Split-themed game start 1 |
| `gs_split2.xml` | Split-themed game start 2 |

## Arc completion summary

A completed Split arc yields:

- Caviar Heist resolved
- Funeral break-in conducted; coffin contents retrieved
- Conspiracy uncovered; Fallen Families relations shifted
- Major Split faction relation impacts (positive or negative depending on choices)
- Story state set; arc unavailable to retrigger

## Code references

| Concern | Key cue |
|---|---|
| Setup + accelerator patch | `Accelerator_BoneYard_Patch` (v2) |
| Police Rattlesnake | `Police_Rattlesnake` block |
| Boneyard Carrier | `BoneYardCarrier_Setup` |
| Halls of Judgement | `HallsOfJudgement_Setup` (v2) |
| Skipper conversation testing | `Debug_Skipper_*` cues |
| Story patch (mentors) | `PATCH_AddStoryMentors` |

## Related

- [Mission encyclopedia](/vanilla-content/) — landscape
- [Game starts catalog](/vanilla-content/game-starts/) — Split-themed starts
- [Faction subscriptions catalog](/vanilla-content/faction-subscriptions/) — Split war subs
- [Wiki: DLC handling](/wiki/dlc-handling/) — Split Vendetta required

---

*The Split arc is X4's heist-narrative showcase — the Funeral Break-In is one of the most elaborate scripted set-pieces in any X4 DLC. Your mod's interference with EMP weapons, docking-denial mechanics, or Split-faction relations breaks the most cinematic moment in the DLC.*

---
title: HQ Discovery (Terran)
description: How player discovers and unlocks the Player Headquarters. 3-chapter arc involving Pioneer + Boso Ta. Triggered from Terran-Cadet / Pioneer game starts OR via storystate flag.
---

The **HQ Discovery** arc is how the player first encounters and claims the **Player Headquarters** in the Terran DLC story line. It's a 3-chapter narrative covering finding the HQ, repairing satellites, and EVA-exploring the abandoned facility.

- **Script**: `story_hq_discovery.xml` (1,664 lines)
- **Text page**: 30223
- **DLC**: Cradle of Humanity
- **MDScript name**: `Story_HQ_Discovery`

## Trigger conditions

The arc activates if **any** of:

- Player started from `x4ep1_gamestart_terran1` (Terran Cadet game start)
- Player started from `x4ep1_gamestart_terran2` (Pioneer Variant game start)
- `gamestart.storystate.story_hq_secret_service` is set (custom game start hook)

Additional: `player.galaxy.macro.ismacro.{macro.xu_ep2_universe_macro}` — only in main galaxy.

## Setup

The arc anchors these sectors:

| Variable | Sector macro | Vanilla name |
|---|---|---|
| `$Neptune` | `cluster_110_sector001` | Neptune |
| `$BrennansTriumph` | `cluster_115_sector001` | Brennan's Triumph |
| `$HQSector` | `cluster_114_sector001` | (HQ Sector) |
| `$GrandExchange` | `cluster_01_sector001` | Grand Exchange |

### HQ creation

The HQ itself uses macro `station_pla_headquarters_base_01_macro` with constructionplan `x4ep1_playerheadquarters_pioneer_configuration`. Two creation paths:

1. **Custom game start skip** (`$HasCustomGamestartSkip`): The script creates the HQ directly:
   - At `cluster_114_sector001`, position `x=-207000, y=-1100, z=-31000`
   - Owner: `faction.pioneers`
   - Encyclopedia: true
2. **Standard path**: `find_station` retrieves the HQ that's already spawned by `god.xml`

### Pioneer variant

`$PioneerVariant = not $HasCustomGamestartSkip and player.module == 'x4ep1_gamestart_terran2'` — affects dialogue (Pioneer-allied player gets different intro).

---

## Chapter 1 — Find the Scientist

The player must travel to a specific NPC scientist and deliver an item.

### Mission entry: "Pioneer Intro Dialogue"

- **Cue**: `Ch1_Intro_Dialogue_Pioneer`
- **In-game name**: Initial Pioneer briefing
- **Path/Chapter**: HQ Discovery Chapter 1
- **Find in game**: After Ch1_Force triggers (game start hooks complete + briefing started)
- **Prerequisites**: Arc activated, briefing complete
- **What player encounters**:
  - Pioneer NPC speaks intro lines
  - Dialogue reference: `Ch1_Intro_Dialogue_Pioneer_Ref` → `md.LIB_Dialog.Speak_Actor`
  - Variant for Terran Cadet players: `Ch1_Terran_Cadet_Handler` — additional handler for cadet-specific dialogue
- **Where**: Player starting location (Terran or Pioneer territory)
- **NPCs involved**: Pioneer commander
- **Reward**: Chapter 1 mission unlocked
- **Chains to**: `Ch1_Intro_Fly_To_Scientist`
- **Code reference**: `story_hq_discovery.xml` `Ch1_Intro_Dialogue_Pioneer`

#### Mod conflict risks

- ❌ **Pioneer faction-disable mods** break this dialogue
- ❌ **Mods that intercept `LIB_Dialog.Speak_Actor`** affect the intro line delivery
- ⚠ **Terran Cadet start mods** that don't trigger `$PioneerVariant` correctly skip the cadet handler

---

### Mission entry: "Fly to Scientist"

- **Cue**: `Ch1_Intro_Fly_To_Scientist`
- **In-game name**: Travel to Scientist (location-based objective)
- **Path/Chapter**: HQ Discovery Chapter 1
- **Find in game**: Active after Pioneer intro complete
- **Prerequisites**: Pioneer Intro done
- **What player encounters**:
  - Player must fly to the scientist's location
  - Two sub-cues handle en-route logic:
    - `Ch1_Intro_Cadet_En_Route` — cadet commentary during travel (`Ch1_Intro_Cadet_En_Route_Comment` polls every 10s for triggered comments)
    - `Ch1_Intro_At_Scientist` — checks every 1s if player has reached scientist
- **Objectives**:
  - Travel to scientist's station
  - Trigger arrival event
- **Where**: Scientist location (specific Pioneer station in HQ region)
- **NPCs involved**: Cadet (companion comments), Scientist (destination)
- **Reward**: Arrival triggers Deliver Item mission
- **Chains to**: `Ch1_Intro_At_Scientist_Dialogue_Ref` → `Ch1_Deliver_Item`
- **Code reference**: `story_hq_discovery.xml` `Ch1_Intro_Fly_To_Scientist`

#### Mod conflict risks

- ❌ **Mods that change Pioneer territory layout** affect scientist location reachability
- ⚠ **Cadet companion mods** may collide with the en-route comment system
- ⚠ **Sector ownership mods on Pioneer space** break navigation expectations

---

### Mission entry: "Deliver Item to Scientist"

- **Cue**: `Ch1_Deliver_Item`
- **In-game name**: Deliver Item (RML_Deliver_Inventory)
- **Path/Chapter**: HQ Discovery Chapter 1 (main)
- **Find in game**: Active after arrival at scientist
- **Prerequisites**: Reached scientist
- **What player encounters**:
  - Mission delivers specific inventory item to scientist
  - Reference library: `md.RML_Deliver_Inventory.Deliver_Inventory`
  - Briefing description via `Ch1_Deliver_Item_Map_Text`
  - Periodic hints via `Ch1_Deliver_Item_Hint` (5s interval)
    - `Ch1_Deliver_Item_Hint_Ref` → speech hint
    - `Ch1_Deliver_Item_Hint_Box` → visual hint box
    - `Ch1_Deliver_Item_Cadet_Comment` → cadet adds commentary
  - Dock hint via `Ch1_Deliver_Item_Dock_Hint`
  - Periodic "near station" check (`Ch1_Deliver_Item__Near_Station`) at 1s interval
  - **Police scan suppression**: `Ch1_Suppress_Police_Scans` checked at 1s — player NOT scanned during this delivery (story content)
- **Objectives**:
  - Acquire the item (may be in inventory already, or pickup elsewhere)
  - Travel to delivery station
  - Dock at delivery station
  - Hand over the item
- **Where**: Scientist's station
- **NPCs involved**: Scientist (recipient), Cadet (commentary)
- **Reward**: Mission complete; Chapter 1 ends; police scan suppression released
- **Chains to**: `Ch1_Deliver_Item_End` → `Ch1_Deliver_Item_Fadeout` → `Ch1_Reset_Police_Scan_Suppression` → Chapter 2
- **Code reference**: `story_hq_discovery.xml` `Ch1_Deliver_Item` (with multiple sub-cues)

#### Mod conflict risks

- ❌ **Mods that affect `RML_Deliver_Inventory`** affect delivery verification
- ❌ **Police scan mods** that override `Ch1_Suppress_Police_Scans` cause player to get unwanted scans
- ⚠ **Mods that change cargo / inventory mechanics** affect item handover
- ⚠ **Custom mission mods using same delivery station** collide

---

## Chapter 2 — Satellites

Repair satellite network around the HQ region.

### Mission entry: "Satellite Network Repair"

- **Cue**: `Ch2_Satellites`
- **In-game name**: Repair satellite network
- **Path/Chapter**: HQ Discovery Chapter 2 (main)
- **Find in game**: Active after Chapter 1 complete
- **Prerequisites**: Ch1_Deliver_Item complete
- **What player encounters**:
  - Conversation scene: `Ch2_ConvScene_1_Start` → `Ch2_ConvScene_1_End`
  - Player must repair satellites: `Ch2_Sat_Repair`
  - Reference library: `md.RML_RepairObject.RepairObject` (for each satellite)
  - Periodic commentary: 
    - `Ch2_Sat_Repair_Comment_1` (1s interval) — first comment
    - `Ch2_Sat_Repair_Comment_1b` — followup comment
  - Periodic hints (`Ch2_Sat_Repair_Hint` 1s)
  - Per-satellite repair completion: `Ch2_Sat_Repair_Object_Repaired`
- **Objectives**:
  - Reach each damaged satellite
  - Repair it (likely EVA spacesuit work)
  - Move to next
- **Where**: HQ region satellite positions
- **NPCs involved**: Scientist (oversight via comm), Cadet (commentary)
- **Reward**: Satellites repaired; data feed restored
- **Chains to**: `Ch2_Sat_Repair_End` → `Ch2_End_Conv_Started` → `Ch2_End` → Chapter 3
- **Code reference**: `story_hq_discovery.xml` `Ch2_Satellites` (v3)

#### Mod conflict risks

- ❌ **Mods that change satellite mechanics** affect repair sequence
- ❌ **Mods that disable spacesuit EVA functionality** break Chapter 2
- ⚠ **Repair-overhaul mods** affect `RML_RepairObject`
- ⚠ **Combat mods that make satellites hostile** introduce unintended danger

---

## Chapter 3 — HQ EVA exploration

Player physically explores the abandoned HQ via spacesuit, scanning signal leaks.

### Mission entry: "HQ EVA Exploration"

- **Cue**: `Ch3_HQ_EVA`
- **In-game name**: Explore abandoned HQ (EVA)
- **Path/Chapter**: HQ Discovery Chapter 3 (main)
- **Find in game**: Active after Chapter 2 complete
- **Prerequisites**: Ch2_Satellites complete
- **What player encounters**:
  - Conversation scene: `Ch3_HQ_EVA_ConvScene_1_Started` → `Ch3_HQ_EVA_ConvScene_1_End`
  - Player exits ship in spacesuit
  - Objective: explore HQ exterior
    - Sub-cue `Ch3_HQ_EVA_Objective`
  - Signal leaks scattered on HQ exterior
    - `Ch3_HQ_EVA_Leak_Scanned` (instanced — fires per leak) — track scanned leaks
    - `Ch3_HQ_EVA_Last_Leak_Destroyed` — last leak destroyed event
- **Objectives**:
  - Exit ship in spacesuit
  - Scan all signal leaks on HQ exterior
  - Survive any hazards
- **Where**: HQ exterior (`cluster_114_sector001`)
- **NPCs involved**: Scientist (oversight)
- **Reward**: HQ data unlocked; player gains HQ access
- **Chains to**: `Ch3_HQ_Warping` (v2) — HQ warps to player faction territory or similar transition
- **Code reference**: `story_hq_discovery.xml` `Ch3_HQ_EVA` (v2)

#### Mod conflict risks

- ❌ **Mods that disable spacesuit EVA** break Chapter 3
- ❌ **Signal-leak modifying mods** affect scan mechanics
- ❌ **Mods that change HQ macro** break the entire chapter
- ⚠ **Combat mods that spawn hostiles at HQ** add unintended danger during EVA

---

### Mission entry: "HQ Warp Sequence"

- **Cue**: `Ch3_HQ_Warping`
- **In-game name**: HQ warps to player territory
- **Path/Chapter**: HQ Discovery Chapter 3 (conclusion)
- **Find in game**: After all signal leaks scanned + last leak destroyed
- **Prerequisites**: `Ch3_HQ_EVA_Last_Leak_Destroyed` fired
- **What player encounters**:
  - HQ undergoes a warp / transition sequence
  - Cutscene
  - Arc concludes — HQ is now claimable by player
- **Where**: HQ Sector (`cluster_114_sector001`) → wherever it ends up
- **NPCs involved**: Scientist, Pioneer commander
- **Reward**: HQ unlocked + claimable + arc complete
- **Chains to**: End of HQ Discovery; Terran Core arc may activate
- **Code reference**: `story_hq_discovery.xml` `Ch3_HQ_Warping`

---

## Arc completion summary

A completed HQ Discovery yields:

- **Player Headquarters unlocked + accessible**
- HQ pre-configured with `x4ep1_playerheadquarters_pioneer_configuration` constructionplan
- Pioneer-affiliated player gets specific dialogue paths
- Storystate flag `story_hq_secret_service` set
- Unlocks subsequent arcs (Terran Core, Terraforming research, Welfare research arc)

## Mod conflict patterns specific to HQ Discovery

### HQ-replacement mods

If your mod replaces the HQ with a custom station OR pre-spawns it at game start, **Ch1 / Ch2 / Ch3 all break**:

- Chapter 1 references the existing HQ (no Pioneer scientist context)
- Chapter 2 satellite repair assumes HQ surroundings
- Chapter 3 EVA assumes specific HQ exterior geometry

Solution: hold off HQ-replacement until after arc completes (or set `$HasCustomGamestartSkip` true via custom gamestart).

### Pioneer-faction mods

Pioneer-faction-removal mods break dialog. Pioneer-relation mods affect arc dialogue tone.

### Cradle of Humanity DLC presence

The whole arc requires CoH. Without it: script fails to load. See [Wiki: DLC handling](/wiki/dlc-handling/).

## Code references

| Concern | Cue |
|---|---|
| Sector setup | `Start.Setup` |
| HQ creation (custom start skip) | `Start` `do_if $HasCustomGamestartSkip` |
| Chapter 1 entry | `Ch1_Force` + `Ch1_Intro` |
| Item delivery | `Ch1_Deliver_Item_Ref` (refs `md.RML_Deliver_Inventory.Deliver_Inventory`) |
| Police scan suppression | `Ch1_Suppress_Police_Scans` (v2) |
| Chapter 2 satellite repair | `Ch2_Satellites` (v3) `Ch2_Sat_Repair_Ref` |
| Chapter 3 EVA | `Ch3_HQ_EVA` (v2) + leak scan handlers |
| Chapter 3 warp | `Ch3_HQ_Warping` (v2) |

## Related

- [Terran arcs overview](/vanilla-content/missions/terran-arcs/)
- [Terran Prelude](/vanilla-content/missions/terran-arcs/prelude/) — preceding arc
- [Game starts catalog](/vanilla-content/game-starts/) — Terran Cadet / Pioneer Variant
- [Wiki: DLC handling](/wiki/dlc-handling/) — CoH presence required
- [Mod-conflict checklist](/vanilla-content/mod-conflict-checklist/) — broader checklist

---

*The HQ Discovery is the gateway to the Cradle of Humanity DLC's late-game content. Your mod's interference with Pioneer faction, the HQ macro, the signal-leak mechanic, or police-scan suppression all silently break a 3-chapter arc that some players spend their first 20 hours building toward.*

---
title: Erlking research arc
description: HQ research arc that ends with player claiming the Erlking — the famous unique XL battleship. Discovery → approach → boarding → upgrade chain. The most coveted ship-unlock in vanilla X4.
---

The **Erlking research arc** (`story_research_erlking.xml`, 40KB) is the **HQ research line** culminating in the player claiming the **Erlking** — a Pirate XL battleship (named "Owen" internally in vanilla code).

- **Script**: `story_research_erlking.xml`
- **DLC**: Pirate
- **Theme**: Discover → approach → board → claim → upgrade Erlking
- **Erlking ship macro**: `ship_pir_xl_battleship_01_a_macro` (callsign "Owen" — see vanilla debug text)
- **Factions touched**: faction.loanshark (Erlking's original owner — antagonist), faction.civilian, faction.player

## How the arc works

The arc is HQ research-gated. Player advances HQ research until the **Erlking research entry** unlocks. The arc then triggers:

1. Research entry selected at HQ
2. Boso Ta provides commentary on Erlking arrival
3. Player flies to find the Erlking
4. Erlking approach detection
5. Player attempts to board the Erlking
6. Boarding succeeds → player claims Erlking (with reputation penalty)
7. Player upgrades Erlking via additional research

## Persistent characters

| Character | Role |
|---|---|
| **Boso Ta** | HQ research scientist + Erlking commentary |
| **Erlking commander** | Loanshark NPC, original Erlking owner |

---

## Mission entry: "Erlking Research Unlock"

### Cue: `Check_Research_Unlocked` → `Research_Entry_Selected`

- **In-game name**: HQ research entry available
- **Path/Chapter**: Erlking research (entry)
- **Find in game**: HQ research menu after sufficient research progress
- **Prerequisites**:
  - Pirate DLC installed
  - HQ unlocked
  - Sufficient HQ research progress
- **What player encounters**:
  - Research entry appears in HQ menu
  - Player selects entry to commit research effort
  - Research countdown begins
- **Where**: Player HQ research menu
- **Reward**: Research underway
- **Chains to**: `Research_Finished` → `Boso_Arrives_Erlking_Remark`
- **Code reference**: `story_research_erlking.xml` `Check_Research_Unlocked`

---

## Mission entry: "Boso Ta's Erlking Remark"

### Cue: `Boso_Arrives_Erlking_Remark` (+ `_Ref`, `_Wait`)

- **In-game name**: Boso Ta announces Erlking location
- **Path/Chapter**: Erlking research (Discovery)
- **Find in game**: After research finishes
- **Prerequisites**: Research finished
- **What player encounters**:
  - Boso Ta arrives at HQ (`Boso_Arrives_Erlking_Remark_Wait` waits for arrival)
  - Boso speaks remark about Erlking (`Boso_Arrives_Erlking_Remark_Ref` refs LIB_Dialog.Speak_Actor)
  - Player learns Erlking's approximate location
- **Where**: HQ
- **NPCs involved**: Boso Ta
- **Reward**: Erlking location revealed
- **Chains to**: `Find_Player_Erlking` → `Player_Approach_Handler`
- **Code reference**: `story_research_erlking.xml` `Boso_Arrives_Erlking_Remark`

---

## Mission entry: "Approach the Erlking"

### Cue: `Player_Approach_Handler` + `Player_Approach_Ref`

- **In-game name**: Find and approach the Erlking
- **Path/Chapter**: Erlking research (Approach)
- **Find in game**: After Boso's remark
- **Prerequisites**: Erlking location known
- **What player encounters**:
  - Erlking located in specific sector (Loanshark territory)
  - **Approach mechanics**:
    - `Player_Approach_Handler` — main approach detection
    - `Player_Approach_Ref` — approach library ref
    - `Player_Approach_BattleshipXL_Far_Message` (+ `_Ref`) — message when far from Erlking
    - `Player_Next_Approach` (+ `_Reset`) — multiple approach attempts allowed
    - `Player_ApproachSignal_StoryCheck` — verify story state on approach
  - **Hostility handling**: `Player_Hostility_Handler` — Erlking is Loanshark-owned, hostile to player
- **Where**: Loanshark territory (Erlking parked location)
- **NPCs involved**: Erlking commander (Loanshark)
- **Reward**: Erlking in range; boarding becomes possible
- **Chains to**: `Player_Boarding_Erlking` → `Boarding_Started`
- **Code reference**: `story_research_erlking.xml` `Player_Approach_Handler`

#### Mod conflict risks — Approach

- ❌ **Mods that make Loanshark non-hostile** trivialize the approach
- ❌ **Mods that move the Erlking** break the trigger location
- ⚠ **Mods that change ApproachObject_Handler** affect detection
- ⚠ **Combat mods** affect approach feasibility (Erlking is heavily defended)

---

## Mission entry: "Board the Erlking"

### Cue: `Player_Boarding_Erlking` + `Boarding_Started` + `Boarding_Successful`

- **In-game name**: Board the Erlking
- **Path/Chapter**: Erlking research (Boarding)
- **Find in game**: After successful approach
- **Prerequisites**: Player in range; boarding fleet prepared
- **What player encounters**:
  - Player initiates boarding action against Erlking
  - Boarding sequence starts (`Boarding_Started`)
  - If boarding succeeds (`Boarding_Successful`) → claim path
- **Where**: Erlking location
- **NPCs involved**: Loanshark crew (defenders), player's boarding marines
- **Reward**: Erlking captured (if successful)
- **Chains to**: `Player_Claimed_Erlking` → `Player_Claimed_Erlking_ReputationDrop`
- **Code reference**: `story_research_erlking.xml` `Player_Boarding_Erlking`

#### Mod conflict risks — Boarding

- ❌ **Mods that disable boarding mechanics** break the entire arc
- ❌ **Mods that change Loanshark crew strength** affect difficulty
- ⚠ **Marine-rebalance mods** affect success probability

---

## Mission entry: "Claim Erlking + Reputation Drop"

### Cue: `Player_Claimed_Erlking` → `Player_Claimed_Erlking_ReputationDrop`

- **In-game name**: Erlking captured — Loanshark relation drops
- **Path/Chapter**: Erlking research (Aftermath)
- **Find in game**: Auto-fires after successful boarding
- **What player encounters**:
  - Erlking now player-owned
  - **Major Loanshark relation drop** (`Player_Claimed_Erlking_ReputationDrop`)
  - Loanshark faction becomes hostile (or more hostile) to player
- **Reward**: Erlking ship + Loanshark relations damaged
- **Chains to**: `Player_Erlking_Build_Added` (upgrade path)
- **Code reference**: `story_research_erlking.xml` `Player_Claimed_Erlking`

---

## Mission entry: "Erlking Upgrade Path"

### Cue: `Player_Erlking_Build_Added` → `Player_Erlking_Build_Finished`

- **In-game name**: Erlking upgrade builds
- **Path/Chapter**: Erlking research (Upgrade)
- **Find in game**: After Erlking claimed
- **Prerequisites**: Erlking captured
- **What player encounters**:
  - Player can add Erlking upgrade builds at shipyard
    - `Player_Erlking_Build_Added` — build added
    - `Player_Erlking_Build_Cancelled` — build cancelled (variation)
    - `Player_Erlking_Build_Finished` — build complete
  - When fully upgraded → `Erlking_Fully_Upgraded`
- **Where**: Shipyard
- **NPCs involved**: Shipyard manager
- **Reward**: Erlking at max performance
- **Code reference**: `story_research_erlking.xml` `Player_Erlking_Build_*`

---

## Save migration

`Patch_Userdata` — handles userdata patching for save compatibility. Your mod modifying Erlking state must respect this patch.

## Path completion summary

A completed Erlking arc yields:

- **Erlking ship** in player fleet (unique XL battleship)
- Loanshark faction hostile (relation drop)
- Erlking upgraded to maximum specs
- Research arc closed

## Code references

| Concern | Cue |
|---|---|
| Research unlock | `Check_Research_Unlocked` + `Research_Entry_Selected` |
| Boso commentary | `Boso_Arrives_Erlking_Remark*` |
| Erlking approach | `Player_Approach_Handler` + helpers |
| Hostility handling | `Player_Hostility_Handler` |
| Boarding | `Boarding_Started` + `Boarding_Successful` |
| Claim mechanics | `Player_Claimed_Erlking*` |
| Upgrade path | `Player_Erlking_Build_*` |
| Save patch | `Patch_Userdata` |

## Related

- [Pirate arcs overview](/vanilla-content/missions/pirate-arcs/)
- [Criminal arc](/vanilla-content/missions/pirate-arcs/criminal/) — parallel arc
- [Welfare 2 research](/vanilla-content/missions/pirate-arcs/welfare-2/) — adjacent research arc

---

*The Erlking is one of X4's most desired player rewards. A unique XL battleship obtained via heist. Your mod's interference with boarding mechanics, Loanshark hostility, or HQ research breaks the canonical Erlking acquisition path.*

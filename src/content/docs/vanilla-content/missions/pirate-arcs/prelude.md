---
title: Pirate Prelude
description: Scavenger Captain + Salvage Team encounter at gate. Introduces Tides of Avarice / Pirate-DLC scavenger faction to the player.
---

The **Pirate Prelude** is the cinematic introduction to the Pirate DLC's Scavenger content. When the player approaches a specific gate, the prelude fires — showing a Scavenger Captain and Salvage Team at work, establishing the scavenger gameplay and unlocking access to Tides of Avarice content.

- **Script**: `story_pirate_prelude.xml` (34KB)
- **DLC**: Pirate
- **Sectors involved**:
  - **Black Hole Sun IV** (`cluster_06_sector001`) — base game sector
  - **S1c Sector** (`cluster_503_sector001`) — Tides of Avarice sector

## Setup characters

The prelude creates two persistent Scavenger NPCs:

### Scavenger Captain

- **Character macro**: `character_prelude_scavenger_captain`
- **Text page**: 10177
- **Owner**: `faction.scavenger`
- **Skills**:
  - Management: 10
  - Morale: 2
  - Piloting: 7
  - Engineering: 3
  - Boarding: 0

### Salvage Team (NPC group)

- **Character macro**: `character_prelude_scavenger_salvageteam`
- **Text page**: 10172
- **Owner**: `faction.scavenger`
- **Skills**:
  - Management: 5
  - Morale: 3
  - (other skills follow standard scavenger profile)

---

## Mission entry: "Scavenger Encounter"

### Cue: `Prelude_Scavenger_Miniscene` (v2)

- **In-game name**: Scavenger Captain encounter (cinematic intro)
- **Path/Chapter**: Pirate Prelude
- **Find in game**: Player approaches the specific gate (Black Hole Sun IV → S1c gate)
- **Prerequisites**:
  - Pirate DLC installed
  - Setup_DLC_Pirate complete
- **What player encounters**:
  - Scavenger Captain initiates encounter
  - Salvage Team active at scavenge site
  - Approach handler (`Prelude_Scavenger_Approach_Gate_Ref` refs `md.LIB_Generic.ApproachObject_Handler`)
  - DND ("Do Not Disturb") protection:
    - `Prelude_Scavenger_DND_Move_Away_From_Gate` — moves scavengers if player tries to disrupt
    - `Prelude_Scavenger_DND_Reset_Approach_Handler` — resets after disruption
- **Where**: Gate between Black Hole Sun IV and S1c sector
- **NPCs involved**: Scavenger Captain, Salvage Team
- **Reward**: Cinematic experience + scavenger faction acknowledged + Tides of Avarice access
- **Chains to**: Pirate Criminal arc availability; other Pirate-arc unlocks
- **Code reference**: `story_pirate_prelude.xml` `Prelude_Scavenger_Miniscene` (v2)

### Mod conflict risks — Scavenger Encounter

- ❌ **Mods that disable Scavenger faction** break the entire prelude
- ❌ **Mods that change Black Hole Sun IV → S1c gate** break trigger
- ❌ **Mods that change `character_prelude_scavenger_captain` macro** break captain spawn
- ❌ **Mods that interfere with `ApproachObject_Handler`** affect proximity logic
- ⚠ **Mods adding bulk salvage NPCs** can collide with salvage team
- ⚠ **Combat mods that change scavenger behavior** affect the captain's appearance

---

## DEBUG mission

The script includes a **debug mission**: `Prelude_Scavenger_Mission_DEBUG` for testing the prelude flow without waiting for the natural trigger. Modders can `signal_cue` this manually to test their changes.

---

## Effects after prelude

After the Pirate Prelude completes:
- Player aware of Scavenger faction
- Tides of Avarice gate access opened
- Pirate-arc state initialized → Criminal arc, The Fan arc, Erlking research, Welfare 2 research all become eligible to trigger

## Code references

| Concern | Cue |
|---|---|
| Setup actors | `Prelude_Scavenger_Setup` |
| Debug mission | `Prelude_Scavenger_Mission_DEBUG` |
| Approach detection | `Prelude_Scavenger_Approach_Gate_Ref` |
| DND handling | `Prelude_Scavenger_DND_Move_Away_From_Gate` |

## Related

- [Pirate arcs overview](/vanilla-content/missions/pirate-arcs/)
- [Criminal arc](/vanilla-content/missions/pirate-arcs/criminal/) — what unlocks after prelude
- [The Fan arc](/vanilla-content/missions/pirate-arcs/thefan/)
- [Game starts catalog](/vanilla-content/game-starts/) — gs_pirate1 / gs_pirate2

---

*The Pirate Prelude is a short cinematic moment establishing the Scavenger faction. Cheaper to break than the elaborate Boron / Terran preludes, but breaking it locks player out of the entire 5-arc DLC.*

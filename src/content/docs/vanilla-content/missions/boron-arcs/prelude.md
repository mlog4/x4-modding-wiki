---
title: Boron Prelude
description: Heretic's End gate scene introducing Boron content. Teladi trader encounter at the gate to Barren Shores. Cinematic intro to Kingdom End DLC.
---

The **Boron Prelude** is the cinematic introduction to the Kingdom End DLC. When the player approaches the gate between Heretic's End and Barren Shores, a Teladi trader cutscene plays — establishing the Boron-Teladi trade relationship and unlocking Boron space access.

- **Script**: `story_boron_prelude.xml`
- **DLC**: Kingdom End
- **Sectors involved**: Heretic's End (`cluster_31_sector001`) → Barren Shores (`cluster_602_sector001`) → Watchful Gaze (`cluster_601_sector001`)

## Setup

The prelude anchors three sectors and creates the Teladi trader fleet:

- **Heretic's End** (`cluster_31_sector001`) — staging area
- **Watchful Gaze** (`cluster_601_sector001`) — destination
- **Barren Shores** (`cluster_602_sector001`) — entry to Boron space

A **Teladi Trader Actor** is created. The setup spawns:
- **1× Teladi L-class container ship** (`tag.container`, 80% loadout level) — invincible during scene, min shield 20%
- **5× Teladi M-class trader escorts**
- All positioned near the BHS Gate (Barren Shores gate)
- Trade ship orientation: "look at" gate

The Teladi convoy is set to **invincible** during the scene via `md.LIB_Generic.RequestObjectInvincibility` — player can't disrupt the cutscene by destroying the convoy.

---

## Mission entry: "Heretic's End Encounter"

### Cue: `Prelude_Boron_Miniscene`

- **In-game name**: Teladi trader encounter (cinematic intro)
- **Path/Chapter**: Boron Prelude
- **Find in game**: Player approaches the Boron-side gate in Heretic's End sector
- **Prerequisites**:
  - Kingdom End DLC installed
  - Setup_DLC_Boron complete
  - Player approaches `$BHSGate` (Barren Shores gate)
- **What player encounters**:
  - Teladi L-class trader convoy with 5 M-class escorts at the gate
  - The Teladi trader initiates conversation
    - `Prelude_Boron_FirstTeladiComm` — first comm call (1s interval poll)
  - Approach handler tracks proximity (`Prelude_Boron_Approach_Gate_Ref`)
  - "DND" (Do Not Disturb) handling — if player tries to disrupt:
    - `Prelude_Boron_DND_CheckConditions` (1s) — checks if player interference
    - `Prelude_Boron_DND_Move_Away_From_Gate` — moves Teladi away if needed
- **Where**: Heretic's End sector (`cluster_31_sector001`), near gate to Barren Shores
- **NPCs involved**:
  - Teladi Trader Actor (pilot)
  - Escort pilots (5 ships)
- **Reward**: Cinematic intro played; Boron space access unlocked
- **Chains to**: `Prelude_Boron_Cutscene` → `Prelude_Approach_Cutscene_Started`
- **Code reference**: `story_boron_prelude.xml` `Prelude_Boron_Miniscene`

### Mod conflict risks — Heretic's End Encounter

- ❌ **Mods that disable Teladi L-class container ships** (`tag.container`) break trader spawn
- ❌ **Mods that change Heretic's End → Barren Shores gate** break trigger
- ❌ **Mods that interfere with `LIB_Generic.ApproachObject_Handler`** affect proximity logic
- ❌ **Mods that disable invincibility requests** allow player to destroy the cutscene
- ⚠ **Mods that change Teladi-faction behavior** affect trader orientation
- ⚠ **Mods that bulk-spawn ships at Heretic's End** may collide with the prelude spawns

---

## Mission entry: "Approach Cutscene"

### Cue: `Prelude_Boron_Cutscene` / `Prelude_Approach_Cutscene_Started`

- **In-game name**: Cinematic cutscene (no player input)
- **Path/Chapter**: Boron Prelude (climax)
- **Find in game**: Auto-fires after Heretic's End encounter
- **Prerequisites**: Teladi convoy encountered + approach trigger met
- **What player encounters**:
  - Cinematic — Teladi convoy proceeds through gate
  - Player can observe through Boron space corridor
  - NPC usecase abort handler (`Prelude_NPCUsecase_Aborted` v2) — recovery if cutscene interrupted
- **Where**: Heretic's End → through gate
- **NPCs involved**: Teladi convoy
- **Reward**: Boron arc state initialized; main Boron story available
- **Chains to**: End of Prelude → Main story available
- **Code reference**: `story_boron_prelude.xml` `Prelude_Boron_Cutscene`

### Mod conflict risks — Approach Cutscene

- ❌ **Mods that disrupt cutscene system** break the prelude finish
- ⚠ **Player-control mods during cutscenes** may break NPCUsecase abort handling

---

## After the Prelude

Once Prelude completes:
- Player can access Boron space via the now-revealed gate
- `Setup_DLC_Boron` is signaled
- Main Boron story becomes available (Ch0 / Ch1 entry conditions)

## Code references

| Concern | Cue |
|---|---|
| Setup ships (Teladi trader + escorts) | `Prelude_Boron_Setup_Ships` (v2) |
| First Teladi comm | `Prelude_Boron_FirstTeladiComm` |
| Approach detection | `Prelude_Boron_Approach_Gate_Ref` (refs LIB_Generic.ApproachObject_Handler) |
| DND handling (player interference) | `Prelude_Boron_DND_*` cues |
| Cutscene | `Prelude_Boron_Cutscene` + `Prelude_Approach_Cutscene_Started` |
| NPCUsecase abort recovery | `Prelude_NPCUsecase_Aborted` (v2) |

## Related

- [Boron arcs overview](/vanilla-content/missions/boron-arcs/)
- [Boron main story](/vanilla-content/missions/boron-arcs/main/) — what follows the prelude
- [Boron epilogue](/vanilla-content/missions/boron-arcs/epilogue/) — late-game culmination
- [Game starts catalog](/vanilla-content/game-starts/) — gs_boron starts

---

*The Boron Prelude is X4's "welcome to Kingdom End" moment. Cinematic-heavy, with invincible convoy protection. Your mod's interference with cutscene systems or Heretic's End is the most common failure mode.*

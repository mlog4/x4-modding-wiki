---
title: Terran Prelude
description: Mars Gate first-encounter scene. Triggered when player approaches the Terran-side gate. Cutscene reveals Terran patrols and Xenon presence. Two variants — Terran-side / non-Terran-side approach.
---

The **Terran Prelude** is the cinematic intro to the Terran DLC. When the player first approaches a specific gate (the Mars / Asteroid Belt connection), the prelude fires — showing a Terran patrol, a Xenon destroyer, and a brief cutscene establishing the Cradle of Humanity setting.

- **Script**: `story_terran_prelude.xml` (807 lines)
- **Text page**: 30283
- **DLC**: Cradle of Humanity
- **Trigger**: `event_cue_completed cue="md.Setup_DLC_Terran.X4ep1_Prelude_Setup"`

## Setup

The prelude initializes when the DLC setup completes. It anchors:

- **Asteroid Belt** (`cluster_100_sector001`)
- **Savage Spur** (`cluster_112_sector002`)
- **Mars** (`cluster_101_sector001`)
- A **Terran Actor** (NPC) — same actor used for both gate variants and Teladi-trespassing event

The Terran Actor is created with:
- `group = terran.pilot.male` (male Terran pilot voice)
- `page = 10155` (actor text page)
- `owner = faction.terran`

## Two variants

The prelude has **two distinct paths** depending on which side of the gate the player approaches from.

---

## Mission entry: "Terran Gate approach (Terran side)"

### Cue: `Prelude_Terran_Gate`

- **In-game name**: Brief cutscene (no UI mission marker)
- **Path**: Terran-side approach
- **Find in game**: Player flies through Mars → Asteroid Belt acceleration gate from the Terran (Mars) side
- **Prerequisites**:
  - `event_cue_completed md.Setup_DLC_Terran.Terran_Prelude_Approached_Gate`
  - Gate extension is `ego_dlc_terran`
- **What player encounters**:
  - Cutscene starts as player approaches the gate
  - **Xenon Destroyer** spawns nearby (`ship_xen_xl_destroyer_01_a_macro`)
    - Set to 15% shield, 85% hull — battle-damaged appearance
    - Oriented to "look away" from the gate
    - Position: 1.5km from gate
  - Terran patrol ships are present, engaged with Xenon
  - VoiceOver plays (`Prelude_Terran_VoiceOver`)
  - Player fighter launches to assist (`Prelude_Terran_LaunchFighters`)
- **Where**: Mars / Asteroid Belt gate
- **NPCs involved**: Terran patrol commander, Xenon destroyer pilot (fighter pilot tag)
- **Reward**: Cinematic experience + DLC story flagged as "encountered from Terran side"
- **Chains to**: `Prelude_Terran_Cutscene` → `Prelude_Terran_LaunchFighters` → `Prelude_Terran_EndCutscene` → `Prelude_Terran_Victory`
- **Code reference**: `story_terran_prelude.xml` `Prelude_Terran_Gate`

### Mod conflict risks — Terran Gate approach

- ❌ **Mods that disable `ship_xen_xl_destroyer_01_a_macro`** break the cutscene Xenon spawn
- ❌ **Mods that change Mars/Asteroid Belt gate macros** break the trigger
- ❌ **Mods that disable Terran-Xenon hostility** prevent the combat scene
- ⚠ **Combat-rebalance mods** affect whether Terran patrol survives the cutscene
- ⚠ **Custom Xenon mods that alter destroyer behavior** break the look-away orientation

---

## Mission entry: "Terran Gate approach (Non-Terran side)"

### Cue: `Prelude_NonTerran_Gate`

- **In-game name**: Brief cutscene (no UI mission marker)
- **Path**: Non-Terran-side approach (player comes from "outside" first)
- **Find in game**: Player approaches the Mars gate from the non-Terran (Argon space) side
- **Prerequisites**: Same setup as Terran-side, different gate-side conditions
- **What player encounters**:
  - Cutscene from the opposite perspective
  - VoiceOver variant (`Prelude_NonTerran_VoiceOver`)
  - Player ship retrieval cue (`Prelude_NonTerran_RetrieveFighter`) — player's own fighter may be involved
- **Where**: Non-Terran side of Mars gate
- **NPCs involved**: Terran patrol (perspective changed)
- **Reward**: Cinematic experience + DLC story flagged as "encountered from non-Terran side"
- **Code reference**: `story_terran_prelude.xml` `Prelude_NonTerran_Gate`

### Mod conflict risks — Non-Terran Gate approach

- Same as Terran-side
- ⚠ **Gate-overhaul mods** (custom gate connections) can confuse which gate triggers which variant

---

## Mission entry: "Fighter Victory" (post-cutscene cleanup)

### Cue: `Prelude_Terran_Victory`

- **In-game name**: Cleanup phase
- **Path**: Both variants
- **Find in game**: Auto-fires after cutscene ends
- **What player encounters**:
  - Verifies whether player's deployed fighter survived
  - `Prelude_Terran_FighterRemaining` — fighter still alive count
  - `Prelude_Terran_FighterDocked` — fighter returned to player
  - `Prelude_Terran_Cleanup` — final cleanup
- **Reward**: Story progression unlocks Restricted Core mechanic + Mars patrol awareness
- **Chains to**: Setup completion → unlocks Terran Core arc
- **Code reference**: `story_terran_prelude.xml` `Prelude_Terran_Victory`

---

## Summary of prelude effects

After the prelude:

- Player aware Mars gate exists + has Terran patrol
- Restricted Core mechanic active in Mars / Earth / Venus / Moon / Asteroid Belt
- Terran patrols approach-warn / firm-warn / trespass-warn the player (handled by `RestrictedCore_Broadcasts` cue chain in [Terran Core](/vanilla-content/missions/terran-arcs/core/))
- DLC story flagged as "begun"

## Code references

| Concern | File / cue |
|---|---|
| Prelude initialization | `setup_dlc_terran.xml` (X4ep1_Prelude_Setup cue) |
| Terran-side path | `story_terran_prelude.xml` Prelude_Terran_Gate |
| Non-Terran-side path | `story_terran_prelude.xml` Prelude_NonTerran_Gate |
| Cutscene fighter launch | `Prelude_Terran_LaunchFighters` |
| Cleanup | `Prelude_Terran_Cleanup` / `Prelude_Terran_Victory` |
| Restricted core hookup | `story_terran_core.xml` `RestrictedCore` cue chain |

## Related

- [Terran arcs overview](/vanilla-content/missions/terran-arcs/)
- [Terran Core](/vanilla-content/missions/terran-arcs/core/) — what unlocks after prelude
- [HQ Discovery](/vanilla-content/missions/terran-arcs/hq-discovery/) — separate Terran arc
- [Game starts catalog](/vanilla-content/game-starts/) — Terran Cadet + Pioneer starts

---

*The Prelude is X4's "first-impression" Cradle of Humanity moment. Cutscene quality. Your mod's Mars-gate or Xenon-destroyer changes break the impression.*

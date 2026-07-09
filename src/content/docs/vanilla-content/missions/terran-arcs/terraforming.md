---
title: Terran Terraforming arc
description: 860KB Terran-DLC terraforming story. Distinct from base game's terraforming system. Boso Ta + Yaki Scientist + Torus + Betty Research Ship. 9 chapters covering Solar System terraforming research.
---

The **Terran Terraforming arc** (`story_terraforming.xml`, **860KB**) is the **Terran DLC's terraforming story**, distinct from the base game's `terraforming.xml` system. The arc revolves around the **Torus** facility, **Betty Research Ship** with invincibility mechanic, the **Yaki Scientist** (cross-arc character), and 9 chapters (Ch0-Ch8) of Solar System terraforming progression.

- **Script**: `story_terraforming.xml`
- **DLC**: Cradle of Humanity
- **Size**: 860,699 bytes (~860KB)
- **Text page**: 30224
- **MDScript version**: 6 (heavily revised)
- **Chapters**: 9 (Ch0-Ch8)

Note: This is **NOT** the same as the base game terraforming system. See [Vanilla Terraforming catalog](/vanilla-content/terraforming/) for the base game's 99-project system. The Terran-DLC Terraforming arc adds story-driven terraforming content WITHIN the existing terraforming framework.

## Sectors anchored

| Variable | Macro | Vanilla name |
|---|---|---|
| (Earth) | `cluster_104_sector001` | Earth |
| (Moon) | `cluster_104_sector002` | Moon / Luna |
| (Mars) | `cluster_101_sector001` | Mars |
| (Venus) | `cluster_102_sector001` | Venus |
| (Mercury) | `cluster_106_sector001` | Mercury |
| (Asteroid Belt) | `cluster_100_sector001` | Asteroid Belt |
| `$GetsuFune` | `cluster_48_sector001` | Getsu Fune (bridge sector) |

The arc primarily operates **within the Solar System** plus Getsu Fune as a transition sector to Yaki space.

## Persistent characters

| Character | Setup cue | Role |
|---|---|---|
| **Dal Busta** | `Set_Dal_Immediately` | Player oversight |
| **Police Patrols** | `Setup_Character_Police_Patrols` (v2) + reset actors | Patrol force |
| **Yaki Scientist** | `Setup_Character_YakiScientist` (v2) | **CROSS-ARC** with Yaki story — Yaki Scientist character appears here too |
| **Betty Actor** | `Setup_Character_BettyActor` (v2) | Betty NPC |
| **Betty Pilot Actor** | `Setup_Character_BettyPilotActor` (v3) | Betty Ship pilot |
| **Torus** | `Setup_Character_Torus` (v2) | The Torus character (likely AI / facility persona) |
| **Chief Scientist** | `Ch0_Conversation_ChiefScientist` | Initial conversation NPC |
| **SSC (Secret Service Contact)** | `Ch0_Conversation_SSC_Started` | Secret Service Contact |

The **Yaki Scientist cross-arc** is notable — modifying one Terran arc may affect the other.

## The Betty Research Ship + invincibility system

A standout vanilla mechanic: the Betty Research Ship has a **dynamic invincibility system** with multiple sub-cues:

```
Setup_Character_Torus
└── ResearchShip_WaitForFirstSpawn
    └── ResearchShip_FirstSpawned
        └── ResearchShip_Catch_Disappearance
            ├── ResearchShip_MoveDie (Tracking Completed)
            ├── ResearchShipDestroyed
            └── ResearchShipExists

Setup_BettyInvincibility_PopulateGroup (instanced)
Setup_Betty_Invincibility_Undocking (instanced)
Setup_Betty_Invincibility_Request_Invulnerability_Group (instanced)
Setup_Betty_Invincibility_Request_Vulnerability_Group (instanced)
Setup_Betty_Invincibility_Request_Invulnerability (instanced)
Setup_Betty_Invincibility_Request_Vulnerability_ (instanced)
Setup_Betty_Invulnerability_Rescue (instanced)
```

The Betty Ship is **dynamically invincible** at specific story points — its invincibility can be **requested/released per group or individually**, with rescue handling if vulnerability would cause loss. Modders dealing with Betty Ship state must respect this complex system.

## Chapter overview

### Chapter 0 — Introductory conversations

| Cue | What it covers |
|---|---|
| `Ch0_Conversation_ChiefScientist` (instanced) | Talk to Chief Scientist |
| `Ch0_HQ_Plot_Done` | Verify HQ plot done (precondition) |
| `Ch0_Conversation_SSC_Started` (instanced) | Talk to Secret Service Contact |
| `Ch0_Conv_SSC_Anything_To_Report` (instanced) | SSC asks for report |

**Player encounters**:
- Chief Scientist at HQ briefs the player
- SSC contact provides covert oversight
- Arc primes for Ch1 research ship setup

### Chapter 1 — Research Ship Setup

| Cue | What it covers |
|---|---|
| `Ch1_Setup_ResearchShip` (v2) | Setup research ship |
| `Ch1_Setup_ResearchShip_Reset_Relation` (instanced) | Reset relations as needed |
| `Ch1_Setup_Order_Event` (instanced) | Order events |
| `Ch1_Setup_ResearchShip_HQ_Warp_Pursuit_Order` (instanced) | HQ warp pursuit handling |
| `Ch1_Conversation_Cancel_Destroyed_Patch` | Save patch for destroyed-during-conversation |
| `Ch1_Conversation_ResearchShip_Pilot_Refer` (instanced) | Refer to pilot in conversation |

**Player encounters**:
- Research ship spawns
- Player engages with research ship pilot
- Relation may be reset as part of setup

### Chapter 4 — Research Ship alignment

| Cue | What it covers |
|---|---|
| `Ch4_Setup_Align_ResearchShip_Ref` (refs LIB_Generic.ApproachLocation_Handler) | Align research ship to location |
| `Ch4_Setup_Warp_Conditions_Check` (5s polling) | Check warp conditions |

**Player encounters**:
- Research ship needs alignment for warp
- Periodic conditions check ensures viability

### Chapter 5 — Betty Ship Behavior

| Cue | What it covers |
|---|---|
| `Ch5_Setup_BettyShip_Behaviour` | Activate Betty Ship (when player first docks) |
| `Ch5_Hint_BettyShip_ID_Masked` (instanced) | Hint: Betty Ship ID is masked |
| `Ch5_Hint_BettyShip_ID_Masked_Ref` (refs LIB_Dialog.Speak_Actor) | Spoken hint |
| `Ch5_Hint_BettyShip_ID_Lost` (instanced) | Hint: Betty Ship ID lost |
| `Ch5_Hint_BettyShip_ID_Lost_Ref` (refs LIB_Dialog.Speak_Actor) | Spoken hint |

**Player encounters**:
- Betty Ship has masked ID (player can't identify it via normal scans)
- If player loses Betty Ship ID, hint plays
- Betty Ship behavior tied to player docking events

### Chapter 6 — Torus approach

| Cue | What it covers |
|---|---|
| `Ch6_Torus_InRange_Ref` (refs LIB_Generic.ApproachObject_Handler) | Torus approach detection (in-range) |
| `Ch6_Torus_OutOfRange` (refs LIB_Generic.ApproachObject_Handler) | Torus approach detection (out-of-range) |

**Player encounters**:
- The **Torus** is the central plot facility
- Player approaches → triggers events
- Player leaves range → cleanup / state reset

### Chapters 2-3, 7-8

Specific chapter cues exist but were not exhaustively cataloged in this overview. Modders should grep `story_terraforming.xml` for `Ch2_*`, `Ch3_*`, `Ch7_*`, `Ch8_*` to extract per-chapter detail.

The arc concludes with Ch8 as the climactic terraforming achievement.

## Save migration

Multiple save migration patches:
- `Ch1_Conversation_Cancel_Destroyed_Patch` — handles destroyed research ship mid-conversation
- Other patch helpers throughout the arc (instanced for save-load compatibility)

## Mod conflict risks (Terran Terraforming-specific)

- ❌ **Mods that change Solar System sector ownership** affect entire arc
- ❌ **Mods that disable Yaki Scientist (cross-arc dependency)** break Setup_Character_YakiScientist
- ❌ **Mods that change HQ research mechanics** affect Ch0/Ch1 prerequisites
- ❌ **Mods that interfere with `ApproachLocation_Handler` / `ApproachObject_Handler`** break Torus and research ship alignment
- ❌ **Mods that change invincibility request mechanics** break Betty Ship survival system
- ⚠ **Mods that affect ship-masking / scanning mechanics** break Ch5 Betty ID masking
- ⚠ **Mods affecting research ship behaviors** break Ch1 pursuit + Ch4 alignment
- ⚠ **Faction-relation mods on Terran factions** affect Ch1 reset_relation

## Code references

| Concern | Cue |
|---|---|
| Police patrols | `Setup_Character_Police_Patrols` (v2) |
| Torus setup | `Setup_Torus` (v2) + `Setup_Character_Torus` |
| Yaki Scientist (cross-arc) | `Setup_Character_YakiScientist` (v2) |
| Betty actors | `Setup_Character_BettyActor` (v2) + `Setup_Character_BettyPilotActor` (v3) |
| Research Ship lifecycle | `ResearchShip_WaitForFirstSpawn` → `FirstSpawned` → `Catch_Disappearance` |
| Betty invincibility system | `Setup_Betty_Invincibility_*` block (7+ cues) |
| Ch0 conversations | `Ch0_Conversation_*` |
| Ch1 Research Ship setup | `Ch1_Setup_ResearchShip` (v2) |
| Ch4 Research Ship alignment | `Ch4_Setup_Align_ResearchShip_Ref` |
| Ch5 Betty Ship behavior | `Ch5_Setup_BettyShip_Behaviour` |
| Ch6 Torus approach | `Ch6_Torus_InRange_Ref` / `OutOfRange` |
| Save patch | `Ch1_Conversation_Cancel_Destroyed_Patch` |

## Related

- [Terran arcs overview](/vanilla-content/missions/terran-arcs/)
- [Yaki arc](/vanilla-content/missions/terran-arcs/yaki/) — shares Yaki Scientist character
- [Terran Core](/vanilla-content/missions/terran-arcs/core/) — Solar System restricted-territory enforcement
- [HQ Discovery](/vanilla-content/missions/terran-arcs/hq-discovery/) — HQ unlock arc (prerequisite)
- [Vanilla Terraforming catalog](/vanilla-content/terraforming/) — base game's 99-project terraforming framework

---

*Terran Terraforming is **distinct** from base game terraforming — story-driven research arc within the Solar System. Betty Ship with dynamic invincibility, Torus facility, Yaki Scientist cross-arc — your mod's interference with any of these breaks the 860KB story chain.*

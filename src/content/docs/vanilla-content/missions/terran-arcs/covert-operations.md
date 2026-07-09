---
title: Covert Operations arc
description: 521KB Terran espionage arc. Antigone official Saman + Scaleplate Lieutenant. 8 chapters (Ch0-Ch6 + Ch9). Hack stations, plant satellites, deploy bombs, evade Argon police.
---

The **Covert Operations arc** (`story_covert_operations.xml`, 521KB) is the **Terran DLC espionage story**. The player conducts covert missions involving **Antigone surveillance, hacking, satellite deployment, EMP attacks**, and **station bombs**. The arc is structured across 8 chapters (Ch0-Ch6 + Ch9, no Ch7-Ch8).

- **Script**: `story_covert_operations.xml`
- **DLC**: Cradle of Humanity
- **Size**: 521,009 bytes
- **Text page**: 30227 (with `30210` fallback for some contexts)
- **MDScript version**: 4
- **Chapters**: Ch0, Ch1, Ch2, Ch3, Ch4, Ch5, Ch6, Ch9 (note: no Ch7/Ch8)

## Persistent characters

| Character | Setup cue | Role |
|---|---|---|
| **Saman Red** (Antigone Official) | `Setup_Character_AntigoneOfficial` (v2) — macro `character_argon_male_plot_antigone_official_macro` | "Antigone diplomat and Anti-Terran Operative" (vanilla code comment) — player's main contact + briefing source |
| **Scaleplate Lieutenant** | `Setup_Character_ScaleplateLieutenant` (v2) | Antagonist contact |
| **Dal Busta** | `Dal_Offer_Call` | Provides offer calls |
| **Boso Ta** | `Ch1_Covert_Intro_BosoBowsOut_Ref` | "Boso bows out" — exits the storyline early |
| **Secret Service Actor** | `SecretServiceActor_Section_Story_Covert_Operations` | Section-bound contact |

The **"Boso bows out"** detail is notable — Boso Ta acknowledges that the Covert Ops arc is **not** his domain and steps back.

## Sectors anchored

| Variable | Macro | Vanilla role |
|---|---|---|
| `$AntigoneMemorialSector` | `cluster_28_sector001` | Antigone Memorial |
| `$SecretServiceSector` | `cluster_101_sector001` | Mars — Secret Service contact |
| `$ANT_Sectors` | `cluster_27_sector001` | Antigone sectors group |
| `$FallbackScalePlateSector` | `cluster_01_sector002` | Scale Plate fallback sector |

## Faction interactions

`faction.antigone` (main), `faction.argon` (police), `faction.civilian`, `faction.ownerless`, `faction.player`, `faction.scaleplate` (antagonist), `faction.terran` (sponsor), `faction.xenon` (background).

## Chapter 0 — Prerequisites

### Mission entry: "Secret Service Prerequisite Conversation"

- **Cue**: `Ch0_SecretServiceActor_Prerequisite_Conversation` (instantiated)
- **Path/Chapter**: Covert Ops Ch0
- **Find in game**: Talk to Secret Service Actor for first time
- **What player encounters**:
  - Conversation establishing eligibility for Covert Operations
  - Story_Reminder system available for hints
- **NPCs involved**: Secret Service Actor
- **Chains to**: Ch1 Intro
- **Code reference**: `story_covert_operations.xml` `Ch0_SecretServiceActor_Prerequisite_Conversation`

## Chapter 1 — Covert Intro

The largest chapter, multi-component. Setup of all subsequent covert mechanics.

### Mission entry: "Covert Intro Briefing"

- **Cue**: `Ch1_Covert_Intro` (v2) + `Ch1_Covert_Intro_SecretServiceActor_Briefing`
- **In-game name**: Briefing with Saman + gate encounter
- **Path/Chapter**: Covert Ops Ch1 (intro)
- **What player encounters**:
  - **Briefing conversation**: `Ch1_Covert_Intro_SecretServiceActor_Briefing_Conversation` (instanced)
  - **Boso bows out**: `Ch1_Covert_Intro_BosoBowsOut_Ref` (refs LIB_Dialog.Speak_Actor) — Boso explicitly steps away from the arc
  - **Gate Encounter setup**: `Ch1_Covert_Intro_Gate_Encounter_Setup` (v3)
  - **Antigone exposition** (5s polling):
    - `Ch1_Covert_Intro_ANT_Exposition` — exposition trigger
    - `Ch1_Covert_Intro_ANT_Exposition_Ref` (refs LIB_Dialog.Speak_Actor)
- **Where**: Saman's location (Antigone or Secret Service Sector)
- **NPCs involved**: Saman (Antigone Official), Boso Ta (brief exit)
- **Chains to**: Argon Police Encounter (`Ch1_Argon_Police_*`)
- **Code reference**: `story_covert_operations.xml` `Ch1_Covert_Intro*`

### Mission entry: "Argon Police Pursuit"

- **Cue**: `Ch1_Argon_Police_Control_*` block + `Ch1_PlayerRunning` + `Ch1_Escaped_Argon_Police`
- **In-game name**: Evade Argon police during covert travel
- **Path/Chapter**: Covert Ops Ch1
- **What player encounters**:
  - Argon police detect player suspicious activity
  - Sector check: `Ch1_Argon_Police_Control_Check_Sector` (instanced)
  - Target sector tracker: `Ch1_Argon_Police_Control_ReachedTargetSector_Ref` (refs LIB_Generic.ReachedSector)
  - Event check: `Ch1_Argon_Police_Control_Event_Check` (instanced)
  - Conversation trigger (1s polling): `Ch1_Argon_Police_Conversation_Trigger`
  - **Player evasion tracking**:
    - `Ch1_PlayerRunning` (1s polling) — detect player fleeing
    - `Ch1_Escaped_Argon_Police` (5s polling) — confirm escape
- **Objectives**: Flee Argon police, reach safe sector
- **Reward**: Escape unlocks next phase
- **Code reference**: `story_covert_operations.xml` `Ch1_Argon_Police_*`

#### Mod conflict risks — Argon Police Pursuit

- ❌ **Mods that disable Argon police** trivialize the chase
- ❌ **Mods that change `ReachedSector` library** break sector tracking
- ⚠ **Combat-rebalance mods** affect chase difficulty

### Mission entry: "Deploy Satellite (Surveillance)"

- **Cue**: `Ch1_Deploy_Satellite` (v5) + setup `Ch1_Deploy_Satellite_Setup` (v2)
- **In-game name**: Deploy surveillance satellite
- **Path/Chapter**: Covert Ops Ch1
- **What player encounters**:
  - Player must deploy a satellite (refs `RML_DeployInPlace.DeployInPlace`)
  - **Wrong-satellite detection**:
    - `Ch1_Wrong_Satellite` (instanced) — fires if player deploys wrong satellite type
    - `Ch1_Wrong_Satellite_Ref` (refs LIB_Dialog.Speak_Actor) — spoken correction
  - **Station destruction listener**: `Ch1_Deploy_Satellite_Signal_StationDestructionListener` — if target station destroyed during deploy
  - **SCA Exposition** + Dal Exposition guidance
- **Objectives**: Deploy correct satellite at correct location
- **Reward**: Surveillance live; next chapter unlocks
- **Code reference**: `story_covert_operations.xml` `Ch1_Deploy_Satellite*`

#### Mod conflict risks — Deploy Satellite

- ❌ **Mods that change satellite macros** affect "wrong satellite" detection
- ❌ **Mods that disable RML_DeployInPlace** break deployment
- ⚠ **Custom satellite mods** can confuse wrong-satellite check

---

## Chapters 2-6 — Covert operations

Each chapter advances the covert ops storyline with increasingly sophisticated operations:

### Chapter pattern

Each Ch2-Ch6 includes:

- `Ch*_Force` — force-start chapter
- `Ch*_Setup` — chapter setup
- `Ch*_Mission` — main mission
- Various objective sub-cues
- DEBUG cues for testing

Vanilla patterns observed in cue tree (general):

| Pattern | Sample cues |
|---|---|
| **Deploy In Place** | `DeployInPlace_Ref` (refs `md.RML_DeployInPlace.DeployInPlace`) |
| **Hack Station** | `HackStation_BombAttacked` (instanced) |
| **EMP Surveillance** | `HackStation_Surveillance_EMP_Check_For_Further_Breaches` (instanced) |
| **Satellite Exposition** | `Satellite_Exposition` |
| **Dal Offer Call** | `Dal_Offer_Call` + `Dal_Wait_For_Fullscreen` (5s polling) |
| **Display Cutscene** | `DisplayCutscene_General` |

### Hack Station + Bomb Attack mechanic

A unique Covert Ops mechanic — the player can **plant bombs on target stations** to disrupt:
- `HackStation_BombAttacked` — handler when player's planted bomb attacks target
- `HackStation_Surveillance_EMP_Check_For_Further_Breaches` — after EMP, check for additional security breaches

This is the **espionage gameplay** signature: hack, plant bomb, EMP-bypass surveillance.

---

## Chapter 9 — (Late arc / epilogue?)

The arc skips Ch7-Ch8 and jumps to Ch9. Likely:
- Final reward
- Epilogue dialog
- Arc-completion state

(Specific Ch9 cues not extracted in this overview — modders should grep `story_covert_operations.xml` for `Ch9_*` cues directly.)

---

## Skipping mechanism

The arc includes `Handle_Custom_Gamestart_Skip` (+ `Handle_Custom_Gamestart_Skip_Activate` at 50ms checkinterval) — custom game starts can skip parts of Covert Operations via storystate flags.

## DEBUG_Skipper system

Standard vanilla testing setup:
- `Debug_Skipper_Conversation_Chapter` / `_Chapter_Selected` — choose chapter to test
- `Debug_Skipper_Conversation_Reputation` / `_Reputation_Selected` — set reputation for testing
- `Debug_Skipper_Conversation_Credits` — give credits for testing

Modders should NOT rely on these.

## Path completion summary

A completed Covert Operations arc yields:

- Antigone Memorial / Saman storyline resolved
- Scaleplate antagonism advanced
- Player rep with Terran + Antigone shifted
- Possible reward ship or equipment unlock
- Story state advance for follow-up content

## Mod conflict risks (Covert Ops-specific)

- ❌ **Mods that change Antigone faction behavior** break Saman dialog
- ❌ **Mods that disable Scaleplate** break antagonist arc
- ❌ **Mods that disable RML_DeployInPlace** break satellite deployment
- ❌ **Mods that change Argon police behavior** affect pursuit mechanic
- ❌ **Mods that change satellite macros** break wrong-satellite detection
- ⚠ **Mods adding mass surveillance content** can confuse EMP breach detection
- ⚠ **Custom faction mods** can disrupt cover-faction interactions

## Code references

| Concern | Cue |
|---|---|
| Saman setup | `Setup_Character_AntigoneOfficial` (v2) |
| Scaleplate Lt setup | `Setup_Character_ScaleplateLieutenant` (v2) |
| Ch0 prerequisite | `Ch0_SecretServiceActor_Prerequisite_Conversation` |
| Ch1 briefing | `Ch1_Covert_Intro_SecretServiceActor_Briefing` |
| Boso bows out | `Ch1_Covert_Intro_BosoBowsOut_Ref` |
| Argon police chase | `Ch1_Argon_Police_*` block |
| Satellite deploy | `Ch1_Deploy_Satellite` (v5) |
| Wrong satellite detect | `Ch1_Wrong_Satellite` |
| Hack + bomb | `HackStation_BombAttacked` |
| EMP surveillance | `HackStation_Surveillance_EMP_Check_For_Further_Breaches` |
| Dal Busta offer | `Dal_Offer_Call` |
| Custom gamestart skip | `Handle_Custom_Gamestart_Skip*` |

## Related

- [Terran arcs overview](/vanilla-content/missions/terran-arcs/)
- [Terran Core](/vanilla-content/missions/terran-arcs/core/) — Restricted Core enforcement (may interact with Covert Ops)
- [HQ Discovery](/vanilla-content/missions/terran-arcs/hq-discovery/) — concurrent Terran arc
- [Yaki arc](/vanilla-content/missions/terran-arcs/yaki/) — parallel Terran content
- [Tides of Avarice: Unbihexium](/vanilla-content/missions/tides-arcs/unbihexium/) — similar espionage gameplay

---

*Covert Operations is X4's "spy thriller" content — hacks, satellites, EMP, bomb-planting, police evasion. Your mod's interference with deployable mechanics, Antigone behavior, or police behavior breaks the entire espionage flow.*

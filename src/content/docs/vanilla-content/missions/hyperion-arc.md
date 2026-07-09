---
title: Hyperion Pack arc
description: 198KB Hyperion Pack DLC story. Cryptid Huntress chases Hyperion sightings across the universe — Paranid pilots, breadcrumb trails, cutscene-heavy reveal. Player acquires the Hyperion ship.
---

The **Hyperion Pack DLC arc** (`story_hyperion.xml`, 198KB) is the **Hyperion ship acquisition story**. A **Cryptid Huntress** character drives the player to chase Hyperion sightings around the universe via a **breadcrumb trail** — culminating in the player claiming the Hyperion ship for themselves.

- **Script**: `story_hyperion.xml`
- **DLC**: Hyperion Pack (`ego_dlc_mini_01`)
- **Text page**: 30254
- **Theme**: Cryptid-chase narrative — pursue Hyperion sightings, follow breadcrumbs, ultimately acquire the ship
- **Factions touched**: faction.civilian, faction.holyorder, faction.paranid, faction.player, faction.trinity, faction.xenon

## Setup

The arc anchors:

| Sector | Role |
|---|---|
| `cluster_31_sector001` | Trigger sector (Heretic's End area — shared with Boron Prelude) |

## Persistent characters

| Character | Macro / role |
|---|---|
| **Cryptid Hunter** (`$CryptidHuntressActor`, macro `character_story_argon_cryptid_hunter_macro`) | Main NPC — drives the chase narrative (variable name says "Huntress" but macro says "hunter" — code is inconsistent) |
| **Ancient Pilot** (`$AncientPilotActor`, v2) | Original Hyperion Paranid pilot — character_story_paranid_hyperion_pilot_macro |
| **Ancient Pilot Clone** (`$AncientPilotCloneActor`, v2) | Clone of the Ancient Pilot (story twist mechanic) |
| **Relief Pilot** (`$ReliefPilotActor`) | Relief pilot NPC |
| **Betty** (`$BettyActor`) | Misc NPC — has explicit `Cleanup_BettyActor` cue |

## Custom game start

The Hyperion Pack DLC ships a dedicated game start:

- **Script**: `gs_hyperion.xml` (7.7KB)
- **Module**: `x4ep1_gamestart_hyperion`
- **Setup**: Player starts WITH the Hyperion ship (`$HyperionOriginalShip = player.ship`)
- **Equipment**: Pre-mods applied via `md.Setup_DLC_Mini_01.Setup.$mods_Hyperion_Original`

In this start, the arc is "in-progress" already — player has the Hyperion from the beginning.

For other game starts: arc triggers via Hyperion Sightings system (chase narrative).

## Arc structure — the Sightings system

The arc uses a **rotating sightings mechanic** — Hyperion is "spotted" across various sectors via cinematic events:

### Mission entry: "Hyperion Sighting"

- **Cue**: `Hyperion_Sighting_Start` (parent of multiple sub-cues)
- **In-game name**: Hyperion spotted — chase the sighting
- **Path/Chapter**: Sightings chain
- **Find in game**: Periodically, when Hyperion sighting triggers fire (`Hyperion_Sighting_Triggers`)
- **Prerequisites**: 
  - DLC installed
  - Setup complete
  - Player in eligible sector (`HyperionTriggerSectors` defines pool)
- **What player encounters**:
  - **Cryptid Huntress ship spawns** (`Create_CryptidHuntressShip`)
  - **Breadcrumbs trail**:
    - `Breadcrumbs_Sighting` — main breadcrumb logic
    - `Breadcrumbs_Sighting_CorrectSector_Check` — verify player in correct sector
    - `BreadCrumbs_Sighting_CorrectSector_Event` — event when player reaches correct sector
  - **Noise cutscene** (mysterious unknown ship engine sound):
    - `Hyperion_Sighting_Noise_Cutscene_Prompt` — prompt for cutscene
    - `Hyperion_Sighting_Noise_Cutscene_Started` — begins
    - `Hyperion_Sighting_Noise_Cutscene_Accepted` — player accepted
    - `Hyperion_Sighting_Noise_Cutscene_Stopped` — ends
  - **Hyperion appearance setting**:
    - `Hyperion_Create_Setting` — setup ship + scene
    - `Hyperion_Force_Speed` (0.9s interval) — force speed during cutscene
    - `Hyperion_Reached_Jump_Gate_Ref` (LIB_Generic.ApproachObject_Handler) — gate approach
    - `Hyperion_Reached_Jump_Gate` — Hyperion at gate (it escapes through)
    - `Hyperion_Stuck_Timeout` — fallback if scene gets stuck
  - **Main sighting cutscene**:
    - `Hyperion_Sighting_Cutscene_Start` → `_Started` / `_Stopped`
  - **End sequence**:
    - `Hyperion_Sighting_End` — sighting ends
    - `Hyperion_Sighting_Catchphrase_End` — final catchphrase
    - `Hyperion_Sighting_CleanUp` — cleanup
- **Where**: Various sectors from `HyperionTriggerSectors` pool
- **NPCs involved**: Cryptid Huntress, mysterious Hyperion pilot
- **Reward**: Sighting progresses chase; clue gathered
- **Chains to**: Next sighting in chain → eventually onboarding (`Ch1_3_Breadcrumbs_Onboarding`)
- **Code reference**: `story_hyperion.xml` `Hyperion_Sightings` block

### Mod conflict risks — Sighting system

- ❌ **Mods that disable `ApproachObject_Handler`** break gate-reach detection
- ❌ **Mods that bulk-change sector content in trigger sectors** affect sighting triggers
- ❌ **Mods that disable cutscene system** break the entire arc
- ⚠ **Mods that respawn-aggressive faction ships** can interrupt the sighting cinematic

---

## Onboarding phase — Ch1_3

### Mission entry: "Cryptid Huntress Onboarding"

- **Cue**: `Ch1_3_Breadcrumbs_Onboarding`
- **In-game name**: First meeting with Cryptid Huntress
- **Path/Chapter**: Hyperion arc (Onboarding)
- **Find in game**: After first sighting collected
- **Prerequisites**: First Hyperion Sighting complete
- **What player encounters**:
  - Cryptid Huntress conversation
    - `Ch1_3_Breadcrumbs_Onboarding_Conv_Start` — start conversation
    - `Ch1_3_Breadcrumbs_Onboarding_Conv_Started` — conversation in progress
  - Cryptid Huntress explains the chase + recruits player
  - Scan-gates final line (`Ch1_3_Hyperion_Scan_Gates_Line_Final`) — instruction to scan gates for Hyperion traces
- **Where**: Conversation location (likely a station)
- **NPCs involved**: Cryptid Huntress
- **Reward**: Onboarding complete; reward path unlocked
- **Chains to**: `Ch2_3_Hyperion_First_Reward`
- **Code reference**: `story_hyperion.xml` `Ch1_3_Breadcrumbs_Onboarding*`

---

## Reward phase — Ch2_3

### Mission entry: "Hyperion First Reward + Claim"

- **Cue**: `Ch2_3_Hyperion_First_Reward` → `Ch2_3_Hyperion_Claim_Reward` (v2) → `Ch2_3_Hyperion_Reward_Claimed`
- **In-game name**: Claim the Hyperion reward
- **Path/Chapter**: Hyperion arc (Reward — climax)
- **Find in game**: After onboarding complete
- **Prerequisites**: Onboarding done; sufficient sightings collected
- **What player encounters**:
  - Cryptid Huntress offers reward (presumably Hyperion ship itself or precursor)
  - Claim mission setup
  - Reward claimed event fires
- **Where**: Cryptid Huntress location
- **NPCs involved**: Cryptid Huntress, Ancient Pilot (revealed)
- **Reward**: **Hyperion ship** (or unlock path to it)
- **Chains to**: `Ch2_3_Hyperion_Reward` (final reward distribution)
- **Code reference**: `story_hyperion.xml` `Ch2_3_Hyperion_*`

### Mod conflict risks — Reward phase

- ❌ **Mods that change the Hyperion ship macro** affect reward content
- ❌ **Mods that block ship-transfer mechanics** break reward delivery
- ⚠ **Mods that pre-spawn Hyperion ship** make the arc redundant

---

## The Ancient Pilot + Clone twist

The arc includes a **clone twist mechanic**:
- Original Ancient Pilot is encountered
- An Ancient Pilot Clone also appears
- The clone is positioned 30-80km from a target gate (vanilla code uses `get_safe_pos` with 30km min, 50km max, then 60km/80km bounds)

The clone is a **story-distinguishing element** — likely revealing that the Hyperion has been operated by multiple pilots (clones over time), explaining its "cryptid" nature (centuries-spanning appearances).

## Game starts hooked

| Game start | Effect |
|---|---|
| `x4ep1_gamestart_hyperion` | Player starts WITH Hyperion ship + pre-applied equipment mods |
| Other starts | Arc triggers normally via Sightings system |

## Code references

| Concern | Cue |
|---|---|
| Setup characters | `Setup_Character_*` block |
| Trigger sectors pool | `HyperionTriggerSectors` (in `Setup_Locations`) |
| Sightings system | `Hyperion_Sightings` block |
| Breadcrumbs detection | `Breadcrumbs_Sighting*` |
| Cutscene noise prompt | `Hyperion_Sighting_Noise_Cutscene*` |
| Hyperion ship behavior | `Hyperion_Create_Setting` + `Hyperion_Force_Speed` |
| Onboarding | `Ch1_3_Breadcrumbs_Onboarding*` |
| Reward acquisition | `Ch2_3_Hyperion_*` |
| Cleanup | `Cleanup_BettyActor`, `Hyperion_Sighting_CleanUp` |
| Game start setup | `gs_hyperion.xml` `Ship_Setup` |

## Related

- [Mission encyclopedia](/vanilla-content/missions/) — landscape
- [Game starts catalog](/vanilla-content/game-starts/) — Hyperion-specific start
- [Wiki: DLC handling](/wiki/dlc-handling/) — Hyperion Pack required

---

*The Hyperion Pack arc is the most cinematic of the smaller DLCs — sighting-driven gameplay with multiple cutscenes per chapter. Your mod's interference with the Cryptid Huntress, cutscene system, or gate-approach detection breaks the entire chase narrative.*

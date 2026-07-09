---
title: Boron Main story
description: The 1.6MB main arc — Kingdom End story. 8 chapters (Ch0-Ch7) from Heretic's End to the Boron Queen. Largest single arc in vanilla X4.
---

The **Boron Main story** is **the largest single arc in vanilla X4** — `story_boron.xml` at **1,588,659 bytes (~1.6MB)**. The arc spans **10 chapters (Ch0-Ch9)** taking the player from a Teladi-mediated entry through the gates, through exploration of Boron home space, to the climactic encounter with the Boron Queen and the post-Queen Khaak assault.

- **Script**: `story_boron.xml`
- **DLC**: Kingdom End
- **Chapters**: Ch0 (gate approach) → Ch1 (exploration) → Ch2 (mediation) → Ch3 (Khaak threat) → Ch4 (asteroid bombs) → Ch5 (regroup + Kingdom End gate) → Ch6 (sub-missions) → Ch7 (Boron Queen) → Ch8 (Khaak Assault + Boron Carrier combat) → Ch9 (late exploration)

## Story characters anchored

The Main story sets up these characters at Setup phase:

- **Alliance Leader (ALI)** — main contact, drives Ch0-Ch5 dialog
- **Nila** — Boron companion NPC, key in Ch2-Ch5
- **LedaWe** — Story-specific Boron, multi-chapter conversations
- **Boron Queen** — Ch7 climax NPC
- **Mission Specialist** — logistics support
- **Boron Herald 1 & 2** — court ceremonial
- **Boron Announcer** — court ceremonial
- **Boron Scientist** — research dialogue
- **Bar Witness** — Ch6 side content
- **Paranid Emissary** — diplomatic
- **Numanckaret** — Ch7 named captain

## Chapter 0 — Initial gate approach

Player encounters the Alliance Leader and learns about Boron return.

### Missions

| Cue | What player encounters |
|---|---|
| `Ch0_ALILeaderConversation` | Initial conversation with Alliance Leader |
| `Ch0_DisplayCutscene` | Cinematic intro |
| `Ch0_Approach_Gate_Ref` (LIB_Generic.ApproachObject_Handler) | Gate approach detection |
| `Ch0_WaitForFullscreen` (3s) | Wait for cinematic-ready state |

**Where**: Watchful Gaze (`cluster_601_sector001`) — sector adjacent to gate

**NPCs**: Alliance Leader (ALI)

**Chains to**: Chapter 1 setup

---

## Chapter 1 — Exploration

The largest setup phase. Player explores Boron space, finds wrecks, encounters Nila.

### Mission entry: "Boron Space Exploration"

- **Cue**: `Ch1_Exploration` (v2) + `Ch1_ExplorationSetup` (v2)
- **In-game name**: Explore Boron home space
- **Path/Chapter**: Boron Ch1 (main)
- **Find in game**: Active after Ch0 conclusion
- **Prerequisites**: Ch0 complete
- **What player encounters**:
  - **Long-Range Scan (LRS) tutorial**:
    - `Ch1_Player_LRS_Hint` — hints player to use LRS
  - **Watchful Gaze proximity check**:
    - `Ch1_PlayerIn_WatchfulGazeCheck` — detect player presence
  - **Multiple gates to approach** (`Ch1_Approaching_Gate_Ref`)
  - **Field of exploration narrowing**:
    - `Ch1_Narrow_FieldOfExploration_Triggers` (10s interval)
    - `Ch1_FurtherNarrowing` (3s) — progressive narrowing as player explores
  - **Initial sector check**: `Ch1_InitialSectorCheck_v2`
  - **Talk to Boso Ta to unlock research**: `Ch1_TalkToBoso_ToUnlockResearch` (5s polling)
  - **Wreck encounter**:
    - `Ch1_Proximitycheck` (2s) — proximity to wreck
    - `Ch1_Wreck_Check_Distance` (1s)
    - `Ch1_Wreck_CheckForSpaceSuit` (1s) — check if player should EVA
    - `Ch1_AbandonedShipComment` — comment when player approaches abandoned ship
  - **Nila proximity** (`Ch1_Nila_InCloseProximity_v2`, 3s) — Nila approaches player
  - **Alliance Leader idle dialogue** (`Ch1_AllianceLeaderIdleLines`) — ambient
  - **Objective guidance**: `Ch1_ResetObjectiveGuidance` — reset on wrong-direction
  - **Move forward with encounter** (`Ch1_MoveForwardWithEncounter`, 5s) — progresses arc
- **Where**: Boron home space — multiple sectors (Watchful Gaze → Barren Shores → Great Reef)
- **NPCs involved**: Alliance Leader (ambient), Nila (proximity), Boso Ta (research)
- **Reward**: Boron territory revealed; Nila companion unlocked; research dialogues with Boso Ta
- **Chains to**: Chapter 2 — Mediation
- **Code reference**: `story_boron.xml` `Ch1_Exploration` block

#### Mod conflict risks

- ❌ **Mods that disable Long-Range Scan** break Ch1 LRS hint
- ❌ **Mods that affect `ApproachObject_Handler`** affect proximity checks
- ❌ **Mods that despawn Nila** lock Chapter 1 from progressing
- ❌ **Mods that block sectors `cluster_601-606`** prevent exploration
- ⚠ **Mods that change spacesuit / EVA mechanics** affect wreck encounter
- ⚠ **Mods that bulk-add ambient dialog** may collide with idle lines

---

## Chapter 2 — Mediation

Player mediates between Alliance leadership and Boron Queen representatives. Heavy NPC conversation chapter.

### Missions in Ch2

| Cue | What it covers |
|---|---|
| `Ch2_DisplayCutscene` | Cinematic intro |
| `Ch2_AdministrationShipSetup` | Spawn admin ship |
| `Ch2_AllianceLeaderConversation` | Alliance dialog |
| `Ch2_LedaWeConversation` | LedaWe dialog |
| `Ch2_NilaConversation` | Nila dialog |
| `Ch2_Conversations` | Multi-character conversation orchestration |
| `Ch2_NilaInitialDockedCheck` | Check Nila is docked |
| `Ch2_NilaSpeakInNewRoom` | Dialogue in new dock room |
| `Ch2_PlayerLeftDock` | Player exit detection |
| `Ch2_NilaGoodbye` | Nila farewell |
| `Ch2_Mediation` | Mediation mechanic |
| `Ch2_CutsceneTrigger` | Cutscene firing |
| `Ch2_Retrieved` | Story progression marker |

**Where**: Multi-sector administration ship + dock

**NPCs**: Alliance Leader, LedaWe, Nila

**Reward**: Mediation outcome; Chapter 3 unlocked

**Chains to**: Chapter 3 — Khaak threat

---

## Chapter 3 — Khaak threat

Khaak incursion into Boron space. Player must defeat them.

### Mission entry: "Khaak Threat Response"

- **Cue**: `Ch3_ActivateKhaak`, `Ch3_CheckForKhaakPresence`, `Ch3_DamageTrigger`
- **In-game name**: Investigate + repel Khaak incursion
- **Path/Chapter**: Boron Ch3 (main)
- **Find in game**: Active after Ch2 mediation
- **Prerequisites**: Ch2 complete
- **What player encounters**:
  - Khaak ships spawn (`Ch3_ActivateKhaak`)
  - Periodic Khaak presence check (`Ch3_CheckForKhaakPresence`)
  - Damage trigger (`Ch3_DamageTrigger`) — if player takes damage, story branches
  - **Scan mode mechanics**:
    - `Ch3_AlreadyInScanMode` — player already scanning
    - `Ch3_ChangedToScanMode` — player switches to scan
    - `Ch3_ChangedFromScanMode` — player exits scan mode
    - `Ch3_ScanModeHint` — hint to switch
  - **Nav beacon drop**: `Ch3_NavBeaconDropped`, `Ch3_DestroyNavBeacon` (objective)
  - **Nila arrival**: `Ch3_NilaArrivedAtTarget`
  - Alliance Leader + LedaWe conversations (`Ch3_AllianceLeaderConversation`, `Ch3_LedaWeConversation`)
- **Where**: Boron sector with Khaak incursion
- **NPCs involved**: Alliance Leader, LedaWe, Nila, Khaak
- **Reward**: Khaak repelled; story progresses
- **Chains to**: Chapter 4
- **Code reference**: `story_boron.xml` `Ch3_*` block

#### Mod conflict risks

- ❌ **Mods that make Khaak non-hostile** break the entire chapter
- ❌ **Mods that disable scan-mode** break scan mode mechanics
- ⚠ **Khaak-rebalance mods** affect difficulty

---

## Chapter 4 — Asteroid bombs

Player handles asteroid-bomb threat. Critical sequence with `Ch4_PlayerPickedUpBombs` and `Ch4_WaresDestroyed`.

### Missions

| Cue | What it covers |
|---|---|
| `Ch4_DisplayCutscene` | Chapter intro cutscene |
| `Ch4_AsteroidDistanceCheck` | Distance from asteroid hazard |
| `Ch4_InShipTest` | Test player in ship |
| `Ch4_PlayerPickedUpBombs` | Player collected bomb items |
| `Ch4_WaresDestroyed` | Bombs destroyed condition |
| `Ch4_AllianceLeaderConversation` | Alliance dialog |
| `Ch4_LedaWeConversation` | LedaWe dialog |
| `Ch4_NilaConversation` | Nila dialog |
| `Ch4_Completed` | Chapter conclusion |

**Where**: Asteroid field sector

**Reward**: Bombs handled; Chapter 5 unlocked

**Chains to**: Chapter 5 — Regroup

---

## Chapter 5 — Regroup + Kingdom End gate

Player regroups with allies and approaches the Kingdom End sector gate.

### Missions

| Cue | What it covers |
|---|---|
| `Ch5_Cutscene` / `Ch5_DisplayCutscene` | Chapter cutscenes |
| `Ch5_Regroup` | Regroup objective |
| `Ch5_PlayerRegrouped` | Regroup completed condition |
| `Ch5_KhaakSpawn` / `Ch5_KhaakAttack` | Mid-chapter Khaak attack |
| `Ch5_InstantiatedGlowActivation` | Activate visual glow effect |
| `Ch5_KingdomEndGateComment` | Commentary about reaching gate |
| `Ch5_AllianceLeaderConversation` | Alliance dialog |
| `Ch5_BoronHeraldConversation` | First Boron Herald appearance |
| `Ch5_LedaWeConversation` | LedaWe dialog |
| `Ch5_WarpALIShip` | Warp ALI ship to next location |
| `Ch5_Completed` | Chapter conclusion |

**Where**: Multi-sector — final regroup → Kingdom End approach

**NPCs**: Alliance Leader, LedaWe, Boron Herald (first appearance)

**Reward**: Kingdom End gate reachable; Chapter 6 unlocked

**Chains to**: Chapter 6 — Sub-missions

---

## Chapter 6 — Sub-missions

Multi-task chapter. Player completes various sub-objectives in Boron court / Kingdom End sectors.

### Missions

| Cue | What it covers |
|---|---|
| `Ch6_DisplayCutscene` | Chapter intro |
| `Ch6_Tasks` | Task orchestration |
| `Ch6_SubMissionFinished` | Sub-mission completion handler |
| `Ch6_Finished` | Chapter conclusion |
| `Ch6_Comms_WrapUp_Boso_Timer` (30s) | Boso Ta wrap-up timer |
| `Ch6_Comms_WrapUp_Nila_Timer` (30s) | Nila wrap-up timer |

**Where**: Multi-sector across Kingdom End I (`cluster_606_sector001`), Reflecting Stars, Towering Wave

**NPCs**: Boso Ta, Nila, court NPCs

**Cleanup**: `Cleanup_Ch6_4_Trigger` (v2) — special cleanup for Ch6 phase 4

**Chains to**: Chapter 7 — Boron Queen

---

## Chapter 7 — The Boron Queen

The climactic chapter. Player meets the Boron Queen. Sanctuary of Darkness culmination.

### Mission entry: "Meet the Boron Queen"

- **Cue**: `Ch7_*` block including `Ch7_Queen_Idle`, `Ch7_Nila_Approach_Ref`, etc.
- **In-game name**: Court audience with the Boron Queen
- **Path/Chapter**: Boron Ch7 (climax)
- **Find in game**: After Ch6 complete + return to court
- **Prerequisites**: Ch6 sub-missions complete
- **What player encounters**:
  - Boron Queen Transport Ship sequence (`Cleanup_Ch7_BoronQueenTransportShip`)
  - Idle NPC presence at court:
    - `Ch7_Idle_Numanckaret` — Numanckaret idle
    - `Ch7_Idle_Herald1`, `Ch7_Idle_Herald2` — Heralds
    - `Ch7_Announcer_Idle` — Announcer
    - `Ch7_Queen_Idle` — Queen idle
    - `Ch7_Idle_Nila` — Nila idle
  - Nila approach (`Ch7_Nila_Approach_Ref`)
  - Final court audience
- **Where**: Sanctuary of Darkness (`cluster_605_sector001`) — Boron court
- **NPCs involved**: Boron Queen, Nila, Numanckaret, Heralds, Announcer
- **Reward**: Story climax; main arc concludes; Epilogue unlocks
- **Chains to**: Epilogue (Kingdom End gate opening)
- **Code reference**: `story_boron.xml` `Ch7_*` block

#### Mod conflict risks

- ❌ **Mods that disable Boron Queen NPC** prevent climax
- ❌ **Mods that change Sanctuary of Darkness sector** break ceremonial location
- ❌ **Mods that fill all NPC slots at the court** starve Queen / Herald / Announcer spawns
- ⚠ **Boron-relation mods** affect court tone

---

## Chapter 8 — Khaak Assault Mission

Post-Queen Khaak threat resolution. Player commands a Boron carrier in major combat operation.

### Missions

| Cue | What it covers |
|---|---|
| `Ch8_BriefingStarted` / `Ch8_BriefingStopped` | Ch8 briefing |
| `Ch8_DisplayCutscene` | Chapter intro |
| `Ch8_AssaultMissionKhaakShips` | Khaak target ships |
| `Ch8_AssaultMissionKhaakSquadList` | Khaak squadron list |
| `Ch8_Carrier_Combat` | Main carrier combat |
| `Ch8_BoronCarrierLoadout` | Boron carrier loadout |
| `Ch8_BoronRespawnFighterLoadout` | Respawn fighter loadout |
| `Ch8_BoronTaxiLoadout` | Boron taxi loadout |
| `Ch8_Automatic_Khaak_Removal_*` | Auto-remove Khaak past distance/hull thresholds |
| `Ch8_AutomaticKhaakRemovalGroup_*` | Group-based Khaak removal |
| `Ch8_Automatic_Repairs` (+ `_Set_Hull`, `_Ship_Landed`) | Auto-repair player carrier |
| `Ch8_Automatic_Respawn_*` | Auto-respawn lost ships |
| `Ch8_Emergency_Taxi` (+ `_Arrived`) | Emergency taxi extraction |
| `Ch8_Cleanup` (+ `_InvulnerableShips_Destroyed`, `_Player_Property_Left_Carrier`) | Chapter cleanup |
| `Ch8_DespawnSectorGate` | Despawn gate when complete |
| `Ch8_DespawnStation_S` / `Ch8_DespawnStation_XL` | Despawn temporary stations |

### What player does

- Receive Ch8 briefing
- Take command of a Boron carrier (with predefined loadouts)
- Conduct large-scale combat operation against Khaak squadrons
- Use auto-repair + auto-respawn systems (heavy auto-help — this is end-game cinematic combat, not balance-tuned)
- Coordinate fighter wings + taxis
- Auto-cleanup at chapter end

### Mod conflict risks — Chapter 8

- ❌ **Mods that change Boron carrier macros / loadouts** break combat configuration
- ❌ **Mods that disable Khaak hostility** make combat trivial
- ❌ **Mods that affect auto-repair / auto-respawn** affect intended pacing
- ⚠ **Mods that fill Boron ship macros otherwise** may collide with loadout assignments

---

## Chapter 9 — Late Exploration

Single-cue chapter (`Ch9_ExploringS`) — final exploration sequence in late-game Boron sectors. Closes the arc.

---

## Cleanup mechanics

The arc has dedicated cleanup cues for graceful arc shutdown:

- `Cleanup_Ch6_4_Trigger` — Ch6 phase 4 cleanup
- `Cleanup_Ch7_Delayed` — delayed Ch7 cleanup
- `Cleanup_Ch7_Interiors` — interior despawn
- `Cleanup_Ch7_NPCs` — NPC despawn (including Boron Queen Transport Ship)

These trigger on arc-complete or save-load if state is mid-Ch7.

## Setup_Rewards

The arc has dedicated `Setup_Rewards` cue ("vars for better overview and easier adjustment") — all reward values are centralized here, making mod rebalances straightforward.

## QueendomLostSpace

The setup includes `Setup_QueendomLostSpace_*` cues for territorial state management — the Boron Queendom has been historically lost; the arc handles re-establishing it via storystate flags.

## Path completion summary

A completed Boron Main story yields:

- Boron home space player-recognized
- Boron Queen acknowledged
- Nila as ally (possibly anchored)
- Boron faction relations boosted significantly
- Kingdom End gate opens (transitions to Epilogue)
- Story state: Boron arc concluded

## Code references

| Concern | Key cues |
|---|---|
| Setup characters | `Setup_Characters` block |
| Reward configuration | `Setup_Rewards` (centralized) |
| Sector references | `Setup_Locations` (v3) |
| Sanctuary of Darkness | `Setup_SanctuaryOfDarkness` (v2) |
| Queen Transport Ship | `Cleanup_Ch7_BoronQueenTransportShip` |
| Cleanup mechanics | `Cleanup_Ch6_4_*` + `Cleanup_Ch7_*` |
| Story state checks | `Start.$Page` (page 30224 or similar for Boron text page) |

## Related

- [Boron arcs overview](/vanilla-content/missions/boron-arcs/)
- [Prelude](/vanilla-content/missions/boron-arcs/prelude/) — preceding arc
- [Epilogue](/vanilla-content/missions/boron-arcs/epilogue/) — following arc
- [Game starts catalog](/vanilla-content/game-starts/) — gs_boron1, gs_boron2

---

*The Boron Main story is X4's most ambitious narrative — 1.6MB of MD code, 8 chapters, 11+ persistent characters. A serious mod compatibility audit requires playing through it at least once with your mod active.*

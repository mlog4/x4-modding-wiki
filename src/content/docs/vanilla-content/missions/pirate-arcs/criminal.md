---
title: Criminal arc
description: The 1.2MB main Pirate arc — Black Market + smuggling + hacking + heists. Maestro, Ace, Axiom, Chipmunk team. Eighteen Billion sector hub. 2+ chapters.
---

The **Criminal arc** (`story_criminal.xml`, **1,155,299 bytes ~1.2MB**) is the **main Pirate DLC narrative**. The player builds a criminal crew — **Maestro** (mentor), **Ace** (heist crew), **Axiom** (hacker), **Chipmunk** (induction) — and runs black market smuggling, station hacks, cargo robberies, and security slicer operations.

- **Script**: `story_criminal.xml`
- **DLC**: Pirate
- **Factions touched**: argon, antigone, paranid, teladi, hatikvah, civilian, scaleplate, scavenger, **loanshark** (antagonist), **ministry** (antagonist), **ownerless**

## Setup sectors

| Variable | Sector macro | Vanilla name |
|---|---|---|
| `$EighteenBillionSector` | `cluster_02_sector001` | Eighteen Billion (criminal hub) |
| | `cluster_08_sector001` | (referenced separately) |
| `$FallbackSector` | `cluster_44_sector001` | Scale Plate Green (fallback location) |

Eighteen Billion is the **central criminal hub** of the arc.

## Persistent characters + player nickname

The player joins the **Empyrean Curs** crew. Members:

| Character | Role | First Chapter |
|---|---|---|
| **Maestro** | Mentor (gives missions, hints, gives player a nickname) | Ch1 |
| **Ace** | Heist crew (Ch2 black market operations) | Ch2 |
| **Axiom** | Hacking specialist (Ch2 security slicer) | Ch2 |
| **Boso Ta** | Cross-arc commentary | Ch1 (`Ch1_BosoCarefulComment`) |
| **Dal Busta** | Cross-arc oversight | Ch1 (`Ch1_DalMissionComment_Ref`) |

**Player nickname**: Maestro names the player **"the Chipmunk"** during Ch2 induction conversation (text line 30252205): "*You competent smuggler; Shall call you 'the Chipmunk'!*". So `Ch2_ChipmunkInduction_Ref` is the **player-induction** cue, not a separate NPC. The crew operates under "no names" policy — Chipmunk is the player's pirate alias.

The Empyrean Curs setup is also referenced in dialog: *"Return to Arcadian Endeavour to get to know other members of crew"* — base of operations is **Arcadian Endeavour**.

---

## Chapter 1 — Introduction + First Heist

Player meets Maestro, conducts first smuggling mission. Police detection mechanics introduced.

### Mission entry: "Maestro Introduction"

- **Cue**: `Ch1_Intro` → `Ch1_MaestroIntroductionComplete`
- **In-game name**: Meet Maestro (introductory)
- **Path/Chapter**: Criminal Ch1
- **Find in game**: Active after Pirate arc state initialized
- **Prerequisites**: Pirate Prelude complete OR custom story state set
- **What player encounters**:
  - Player travels to Eighteen Billion (cluster_02_sector001)
  - Meets Maestro at a station
  - `Ch1_PreMission_Conversation` — initial conversation
  - `Ch1_Maestro_UninterestedConversation` — Maestro tests player (uninterested response path)
  - `Ch1_MaestroTradeHint_Ref` — trade hint dialog
  - `Ch1_MaestroWarning_Ref` — Maestro warns player about risks
  - `Ch1_MaestroDroppedWareComment_Ref` — comment when player drops ware
  - `Ch1_BosoCarefulComment` — Boso Ta cross-arc commentary
  - `Ch1_MissionBosoComment` / `Ch1_DeclineBosoComment` — outcome variations
- **Where**: Eighteen Billion sector
- **NPCs involved**: Maestro, Boso Ta (remote)
- **Reward**: Introduction complete; first mission offered
- **Chains to**: `Ch1_Create_MissionOffer` → `Ch1_OfferCreated`
- **Code reference**: `story_criminal.xml` `Ch1_Intro` block

### Mission entry: "First Smuggling Mission"

- **Cue**: `Ch1_Create_MissionOffer` → `Ch1_MissionAccepted_Ref`
- **In-game name**: First illegal-ware delivery
- **Path/Chapter**: Criminal Ch1 (main)
- **Find in game**: Active after Maestro intro accepted
- **Prerequisites**: Maestro intro accepted
- **What player encounters**:
  - Pre-mission setup includes **illegal wares added to player ship** (`Ch1_PreMission_AddIllegalWares_DEBUG` for testing; real path through `Ch1_PreMission_Conversation`)
  - Player must deliver illegal wares without police detection
  - Hint system: `Ch1_MissionOffer_Hint`, `Ch1_MissionOfferHint_Ref`
  - Cross-character comments: `Ch1_DalMissionComment_Ref`, `Ch1_BosoMissionComment_Ref`
  - **Police encounter mechanics**:
    - `Ch1_Police_Halt` — police order to halt
    - `Ch1_Police_IllegalWareFound` — police find illegal wares
    - `Ch1_Police_PlayerFlee` — player flees pursuit
  - Mission tracking: `Ch1_Entering_S*` cues track player progress
  - Trade hint when docked: `Ch1_Docked_Trade_HintClosed`
- **Objectives**:
  - Travel to delivery destination
  - Avoid police scans en route
  - Deliver wares without detection
- **Where**: Eighteen Billion → delivery target (varies)
- **NPCs involved**: Maestro (handler), police patrols (hostile)
- **Reward**: Credits + Maestro relation + arc progression
- **Chains to**: `Ch1_Reward` → `Ch1_Complete` → Chapter 2
- **Code reference**: `story_criminal.xml` `Ch1_Create_MissionOffer` block

#### Mod conflict risks — Chapter 1

- ❌ **Mods that disable police-scan mechanics** trivialize the smuggling missions
- ❌ **Mods that change illegal-ware definitions** break ware-detection logic
- ❌ **Mods that change Maestro NPC** break the entire arc
- ❌ **Mods that change `cluster_02_sector001` ownership** make Maestro unreachable
- ⚠ **Mods adding bulk illegal-ware sources** trivialize ware-acquisition step
- ⚠ **Police-rebalance mods** affect difficulty calibration

---

## Chapter 2 — Criminal Crew + Heists

Player builds the criminal crew (Ace, Axiom, Chipmunk) and conducts multiple specialized operations.

### Mission entries (selected)

| Cue | Player action |
|---|---|
| `Ch2_Force` | Force-start Chapter 2 |
| `Ch2_InitialAceConversation` | Meet Ace |
| `Ch2_InitialAxiomConversation` | Meet Axiom |
| `Ch2_ChipmunkInduction_Ref` | Player induction (Maestro names player "the Chipmunk") |
| `Ch2_Missions_SetUp` + `Ch2_Missions` | Mission orchestrator |
| `Ch2_MaestroConversation_Tasks` | Maestro task dispenser |

### Sub-mission: Black Market hub

| Cue | Action |
|---|---|
| `Ch2_BlackMarket` | Black market entry |
| `Ch2_BlackMarketStation` | Black market station setup |
| `Ch2_AtBlackMarketStation_Ref` | Verify player at black market |
| `Ch2_AtBlackMarketStation_ScanModeHint` | Hint scan-mode usage |
| `Ch2_BlackMarketFinished_Ref` | Conclude black market |
| `Ch2_ExcludedStations` | Track stations excluded from BM |

### Sub-mission: Ace operation

| Cue | Action |
|---|---|
| `Ch2_AcePlaced` | Ace placed in mission |
| `Ch2_AceOrders_v` | Ace order setup |
| `Ch2_AceFactoryHint_Ref` | Hint about factory |
| `Ch2_AceHeadsUp_Ref_v` | Heads-up dialog |
| `Ch2_AceUndocked` | Ace undocked |
| `Ch2_AceRetrieved` + `_Check` | Ace retrieved |

### Sub-mission: Axiom hacking

| Cue | Action |
|---|---|
| `Ch2_AxiomHacking` | Hacking sequence |
| `Ch2_Axiom_InSecurityRoom_Ref` | Axiom in security room |
| `Ch2_Axiom_WrongPanel_Ref` | Wrong panel — error path |
| `Ch2_HackStation` | Hack station target |
| `Ch2_DEBUG_SecuritySlicer` | DEBUG: security slicer test |

### Sub-mission: Cargo Robbery

| Cue | Action |
|---|---|
| `Ch2_CargoRobbery` | Cargo robbery main |
| `Ch2_CargoRobberyFinished_Ref_v` | Robbery finished |
| `Ch2_AttackLines` | Attack lines (dialog during attack) |
| `Ch2_DeliveryHint_Ref` | Hint for delivery |

### DEBUG sub-missions (testing)

Vanilla provides DEBUG cues for testing mission components:
- `Ch2_DEBUG_Acquire_ApparatusMaterials`
- `Ch2_DEBUG_Acquire_HackingMaterials`
- `Ch2_DEBUG_Acquire_Unstable_Crystals`
- `Ch2_DEBUG_SecuritySlicer`

These let testers bypass acquisition steps. Mods should NOT depend on these — they're debug only.

#### Mod conflict risks — Chapter 2

- ❌ **Mods that disable Ace / Axiom / Chipmunk NPCs** break Chapter 2
- ❌ **Mods that disable hacking mechanics** break Axiom path
- ❌ **Mods that change scan-mode mechanics** affect Black Market verification
- ❌ **Mods that change black-market station definitions** break BM hub
- ⚠ **Cargo-robbery overhaul mods** affect Ace + Axiom path

---

## Sub-arc patterns

The Criminal arc uses several reusable patterns:

- **DEBUG cues** for testing — every major mission has a DEBUG bypass
- **Hint refs** (`*_Hint_Ref`) — extensive hint dialog system
- **Cross-character comments** — Boso Ta + Dal Busta react to player actions
- **Police evasion** — multi-cue police-control system

## Setup considerations

The arc requires Eighteen Billion sector accessible. If player's mod has changed ownership of `cluster_02_sector001`, the arc uses `$FallbackSector = cluster_44_sector001` (Scale Plate Green) — but fallback is incomplete coverage.

## Code references

| Concern | Cue |
|---|---|
| Setup sector | `Start.Setup` — `$EighteenBillionSector` |
| Fallback sector | `$FallbackSector` (cluster_44_sector001) |
| Maestro character | Setup_Characters references |
| Ace operation | `Ch2_Ace*` block |
| Axiom hacking | `Ch2_Axiom*` + `Ch2_AxiomHacking` |
| Black Market hub | `Ch2_BlackMarket*` block |
| Cargo robbery | `Ch2_CargoRobbery*` |
| Police mechanics | `Ch1_Police_*` block |

## Related

- [Pirate arcs overview](/vanilla-content/missions/pirate-arcs/)
- [Pirate Prelude](/vanilla-content/missions/pirate-arcs/prelude/) — preceding arc
- [The Fan arc](/vanilla-content/missions/pirate-arcs/thefan/) — parallel Pirate arc
- [Wiki: DLC handling](/wiki/dlc-handling/) — Pirate DLC required

---

*The Criminal arc is X4's most elaborate "criminal underworld" narrative. Black market hub, security slicing, cargo robberies, Police evasion mechanics — your mod's interference with any of these breaks a 1.2MB story chain.*

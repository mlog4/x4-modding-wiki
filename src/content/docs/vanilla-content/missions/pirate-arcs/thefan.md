---
title: The Fan arc
description: 1MB Pirate arc with Boso Ta + The Fan + Twin Encounter. Loanshark harassment, scrapyard robbery, trading office, Protectyon delivery. 6+ chapters.
---

The **The Fan arc** (`story_thefan.xml`, **1,051,956 bytes ~1MB**) is the **second-largest Pirate arc** — focused on a character named **The Fan** and the **Loanshark faction antagonism**. The arc covers harassment encounters, scrapyard heists, trading-office setup, and **Protectyon delivery research** (key item for end-game gameplay).

- **Script**: `story_thefan.xml`
- **DLC**: Pirate
- **Factions touched**: argon, civilian, criminal, hatikvah, **loanshark** (antagonist), buccaneers, scaleplate, scavenger, ownerless

## Trigger structure

The arc starts with a **Twin Encounter** event (Ch0).

## Chapter 0 — Twin Encounter

The Twins are **two related sub-arcs** tracked via gamestart story state:
- `gamestart.storystate.story_twin_northriver` — Northriver Twin variant
- `gamestart.storystate.story_twin_rival` — Rival Twin variant

Each variant can be pre-set via custom game start. Both encode different relationships with the Twins.

### Mission entry: "Twin Encounter"

- **Cue**: `Ch0_TwinEncounter` + `Ch0_TwinEncounter_Check` + `Ch0_TwinEncounterFinished`
- **In-game name**: Meet the Twins (mystery NPCs)
- **Path/Chapter**: The Fan Ch0
- **Find in game**: Active when Pirate DLC state ready + sequence triggers
- **Prerequisites**: Pirate DLC initialized
- **What player encounters**:
  - "Twin Encounter" event — player encounters mysterious twin NPCs
  - Variant determined by `story_twin_northriver` vs `story_twin_rival` flags
  - Boso Ta provides commentary:
    - `Ch0_BosoComment_Ref` — Boso commentary reference
    - `Ch0_BosoCommentary_Signal` — signal to start commentary
    - `Ch0_BosoCommentary_Start` — commentary starts
    - `Ch0_BosoEncounter_SequenceCheck` — check sequence integrity
- **Where**: Specific Pirate-arc trigger sectors
- **NPCs involved**: The Twins (mystery NPCs — variant by storystate), Boso Ta (remote commentary)
- **Reward**: Arc unlocked
- **Chains to**: Chapter 1
- **Code reference**: `story_thefan.xml` `Ch0_TwinEncounter*` + `Start` storystate setup

---

## Chapter 1 — Harassment + Escort

Player encounters Loanshark harassment of innocents. Player intervenes (combat + escort).

### Mission entries

| Cue | What it covers |
|---|---|
| `Ch1_Force` | Force-start Chapter 1 |
| `Ch1_Intro` | Chapter intro dialog |
| `Ch1_MissionAccepted` | Mission accepted |
| `Ch1_Create_Harassers` | Spawn Loanshark harassers |
| `Ch1_Create_Scavenger` | Spawn scavenger NPC (victim) |
| `Ch1_LoanSharkAttackers` | Loanshark attacker setup |
| `Ch1_LoanSharkCommanders` | Loanshark commander setup |
| `Ch1_PlayerApproachesFight` (+ `_Complete`, `_Ref`) | Player approach detection |
| `Ch1_Harassement_Approach_Complete` | Approach complete |
| `Ch1_Harassement_CounterAttack` | Loanshark counterattack on player |
| `Ch1_Harassement_PlayerAttackedLoanSharks` | Player engaged Loansharks |
| `Ch1_Harassement_RelationDrop` | Relation drop with Loansharks |
| `Ch1_Harrassement_Defeated_Enemy` | Defeat condition |
| `Ch1_Auto_Repair` | Auto-repair friendly ship |
| `Ch1_EscortCompleted` | Escort objective complete |
| `Ch1_Msg_DistanceToGate` / `_DistanceToPlayer` | Distance messaging |
| `Ch1_MsgCue` | Message orchestration |

### What player does

- Approach a Loanshark harassment scene
- Defend victim (scavenger)
- Defeat Loanshark attackers (`Ch1_LoanSharkAttackers` + `Ch1_LoanSharkCommanders`)
- Auto-repair friendly ship (`Ch1_Auto_Repair`)
- Escort victim to safety (`Ch1_EscortCompleted`)

### NPCs involved

- Loanshark attackers + commanders (hostile)
- Scavenger victim (escort target)
- The Fan (recipient of victim — implied)

### Reward

- Loanshark relation drops
- Scavenger/Hatikvah relation boosts
- Chapter 2 unlocked

#### Mod conflict risks — Chapter 1

- ❌ **Mods that disable Loanshark faction** break the entire chapter
- ❌ **Mods that change auto-repair mechanics** break friendly ship recovery
- ⚠ **Combat mods affecting Loanshark behavior** affect difficulty

---

## Chapter 2 — The Fan + Wave Encounter

Player meets The Fan, encounters a "Wave" (mass attack), gets convinced of arc premise.

### Mission entries

| Cue | What it covers |
|---|---|
| `Ch2_Force` | Force-start Chapter 2 |
| `Ch2_Setup` (+ `_Mission`) | Chapter setup |
| `Ch2_Setup_TheFanShip` (+ `_ExpectingWave`) | The Fan's ship setup |
| `Ch2_Setup_TheWave` | "Wave" attack setup |
| `Ch2_Setup_Wave_Cutscene` | Wave cinematic |
| `Ch2_Distress_Cutscene` | Distress signal cutscene |
| `Ch2_TheFan` | Meet The Fan |
| `Ch2_Conv_TheFan` (+ `_Convince`, `_Convince_Attempt`, `_Started`, `_Template`) | Conversation with The Fan |
| `Ch2_Speak_Fan_Help_Ref` | The Fan asks for help |
| `Ch2_Spacesuit` | Spacesuit EVA section |
| `Ch2_MissionAccepted` | Mission accepted |
| `Ch2_Complete` | Chapter complete |

### What player does

- Travel to distress signal location
- Encounter The Fan's ship (under attack from "Wave")
- Witness Wave cutscene
- EVA to The Fan (spacesuit segment)
- Convince The Fan via conversation
- Accept arc mission

### NPCs involved

- The Fan
- Wave attackers (Loansharks / criminal forces)

#### Mod conflict risks — Chapter 2

- ❌ **Mods that disable spacesuit EVA** break The Fan encounter
- ❌ **Mods that interfere with cutscene systems** affect Wave + Distress cutscenes
- ⚠ **Mods that change The Fan's ship macro** affect setup

---

## Chapter 3 — Scrapyard Robbery

Player conducts a scrapyard robbery (cargo heist).

### Mission entries

| Cue | What it covers |
|---|---|
| `Ch3_Force` | Force-start Chapter 3 |
| `Ch3_Setup` (+ `_Mission`) | Setup |
| `Ch3_EnteredScrapyard` | Player enters scrapyard |
| `Ch3_Scrapyard_Robbery` | Main robbery mission |
| `Ch3_ScrapyardTaxi_Arrived` / `_MoveDie` | Taxi NPC handling |
| `Ch3_StationDestroyed_v` | If station destroyed (variant) |
| `Ch3_Handling` | Mission handling orchestration |
| `Ch3_Conv_TheFanTemplate` | The Fan conversation |
| `Ch3_Complete` | Chapter complete |

### What player does

- Enter scrapyard
- Conduct robbery (steal cargo)
- Manage taxi NPC (drop-off or kill)
- Escape

### Mod conflict risks — Chapter 3

- ❌ **Mods that change scrapyard mechanics** affect robbery
- ❌ **Mods that affect station-destruction events** affect failure path

---

## Chapter 4 — Trading Office

Player establishes/operates a trading office.

### Mission entries

| Cue | What it covers |
|---|---|
| `Ch4_Force` | Force-start |
| `Ch4_X_Setup_Office` | Setup office |
| `Ch4_Trading` | Trading operations |
| `Ch4_Complete` | Complete |
| `Ch4_Fe` | (specific named cue) |
| `Ch4_OLD` | Deprecated path (legacy code) |

### What player does

- Set up Office location
- Conduct trading operations
- Build commercial network

---

## Chapter 5 — Manager + Wave Reactions

Player interacts with a Manager NPC; Wave events resume.

### Mission entries

| Cue | What it covers |
|---|---|
| `Ch5_Force` | Force-start |
| `Ch5_Briefing` (+ `_Done`) | Chapter 5 briefing |
| `Ch5_X_Office` | Office state |
| `Ch5_Ma` | Manager cue |
| `Ch5_Convo_Manager_Mumbling` | Manager mumbling dialog |
| `Ch5_ManagerToWindow` / `_TooLate` | Manager position management |
| `Ch5_Reaction_Manager_Wave` / `_WaveEvent` | Manager reacts to Wave |
| `Ch5_Setup_Conversation_Reactions` | Setup reaction conversations |
| `Ch5_StopWavePhases` | Stop Wave phases |
| `Ch5_Transition_VoyageHandler` | Voyage transition handler |
| `Ch5_TransitionAbortCondition` | Voyage transition abort |
| `Ch5_FanShipTransition_Patch` | Save patch for transition |
| `Ch5_FinalTransitionDone` | Final transition done |
| `Ch5_Shortage` | Shortage event |
| `Ch5_Cleanup` | Chapter cleanup |
| `Ch5_Complete` | Chapter complete |

### Save-migration patch

`Ch5_FanShipTransition_Patch` — fixes broken Fan ship transition state for in-progress saves. Your mod modifying The Fan's ship must respect this patch.

---

## Chapter 6 — Protectyon Acquisition

Player acquires **Protectyon** (key Pirate-DLC item) and delivers to specific recipients. Boso Ta research connection.

### Mission entries

| Cue | What it covers |
|---|---|
| `Ch6_AcquireProtectyon` | Main acquisition mission |
| `Ch6_BosoConversation` (+ `_Delivered`) | Boso Ta conversations |
| `Ch6_BosoHelpOffer_Ref` | Boso offers help |
| `Ch6_BosoLines` | Boso dialog lines |
| `Ch6_CallToResearch_Ref` | Call to research |
| `Ch6_ChangedIntoLRSMode` | Long-Range Scan mode change |
| `Ch6_CheatedResearch_Skip` | DEBUG: skip research path |
| `Ch6_CommentOnTwins` | Comment on Twins (callback to Ch0) |
| `Ch6_Container_Cutscene` | Container handling cutscene |
| `Ch6_CreateMission` | Create mission |
| `Ch6_Deliver_Protectyon` | Deliver Protectyon |
| `Ch6_EngineMod_ProductionAborted` | Engine mod production aborted |
| `Ch6_Complete` | Chapter complete |

### What player does

- Investigate Twins encounter clues
- Acquire Protectyon via:
  - Research (Boso Ta)
  - Production (engine mod chain)
  - Cutscene container reveal
- Deliver Protectyon to recipients

### NPCs involved

- Boso Ta (research support)
- The Fan (recipient or coordinator)

### Key item: Protectyon

Protectyon is a Pirate-DLC-specific ware required for end-game Pirate content. The Fan arc Ch6 is the **canonical Protectyon-unlock path**. Your mod adding alternative Protectyon sources must coordinate with this.

#### Mod conflict risks — Chapter 6

- ❌ **Mods that change Protectyon ware definition** break the arc conclusion
- ❌ **Mods that change Long-Range Scan mode** affect mode-change detection
- ❌ **Mods that add bulk research bypasses** trivialize the arc

---

## Path completion summary

A completed The Fan arc yields:

- Loanshark faction relations significantly worsened
- Protectyon unlocked (research + production chain)
- The Fan as character ally
- Trading office operational
- Multiple Pirate-DLC mechanics accessible

## Code references

| Concern | Key cue |
|---|---|
| Twin Encounter | `Ch0_TwinEncounter*` |
| Loanshark harassment | `Ch1_Harassement_*` |
| The Fan setup | `Ch2_Setup_TheFanShip` |
| Wave attack | `Ch2_Setup_Wave_Cutscene` |
| Scrapyard robbery | `Ch3_Scrapyard_Robbery` |
| Trading office | `Ch4_X_Setup_Office` |
| Manager + Wave reactions | `Ch5_Reaction_Manager_Wave*` |
| Protectyon delivery | `Ch6_Deliver_Protectyon` |
| Save patches | `Ch5_FanShipTransition_Patch` |

## Related

- [Pirate arcs overview](/vanilla-content/missions/pirate-arcs/)
- [Pirate Prelude](/vanilla-content/missions/pirate-arcs/prelude/) — preceding
- [Criminal arc](/vanilla-content/missions/pirate-arcs/criminal/) — parallel arc
- [Erlking research](/vanilla-content/missions/pirate-arcs/erlking/) — concurrent research
- [Welfare 2 research](/vanilla-content/missions/pirate-arcs/welfare-2/) — concurrent research

---

*The Fan arc is the Pirate DLC's emotional core — a relationship arc with The Fan as protagonist NPC, threaded through 6 chapters. Protectyon delivery is the chapter-6 payoff that unlocks late-game Pirate content. Your mod must respect Protectyon mechanics and The Fan's ship lifecycle.*

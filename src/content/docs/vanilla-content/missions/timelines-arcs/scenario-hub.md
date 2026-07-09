---
title: Scenario Hub
description: The 1.25MB Timelines orchestrator. Game start + scenario selection UI + Hub NPCs + cutscene infrastructure. The framework around which all 20+ scenarios run.
---

The **Scenario Hub** (`scenario_hub.xml`, **1,251,276 bytes ~1.25MB**) is the **central orchestrator** for the entire Timelines DLC. It serves three roles simultaneously:

1. **Game start** — `x4ep1_gamestart_hub` (player begins at Hub)
2. **Scenario selection UI** — `ScenarioSelectionMenu` for picking which scenario to play
3. **Hub NPC infrastructure** — Background actors, scenes, cutscene system

- **Script**: `scenario_hub.xml`
- **DLC**: Timelines
- **Text page**: 30293
- **MDScript module**: `x4ep1_gamestart_hub`

## Mission entry: "Hub Game Start"

### Cue: `Start` (module `x4ep1_gamestart_hub`)

- **In-game name**: Begin at Scenario Hub (player chooses a Timelines scenario)
- **Find in game**: Start a new game with the Hub gamestart selected
- **Prerequisites**: Timelines DLC installed
- **What player encounters**:
  - Player spawned at the Hub location
  - **Reposition_Player** (deprecated — comment in vanilla says "Deprecated") — old player positioning system
  - Modern player spawn via `Player_Spawn_At_Location` library — supports `$PlayerSpawnForceLocation` for scene-forced spawn locations
  - Hub greeting from background actors
- **Where**: Scenario Hub station (specific Timelines DLC location)
- **NPCs involved**: Background actors (multiple, greet player)
- **Reward**: Hub access; scenario selection UI available
- **Chains to**: `Scenario_Console_Interacted` → individual scenarios
- **Code reference**: `scenario_hub.xml` `Start`

### Mod conflict risks — Hub Game Start

- ❌ **Custom-gamestart mods that override `x4ep1_gamestart_hub`** break Timelines entry
- ❌ **Mods that disable the Hub station macro** prevent player spawn
- ⚠ **Mods that override `Player_Spawn_At_Location` library** affect scenario re-entry

---

## Mission entry: "Scenario Selection"

### Cue: `Scenario_Console_Interacted` (instantiated)

- **In-game name**: Choose a scenario via Hub console
- **Path/Chapter**: Hub (selection)
- **Find in game**: Player interacts with a Hub console
- **Prerequisites**: At Hub
- **What player encounters**:
  - **Trigger event**: `event_ui_triggered screen="'ScenarioSelectionMenu'"`
  - UI presents scenario list
  - Player picks scenario → exit Hub into scenario context
  - Or chooses `menu_close` → return to Hub
- **Where**: Hub console
- **Reward**: Enters selected scenario
- **Chains to**: Selected scenario's `Start` cue
- **Code reference**: `scenario_hub.xml` `Scenario_Console_Interacted`

### Mod conflict risks — Scenario Selection

- ❌ **UI mods that override `ScenarioSelectionMenu` screen** break selection
- ❌ **Mods that disable `event_ui_triggered`** break interaction detection

---

## Hub support systems

### Reward Notifications

```
Reward_Notifications (namespace=this)
```

Handles reward delivery to player after scenario completion. Posts notifications to UI.

### Tutorial reminder hints

```
Tutorial_Reminder_Hint (onfail=cancel)
Open_Universe_Reminder_Hint (onfail=cancel)
```

Periodic reminders if player seems lost — hints about tutorials or open-universe gameplay.

### Hub actor management

| Cue | Purpose |
|---|---|
| `RemoveHubActors_DEBUG` (ref RemoveHubActors) | Debug: remove all Hub actors for testing |
| `ResetHubActors_DEBUG` (ref ResetHubActors) | Debug: reset Hub actors |
| `ResetHubActorsRef` (ref ResetHubActors) | Runtime reset (post-scenario) |
| `PlaceAllActors` (onfail=cancel) | Place all Hub actors |
| `Follow_Behaviour_Update` (instanced, 2s) | Update follow-behavior for companion NPCs |
| `BackgroundActors_Greeting` (instanced) | NPCs greet player |

### Scenes orchestrator

```
Scenes (comment="resetable for debugging")
├── SceneActivator (instanced)
│   ├── SceneActivator_CharactersTransitCheck (0.1s polling, 0.5s checktime, instanced)
│   ├── ScenePlacementRunnin_GenericHello (instanced)
│   └── SceneActivator_Warning_ActorNotSpawned (one-time warning)
└── Scene_Manager_Helpers (collapsible VS group)
    ├── IntroCutscene_Dialogue_Abort (instanced)
    ├── SohnenCutscene_Sequence_ShotChange (instanced)
    └── ResetHubActorsRef (ref ResetHubActors)
```

The `Scenes` block orchestrates **dialogue cutscenes** with the Sohnen and Intro cutscene variants. Cutscenes have abort, shot-change, end, and finished sub-cues.

### Crate mechanic

```
Crate_Opened (instanced)
```

When player opens a crate at the Hub, triggers reward delivery.

### Story completed cutscene

```
StoryCompleted_CreditsCutscene
StoryCompleted_CutsceneEnded
```

After player completes all Timelines content, a credits cutscene plays.

### Debug NPC

```
Scenario_Debug_NPC (onfail=cancel)
├── Scenario_Debug_NPC_Conv_Started (instanced)
├── Scenario_Debug_NPC_Menu_Story_Scenes (instanced)
└── Scenario_Debug_NPC_Set_Scene_Uncomplete_Act_Choice (instanced)
```

A debug NPC at the Hub allows developers to test individual scenes / set scenes as incomplete. **Modders should NOT depend on this NPC**.

---

## Player spawn library

```
library name="Player_Spawn_At_Location" purpose="include_actions"
```

The library spawns the player at:
- `$PlayerSpawnForceLocation` (if a scenario forced a specific location)
- Default Hub position otherwise

Modders adding scenarios should respect this library — setting `$PlayerSpawnForceLocation` before entering the scenario.

## Cutscene infrastructure

The Hub provides shared cutscene infrastructure for all Timelines scenarios:

- **Intro Cutscene** with `IntroCutscene_Dialogue_Abort`
- **Sohnen Cutscene** with `SohnenCutscene_Dialogue_Abort` / `_EndCutscene` / `_Finished` / `_Sequence_ShotChange`

The **Sohnen** is a recurring Timelines NPC / cutscene actor. Scenarios reference Sohnen cutscenes for narrative continuity.

## Mod conflict risks (Hub-wide)

- ❌ **Mods that override the Hub station macro** break everything
- ❌ **Mods that change Sohnen actor / cutscene system** break narrative continuity
- ❌ **Mods that disable `event_ui_triggered`** break scenario selection
- ❌ **Mods that change `Player_Spawn_At_Location` library** affect scenario re-entry
- ❌ **Mods that disable cutscene system** break intros + endings
- ⚠ **Mods adding bulk NPCs at Hub** can collide with BackgroundActors greeting
- ⚠ **Tutorial-mods** can collide with `Tutorial_Reminder_Hint`

## Code references

| Concern | Cue |
|---|---|
| Game start | `Start` (module `x4ep1_gamestart_hub`) |
| Player spawn library | `Player_Spawn_At_Location` |
| Scenario selection | `Scenario_Console_Interacted` (instanced) |
| UI screen trigger | `event_ui_triggered screen='ScenarioSelectionMenu'` |
| Reward delivery | `Reward_Notifications` |
| Background NPCs | `BackgroundActors_Greeting` (instanced) |
| Follow behavior | `Follow_Behaviour_Update` (2s, instanced) |
| Cutscene system | `IntroCutscene_*`, `SohnenCutscene_*` |
| Crate reward | `Crate_Opened` (instanced) |
| Story completion | `StoryCompleted_CreditsCutscene` + `_CutsceneEnded` |
| Debug NPC | `Scenario_Debug_NPC` block |
| Tutorial reminder | `Tutorial_Reminder_Hint` |

## Related

- [Timelines arcs overview](/vanilla-content/missions/timelines-arcs/)
- [Scenarios catalog](/vanilla-content/missions/timelines-arcs/scenarios-catalog/) — all 20+ scenarios
- [Boss + epic scenarios](/vanilla-content/missions/timelines-arcs/boss-scenarios/) — boss battles and epic set-pieces
- [Research + Epilogue](/vanilla-content/missions/timelines-arcs/research-epilogue/) — abandoned ships + epilogue
- [Game starts catalog](/vanilla-content/game-starts/) — Hub gamestart

---

*The Scenario Hub is the architectural heart of Timelines — without it, no scenario can be entered. Mods that break the Hub silently break the entire DLC.*

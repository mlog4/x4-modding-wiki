---
title: Tutorial missions
description: Player-onboarding missions in tutorial_*.xml. 19 vanilla tutorials covering flight, mining, station building, boarding, deploy, crew, etc.
---

A **Tutorial mission** teaches a single gameplay mechanic via a guided sequence. Unlike Generic missions (which are repeatable BBS missions), tutorials are **one-time** per save and **NPC-conversation-driven** rather than offer-board-driven.

Vanilla has **19 tutorial scripts** in `md/`.

## Vanilla tutorial scripts

| File | Teaches |
|---|---|
| `tutorial_boarding.xml` | Boarding mechanics |
| `tutorial_captureship.xml` | Capture-after-bail flow |
| `tutorial_crew.xml` | Crew hiring + management |
| `tutorial_deploy.xml` | Deployable objects (satellites/mines) |
| `tutorial_flight.xml` | Basic flight controls |
| `tutorial_global.xml` | Tutorial registry / cross-tutorial state |
| `tutorial_inputdev.xml` | Input device feedback (controller / hotkeys) |
| `tutorial_map.xml` | Map basics |
| `tutorial_map_advanced.xml` | Map advanced features |
| `tutorial_map_missions.xml` | Mission management via map |
| `tutorial_map_trading.xml` | Trade via map UI |
| `tutorial_mining.xml` | Mining + auto-mine orders |
| `tutorial_modes.xml` | Game modes (combat/scan/etc.) |
| `tutorial_platform.xml` | Platform tutorial (?) |
| `tutorial_resupply.xml` | Ship resupply |
| `tutorial_spacesuit.xml` | Spacesuit EVA |
| `tutorial_stations_building.xml` | Station building |
| `tutorial_stations_operations.xml` | Station operations management |
| `tutorial_stations_shipyard.xml` | Shipyard operations |

## Anatomy of a tutorial script

Tutorial scripts share this structure:

```
Start
├── PlayerDied (reset if player dies during tutorial)
├── Trigger (checkinterval=5s — waiting for tutorial-relevant context)
│   └── Offer
│       └── ConversationStarted (instanced per conversation)
│           ├── ConversationNextSection (instanced per section advance)
│           ├── ConversationFinished
│           └── AcceptMission
└── Tutorial (the actual lesson cue)
    └── Abort (cleanup if player skips)
```

The pattern:

1. **Trigger**: Watches for context — e.g. `tutorial_mining` activates when player owns a mining ship
2. **Offer**: Surfaces as a conversation option with a relevant NPC
3. **AcceptMission**: Player engages → mission becomes active
4. **Tutorial**: Step-by-step lesson, often with on-screen prompts via `signal_cue md.HUD.ShowGuidance`
5. **Abort**: Optional — player can skip tutorial

## Difference from other mission categories

| | Generic | Story | Subscription | Tutorial |
|---|---|---|---|---|
| Offer source | BBS / signal leak / NPC | NPC / sector visit | Contact NPC | Conversation w/ NPC |
| Trigger | Probabilistic | Story progression | Subscription state | Player capability |
| Reward | Credits / items | Story advancement | Credits + tier | Knowledge (no in-game reward) |
| Repeatable | Yes (different instance) | No | Yes (different missions) | No (once per save) |
| UI category | "Mission" | "Story" | "Subscription" | "Tutorial" |

## The tutorial_global.xml registry

`tutorial_global.xml` holds shared state across all tutorials:

```xml
<set_value name="md.Tutorial_Global.$completed_tutorials"
    exact="[tutorial_flight, tutorial_mining]"/>
```

Tutorials check this registry to avoid re-offering themselves:

```xml
<conditions>
    <check_value 
        value="not md.Tutorial_Global.$completed_tutorials.indexof.{tutorial_xyz}"/>
</conditions>
```

When the player completes a tutorial, the script appends to this list. Save-load preserves the list.

## Mission framework integration

Tutorials use the same `create_mission` action but with `category="tutorial"` semantics. The HUD recognizes the category and adds tutorial-style UI overlays (yellow highlights, "Next" prompts).

```xml
<create_mission
    cue="$Mission"
    name="'{8001, 100}'"        <!-- text reference -->
    description="..."
    category="tutorial"
    missiongroup="md.Missiongroups.MG_Tutorial"/>
```

## Common gotchas

- ⚠ **`PlayerDied` reset is essential** — without it, dying mid-tutorial leaves the mission stuck
- ⚠ **`Trigger checkinterval=5s` polling is the canonical pattern** — every 5s the tutorial checks if context warrants offering
- ⚠ **Tutorials don't appear in mission completion stats** — they're separate UI category
- ⚠ **`md.Tutorial_Global.$completed_tutorials` must be patch-migrated** if your mod adds tutorials — see [Save compatibility](/wiki/save-compatibility/)
- ⚠ **Conversation-driven offers fire only after the player TALKS** — the trigger condition must include `event_npc_talked` or similar interaction event
- ⚠ **Skipping a tutorial doesn't re-mark it as available** — once aborted, vanilla doesn't re-offer

## Adding a custom tutorial

1. Pick a vanilla tutorial in your mechanic's area (e.g. `tutorial_mining.xml` if you're teaching new ore types)
2. Diff in your tutorial cue structure (Start → Trigger → Offer → Tutorial → Abort)
3. Register in `md.Tutorial_Global.$completed_tutorials` for save persistence
4. Use `signal_cue md.HUD.ShowGuidance` for the actual on-screen prompts
5. Test with both fresh start AND mid-game save load
6. Don't forget abort handling — players skip tutorials more often than you'd think

## Code references (vanilla)

| Concern | File |
|---|---|
| Standard tutorial pattern | `tutorial_flight.xml` (smallest reference) |
| Global tutorial registry | `tutorial_global.xml` |
| Map-related tutorials (complex UI integration) | `tutorial_map.xml`, `tutorial_map_advanced.xml` |
| Hardware-tutorial-specific | `tutorial_inputdev.xml` |

## Related

- [Story missions](/game/missions/story-mission/) — bespoke narrative counterpart
- [Generic missions](/game/missions/generic-mission/) — repeatable BBS counterpart
- [Mission events](/game/missions/mission-events/) — shared event API
- [Mission group](/game/factions/missiongroup/) — HUD UI categorisation
- [Architectural overview: Mission framework](/overviews/mission-framework/)

---

*Tutorials are the place to add player-onboarding for a new mechanic your mod introduces. Don't assume players will read your README — surface the mechanic as a tutorial offered when context is right.*

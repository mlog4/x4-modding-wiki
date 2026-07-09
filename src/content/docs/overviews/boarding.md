---
title: Boarding
description: The 4-phase state machine for capturing ships through marine assault. From operation creation through phase transitions to ownership resolution.
---

Boarding is X4's most elaborate single-operation system — 2749 lines of MD in `boarding.xml`, a 4-phase state machine, marine accounting, pod lifecycle, threshold mechanics, and ownership transfer. This overview connects the dots from "player clicks Board" to "ship changes faction".

For the runtime data type and per-property reference, see [Boarding operation](/game/behavior/boarding-operation/).

## The 4 phases

```
┌──────────────────────────────────────┐
│  pre                                  │
│  - Marines being selected by attacker │
│  - Boardingapproachthreshold check    │
│  - Pods not yet launched              │
└────────────────┬─────────────────────┘
                 ↓ threshold met
┌──────────────────────────────────────┐
│  approach                             │
│  - Pods launched, flying to boardee   │
│  - Aiscript on each pod handles       │
│    flight + defence-evasion           │
│  - Insertion threshold check          │
└────────────────┬─────────────────────┘
                 ↓ threshold met
┌──────────────────────────────────────┐
│  infiltration                         │
│  - Marines inserting through hull     │
│  - Boardingresistance vs              │
│    boardingstrength clash             │
└────────────────┬─────────────────────┘
                 ↓ inserted
┌──────────────────────────────────────┐
│  internalfight                        │
│  - Marines vs crew interior battle    │
│  - Result determines ownership swap   │
│  - .marines.killed accumulates        │
└────────────────┬─────────────────────┘
                 ↓ resolution
┌──────────────────────────────────────┐
│  (removed)                            │
│  - Operation concluded                │
│  - event_boarding_operation_removed   │
│  - Ownership swapped (or not)         │
└──────────────────────────────────────┘
```

## Phase transitions

Phase transitions are driven by **threshold checks** + engine-side logic. The transitions:

| From | To | Trigger |
|---|---|---|
| (none) | `pre` | `event_boarding_operation_created` |
| `pre` | `approach` | Threshold + `OperationStarted` |
| `approach` | `infiltration` | Pods arrived AND insertion threshold met |
| `infiltration` | `internalfight` | Marines successfully entered |
| `internalfight` | (removed) | Crew defeated OR all marines killed OR boardee destroyed |

The `Phase_Pre_Approach_Check_Conditions` cue evaluates conditions every second during `pre`; once thresholds are met, vanilla advances via `<set_boarding_phase>`.

## Marine flow

A marine's journey through a boarding operation:

```
   pre phase
   ↓
   Marine assigned to operation
   (from attacker ship's .people.marine)
   ↓
   approach phase
   ↓
   Marine in pod, flying to boardee
   ↓
   Pod arrives → infiltration phase
   ↓
   Marine attempts insertion
   - Success: enters internalfight
   - Failure: killed
   ↓
   internalfight phase
   ↓
   Marine fights interior crew
   - Survives + crew defeated: marines stay (attacker keeps them)
   - Killed: added to .marines.killed
```

The boarding operation tracks marines in three buckets via the [Boarding operation](/game/behavior/boarding-operation/) datatype:

- `.marines.infiltrating` — currently inserting
- `.marines.fighting` — in the internal fight
- `.marines.killed` — dead during the op

## Battle math (high level)

Internal fight outcome depends on:

| Side | Strength source |
|---|---|
| **Attacker** | `.boardingstrength` — marine skill * count |
| **Defender** | `.boardingresistance` — base + crew skill + pilot |

The fight resolves stochastically per tick — engine compares strengths, applies losses, and either resolves quickly (huge imbalance) or grinds (close fight). When defender's resistance hits zero, the boardee changes ownership.

## Special cases

### Pod destruction during approach

If a pod is shot down (engine-side):
- `ApproachingBoardingPodDestroyed` cue fires
- Marines in that pod are lost (`.marines.killed`)
- If all pods destroyed: operation likely fails

### Attacker destroyed

If the attacking ship is destroyed before the op resolves:
- `AttackerDestroyed` cue fires
- Operation is cancelled (`event_boarding_operation_removed` with no ownership swap)

### Boardee destroyed

If the boardee is destroyed mid-op:
- Operation removed
- Marines who hadn't yet inserted are lost
- No ownership change (you can't board a wreck)

### Capturable filter

Some ships can't be boarded — `.iscapturable=false`. Vanilla filters include:
- Most Khaak ships
- Story-critical ships
- Lasertowers

Modders adding boardable ships must set `.iscapturable=true` on the macro.

## Vanilla file structure

`boarding.xml` (2749 lines) is organised by cue purpose:

```
boarding.xml
├── OperationCreated (entry point — fires on event_boarding_operation_created)
│   ├── ChangePhase (phase transition handler)
│   ├── ApproachingBoardingPod* (pod lifecycle)
│   ├── AttackerDestroyed
│   └── OperationStarted
├── Phase_Pre_Approach
│   ├── Phase_Pre_Approach_Check_Conditions (1s heartbeat)
│   └── Phase_Pre_Approach_Damage_Speak (voice line)
├── Phase_Approach
│   ├── Phase_Approach_Player_Ship_Handler (player-side UX)
│   ├── Phase_Approach_Player_Launch
│   └── ... (NPC equivalents)
├── Phase_Infiltration (similar split)
└── Phase_InternalFight (similar split)
```

The player-side and NPC-side flows are largely separate cues — different UX. Player gets UI prompts, voice lines, camera framing; NPC just runs the math.

## Cross-references

- [Boarding operation](/game/behavior/boarding-operation/) — runtime datatype and per-property reference
- [Ship](/game/objects/ship/) — boardable ships, `.iscapturable` accessor
- [NPC](/game/characters/npc/) — marines and crew
- [Faction](/game/factions/faction/) — operation owner
- [TransferShipOwnership library](/game/objects/ship/#transfer-ownership-fleet-aware) — what runs at conclusion

## Why this matters for modders

### Custom boarding outcomes

If your mod wants to react to boarding (e.g. "give the player a bonus for capturing capital ships"), use `event_boarding_operation_removed`. Determine outcome by checking `event.object.boardee.trueowner == event.object.owner` — see [Boarding operation → Examples](/game/behavior/boarding-operation/#example-2-detect-success-or-failure-when-an-op-ends).

### Tuning marine effectiveness

Marine skill matters. The marine officer skill multiplies all marine effectiveness during the internal fight. Mods adding NPCs should consider whether they have marine officers.

### Adding boardable ships

Make a ship boardable by:
1. Setting `.iscapturable=true` on the macro
2. Ensuring `.canhaveattackablemodules=true` if you want module-level damage
3. Defining defence module slots (so the engine can simulate crew defence)

### Custom boarding actions

Modders adding new boarding-style operations (e.g. "hijack via signal leak") can use the operation datatype as a template — `<start_boarding_operation>` accepts a custom operation parameter set.

## Related architectural overviews

- *Marine recruitment* — how marines enter the player's ships in the first place
- *Defence response to boarding* — how the defending faction reacts (relations hit, patrol response)
- [Faction economy](/overviews/faction-economy/) — separate but adjacent system

---

:::tip[Pattern — long-lived operation with explicit state machine]
Boarding is **X4's most explicit state machine** — every transition has a named cue, every failure mode has a handler. The 2749-line file reads as a textbook on how to implement multi-phase operations in MD. When extending boarding, mirror this shape: separate cues per phase, separate cues per failure mode, explicit phase transition handler.
:::

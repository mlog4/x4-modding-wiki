---
title: Boarding operation
description: Lifecycle of a boarding attempt — pre, approach, infiltration, internal fight. Tracks marines and pods.
---

A **Boarding operation** is the lifecycle of a boarding attempt: one *boardee* (the target ship/station), one or more *attackers* (ships contributing marines), and a state machine over four phases. Vanilla source: `md/boarding.xml`.

**Inheritance:** `operation → boardingoperation`. The base `operation` type adds `starttime`, `duration`, `owner`.

**Why this matters for modders:** boarding is one of the few engine-driven *long-running operations* with its own datatype, properties, and event family. Touching it well — adding modded boarding actions, custom marine selection, alternate phase triggers — requires understanding the phase machine.

## Phase state machine

```
       ┌────────────────────────────────┐
created │  pre        marines being      │
   ↓    │             selected,           │
started │             approach not yet    │
   ↓    │             started             │
        ├────────────────────────────────┤
        │  approach   pods en route to    │
        │             boardee             │
        ├────────────────────────────────┤
        │  infiltration  marines inserting│
        │                through hull     │
        ├────────────────────────────────┤
        │  internalfight  marines fighting│
        │                 inside boardee  │
        ├────────────────────────────────┤
removed │  (complete / cancelled —        │
        │   removed from engine)          │
        └────────────────────────────────┘
```

Vanilla phases (`boardingphase.X` enum):

| Phase | Engine behaviour | Vanilla driver |
|---|---|---|
| `pre` | Player / faction is composing the operation. Marines being selected. No pods launched yet | `boarding.xml:103, 338, 571` |
| `approach` | Pods launched and en route to boardee. Aiscripts on each pod handle approach + defence-evasion | `boarding.xml:386` |
| `infiltration` | Marines inserting through hull. Marine skill + boardingresistance shape success | `boarding.xml:568, 852` |
| `internalfight` | Marines fighting interior crew. Marine combinedskill vs `.boardingresistance` of boardee | `boarding.xml:893, 1095` |
| (removed) | Operation concluded — fires `event_boarding_operation_removed` | `boarding.xml:1548` |

Thresholds (`.boardingapproachthreshold`, `.boardinginsertionthreshold`) decide when one phase triggers the next.

## Properties

From the boardingoperation datatype (`scriptproperties.xml:1597`) + inherited from `operation`.

### Identity and lifecycle

| Property | Type | Description |
|---|---|---|
| `.exists` | bool | Operation exists in engine |
| `.starttime` | time | When started (inherited) |
| `.duration` | time | Expected duration; -1s if unspecified (inherited) |
| `.owner` | faction | The boarding faction (inherited) |
| `.boardingphase` | boardingphase | Current phase enum |

### Target and attackers

| Property | Type | Description |
|---|---|---|
| `.boardee` | defensible | The target (ship or station) |
| `.attackers` | list | All ships contributing marines |
| `.approachingpods` | list | Pods currently en route |
| `.allmarinesdispatched` | bool | All assigned marines have launched (true if none were assigned) |

### Marines (per-state)

| Property | Type | Description |
|---|---|---|
| `.marines.infiltrating.list` | list | Marines currently inserting (NPC templates) |
| `.marines.infiltrating.count` | int | Count |
| `.marines.infiltrating.combinedskill` | int 0..100 | Avg skill |
| `.marines.infiltrating.random` | npctemplateentry | Random member |
| `.marines.fighting.list / .count / .combinedskill / .random` | various | Same fields, currently in internal fight |
| `.marines.killed.list / .count / .combinedskill / .random` | various | Marines killed in this operation |

### Tuning

| Property | Type | Description |
|---|---|---|
| `.boardingapproachthreshold` | int | Threshold to transition `pre → approach` |
| `.boardinginsertionthreshold` | int | Threshold to transition `approach → infiltration` |

### Target-side accessors (on the boardee, not the operation)

On the *boardee* (`defensible` datatype):

| Property | Notes |
|---|---|
| `.boardingoperation` | The currently-attacking op, or null |
| `.boardingoperations` | List of all inbound ops (rare; one is usual) |
| `.boardingresistance` | Hostile NPCs' aggregate strength |
| `.baseboardingresistance` | Floor (defined per macro) |
| `.boardingstrength` | Attacker marines' aggregate score |

## Actions

### Start a boarding operation

Boarding operations are typically created through the player-side context menu, but scripts can start them directly:

```xml
<start_boarding_operation operation="$operation"/>
```

Vanilla `showcases.xml:350` uses this for the tutorial. Most mod use cases let vanilla `boarding.xml` create the op, then react via events.

### Force a phase transition (advanced)

```xml
<set_boarding_phase
    operation="$Operation"
    phase="event.param"/>
```

The vanilla phase machine uses `event_boarding_phase_changed` + `set_boarding_phase` to advance phases on threshold hits. See `boarding.xml:103`.

### Read marines and skill

```xml
<set_value name="$avgSkill"
    exact="$op.marines.fighting.combinedskill"/>

<set_value name="$totalKilled"
    exact="$op.marines.killed.count"/>
```

### Find the operation attacking a specific target

```xml
<do_if value="@$Ship.boardingoperation">
    <set_value name="$op" exact="$Ship.boardingoperation"/>
    <write_to_logbook
        text="$Ship.knownname + ' under boarding, phase: '
            + $op.boardingphase"/>
</do_if>
```

## Libraries

Boarding has a dedicated MD framework rather than `LIB_Generic` helpers:

| Library | File | Purpose |
|---|---|---|
| `md.Boarding.X` cues | `md/boarding.xml` | The full ~3000-line state machine driving the four phases |
| `md.LIB_Generic.TransferShipOwnership` | `md/lib_generic.xml:1551` | Called at conclusion to transfer the captured boardee to the new owner |

For ad-hoc work the `md.Boarding` cues are the source of truth — read them rather than re-implementing.

## Events

| Event | When | Notes |
|---|---|---|
| `event_boarding_operation_created` | Operation exists in engine, before player/faction finalises | Vanilla `boarding.xml:7` |
| `event_boarding_operation_started` | Player/faction committed; marines being prepared | `boarding.xml:265` |
| `event_boarding_phase_changed` | Any phase transition | `event.object` = operation, `event.param` = new phase |
| `event_boarding_operation_removed` | Operation concluded (capture / cancel / loss) | Fired in `boarding.xml:1548` |

There is **no** `event_boarding_operation_succeeded` / `event_boarding_operation_failed`. The outcome is observed by:
- Watching `event_object_changed_owner` on the boardee (success = ownership swap to attackers' faction)
- Watching `event_object_destroyed` on the boardee (failure mode = boardee destroyed)
- On `event_boarding_operation_removed`, comparing boardee's `.trueowner` to the operation's `.owner`

## Common gotchas

- ⚠ **`event_boarding_operation_removed` fires for both success AND failure.** It's the engine's "this op is done" signal. To distinguish, check `event.object.boardee.trueowner == event.object.owner` (success) or `event.object.boardee.exists == false` (boardee destroyed).
- ⚠ **`.boardingphase` is an enum, NOT a string.** Use `boardingphase.pre` / `.approach` / `.infiltration` / `.internalfight`, not `"pre"` etc.
- ⚠ **Pre-phase operations can be cancelled cheaply.** Once `boardingphase.approach` is reached pods are in flight and cancellation leaves them adrift — make sure your mod accepts cleanup.
- ⚠ **Marines killed in earlier phases don't return to the attacking ship.** The `.marines.killed` list grows monotonically; check it before assuming "no marines available".
- ⚠ **Special ships reject boarding.** Khaak Queen's Guard, Hive Guard, certain story ships — they have `.iscapturable=false` and engine refuses the op. Filter via `$ship.iscapturable` before offering boarding.
- ⚠ **Boardingresistance includes pilot/crew skill, not just marines.** A boardee with low marine count but a high-skill pilot still resists. Read `.boardingresistance` to estimate, not `.people.marine.count`.
- ⚠ **`set_boarding_phase` skips phase logic.** Forcing `infiltration` directly bypasses approach thresholds — pods still need to physically arrive. Use sparingly.
- ⚠ **`approachingpods` is a list of ships, not pod-specific instances.** Each pod is a `class.ship_xs` controllable. Cancel via standard ship destruction / commandeer if needed.

## Examples

### Example 1: Notify when a player boarding op enters infiltration

```xml
<cue name="WatchPlayerBoarding" instantiate="true">
    <conditions>
        <event_boarding_phase_changed/>
        <check_value value="event.object.owner == faction.player
            and event.param == boardingphase.infiltration"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="event.object.boardee.knownname
                + ': marines inserting'"/>
    </actions>
</cue>
```

### Example 2: Detect success or failure when an op ends

```xml
<cue name="OnBoardingDone" instantiate="true">
    <conditions>
        <event_boarding_operation_removed/>
    </conditions>
    <actions>
        <set_value name="$op" exact="event.object"/>
        <do_if value="$op.boardee.exists
            and $op.boardee.trueowner == $op.owner">
            <write_to_logbook
                text="'Boarding succeeded: '
                    + $op.boardee.knownname"/>
        </do_if>
        <do_else>
            <write_to_logbook
                text="'Boarding failed: '
                    + ($op.boardee.exists ?
                       $op.boardee.knownname :
                       'boardee destroyed')"/>
        </do_else>
    </actions>
</cue>
```

### Example 3: Find all boarding ops the player is currently running

```xml
<find_ship_by_true_owner name="$PlayerShips"
    space="player.galaxy"
    faction="faction.player"
    multiple="true"/>

<create_list name="$ActiveOps"/>

<do_for_each name="$ship" in="$PlayerShips">
    <do_if value="@$ship.boardingoperation
        and $ActiveOps.indexof.{$ship.boardingoperation} == 0">
        <append_to_list name="$ActiveOps"
            exact="$ship.boardingoperation"/>
    </do_if>
</do_for_each>

<write_to_logbook
    text="'Player has ' + $ActiveOps.count
        + ' boarding ops in progress'"/>
```

Note: a single boarding op can have multiple attackers, so dedup by op ref.

## Architectural context

- **End-to-end boarding pipeline:** Architectural overview *Boarding* — `md/boarding.xml` ~3000 lines, four-phase machine, pod lifecycle, marine skill ↔ resistance arithmetic, ownership swap on success.
- **How marines are recruited and tracked:** Architectural overview *Marine recruitment* — `entityrole.marine`, ship `.people.marine.count`, training at equipment docks.
- **Combat side of boarding:** Architectural overview *Defence response to boarding* — engine fires `event_object_attacked` on the boardee as a side effect; defending faction's static-defence cues respond.

## Related

- [Ship](/game/objects/ship/) — both the attackers and (often) the boardee.
- [Station](/game/objects/station/) — boardee subset (L/XL boardable).
- [NPC](/game/characters/npc/) — marines, pilots; skill drives outcome.
- [Faction](/game/factions/faction/) — `.owner` of operation, `.trueowner` of boardee.
- [Order](/game/behavior/order/) — attacking ships execute `'AssistBoarding'`-style orders during the operation.

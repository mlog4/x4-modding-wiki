---
title: Cue
description: The central abstraction of the MD framework — a unit of script logic with conditions, actions, state, and child cues. Functions-with-state for the game's event system.
---

A **Cue** is the central unit of MD (Mission Director) script. Every MD script consists of cues; everything that happens in MD — missions, events, NPC behaviour, story content — runs inside a cue's `<actions>` block. Cues have **state** (waiting / active / complete / cancelled), can have **child cues**, and can be **instantiated** (template + N runtime instances).

If you come from OOP, think of a cue as **a function with persistent state, plus a built-in event listener** (the `<conditions>` block decides when to run).

## Cue XML structure

A cue is defined in MD XML:

```xml
<cue name="MyCue" instantiate="true" version="1">
    <conditions>
        <!-- When to trigger -->
        <event_object_destroyed/>
    </conditions>

    <delay min="2s" max="5s"/>

    <actions>
        <!-- What to do when triggered -->
        <write_to_logbook text="'Cue fired'"/>
    </actions>

    <cues>
        <cue name="ChildCue">
            <!-- Child cue, scoped to parent -->
        </cue>
    </cues>
</cue>
```

The XML attributes are static; the runtime accessors are listed below.

### Cue attributes (XML-side)

| Attribute | Purpose |
|---|---|
| `name="X"` | Cue identifier within its parent / script |
| `instantiate="true/false"` | Template-or-instance toggle (see [Instantiation](#instantiation)) |
| `namespace="X"` | Override the namespace for child variables |
| `version="N"` | Cue version (for save migration) |
| `ref="path.to.library"` | Cue is a library reference |
| `library="true"` | Cue acts as a library template |

## Runtime properties

From vanilla `scriptproperties.xml:2194`.

### Identity

| Property | Type | Description |
|---|---|---|
| `.exists` | bool | Cue exists |
| `.name` | string | Cue name (unqualified) |
| `.version` | int | Version (from XML) |

### Lifecycle state

| Property | Type | Description |
|---|---|---|
| `.state` | cuestate | Current state (`active`, `complete`, etc.) |
| `.time` | time | Time of cue activation / last action block |

### Hierarchy

| Property | Type | Description |
|---|---|---|
| `.parent` | cue | Parent cue (null for root) |
| `.static` | cue | The instantiating cue (null if this is not an instance) |
| `.staticbase` | cue | Static base used as instantiation template |
| `.namespace` | cue | Namespace cue (where variables live) |
| `.library` | cue | Base library cue if this is a library reference |
| `.isinstance` | bool | Is this a runtime instance (vs template) |

### Mission / objective

| Property | Type | Description |
|---|---|---|
| `.hasmissionoffer` | bool | Has a mission offer |
| `.hasmission` | bool | Has an active mission |
| `.hasguidance` | bool | Guidance arc is active |
| `.offerlocations` | list | Mission-offer component slots |
| `.canactivatesubmission.{cue}` | bool | A submission can be activated |
| `.missiontype` | missiontype | Type of mission |
| `.missionendtime` | time | Mission end time (null if open-ended) |
| `.objective` | objective | Current objective |
| `.objectiveendtime` | time | Objective end time |

### Actors

| Property | Type | Description |
|---|---|---|
| `.actor` | nonplayer | Last associated actor |
| `.actors` | list | All associated actors |

### Variables

| Property | Type | Description |
|---|---|---|
| `.$<variablename>` | various | Value of a cue variable |

`$variables` are how MD stores per-cue state. They persist across action blocks and survive save/load.

## Instantiation

A cue with `instantiate="true"` is a **template**. Each time the conditions match, a new **instance** is created — `.isinstance=true`, `.static` points back to the template. Instance variables (`$variables`) are independent per-instance.

A cue with `instantiate="false"` (or default) is a **singleton** — runs at most once. Subsequent condition firings are ignored.

The vanilla canonical "listener cue":

```xml
<cue name="WatchDestroys" instantiate="true">
    <conditions>
        <event_object_destroyed group="$WatchedGroup"/>
    </conditions>
    <actions>
        <!-- Fires once per destruction -->
    </actions>
</cue>
```

`instantiate="true"` is *required* if you want the cue to react more than once.

## Cue lifecycle

```
   ┌─────────────────┐
   │  Not yet         │
   │  activated       │  ← XML defined but conditions never met
   └────────┬─────────┘
            ↓ (conditions match)
   ┌─────────────────┐
   │  active         │   ← running <actions>
   └────────┬─────────┘
            ↓ (actions complete OR delay/timer)
   ┌─────────────────┐
   │  waiting         │  ← waiting for sub-conditions OR delay
   └────────┬─────────┘
            ↓ (next event / signal_cue / reset_cue)
   ┌─────────────────┐
   │  complete /      │
   │  cancelled       │   ← terminal
   └─────────────────┘
```

The `cuestate` enum values cover all transitions. Use `.state` to read.

## Common patterns

### "Bridge + Worker" race-avoidance pattern

For listeners that must do entity writes (`add_inventory`, `destroy_object`), vanilla uses a split:

```xml
<!-- Bridge — instantiated, signals work -->
<cue name="Bridge" instantiate="true">
    <conditions>
        <event_object_destroyed group="$X"/>
        <check_value value="not $busy"/>
    </conditions>
    <actions>
        <set_value name="$busy" exact="true"/>
        <signal_cue cue="Worker"
            param="event.object"/>
    </actions>
</cue>

<!-- Worker — NOT instantiated, does writes -->
<cue name="Worker" instantiate="false">
    <conditions>
        <event_cue_signalled cue="Bridge"/>
    </conditions>
    <actions>
        <!-- entity writes here -->
        <add_inventory ware="..." entity="..."/>

        <reset_cue cue="this"/>
    </actions>
</cue>

<!-- ReleaseBusy — clears the lock -->
<cue name="ReleaseBusy" delay="2s">
    <actions>
        <set_value name="$busy" exact="false"/>
    </actions>
</cue>
```

Pattern reason: `instantiate="true"` cues silently drop entity-write actions (see Common gotchas). The bridge runs first (allowed to instantiate), signals the worker, worker does the real work in a non-instantiated context.

### Library reference

```xml
<cue name="UseLib" ref="md.LIB_Generic.TransferShipOwnership">
    <param name="Ship" value="$capturedShip"/>
    <param name="NewOwner" value="faction.player"/>
</cue>
```

The `ref=` attribute makes the cue a library reference. The actions execute as if inlined.

### Namespace

```xml
<cue name="OuterCue" namespace="this">
    <actions>
        <set_value name="this.$shared" exact="42"/>
    </actions>

    <cues>
        <cue name="Child">
            <actions>
                <!-- Can read this.$shared from outer cue -->
                <write_to_logbook text="this.$shared"/>
            </actions>
        </cue>
    </cues>
</cue>
```

`namespace="this"` makes the cue itself the namespace for `this.$var` lookups by its children.

## Common gotchas

- ⚠ **`instantiate="true"` silently drops entity writes (`add_inventory`, `destroy_object`).** This is the most-bitten MD gotcha. Use the Bridge + Worker pattern above (`mlog_bmb` / `mlog_frs` mod canonical fix).
- ⚠ **`signal_cue param="X"` silently drops the param (the queued form).** Only `signal_cue_instantly` propagates `param=`. Queued signal_cue delivers `event.param == null`. Vanilla never uses the queued + param combo.
- ⚠ **`event_cue_signalled cue="X"` attribute means "X RECEIVED a signal", not "X SENT".** Confusing — use no-attr form for canonical Init→Worker pattern, else the listener silently never fires.
- ⚠ **Non-instantiated workers fire ONCE then stay completed.** Subsequent signals → "no corresponding listeners" warning. Append `<reset_cue cue="this"/>` to actions to repeatedly fire.
- ⚠ **`<library>` must be INSIDE `<cues>` as a sibling of `<cue>`, not between `<mdscript>` and `<cues>`.** Top-level libraries → `run_actions ref=` silently returns empty.
- ⚠ **`<return/>` only works in libraries.** In regular cue actions you get "Script node 'return' is not allowed in this context". Use `do_else` wrap + `reset_cue` for early-exit.
- ⚠ **`event_object_destroyed group="$X"` watcher MUST be NESTED inside the group-creating cue.** Top-level group filters silently never fire. Vanilla `setup.xml:41/591` pattern.
- ⚠ **`event_X group=$X` requires the group to be set up in a no-conditions cue.** Conditions-having setup cues fire too late; engine errors at time 0.00.
- ⚠ **Table keys must be `$-prefixed` strings.** `$tbl.{'key'}` silently fails; must be `$tbl.{'$key'}` or `$tbl.$key`.
- ⚠ **Save migration via `version=`.** Older saves rerun cues with new `version=` automatically. Use this for breaking changes.

## Examples

### Example 1: Watch a list of ships and react to destruction

```xml
<cue name="SetupAndWatch" instantiate="false">
    <conditions>
        <event_cue_completed cue="md.GameStart"/>
    </conditions>
    <actions>
        <create_group groupname="global.$Watched"/>
        <find_ship_by_true_owner
            groupname="global.$Watched"
            space="player.galaxy"
            faction="faction.argon"
            multiple="true"/>
    </actions>

    <cues>
        <cue name="OnDestroy" instantiate="true">
            <conditions>
                <event_object_destroyed
                    group="global.$Watched"/>
            </conditions>
            <actions>
                <write_to_logbook
                    text="'Argon ship lost: '
                        + event.object.knownname"/>
            </actions>
        </cue>
    </cues>
</cue>
```

### Example 2: Heartbeat cue with reset

```xml
<cue name="Heartbeat" instantiate="false">
    <delay exact="60s"/>
    <actions>
        <!-- Do periodic work -->
        <write_to_logbook text="'Tick'"/>

        <reset_cue cue="this"/>
    </actions>
</cue>
```

Without `reset_cue`, fires once at 60s and stays complete. With it, fires every 60s forever.

### Example 3: Mission cue with offer

```xml
<cue name="RescueMission" instantiate="true">
    <conditions>
        <event_player_arrived
            sector="$TargetSector"/>
    </conditions>
    <actions>
        <set_value name="$missionid"
            exact="'rescue_001'"/>
        <create_offer
            cue="this"
            faction="faction.argon"/>
    </actions>
</cue>
```

Mission cues set `.hasmissionoffer=true`; the player sees the offer in UI; accepting transitions to `.hasmission=true`.

## Architectural context

- **MD script engine:** Architectural overview *MD framework* — cue evaluation, condition matching, action dispatch.
- **Save/load lifecycle:** Architectural overview *Cue persistence* — how `version=` drives migration, `instantiate=` instances survive saves.
- **Listener race conditions:** Architectural overview *Listener race patterns* — Bridge+Worker, ReleaseBusy, signal_cue idioms.
- **Mission framework:** Architectural overview *Mission cues* — how cues with `.hasmission` integrate with the offer/accept/complete UX.

## Related

- [Library](/lang/md-framework/library/) — cue with `purpose="run_actions"` for shared logic.
- [Action](/lang/md-framework/action/) — what goes inside `<actions>`.
- [Condition](/lang/md-framework/condition/) — what goes inside `<conditions>`.
- [Expression](/lang/md-framework/expression/) — `value="..."` expression syntax.
- [MD Framework overview](/lang/md-framework/) — broader context.
- Cross-tree: [Order](/game/behavior/order/) — game-side "ship is doing X" backed by aiscript, not cue.

---

:::tip[Pattern — function-with-state-plus-listener]
Cue is **MD's primary abstraction**. It combines three concerns: **event listener** (conditions), **callable code** (actions), **persistent state** (variables). Once you internalise the lifecycle, all of MD makes sense.

This is the **first language-side abstraction** documented in our wiki. Structurally distinct from any game-side abstraction (no `.sector`, no `.owner`, no spatial accessors). The schema generalises across the game ↔ language boundary.
:::

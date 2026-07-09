---
title: Bridge + Worker pattern
description: The canonical race-avoidance MD pattern for cues that need to do entity writes (add_inventory, destroy_object). Splits trigger detection from action execution.
---

The **Bridge + Worker pattern** is the canonical race-avoidance idiom for MD cues that need to write to entities (`add_inventory`, `destroy_object`, modifying NPC state). It splits the cue into two parts:

1. **Bridge** — instantiated cue that detects the event
2. **Worker** — non-instantiated cue that does the actual work

Without this split, `instantiate="true"` cues silently drop entity writes.

This pattern shows up in `mlog_bmb`, `mlog_frs`, `mlog_heroes`, and is referenced from [Cue](/lang/md-framework/cue/) (the canonical home).

## The problem

```xml
<cue name="WatchAndReward" instantiate="true">
    <conditions>
        <event_object_destroyed group="$tracked"/>
    </conditions>
    <actions>
        <!-- ⚠ This silently fails: -->
        <add_inventory
            ware="ware.inv_X"
            exact="1"
            entity="event.param"/>
    </actions>
</cue>
```

The action `add_inventory` is engine-determined to be incompatible with `instantiate="true"`. The engine silently drops it. No error in debug.log. The player gets no inventory item. You spend hours debugging "why doesn't my reward work".

## The solution

Split into Bridge + Worker + ReleaseBusy:

```xml
<!-- Bridge: instantiated, detects event, signals Worker -->
<cue name="Bridge" instantiate="true">
    <conditions>
        <event_object_destroyed group="$tracked"/>
        <check_value value="not $busy"/>
    </conditions>
    <actions>
        <set_value name="$busy" exact="true"/>
        <signal_cue_instantly
            cue="Worker"
            param="event.param"/>
    </actions>
</cue>

<!-- Worker: NON-instantiated, does the real entity writes -->
<cue name="Worker" instantiate="false">
    <conditions>
        <event_cue_signalled cue="Bridge"/>
    </conditions>
    <actions>
        <add_inventory
            ware="ware.inv_X"
            exact="1"
            entity="event.param"/>

        <reset_cue cue="this"/>
    </actions>
</cue>

<!-- ReleaseBusy: clears the lock after delay -->
<cue name="ReleaseBusy" delay="2s">
    <conditions>
        <event_cue_signalled cue="Worker"/>
    </conditions>
    <actions>
        <set_value name="$busy" exact="false"/>
        <reset_cue cue="this"/>
    </actions>
</cue>
```

## Why each piece is needed

### Bridge (instantiated)

- Must be `instantiate="true"` to fire repeatedly on the event
- Can't do entity writes — but CAN signal another cue
- `$busy` check prevents Worker from being signalled while it's running

### Worker (not instantiated)

- `instantiate="false"` lets it do entity writes
- Receives `event.param` from the Bridge's `signal_cue_instantly`
- **Must call `reset_cue cue="this"`** — otherwise next signal fires "no listener" warning
- `signal_cue_instantly` is required (NOT plain `signal_cue` — that one drops `param=`)

### ReleaseBusy

- Clears `$busy` after a 2-second delay
- Without it, `$busy` stays true and Bridge stops firing
- Delay prevents same-frame Bridge re-fire after Worker finishes

## Why not just a single non-instantiated cue?

```xml
<!-- ❌ This only fires ONCE -->
<cue name="Worker" instantiate="false">
    <conditions>
        <event_object_destroyed group="$tracked"/>
    </conditions>
    <actions>
        <add_inventory ... />
    </actions>
</cue>
```

Non-instantiated cues fire once, then stay completed. Subsequent destruction events get "no corresponding listeners" warning. The Bridge pattern's `signal_cue_instantly` + `reset_cue` keeps the Worker re-fireable.

## Variants

### Without ReleaseBusy (single-shot)

If you only need the cue to fire once per game session:

```xml
<cue name="Bridge" instantiate="true">
    <conditions>
        <event_object_destroyed group="$tracked"/>
        <check_value value="not @$done"/>
    </conditions>
    <actions>
        <set_value name="$done" exact="true"/>
        <signal_cue_instantly cue="Worker" param="event.param"/>
    </actions>
</cue>
```

Use `$done` as a one-shot flag.

### Multiple Workers (different action types)

If you need multiple entity-write actions in response to one event, use multiple Workers:

```xml
<cue name="Bridge" instantiate="true">
    <conditions>...</conditions>
    <actions>
        <signal_cue_instantly cue="WorkerA" param="event.param"/>
        <signal_cue_instantly cue="WorkerB" param="event.param"/>
    </actions>
</cue>
```

Each Worker handles its own action type.

## Common mistakes

### Using `signal_cue` instead of `signal_cue_instantly`

```xml
<signal_cue cue="Worker" param="$value"/>  <!-- ❌ param dropped -->
```

Plain `signal_cue` is queued — `param=` doesn't propagate. Worker receives `event.param = null`. Always use `signal_cue_instantly` when you need to pass data.

### Forgetting `reset_cue`

```xml
<cue name="Worker" instantiate="false">
    <conditions>
        <event_cue_signalled cue="Bridge"/>
    </conditions>
    <actions>
        <add_inventory .../>
        <!-- ❌ no reset_cue — fires once, then dead -->
    </actions>
</cue>
```

Without `<reset_cue cue="this"/>`, the Worker fires once then stays complete. Subsequent signals get warned.

### `$busy` lock without ReleaseBusy

```xml
<set_value name="$busy" exact="true"/>
<!-- ❌ never cleared — Bridge stops firing forever -->
```

If you set `$busy` without scheduling its release, the Bridge gets stuck. Always pair with ReleaseBusy or equivalent.

## Where Bridge + Worker is used in vanilla

Vanilla doesn't use this exact pattern by name, but does use:
- Cue tree with signal-passing in `boarding.xml`, `notifications.xml`
- Reset cue pattern in mission cleanup
- `$busy` flags in `factionlogic_economy` for state machines

Vanilla relies more on the operation datatype (`event_boarding_operation_X`) for state. Mods that don't have that engine integration use Bridge + Worker.

## Related

- [Cue](/lang/md-framework/cue/) — the canonical reference
- [Library](/lang/md-framework/library/) — alternative for shared logic
- [Action](/lang/md-framework/action/) — categorical action reference
- [Workflow](/wiki/workflow/) — debug.log patterns to spot drops

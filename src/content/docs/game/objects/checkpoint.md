---
title: Checkpoint
description: Race or scripted-objective marker with a sequence number. Engine-defined class with no active vanilla content — useful as a mod hook for race / time-trial mechanics.
---

A **Checkpoint** is a sequenced objective marker. The engine defines the class and provides a `.sequence` accessor — a number used to order checkpoints in a race or quest sequence.

**Inheritance:** `component → destructible → object → checkpoint`. The datatype adds exactly one property.

**Important — minimal vanilla usage.** Searching vanilla MD and aiscripts for `class.checkpoint` returns **zero results**. The class is engine-defined and exposed to scripts, but **no vanilla cue, mission, or aiscript actively uses it**. This makes checkpoint:

- A modder hook for custom race / time-trial / sequenced-objective mods.
- A safe class to spawn-and-destroy without colliding with vanilla content.
- A reminder that scriptproperties datatypes don't always correspond to live gameplay systems.

If you want to add race tracks or sequenced flight challenges, this class is what the engine intends for that.

## Properties

### Checkpoint-specific

| Property | Type | Description |
|---|---|---|
| `.sequence` | int | Sequence number — ordering for a series of checkpoints (e.g. 1, 2, 3, … for a race) |

### Useful inherited

| Property | Source | Description |
|---|---|---|
| `.sector` / `.zone` / `.position` | object | Where the checkpoint is |
| `.macro` | component | Checkpoint variant |
| `.knownname` | component | Display name |
| `.knowntoplayer` | component | Player has discovered it |

## Actions

### Spawn a checkpoint

```xml
<create_object
    name="$Checkpoint"
    macro="$CheckpointMacro"
    owner="faction.ownerless"
    sector="$Sector">
    <position x="$x" y="$y" z="$z"/>
</create_object>
```

There is no `.sequence` setter exposed via a clean action. To set the sequence on a custom checkpoint, you typically use macro-level configuration or `<set_value>` on a parallel script-side tracking variable. Vanilla has no `<set_checkpoint_sequence>` action.

### Find all checkpoints in a sector

```xml
<find_object name="$Checkpoints"
    space="$Sector"
    class="class.checkpoint"
    multiple="true"/>
```

### Sort by sequence number (for race-style mods)

```xml
<sort_list name="$Checkpoints"
    sortbyvalue="$loop.element.sequence"/>
```

### Filter "next checkpoint in race"

```xml
<set_value name="$Next" exact="null"/>

<do_for_each name="$cp" in="$Checkpoints">
    <do_if value="$cp.sequence == $CurrentSequence + 1">
        <set_value name="$Next" exact="$cp"/>
        <break/>
    </do_if>
</do_for_each>
```

## Events

There is no `event_checkpoint_X` family. Checkpoint progression is observed through:

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Checkpoint destroyed (player flew through and the mod cue removed it) | Standard pattern |
| `event_object_changed_sector` | Ship moved sectors — race-progress proxy | Mod cues typically poll position vs checkpoint position |

Most race-style mods build their own polling loop: every `do_while` tick, check player position against `$Next.position`; if within threshold, advance to next sequence number.

## Common gotchas

- ⚠ **Zero vanilla MD/aiscript usage of `class.checkpoint`.** This is documented but unused. If you encounter this class in another script, it's almost certainly from a mod, not vanilla.
- ⚠ **`.sequence` is set at macro level, not at runtime.** There's no clean script API to mutate it. Build your race-tracking via a parallel `$RaceState` variable in your mod.
- ⚠ **Checkpoint vs Navbeacon — pick correctly.** [Navbeacon](/game/objects/nav-beacon/) is for player-visible map labels. Checkpoint is for sequenced objective markers. Different abstractions.
- ⚠ **No engine "player passed through checkpoint" event.** You build the trigger yourself via proximity polling or trigger-collider macros.
- ⚠ **`.sequence` is a plain int — no validation that it's contiguous.** A mod could create checkpoints with sequence 1, 5, 9; the engine accepts it. Validate ordering in your mod's setup code.

## Examples

### Example 1: Spawn a simple 3-checkpoint race in a sector

```xml
<set_value name="$Positions" exact="[
    [10000, 0, 10000],
    [-10000, 0, 0],
    [0, 0, -10000]
]"/>

<set_value name="$i" exact="1"/>

<do_for_each name="$pos" in="$Positions">
    <create_object
        name="$cp"
        macro="$CheckpointMacro"
        owner="faction.ownerless"
        sector="$Sector">
        <position
            x="$pos.{1}"
            y="$pos.{2}"
            z="$pos.{3}"/>
    </create_object>

    <set_value name="$i" operation="add" exact="1"/>
</do_for_each>

<write_to_logbook
    text="'Race set up with 3 checkpoints in '
        + $Sector.knownname"/>
```

### Example 2: Track player race progress

```xml
<cue name="RaceProgress" instantiate="true">
    <conditions>
        <event_cue_signalled cue="this"/>
    </conditions>
    <actions>
        <find_object name="$CPs"
            space="$RaceSector"
            class="class.checkpoint"
            multiple="true"/>

        <set_value name="$Next" exact="null"/>

        <do_for_each name="$cp" in="$CPs">
            <do_if value="$cp.sequence == $PlayerSequence + 1">
                <set_value name="$Next" exact="$cp"/>
                <break/>
            </do_if>
        </do_for_each>

        <do_if value="@$Next
            and player.ship.distanceto.{$Next} lt 2000m">
            <set_value name="$PlayerSequence"
                operation="add" exact="1"/>
            <write_to_logbook
                text="'Checkpoint ' + $PlayerSequence
                    + ' passed!'"/>
        </do_if>
    </actions>
</cue>
```

## Architectural context

- **Race-style mod scaffolding:** Architectural overview *Race / time-trial framework* — how a mod might build a full race system on top of `class.checkpoint`.
- **Why some script classes are unused:** Architectural overview *Reserved engine classes* — Egosoft sometimes exposes engine concepts for modders even when the base game doesn't use them.

## Related

- [Navbeacon](/game/objects/nav-beacon/) — player-visible map markers (different role).
- [Sector](/game/world/sector/) — where checkpoints exist.
- [Ship](/game/objects/ship/) — what passes through checkpoints.

---

:::tip[Pattern — defined-but-unused engine class]
Checkpoint is an example of an *engine class exposed for modders without active vanilla use*. When you spot a datatype with no vanilla references, it's often intentional — a hook for community content. Build on it without worrying about conflicts.
:::

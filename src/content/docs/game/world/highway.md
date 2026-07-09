---
title: Highway
description: Zone subtype for high-speed travel routes. Local (intra-sector) and super (inter-sector) variants. Origin / destination / entry / exit / junction graph.
---

A **Highway** is a [Zone](/game/world/zone/) subtype that lets ships travel at high speed along a fixed route. Two flavours:

| Flavour | Connects | `.islocalhighway` | `.issuperhighway` |
|---|---|---|---|
| **Local highway** | Two zones inside the same sector | true | false |
| **Superhighway** | Two clusters | false | true |

**Inheritance:** `component → space → zone → highway`.

## Properties

### Highway-specific

| Property | Type | Description |
|---|---|---|
| `.isdisabled` | bool | Highway disabled (only via custom gamestart) |
| `.origin` | zone | The zone the highway starts from |
| `.destination` | zone | The zone the highway leads to |
| `.junctions` | list | Zones along the highway path |
| `.entry` | highwayentrygate | Entry gate (the visual portal at the start) |
| `.exit` | highwayexitgate | Exit gate (the visual portal at the end) |
| `.entryjumpgate` | gate | Jumpgate that leads INTO this highway (for highway-after-gate flows) |
| `.exitjumpgate` | gate | Jumpgate this highway leads INTO |
| `.closestpointtoplayer` | position | Closest point to player in highway coords (x=y=0, z=0..1) |

### Inherited from zone

`.islocalhighway` / `.issuperhighway` (from zone) are the discriminators. Plus all zone accessors apply (since highway IS-A zone).

## Common patterns

### "Where does this highway lead?"

```xml
<set_value name="$nextSector"
    exact="$highway.destination.sector"/>
```

`.destination` is a zone — chain `.sector` for sector lookup (same pattern as [Gate](/game/world/gate/)).

### "Player on a superhighway — read the exit"

Pattern from vanilla `conversations.xml:1616`:

```xml
<set_value name="$locationobject"
    exact="if @$Origin.zone.issuperhighway
           then $Origin.zone.exit
           else $Origin"/>
```

For conversation positioning, vanilla uses the *exit gate* of the highway rather than the player's mid-highway position.

### "Find highways in a sector"

```xml
<find_zone
    name="$Highways"
    space="$Sector"
    normalzone="false"
    multiple="true"/>

<do_for_each name="$z" in="$Highways">
    <do_if value="$z.islocalhighway or $z.issuperhighway">
        <!-- a highway zone -->
    </do_if>
</do_for_each>
```

### "Read player's progress along a highway"

```xml
<do_if value="@player.zone.issuperhighway">
    <write_to_logbook
        text="'Player progress: '
            + player.zone.closestpointtoplayer.z
            + ' (0=entry, 1=exit)'"/>
</do_if>
```

The `.closestpointtoplayer.z` value (0..1) is the progress fraction along the highway.

## Events

There is no `event_highway_X` family. Standard space events apply:

| Event | When | Notes |
|---|---|---|
| `event_object_changed_sector` | Ship crossed a sector boundary (superhighway exits trigger this) | Standard |

## Common gotchas

- ⚠ **Highway IS-A zone.** `isclass.zone` is TRUE for highways. To exclude highways, check `.islocalhighway` and `.issuperhighway`.
- ⚠ **`.destination` returns a zone, not a sector.** Chain `.destination.sector` for sector lookup (same as [Gate](/game/world/gate/)).
- ⚠ **`.entry` / `.exit` are dedicated highway-gate classes (`highwayentrygate` / `highwayexitgate`).** They are NOT `class.gate` — see [Gate](/game/world/gate/) for the class hierarchy.
- ⚠ **`.entryjumpgate` / `.exitjumpgate` are the connected JUMPGATES.** These are `class.gate` proper. Useful for "after I jump through gate X, will I enter a highway?".
- ⚠ **`.closestpointtoplayer.x` and `.y` are always 0 by design.** Only `.z` (progress 0..1) is meaningful. Don't treat as a full position.
- ⚠ **`.isdisabled` is rare.** Only set via custom gamestart definitions. Most mods can ignore this flag.
- ⚠ **`.haspriority=false` on highways (from zone).** Patrol / mission cues that pick "the most important zone in this sector" should skip highways via this flag.

## Examples

### Example 1: Find a highway connecting two specific sectors

```xml
<find_zone
    name="$SuperHighways"
    space="$ClusterA"
    multiple="true"/>

<set_value name="$found" exact="null"/>

<do_for_each name="$hw" in="$SuperHighways">
    <do_if value="$hw.issuperhighway
        and $hw.destination.sector == $TargetSector">
        <set_value name="$found" exact="$hw"/>
        <break/>
    </do_if>
</do_for_each>
```

### Example 2: Detect player entering a highway

```xml
<cue name="WatchHighwayEntry" instantiate="true">
    <conditions>
        <event_player_signalled/>
        <check_value
            value="@player.zone
                and (player.zone.islocalhighway
                    or player.zone.issuperhighway)"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player entered highway: '
                + player.zone.knownname"/>
    </actions>
</cue>
```

(`event_player_signalled` is a placeholder; real detection typically polls `player.zone` changes via heartbeats.)

### Example 3: Compute highway transit time estimate

```xml
<do_if value="@player.zone.issuperhighway">
    <set_value name="$Progress"
        exact="player.zone.closestpointtoplayer.z"/>
    <set_value name="$Remaining"
        exact="(1.0f - $Progress) * 60s"
        comment="approximate — depends on highway speed"/>
    <write_to_logbook
        text="'Estimated time to exit: ' + $Remaining"/>
</do_if>
```

## Architectural context

- **Highway pathfinding:** Architectural overview *Highway routing* — how NPCs enter, traverse, and exit highways.
- **Local vs super:** Architectural overview *Highway topology* — visual / mechanic differences, speed multipliers.
- **Junction handling:** Architectural overview *Highway junctions* — how `junctions` list defines multi-stop highways.

## Related

- [Zone](/game/world/zone/) — parent abstraction.
- [Sector](/game/world/sector/) — what highways exist in (local) or connect (super).
- [Cluster](/game/world/cluster/) — what superhighways connect.
- [Gate](/game/world/gate/) — sibling connectivity mechanism (formal jumpgates vs highways).

---

:::tip[Pattern — typed connectivity zone]
Highway is the only zone subtype with dedicated connection-graph accessors (`.entry`, `.exit`, `.origin`, `.destination`, `.junctions`). Other zones use the bare `.adjacentzones` graph; highways model directed travel.
:::

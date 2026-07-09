---
title: Anomaly
description: Space-warp transition point. Flying a ship into one moves it to a paired anomaly. Used by story content for teleport gates and exploration encounters.
---

An **Anomaly** is a space-warp transition point. The player (or any ship) flying into one is teleported to one of its paired *destination* anomalies. They are the engine's mechanism for "wormhole gates" outside the formal gate network — used by story content, mentor missions, and exploration encounters.

**Inheritance:** `component → destructible → object → anomaly`. The datatype adds 3 transition-graph accessors.

**Anomalies form a directed graph.** Each anomaly has zero or more *destinations* (other anomalies). The engine adds the edges via `<add_anomaly_destination>`; story content removes them via `<remove_anomaly_destination>` when an arc concludes.

## Properties

### Anomaly-specific

| Property | Type | Description |
|---|---|---|
| `.destinations` | list | All anomalies this one transitions to. May be empty (dead end) |
| `.istransitionsource` | bool | This anomaly can be the starting point of a transition (i.e. ships entering it get teleported) |
| `.istransitiondestination` | bool | This anomaly is the receiving end of one or more transitions |

The two `is...` flags are independent — an anomaly can be **both** source and destination (most common, for bidirectional pairs), or **only one** (one-way pipe), or **neither** (placeholder / disabled).

### Useful inherited

| Property | Source | Description |
|---|---|---|
| `.sector` / `.zone` / `.position` | object | Anomaly location |
| `.knownname` | component | Display name |
| `.macro` | component | Anomaly variant |
| `.knowntoplayer` | component | Has been discovered |

## Actions

### Spawn an anomaly

```xml
<create_object
    name="$Anomaly"
    macro="$AnomalyMacro"
    owner="faction.ownerless"
    sector="$Sector">
    <position x="$x" y="$y" z="$z"/>
</create_object>
```

Anomalies belong to `faction.ownerless`.

### Wire up a transition between two anomalies

```xml
<add_anomaly_destination
    anomaly="$Anomaly_Entry"
    destination="$Anomaly_Exit"/>
```

Vanilla **always** uses this in pairs to make the transition bidirectional:

```xml
<add_anomaly_destination
    anomaly="$Anomaly_Entry"
    destination="$Anomaly_Exit"/>
<add_anomaly_destination
    anomaly="$Anomaly_Exit"
    destination="$Anomaly_Entry"/>
```

Pattern from `placedobjects.xml:56-57`, `story_research_welfare_1.xml:1525-1526`. For one-way transitions, add only one direction.

### Remove a transition (clean-up)

```xml
<remove_anomaly_destination
    anomaly="$Anomaly_1"
    destination="$Anomaly_2"/>
<remove_anomaly_destination
    anomaly="$Anomaly_2"
    destination="$Anomaly_1"/>
```

Pattern from `story_research_welfare_1.xml:1796-1797`. Called when a story arc concludes and the wormhole should close.

### Find all anomalies

```xml
<find_object name="$Anomalies"
    space="player.zone"
    class="class.anomaly"
    multiple="true"/>
```

Pattern from `tutorial_global.xml:175`. For story scripts that need to locate the player's nearest anomaly:

```xml
<find_object name="$Anomaly"
    class="class.anomaly"
    space="$Sector"/>
```

Pattern from `gs_boso.xml:326`, `gs_scientist.xml:167`.

### Read destination list

```xml
<do_for_each name="$dest"
    in="$Anomaly.destinations">
    <write_to_logbook
        text="'Destination: ' + $dest.knownname
            + ' in ' + $dest.sector.knownname"/>
</do_for_each>
```

## Events

There is no `event_anomaly_X` family. Transition events are observed indirectly:

| Event | When | Notes |
|---|---|---|
| `event_object_changed_sector` | A ship moved sectors — could be a normal jump OR an anomaly transition | To distinguish, check the previous sector and whether an anomaly was near the destination position |
| `event_object_destroyed` | Anomaly destroyed (rare; most are invincible) | Standard |

There is no built-in "ship took an anomaly" event. Most story scripts gate on player position + anomaly proximity rather than on an event.

## Common gotchas

- ⚠ **`.destinations` may be empty.** Even on a `.istransitionsource=true` anomaly during initialisation, before destinations are wired. Null-check before iterating.
- ⚠ **`add_anomaly_destination` is one-way only.** To make a bidirectional pair you MUST call it twice. Easy to forget — vanilla `placedobjects.xml:56-57` shows the pattern.
- ⚠ **`.istransitionsource` / `.istransitiondestination` are independent.** Don't assume one implies the other. A "graveyard" anomaly may only be a destination (you arrive but can't leave).
- ⚠ **Anomalies belong to `faction.ownerless`.** Don't set `.owner` when creating, or the player loses access.
- ⚠ **There's no `event_anomaly_entered`.** Watch `event_object_changed_sector` + proximity check, or signal_objects on the player from the anomaly's vicinity logic.
- ⚠ **Anomaly macros are story / DLC content.** Generic macro patterns don't exist — each story arc defines its own anomaly visual / behaviour macros.
- ⚠ **Removing destinations doesn't destroy the anomaly.** The visual stays in the world; only the transition link is severed. Use `<destroy_object>` separately if you want it gone.

## Examples

### Example 1: Create a wormhole pair between two sectors

```xml
<create_object
    name="$Anomaly_1"
    macro="$AnomalyMacro"
    owner="faction.ownerless"
    sector="$SectorA">
    <position x="0" y="0" z="0"/>
</create_object>

<create_object
    name="$Anomaly_2"
    macro="$AnomalyMacro"
    owner="faction.ownerless"
    sector="$SectorB">
    <position x="0" y="0" z="0"/>
</create_object>

<add_anomaly_destination
    anomaly="$Anomaly_1"
    destination="$Anomaly_2"/>
<add_anomaly_destination
    anomaly="$Anomaly_2"
    destination="$Anomaly_1"/>

<write_to_logbook
    text="'Wormhole established: '
        + $SectorA.knownname + ' ↔ '
        + $SectorB.knownname"/>
```

Pattern from `placedobjects.xml:56-57`.

### Example 2: Close a story-arc wormhole

```xml
<remove_anomaly_destination
    anomaly="$Anomaly_1"
    destination="$Anomaly_2"/>
<remove_anomaly_destination
    anomaly="$Anomaly_2"
    destination="$Anomaly_1"/>

<destroy_object object="$Anomaly_1"/>
<destroy_object object="$Anomaly_2"/>

<write_to_logbook text="'Wormhole closed.'"/>
```

Pattern from `story_research_welfare_1.xml:1796-1797`.

### Example 3: List all anomalies the player has discovered

```xml
<find_object name="$All"
    space="player.galaxy"
    class="class.anomaly"
    multiple="true"/>

<create_list name="$Discovered"/>

<do_for_each name="$a" in="$All">
    <do_if value="$a.knowntoplayer">
        <append_to_list name="$Discovered" exact="$a"/>
    </do_if>
</do_for_each>

<write_to_logbook
    text="'Player has discovered ' + $Discovered.count
        + ' anomalies'"/>
```

## Architectural context

- **How story arcs use anomalies:** Architectural overview *Story anomaly graph* — `story_research_welfare_1.xml`, mentor subscription content wire anomalies as temporary wormholes, then close them on completion.
- **Engine teleportation:** Architectural overview *Anomaly transition mechanics* — when a ship's position enters an anomaly's range, the engine picks a destination from `.destinations` and moves the ship.

## Related

- [Gate](/game/world/gate/) — formal galaxy connectivity. Anomalies are the *informal* / story-driven equivalent.
- [Sector](/game/world/sector/) — what anomalies exist in.
- [Ship](/game/objects/ship/) — what flies into them.
- [Datavault](/game/objects/datavault/) — sibling story-content object (different mechanic — unlock vs traverse).

---

:::tip[Pattern — directed-graph transition system]
Anomaly is the only world object with an explicit *graph API* (`add_anomaly_destination`, `remove_anomaly_destination`). Story scripts treat anomalies as edges-in-a-graph rather than as physical objects.
:::

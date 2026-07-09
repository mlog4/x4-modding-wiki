---
title: Gate
description: A connection point between sectors. Jumpgates, accelerators, highway entry/exit points.
---

A **Gate** is a connection point between [Sectors](/game/world/sector/) or between zones of a [Cluster](/game/world/cluster/). The gate graph is what `find_sector reachablefrom=` walks; the gate graph is what defines galaxy topology.

## Subtypes

The gate datatype has three concrete subtypes, plus the special Trans-Orbital Accelerator flag.

| Type | Datatype | Connects | Notes |
|---|---|---|---|
| **Jumpgate** | `gate` | Sector ↔ Sector (across cluster boundary in most cases) | The classic gate. `.isaccelerator=false`. |
| **Accelerator** | `gate` | Sector ↔ Sector | Trans-Orbital Accelerator (Tides of Avarice / Cradle of Humanity). Flagged by `.isaccelerator=true`. Same datatype, different visual + flavour. |
| **Highway entry** | `highwayentrygate` | Sector position → Highway | One end of a local or super-highway. |
| **Highway exit** | `highwayexitgate` | Highway → Sector position | Other end of a highway. |
| **Jumpbeacon** | `class.jumpbeacon` | Sector ↔ Sector | Player-deployable beacon (Pirate DLC). Treat as a gate when querying connectivity. |

All four are `class.gate` for `isclass` checks. The aiscripts use them interchangeably for travel — but properties differ.

## Properties

### gate

| Property | Type | Description |
|---|---|---|
| `.destination` | zone | Destination **zone** (not sector — chain through `.destination.sector` for sector lookup) |
| `.exit` | gate | The matching gate on the other side |
| `.isaccelerator` | bool | True for Trans-Orbital Accelerator |
| `.entryhighway` | highway | Highway that leads INTO this gate (rare; most gates are highway-independent) |
| `.exithighway` | highway | Highway this gate leads INTO |
| `.waitingship` | ship | Ship currently reserved at this gate, or null |

### highwayentrygate

| Property | Type | Description |
|---|---|---|
| `.highway` | highway | The highway this gate is the entry of |
| `.destination` | zone | Highway destination zone |
| `.exit` | highwayexitgate | The corresponding exit gate |
| `.waitingship` | ship | Reserved ship if any |

### highwayexitgate

| Property | Type | Description |
|---|---|---|
| `.highway` | highway | The highway this gate is the exit of |
| `.entry` | highwayentrygate | The corresponding entry gate |

### Inherited from object

Common: `.sector`, `.zone`, `.position`, `.knownname`, `.macro`. Use these for "where is this gate" queries.

## Actions

Gates are not created or destroyed at runtime from scripts — they are static map content defined in `maps/.../sectors.xml`. All script operations are queries.

### Find all gates in a sector

```xml
<find_gate name="$Gates"
    space="$Sector"
    multiple="true"/>
```

`space=` is **required**. Without it the action returns 0 results.

### Find only active jumpgates (excludes broken/disabled gates)

```xml
<find_gate name="$JumpGates"
    space="$OwnSector"
    active="true"
    multiple="true"/>
```

Vanilla `factionlogic.xml:967` uses this to enumerate connectivity for faction logic.

### Find gates that lead to a specific destination

```xml
<find_gate name="$LocalEntryPoints"
    destination="$Target"
    space="$AdjacentSectors.{$i}"
    multiple="true"/>
```

`destination=` filters by the **destination space** the gate goes to. Vanilla `factiongoal_hold_space.xml:152` and `factiongoal_invade_space.xml:246` use this for entry-point detection.

### Find gates in a whole cluster

```xml
<find_gate name="$Gates"
    space="$Cluster"
    multiple="true"/>
```

Vanilla `finalisestations.xml:422, 851` uses cluster scope.

### Find gates in the entire galaxy (rare — heavy)

```xml
<find_gate groupname="$gates"
    space="player.galaxy"
    multiple="true"/>
```

Vanilla `scenario_tutorials.xml:4520` uses this in a tutorial setup. For real gameplay logic, prefer a narrower scope (cluster or sector).

## Common idioms

### "Which sector does this gate lead to?"

```xml
<set_value name="$nextSector"
    exact="$gate.destination.sector"/>
```

`.destination` is a **zone**, not a sector — chain `.sector` to get to the sector.

### "Is the gate's destination hostile to me?"

```xml
<do_if value="$gate.destination.sector.owner.hasrelation.enemy.{$Faction}">
    <!-- skip this gate when planning travel -->
</do_if>
```

Pattern from vanilla `factionlogic_staticdefense.xml:746`. Used heavily for static-defence positioning.

### "Find the matching gate on the other side"

```xml
<set_value name="$otherSide" exact="$gate.exit"/>
```

`.exit` is the gate on the other end of the connection. Use this for two-way travel queries.

### "Is anyone already using this gate?"

```xml
<do_if value="@$gate.waitingship">
    <write_to_logbook
        text="$gate.knownname + ' busy: '
            + $gate.waitingship.knownname"/>
</do_if>
```

Useful for traffic-aware spawning.

## Libraries

Gate-specific libraries are minimal — most gate logic is inline. The closest helpers:

| Library | Purpose | Source line |
|---|---|---|
| `md.LIB_Generic.FindSectorExitPoints` | All active gates leaving a sector | 1166 |
| `md.LIB_Generic.FindSectorEntryPoints` | All active gates entering a sector | 1183 |
| `md.LIB_Generic.UncoverMap_SectorsAndGates` | Reveal sectors + gates on the player map | 2056 |
| `md.LIB_Generic.CreateShipAtExitGate` | Spawn a ship at a gate's exit-side | 1020 |
| `md.LIB_Generic.CreateFleetAtExitGate` | Spawn a fleet at a gate's exit-side | 889 |

## Events

There is no `event_gate_X` family. Gate-related events are observed indirectly:

| Indirect signal | Where |
|---|---|
| `event_object_changed_sector` | Ship crossed a gate (sector boundary) |
| `event_object_destroyed` | Gate itself was destroyed (rare; gates are usually invulnerable but moddable) |

For "ship X just entered sector Y", use `event_object_changed_sector` with a filter on the destination sector — gate is the means, sector boundary is what fires.

## Common gotchas

- ⚠ **`.destination` returns a *zone*, not a sector.** Almost every modder use case wants the sector — chain `.destination.sector`. Vanilla widely uses `$gate.destination.sector.owner`, `$gate.destination.sector.knownname`.
- ⚠ **`find_gate` without `space=` returns 0 results.** Even though "find all gates" sounds galaxy-wide. Always supply `space=` (sector, cluster, or `player.galaxy`).
- ⚠ **`active="true"` excludes disabled / broken / Xenon-blocked gates.** Without it you get the static map; with it you get currently-traversable. For travel logic use `active="true"`. For mapping use it without.
- ⚠ **`gate` datatype and `highwayentrygate`/`highwayexitgate` differ in property set.** A `find_gate` returns *only* `gate` instances by default. To find highway endpoints you may need `find_highway_entry_gate` and `find_highway_exit_gate` (specialised actions).
- ⚠ **Jumpbeacon is `class.jumpbeacon`, not `class.gate`.** `isclass.gate` returns false for jumpbeacons. For "anything that lets you travel" use `isclass.{class.gate} or isclass.{class.jumpbeacon}`.
- ⚠ **Trans-Orbital Accelerator is just `.isaccelerator=true` on a normal gate.** Same datatype. Treat identically for travel logic; differentiate only for flavour/UI text.
- ⚠ **`.waitingship` may be null even when ships are nearby.** It's only set when a ship has officially *reserved* the gate (queued for jump). Polling for "is the gate busy" should use proximity, not this.
- ⚠ **`.exit` may be null for one-way gates.** Some scripted gates / tutorials use one-way gates. Always null-check.

## Examples

### Example 1: Find all sectors reachable from the player's current sector

```xml
<find_gate name="$Gates"
    space="player.sector"
    active="true"
    multiple="true"/>

<create_list name="$ReachableSectors"/>

<do_for_each name="$gate" in="$Gates">
    <do_if value="@$gate.destination.sector
        and $ReachableSectors.indexof.{$gate.destination.sector} == 0">
        <append_to_list name="$ReachableSectors"
            exact="$gate.destination.sector"/>
    </do_if>
</do_for_each>

<write_to_logbook
    text="player.sector.knownname + ' reaches '
        + $ReachableSectors.count + ' sectors directly'"/>
```

### Example 2: Pick a random hostile-destination gate to spawn a raider near

```xml
<find_gate name="$Gates"
    space="$RaiderSector"
    active="true"
    multiple="true"/>

<create_list name="$HostileGates"/>

<do_for_each name="$gate" in="$Gates">
    <do_if value="@$gate.destination.sector.owner
        and $gate.destination.sector.owner.hasrelation.enemy.{$RaiderFaction}">
        <append_to_list name="$HostileGates" exact="$gate"/>
    </do_if>
</do_for_each>

<do_if value="$HostileGates.count gt 0">
    <set_value name="$spawnNear" exact="$HostileGates.random"/>
</do_if>
```

Variant of `factionlogic_staticdefense.xml:746-756`.

### Example 3: Spawn a ship coming through a specific gate

```xml
<run_actions ref="md.LIB_Generic.CreateShipAtExitGate"
    result="$ship">
    <param name="Gate" value="$myGate"/>
    <param name="Macro" value="$myShipMacro"/>
    <param name="Faction" value="faction.argon"/>
</run_actions>
```

The library handles the "appearing-out-of-gate" animation and positions the ship correctly on the exit side.

## Architectural context

- **How the galaxy map graph is defined:** Architectural overview *Galaxy map data* — `maps/.../sectors.xml` defines gate connections per sector, `mapdefaults.xml` declares cluster structure.
- **How factions reason about gate-based defence:** Architectural overview *Static defence positioning* — `factionlogic_staticdefense.xml` scores each gate by destination ownership and enemy-relation, places stations / drones at high-priority gates.
- **How NPCs use highways for in-cluster travel:** Architectural overview *Highway pathfinding* — local highways (intra-cluster) vs superhighways (inter-cluster), entry/exit gate selection.

## Related

- [Sector](/game/world/sector/) — what gates connect.
- [Cluster](/game/world/cluster/) — usually contains gates and highways.
- [Highway](/game/world/highway/) — the path entered via `highwayentrygate`.
- [Zone](/game/world/zone/) — `.destination` of a gate is a zone, not a sector.
- [Ship](/game/objects/ship/) — `.waitingship` reserves a gate.

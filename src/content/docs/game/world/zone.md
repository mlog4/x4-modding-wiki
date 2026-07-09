---
title: Zone
description: Sub-sector spatial unit. Where ships physically exist and combat happens. Adjacency graph for in-sector navigation.
---

A **Zone** is a sub-sector spatial unit — the actual coordinate space where ships physically exist. A [Sector](/game/world/sector/) typically contains 1–10 zones, organised in an adjacency graph. Zone-level queries answer "what's near me right now" rather than "what's in this sector".

**Inheritance:** `component → space → zone`.

**Highway is a zone subtype** — `[Highway](/game/world/highway/)` extends zone, so all highway logic is also zone logic.

## Properties

### Zone-specific

| Property | Type | Description |
|---|---|---|
| `.adjacentzones` | list | All zones directly adjacent to this one (in-sector graph) |
| `.haspriority` | bool | This zone has highest priority in its area (false for highways) |
| `.policefaction` | faction | Police faction for the zone (== zone owner's police faction; may be null) |
| `.size` | length | Zone edge length |
| `.istempzone` | bool | Currently a temporary zone (mission-created) |
| `.isnormalzone` | bool | Currently a normal zone (not temp, not gate, not highway) |
| `.isalwaysnormalzone` | bool | Always a normal zone — set at game start, doesn't change |
| `.islocalhighway` | bool | Is a local (intra-sector) highway zone |
| `.issuperhighway` | bool | Is a super (inter-sector) highway zone |
| `.hashazardousregionat.{position}` | bool | Position is inside a hazardous region |
| `.isregioncurrentlyhazardousat.{position}` | bool | Position is in a *currently active* hazardous region |

### Inherited from space

| Property | Source | Description |
|---|---|---|
| `.economy` / `.security` | space | Per-zone modifiers |
| `.locationtags` / `.alllocationtags` | space | Zone tags |
| `.accesslicence` / `.accessrestricted` | space | Licence-gated access |

## Common patterns

### "Is this object's container a zone?"

Pattern from vanilla `encounters.xml` (heavy use, 9 sites):

```xml
<do_if value="$LeadShip.parent.isclass.zone">
    <!-- ship is in a zone (could be sub-sector or highway) -->
</do_if>
```

Encounter scripts use this to distinguish "ship is free-flying in a zone" from "ship is docked at a station / inside a build module".

### "Highway navigation"

```xml
<set_value name="$locationobject"
    exact="if @$Origin.zone.issuperhighway
           then $Origin.zone.exit
           else $Origin"/>
```

Pattern from `conversations.xml:1616`. Used to redirect "where am I" queries — superhighway-traveling ships get their *exit point* instead of their current highway position.

### "Find normal zones in a sector"

```xml
<find_zone
    name="$NormalZones"
    space="$Sector"
    normalzone="true"
    multiple="true"/>
```

The `normalzone="true"` filter on `find_zone` excludes highways and temp zones.

### "Walk the zone adjacency graph"

```xml
<do_for_each name="$adj" in="$Zone.adjacentzones">
    <do_if value="$adj.isnormalzone">
        <!-- direct neighbour, useful for traffic / navigation -->
    </do_if>
</do_for_each>
```

## Events

There is no `event_zone_X` family. Zone changes are observed indirectly:

| Event | When | Notes |
|---|---|---|
| `event_object_changed_sector` | Cross sector boundary | Closest proxy for "left a zone" — see [Sector](/game/world/sector/) Events |

For zone-specific traffic events, use `event_object_attacked` or `event_object_destroyed` filtered by `event.object.zone == $WatchedZone`.

## Common gotchas

- ⚠ **`.adjacentzones` is in-sector only.** It does NOT include zones across a gate or highway. For inter-sector neighbour lookup, walk the gate graph.
- ⚠ **`.isnormalzone` and `.isalwaysnormalzone` differ for runtime-modified zones.** A normal zone with a temporary mission-spawn flag has `.isnormalzone=false, .isalwaysnormalzone=true`. Use the right one for your logic.
- ⚠ **Highways are zones.** `class.highway` IS-A `class.zone`. To find non-highway zones, filter with `not .islocalhighway and not .issuperhighway`.
- ⚠ **`.size` is edge length, not area.** Edge of a cubic-ish region. Don't square it for "zone area" — use it as the bounding edge.
- ⚠ **`.policefaction` is null for ownerless / contested zones.** Always null-check.
- ⚠ **`.haspriority=false` for highways.** When iterating zones with priority semantics (combat priority, mission spawn priority), highways get deprioritised.

## Examples

### Example 1: List all zones in a sector

```xml
<find_zone
    name="$Zones"
    space="$Sector"
    multiple="true"/>

<do_for_each name="$z" in="$Zones">
    <write_to_logbook
        text="$z.knownname + ' (size: ' + $z.size + ')'"/>
</do_for_each>
```

### Example 2: Check player's current zone for hazard

```xml
<do_if value="@player.zone
    and player.zone.isregioncurrentlyhazardousat.{player.ship.position}">
    <write_to_logbook
        text="'Player in hazardous zone region'"/>
</do_if>
```

### Example 3: Walk adjacency to find nearest enemy-owned zone

```xml
<create_list name="$Checked"/>
<set_value name="$Found" exact="null"/>

<do_for_each name="$z" in="player.zone.adjacentzones">
    <do_if value="@$z.policefaction
        and $z.policefaction.hasrelation.enemy.{faction.player}">
        <set_value name="$Found" exact="$z"/>
        <break/>
    </do_if>
</do_for_each>

<do_if value="@$Found">
    <write_to_logbook
        text="'Hostile adjacent zone: ' + $Found.knownname"/>
</do_if>
```

## Architectural context

- **Zone graph for traffic / patrol:** Architectural overview *Zone adjacency* — how patrols and traffic use the adjacency graph for in-sector pathing.
- **Highway zone behaviour:** Architectural overview *Highway flow* — local vs super, junctions, entry/exit zone semantics.
- **Hazardous regions:** Architectural overview *Hazardous regions* — how regions are projected onto zone position-tests.

## Related

- [Sector](/game/world/sector/) — parent container.
- [Highway](/game/world/highway/) — zone subtype.
- [Region](/game/world/region/) — what hazardous-region tests project from.
- [Gate](/game/world/gate/) — connects zones across sector boundaries.
- [Ship](/game/objects/ship/) — what populates zones.

---

:::tip[Pattern — fine-grained spatial unit with in-graph adjacency]
Zone is the only spatial type with a runtime *graph adjacency* accessor (`.adjacentzones`). Sectors connect via gates; clusters connect via the galaxy graph; zones connect via direct adjacency. Use this distinction when modelling spatial logic.
:::

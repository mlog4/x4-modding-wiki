---
title: Region
description: Engine-defined zones of space with environmental properties — resource regions, hazardous regions, nebula regions. Empty datatype; effects projected via cluster/sector/zone position-tests.
---

A **Region** is an engine-defined sub-volume of space with environmental properties. Resource regions (where asteroids spawn), hazardous regions (Wave anomaly zones), and nebula regions all use this class. The `region` datatype is **empty** (`scriptproperties.xml:1356`) — region effects are exposed through *position-test accessors* on [Sector](/game/world/sector/), [Cluster](/game/world/cluster/), and [Zone](/game/world/zone/).

**Inheritance:** `component → region`. Like [Nav beacon](/game/objects/nav-beacon/), region is a class label with no own properties.

## Properties

There are no region-specific properties. Region effects are read via:

### Sector-level

| Accessor | Description |
|---|---|
| `Sector.hashazardousregion` | Sector has any hazardous region |
| `Sector.hashazardousregionat.{position}` | A specific position is inside a hazardous region |
| `Sector.isregioncurrentlyhazardousat.{position}` | Position is in a *currently active* hazardous region |
| `Sector.hasgravidarobscuringregion` | Sector has a nebula (gravidar-obscuring) region |
| `Sector.gravidarfactorat.{position}` | Gravidar interference at the position (0..1) |
| `Sector.resources` | All resource wares present (driven by resource regions) |
| `Sector.yieldrating.{ware}` | Sector's yield rating for a ware |

### Cluster-level

| Accessor | Description |
|---|---|
| `Cluster.hashazardousregionat.{position}` | Cluster position is in a hazardous region |
| `Cluster.isregioncurrentlyhazardousat.{position}` | Currently active hazardous |
| `Cluster.gravidarfactorat.{position}` | Gravidar at cluster position |

### Zone-level

| Accessor | Description |
|---|---|
| `Zone.hashazardousregionat.{position}` | Zone position is in a hazardous region |
| `Zone.isregioncurrentlyhazardousat.{position}` | Currently active |

The accessors are layered — galaxy → cluster → sector → zone. Each level projects the same region info via position-tests.

## Region types

Vanilla regions fall into a few categories (data defined in `libraries/regions.xml` and similar):

| Type | Effect | Read via |
|---|---|---|
| Resource region | Asteroids spawn, mining yield | `Sector.resources`, `Sector.yieldrating.{ware}` |
| Hazardous region | Damage over time, Wave anomaly | `hashazardousregionat.{position}` |
| Gravidar-obscuring (nebula) | Radar reduction | `gravidarfactorat.{position}`, `hasgravidarobscuringregion` |

There is no `class.region.resource` / `class.region.hazardous` enum — type discrimination happens via the accessor used to test.

## Common patterns

### "Is this spawn position safe?"

```xml
<do_if value="$Sector.isregioncurrentlyhazardousat.{$Position}">
    <!-- not safe — pick another spot -->
</do_if>
```

The `currentlyhazardous` form accounts for the fact that some regions cycle (active / inactive).

### "Pick a position inside a nebula sector"

Use the vanilla library:

```xml
<run_actions
    ref="md.LIB_Generic.GetGravidarObscuringSectorPosition"
    result="$pos">
    <param name="Sector" value="$NebulaSector"/>
</run_actions>
```

Pattern from `lib_generic.xml:1384`. Wraps the gravidar accessor and picks a usable position.

### "Filter sectors that have nebula regions"

```xml
<find_sector
    name="$NebulaSectors"
    space="player.galaxy"
    hasgravidarobscuringregion="true"
    multiple="true"
    extension="''"/>
```

Pattern from vanilla `factionlogic_stations.xml:298`. The `hasgravidarobscuringregion="true"` filter on `find_sector` is dedicated.

### "Read sector mining yield"

```xml
<set_value name="$OreRating"
    exact="$Sector.yieldrating.{ware.ore}"/>

<do_if value="$OreRating ge 10">
    <!-- rich ore sector -->
</do_if>
```

Yield rating is 0..15 (same scale as [Resource probe](/game/objects/resource-probe/)).

## Common gotchas

- ⚠ **Region datatype declares NO properties.** All region info comes via parent (cluster / sector / zone) position-test accessors.
- ⚠ **`hashazardousregionat` (static) vs `isregioncurrentlyhazardousat` (current).** The first is "this position is inside a defined hazardous region"; the second is "...and it's hazardous right now". Some regions cycle.
- ⚠ **No `find_object class=class.region`.** Regions are not first-class objects in the find-graph. Use sector/cluster/zone accessors instead.
- ⚠ **`gravidarfactorat` returns 0..1.** 0 = clear, 1 = full obscure. Treat as a multiplier.
- ⚠ **Multiple regions can overlap.** A position can be in both a nebula AND a hazardous region. Accessors don't disambiguate which region triggered the effect.
- ⚠ **Position arguments are in the relevant space's coordinates.** `Sector.hashazardousregionat.{$pos}` expects sector-local coords; `Cluster.X` expects cluster-coords. They differ for the same logical position.

## Examples

### Example 1: Safe-spawn loop

```xml
<set_value name="$Attempt" exact="0"/>
<set_value name="$Position" exact="null"/>

<do_while value="$Attempt lt 10 and not @$Position">
    <set_value name="$Candidate"
        exact="position.[random.range.5km..30km,
                         0,
                         random.range.5km..30km]"/>

    <do_if value="not $Sector.isregioncurrentlyhazardousat.{$Candidate}">
        <set_value name="$Position" exact="$Candidate"/>
    </do_if>

    <set_value name="$Attempt"
        operation="add" exact="1"/>
</do_while>

<do_if value="@$Position">
    <write_to_logbook
        text="'Safe position found: ' + $Position"/>
</do_if>
```

### Example 2: Find all mining-rich sectors for a ware

```xml
<find_sector
    name="$Sectors"
    space="player.galaxy"
    multiple="true"
    extension="''"/>

<create_list name="$Rich"/>

<do_for_each name="$s" in="$Sectors">
    <do_if value="$s.yieldrating.{ware.silicon} ge 12">
        <append_to_list name="$Rich" exact="$s"/>
    </do_if>
</do_for_each>

<write_to_logbook
    text="$Rich.count + ' rich silicon sectors'"/>
```

## Architectural context

- **Region system:** Architectural overview *Region mechanics* — how `libraries/regions.xml` projects environmental effects onto sectors/clusters/zones.
- **The Wave anomaly:** Architectural overview *The Wave* — a runtime-toggling hazardous region in specific sectors.
- **Nebula gravidar mechanics:** Architectural overview *Nebula combat* — gravidar reduction effects on weapon ranges and detection.

## Related

- [Sector](/game/world/sector/) — primary parent that exposes region effects.
- [Cluster](/game/world/cluster/) — also exposes region effects (galaxy-level).
- [Zone](/game/world/zone/) — also exposes region effects (sector-level).
- [Asteroid](/game/objects/asteroid/) — what spawns in resource regions.
- [Resource probe](/game/objects/resource-probe/) — scans for regions' yield.

---

:::tip[Pattern — empty datatype with position-test accessors on parents]
Region is the only abstraction that exists entirely as *projected accessors on other types*. There's no `Region.X` accessor; everything is `Sector.hasRegionAtX`, `Cluster.regionFactorAt.X`, etc. This pattern lets the engine compose multiple overlapping regions transparently.
:::

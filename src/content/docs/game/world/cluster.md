---
title: Cluster
description: Star system grouping. Container for sectors. The level where sector-ownership change events fire.
---

A **Cluster** is a grouping of [Sectors](/game/world/sector/) that share a star system. Visually, a cluster maps to one hex on the player's galaxy map (which can contain 1–3 sectors).

**Inheritance:** `component → space → cluster`. From `space` come `economy`, `security`, `jobs`, `locationtags`. Cluster-specific additions cover terraforming, planets/moons, and cluster-flavour flags.

**Why this matters for modders:**
- **Sector-ownership change events fire on the cluster**, not the sector — a vanilla quirk that's easy to miss. See Events below.
- Many faction-logic libraries operate on cluster-granularity (`factiongoal_hold_space` uses `$LocalClusters`/`$AdjacentClusters`).
- Terraforming, planet-related, and "system-id" data live here.

**Hierarchy:**

```
galaxy → cluster → sector → zone → highway
```

The `space` base type backs all five — `find_sector`, `find_zone`, `find_gate` all accept either a sector, cluster, or galaxy as `space=`.

## Properties

### Inherited from space

| Property | Type | Description |
|---|---|---|
| `.economy` | float | Economy modifier for spawned content |
| `.security` | float | Security level |
| `.sunlight` | largefloat | Sunlight value (for solar production) |
| `.god` | bool | god.xml entries allowed |
| `.jobs` | bool | job entries allowed |
| `.factionlogic` | bool | Faction logic allowed |
| `.locationtags` | list | Tags of this cluster (`tag.argonprime`, ...) |
| `.alllocationtags` | list | Tags + inherited tags |
| `.haslocationtag.{tag}` | bool | Check tag in cluster + parents |
| `.accesslicence` | string | Licence required to enter (`null` if open) |
| `.accessrestricted` | bool | Restricted for player |

### Cluster-specific

| Property | Type | Description |
|---|---|---|
| `.isnormalcluster` | bool | True for in-galaxy clusters (not cutscene / venture / exploration) |
| `.ispresentation` | bool | Cutscene cluster |
| `.isexploration` | bool | Exploration content |
| `.isventurer` | bool | Ventures DLC content |
| `.systemid` | int | Star-system id (0 if cluster is the only one in its system) |
| `.gravidarfactorat.{position}` | float | Gravidar interference at a cluster position |
| `.hashazardousregionat.{position}` | bool | Position is inside a hazardous region |
| `.isregioncurrentlyhazardousat.{position}` | bool | Hazardous *now* (regions can toggle) |
| `.planets` | list | Part names of planets (data from `mapdefaults.xml`) |
| `.moons.{string}` | list | Part names of moons of a given planet |
| `.world.{name}.size` | length | Diameter of a world |
| `.world.{name}.position.{component}` | position | Position relative to a component |

### Terraforming (Tides of Avarice / Terraforming DLC)

| Property | Type | Description |
|---|---|---|
| `.terraforming.partname` | string | Template part name of the terraformable planet |
| `.terraforming.planetposition.{component}` | position | Where the planet is |
| `.terraforming.stat.{statid}.value` | largeint | Current stat value |
| `.terraforming.stat.{statid}.state` | int | UI state (color) |
| `.terraforming.activeproject.exists` | bool | A project is running |
| `.terraforming.activeproject.id` | string | Project id |
| `.terraforming.project.{projectid}.exists` | bool | Project exists for this cluster |
| `.terraforming.project.{projectid}.successchance` | int | Chance % |
| `.terraforming.project.{projectid}.resources` | wareamountlist | Required resources |
| `.terraforming.project.{projectid}.complete` | bool | Has been completed once |
| `.terraforming.mission.active` / `.complete` | bool | Mission tracking |
| `.terraforming.habitable` | bool | World habitable after terraforming |

### Indirect — sectors of a cluster

Cluster doesn't have a `.sectors` property — use `find_sector space="$cluster" multiple="true"`.

## Actions

Cluster is mostly a query target — there are no `<create_cluster>` / `<destroy_cluster>` actions at runtime; clusters are defined in `libraries/mapdefaults.xml` and `maps/.../sectors.xml`. Operations on a cluster usually go through `find_sector` / `find_zone` / `find_gate` with `space="$cluster"`.

### Find sectors in a cluster

```xml
<find_sector name="$Sectors"
    space="$cluster"
    multiple="true"/>
```

### Find sectors of a faction within a cluster

```xml
<find_sector name="$ArgonSectors"
    space="$cluster"
    owner="faction.argon"
    multiple="true"/>
```

### Probe gravidar / hazard at a position

```xml
<do_if value="$cluster.hashazardousregionat.{$position}
              and $cluster.isregioncurrentlyhazardousat.{$position}">
    <!-- avoid spawning a ship here right now -->
</do_if>
```

## Libraries

Cluster-specific helpers are sparse; cluster is mostly a passthrough for sector-level queries. The closest helpers:

| Library | Purpose | Source line |
|---|---|---|
| `md.LIB_Generic.UncoverMap_SectorsAndGates` | Reveal sectors + gates in cluster scope | 2056 |
| `md.LIB_Generic.GetGravidarObscuringSectorPosition` | Position-pick inside nebula-cluster sectors | 1384 |

For sector iteration / sector ownership / sector neighbour queries, work at the [Sector](/game/world/sector/) level — cluster is the lookup space, sector is the target.

## Events

| Event | When | Notes |
|---|---|---|
| `event_contained_sector_changed_true_owner` | A sector inside the cluster changed true owner | ⚠ **Fires on the cluster**, not the sector. `event.object` = cluster, `event.param` = sector |
| `event_contained_sector_changed_owner` | A sector inside the cluster changed owner | Same firing-location quirk. Vanilla `setup.xml:993` filters by `owner=faction.player` to detect player territory growth |
| `event_sector_resource_depleted` | A resource region in a sector inside this cluster depleted | Can also be observed at sector level — see [Sector](/game/world/sector/) |

**No `event_cluster_X` family.** Cluster events all use the `event_contained_sector_X` form because the gameplay-relevant change is always at sector level — the cluster is just the convenient watching scope.

## Common gotchas

- ⚠ **`event_contained_sector_changed_true_owner` payload is the *sector*, but the event fires on the *cluster*.** This is a vanilla quirk. To watch one specific cluster, set `space="$cluster"`. To watch the whole galaxy, set `space="player.galaxy"` (vanilla `finalisestations.xml:1030`).
- ⚠ **There is no `.sectors` accessor on cluster.** Use `find_sector space="$cluster" multiple="true"` — the find_* action is the only path.
- ⚠ **`isnormalcluster` filters out cutscene / venture / exploration clusters.** When iterating galaxy clusters for gameplay logic, always filter by `isnormalcluster` to skip presentation-only spaces (see `factionlogic_economy.xml`).
- ⚠ **`systemid` is 0 for single-cluster systems.** Don't use it as a unique key without checking — solo-cluster systems all share `0`. For uniqueness use the cluster ref itself or `.knownname`.
- ⚠ **`hashazardousregionat.{position}` vs `isregioncurrentlyhazardousat.{position}`.** The first is "this position is inside a defined hazardous region"; the second is "...and it is hazardous *now*" (some regions cycle). For spawn-safety always check the second.
- ⚠ **`.locationtags` vs `.alllocationtags`.** The plain form excludes parent-space tags; `.alllocationtags` includes them. For "is this in Argon space" use the plain form to avoid false positives from inherited tags.
- ⚠ **Cluster ownership is implicit.** There's no `cluster.owner` — clusters are owned-by-sector-majority implicitly. Read `find_sector space="$cluster" owner="$faction" multiple="true"` and compare counts.

## Examples

### Example 1: List all argon-owned sectors in a player's current cluster

```xml
<find_sector name="$ArgonSectors"
    space="player.cluster"
    owner="faction.argon"
    multiple="true"/>

<write_to_logbook
    text="player.cluster.knownname + ' has '
        + $ArgonSectors.count + ' Argon sectors.'"/>
```

### Example 2: Watch for player territory expansion (galaxy-wide)

```xml
<cue name="WatchPlayerTerritory" instantiate="true">
    <conditions>
        <event_contained_sector_changed_owner
            owner="faction.player"
            space="player.galaxy"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player gained ' + event.param.knownname
                + ' in ' + event.object.knownname"/>
    </actions>
</cue>
```

Vanilla `setup.xml:993` uses exactly this pattern.

### Example 3: Skip cutscene / venture clusters when iterating

```xml
<find_cluster name="$Clusters" space="player.galaxy" multiple="true"/>

<do_for_each name="$cluster" in="$Clusters">
    <do_if value="$cluster.isnormalcluster">
        <!-- safe to operate on -->
    </do_if>
</do_for_each>
```

## Architectural context

- **How clusters are wired into the galaxy map:** Architectural overview *Galaxy map data* — `mapdefaults.xml` + `maps/.../sectors.xml` define cluster bounds, included sectors, and gate connectivity.
- **How factions reason about cluster-scope territory:** Architectural overview *Faction goals* — `factiongoal_hold_space` and `factiongoal_invade_space` operate on cluster sets via `$LocalClusters` and `$AdjacentClusters`.
- **Terraforming pipeline:** Architectural overview *Terraforming* — projects, resources, success chance, habitable transition.

## Related

- [Sector](/game/world/sector/) — child container.
- [Galaxy](/game/world/galaxy/) — parent (the root).
- [Gate](/game/world/gate/) — connectivity between clusters via jumpgates.
- [Highway](/game/world/highway/) — local highway (intra-cluster) and superhighway (inter-cluster).
- [Faction](/game/factions/faction/) — owners of sectors inside the cluster.

---
title: Galaxy
description: The root spatial container. Accessed via player.galaxy. Holds all clusters, sectors, ships, stations, and faction representatives.
---

A **Galaxy** is the root spatial container — the universe-level entity. Vanilla has exactly one galaxy at any time, accessed via `player.galaxy`. It contains all [Clusters](/game/world/cluster/), [Sectors](/game/world/sector/), and everything in them.

**Inheritance:** `component → space → galaxy`.

## Properties

### Galaxy-specific

| Property | Type | Description |
|---|---|---|
| `.representatives` | list | All faction representatives in the galaxy |

That's it — the galaxy datatype is minimal. Almost all useful work is delegated to inherited `space` accessors or to `find_*` calls that take `space="player.galaxy"`.

### Inherited from space

| Property | Source | Description |
|---|---|---|
| `.economy` / `.security` / `.sunlight` | space | Universe-level modifiers |
| `.jobs` / `.god` / `.factionlogic` | space | Toggles (true at galaxy level) |
| `.locationtags` / `.alllocationtags` | space | Universe tags |
| `.accesslicence` / `.accessrestricted` | space | (Typically null at galaxy) |

## The `player.galaxy` accessor

`player.galaxy` is the universal "the galaxy" reference. It's used as the `space=` parameter in galaxy-wide finds:

```xml
<find_ship_by_true_owner
    name="$Ships"
    space="player.galaxy"
    faction="faction.player"
    multiple="true"/>

<find_station_by_true_owner
    name="$Stations"
    space="player.galaxy"
    faction="faction.argon"
    multiple="true"/>

<find_sector
    name="$AllSectors"
    space="player.galaxy"
    multiple="true"/>
```

For most modder use cases, the galaxy IS `player.galaxy`. Don't overthink this — there's only one.

## Common patterns

### "List faction representatives in the galaxy"

```xml
<do_for_each name="$rep" in="player.galaxy.representatives">
    <write_to_logbook
        text="$rep.knownname + ' represents '
            + $rep.race.knownname"/>
</do_for_each>
```

### "Detect player territory expansion galaxy-wide"

```xml
<cue name="WatchPlayerTerritory" instantiate="true">
    <conditions>
        <event_contained_sector_changed_owner
            owner="faction.player"
            space="player.galaxy"/>
    </conditions>
    <actions>
        <!-- ... -->
    </actions>
</cue>
```

Pattern from vanilla `setup.xml:993` (see [Cluster](/game/world/cluster/) — sector ownership events fire on the cluster, but the listener scope is the galaxy).

### "Find every sector that meets criteria"

```xml
<find_sector
    name="$EnemySectors"
    space="player.galaxy"
    owner="$EnemyFaction"
    multiple="true"/>
```

## Events

Galaxy itself doesn't fire events — it's the *scope* for events fired at lower levels. Use the contained-X event family:

| Event | When | Notes |
|---|---|---|
| `event_contained_sector_changed_owner` | Sector ownership changed within scope | Fires on cluster; use `space="player.galaxy"` to listen galaxy-wide |
| `event_contained_sector_changed_true_owner` | True-owner sector change | Same scope pattern |

## Common gotchas

- ⚠ **There is only ONE galaxy.** Don't try to enumerate "all galaxies" — `player.galaxy` is THE galaxy.
- ⚠ **`player.galaxy` exists even before the player has met any faction.** It's the universe root; always accessible.
- ⚠ **Galaxy-wide `find_*` calls are expensive.** Even with `space="player.galaxy"`, a find_ship_by_true_owner across the universe iterates many objects. For per-tick logic, scope narrower (cluster / sector).
- ⚠ **`.representatives` is universe-wide.** Includes every active faction's representative regardless of whether the player has unlocked diplomacy with them.
- ⚠ **Galaxy is `class.galaxy`, not `class.space`.** Even though it extends space, the discriminator class is dedicated.

## Examples

### Example 1: Count all sectors in the galaxy

```xml
<find_sector
    name="$AllSectors"
    space="player.galaxy"
    multiple="true"/>

<write_to_logbook
    text="'Galaxy has ' + $AllSectors.count + ' sectors'"/>
```

### Example 2: Galaxy-wide bargain hunt

```xml
<find_station_by_true_owner
    name="$All"
    space="player.galaxy"
    multiple="true"/>

<set_value name="$Cheapest" exact="null"/>
<set_value name="$LowestPrice" exact="1000000000Cr"/>

<do_for_each name="$s" in="$All">
    <do_if value="$s.sellprice.{$ware} gt 0
        and $s.sellprice.{$ware} lt $LowestPrice">
        <set_value name="$Cheapest" exact="$s"/>
        <set_value name="$LowestPrice"
            exact="$s.sellprice.{$ware}"/>
    </do_if>
</do_for_each>

<do_if value="@$Cheapest">
    <write_to_logbook
        text="'Cheapest ' + $ware.name
            + ' at ' + $Cheapest.knownname
            + ' for ' + $LowestPrice + 'Cr'"/>
</do_if>
```

## Architectural context

- **Galaxy-level event scopes:** Architectural overview *Event scoping* — how `space="player.galaxy"` differs from per-cluster / per-sector listeners.
- **Per-galaxy faction registry:** Architectural overview *Faction registry* — how `player.galaxy.representatives` is populated.

## Related

- [Cluster](/game/world/cluster/) — children.
- [Sector](/game/world/sector/) — descendants.
- [Faction](/game/factions/faction/) — `.representatives` are entities of factions.
- All other game abstractions — galaxy is the root container they all live in.

---

:::tip[Pattern — singleton root container]
Galaxy is the canonical *universe singleton*. Always accessed by `player.galaxy`. Modders rarely interact with the galaxy datatype directly — they use it as a `space=` scope and read its `.representatives` for diplomacy content.
:::

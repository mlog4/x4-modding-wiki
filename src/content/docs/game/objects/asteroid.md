---
title: Asteroid
description: Natural mining target. Class label without a dedicated datatype — includes miningnode, crystal, and recyclable as related classes.
---

An **Asteroid** is a natural mining target — a floating rock in a [Sector](/game/world/sector/) that mining ships can extract resources from. Vanilla uses `class.asteroid` as the catch-all for mining-eligible rocks; `class.miningnode`, `class.crystal`, and `class.recyclable` are related class labels with slightly different gameplay roles.

**No dedicated datatype.** Asteroids are `class.asteroid` but `scriptproperties.xml` has **no `asteroid` datatype** — the class is a label, properties come from inherited `object` and from per-macro `.wares`. Same shape as [Bomb](/game/objects/bomb/), [Checkpoint](/game/objects/checkpoint/), [Welfare module](/game/objects/welfare-module/).

## Related class labels

| Class | Purpose | Distinction |
|---|---|---|
| `class.asteroid` | Catch-all for "minable rock" | Most mineable objects qualify |
| `class.miningnode` | Specific asteroid types that mining drones target | A subtype within mining-targetable rocks |
| `class.crystal` | Crystal asteroids (rare; Terran/special crystal fields) | Distinct visual + ware content |
| `class.recyclable` | Scrap cubes / derelict hulls for [Processing modules](/game/objects/processing-module/) | Not technically asteroids — but adjacent |

`class.recyclable` is what the [Processing module](/game/objects/processing-module/) consumes via `process_recyclable_object`; the others are mined via drilling weapons.

## Properties

There are no asteroid-specific datatype properties. Useful inherited:

| Property | Source | Description |
|---|---|---|
| `.wares` | (per-macro) | Contained ware(s) — what mining extracts |
| `.sector` / `.zone` / `.position` | object | Location |
| `.macro` | component | Asteroid macro variant |
| `.hull` | destructible | Damage state — mining drills reduce hull, exhausting yields fragments |

The `.wares` accessor is the most-used asteroid-specific check:

```xml
<do_if value="@player.target.isclass.asteroid
    and @player.target.wares.count">
    <!-- mining-targetable asteroid with ware content -->
</do_if>
```

Pattern from vanilla `scenario_tutorials.xml:15113, 15124`.

## Common patterns

### "Detect asteroid attacked (mining started)"

Pattern from vanilla `cinematiccamera.xml:73`:

```xml
<do_if value="event.name == 'event_object_attacked_object'
    and event.param.isclass.asteroid
    or event.name == 'event_object_miningdrones_armed'">
    <!-- mining activity -->
</do_if>
```

The `event_object_miningdrones_armed` is the alternative trigger for drone-mining.

### "Track player drilling an asteroid"

Pattern from vanilla `tutorial_mining.xml:682, 708`:

```xml
<event_object_attacked_object/>
<check_value value="event.param.isclass.asteroid"/>
```

Used to detect the moment the player's drill hits a rock — `event.param` is the asteroid, `event.object` is the attacker (the player's ship/drill).

### "Detect mining node specifically"

Pattern from `scenario_tutorials.xml:15187`:

```xml
<check_value value="event.param.isclass.miningnode"/>
```

When the tutorial needs to specifically detect the drone-targetable node type rather than a generic asteroid.

### "Find asteroid shards (mining output, collectablewares)"

Pattern from vanilla `scenario_advanced.xml:1561-1570`:

```xml
<check_value value="event.param.isclass.asteroid"/>
<!-- ... later ... -->
<find_object
    groupname="$asteroidshards"
    class="[class.collectablewares]"
    space="$ResourceSector"
    multiple="true"/>

<do_for_each name="$shard" in="$asteroidshards">
    <do_if value="not $shard.isdroppedcontainer">
        <!-- this is an asteroid shard, not a dropped cargo container -->
    </do_if>
</do_for_each>
```

See also [Collectablewares](/game/objects/collectablewares/) `.isdroppedcontainer=false` for asteroid shards.

## Events

There is no `event_asteroid_X` family. Mining activity is observed via:

| Event | When | Notes |
|---|---|---|
| `event_object_attacked_object` | Asteroid attacked (drill hit) | `event.param.isclass.asteroid` filter |
| `event_object_miningdrones_armed` | Mining drones activated | Vanilla `cinematiccamera.xml:73` |
| `event_object_destroyed` | Asteroid exhausted / depleted | Standard |

## Common gotchas

- ⚠ **No `asteroid` datatype.** Class label only. Properties come from inherited object + per-macro `.wares`.
- ⚠ **`class.asteroid` is a category, not a specific type.** Mining nodes, crystals, and certain Terran-specific rocks all qualify. Use `class.miningnode` / `class.crystal` for narrower checks.
- ⚠ **`.wares.count` may be 0 for depleted asteroids.** Always check before assuming mining yield. Vanilla `scenario_tutorials.xml:15113` uses `@player.target.wares.count` for the truthy/non-zero check.
- ⚠ **Recyclables are NOT asteroids.** `class.recyclable` is a separate class for [Processing modules](/game/objects/processing-module/), even though scrap cubes look similar to asteroids visually.
- ⚠ **NPC miners read sector-level yield, not per-asteroid `.wares`.** NPC mining decisions use `Sector.yieldrating.{ware}` — see [Region](/game/world/region/). Don't expect NPCs to iterate asteroids.
- ⚠ **Asteroid shards (post-mining) are `class.collectablewares`, not `class.asteroid`.** They drop into the pickup graph — see [Collectablewares](/game/objects/collectablewares/) `isdroppedcontainer=false` for the distinction.

## Examples

### Example 1: Count silicon asteroids in a sector

```xml
<find_object
    name="$Asteroids"
    space="$Sector"
    class="class.asteroid"
    multiple="true"/>

<set_value name="$SiliconRocks" exact="0"/>

<do_for_each name="$rock" in="$Asteroids">
    <do_if value="$rock.wares.indexof.{ware.silicon} gt 0">
        <set_value name="$SiliconRocks"
            operation="add" exact="1"/>
    </do_if>
</do_for_each>

<write_to_logbook
    text="$Sector.knownname + ' has '
        + $SiliconRocks + ' silicon asteroids'"/>
```

### Example 2: Detect player asteroid mining

```xml
<cue name="WatchPlayerMining" instantiate="true">
    <conditions>
        <event_object_attacked_object/>
        <check_value
            value="event.param.isclass.asteroid
                and event.object.isplayerowned"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player mining: '
                + event.param.macro.knownname"/>
    </actions>
</cue>
```

### Example 3: Pick a richest crystal field

```xml
<find_object
    name="$Crystals"
    space="player.galaxy"
    class="class.crystal"
    multiple="true"/>

<set_value name="$best" exact="null"/>
<set_value name="$bestRating" exact="0"/>

<do_for_each name="$c" in="$Crystals">
    <set_value name="$rating"
        exact="$c.sector.bestyieldrating.{ware.silicon}"/>
    <do_if value="$rating gt $bestRating">
        <set_value name="$best" exact="$c"/>
        <set_value name="$bestRating" exact="$rating"/>
    </do_if>
</do_for_each>
```

## Architectural context

- **Mining gameplay loop:** Architectural overview *Mining* — drill ↔ asteroid ↔ shard ↔ cargo flow.
- **Resource region seeding:** Architectural overview *Resource regions* — how asteroid spawn density is driven by region definitions in `libraries/regions.xml`.
- **NPC mining decisions:** Architectural overview *NPC miners* — sector-level yield-rating reads, not per-asteroid iteration.

## Related

- [Sector](/game/world/sector/) — host; `.yieldrating.{ware}` is the sector-level analog.
- [Region](/game/world/region/) — region definitions drive asteroid spawn.
- [Ship](/game/objects/ship/) — what mines (with mining drills / mining drones).
- [Weapon](/game/objects/weapon/) — `.ismining=true` drills.
- [Collectablewares](/game/objects/collectablewares/) — asteroid shards land here (`isdroppedcontainer=false`).
- [Processing module](/game/objects/processing-module/) — consumes `class.recyclable` (sibling category).
- [Ware](/game/economy/ware/) — silicon / ore / methane / nividium / etc.

---

:::tip[Pattern — class label catch-all without datatype]
Asteroid is the canonical *natural-content class* — exposed for filtering but with no dedicated property set. Properties live on macros (which ware is inside) and on inherited types (location, hull). Same shape as [Bomb](/game/objects/bomb/), [Checkpoint](/game/objects/checkpoint/).
:::

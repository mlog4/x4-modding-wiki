---
title: Lockbox
description: A loot container with shootable locks. Spawns randomly in space; player breaks the locks to access wares, timeline entries, or audio logs.
---

A **Lockbox** is a loot container that spawns randomly in space (often in nebula or specific sector zones). The player breaks its shootable [Lock](/game/objects/lock/) sub-components to open it — and finds wares, timeline entries, or audio logs inside. Modders engage with lockboxes when adding loot pools, building reward systems, or filtering object queries.

**Inheritance:** `component → destructible → object → lockbox`. The datatype adds 6 properties covering rarity, locks state, and embedded narrative content.

**Note:** Lockbox is **not** a player-deployable — unlike [Satellite](/game/objects/satellite/) / [Nav beacon](/game/objects/nav-beacon/) / [Resource probe](/game/objects/resource-probe/) / [Mine](/game/objects/mine/). It's a world-spawned object the player discovers. We list it alongside deployables only because it's structurally similar (free-space object with custom content).

Each sector defines its typical lockbox via `Sector.typicallockboxmacro` — `placedobjects.xml:701-702` uses this to seed sector-appropriate lockboxes during gameplay.

## Properties

### Lockbox-specific

| Property | Type | Description |
|---|---|---|
| `.rarity` | int | Rarity tier (0..N — vanilla uses 0 = common, higher = rarer) |
| `.locks.<state>.count` | int | Number of locks filtered by component state (all / construction / operational / wreck) |
| `.locks.<state>.list` | list | List of locks at that state |
| `.locks.<state>.random` | lock | Random lock at that state |
| `.timeline` | list | Contained timeline entry ids |
| `.audiologs` | list | Contained audiolog entry ids |

The `<state>` placeholder is one of `all`, `construction`, `operational`, `wreck`. **Most modder code wants `.locks.operational`** — locks that the player still needs to shoot.

### Useful inherited

| Property | Source | Description |
|---|---|---|
| `.sector` / `.zone` / `.position` | object | Location |
| `.macro` | component | Lockbox macro variant |
| `.knownname` | component | Display name |
| `.cargo` | container | Wares inside (yes — lockbox inherits container via the destructible chain) |
| `.hull` / `.hullpercentage` | destructible | Damage state |

## Sector-level lookup

Each sector has a "typical lockbox" macro:

```xml
<set_value name="$macro"
    exact="$Sector.typicallockboxmacro"/>

<do_if value="@$macro.isclass.lockbox">
    <!-- macro is a valid lockbox macro for this sector -->
</do_if>
```

Pattern from vanilla `placedobjects.xml:701-702`. Use this when creating mod content that should spawn sector-thematic loot.

## Actions

Lockboxes spawn automatically — there's no `<deploy_lockbox>` action. Modders typically interact via:

### Spawn a custom lockbox

```xml
<create_object
    name="$Box"
    macro="$Sector.typicallockboxmacro"
    owner="faction.ownerless"
    sector="$Sector">
    <position x="$x" y="$y" z="$z"/>
</create_object>
```

Use `faction.ownerless` — lockboxes belong to no faction. Owning them prevents player access.

### Find all lockboxes in a sector

```xml
<find_object name="$Boxes"
    space="$Sector"
    class="class.lockbox"
    multiple="true"/>
```

### Filter unopened lockboxes (still have locks)

```xml
<do_for_each name="$box" in="$Boxes">
    <do_if value="$box.locks.operational.count gt 0">
        <!-- player hasn't fully opened this one -->
    </do_if>
</do_for_each>
```

A lockbox with zero `.locks.operational` has been shot open.

### Check container class as well

Vanilla `gm_bringitems.xml:391, 1811` filters on multiple container-like classes at once:

```xml
<do_if value="$ItemHolder.isclass.[class.lockbox,
    class.collectablewares, class.crate]">
    <!-- a holder of wares: lockbox, drop, or crate -->
</do_if>
```

This is the canonical idiom for "the player should bring wares from this" missions.

### Excluding lockboxes from object queries

Often you want "find any object EXCEPT lockboxes" because lockboxes pollute the result set:

```xml
<do_for_each name="$object" in="$Objects">
    <do_if value="not $object.isclass.lockbox">
        <!-- exclude lockboxes from this pool -->
    </do_if>
</do_for_each>
```

Vanilla `gm_find_object.xml:1554`, `rml_find_object.xml:58` use exactly this pattern.

## Events

There is no `event_lockbox_X` family. Lockbox lifecycle is observed through:

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | A lock or the lockbox itself destroyed | Filter `event.object.isclass.{class.lock}` to detect lock shoots specifically |
| `event_object_attacked` | Object attacked (lockbox or lock) | `event.object` is the victim, `event.param` is attacker |

To detect "player opened a lockbox":
1. Find when `event_object_destroyed` fires on a `class.lock`.
2. Check `event.object.parent.locks.operational.count == 0` after the destruction (last lock just went down).

## Common gotchas

- ⚠ **`.locks.<state>` state names are exact: `all`, `construction`, `operational`, `wreck`.** Typos return null silently — `<state>` is not a `componentstate` enum reference but a fixed string in the property name.
- ⚠ **A lockbox is `class.lockbox`, NOT a `class.container`-only object.** It inherits container, but `find_*` queries that filter `class.container` will miss lockboxes. Use `class.lockbox` explicitly.
- ⚠ **`.timeline` and `.audiologs` are id lists, not entries.** They reference entries in the `timelines.xml` and `audiologs.xml` data files. Look up by id; the lockbox does not hold the entry text directly.
- ⚠ **Lockboxes belong to `faction.ownerless`.** Don't set `.owner` to a real faction when spawning — the player loses access.
- ⚠ **`.rarity` is not a named enum.** Just an integer. Higher = rarer in vanilla, but mods can define any range. Don't hardcode "rarity > 3 = rare" without checking the mod's contract.
- ⚠ **Vanilla `gm_find_object` and `rml_find_object` exclude lockboxes from their pools.** If your mod adds a "find any object" mechanic, follow the same `not isclass.lockbox` exclusion or your missions will keep pointing at floating lockboxes.
- ⚠ **`.cargo` of a lockbox may be empty until the locks come off.** Engine reveals contents on lock-destroy. Don't assume cargo is queryable from spawn time.

## Examples

### Example 1: Player opened a lockbox — react to last lock destruction

```xml
<cue name="WatchLockboxOpen" instantiate="true">
    <conditions>
        <event_object_destroyed/>
        <check_value
            value="event.object.isclass.{class.lock}
                and event.object.parent.isclass.{class.lockbox}
                and event.object.parent.locks.operational.count == 0
                and event.param.isplayerowned"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player opened lockbox in '
                + event.object.parent.sector.knownname"/>
    </actions>
</cue>
```

### Example 2: Spawn a sector-thematic lockbox

```xml
<do_if value="@$Sector.typicallockboxmacro">
    <create_object
        name="$Box"
        macro="$Sector.typicallockboxmacro"
        owner="faction.ownerless"
        sector="$Sector">
        <position x="0" y="0" z="0"/>
    </create_object>

    <write_to_logbook
        text="'Lockbox spawned in '
            + $Sector.knownname"/>
</do_if>
```

### Example 3: List highest-rarity unopened lockboxes the player has discovered

```xml
<find_object name="$Boxes"
    space="player.galaxy"
    class="class.lockbox"
    multiple="true"/>

<set_value name="$rare" exact="0"/>

<do_for_each name="$box" in="$Boxes">
    <do_if value="$box.knowntoplayer
        and $box.locks.operational.count gt 0
        and $box.rarity gt $rare">
        <set_value name="$rare" exact="$box.rarity"/>
    </do_if>
</do_for_each>

<write_to_logbook
    text="'Highest-rarity unopened lockbox: ' + $rare"/>
```

## Architectural context

- **How lockboxes get seeded in the galaxy:** Architectural overview *Random spawn placement* — `placedobjects.xml` uses `Sector.typicallockboxmacro` to pick sector-appropriate variants.
- **Timeline / audiolog content delivery:** Architectural overview *Timeline content* — how `.timeline` ids tie into player-facing story content.

## Related

- [Lock](/game/objects/lock/) — the shootable sub-component.
- [Crate](/game/objects/crate/) — sibling container-like drop (different content).
- [Drop](/game/objects/drop/) — abstract parent for floating-loot objects.
- [Sector](/game/world/sector/) — `.typicallockboxmacro` is the per-sector lookup.
- [Ware](/game/economy/ware/) — what lockboxes contain.
- [Satellite](/game/objects/satellite/) — sibling "free-space object" (but actually a player-deployable, unlike lockbox).

---

:::tip[Pattern — world-spawned content with shootable sub-objects]
Lockbox is the canonical example of "shoot the children to unlock the parent". `.locks.operational.count == 0` is the universal "is it open" check. Same pattern applies to other engine objects with destructible sub-objects.
:::

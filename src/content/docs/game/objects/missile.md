---
title: Missile
description: In-flight munition with target tracking and launcher reference. Subtype of explosive; covers guided missiles, dumb fire, and torpedoes.
---

A **Missile** is an in-flight munition object. Once a [Ship](/game/objects/ship/) fires a missile from a [Missile launcher](/game/objects/weapon/) / [Missile turret](/game/objects/weapon/), the engine spawns a missile object until it hits, misses, or expires. Modders interact with missiles when implementing custom combat, countermeasures, or projectile-tracking logic.

**Inheritance:** `component → destructible → object → explosive → missile`. Missile adds target and launcher tracking on top of the explosive base.

**Parent — Explosive datatype:** Missile shares the base with [Mine](/game/objects/mine/) (though mine extends `object` directly, not `explosive`) and other ordnance via the `explosive` datatype:

| Property (from explosive) | Type | Description |
|---|---|---|
| `.istargetable` | bool | Can be targeted by point-defence / countermeasures |
| `.isguided` | bool | Has guidance system (false for dumb-fire) |
| `.istorpedo` | bool | Is a torpedo (large, slow, high-damage subset) |
| `.countermeasureresistance.{macro}` | float | Resistance to a specific countermeasure macro (0..1) |

## Properties

### Missile-specific

| Property | Type | Description |
|---|---|---|
| `.target` | destructible | Currently locked target (may change mid-flight) |
| `.launcher` | destructible | Object that launched the missile (ship, station, turret) |

### Inherited from explosive

(See table above.)

### Useful inherited from object

| Property | Source | Description |
|---|---|---|
| `.sector` / `.zone` / `.position` | object | Current location |
| `.owner` / `.trueowner` | object | Faction that fired the missile (inherits from launcher) |
| `.macro` | component | Missile macro |
| `.hull` / `.hullpercentage` | destructible | Hit-points (point-defence can kill targetable missiles) |

## Filtering by macro / class

```xml
<do_if value="$Object.isclass.{class.missile}">
    <!-- it's a missile -->
</do_if>
```

Useful subtype checks:

```xml
<do_if value="$missile.istorpedo">
    <!-- it's a torpedo — high-damage, slow -->
</do_if>

<do_if value="$missile.isguided">
    <!-- guided — will track .target -->
</do_if>

<do_if value="$missile.istargetable">
    <!-- can be shot down -->
</do_if>
```

## Actions

Missiles are spawned by the engine in response to weapon fire — there's no `<create_missile>` action typically. Modders interact via:

### Find missiles in flight in a sector

```xml
<find_object name="$Missiles"
    space="$Sector"
    class="class.missile"
    multiple="true"/>
```

### Filter missiles targeting the player

```xml
<do_for_each name="$missile" in="$Missiles">
    <do_if value="$missile.target == player.controlled">
        <write_to_logbook
            text="$missile.knownname + ' tracking player from '
                + $missile.launcher.knownname"/>
    </do_if>
</do_for_each>
```

### Inventory-side — add missiles to a ship's ammo storage

For player ammo / missile reload, the ware-side path:

```xml
<add_ammo
    object="player.ship"
    macro="ware.missile_arg_torpedo_01.objectmacro"
    amount="10"/>
```

Same deployable-style pattern as [Satellite](/game/objects/satellite/). Missile macros live in `ammostorage.{macro}`.

### Read the ware value of a missile (for damage / cost calcs)

```xml
<set_value name="$Value"
    exact="$missile.ware.averageprice"/>
```

Vanilla `lib_generic.xml:474` aggregates missile values for fleet-cost calculations.

## Events

Missiles use standard object events:

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Missile destroyed (impact, missed, intercepted) | Filter `event.object.isclass.{class.missile}` |
| `event_object_killed_object` | Missile killed something | `event.object` = missile, `event.param` = victim |
| `event_object_attacked` | Target attacked by missile | Fires aiscript-side, not MD-side |

To distinguish "intercepted" from "hit target", check `event.param`:
- `event.param == $missile.target` → hit
- `event.param != $missile.target` → premature detonation or point-defence kill

## Common gotchas

- ⚠ **`.target` can change mid-flight.** Some guided missiles re-acquire targets. Don't cache it; read on each frame.
- ⚠ **`.launcher` is the *originating component*, not just the ship.** A turret-fired missile has `.launcher` = the turret weapon, not the ship. To get the ship: `$missile.launcher.parent` or `$missile.launcher.container`.
- ⚠ **Missile macros are NOT in `ware.X.macro` form — they're `ware.X.objectmacro`.** Same as satellites / probes / nav beacons. Inventory wares bridge via `.objectmacro`.
- ⚠ **`.istargetable` controls whether AI fires point-defence at it.** Torpedoes are typically targetable; small swarm missiles often are not. Don't assume.
- ⚠ **`.istorpedo` is a separate flag from `.isguided`.** Vanilla torpedoes are guided AND targetable. But moded munitions can be any combination of flags — don't assume torpedo ⇒ guided.
- ⚠ **`.countermeasureresistance.{macro}` is per-countermeasure-macro.** A missile may resist some countermeasures but not others. Iterate or check specific macros.
- ⚠ **`event_object_destroyed` fires even on a hit.** All missile lifecycle endings flow through it. To distinguish a hit from a miss, look at whether the missile reached `.target` and `event.param` matches.
- ⚠ **Player missile inventory uses `add_ammo macro=`.** Not `add_inventory ware=`. Same trap as all deployables.

## Examples

### Example 1: Spawn 5 torpedoes in player ammo

```xml
<add_ammo
    object="player.ship"
    macro="ware.missile_arg_torpedo_01.objectmacro"
    amount="5"/>

<write_to_logbook
    text="'5 torpedoes loaded on '
        + player.ship.knownname"/>
```

### Example 2: Alert player when a torpedo is incoming

```xml
<cue name="WatchIncomingTorpedo" instantiate="true">
    <conditions>
        <event_object_changed_sector
            sector="player.sector"/>
        <check_value
            value="event.object.isclass.{class.missile}
                and event.object.istorpedo
                and event.object.target == player.controlled"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Torpedo incoming from '
                + event.object.launcher.parent.knownname"/>
    </actions>
</cue>
```

### Example 3: Count player-fleet missiles inventory value

```xml
<find_ship_by_true_owner name="$PlayerShips"
    space="player.galaxy"
    faction="faction.player"
    multiple="true"/>

<set_value name="$TotalValue" exact="0"/>

<do_for_each name="$ship" in="$PlayerShips">
    <do_for_each name="$ammomacro"
        in="$ship.ammostorage.list">
        <do_if value="$ammomacro.isclass.missile">
            <set_value name="$Count"
                exact="$ship.ammostorage.{$ammomacro}.amount"/>
            <set_value name="$TotalValue"
                operation="add"
                exact="$ammomacro.ware.averageprice * $Count"/>
        </do_if>
    </do_for_each>
</do_for_each>

<write_to_logbook
    text="'Player fleet missile value: '
        + $TotalValue + 'Cr'"/>
```

Pattern from vanilla `lib_generic.xml:474` (missile-value aggregation in fleet-cost calc).

## Architectural context

- **Missile vs bullet:** Architectural overview *Projectile types* — `bullet` is energy/projectile-weapon ammo (component-level), missile is a discrete tracked object. Different lifecycle and engine treatment.
- **Countermeasure system:** Architectural overview *Countermeasures* — how countermeasure macros interact with `countermeasureresistance.{macro}`.
- **Point-defence AI:** Architectural overview *Defensive turret behaviour* — how `istargetable` drives auto-engagement of incoming missiles.

## Related

- [Weapon](/game/objects/weapon/) — `.launcher` is the weapon (turret / missile launcher).
- [Ship](/game/objects/ship/) — owner; `.ammostorage.{macro}` holds the unfired stock.
- [Bullet](/game/objects/bullet/) — sibling projectile type (component-level, no missile.target semantics).
- [Mine](/game/objects/mine/) — sibling explosive (lifecycle pattern: stationary vs in-flight).
- [Ware](/game/economy/ware/) — `ware.missile_*` are inventory items; `.objectmacro` bridges to the missile macro.
- [Faction](/game/factions/faction/) — owner (inherits from launcher).

---

:::tip[Pattern — in-flight projectile with target/launcher tracking]
Missile is the canonical *transient object* in X4 — spawned by the engine, lives for seconds, despawns on impact or expiry. Don't store missile refs long-term; they go away. Always null-check (`@$missile`) before dereferencing.
:::

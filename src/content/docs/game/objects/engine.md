---
title: Engine
description: A ship's thruster component. Controls boost and travel modes — the two "fast" states that distinguish high-end engines from stock ones.
---

An **Engine** is a destructible component installed on a [Ship](/game/objects/ship/) that provides thrust. Engines define the ship's `.maxspeed` (set on the ship side) and own the *boost* and *travel* mode timing/availability state. They're the second-most-modded ship component after [Weapons](/game/objects/weapon/).

**Inheritance:** `component → destructible → engine`. Like [Weapon](/game/objects/weapon/), engine extends `destructible` directly, **not** `object` — engines are parts of larger objects, not free-floating things.

## Properties

The `engine` datatype is focused on the two performance modes — boost and travel.

### Boost (sprint with finite energy)

| Property | Type | Description |
|---|---|---|
| `.boost.available` | bool | Can boost right now (energy + recharge state) |
| `.boost.active` | bool | Currently boosting |
| `.boost.chargetime` | time | Wind-up time before boost begins |
| `.boost.rechargetime` | time | Time to recharge after boost ends |
| `.boost.maxduration` | time | Maximum continuous boost |
| `.boost.remainingduration` | time | Boost time left this run |
| `.boost.remainingfraction` | float 0..1 | Boost energy left |
| `.boost.maxspeed` | length (m/s) | Top speed while boosting |

### Travel (long-range cruise)

| Property | Type | Description |
|---|---|---|
| `.travel.available` | bool | Can travel right now |
| `.travel.active` | bool | Currently traveling |
| `.travel.chargetime` | time | Wind-up time before travel kicks in |
| `.travel.maxspeed` | length (m/s) | Top travel speed |
| `.travel.iscoasting` | bool | In post-travel deceleration |

### Inherited from destructible

| Property | Source | Description |
|---|---|---|
| `.hull` / `.hullpercentage` | destructible | Damage state — disabled engines reduce speed |
| `.parent` | component | The ship hosting this engine |

## Sister datatype: scanner

```
<datatype name="scanner" type="destructible">
```

Scanner has zero declared properties of its own — it's a placeholder class for the radar/scan component. We mention it here because it lives next to engine in `scriptproperties.xml` and shares the same skeleton structure. Modders working with scanners typically use the *ship-side* `.maxscanlevel` and `.hasscanner` accessors (on [Controllable](/game/objects/controllable/)) rather than reading scanner components directly.

## Finding engines on a ship

There is no `.engines` accessor directly — vanilla uses `find_object_component`:

```xml
<find_object_component
    name="$Engines"
    multiple="true"
    object="$Ship"
    class="class.engine"/>
```

Pattern from `gmc_supervised_mining.xml:1065`, `gm_escort.xml:834`, `notifications.xml:95`, `lib_generic.xml:3024`.

For ships you query frequently, there's also the shortcut `.engines.all.list`:

```xml
<do_for_each in="$Ship.engines.all.list" name="$engine">
    <!-- iterate engines -->
</do_for_each>
```

Pattern from `rml_scan.xml:184`.

## Actions

### Read boost state

```xml
<do_if value="$Ship.engines.all.list.{1}.boost.available">
    <write_to_logbook text="'Boost ready'"/>
</do_if>
```

### Read travel state

```xml
<do_if value="$Ship.engines.all.list.{1}.travel.active">
    <write_to_logbook text="'Traveling'"/>
</do_if>
```

### Disable engines for a target ("destroy the engines" missions)

```xml
<set_value name="$TargetClass" exact="[class.engine]"/>

<match_content
    class="[class.engine, class.turret]"
    state="componentstate.operational"/>
```

Pattern from `gm_destroy_objects.xml:1917-1932, 2394, 2437`. These mission types ask the player to disable specific components.

## Events

There is no `event_engine_X` family. Engine state is observed through standard component events:

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Engine destroyed | Filter `event.object.isclass.{class.engine}`. Vanilla `notifications.xml:92` triggers a "ship disabled" notification when this fires |
| `event_object_attacked` | Engine attacked | `event.param3.{2}` may be the attacking weapon |

### Special case: engine disabled → ship immobilised

Vanilla `notifications.xml:1162` shows the canonical "ship is dead in the water" detection:

```xml
<do_if value="event.param.isclass.engine
    and not event.object.maxspeed">
    <!-- the ship can no longer move -->
</do_if>
```

When the LAST functioning engine is destroyed, `Ship.maxspeed == 0` — that's the trigger for player rescue / capture missions.

## Common gotchas

- ⚠ **`engine` extends `destructible`, not `object`.** No `.sector` / `.position` directly — use `.parent.sector`.
- ⚠ **Boost and travel are SEPARATE modes.** A ship can have travel but not boost (or vice versa) depending on engine macro. Don't assume both are available.
- ⚠ **`.boost.available` and `.travel.available` reflect more than just energy.** They include recharge state, combat-alert state (boosting may be blocked while attacked), and turret deployment. Treat as opaque "can I do this now".
- ⚠ **`Ship.maxspeed` reflects engine state.** When engines are destroyed it drops; vanilla uses `not Ship.maxspeed` as the "immobilised" signal (`notifications.xml:1162`).
- ⚠ **`find_object_component` is the canonical access path.** A bare `find_object class=class.engine` will not work — engines are not stand-alone objects.
- ⚠ **Player ship speed comes from the engine macro, not the engine datatype.** Modders adding new engines define `.maxspeed` etc. on the macro side; runtime `.boost.maxspeed` reflects what the macro provides.
- ⚠ **Engines can be temporarily disabled by Travel Drive Stability hits.** A ship that loses its TDS travel-drive is engine-functional but travel-unavailable. Don't conflate destruction with TDS interruption.

## Examples

### Example 1: Check if player's ship can boost right now

```xml
<set_value name="$canBoost" exact="false"/>

<do_for_each name="$e"
    in="player.ship.engines.all.list">
    <do_if value="$e.boost.available">
        <set_value name="$canBoost" exact="true"/>
        <break/>
    </do_if>
</do_for_each>

<do_if value="$canBoost">
    <write_to_logbook text="'Ready to boost'"/>
</do_if>
<do_else>
    <write_to_logbook text="'Boost cooling down'"/>
</do_else>
```

### Example 2: Find ships with engines destroyed (immobilised)

```xml
<find_ship_by_true_owner name="$All"
    space="player.galaxy"
    multiple="true"/>

<create_list name="$Immobilised"/>

<do_for_each name="$ship" in="$All">
    <do_if value="$ship.maxspeed == 0
        and $ship.hull gt 0">
        <append_to_list name="$Immobilised" exact="$ship"/>
    </do_if>
</do_for_each>

<write_to_logbook
    text="$Immobilised.count + ' immobilised ships'"/>
```

### Example 3: Notify when player's engine is destroyed

```xml
<cue name="WatchPlayerEngine" instantiate="true">
    <conditions>
        <event_object_destroyed/>
        <check_value
            value="event.object.isclass.{class.engine}
                and event.param.isplayerowned"/>
    </conditions>
    <actions>
        <do_if value="event.param.maxspeed == 0">
            <write_to_logbook
                text="'Player ship engines DESTROYED — immobilised!'"/>
        </do_if>
        <do_else>
            <write_to_logbook
                text="'Engine damaged but ship still moving'"/>
        </do_else>
    </actions>
</cue>
```

Pattern from `notifications.xml:92-95, 1162`.

## Architectural context

- **Boost vs travel mode mechanics:** Architectural overview *Engine modes* — energy budgets, recharge curves, alert-state gating.
- **Travel Drive Stability (TDS):** Architectural overview *TDS interruption* — how attacks reduce travel availability without destroying the engine.
- **Destroy-component missions:** Architectural overview *Generic missions — destroy components* — `gm_destroy_objects.xml` family targeting `class.engine` / `class.turret`.

## Related

- [Ship](/game/objects/ship/) — host. `.maxspeed`, `.engines.all.list`, `.unboostedmaxspeed` are ship-side aggregates.
- [Scanner](/game/objects/scanner/) — sibling component (sparse datatype).
- [Weapon](/game/objects/weapon/) — sibling combat component.
- [Controllable](/game/objects/controllable/) — has `.hasscanner`, `.maxscanlevel` for scanner info.
- [Defensible](/game/objects/defensible/) — `.dps.X` aggregates; engine doesn't have a comparable aggregate.

---

:::tip[Pattern — destructible-component access via find_object_component]
Engine, weapon, scanner, shieldgenerator — all destructible-derived ship components — use the `find_object_component class=class.X` pattern. There's no shortcut `Ship.engines` accessor (only `.engines.all.list`); vanilla iterates with the canonical find action.
:::

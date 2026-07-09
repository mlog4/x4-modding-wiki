---
title: Lasertower
description: A deployable autonomous combat platform. Class.ship + .islasertower=true. Appears in the deployables menu but is technically a controllable ship.
---

A **Lasertower** is a stationary autonomous combat platform — players deploy them from inventory to add point-defence to a sector. Despite appearing in the deployables menu alongside [Satellites](/game/objects/satellite/) and [Mines](/game/objects/mine/), lasertowers are **technically `class.ship`** with the `.islasertower=true` flag.

This dual identity (deployable UX + ship class) is the source of several modder gotchas.

**Inheritance:** `component → destructible → object → controllable → defensible → container → ship → (lasertower)`.

There is no dedicated `lasertower` datatype — it's a [Ship](/game/objects/ship/) with a flag.

## Properties

There are no lasertower-specific properties beyond the inherited [Ship](/game/objects/ship/). The discriminator:

| Property | Value |
|---|---|
| `.isclass.ship` | true |
| `.islasertower` | true |
| `.iscapitalship` | false |

`.islasertower` is the only safe discriminator. `.isclass.ship` matches all ships; checking purpose/macro is unreliable.

## Vanilla variants

Vanilla has multiple lasertower macros — `ship_gen_xs_lasertower_01_a_macro`, etc. Each has different damage / range / hull but the same `.islasertower=true` flag.

## Deployment

Lasertowers go through the ammostorage path like other deployables — see [Satellite](/game/objects/satellite/) for the pattern.

### Player-side

```xml
<add_ammo object="player.ship"
    macro="macro.ship_gen_xs_lasertower_01_a_macro"
    amount="3"/>
```

Player deploys via UI. Each tower becomes a separate `class.ship` object in the sector.

### NPC-side

Vanilla `PlaceLasertowerfield` library handles bulk deployment:

```xml
<run_actions ref="md.LIB_Generic.PlaceLasertowerfield">
    <param name="SelectedTarget" value="$Zone"/>
    <param name="MinSpawn" value="5"/>
    <param name="MaxSpawn" value="10"/>
    <param name="LasertowerOwner" value="$Faction"/>
</run_actions>
```

Pattern from `lib_generic.xml:680`. NPCs use this for static defence.

## Finding lasertowers

```xml
<find_ship_by_true_owner name="$Towers"
    space="$Sector"
    faction="$Faction"
    multiple="true"/>

<create_list name="$LasertowersOnly"/>

<do_for_each name="$ship" in="$Towers">
    <do_if value="$ship.islasertower">
        <append_to_list name="$LasertowersOnly"
            exact="$ship"/>
    </do_if>
</do_for_each>
```

`find_ship_by_true_owner` returns all ships — filter by `.islasertower` after.

## Why the dual identity

The "deployable but actually a ship" design comes from engine constraints:

- **Has weapons + AI** — needs ship-class behaviour (target acquisition, fire control)
- **Has crew (1 pilot)** — needs controllable / NPC integration
- **Deployable like a satellite** — player UX inventory deployment

The engine couldn't unify "autonomous combat thing" without making it a ship. Class.ship + .islasertower flag is the compromise.

## Common gotchas

- ⚠ **Lasertower is `class.ship`, not `class.deployable`.** `find_object class="class.deployable"` does NOT return lasertowers. `find_ship_by_true_owner` does.
- ⚠ **`.iscapitalship=false`** — lasertowers are ship_xs class. Don't filter "all small ships" expecting to exclude them.
- ⚠ **Player ship-list UIs may show them.** Lasertowers count as the player's ship inventory. Vanilla menus filter them out via `.islasertower`; custom UIs may not.
- ⚠ **Stationary but movable in theory.** Lasertowers don't normally move, but the engine doesn't forbid issuing movement orders. Setting `.defaultorder` to something other than `Wait` may cause odd behaviour.
- ⚠ **`add_ammo macro=` for deployment.** Same as other deployables — NOT `add_inventory ware=`. See [Satellite](/game/objects/satellite/) for the pattern.

## Cross-references

- [Ship](/game/objects/ship/) — parent datatype
- [Satellite](/game/objects/satellite/) — sibling deployable
- [Mine](/game/objects/mine/) — sibling deployable
- [Defence module](/game/objects/defence-module/) — station-side equivalent
- `PlaceLasertowerfield` library — bulk NPC deployment

---

:::tip[Pattern — dual-identity flag-discriminated subtype]
Lasertower is **X4's "deployable that's actually a ship"** design. The `.islasertower` flag is the only safe discriminator. When your mod adds custom deployables that need ship-class behaviour (weapons + AI), follow the same pattern — full ship inheritance + flag for the deployable nature.
:::

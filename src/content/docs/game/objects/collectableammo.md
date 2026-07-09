---
title: Collectable ammo
description: Floating ammo drop — spawned when enemy ships are destroyed with missiles/drones aboard. Player flies over to add to their ammostorage.
---

A **Collectable ammo** is an ammo pickup — typically spawned when an enemy ship is destroyed and had unfired missiles, drones, or mines on board. Player collects by flying over; the ammo macros are added to `player.ship.ammostorage.{macro}`.

**Inheritance:** `component → destructible → object → drop → collectable → collectableammo`.

## Properties

### Collectable-ammo-specific

| Property | Type | Description |
|---|---|---|
| `.ammo.count` | int | How many of this ammo are contained |
| `.ammo.macro` | macro | Which ammo macro it is (`macro.weapon_gen_mine_03_macro`, `macro.missile_arg_torpedo_01_macro`, etc.) |

### Useful inherited

| Property | Source | Description |
|---|---|---|
| `.sector` / `.position` | object | Location |
| `.macro` | component | The collectable's own macro |

## Common patterns

### "Filter player events for ammo pickups"

Vanilla `tutorial_flight.xml:905`:

```xml
<do_if value="event.param.{$i}.isclass.collectableammo
    and event.param.{$i}.ammo.macro.isclass.missile">
    <!-- a missile pickup -->
</do_if>
```

Used to detect "the player just picked up a missile" in tutorial flows.

### "Spawn ammo loot from a defeated ship"

There's no clean `<create_collectableammo>` action — engine spawns these automatically on ship destruction based on the destroyed ship's `ammostorage`. To manually scatter ammo, use `<create_object>` with the appropriate `collectable_ammo_*` macro.

## Events

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Picked up by player | Standard destruction-as-collection |

## Common gotchas

- ⚠ **`.ammo.macro` is the contained ammo macro, NOT the collectable's macro.** `$collectable.macro` = the floating-box macro; `$collectable.ammo.macro` = the missile / drone / mine inside.
- ⚠ **Picked-up ammo goes to ammostorage, not inventory.** The collected ammo lands in `player.ship.ammostorage.{macro}`, same place as deployables.
- ⚠ **NPC pickups are silent.** NPCs don't fire pickup events the way player does. Don't expect symmetric handling.
- ⚠ **`.ammo.macro.isclass.X` chains work.** `$col.ammo.macro.isclass.missile` and `.isclass.mine` and `.isclass.satellite` all valid for branching.

## Related

- [Collectable](/game/objects/collectable/) — parent.
- [Ship](/game/objects/ship/) — `ammostorage.{macro}` is the destination.
- [Missile](/game/objects/missile/) — common ammo content.
- [Mine](/game/objects/mine/) — common ammo content.
- [Satellite](/game/objects/satellite/) / [Resource probe](/game/objects/resource-probe/) — deployable ammo content.
- [Ware](/game/economy/ware/) — `.ammo.macro.ware` bridges to the inventory item.

---

:::tip[Pattern — content-bearing collectable]
Collectable ammo separates *the floating object's macro* from *the contained ammo's macro*. Two macro references; don't confuse them.
:::

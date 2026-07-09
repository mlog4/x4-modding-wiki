---
title: Collectable
description: Generic floating pickup. Parent of the four concrete collectable types — used by vanilla as the canonical 'pickup-able' class filter.
---

A **Collectable** is the practical parent for all floating pickups in space. The `collectable` datatype itself declares no properties — its job is to anchor the hierarchy of concrete collectables ([ammo](/game/objects/collectableammo/), [wares](/game/objects/collectablewares/), [blueprints](/game/objects/collectableblueprints/), [data](/game/objects/collectabledata/)).

**Inheritance:** `component → destructible → object → drop → collectable`.

**Why this exists separately from `drop`:** vanilla's `find_object class="class.collectable"` is the conventional "find pickup-able items" query. Using `class.drop` would also work (drop is parent) but vanilla never does — `collectable` is the on-ramp.

## Properties

There are no collectable-specific properties. Use:

- **Inherited from `object`:** `.sector`, `.zone`, `.position`, `.owner`
- **Inherited from `destructible`:** `.hull`

The subtype determines what's inside ([Collectableammo](/game/objects/collectableammo/), [Collectablewares](/game/objects/collectablewares/), etc.).

## Common patterns

### "Find all collectables in a zone"

```xml
<find_object
    groupname="$PickupTargets"
    class="class.collectable"
    space="$Zone"
    multiple="true"/>
```

Pattern from vanilla `rml_collect_crates.xml:202`.

### "Exclude collectables from a generic find"

Vanilla `scenario_advanced.xml:1570` shows the exclusion idiom:

```xml
<do_if value="not $asteroidshards.{$i}.isclass.collectable">
    <!-- this is a non-collectable shard — keep it -->
</do_if>
```

Used when picking objects but wanting to skip floating pickups.

### "Branch by collectable subtype"

```xml
<do_if value="$collectable.isclass.collectablewares">
    <!-- ware-style pickup -->
</do_if>
<do_elseif value="$collectable.isclass.collectableammo">
    <!-- ammo-style pickup -->
</do_elseif>
<do_elseif value="$collectable.isclass.collectableblueprints">
    <!-- blueprint-style pickup -->
</do_elseif>
<do_elseif value="$collectable.isclass.collectabledata">
    <!-- data-style pickup -->
</do_elseif>
```

## Events

Collectable lifecycle uses standard object events:

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Picked up or expired | Player flies over → "destroyed" via collection |

There's no separate "collected" event — destruction with appropriate killmethod is the proxy.

## Common gotchas

- ⚠ **Collectable declares NO datatype properties.** Read the subtype for actual data.
- ⚠ **Vanilla uses `class.collectable` for filters, not `class.drop`.** Both work (drop is parent); collectable is the convention.
- ⚠ **Pickup is destructive.** Player flying over a collectable destroys it. Don't expect persistent references after collection.

## Related

- [Drop](/game/objects/drop/) — parent abstract class.
- [Collectableammo](/game/objects/collectableammo/) / [Collectablewares](/game/objects/collectablewares/) / [Collectableblueprints](/game/objects/collectableblueprints/) / [Collectabledata](/game/objects/collectabledata/) — concrete subtypes.

---

:::tip[Pattern — IS-A pivot in a hierarchy]
Collectable demonstrates the *practical filter point* in a class hierarchy. Drop is the abstract base; collectable is where filters actually pivot. Keep this pattern when your mod adds new pickup types.
:::

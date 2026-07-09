---
title: Drop
description: Abstract base class for free-space pickup items. Parent of collectable, collectableammo, collectablewares, collectableblueprints, collectabledata.
---

A **Drop** is the abstract base class for free-space pickup items — anything floating in space the player can fly over and collect. Drops are spawned by destroying enemy ships, by mission cues, by asteroid mining, and by recyclable processing.

**Inheritance:** `component → destructible → object → drop`. The `drop` datatype declares **no own properties** (`scriptproperties.xml:932`) — it's a class label used for filtering. All meaningful state is on its [Collectable](/game/objects/collectable/) subtypes.

## Subtype hierarchy

```
drop
└── collectable
    ├── collectableammo      .ammo.count, .ammo.macro
    ├── collectablewares     .money, .unbundle, .isdroppedcontainer
    ├── collectableblueprints .blueprints
    └── collectabledata      .timeline, .audiologs
```

All subtypes inherit `class.drop` and `class.collectable` — filter with `class.collectable` for "anything pickup-able by the player".

## Properties

There are no drop-specific properties. Use:

- **Inherited from `object`:** `.sector`, `.zone`, `.position`, `.owner`, `.macro`, `.knownname`
- **Inherited from `destructible`:** `.hull`, `.hullpercentage`

Drops are typically `faction.ownerless` and have low hull — easy to "destroy" via collection.

## Finding drops in a zone

Vanilla `rml_collect_crates.xml:202-208` uses `class.collectable` (not `class.drop`):

```xml
<find_object
    groupname="$PickupTargets"
    class="class.collectable"
    space="$PositionObject"
    multiple="true"/>
```

`class.drop` would technically work but is uncommon — vanilla treats `collectable` as the practical "is this pickup-able" class.

## Common gotchas

- ⚠ **`drop` declares NO datatype properties.** Same pattern as [Bomb](/game/objects/bomb/), [Checkpoint](/game/objects/checkpoint/), [Welfare module](/game/objects/welfare-module/), [Defence module](/game/objects/defence-module/) — class label only.
- ⚠ **Vanilla uses `class.collectable` for filters, not `class.drop`.** They're hierarchical (drop > collectable) but `find_object` queries use `collectable`. Same outcome — collectable inherits drop.
- ⚠ **Drops don't equal "loot containers".** [Lockbox](/game/objects/lockbox/) and [Crate](/game/objects/crate/) are separate classes. The "any loot holder" idiom is `class.lockbox + class.collectablewares + class.crate` — see [Lockbox](/game/objects/lockbox/) for the canonical multi-class filter.

## Related

- [Collectable](/game/objects/collectable/) — direct subtype, generic pickup.
- [Collectableammo](/game/objects/collectableammo/) — ammo drops.
- [Collectablewares](/game/objects/collectablewares/) — ware drops (most common).
- [Collectableblueprints](/game/objects/collectableblueprints/) — blueprint drops.
- [Collectabledata](/game/objects/collectabledata/) — timeline / audiolog drops.
- [Lockbox](/game/objects/lockbox/) — sibling loot container (different abstraction — has shootable locks).

---

:::tip[Pattern — abstract class label with rich subtypes]
Drop is the canonical *empty abstract parent* — declares nothing but anchors the class hierarchy. All filtering uses the concrete subtypes. Same shape as [Operation](/game/objects/boarding-operation/) abstract base.
:::

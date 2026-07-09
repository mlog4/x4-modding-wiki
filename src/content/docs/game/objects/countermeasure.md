---
title: Countermeasure
description: Engine class for missile-defeating countermeasures (flares). Defined as a script class but with no dedicated datatype — handled mostly via macro-level countermeasure resistance.
---

A **Countermeasure** is a missile-defeating effect — vanilla treats it as a flare-style consumable launched by a [Ship](/game/objects/ship/) to confuse incoming guided [Missiles](/game/objects/missile/). The engine exposes `class.countermeasure` to scripts but provides **no dedicated `countermeasure` datatype**. The interaction between missiles and countermeasures lives at the *macro* level via `explosive.countermeasureresistance.{macro}`.

**No inheritance beyond standard object.** Countermeasures are `class.countermeasure` with no class-specific accessors. Effectiveness is determined by the macro definition and the targeted missile's resistance.

**Minimal vanilla MD usage.** Like [Checkpoint](/game/objects/checkpoint/) and [Bomb](/game/objects/bomb/), vanilla MD does not reference `class.countermeasure` directly — the system is handled engine-side at the AI / projectile level.

## Properties

No countermeasure-specific properties. Standard `object` accessors apply.

## How countermeasure interacts with missile

The missile-side `explosive` datatype defines:

```
.countermeasureresistance.{$macro}
  → 0..1 (or %) — how strongly this missile resists the specified countermeasure macro
```

This is the bridge. When a countermeasure macro is launched, the engine queries each in-range targeting missile for `.countermeasureresistance.{countermeasureMacro}` and:

- `0` → countermeasure fully effective, missile breaks lock
- `1` → countermeasure ineffective, missile keeps lock

Modders adding new countermeasures define the macro and add per-missile resistance values; the engine handles the rest.

## Actions

### Inventory-side — give the player countermeasure stock

```xml
<add_ammo
    object="player.ship"
    macro="ware.eq_arg_countermeasure_01.objectmacro"
    amount="50"/>
```

Same deployable-style pattern as [Satellite](/game/objects/satellite/) / [Mine](/game/objects/mine/) / [Missile](/game/objects/missile/). Countermeasures live in `ammostorage.{macro}`.

### Find countermeasures in flight

```xml
<find_object name="$CMs"
    space="$Sector"
    class="class.countermeasure"
    multiple="true"/>
```

In practice, countermeasures are brief — they pop, decoy missiles for a few seconds, then despawn.

## Events

Standard object events. No `event_countermeasure_X` family.

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Countermeasure despawned | Filter on `class.countermeasure` |

## Common gotchas

- ⚠ **`countermeasureresistance` is per-pair (countermeasure macro × missile macro).** Adding a new countermeasure requires defining resistance for each missile type, or accepting the default (zero resistance — countermeasure fully effective).
- ⚠ **Countermeasures are launched, not "fired".** They appear from the deploying ship and are destructible objects until they despawn. Don't expect them to be `class.missile`.
- ⚠ **No vanilla MD references `class.countermeasure`.** Like [Bomb](/game/objects/bomb/), the system is engine-driven; mods that add custom flare logic interact via macros, not via MD scripting of the runtime object.
- ⚠ **`.istargetable` on the countermeasure object is the engine flag for "can a missile target this".** Used by the diversion logic. Don't set it directly.
- ⚠ **Player countermeasure deployment uses ammostorage.** `add_ammo macro=`, not inventory or cargo. Same as all deployables.

## Architectural context

- **Missile vs countermeasure interaction:** Architectural overview *Countermeasure system* — how `countermeasureresistance.{macro}` drives the engine's miss-rate calculation.
- **Adding a custom countermeasure:** Architectural overview *Custom countermeasure mods* — macro definition + per-missile resistance entries.

## Related

- [Missile](/game/objects/missile/) — what countermeasures defeat. The `.countermeasureresistance.{macro}` is on the missile side.
- [Ship](/game/objects/ship/) — what launches countermeasures from `ammostorage`.
- [Ware](/game/economy/ware/) — `ware.eq_arg_countermeasure_*` are the inventory items.
- [Explosive](/game/objects/explosive/) — abstract parent of missile; `.countermeasureresistance` lives there.

---

:::tip[Pattern — engine-driven system with script-side hooks]
Countermeasure is the canonical example of *engine-handled interaction* — the actual missile-defeat logic runs in the engine; modders affect outcomes by defining macros and resistance tables, not by writing MD reactions. Same pattern as Travel Drive interruptions and detector arcs.
:::

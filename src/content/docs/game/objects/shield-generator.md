---
title: Shield generator
description: A destructible ship/station component that powers shield strength. Empty datatype — interactions go through the parent object's defensible shield aggregates.
---

A **Shield generator** is a destructible component on a [Ship](/game/objects/ship/) or [Defence module](/game/objects/defence-module/) that powers the parent's shield strength. Like [Scanner](#scanner-comparison), the `shieldgenerator` datatype declares **no own properties** — its effects are folded into the parent's defensible-aggregate values.

**Inheritance:** `component → destructible → shieldgenerator`. Like [Weapon](/game/objects/weapon/) and [Engine](/game/objects/engine/), extends `destructible` directly, **not** `object`.

## Properties

There are no shield-generator-specific properties (`scriptproperties.xml:984`). Use:

- **Inherited from `destructible`:** `.hull`, `.hullpercentage`, `.parent`

### Parent-side accessors (where shield state actually lives)

The actual shield values are on the **parent object** ([Defensible](/game/objects/defensible/) — ships and stations both inherit it):

| Parent property | Description |
|---|---|
| `.shield` / `.shieldpercentage` | Aggregate shield strength (sum across all shield generators) |
| `.shieldmax` | Maximum aggregate shield |
| `.shieldrechargedelay` | Time after damage before shield starts recharging |

For per-generator shield contribution, vanilla doesn't expose this — query the macro's `.ware.maxprice` or hull HP if you need a proxy.

## Finding shield generators

Use `find_object_component` against the parent — same pattern as [Engine](/game/objects/engine/):

```xml
<find_object_component
    name="$ShieldGens"
    multiple="true"
    object="$Ship"
    class="class.shieldgenerator"/>
```

For a generic "all attackable subcomponents" pattern, vanilla `notifications.xml:1376` uses a multi-class filter:

```xml
<find_object_component
    name="$subcomponents"
    object="$target"
    class="[class.weapon, class.turret, class.shieldgenerator]"
    multiple="true"/>
```

## Common patterns

### "Filter shieldgens when targeting subcomponents"

Pattern from vanilla `gm_buildstation.xml:1523, 1794-1833` — mission generator picks N shield generators as subcomponent targets:

```xml
<do_if value="[class.turret, class.missileturret,
    class.shieldgenerator].indexof.{$class.{2}}">
    <!-- pick this as a subcomponent target -->
</do_if>
```

### "Iterate shield generators on a ship"

```xml
<find_object_component
    name="$Shields"
    multiple="true"
    object="$Ship"
    class="class.shieldgenerator"/>

<do_for_each name="$gen" in="$Shields">
    <do_if value="$gen.hullpercentage lt 0.3f">
        <!-- this shield generator is critically damaged -->
    </do_if>
</do_for_each>
```

### "Total shield value via macro lookup"

Since per-generator shield contribution isn't exposed, vanilla `lib_reward_balancing.xml:452-518` references the *shield mod part* wares (`ware.modpart_shieldgeneratorcoil_t1` / `_t2` / `_t3`) for reward calculations rather than reading runtime shield gen values.

## Events

There is no `event_shieldgenerator_X` family. Use standard component events:

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Shield gen destroyed | Filter `event.object.isclass.{class.shieldgenerator}`. Parent's `.shieldmax` drops |
| `event_object_attacked` | Shield gen attacked | Standard |

When a shield generator is destroyed, the parent's `.shieldmax` reduces and `.shield` is clamped accordingly. There's no special "shield down" event — observe via `event_object_attacked` on the parent and read `.shieldpercentage`.

## Scanner comparison

A neighbouring datatype shares this *empty-datatype* shape:

```
<datatype name="scanner" type="destructible">
```

Same pattern: no properties of its own. Modders interact with [Controllable](/game/objects/controllable/)'s `.hasscanner` / `.maxscanlevel` (which read scanner state at the parent level).

The pair illustrates that **some destructible components are pure labels** — they exist as classes for the engine's part-of-ship logic, but expose nothing to scripts directly.

## Common gotchas

- ⚠ **Shield generator declares NO datatype properties.** All shield state is on the parent's defensible aggregate (`Ship.shield`, `.shieldmax`).
- ⚠ **`shieldgenerator` extends `destructible`, NOT `object`.** No `.sector` — use `.parent.sector`.
- ⚠ **`.parent.shieldmax` decreases when a shield gen is destroyed.** This is engine-side; you don't update it from scripts.
- ⚠ **No per-generator shield contribution accessor.** If you need it, infer from `.macro` (the macro defines max shield this generator provides — but reading it requires macro introspection, not runtime access).
- ⚠ **Shield mod parts are wares, not the runtime shield gen.** `ware.modpart_shieldgeneratorcoil_t1` is the *upgrade item*, not the component. Vanilla `lib_reward_balancing.xml` uses these for player rewards.
- ⚠ **`find_object_component` is the canonical path.** A bare `find_object class=class.shieldgenerator` won't work — shield gens are components of larger objects.

## Architectural context

- **Defensible shield model:** Architectural overview *Shield mechanics* — how individual shield gen damage rolls up to parent `.shield`, recharge delay, regen rate.
- **Damage to subcomponents:** Architectural overview *Hardpoint damage* — `find_object_component` over weapon/turret/shieldgenerator is the canonical "kill X subcomponents" mission pattern.

## Related

- [Ship](/game/objects/ship/) — host; `.shield`/.shieldmax/.shieldpercentage live there.
- [Station](/game/objects/station/) — also hosts (on [Defence module](/game/objects/defence-module/)).
- [Defensible](/game/objects/defensible/) — the parent type that aggregates `.shield`.
- [Weapon](/game/objects/weapon/) / [Engine](/game/objects/engine/) — sibling destructible components.
- [Ware](/game/economy/ware/) — `ware.modpart_shieldgeneratorcoil_*` are the mod parts.

---

:::tip[Pattern — empty datatype with parent-side aggregate]
Shield generator joins [Scanner](/game/objects/scanner/), [Defence module](/game/objects/defence-module/), [Welfare module](/game/objects/welfare-module/), [Bomb](/game/objects/bomb/), [Checkpoint](/game/objects/checkpoint/) in the *class-without-properties* club. The pattern says: "the engine cares about this class for filtering and lifecycle, but exposes nothing for scripts to read at the instance level."
:::

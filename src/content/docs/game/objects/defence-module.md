---
title: Defence module
description: Station module hosting turrets and shields. Marks a station as combat-capable.
---

A **Defence module** is a station [Module](/game/objects/module/) that hosts [Turrets](/game/objects/weapon/) and shield generators. Stations with defence modules can fight back; stations without them are exposed to attack. Defence stations are typically composed mostly of these.

**Inheritance:** `component → destructible → module → defencemodule`. The datatype declares **no own properties** — it's a class label rather than a property bag. All meaningful state (turrets, shields) comes through the contained weapon components.

## Properties

Defence module declares **no properties of its own** in `scriptproperties.xml:1097`. Use:

- **Inherited from `module`:** `.numdocks.{docksize}`, `.haswalkableroom`
- **Inherited from `destructible`:** `.hull`, `.hullpercentage`
- **Component search for installed turrets:** `find_object_component class="class.turret"` against the defence module

## Common patterns

### "Filter defence modules when building"

```xml
<do_if value="$macro.isclass.defencemodule">
    <!-- defence module -->
</do_if>
```

Pattern from vanilla `finalisestations.xml:949`. Vanilla uses this in the station finalisation pipeline to count defence components.

### "Find all defence modules on a station"

```xml
<do_for_each name="$mod" in="$Station.modules">
    <do_if value="$mod.isclass.defencemodule">
        <!-- one defence module -->
    </do_if>
</do_for_each>
```

### "Find all turrets attached to a defence module"

```xml
<find_object_component
    name="$Turrets"
    multiple="true"
    object="$DefenceModule"
    class="class.turret"/>
```

## Common gotchas

- ⚠ **Defence module declares NO datatype properties.** It's a class label. All combat state is on the contained turrets / shield generators.
- ⚠ **`.canbeattackable` lives on the parent station.** Don't expect a defence-module-level "is this active" flag.
- ⚠ **Multiple defence modules stack additively.** Vanilla `finalisestations.xml:949` counts each as contributing to overall defence rating.
- ⚠ **Defence modules + a [Defence station](/game/objects/defence-station/) are separate concepts.** A defence station is mostly composed of defence modules. Production stations can have one or two defence modules too — they're not exclusive to defence stations.

## Related

- [Module](/game/objects/module/) — parent abstraction.
- [Defence station](/game/objects/defence-station/) — station subtype mostly made of these.
- [Weapon](/game/objects/weapon/) / [Turret](/game/objects/weapon/#subtypes) — what defence modules host.
- [Shield generator](/game/objects/shield-generator/) — sibling combat component, also installed on defence modules.

---

:::tip[Pattern — class label without datatype]
Defence module shares the "class-only" pattern with [Welfare module](/game/objects/welfare-module/), [Bomb](/game/objects/bomb/), [Checkpoint](/game/objects/checkpoint/). The class exists in the engine for filtering; properties live elsewhere (on contained components or the parent station).
:::

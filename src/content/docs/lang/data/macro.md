---
title: Macro (data layer)
description: The macro XML format — template definitions for ships, stations, modules, equipment. Backbone of all runtime objects.
---

A **Macro** is an XML template that defines the structure and properties of a class of objects. Every ship, station, module, weapon, satellite, etc. has a backing macro. When MD or aiscript calls `<create_object macro="X"/>`, the engine looks up the macro and instantiates it.

Macros live in `assets/.../macros/*.xml` files scattered across the game's data tree. They're the **biggest data surface** — thousands of files across vanilla.

## File structure

```xml
<?xml version="1.0" encoding="utf-8" ?>
<macros>
    <macro name="ship_arg_l_destroyer_01_a_macro"
        class="ship_l">
        <component
            ref="ship_arg_l_destroyer_01_a_component"/>

        <properties>
            <identification name="{20101, 1001}"
                description="{20101, 1002}"/>
            <purpose primary="fight"/>
            <hull max="800000"/>
            <speed forward="58" reverse="14"/>
            <storage cargo="9000"
                missile="40"
                unit="20"/>
            <people capacity="40"/>
        </properties>
    </macro>
</macros>
```

The macro defines:
- `name=` — the macro id (referenced from MD as `macro.X`)
- `class=` — the runtime class (`ship_l`, `station`, `weapon`, etc.)
- `<component ref=>` — the visual / mesh component this macro renders as
- `<properties>` — gameplay attributes

## Common properties

### Ship macro properties

| Property | Purpose |
|---|---|
| `<identification name=>` | Display name (text-table ref) |
| `<purpose primary=>` | `fight` / `trade` / `mine` / etc. |
| `<hull max=>` | Hit points |
| `<speed forward= reverse=>` | Base speeds |
| `<storage cargo= missile= unit=>` | Capacities |
| `<people capacity=>` | Crew capacity |
| `<sounds>` | Engine sound refs |
| `<loadout>` | Default equipment refs |

### Station macro properties

| Property | Purpose |
|---|---|
| `<buildplot>` | Build-plot dimensions |
| `<structure>` | Hull / module slots |
| `<patrolregion>` | Default patrol region |

### Equipment macro properties

| Property | Purpose |
|---|---|
| `<damage>` | Per-hit damage |
| `<reload rate= time=>` | Fire rate |
| `<bullet>` | Projectile properties |
| `<range>` | Effective range |

## Common patterns

### "Find a macro file"

Macros are scattered across `assets/` by category:
- Ships: `assets/units/<size>/macros/`
- Stations: `assets/structures/macros/`
- Modules: `assets/structures/<category>/macros/`
- Equipment: `assets/equipment/<category>/macros/`

Vanilla file names typically follow `<class>_<race>_<size>_<role>_<variant>_macro.xml`.

### "Override hull HP"

```xml
<diff>
    <replace
        sel="//macros/macro[@name='ship_arg_l_destroyer_01_a_macro']/properties/hull/@max">
        1500000
    </replace>
</diff>
```

XML diff against the macro file — change hull max.

### "Reference macros from MD"

```xml
<create_ship name="$ship"
    macro="macro.ship_arg_l_destroyer_01_a_macro"
    sector="$sector"/>
```

In MD, prepend `macro.` to the macro name. The lookup is dynamic.

### "Read macro property from script"

```xml
<set_value name="$cargoMax"
    exact="macro.ship_arg_l_destroyer_01_a_macro.cargo.max"/>
```

Macro accessors expose properties at runtime — without needing an instance.

## Common gotchas

- ⚠ **Macro names end in `_macro`.** Convention is enforced by lookup — `macro.X` resolves to `assets/.../macros/X_macro.xml` (with the suffix). Don't omit it.
- ⚠ **DLC-gated macros must be wrapped.** Referencing `macro.ship_ter_*` from a script fails when Terran DLC is absent. Use `<do_if value="@faction.terran">` guards. (Memory: `x4_md_dlc_gated_macro_refs`.)
- ⚠ **`<component ref=>` MUST exist.** A macro referencing a missing component fails at load. Triple-check file paths when copying macros.
- ⚠ **Macro `.cargo.max` is NOT the same as runtime `.cargo.capacity`.** Macro is the maximum the design allows; runtime depends on installed storage modules.
- ⚠ **MD/aiscript ship-macro creation needs `tag` filters at the macro level.** Vanilla `find_ship_by_true_owner tag=tag.solid` was broken in 9.x for some macros; use `primarypurpose=` instead.
- ⚠ **Editing macros affects ALL instances.** Doubling a ship's hull HP in the macro doubles existing AND future ships. For per-instance changes, use MD `<set_value>`.
- ⚠ **Macros use a specific component naming convention.** The component's `_macro` is often `_component` with same prefix. Maintaining this matters for re-skinning.

## Architectural context

- **Thousands of macros in vanilla.** No central index — find via grep or by file path.
- **Catalog files (`catalog.xml`)** index which macros exist for which classes.
- **DLC adds macros without touching base.** Each DLC ships its own `macros/` subdirectory. Mods need DLC checks for cross-DLC content.

## Related

- [god.xml](/lang/data/god-xml/) — references macros for initial placements.
- [stationgroups.xml](/lang/data/stationgroups-xml/) — composes station macros.
- [constructionplans.xml](/lang/data/constructionplans-xml/) — references module macros.
- [Ship (game)](/game/objects/ship/) — runtime ship has `.macro` accessor.
- [Module (game)](/game/objects/module/) — runtime module has `.macro`.
- [Ware (game)](/game/economy/ware/) — `.objectmacro` bridges ware to macro.
- [DLC-gated macro refs](/game/objects/ship/) — gotcha pattern.

---

:::tip[Pattern — template-instance separation]
Macro is **the template; runtime objects are instances**. Changes to macros affect all instances (including saved ones). For per-instance tweaks, use MD's runtime accessors. For game-wide rebalancing, edit the macro.
:::

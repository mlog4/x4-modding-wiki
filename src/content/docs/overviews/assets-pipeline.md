---
title: Assets pipeline
description: How macros, components, indices, and catalog files compose into the game's runtime asset system. The path from XML to in-game object.
---

How does X4 go from an XML file on disk to a 3D ship flying in space? The **assets pipeline** is the chain of file types that wire definitions together — macro XML defines properties, component XML defines geometry, index files map names to file paths, the engine loads on-demand. This overview maps the chain.

For the macro-level details see [Macro (data layer)](/lang/data/macro/).

## The pipeline

```
┌──────────────────────────────────────────┐
│  Index files (index/)                    │
│  - macros.xml: name → file path mapping  │
│  - components.xml: same for components   │
└────────────────┬─────────────────────────┘
                 ↓ engine resolves at load
┌──────────────────────────────────────────┐
│  Macro file (.xml)                       │
│  - <macro name="X" class="Y">            │
│  - <component ref="..."/>                │
│  - <properties>...</properties>          │
└────────────────┬─────────────────────────┘
                 ↓ references
┌──────────────────────────────────────────┐
│  Component file (.xml)                   │
│  - 3D mesh / collision data refs         │
│  - connection points                     │
│  - sub-component slots                   │
└────────────────┬─────────────────────────┘
                 ↓ references
┌──────────────────────────────────────────┐
│  Mesh / texture / animation data         │
│  - Binary asset files                    │
└──────────────────────────────────────────┘
```

## The index layer

The `index/` directory has two files:

| File | Maps |
|---|---|
| `index/macros.xml` | Macro name → file path |
| `index/components.xml` | Component name → file path |

These are giant lookup tables. Vanilla `index/macros.xml` has thousands of entries:

```xml
<entry name="ship_arg_l_destroyer_01_a_macro"
    value="assets/units/size_l/macros/ship_arg_l_destroyer_01_a_macro"/>

<entry name="station_arg_shy_1_macro"
    value="assets/structures/argon/macros/station_arg_shy_1_macro"/>
```

When MD calls `<create_object macro="macro.ship_arg_l_destroyer_01_a_macro">`, the engine:
1. Looks up `ship_arg_l_destroyer_01_a_macro` in `index/macros.xml`
2. Finds the file path
3. Loads the macro XML
4. Resolves the macro's `<component ref="...">` against `index/components.xml`
5. Loads the component XML
6. Instantiates the runtime object

**Critical:** if `index/macros.xml` doesn't have an entry, the engine can't find the macro. Adding a new macro file isn't enough — you must also add its index entry.

## The macro layer

A macro file defines a *runtime template* — properties, class, default loadout. See [Macro (data layer)](/lang/data/macro/) for the schema.

Key relationship: a macro references its component:

```xml
<macro name="ship_arg_l_destroyer_01_a_macro"
    class="ship_l">
    <component ref="ship_arg_l_destroyer_01_a"/>
    <properties>...</properties>
</macro>
```

The `<component ref="...">` is the link from "design" (macro) to "thing in the world" (component).

## The component layer

A component file defines the *physical structure* — meshes, collision, connections to sub-components:

```xml
<component name="ship_arg_l_destroyer_01_a">
    <source geometry="..." collision="..."/>
    <connections>
        <connection name="con_weapon_01" type="weapon">
            ...
        </connection>
        <connection name="con_engine_01" type="engine">
            ...
        </connection>
    </connections>
</component>
```

Components are about geometry + connection topology. Properties (hull, speed, cargo) live on macros, not components.

## Sub-components and connections

Components have **connection points** that map to sub-components:

```
ship_arg_l_destroyer_01_a (main component)
├── con_weapon_01 → weapon component (e.g. turret_01_a)
├── con_weapon_02 → weapon component
├── con_engine_01 → engine component
├── con_shield_01 → shield generator component
└── con_dock_01   → dockingbay component
```

Each connection has a type tag (`weapon`, `engine`, `shield`). Sub-components must have a compatible connection on their end. The engine matches them at instantiation time.

## Macros for sub-components

Sub-components also have macros — `turret_arg_l_beam_01_mk2_macro` references the turret component. This is how the loadout system works: a loadout assigns specific turret/engine/shield macros to specific connection slots:

```
ship_arg_l_destroyer_01_a runtime instance
├── slot con_weapon_01: turret_arg_l_beam_01_mk2_macro
├── slot con_engine_01: engine_arg_l_advance_01_mk1_macro
└── slot con_shield_01: shield_arg_l_standard_01_mk2_macro
```

This is the **loadout system**. Different loadouts = same ship with different equipment. See [Loadout](/game/behavior/loadout/) for runtime details.

## File system layout

Vanilla organises assets by category:

```
assets/
├── units/                       ← ships
│   ├── size_xs/macros/
│   ├── size_s/macros/
│   ├── size_m/macros/
│   ├── size_l/macros/
│   └── size_xl/macros/
├── structures/                  ← stations + modules
│   ├── argon/macros/
│   ├── paranid/macros/
│   ├── teladi/macros/
│   ├── modules/macros/
│   └── ...
├── equipment/                   ← turrets, engines, shields
│   ├── turrets/macros/
│   ├── engines/macros/
│   ├── shields/macros/
│   └── ...
├── fx/                          ← effects
│   └── macros/
└── ...
```

Files in each `macros/` subdirectory are macros; component files live adjacent (often in `components/` subdirectories).

## The "macro_macro" convention

Vanilla uses `_macro` suffix on macro names: `ship_X_macro`, `module_Y_macro`. Engine treats this as convention — `macro.ship_X_macro` is the lookup. Don't omit the suffix.

The corresponding component drops the suffix: `ship_X` is the component name for macro `ship_X_macro`. So macro → component is `_macro` removal.

## Catalog file (catalog.xml)

Each asset directory typically has a `catalog.xml` that summarises its contents. This is for engine discovery / mod compatibility — listing which macros / components are present, sometimes their classes.

Modders extending an asset directory usually don't touch `catalog.xml` — the index files (`index/macros.xml`) are what the engine actually uses for lookups.

## Why this matters for modders

### Adding a new ship

To add a new ship `ship_mlog_my_destroyer`:

1. Create component file `ship_mlog_my_destroyer.xml` in an `assets/.../components/` directory
2. Create macro file `ship_mlog_my_destroyer_macro.xml` referencing the component
3. Add entries to `index/macros.xml` (macro path) and `index/components.xml` (component path)
4. (Optional) Create loadout files for default equipment
5. (Optional) Reference from god.xml for initial seeding

Without step 3, the engine can't find your files.

### Index conflicts

Two mods adding the same macro name overwrite each other's index entries. Use `mlog_` prefix or other namespace convention to avoid collisions.

### Component reuse

A new ship doesn't always need a new component. If you're re-skinning, you can:
- Reuse an existing component
- Create a new macro with different properties
- Point the macro's `<component ref>` at the existing component

This is how vanilla creates "_a", "_b", "_c" variants of the same ship.

### DLC-aware paths

DLC content lives under separate paths (`extensions/ego_dlc_terran/assets/...`). Index files in extensions add to the same global namespace. Modders don't need to worry about this directly — the engine merges all extensions' indices.

### Modified macros affect all instances

Editing a macro file in a mod changes ALL future and existing instances of that macro. For per-instance changes, use MD `<set_value>` on the runtime object.

## Cross-references

- [Macro (data layer)](/lang/data/macro/) — macro file schema
- [Loadout](/game/behavior/loadout/) — runtime equipment from macros
- [Ship](/game/objects/ship/) — runtime instance of ship macro
- [Module](/game/objects/module/) — runtime instance of module macro

## Related architectural overviews

- [Galaxy seeding](/overviews/galaxy-seeding/) — references macros for initial spawns
- [Construction sequence](/overviews/construction-sequence/) — applies macros to build modules

---

:::tip[Pattern — index-mediated macro/component resolution]
Assets pipeline is **X4's lazy-loading mechanism** — index files map names to paths; engine loads on demand. Mods adding content MUST update index entries. The macro/component split lets the same component back multiple macros (re-skin pattern). Modders extending assets follow the vanilla three-file convention: macro XML + component XML + index entry.
:::

---
title: stationgroups.xml
description: Station composition templates — which modules make up a station of a given type. Referenced by construction plans and the find-suitable-station logic.
---

**`libraries/stationgroups.xml`** defines **station groups** — named collections of modules that make up a "shipyard of faction X" or "wharf of faction Y". Each group lists which production / build / storage / habitation modules a station includes. Used by construction logic and as a search target for "find a shipyard for this faction".

Vanilla `stationgroups.xml` is **233 lines** — small compared to god.xml / parameters.xml. Modders touching faction station design diff here.

## File structure

```xml
<?xml version="1.0" encoding="utf-8"?>
<groups>
    <group name="x4ep1_playerheadquarters">
        <module
            macro="module_x4ep1_pier_buildmodule_macro"/>
        <module
            macro="module_gen_dock_m_01_macro"/>
        <!-- ... more modules ... -->
    </group>

    <group name="shipyard_arg">
        <module macro="..."/>
        <!-- ... -->
    </group>
</groups>
```

Each `<group>` has a `name=` and a list of `<module>` children. Module macros come from `assets/structures/<category>/macros/`.

## Naming convention

Vanilla follows `<role>_<faction>` naming:

| Pattern | Example |
|---|---|
| `shipyard_<faction>` | `shipyard_arg`, `shipyard_par`, `shipyard_tel` |
| `wharf_<faction>` | `wharf_arg`, `wharf_tel` |
| `equipmentdock_<faction>` | `equipmentdock_arg` |
| `tradestation_<faction>` | `tradestation_arg` |
| `pirate_<faction>` | `pirate_scavenger` |
| `defence_<faction>` | `defence_arg` |
| `factory_<faction>_<ware>` | `factory_arg_energycells` |

Faction-prefixed groups serve as the search target for `find_station_by_true_owner` + macro filters.

## Common patterns

### "Add a new faction's shipyard group"

```xml
<add sel="//groups">
    <group name="shipyard_mlog_my_faction">
        <module macro="module_x4ep1_buildmodule_macro"/>
        <module macro="module_gen_dock_m_01_macro"/>
        <!-- + habitation, storage, etc. -->
    </group>
</add>
```

Then your new faction's `<god>` entry can reference this group via the station macro.

### "Add a module to an existing group"

```xml
<add sel="//groups/group[@name='shipyard_arg']">
    <module macro="module_mlog_my_custom_macro"/>
</add>
```

For an Argon-extension mod adding modules.

### "Replace all modules in a group"

```xml
<replace
    sel="//groups/group[@name='shipyard_mlog_old']">
    <group name="shipyard_mlog_old">
        <!-- new module set -->
    </group>
</replace>
```

For wholesale redesign.

## Common gotchas

- ⚠ **Module macros referenced in groups must exist.** Mistyping `module_gen_dock_m_01_macro` causes silent failure to build the station.
- ⚠ **Group composition affects the `.canbuildships` flag.** A "shipyard_X" group without a build module results in a station that *looks* like a shipyard but `.canbuildships=false`. Test in-game.
- ⚠ **Some groups are referenced by NAME from MD scripts.** Renaming a group breaks scripts that look it up. Always add new groups; don't rename vanilla ones.
- ⚠ **DLC groups exist in DLC override files.** `x4ep1_*` is Cradle of Humanity content. Modders extending DLC content add to DLC-specific files.
- ⚠ **`<group name="X">` is global.** Two mods can't define the same group name; `<replace>` is used to modify, `<add>` for new groups.

## Architectural context

- **Referenced by `constructionplans.xml`.** Construction plans build groups via stage sequences.
- **Referenced by `god.xml`.** Initial station placements use the group's macro composition.
- **MD-side search uses these as filters.** `find_station ... macro=` references the resulting station macro, not the group directly.

## Related

- [god.xml](/lang/data/god-xml/) — initial seedings reference station macros built from these groups.
- [constructionplans.xml](/lang/data/constructionplans-xml/) — defines build sequences for each group.
- [Station (game)](/game/objects/station/) — runtime station has `.macro` accessor.
- [Shipyard (game)](/game/objects/shipyard/) — discusses `shipyard_<faction>` naming pattern.

---

:::tip[Pattern — station composition templates]
stationgroups.xml is **the station-architecture catalog** — modules that make a station type. Modders adding new faction stations add a group entry, then reference it from god.xml + constructionplans.xml. Three files work together for a complete station addition.
:::

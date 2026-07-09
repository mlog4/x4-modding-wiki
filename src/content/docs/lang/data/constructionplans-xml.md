---
title: constructionplans.xml
description: The build-sequence catalogue — how stations are constructed module-by-module. Largest data file at 24K lines.
---

**`libraries/constructionplans.xml`** is the **build-sequence catalogue** — declarative XML that defines, for each station type, the exact sequence of modules built and the resources required. When AI factions decide to construct a new station, they read the plan here and execute it through their build modules.

Vanilla `constructionplans.xml` is **24669 lines** — the LARGEST data file in the game. Modders adding new factions or station types append entries; modders rebalancing build costs / sequences modify entries.

## File structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<plans>
    <!-- NOTE: plan-names are spoken in-game by Betty (usually page 20102, 20103) -->

    <plan id="arg_shipyard">
        <entry index="1"
            macro="module_arg_pier_buildmodule_macro"/>
        <entry index="2"
            macro="module_arg_pier_connection_macro"/>
        <!-- ... many more entries ... -->
    </plan>

    <plan id="tel_shipyard">
        <!-- ... -->
    </plan>
</plans>
```

Each `<plan>` has an `id=` and a sequence of `<entry>` children. Each entry references a module macro to build at a specific sequence index.

## Common `<plan>` and `<entry>` attributes

| Element | Attribute | Purpose |
|---|---|---|
| `<plan>` | `id="X"` | Plan id (referenced by faction logic) |
| `<plan>` | `name="..."` | Display name (Betty voice line) |
| `<entry>` | `index="N"` | Build sequence index (1-based) |
| `<entry>` | `macro="X"` | Module macro to build |
| `<entry>` | `stage="N"` | Stage (X4 9.0+ staged construction) |
| `<entry>` | `connections="X"` | Pre-build connections to other modules |

## Naming convention

Plans follow `<faction>_<role>` pattern, paralleling [stationgroups.xml](/lang/data/stationgroups-xml/):

| Pattern | Example |
|---|---|
| `<faction>_shipyard` | `arg_shipyard`, `par_shipyard` |
| `<faction>_wharf` | `arg_wharf`, `tel_wharf` |
| `<faction>_equipmentdock` | `arg_equipmentdock` |
| `<faction>_tradestation` | `arg_tradestation` |
| `<faction>_factory_<ware>` | `arg_factory_energycells` |

Faction-prefixed plans are how NPC factions know which sequence to use when expanding.

## Common patterns

### "Add a new plan"

```xml
<add sel="//plans">
    <plan id="mlog_my_shipyard"
        name="{20102, 1001}">
        <entry index="1"
            macro="module_x4ep1_buildmodule_macro"/>
        <entry index="2"
            macro="module_gen_dock_m_01_macro"/>
        <!-- ... -->
    </plan>
</add>
```

Then your faction logic spawns stations using this plan.

### "Add a module to an existing plan"

```xml
<add sel="//plans/plan[@id='arg_shipyard']">
    <entry index="42"
        macro="module_mlog_my_custom_macro"/>
</add>
```

Be careful — `index=42` must not collide with existing entries.

### "Replace a plan's entry"

```xml
<replace sel="//plans/plan[@id='arg_shipyard']/entry[@index='5']/@macro">
    module_mlog_replacement_macro
</replace>
```

For wholesale changes to a vanilla plan.

## Common gotchas

- ⚠ **Largest data file in the game (24K lines).** Be thoughtful about diff selectors — broad XPath can have unintended matches.
- ⚠ **`index=` must be unique within a plan.** Two entries with the same index causes silent build-order corruption.
- ⚠ **X4 9.0+ adds `<stage>` semantics.** New plans should use staged construction; old plans without stages still work but can't be appended via `<create_construction_sequence>` if the station already has staged construction. See [Build module](/game/objects/build-module/) gotchas.
- ⚠ **Module connections matter.** A module entry without proper connectors (`module_gen_conn_*`) ends up disconnected. Reference vanilla plans for connection patterns.
- ⚠ **Plan changes affect future stations only.** Existing stations built with old plans don't update. For mid-save changes, use MD construction actions.
- ⚠ **Betty voice lines are tied to plan id.** Custom plans without a corresponding voice entry are silent in-game. Use `name="{20102, ...}"` with a registered text entry, or accept silent narration.
- ⚠ **DLC plans extend the file.** Cradle of Humanity adds Terran plans; Tides of Avarice adds Avarice plans. Mod compatibility means not stepping on DLC entries.

## Architectural context

- **Single largest data file.** Performance load impact at game start; mods adding hundreds of entries may notice.
- **Drives faction economy.** When `factionlogic_economy` decides to build a new factory, it reads here.
- **Three-file pattern for new stations:**
  1. Module macros (in `assets/.../macros/`)
  2. Station group ([stationgroups.xml](/lang/data/stationgroups-xml/))
  3. Construction plan (here)

## Related

- [stationgroups.xml](/lang/data/stationgroups-xml/) — the modules that plans build.
- [god.xml](/lang/data/god-xml/) — initial spawns parallel to runtime plans.
- [Build module (game)](/game/objects/build-module/) — runtime executor.
- [Construction sequence (game)](/game/behavior/construction-sequence/) — the runtime representation.
- [Station (game)](/game/objects/station/) — `.plannedconstruction.sequence` accessor.

---

:::tip[Pattern — sequenced build catalogue]
constructionplans.xml is **the build catalogue** — every NPC station's growth trajectory is here. The largest file in vanilla. When modders extend factions, they add entries here as the last of three coordinated changes (macros → groups → plans).
:::

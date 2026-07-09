---
title: Venture platform
description: Station module providing venture docks for sending player ships to other universes (Ventures DLC). Tracks venture-docks and the ships currently away on ventures.
---

A **Venture platform** is a station [Module](/game/objects/module/) that hosts venture docks — special docks the player uses to send ships to other universes (other players' games via the Ventures system from the DLC). Each platform tracks its docks and the ships currently away.

**Inheritance:** `component → destructible → module → ventureplatform`. The datatype adds two list accessors.

**Ventures DLC content.** All venture-platform mechanics depend on Ventures being installed and active. The platform macros (`macro.dockarea_gen_m_venturer_01_macro`, `macro.module_gen_ventureplatform_cross_01_macro`, etc.) come from the DLC.

## Properties

### Venture-platform-specific

| Property | Type | Description |
|---|---|---|
| `.venturedocks` | list | All venture docks associated with this platform |
| `.ventureships` | list | All ships currently away on ventures from this platform |

### Inherited

| Property | Source | Description |
|---|---|---|
| `.numdocks.{docksize}` | module | Generic per-size dock counts |
| `.haswalkableroom` | module | Walkable interior (true — players walk to the venture terminal) |
| `.hull` | destructible | Damage state |

## Related properties on other types

- **`module.isventuremodule`** — see [Connection module](/game/objects/connection-module/). This flag marks *non-platform* venture content (connectors, dock areas).
- **`cluster.isventurer`** — `.isventurer=true` is set on the special "ventures cluster" where venture ships disappear to (`scriptproperties.xml:1281`).
- **Ship `find_*` filters** — vanilla `notifications.xml:516, 559` uses `venturercluster="true"` flag on `find_ship_by_true_owner` to include venturer-cluster ships in lookups.

## Common patterns

### "Find all venture dock areas in player station"

Vanilla doesn't usually go through `.ventureplatform` directly — it finds the dock-area macro on the station:

```xml
<find_object_component
    groupname="$VentureDocks"
    object="$PlayerStation"
    macro="[macro.dockarea_gen_m_venturer_01_macro]"
    checkoperational="false"
    multiple="true"/>
```

Pattern from `story_ventures.xml:203`, `rml_escort_ambiguous.xml:77`.

### "Count venture modules on a build anchor"

```xml
<count_object_components
    groupname="$VentureModules"
    object="event.param.buildanchor"
    macro="macro.dockarea_gen_m_venturer_01_macro"
    min="1"/>
```

Pattern from `rml_escort_ambiguous.xml:195`. Used to gate venture-specific quest content.

### "Detect player station with venture platform"

```xml
<do_for_each name="$mod" in="$Station.modules">
    <do_if value="$mod.isclass.ventureplatform">
        <write_to_logbook
            text="$Station.knownname
                + ' has a venture platform with '
                + $mod.venturedocks.count
                + ' docks and '
                + $mod.ventureships.count
                + ' ships out'"/>
    </do_if>
</do_for_each>
```

## Blueprint grants (vanilla pattern)

Vanilla `setup.xml:1122` grants venture-related blueprints in one batch:

```xml
<add_blueprints wares="[
    ware.module_gen_conn_venturerbase_01,
    ware.module_gen_conn_venturerbase_02,
    ware.module_gen_conn_venturerbase_03,
    ware.module_gen_conn_venturercross_01,
    ware.module_gen_conn_venturervertical_01,
    ware.module_gen_conn_venturervertical_02,
    ware.module_gen_dock_m_venturer_01,
    ware.module_gen_ventureplatform_cross_01
]"/>
```

Modders extending venture content should follow this idiom — grant the related-blueprint set together rather than scattered.

## Common gotchas

- ⚠ **DLC-gated content.** All venture macros require Ventures DLC. Wrap references with availability checks if your mod targets Base + Ventures users.
- ⚠ **`.venturedocks` lists DOCKS, not ships.** Use `.ventureships` for the ships currently away. Easy to confuse.
- ⚠ **Vanilla rarely accesses `.ventureplatform` directly.** Most venture queries go through `find_object_component macro=` against specific macros. The platform datatype is mostly for mod use.
- ⚠ **`module.isventuremodule` is on Connection module / Dock area, NOT on the platform itself.** The flag covers the *companion* modules (connectors, dock areas) of a venture installation, distinguishing them from normal station counterparts. Filter accordingly.
- ⚠ **Venturer cluster is special.** `cluster.isventurer=true` marks the away-cluster where venture ships exist. `find_ship_by_true_owner` needs `venturercluster="true"` to include them.
- ⚠ **Venture ships do not respond to normal commands while away.** Treat them as "in transit" with no script-level control. Wait for return events.

## Architectural context

- **Ventures DLC system:** Architectural overview *Ventures system* — away-cluster, time-based return, reward distribution.
- **Player station expansion with venture content:** Architectural overview *Plot expansion UX* — how players add venture platforms via the construction menu.

## Related

- [Module](/game/objects/module/) — parent abstraction.
- [Connection module](/game/objects/connection-module/) — `.isventuremodule` flag.
- [Cluster](/game/world/cluster/) — `.isventurer` marks the away-cluster.
- [Station](/game/objects/station/) — host.
- [Ship](/game/objects/ship/) — what gets sent on ventures.
- [Ware](/game/economy/ware/) — venture-platform blueprint wares.

---

:::tip[Pattern — DLC-gated module subtype]
Venture platform is the only module subtype tied to specific DLC content. Mods that extend it must handle the "no Ventures DLC" case gracefully — typically via `<do_if value="@$VentureMacro">` guards.
:::

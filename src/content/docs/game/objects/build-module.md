---
title: Build module
description: Station module that builds ships and equipment. The most complex module type — controls what a station can produce and tracks every ongoing build.
---

A **Build module** is a station [Module](/game/objects/module/) that builds ships and equipment. It's the engine inside every [Shipyard](/game/objects/shipyard/), [Wharf](/game/objects/wharf/), [Equipment dock](/game/objects/equipment-dock/), and player Plot — the actual construction happens here. Build modules contain one or more [Build processors](#buildprocessor) which run individual build tasks.

Build module is the **most complex module datatype** — 50+ accessors covering capability filters, ongoing-build queries, construction-vessel state, and per-category equipment restrictions.

**Inheritance:** `component → destructible → module → walkablemodule → buildmodule`.

## Properties

The datatype is dense; group by concern.

### Build processors (the actual build engines)

| Property | Type | Description |
|---|---|---|
| `.buildprocessor` | buildprocessor | A contained build processor |
| `.buildprocessors` | list | All contained build processors |
| `.freebuildprocessor` | buildprocessor | A free processor (not currently building) |
| `.freebuildprocessors` | list | All free processors |
| `.isbusy` | bool | ALL processors are building |
| `.isbuilding` | bool | ANY processor is building |

### Capability flags

| Property | Type | Description |
|---|---|---|
| `.canbuildclass.{class}` | bool | Can build objects of this class |
| `.canequipclass.{class}` | bool | Can equip objects of this class |
| `.cansupplyclass.{class}` | bool | Can supply ammo/drones for this class |
| `.canbuildequipment.{ware}` | bool | Can install this specific equipment ware |
| `.canbuildequipment.{list}` | bool | Can install all wares in list |
| `.canbuildmacro.{macro}` | bool | Can build this specific macro |

### Buildable wares (whitelist / blacklist style)

| Property | Type | Description |
|---|---|---|
| `.buildequipment.wares` | warelist | All equipment this module can build (default + included - excluded) |
| `.buildequipment.absolute` | warelist | Absolute override list |
| `.buildequipment.included` | warelist | Adds on top of default |
| `.buildequipment.excluded` | warelist | Removes from default |
| `.buildships.wares` | warelist | All ships this module can build |
| `.buildships.absolute` / `.included` / `.excluded` | warelist | Same overrides for ships |
| `.buildmacros` | list | List of macros buildable |

### Per-category equipment

The `.buildequipment.X` family is split by equipment type:

| Property | What it returns |
|---|---|
| `.buildequipment.countermeasures` | Countermeasure wares |
| `.buildequipment.drones` | Drone wares |
| `.buildequipment.engines` | Engine wares |
| `.buildequipment.lasertowers` | Lasertower wares |
| `.buildequipment.mines` | Mine wares |
| `.buildequipment.missiles` | Missile wares |
| `.buildequipment.navbeacons` | Nav beacon wares |
| `.buildequipment.resourceprobes` | Resource probe wares |
| `.buildequipment.satellites` | Satellite wares |
| `.buildequipment.shields` | Shield wares |
| `.buildequipment.software` | Software wares |
| `.buildequipment.thrusters` | Thruster wares |
| `.buildequipment.turrets` | Turret wares |
| `.buildequipment.weapons` | Weapon wares |

### Construction vessel state

| Property | Type | Description |
|---|---|---|
| `.requiresconstructionvessel` | bool | Build requires a construction vessel right now |
| `.mayrequireconstructionvessel` | bool | Build may need a vessel (tentative — `.requiresconstructionvessel` is authoritative once known) |
| `.iswaitingforconstructionvessel` | bool | Has resources / storage but is blocked on vessel arrival |
| `.iswaitingforresources` | bool | Blocked on input wares |
| `.iswaitingforstorage` | bool | Blocked on output storage space |
| `.constructionvessel` | ship | Currently-deployed vessel, if any |
| `.constructionvesseldeployed` | bool | Vessel is on-station |

### Current build state

| Property | Type | Description |
|---|---|---|
| `.constructingcomponents` | list | All components currently being constructed |
| `.constructingmodule` | component | Module currently under construction |
| `.buildstorage` | buildstorage | Linked build storage (raw materials) |
| `.buildanchor` | component | Anchor point for builds |

### Resources

| Property | Type | Description |
|---|---|---|
| `.buildresources.{build}` | wareamountlist | Total resources for a build (or remaining if in-progress) |
| `.neededbuildresources.{build}` | wareamountlist | Resources still needed for a build |

### Docks

| Property | Type | Description |
|---|---|---|
| `.numdocks.{docksize}` | int | Per-size dock count (inherited from module) |
| `.dock.{docksize}` | dockingbay | A suitable dock for this size (may be occupied) |
| `.freedock.{docksize}` | dockingbay | A free suitable dock |

## buildprocessor sub-datatype

Each build module contains one or more `buildprocessor` components. The processor is the *active build engine* — `buildmodule.buildprocessor.build` is the current build task; `buildmodule.buildprocessor.queuedbuild` is the next.

Processor accessors mirror most of the buildmodule's, plus time-tracking:

| Property | Type | Description |
|---|---|---|
| `.buildmodule` | buildmodule | Containing module |
| `.build` | build | Current build task |
| `.queuedbuild` | build | Next queued build |
| `.elapsedtime` | time | Time spent on current build |
| `.elapsedsteptime` | time | Time spent on current step |
| `.steptime` | time | Per-step time |
| `.totaltime` | time | Total estimated time |
| `.canabortbuild` | bool | Current build can be cancelled |
| `.stepresources` | wareamountlist | Resources per step |
| `.laststepresources` | wareamountlist | Resources for final step (may differ due to rounding) |
| `.neededslotresources` | wareamountlist | Resources needed for current build slot |
| `.neededsequenceresources` | wareamountlist | Resources for the whole sequence |
| `.recycled` | wareamountlist | Resources reclaimed during recycling builds |

Plus the same `.canbuild*` / `.buildequipment.X` family inherited from the module.

## Actions

### Add a build to a station's queue

```xml
<add_build
    object="$BuildModule"
    macro="$ShipMacro"
    faction="faction.player"/>
```

### Append modules to a station via the canonical pipeline

```xml
<create_construction_sequence
    station="$Station"
    macros="$NewPlannedModules"
    connectors="$Connectors"
    base="$BaseSequence"/>

<apply_construction_sequence
    station="$Station"
    sequence="$ConstructionSequence"/>
```

Pattern from vanilla `finalisestations.xml:91-160`, `diplomacy.xml:311-347`. This is THE pipeline for adding new modules to an existing station.

### Stage-aware build appending (X4 9.0+)

```xml
<add_build_to_expand_station
    object="$Station.buildstorage"
    buildobject="$Station"
    constructionplan="$ConstructionPlan"
    result="$BuildID"/>
```

Pattern from `factionsubgoal_buildstation.xml:211`, `finalisestations.xml:359`. **Required for staged stations in X4 9.0+** — `<create_construction_sequence>` errors on stations with `.hasstagedconstruction=true`. Use the `add_build_to_expand_station` pathway instead.

### Restrict / extend what a station can build

```xml
<!-- Replace the entire list (absolute) -->
<set_equipment_wares_absolute
    container="$Container"
    wares="[ware.X, ware.Y]"/>

<!-- Add on top of defaults -->
<set_equipment_wares_included
    container="$Container"
    wares="[ware.X]"/>

<!-- Remove from defaults -->
<set_equipment_wares_excluded
    container="$Container"
    wares="[ware.X]"/>

<!-- Same family for ships -->
<set_ship_wares_absolute container="$Wharf"
    wares="[ware.ship_arg_m_corvette_01_a]"/>
```

Read back via `.buildequipment.absolute` / `.included` / `.excluded` / `.wares` (effective list).

### Query "is this module busy right now"

```xml
<do_if value="$BuildModule.isbusy">
    <!-- all processors building -->
</do_if>

<do_if value="$BuildModule.isbuilding">
    <!-- at least one processor active -->
</do_if>
```

`.isbusy` is AND, `.isbuilding` is OR — easy to confuse.

## Events

There is no `event_buildmodule_X` family. Builds are observed through:

| Event | When | Notes |
|---|---|---|
| `event_object_construction_sequence_created` | A new sequence applied to a station | Heavy vanilla use in `finalisestations.xml` |
| `event_object_destroyed` | Build module destroyed | Filter `event.object.isclass.{class.buildmodule}` |

Per-build completion: there's no `event_build_finished`. Watch the parent station's product list for new ships appearing, or poll `buildprocessor.build` for null transitions.

## Common gotchas

- ⚠ **In X4 9.0, `create_construction_sequence` errors on stations with `.hasstagedconstruction=true`.** Guard with `do_if value="not $Station.hasstagedconstruction"` or use `<add_build_to_expand_station>` instead. From memory + `finalisestations.xml` vanilla pattern.
- ⚠ **`.isbusy` (AND) vs `.isbuilding` (OR).** Two processors with one building shows `isbuilding=true, isbusy=false`. Pick the right one.
- ⚠ **`.requiresconstructionvessel` vs `.mayrequireconstructionvessel`.** The first is authoritative once the build is checked; the second is a forward-looking tentative read. Use the authoritative one for "can this start now".
- ⚠ **`.canbuildmacro.{$macro}` requires a wareref, not a string id.** Same as Shipyard gotcha — pass `macro.X`, not `"X"`.
- ⚠ **`set_equipment_wares_*` operates at the build module level, not the station.** A station with multiple equipment build modules needs you to target each. Or use the container-level shortcuts (`Station.canbuildequipment.{$ware}`) for reads.
- ⚠ **`.buildequipment.wares` effective list reflects ALL overrides.** It's `(default + included) - excluded`. To know what was explicitly set, read `.absolute` / `.included` / `.excluded` separately.
- ⚠ **Build processors are NOT independent objects.** They are sub-components of the build module — accessed via the module, not via `find_object class=class.buildprocessor`.
- ⚠ **`iswaitingforresources` and `iswaitingforstorage` are distinct stall reasons.** Mods that monitor builds should check both.

## Examples

### Example 1: Find busy build modules in player shipyards

```xml
<find_station_by_true_owner name="$Stations"
    space="player.galaxy"
    faction="faction.player"
    multiple="true"/>

<set_value name="$Building" exact="0"/>

<do_for_each name="$s" in="$Stations">
    <do_for_each name="$mod" in="$s.modules">
        <do_if value="$mod.isclass.buildmodule
            and $mod.isbuilding">
            <set_value name="$Building"
                operation="add" exact="1"/>
        </do_if>
    </do_for_each>
</do_for_each>

<write_to_logbook
    text="$Building + ' build modules active'"/>
```

### Example 2: Detect build stalled on construction vessel

```xml
<cue name="WatchStalledBuilds" instantiate="true">
    <conditions>
        <event_cue_signalled cue="this"/>
    </conditions>
    <actions>
        <find_station_by_true_owner name="$Stations"
            space="player.galaxy"
            faction="faction.player"
            multiple="true"/>

        <do_for_each name="$s" in="$Stations">
            <do_for_each name="$mod" in="$s.modules">
                <do_if value="$mod.isclass.buildmodule
                    and $mod.iswaitingforconstructionvessel">
                    <write_to_logbook
                        text="$s.knownname
                            + ' waiting for construction vessel'"/>
                </do_if>
            </do_for_each>
        </do_for_each>
    </actions>
</cue>
```

### Example 3: Expand a player HQ with new modules (X4 9.0+ safe)

```xml
<create_construction_sequence
    station="$HQ"
    macros="$NewModules"
    base="$HQ.plannedconstruction.sequence"
    comment="async calculation"/>

<!-- ... event_object_construction_sequence_created fires ... -->

<do_if value="not $HQ.hasstagedconstruction">
    <apply_construction_sequence
        station="$HQ"
        sequence="event.param"/>
</do_if>
<do_else>
    <add_build_to_expand_station
        object="$HQ.buildstorage"
        buildobject="$HQ"
        constructionplan="event.param"
        result="$BuildID"/>
</do_else>
```

Pattern from `diplomacy.xml:311-347` + memory note about staged-construction guard.

## Architectural context

- **Station construction pipeline:** Architectural overview *Construction sequence* — `create_construction_sequence` → `event_object_construction_sequence_created` → `apply_construction_sequence` → `signal_objects 'init station'`. The full bootstrap.
- **Build module placement decisions:** Architectural overview *Faction economy* — NPC factions decide which build module variants to add based on shortage signals.
- **Player-driven station expansion:** Architectural overview *Plot expansion UX* — how the player's drag-modules-into-plot flow translates into MD-side build module additions.
- **Construction vessel lifecycle:** Architectural overview *Construction vessel* — when needed, dispatch, deployment, return.

## Related

- [Module](/game/objects/module/) — parent abstraction.
- [Station](/game/objects/station/) — host; aggregate `.canbuildships`, `.canbuildequipment.{$ware}` look at all build modules.
- [Build processor](#buildprocessor) — sub-component doing the actual work.
- [Build storage](/game/objects/build-storage/) — `.buildstorage` — input materials.
- [Shipyard](/game/objects/shipyard/) / [Wharf](/game/objects/wharf/) / [Equipment dock](/game/objects/equipment-dock/) — station subtypes that contain build modules.
- [Faction](/game/factions/faction/) — `set_equipment_wares_*` can be faction-scoped.
- [Construction sequence](/game/behavior/construction-sequence/) — the data structure used by build module actions.

---

:::tip[Pattern — rich module + processor child datatype]
Build module is the canonical example of *a module that owns a child datatype with significant per-instance state*. Reading "what is this station doing" goes module → processor → build. Same shape (but lighter) appears in production module → cycle state.
:::

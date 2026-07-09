---
title: Storage module
description: A station module that provides cargo capacity for a specific transport type (container / solid / liquid / condensate).
---

A **Storage module** is the station component that provides cargo capacity. A station's total cargo space is the sum of its storage modules' capacities — but each module is **transport-typed**: a Solid storage holds ore but not energy cells; a Liquid storage holds methane but not silicon.

**Inheritance:** `component → destructible → module → storagemodule`. The datatype itself is tiny — just `cargo` and `waretransport`. The interesting modder logic lives on the parent [Station](/game/objects/station/) or [Container](/game/objects/container/), which aggregates all storage modules.

**Sibling module subtypes:** [Production module](/game/objects/production-module/), [Build module](/game/objects/build-module/), [Connection module](/game/objects/connection-module/), [Defence module](/game/objects/defence-module/), [Habitation module](/game/objects/habitation-module/), [Welfare module](/game/objects/welfare-module/), [Pier](/game/objects/pier/), [Processing module](/game/objects/processing-module/), [Venture platform](/game/objects/venture-platform/).

## Properties

### storagemodule

| Property | Type | Description |
|---|---|---|
| `.cargo` | modulecargolist | Wares stored in *this* module |
| `.waretransport` | list | Transport types this module supports (single-element list in vanilla) |

### modulecargolist (the cargo accessor)

| Property | Type | Description |
|---|---|---|
| `.free` | int | Free cargo volume remaining |
| `.capacity` | int | Total cargo volume |
| `.{ware}` | int | Amount of `{ware}` currently stored (inherited from `containercargolist`) |
| `.list` | warelist | Ware types currently stored |

### Inherited from module

| Property | Type | Description |
|---|---|---|
| `.numdocks.{docksize}` | int | Connected dockingbays (rare on storage; mostly zero) |
| `.haswalkableroom` | bool | NPC-accessible interior |

### Inherited from destructible

| Property | Type | Description |
|---|---|---|
| `.hull` / `.hullpercentage` | hp / float | Damage state |

## Transport types

`waretransport` is an enum (`scriptproperties.xml:2355`). A storage module supports exactly one type; a station typically has multiple modules of different types to cover all its needs.

| Type | Common wares | Notes |
|---|---|---|
| `waretransport.container` | Most manufactured wares (Hull Parts, Microchips, Med Supplies) | The most common type |
| `waretransport.solid` | Ore, Silicon, Ice, Nividium | Mining outputs |
| `waretransport.liquid` | Methane, Hydrogen, Helium | Gas mining outputs |
| `waretransport.condensate` | Specific Ventures wares | Rare type |
| `waretransport.passenger` | Passengers | Not a "ware" per se — passenger transport ships |

The `.tag` property of each `waretransport` value (e.g. `waretransport.container.tag` = `tag.container`) is the bridge for compatibility checks at the find_* and trade-offer level.

## Actions

Storage module has no actions of its own. All meaningful operations are on the **station / container** level, since cargo is logically a station property.

### Read free space across a station (by type)

There is no `Station.cargo.solid.free` shortcut. Iterate the modules:

```xml
<set_value name="$SolidFree" exact="0"/>

<do_for_each name="$module" in="$Station.modules">
    <do_if value="$module.isclass.{class.storage}
        and $module.waretransport.indexof.{waretransport.solid} gt 0">
        <set_value name="$SolidFree"
            operation="add"
            exact="$module.cargo.free"/>
    </do_if>
</do_for_each>
```

Pattern: vanilla `tutorial_mining.xml:160` uses the same `waretransport.indexof` predicate.

### Find storage modules that match a ware's transport type

```xml
<do_for_each name="$module" in="$Station.modules">
    <do_if value="$module.isclass.{class.storage}
        and $module.waretransport.indexof.{$ware.waretransport} gt 0">
        <!-- this module can hold $ware -->
    </do_if>
</do_for_each>
```

### Add cargo at the container level (not at the module)

```xml
<add_cargo
    object="$Station"
    ware="ware.energycells"
    exact="200"/>
```

`add_cargo` routes wares automatically to a compatible storage module. You cannot `add_cargo object="$Module"` — the module is a detail, not the cargo holder.

### Force a particular storage module to keep / dump wares

There is no direct API. To reserve capacity, set ware **targets** at the station-cargo level:

```xml
<set_cargo_target
    object="$Station"
    ware="ware.energycells"
    exact="50000"/>
```

The engine then distributes ware allocation across compatible storage modules.

## Libraries

There are no dedicated `LIB_Generic.Storage*` helpers. Storage queries are inline. The closest related helpers:

| Library | Purpose | Source line |
|---|---|---|
| `md.LIB_Generic.FindShipMacroForCargo` | Pick a ship macro that can carry given cargo (matches by transport type) | 1427 |
| `md.LIB_Generic.Add_Wares_For_Module` | When new production modules are added, add their wares to the station ware list | 5089 |

## Events

There is no `event_storage_X` family. Cargo changes are observed through:

| Indirect signal | Where |
|---|---|
| `event_trade_completed` | A trade landed at the station — cargo content changed |
| `event_object_destroyed` | If `event.object` is a storage module, station capacity dropped |
| `event_object_attacked` | Storage module under attack (precedes possible destruction) |
| Polling `$Module.cargo.free` | Capacity tracking for triggered alerts |

## Common gotchas

- ⚠ **`$Module.waretransport` is a LIST, not a single value.** Even though most storage modules support one type, the accessor returns a list. Use `.indexof.{waretransport.X} gt 0` for membership.
- ⚠ **There is no `$Station.cargo.{type}.free` shortcut.** Free-space-by-type requires iterating modules. Don't assume a station's container-level cargo can answer "how much liquid space do I have left".
- ⚠ **`add_cargo object="$Module"` is invalid.** The module is just a capacity provider; cargo lives on the container. Always `add_cargo object="$Station"`.
- ⚠ **A station with zero matching storage modules cannot hold a ware EVEN if Station.cargo.capacity is huge.** A pure-container station rejects ore. Always check the storage-module compatibility before assuming `Station.cargo.free` is usable for a specific ware.
- ⚠ **Storage modules can be destroyed.** A station that lost its only solid-storage module silently becomes unable to accept ore. Listen for `event_object_destroyed` and recheck `Station.canstore.{$ware}` (container-level).
- ⚠ **`.waretransport.indexof` returns the 1-based index, NOT a boolean.** A return of `1` means "first element". Treat `>= 1` (`gt 0`) as truthy; treat `0` as "not present".
- ⚠ **Modded transport types must be added to `libraries/waretransports.xml`.** A custom `waretransport.exotic` declared in a ware but not in the transport library will fail compatibility checks silently.

## Examples

### Example 1: Audit player stations' free capacity by transport type

```xml
<find_station_by_true_owner name="$Stations"
    space="player.galaxy"
    faction="faction.player"
    multiple="true"/>

<set_value name="$TotalContainerFree" exact="0"/>
<set_value name="$TotalSolidFree" exact="0"/>
<set_value name="$TotalLiquidFree" exact="0"/>

<do_for_each name="$station" in="$Stations">
    <do_for_each name="$module" in="$station.modules">
        <do_if value="$module.isclass.{class.storage}">
            <do_if value="$module.waretransport.indexof.{waretransport.container} gt 0">
                <set_value name="$TotalContainerFree"
                    operation="add"
                    exact="$module.cargo.free"/>
            </do_if>
            <do_if value="$module.waretransport.indexof.{waretransport.solid} gt 0">
                <set_value name="$TotalSolidFree"
                    operation="add"
                    exact="$module.cargo.free"/>
            </do_if>
            <do_if value="$module.waretransport.indexof.{waretransport.liquid} gt 0">
                <set_value name="$TotalLiquidFree"
                    operation="add"
                    exact="$module.cargo.free"/>
            </do_if>
        </do_if>
    </do_for_each>
</do_for_each>

<write_to_logbook
    text="'Player free space — Container: ' + $TotalContainerFree
        + ' Solid: ' + $TotalSolidFree
        + ' Liquid: ' + $TotalLiquidFree"/>
```

### Example 2: Check if a station can store a given ware

```xml
<set_value name="$canStore" exact="false"/>

<do_for_each name="$module" in="$Station.modules">
    <do_if value="$module.isclass.{class.storage}
        and $module.waretransport.indexof.{$ware.waretransport} gt 0
        and $module.cargo.free gt $amount * $ware.volume">
        <set_value name="$canStore" exact="true"/>
        <break/>
    </do_if>
</do_for_each>

<do_if value="not $canStore">
    <write_to_logbook
        text="$Station.knownname + ' cannot store '
            + $amount + ' × ' + $ware.name"/>
</do_if>
```

### Example 3: Warn when storage drops below threshold

```xml
<cue name="WatchStorage" instantiate="true">
    <conditions>
        <event_object_destroyed object="$WatchedStation"/>
    </conditions>
    <actions>
        <set_value name="$TotalCap" exact="0"/>
        <do_for_each name="$module" in="$WatchedStation.modules">
            <do_if value="$module.isclass.{class.storage}">
                <set_value name="$TotalCap"
                    operation="add"
                    exact="$module.cargo.capacity"/>
            </do_if>
        </do_for_each>
        <do_if value="$TotalCap lt 100000">
            <write_to_logbook
                text="$WatchedStation.knownname
                    + ' storage critical: only '
                    + $TotalCap + ' total capacity left'"/>
        </do_if>
    </actions>
</cue>
```

## Architectural context

- **How factions decide what storage modules to build:** Architectural overview *Faction economy* — `Econ_Manager` reads cargo backlogs (`iswaitingforstorage` on producers) → schedules new storage of the right type.
- **How cargo routes through a station:** Architectural overview *Station cargo flow* — `add_cargo` dispatches to compatible modules; production output is held in `containercargolist`; trade subscriptions read from there.
- **How trade ships pick destinations:** Architectural overview *Trade routing* — pickers filter by `Station.cargo.{$ware}.target` and `Station.maybuyfrom`/`.maysellto`.

## Related

- [Module](/game/objects/module/) — parent generic-module page.
- [Production module](/game/objects/production-module/) — companion module that fills storage.
- [Processing module](/game/objects/processing-module/) — sibling that fills storage from recyclables.
- [Ware](/game/economy/ware/) — `$ware.waretransport` is the compat key.
- [Station](/game/objects/station/) — owner of storage; aggregates `.cargo` across modules.
- [Container](/game/objects/container/) — the type that supplies `Station.cargo.{ware}`, `.buyprice`, `.sellprice`.

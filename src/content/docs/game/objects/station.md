---
title: Station
description: A persistent structure in space owned by a faction.
---

A **Station** is a persistent structure in space owned by a faction. Stations contain modules (production, docks, defence, habitation), employ NPCs, trade wares, and serve as hubs for ship operations.

**Subtypes:** [Shipyard](./shipyard/), [Wharf](./wharf/), [Equipment Dock](./equipment-dock/), [Trade Station](./trade-station/), [Defence Station](./defence-station/), [Production Factory](./production-factory/), [Pirate Base](./pirate-base/), [Player Headquarters](./player-hq/).

**Contains:** [Modules](./module/), [Dockareas](./dockarea/), [Build plot](./build-plot/).

## Properties

Most common accessors used by vanilla MD scripts and mods.

| Property | Type | Description |
|---|---|---|
| `.faction` / `.owner` | faction | Current owning faction |
| `.trueowner` | faction | True owner — differs from `.faction` during boarding/capture |
| `.knownname` | string | Display name |
| `.sector` | sector | Containing [Sector](../world/sector/) |
| `.zone` | zone | Containing [Zone](../world/zone/) |
| `.modules` | list | All [Modules](./module/) of this station |
| `.container` | container | Aggregate inventory and value |
| `.container.value` | int (Cr) | Total value of modules + drones |
| `.cargo` | container | Cargo inventory |
| `.cargo.list` | list | List of wares in cargo |
| `.buildplot` | buildplot | Build plot info |
| `.buildplot.price` | int (Cr) | Build plot price |
| `.dockingbays` | list | Docking bays |
| `.crew` | list | NPC crew |
| `.workforce` | int | Current workforce |
| `.maxworkforce` | int | Maximum workforce |
| `.controlpost.manager` | npc | Station manager NPC |
| `.istradestation` | bool | Is a trade station |
| `.isfactionheadquarters` | bool | Is a faction HQ |
| `.isplannedshipyard` | bool | Is a planned shipyard |
| `.isplannedwharf` | bool | Is a planned wharf |
| `.isplanneddefencestation` | bool | Is a planned defence |
| `.hasfixedconstruction` | bool | Has fixed construction (cannot extend) |
| `.hasstagedconstruction` | bool | Has staged construction (X4 9.0+) |

## Actions

### Create a station

```xml
<create_station name="$myStation"
    macro="..."
    faction="..."
    object="$sector"
    position="[x, y, z]"/>
```

### Change owner

```xml
<set_owner object="$station" faction="faction.player"/>
```

For ships, use [`md.LIB_Generic.TransferShipOwnership`](#libraries) (handles fleet detachment). For stations, `<set_owner>` is typically sufficient — but **verify subordinate ship behaviors** with your specific scenario.

### Destroy

```xml
<destroy_object object="$station"/>
```

### Find stations by faction

```xml
<find_station_by_true_owner name="$stations"
    faction="faction.argon"
    space="player.galaxy"/>
```

:::caution[Gotcha]
`space=` is **required**. Without it, returns 0 results silently across the entire galaxy.

See: `<find_*_by_true_owner>` requires `space=` attribute.
:::

### Filter for normal vs special stations

```xml
<do_if value="not $station.isplanneddefencestation
              and not $station.isplannedshipyard
              and not $station.isplannedwharf
              and not $station.istradestation
              and not $station.isfactionheadquarters">
    <!-- this is a normal production/storage station -->
</do_if>
```

This is the filter used by the [Buy and Sell Stations](https://workshop.example/) mod to identify stations the player can buy or sell.

## Libraries

Vanilla helpers for working with stations. Source: `md/lib_generic.xml`.

| Library | Purpose | Source line |
|---|---|---|
| `md.LIB_Generic.FindNearestStationForFaction` | Closest station of given faction | 1240 |
| `md.LIB_Generic.FindStationsForFactionByDistance` | All stations sorted by distance | 1270 |
| `md.LIB_Generic.TransferStationOwnership` | Transfer with cleanup | 1559 |
| `md.LIB_Generic.SetStationMinHull` | Set hull floor | 2971 |
| `md.LIB_Generic.RequestObjectInvincibility` | Mark indestructible | 3522 |
| `md.FinaliseStations.NewStation_GenerateFactory_Signal` | Public API for finalizing a created station | finalisestations.xml:192 |

## Events

Events that fire about stations.

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Station destroyed | Filter by `event.object.isclass.{class.station}` |
| `event_object_changed_owner` | Ownership changed | — |
| `event_object_attacked` | Under attack | Fires from aiscript, not MD-side |
| `event_god_created_factory` | Engine-side new station spawn | `isgamestartgodentry=true/false` distinguishes initial seed from runtime |

For galaxy-wide combat notifications, see [Behavior → Order](../behavior/order/) — aiscripts emit `'station_under_attack'` signal to `player.galaxy`.

## Common gotchas

- ⚠ `<find_station>` (without `_by_true_owner`) **excludes player stations**. Use `find_station_by_true_owner` or merge results from both.
- ⚠ Module recipes accessible via `$Mod.macro.ware.resources` — **not** `$Mod.products.list.{1}.resources` (returns null silently).
- ⚠ In X4 9.0, `<create_construction_sequence>` errors on stations with `hasstagedconstruction=true` — guard with `<do_if value="not $Station.hasstagedconstruction">`.
- ⚠ `bare <set_player_target>` for cross-cluster stations errors (`not in player cluster`). For galaxy-wide tracking use Guidance API.

## Examples

### Example 1: Find the player's nearest Argon trade station

```xml
<run_actions ref="md.LIB_Generic.FindNearestStationForFaction"
    result="$nearest">
    <param name="Faction" value="faction.argon"/>
    <param name="Position" value="player.ship.position"/>
    <param name="Sector" value="player.ship.sector"/>
</run_actions>

<do_if value="@$nearest">
    <set_value name="$is_trade" exact="$nearest.istradestation"/>
</do_if>
```

### Example 2: Listen for any station destruction in the galaxy

```xml
<cue name="WatchStationDestruction" instantiate="true">
    <conditions>
        <event_object_destroyed/>
        <check_value value="event.object.isclass.{class.station}"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Station destroyed: ' + event.object.knownname"/>
    </actions>
</cue>
```

### Example 3: Transfer ownership of a station with cleanup

```xml
<run_actions ref="md.LIB_Generic.TransferStationOwnership">
    <param name="Station" value="$capturedStation"/>
    <param name="NewOwner" value="faction.player"/>
</run_actions>
```

## Architectural context

For deeper understanding of station-related subsystems:

- **How stations come into existence:** Architectural overview *Galaxy seeding* (Tier 1) — covers `god.xml`, `FinaliseStations` pipeline, `factionlogic_stations` runtime spawner.
- **How factions decide when to build new stations:** Architectural overview *Faction economy* — `EvaluateSectorShortage` formula and `Request_Factory` action.
- **Station construction rendering:** Architectural overview *Construction sequence* — `<create_construction_sequence>` and `<apply_construction_sequence>`.

## Related

- [Module](./module/) — building block of a station.
- [Shipyard](./shipyard/) — subtype, builds capital ships.
- [Sector](../world/sector/) — container.
- [Faction](../factions/faction/) — owner.
- [Ware](../economy/ware/) — what stations trade and produce.

---

:::tip[Prototype evaluation]
This page demonstrates the proposed schema for every abstraction. Key questions to evaluate:

1. **Depth:** is ~4-5KB the right size? Too long? Too short?
2. **Sections:** are the section names (Properties / Actions / Libraries / Events / Gotchas / Examples / Related) right?
3. **Examples:** enough? Too many? Wrong kind?
4. **Cross-references:** parent (Object types), subtypes (Shipyard, ...), siblings (Ship), contained parts (Module), peer namespaces (Faction, Sector, Ware).
5. **Architectural context section:** does it belong here as a link, or should it be in the page body?
:::

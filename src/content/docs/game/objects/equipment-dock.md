---
title: Equipment dock
description: Station subtype that equips ships with weapons, shields, engines, software — but cannot build ships from scratch.
---

An **Equipment dock** is a [Station](/game/objects/station/) subtype that **installs equipment** (weapons, shields, engines, turrets, software, ammo) on existing ships. It cannot *build* ships — for that you need a [Wharf](/game/objects/wharf/) (S/M) or [Shipyard](/game/objects/shipyard/) (L/XL).

Equipment docks are the "loadout swap" stops modders frequently target: cargo full of crystal-thrusters but no place to install them? Find an equipment dock.

This page documents Equipment-dock-specific behavior. For all general station behavior (creation, ownership, modules, hull, dockingbays, events), see the parent [Station](/game/objects/station/) page.

## Identification

| Flag | Meaning |
|---|---|
| `.isequipmentdock` | Currently an equipment dock (display-state) |
| `.isplannedequipmentdock` | Planned/in-construction to be an equipment dock |
| `.canequipships` | Has at least one ship-equipping module (true for equipment docks, wharfs, AND shipyards) |
| `.canbuildships` | **FALSE for pure equipment docks** (they don't build from scratch) |

For early detection during construction, use `.isplannedequipmentdock` (vanilla `factionlogic_stations.xml:232`).

## Properties (equipment-dock-specific)

All accessors live on the parent `station` datatype (`scriptproperties.xml:848`). There is no separate `equipmentdock` datatype.

| Property | Type | Description |
|---|---|---|
| `.isequipmentdock` | bool | Currently an equipment dock |
| `.isplannedequipmentdock` | bool | Planned to be an equipment dock |
| `.canequipships` | bool | Can install equipment (shared with Wharf/Shipyard) |
| `.canbuildequipment.{ware}` | bool | Can install specific equipment ware |
| `.canbuildequipment.{list}` | bool | Can install all wares in list |
| `.buildequipment.wares` | warelist | Full list of installable equipment |
| `.buildequipment.weapons` / `.shields` / `.engines` / `.turrets` / `.software` / `.thrusters` / `.missiles` / `.drones` / `.countermeasures` / `.satellites` / `.navbeacons` / `.resourceprobes` / `.lasertowers` / `.mines` | warelist | Per-category filtered list |

The per-category `.buildequipment.X` warelists are inherited from container — see vanilla `scriptproperties.xml:1014-1027` for the complete list.

## Differentiating equipment dock from wharf/shipyard

The distinguishing rule: **equipment docks cannot build ships**.

```xml
<!-- Pure equipment dock -->
<do_if value="$Station.isequipmentdock
    and not $Station.canbuildships">
    <!-- equipment-only, cannot build from scratch -->
</do_if>

<!-- Any station that can install equipment -->
<do_if value="$Station.canequipships">
    <!-- works for equipment docks, wharfs, AND shipyards -->
</do_if>
```

Vanilla `diplomacy.xml:2542` uses `.isequipmentdock` as a fallback after `.isshipyard or .iswharf` to catch equipment-only stations.

## Common equipment-dock-relevant patterns

### "Find an equipment dock that can install my crystal-thruster"

```xml
<find_station_by_true_owner name="$Candidates"
    space="player.galaxy"
    multiple="true"
    sortbydistanceto="player.ship"/>

<set_value name="$found" exact="null"/>

<do_for_each name="$station" in="$Candidates">
    <do_if value="$station.canequipships
        and $station.canbuildequipment.{ware.thruster_arg_m_crystal_01_mk1}">
        <set_value name="$found" exact="$station"/>
        <break/>
    </do_if>
</do_for_each>
```

`.canequipships` is used (not `.isequipmentdock`) — wharfs and shipyards also install equipment, no need to exclude them.

### "All wharfs and equipment docks where I can sell mod parts"

```xml
<do_for_each name="$station" in="$Candidates">
    <do_if value="$station.iswharf
        or $station.isshipyard
        or $station.isequipmentdock">
        <!-- candidate for selling equipment / mod parts -->
    </do_if>
</do_for_each>
```

Pattern from `gmc_retrieve_dead_drop.xml:2292-2301`.

### "Did the player build a new equipment dock?"

```xml
<cue name="WatchPlayerEquipDock" instantiate="true">
    <conditions>
        <event_object_construction_sequence_created/>
        <check_value
            value="event.object.isclass.{class.station}
                and event.object.owner == faction.player
                and event.object.isplannedequipmentdock
                and not event.object.isequipmentdock"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player equipment dock construction began: '
                + event.object.knownname"/>
    </actions>
</cue>
```

## Construction macros

Equipment docks are constructed using:

- **Group**: `equipmentdock_<faction_3-letter-code>` (e.g. `equipmentdock_arg`, `equipmentdock_tel`) in `libraries/stationgroups.xml`.
- **Plan**: e.g. `arg_equipmentdock` in `libraries/constructionplans.xml`.

## Common gotchas

- ⚠ **`.isequipmentdock` is FALSE during construction.** Use `.isplannedequipmentdock` for early detection.
- ⚠ **`.canequipships` is TRUE for wharfs and shipyards too.** For equipment-only checks use `.isequipmentdock and not .canbuildships`.
- ⚠ **Equipment docks do NOT build ships.** `.canbuildships` is false. If you need a ship built (not just equipped), check `.isshipyard or .iswharf` instead.
- ⚠ **Hybrid stations are valid.** An equipment dock can also have wharf/shipyard modules added; flags stack (`.iswharf=true and .isequipmentdock=true`). For "pure equipment dock" filter, combine with `not .canbuildships`.
- ⚠ **Per-category `.buildequipment.weapons` only returns equipment THIS station can install.** A station without missile modules has empty `.buildequipment.missiles`. For full "what does this faction install anywhere" use `<find_station>` with `.canbuildequipment.{$ware}`.
- ⚠ **`set_equipment_wares_included`/`_excluded` operates at the build module level, not the station.** If a station has multiple equipment build modules, you may need to target each.
- ⚠ **In X4 9.0, `create_construction_sequence` errors on staged stations.** Same guard as Shipyard / Wharf.

## Architectural context

- **How factions decide where to build equipment docks:** Architectural overview *Faction economy* — equipment docks are placed in well-connected sectors to serve as common loadout-swap hubs.
- **Construction sequence rendering:** Architectural overview *Station construction sequence* — same pipeline as Shipyard.

## Related

- [Station](/game/objects/station/) — parent abstraction (all general properties/actions live there).
- [Shipyard](/game/objects/shipyard/) — sibling subtype, builds **and** equips L/XL.
- [Wharf](/game/objects/wharf/) — sibling subtype, builds **and** equips S/M.
- [Trade station](/game/objects/trade-station/) — sibling subtype, sells equipment as wares (not installs).
- [Faction](/game/factions/faction/) — owner.
- [Ware](/game/economy/ware/) — equipment items as wares.
- [Build module](/game/objects/build-module/) — the contained part that does the actual installation.

---

:::tip[Pattern — IS-A subtype page]
Same pattern as [Shipyard](/game/objects/shipyard/) / [Wharf](/game/objects/wharf/) — this page only documents Equipment-dock-specific behavior. General station behavior lives on [Station](/game/objects/station/).
:::

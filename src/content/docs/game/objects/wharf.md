---
title: Wharf
description: Station subtype that builds small and medium ships (S and M classes).
---

A **Wharf** is a [Station](/game/objects/station/) subtype that builds **S and M class** ships (fighters, corvettes, miners, transports) and equips them. [Shipyards](/game/objects/shipyard/) handle the larger L and XL classes. Most factions have one or more wharfs supplying their fighter fleets.

This page documents Wharf-specific behavior. For all general station behavior (creation, ownership, modules, hull, dockingbays, events, etc.), see the parent [Station](/game/objects/station/) page.

## Identification

| Flag | Meaning |
|---|---|
| `.iswharf` | Currently a wharf (display-state) |
| `.isplannedwharf` | Planned to be a wharf (intent — true from construction-plan time) |
| `.canbuildships` | Has at least one ship-building module (true for wharfs AND shipyards) |
| `.canequipships` | Has at least one ship-equipping module (true for wharfs, shipyards, AND equipment docks) |

For early detection during construction, use `.isplannedwharf` (vanilla `factionlogic_stations.xml:223`).

For "build any ship", the canonical filter is `.isshipyard or .iswharf` — both can produce ships (vanilla `diplomacy.xml:2514`).

## Properties (wharf-specific)

All wharf accessors live on the parent `station` datatype (`scriptproperties.xml:848`). There is no separate `wharf` datatype.

| Property | Type | Description |
|---|---|---|
| `.iswharf` | bool | Currently a wharf |
| `.isplannedwharf` | bool | Planned/in-construction to be a wharf |
| `.canbuildships` | bool | Shared with Shipyard (any ship-building module qualifies) |
| `.canbuildclass.{class}` | bool | Test specific class — wharfs answer true for `class.ship_s`, `.ship_m` |
| `.canbuildmacro.{macro}` | bool | Test specific ship macro |
| `.buildships.wares` | warelist | All ship macros this wharf can build |

## Differentiating wharf from shipyard

A wharf typically has `.canbuildclass.{class.ship_s}` and `.ship_m` true; `.ship_l` and `.ship_xl` false. The reverse for a shipyard.

```xml
<!-- Pure wharf (S/M only) -->
<do_if value="$Station.iswharf
    and not $Station.canbuildclass.{class.ship_l}">
    <!-- ... -->
</do_if>

<!-- Hybrid station (S+M+L+XL build modules all installed) -->
<do_if value="$Station.iswharf and $Station.isshipyard">
    <!-- ... -->
</do_if>
```

Vanilla `diplomacy.xml:2531-2532` accommodates hybrid stations explicitly.

## Common wharf-relevant patterns

### "Find a wharf that can build my fighter"

```xml
<find_station_by_true_owner name="$Wharfs"
    space="player.galaxy"
    multiple="true"
    sortbydistanceto="player.ship"/>

<set_value name="$found" exact="null"/>

<do_for_each name="$station" in="$Wharfs">
    <do_if value="$station.iswharf
        and $station.canbuildmacro.{$FighterMacro}">
        <set_value name="$found" exact="$station"/>
        <break/>
    </do_if>
</do_for_each>
```

### "Is this where I should drop off rescued marines?"

```xml
<do_if value="$Station.iswharf or $Station.isshipyard">
    <!-- both have crew docks and equipment storage -->
</do_if>
```

Pattern from `diplomacy.xml:2514`.

### "Did the player build a new wharf?"

```xml
<cue name="WatchPlayerWharf" instantiate="true">
    <conditions>
        <event_object_construction_sequence_created/>
        <check_value
            value="event.object.isclass.{class.station}
                and event.object.owner == faction.player
                and event.object.isplannedwharf
                and not event.object.iswharf"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player wharf construction began: '
                + event.object.knownname"/>
    </actions>
</cue>
```

## Construction macros

Wharfs are constructed using:

- **Group**: `wharf_<faction_3-letter-code>` (e.g. `wharf_arg`, `wharf_tel`, `wharf_par`) in `libraries/stationgroups.xml`.
- **Plan**: e.g. `arg_wharf`, `tel_wharf` in `libraries/constructionplans.xml`.

When modding a new faction's wharf, you add:
1. A `<stationgroup>` entry referencing fighter / transport build modules from `libraries/modules.xml`.
2. A `<constructionplan>` entry that builds those modules in sequence.
3. Optional `<god>` seed entry.

## Common gotchas

- ⚠ **`.iswharf` is FALSE during construction.** Until the construction sequence completes the station is not yet a wharf at the display level. Use `.isplannedwharf` if you need to detect it early.
- ⚠ **`.canbuildships` is TRUE for shipyards too.** Means "has any ship-building module" — for wharf-only checks use `.iswharf` or `.canbuildclass.{class.ship_s}` with negative shipyard check.
- ⚠ **Hybrid stations (wharf + shipyard) are valid.** Both `.iswharf` and `.isshipyard` can be TRUE on the same station. Don't write code assuming they're mutually exclusive.
- ⚠ **Wharfs typically can't build capital ships even if you `set_ship_wares_included`.** The build module installed has hard size-class limits — `set_ship_wares_*` only filters within what the module supports. To build XL, install a shipyard build module.
- ⚠ **In X4 9.0, `create_construction_sequence` errors on staged stations.** Same as Shipyard — guard with `not $Station.hasstagedconstruction`.
- ⚠ **Don't filter "buy ship" missions on `.iswharf` alone.** Vanilla uses `.iswharf or .isshipyard` — missing one path will skip half the player's options.

## Architectural context

- **How factions decide where to build wharfs:** Architectural overview *Faction economy* — wharfs are placed near contested sectors where the faction expects to lose fighter waves.
- **Construction sequence rendering:** Architectural overview *Station construction sequence* — same pipeline as Shipyard.
- **Fleet reconstitution:** Architectural overview *Fleet reconstitution* — wharfs supply S/M replacements; shipyards supply L/XL.

## Related

- [Station](/game/objects/station/) — parent abstraction (all general properties/actions live there).
- [Shipyard](/game/objects/shipyard/) — sibling subtype, builds L/XL ships.
- [Equipment dock](/game/objects/equipment-dock/) — sibling subtype, only equips (cannot build from scratch).
- [Faction](/game/factions/faction/) — owner.
- [Ware](/game/economy/ware/) — `ship_*` ship wares.
- [Macro](/lang/data/macro/) — ship macro recipes.
- [Build module](/game/objects/build-module/) — the contained part that does the actual construction.

---

:::tip[Pattern — IS-A subtype page]
Same pattern as [Shipyard](/game/objects/shipyard/) — this page only documents Wharf-specific behavior. General station behavior lives on the parent [Station](/game/objects/station/) page.
:::

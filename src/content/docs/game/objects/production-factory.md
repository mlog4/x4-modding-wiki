---
title: Production factory
description: The most common station type — produces wares for the faction economy. Almost every NPC-owned non-special station is one.
---

A **Production factory** is the most common station type in the X4 universe — wheat farms, energy cells plants, hull parts factories, microchip refineries. Every NPC faction's economy is built on hundreds of them. They consume input wares from suppliers, run [Production modules](/game/objects/production-module/) to make output wares, and offer those outputs via trade subscriptions.

Unlike [Shipyard](/game/objects/shipyard/), [Wharf](/game/objects/wharf/), [Equipment dock](/game/objects/equipment-dock/), and [Trade station](/game/objects/trade-station/), the "production factory" status is **not a single flag** — it's defined by exclusion: a station that is not any of the special subtypes, and that has at least one production module.

This page documents production-factory-specific behavior. For all general station behavior (creation, ownership, hull, dockingbays, events), see the parent [Station](/game/objects/station/) page.

## Identification — by exclusion

There is no `.isproductionfactory` flag. Vanilla and mods identify production factories by *what they are not*:

```xml
<do_if value="not $Station.istradestation
    and not $Station.isshipyard
    and not $Station.iswharf
    and not $Station.isequipmentdock
    and not $Station.isdefencestation
    and not $Station.isfactionheadquarters
    and $Station.resources.count gt 0">
    <!-- normal production factory -->
</do_if>
```

The `$Station.resources.count gt 0` check is essential — a station with zero consumable resources is a pure storage / pier station, not a production factory.

This composite filter is the canonical idiom used by mods like Buy and Sell Stations and recurring NPC economy logic. Copy it rather than reinventing — new DLC may add station-type flags, and `not .istradestation and not .isshipyard ...` will continue to work.

## Properties — production-factory-relevant

All properties live on the parent `station` and `container` datatypes. The most-used:

| Property | Type | Description |
|---|---|---|
| `.products` | warelist | Wares this station produces (aggregated across all production modules) |
| `.resources` | warelist | Wares this station consumes |
| `.resources.pure` | warelist | Resource wares that are NOT intermediate |
| `.resources.intermediate` | warelist | Resource wares produced by upstream modules on this station |
| `.resources.primary` | warelist | Always-required inputs |
| `.resources.secondary` | warelist | Race-specific / optional inputs |
| `.cargo` | containercargolist | Wares currently in storage |
| `.cargo.{ware}.target` | int | Target stock level for a ware |
| `.workforce.amount` | int | Current workforce |
| `.workforce.optimal` | int | Workforce needed for peak production |
| `.workforce.bonus` | float | Multiplier applied to production speed |
| `.buyprices` / `.sellprices` | table | Per-ware prices for trade |
| `.istraderestricted` | bool | Trades only with owner faction (global setting) |
| `.istraderestricted.{ware}` | bool | Trade restricted for this specific ware |

## Common production-factory patterns

### "What does this station produce?"

```xml
<do_for_each name="$product" in="$Station.products.list">
    <write_to_logbook
        text="$Station.knownname + ' produces '
            + $product.name + ' at '
            + $Station.sellprice.{$product} + 'Cr'"/>
</do_for_each>
```

### "What does this station need?"

```xml
<do_for_each name="$res" in="$Station.resources.list">
    <write_to_logbook
        text="$Station.knownname + ' needs '
            + $res.name + ' (buy price: '
            + $Station.buyprice.{$res} + 'Cr)'"/>
</do_for_each>
```

### "Is this station starved of inputs?"

```xml
<set_value name="$starved" exact="false"/>

<do_for_each name="$module" in="$Station.modules">
    <do_if value="$module.isclass.{class.production}
        and $module.iswaitingforresources">
        <set_value name="$starved" exact="true"/>
        <break/>
    </do_if>
</do_for_each>
```

For deeper module-level analysis see [Production module](/game/objects/production-module/).

### "Find production factories that need this ware"

```xml
<find_station_by_true_owner name="$All"
    space="player.galaxy"
    multiple="true"/>

<create_list name="$Buyers"/>

<do_for_each name="$station" in="$All">
    <do_if value="not $station.istradestation
        and not $station.isshipyard
        and not $station.iswharf
        and not $station.isequipmentdock
        and not $station.isdefencestation
        and not $station.isfactionheadquarters
        and $station.resources.indexof.{$ware} gt 0">
        <append_to_list name="$Buyers" exact="$station"/>
    </do_if>
</do_for_each>

<write_to_logbook
    text="$Buyers.count + ' factories buy ' + $ware.name"/>
```

### "Player just bought a production factory"

```xml
<cue name="OnPlayerBoughtFactory" instantiate="true">
    <conditions>
        <event_object_changed_owner/>
        <check_value
            value="event.object.isclass.{class.station}
                and event.param == faction.player
                and not event.object.istradestation
                and not event.object.isshipyard
                and not event.object.iswharf
                and not event.object.isequipmentdock
                and not event.object.isdefencestation
                and not event.object.isfactionheadquarters
                and event.object.resources.count gt 0"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player bought production factory: '
                + event.object.knownname"/>
    </actions>
</cue>
```

## Workforce and production rates

A production factory's output rate depends on:

1. **Loadout level** — set at construction via `set_module_loadout_level`.
2. **Workforce bonus** — `.workforce.bonus` multiplier (0..1+) from filled habitation modules.
3. **Input availability** — modules pause when starved (`iswaitingforresources=true`).

To estimate output per hour: see Architectural overview *Production cycle math* (planned).

```xml
<set_value name="$WorkforceMultiplier"
    exact="if @$Station.workforce.bonus then $Station.workforce.bonus else 1.0f"/>

<write_to_logbook
    text="$Station.knownname + ' workforce bonus: ' + $WorkforceMultiplier"/>
```

## Construction macros

Production factories are heterogeneous — one per ware they produce. Naming convention:

- **Group**: `factory_<faction>_<ware>` (e.g. `factory_arg_energycells`).
- **Plan**: e.g. `arg_factory_energycells` in `libraries/constructionplans.xml`.

Each plan typically combines: 1+ production module(s), 1+ storage modules of matching transport types, habitation modules for workforce, optionally defence modules.

## Common gotchas

- ⚠ **No `.isproductionfactory` flag.** Use the exclusion filter above. New DLC may add station-type flags; the exclusion idiom stays correct.
- ⚠ **`.resources.count` is critical in the filter.** Without it, pure storage / pier / venture stations slip through and look like production factories. They have no `.resources` (nothing to consume).
- ⚠ **Iterate `.products.list` / `.resources.list` inline.** `wareamountlist` degrades when stored in a variable — see [Ware](/game/economy/ware/) gotchas.
- ⚠ **`.products` aggregates ALL production modules.** A two-module station producing hull parts + advanced electronics shows BOTH wares in `.products.list`. To trace which module produces what, iterate modules with `.isclass.{class.production}`.
- ⚠ **`.workforce.bonus` may be null on player stations without workforce setup.** Default to `1.0f` when reading.
- ⚠ **Recycling stations look like production factories but use processing modules instead of production modules.** Vanilla flags them with `.isrecyclingfacility`. Add `not .isrecyclingfacility` to the exclusion filter if your logic shouldn't touch them.

## Architectural context

- **How NPC factions place new factories:** Architectural overview *Faction economy* — `Econ_Manager` per-sector evaluates ware shortages → picks ware → builds factory.
- **Production rate math:** Architectural overview *Production cycle math* — cycle duration × workforce bonus × loadout × input availability.
- **Trade route formation:** Architectural overview *Trade routing* — factories register buy/sell offers; trade subscription propagates them to trade stations.

## Related

- [Station](/game/objects/station/) — parent abstraction.
- [Production module](/game/objects/production-module/) — the contained part that does the actual work.
- [Storage module](/game/objects/storage-module/) — provides cargo capacity.
- [Habitation module](/game/objects/habitation-module/) — provides workforce.
- [Trade station](/game/objects/trade-station/) — sibling subtype that aggregates the offers.
- [Ware](/game/economy/ware/) — what factories produce and consume.
- [Faction](/game/factions/faction/) — owner; faction economy logic drives factory placement.

---

:::tip[Pattern — exclusion-defined subtype]
Production factory is the only Station subtype defined by *what it is not* rather than a single flag. The vanilla idiom stays correct across DLC additions — copy it as-is.
:::

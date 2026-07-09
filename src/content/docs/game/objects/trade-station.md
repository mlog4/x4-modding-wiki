---
title: Trade station
description: Station subtype that aggregates buy/sell offers from many factions — a cross-faction marketplace, not a producer.
---

A **Trade station** is a [Station](/game/objects/station/) subtype that acts as a **cross-faction marketplace**. Unlike a [Production factory](/game/objects/production-factory/), a trade station does not *produce* wares — it lists buy and sell offers from other stations the player has trade-licence access to. Players use trade stations as central trading hubs; modders rely on them as "find any trade for X" lookup points.

This page documents Trade-station-specific behavior. For all general station behavior (creation, ownership, modules, hull, dockingbays, events), see the parent [Station](/game/objects/station/) page.

## Identification

| Flag | Meaning |
|---|---|
| `.istradestation` | This station is a trade station |
| (no `.isplannedtradestation`) | Vanilla treats trade station as a deferred flag — set on completion. To detect during construction, fall back to `.macro` macro-name check |

Vanilla note: a station with `.istradestation=true` is mutually exclusive with shipyard / wharf / equipment-dock / defence-station roles in vanilla content. Filter logic frequently uses `not .istradestation` as "this is a production station" (vanilla `gmc_retrieve_dead_drop.xml:2310`).

## Properties (trade-station-relevant)

All accessors live on the parent `station` datatype (`scriptproperties.xml:848`). There is no separate `tradestation` datatype.

| Property | Type | Description |
|---|---|---|
| `.istradestation` | bool | Currently a trade station |
| `.products` | warelist | What this station accepts as products (typically empty for trade station — they don't produce) |
| `.tradewares` | warelist | Wares that are traded here (bought and resold; neither product nor resource) |
| `.buyprices` | table | Per-ware buy prices (table form) |
| `.sellprices` | table | Per-ware sell prices |
| `.hastradesubscription` | bool | Player has trade-offer subscription (sees all offers at this station) |
| `.haspermanenttradesubscription` | bool | Permanent subscription owned (vs trial / temporary) |

## Differentiating trade station from production / equipment

```xml
<!-- Pure trade station -->
<do_if value="$Station.istradestation
    and not $Station.isshipyard
    and not $Station.iswharf">
    <!-- marketplace, no production / no shipbuilding -->
</do_if>

<!-- Production station (NOT a trade station) -->
<do_if value="not $Station.istradestation
    and not $Station.isshipyard
    and not $Station.iswharf
    and not $Station.isequipmentdock
    and not $Station.isdefencestation
    and not $Station.isfactionheadquarters
    and $Station.resources.count gt 0">
    <!-- regular production factory — has consumable resources -->
</do_if>
```

The second pattern is the canonical "is this a normal production station" filter used by mods that target the player's economic backbone. Vanilla `gmc_retrieve_dead_drop.xml:2310` uses the inverted check.

## Common trade-station patterns

### "Find the nearest trade station that sells this ware"

```xml
<find_station_by_true_owner name="$Candidates"
    space="player.galaxy"
    multiple="true"
    sortbydistanceto="player.ship"/>

<set_value name="$found" exact="null"/>

<do_for_each name="$station" in="$Candidates">
    <do_if value="$station.istradestation
        and $station.sellprice.{$ware} gt 0
        and $station.cargo.{$ware}.amount gt 0">
        <set_value name="$found" exact="$station"/>
        <break/>
    </do_if>
</do_for_each>
```

### "Subscribe the player to trade offers at a station"

Use the vanilla [Subscription](/game/economy/subscription/) action — trade subscription gating is separate from station type. The trade station flag only controls *which* offers are visible at the station, not the subscription action itself.

### "Did the player buy a trade station?"

A trade station doesn't have a dedicated construction event. Watch the station's `.istradestation` transition via NPC instantiation or save-load events. The simplest practical pattern is to listen for `event_object_changed_owner` and then check `.istradestation` on the new player-owned station.

## Construction macros

Trade stations are constructed using:

- **Group**: `tradestation_<faction_3-letter-code>` (e.g. `tradestation_arg`) in `libraries/stationgroups.xml`.
- **Plan**: e.g. `arg_tradestation` in `libraries/constructionplans.xml`.

Trade stations typically contain a **trade module** and many **storage modules** but no production modules. Modding a new trade station means picking modules accordingly.

## Common gotchas

- ⚠ **Trade stations don't produce.** `.products` is typically empty (or only contains pass-through tradewares). Don't expect a recipe-aware iteration to find anything.
- ⚠ **`.tradewares` vs `.products`.** Tradewares are the "buy from one station, sell to another" wares the trade station handles; `.products` is for actually-produced wares. Most modder logic wants `.tradewares`.
- ⚠ **`.istradestation` is mutually exclusive with shipyard / wharf / equipment-dock in vanilla.** But there's no engine enforcement — modded content could violate this. Don't rely on the exclusion for correctness.
- ⚠ **Trade stations don't appear in `find_station` results without `space=`.** Same as all stations — `space=` is required.
- ⚠ **Trade offers visible at a trade station depend on player licences.** `.hastradesubscription` controls visibility, not whether offers exist. Two players with different licences see different offers at the same trade station.
- ⚠ **The "normal production station" filter is `not .istradestation and not .isshipyard and not .iswharf ...`.** Vanilla maintains this idiom — copy it rather than reinventing, since new station-type flags may be added in DLC.

## Architectural context

- **How factions decide where to build trade stations:** Architectural overview *Faction economy* — trade stations are placed at high-connectivity sectors (lots of gates) and high-economy clusters.
- **Trade offer lifecycle:** Architectural overview *Trade offer lifecycle* — buy/sell offer creation at producing stations, propagation to trade stations via subscriptions.
- **Subscription mechanics:** Architectural overview *Subscriptions* — how `.hastradesubscription` is set, trial vs permanent, satellite-based vs purchased.

## Related

- [Station](/game/objects/station/) — parent abstraction (all general properties/actions live there).
- [Shipyard](/game/objects/shipyard/) — sibling subtype, builds L/XL ships.
- [Wharf](/game/objects/wharf/) — sibling subtype, builds S/M ships.
- [Equipment dock](/game/objects/equipment-dock/) — sibling subtype, installs equipment.
- [Production factory](/game/objects/production-factory/) — sibling subtype, actually produces wares.
- [Faction](/game/factions/faction/) — owner; relations gate visible trade offers.
- [Ware](/game/economy/ware/) — what is traded.
- [Trade offer](/game/economy/trade-offer/) — the offers visible at a trade station.
- [Subscription](/game/economy/subscription/) — how players unlock visibility.

---

:::tip[Pattern — IS-A subtype page]
Same pattern as [Shipyard](/game/objects/shipyard/) / [Wharf](/game/objects/wharf/) / [Equipment dock](/game/objects/equipment-dock/) — this page only documents Trade-station-specific behavior. General station behavior lives on [Station](/game/objects/station/).
:::

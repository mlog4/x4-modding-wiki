---
title: Pirate base
description: Station subtype owned by pirate factions (Scavenger / Riptide). Black-market dealings, illegal-ware trade, story content.
---

A **Pirate base** is a [Station](/game/objects/station/) subtype owned by pirate factions — vanilla has [Scavenger](/game/factions/scavenger/) ("Riptide" in the UI; `class.argon` primary race) and **Fallen Families** (`class.fallensplit`). Pirate bases are the black-market entry points: they sell illegal wares, accept stolen cargo, and host illegal-mod NPCs (Boso Ta types, item traders).

This page documents Pirate-base-specific behavior. For all general station behavior (creation, ownership, hull, dockingbays, events), see the parent [Station](/game/objects/station/) page.

## Identification

| Flag | Meaning |
|---|---|
| `.ispiratebase` | This station is a pirate base |

The flag is set per-macro at construction — `pirate_*` macros from `libraries/stationgroups.xml` carry it.

**Riptide vs Fallen Families** (common confusion):

| Faction | Internal name | Primary race | DLC |
|---|---|---|---|
| Riptide (UI name) | `faction.scavenger` | Argon | Pirate DLC |
| Fallen Families | `faction.fallensplit` | Split | Split Vendetta DLC |

Vanilla MD scripts use `faction.scavenger` for Riptide checks. Don't write `faction.fallensplit` expecting Riptide content.

## Properties (pirate-base-relevant)

All accessors live on the parent `station` datatype (`scriptproperties.xml:848`). There is no separate `piratebase` datatype.

| Property | Type | Description |
|---|---|---|
| `.ispiratebase` | bool | Currently a pirate base |
| `.shadyguy` | entity | Black-market dealer NPC (specific to pirate bases and player HQ) |
| `.tradenpc` | entity | Regular trade NPC (may stock illegal wares here) |

Pirate bases inherit all station properties. They're typically also equipment docks or trade stations under the hood — combine flag checks if you need more specificity.

## Common pirate-base-relevant patterns

### "Find a pirate base in this sector"

```xml
<find_station_by_true_owner name="$Stations"
    space="$Sector"
    multiple="true"/>

<set_value name="$Pirate" exact="null"/>

<do_for_each name="$station" in="$Stations">
    <do_if value="$station.ispiratebase">
        <set_value name="$Pirate" exact="$station"/>
        <break/>
    </do_if>
</do_for_each>
```

### "Trigger combat-flavoured offer at this pirate base"

```xml
<set_value name="$Chance_Fight"
    exact="$Chance_High"
    chance="100 * $OfferObject.ispiratebase"/>
```

Pattern from vanilla `genericmissions.xml:314` — pirate bases bias mission offers toward fight tasks.

### "Sell stolen wares here"

```xml
<do_if value="$DropOff.ispiratebase">
    <!-- pirate base accepts illegal wares this faction marks legal -->
    <!-- (illegality is per-faction, not absolute) -->
</do_if>
```

Pattern from `gmc_retrieve_dead_drop.xml:2295`.

### "Player just captured a pirate base"

```xml
<cue name="WatchPiratePirate" instantiate="true">
    <conditions>
        <event_object_changed_owner/>
        <check_value
            value="event.object.ispiratebase
                and event.param == faction.player"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player captured pirate base: '
                + event.object.knownname"/>
    </actions>
</cue>
```

## Pirate-relevant NPC: shadyguy

The `.shadyguy` accessor returns the black-market dealer NPC. Vanilla `npc_itemtrader.xml:41` checks `$actor.container.ispiratebase` to route which NPC dialogue tree to load. The shadyguy:

- Sells illegal-to-other-factions wares.
- Offers buy orders for stolen cargo.
- Hosts mod-part trades in some DLC.

To add a custom illegal ware to a pirate base's inventory:

```xml
<add_inventory
    ware="$myIllegalWare"
    exact="50"
    entity="$PirateBase.shadyguy"/>
```

The player gets access through dialogue when docked.

## Common gotchas

- ⚠ **Riptide ≠ Fallen Families.** `faction.scavenger` (Riptide, Argon primary race) and `faction.fallensplit` (Fallen Families, Split primary race) are different factions with separate stations. Don't confuse them — Riptide is from Pirate DLC, Fallen Families from Split Vendetta.
- ⚠ **`.ispiratebase` doesn't imply illegal-ware stock.** It's a station-type flag, not a content guarantee. Check `.shadyguy.inventory` for actual illegal-ware availability.
- ⚠ **Pirate bases can be `.istradestation` simultaneously.** Some pirate bases double as trade stations for their faction. Combine flags as needed.
- ⚠ **Pirate base macros may be DLC-gated.** Referencing `macro.pirate_*` macros directly in scripts fails on Base installs. Wrap DLC content with availability checks.
- ⚠ **Illegality is per-faction, not absolute.** A ware illegal to Argon may be legal to Scavenger — that's why pirate bases can list it. Check `$ware.illegalto.{$faction}` for the actual rule.
- ⚠ **`.ispiratebase` is FALSE for ordinary Scavenger / Fallen Families stations.** Not all stations of a "pirate" faction are pirate bases. The flag is set only on the specific pirate-base macro line.

## Architectural context

- **How pirate factions place new bases:** Architectural overview *Faction economy* — pirate bases are placed in poorly-policed sectors, near smuggling routes.
- **Illegal ware trading:** Architectural overview *Ware legality system* — `illegalto.{faction}.{faction}` matrix, licence-driven exceptions, faction-relative legality.
- **Buccaneer story arc:** Architectural overview *Buccaneers story* — `story_buccaneers.xml` revolves around `event.param.parent.ispiratebase` filtering.

## Related

- [Station](/game/objects/station/) — parent abstraction.
- [Faction](/game/factions/faction/) — `faction.scavenger`, `faction.fallensplit`.
- [Trade station](/game/objects/trade-station/) — sibling; some pirate bases double as trade stations.
- [Equipment dock](/game/objects/equipment-dock/) — sibling; some pirate bases install equipment.
- [NPC](/game/characters/npc/) — `.shadyguy` is the black-market dealer.
- [Ware](/game/economy/ware/) — illegal wares are the pirate-base specialty.

---

:::tip[Pattern — IS-A subtype]
Same pattern as [Shipyard](/game/objects/shipyard/) / [Wharf](/game/objects/wharf/) / [Equipment dock](/game/objects/equipment-dock/) — this page only documents Pirate-base-specific behavior. General station behavior lives on [Station](/game/objects/station/).
:::

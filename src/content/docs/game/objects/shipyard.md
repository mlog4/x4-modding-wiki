---
title: Shipyard
description: Station subtype that builds capital ships.
---

A **Shipyard** is a [Station](./station/) subtype that produces capital ships (XL and L class). Each major faction has one or more shipyards as economic anchors.

This page documents Shipyard-specific behavior. For general station behavior (properties, ownership, modules, etc.), see the parent [Station](./station/) page.

## Identification

```xml
<do_if value="$station.isplannedshipyard">
    <!-- this station is a shipyard -->
</do_if>
```

| Property | Type | Description |
|---|---|---|
| `.isplannedshipyard` | bool | This station is/was a shipyard |
| `.wasshipyard` | bool | Sticky flag — was ever a shipyard (V-003 history) |

## Vanilla shipyards (initial galaxy)

Each faction has a fixed shipyard at game start. The list below comes from `libraries/god.xml`:

| Faction | Shipyard sector |
|---|---|
| Argon | Argon Prime |
| Paranid | Trinity Sanctum |
| Teladi | Profit Center Alpha |
| Split | Family Tkr |
| Terran | Mars |
| Boron | Kingdom End |
| Xenon | Various Xenon sectors |

:::caution[Verification pending]
The exact `god.xml` entry IDs for each faction's shipyard need to be sample-grep verified against vanilla source before this table is published as final.
:::

## Construction

Shipyards are constructed using:

- **Group**: `shipyard_<faction_3-letter-code>` (e.g., `shipyard_arg`) in [stationgroups.xml](../data/stationgroups-xml/).
- **Plan**: e.g., `arg_shipyard` in [constructionplans.xml](../data/constructionplans-xml/).

For the full construction pipeline see the parent [Station](./station/) page (Actions → Create section).

## Common gotchas

- ⚠ Don't confuse `.isplannedshipyard` with `.isfactionheadquarters`. A shipyard is often (but not always) also a faction HQ.

## Related

- [Station](./station/) — parent abstraction (all general properties/actions live there).
- [Wharf](./wharf/) — sibling subtype, builds smaller (M/S) ships.
- [Faction](../factions/faction/) — owner.
- [Macro](../data/macro/) — for ship recipes.

---

:::tip[Pattern]
This page demonstrates how a **subtype** page is structured — only the type-specific information. General Station behavior is not repeated; it lives on the parent [Station](./station/) page.
:::

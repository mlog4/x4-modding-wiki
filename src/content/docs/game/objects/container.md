---
title: Container
description: Engine class for cargo + build + trade infrastructure. Parent of station classes. Has ~110 properties spanning docking, construction, products/resources, prices, and mass traffic.
---

A **Container** is the X4 engine abstract class for entities that **hold cargo, build other entities, and trade**. Almost every station in the game is a container — it inherits container's massive property set for managing cargo, build infrastructure, products/resources, and prices.

**Inheritance:** `object → controllable → defensible → container`. Subclasses include all station types and some special ship variants.

## Properties

The container class has **~110 properties**. Below is the most-used subset grouped by purpose.

### Mass traffic + docking

| Property | Type | Description |
|---|---|---|
| `.hasmasstraffic` | boolean | Container is in the zone's mass-traffic network |
| `.istrafficlevel.<level>` | boolean | Container at traffic level (`normal`/`heavy`/`gridlock`) |
| `.dockingenabled` | boolean | Is docking at the container enabled? |
| `.dockingallowed.{$ship}` | boolean | Can $ship dock at container (faction/relation check)? |

### Drones (deployed)

| Property | Type | Description |
|---|---|---|
| `.hasunitdrone.{$ship}` | boolean | Container has $ship as drone unit |

### Build infrastructure (a large subsystem)

The build property group manages station construction + ship manufacturing.

| Property | Type | Description |
|---|---|---|
| `.buildingmodule` | buildmodule | Build module constructing this container |
| `.buildingprocessor` | buildprocessor | Build processor doing the work |
| `.build` | build | Build task constructing this object |
| `.builds.queued` | list | Queued build tasks |
| `.builds.inprogress` | list | Build tasks in progress |
| `.builds.todelete` | list | Build tasks queued for deletion |
| `.buildanchor` | component | Build anchor (reference point) |
| `.canabortbuild.{$build}` | boolean | Can $build currently be aborted? |
| `.hasplannedconstruction` | boolean | Are there plans to expand this container? |
| `.plannedconstruction.sequence` | constructionsequence | Planned construction sequence |
| `.plannedconstruction.boundingbox.*` | vector / boolean | Planned construction's bounding box |

### Build equipment (what container can build)

| Property | Type | Description |
|---|---|---|
| `.buildequipment.wares` | warelist | All equipment wares container can build (default + included - excluded) |
| `.buildequipment.absolute` | warelist | Absolute equipment list (overrides default) |
| `.buildequipment.excluded` | warelist | Equipment excluded from default |
| `.buildequipment.included` | warelist | Equipment included beyond default |
| `.buildequipment.<type>` | warelist | Equipment of specific type |
| `.buildships.wares` | warelist | All ship wares container can build |
| `.buildships.absolute` | warelist | Absolute ship list |
| `.buildships.excluded` | warelist | Ships excluded from default |
| `.buildships.included` | warelist | Ships included beyond default |
| `.canbuildclass.{$class}` | boolean | Has build module for class? |
| `.canequipclass.{$class}` | boolean | Has build module for equipping class? |
| `.cansupplyclass.{$class}` | boolean | Has build module for supplying class? |
| `.canbuildequipment.{$ware}` | boolean | Can build specified equipment? |
| `.canbuildmacro.{$macro}` | boolean | Can build specified macro? |
| `.canbuildships` | boolean | Can build ships (= isshipyard or iswharf) |
| `.canequipships` | boolean | Can equip ships (= isequipmentdock) |
| `.cansupplyships` | boolean | Can supply ships (= issupplyship) |

### Build resources

| Property | Type | Description |
|---|---|---|
| `.buildresources.{$build}` | wareamountlist | Total resources for $build (or remaining if in-progress) |
| `.buildresources.{$ship}` | wareamountlist | Total resources for $ship |
| `.neededbuildresources.{$build}` | wareamountlist | Missing resources for $build |
| `.neededbuildresources.{$ship}` | wareamountlist | Missing resources for $ship |
| `.missingloadoutequipment.{$loadout}.{$faction}` | warelist | Loadout equipment $faction prevents this container from constructing |

### Cargo + products + resources

| Property | Type | Description |
|---|---|---|
| `.cargo` | containercargolist | Current cargo |
| `.cargo.{$ware}.target` | integer | Target amount for traded commodity |
| `.products` | warelist | All produced wares |
| `.products.{$ware}.intermediate` | boolean | $ware is intermediate |
| `.originalproduct` | ware | Container's original product |
| `.resources` | warelist | All consumed/produced resource wares |
| `.resources.pure` | warelist | Non-intermediate resources |
| `.resources.intermediate` | warelist | Intermediate resources |
| `.resources.primary` | warelist | Primary resources |
| `.resources.secondary` | warelist | Secondary resources |
| `.resources.{$ware}.primary` / `.secondary` / `.intermediate` | boolean | Resource categorization |
| `.supplyresources` | warelist | Resources for supplying units + ammo (NOT production) |
| `.tradewares` | warelist | Bought/sold wares (neither product nor resource) |
| `.research` | warelist | Research wares currently being worked on |

### Prices

| Property | Type | Description |
|---|---|---|
| `.buyprices` | table | Current buy prices for all relevant wares |
| `.sellprices` | table | Current sell prices for all relevant wares |
| `.buildbuyprices` | table | Buy prices accounting for build price factor |

## Common access patterns

### "Get cargo of a container"

```xml
<set_value name="$cargolist" exact="$station.cargo.list"/>
<do_for_each name="$ware" in="$cargolist">
    <write_to_logbook text="$ware.{1}.name + ': ' + $ware.{2}"/>
</do_for_each>
```

### "Check if station can build a ship"

```xml
<do_if value="$shipyard.canbuildmacro.{macro.ship_arg_l_destroyer_02_a_macro}">
    <create_ship macro="macro.ship_arg_l_destroyer_02_a_macro" ... />
</do_if>
```

### "Get unmet resources for a build"

```xml
<do_for_each name="$want" in="$shipyard.neededbuildresources.{$build}">
    <write_to_logbook text="$want.{1}.name + ' needs ' + $want.{2}"/>
</do_for_each>
```

### "Check station's current price for a ware"

```xml
<set_value name="$price" exact="$station.buyprices.{ware.advancedcomposites}"/>
```

## Common gotchas

- ⚠ **`.cargo` and `.cargo.list` look the same but are different types** — `.cargo` is `containercargolist`, `.cargo.list` returns the list-of-tuples. Use `.cargo.list` for iteration.
- ⚠ **`.buildequipment.wares` is the COMPUTED set** (default + included - excluded). Don't try to back-compute it; use specific category property if you need transparency.
- ⚠ **`.products` includes intermediates** unless you filter via `.products.{$ware}.intermediate`. Check before trading.
- ⚠ **Build prices differ from buy prices** — use `.buildbuyprices` when calculating construction costs, not `.buyprices`.
- ⚠ **`.canbuildships` is a shortcut** for "isshipyard OR iswharf". Don't double-check both.
- ⚠ **`.cargo.{$ware}.target` is the target, not the current** — current amount is in `.cargo.list`.

## Inheritance hierarchy

```
object
  └── controllable
       └── defensible
            └── container                ← this class
                 ├── station (most stations)
                 ├── headquarters (player HQ — a special container)
                 ├── tradestation (trade station variant)
                 └── various station subtypes
```

## Common actions

| Action | Purpose |
|---|---|
| `<add_inventory>` | Add a ware to container cargo |
| `<remove_inventory>` | Remove a ware from cargo |
| `<set_equipment_wares_absolute>` | Set absolute equipment-build list |
| `<set_equipment_wares_excluded>` | Add to excluded list |
| `<set_equipment_wares_included>` | Add to included list |
| `<set_ship_wares_absolute>` | Set absolute ship-build list |
| `<add_build_to_expand_station>` | Add a build to expand the station |
| `<set_cargo_target>` | Set target for cargo trade |

## Related

- [Defensible](/game/objects/defensible/) — parent class (shields/surfaces)
- [Cargo](/game/economy/cargo/) — cargo system detail
- [Ware](/game/economy/ware/) — what cargo holds
- [Trade offer](/game/economy/trade-offer/) — sell-side mechanism
- [Station](/game/objects/station/) — primary container subclass
- [Build module](/game/objects/build-module/) — what builds containers
- [Construction sequence](/lang/data/constructionplans-xml/) — what's built

---

*Container is the largest property class in the X4 engine. Stations are containers, build infrastructure is on containers, prices live on containers. When in doubt about a station's behavior, container's property list is the first stop.*

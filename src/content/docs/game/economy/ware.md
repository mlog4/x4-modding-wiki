---
title: Ware
description: A tradable, produceable, or carryable thing — the unit of cargo, inventory, production, and trade in X4.
---

A **Ware** is a tradable / produceable / carryable thing — the unit of cargo, inventory, production, and trade. Every [Cargo](/game/economy/cargo/) entry, [Trade offer](/game/economy/trade-offer/), production recipe input/output, mission reward, NPC inventory item, deployable item — all of them are wares.

A ware is a **dbdata** type, defined in `libraries/wares.xml`. A ware reference is acquired by:
- Lookup by id: `ware.energycells`, `ware.ore`, `ware.inv_spaceflycaviar`
- Via a macro: `$macro.ware` (every macro that represents a buildable/equippable item has a back-reference)
- Via container properties: `$station.products` (warelist), `$ship.cargo.list` (warelist)
- Via ware lists: `$container.resources.{$ware}.primary`

**Categories** (driven by tags + boolean accessors):
- **Cargo wares** (`.iscargo`) — products and intermediate resources. Have a `.waretransport` type (container / liquid / solid / condensate / passenger).
- **Inventory** (`.isinventory`) — NPC inventory, mission deliverables. Carried by entities, not ships' cargo.
- **Ammo** (`.isammo`) — missiles, mines, drones for reload. Stored in `ammostorage`, **not** cargo.
- **Crafting** (`.iscrafting`) — used in crafting recipes.
- **Deployable** (`.isdeployable`) — satellites, nav beacons, lasertowers etc. Have an `objectmacro`.
- **Mods** (`.isweaponmod`, `.isshieldmod`, `.isenginemod`, `.isshipmod`, `.isequipmentmod`, `.ispaintmod`, `.isclothingmod`) — equipment upgrades.
- **Software** (`.issoftware`) — pilot software (scanner, dock, longrange, police).
- **Research** (`.isresearchable`) — researchable techs.
- **Gift / Rare / Volatile** — special flags.

## Properties

The most-used accessors. Full list (~70) at vanilla `libraries/scriptproperties.xml:1897`.

### Identity

| Property | Type | Description |
|---|---|---|
| `.id` | string | Ware id (e.g. `"energycells"`, `"ore"`) |
| `.name` | string | Display name (respects unknown-status) |
| `.rawname` | string | Raw `t/0001-l044.xml` text entry key |
| `.description` | string | Description |
| `.icon` | string | UI icon id |
| `.tags` | list | Ware tags (`tag.economy`, `tag.silicon`, ...) |
| `.hastag.{tag}` | bool | Has tag |

### Pricing

| Property | Type | Description |
|---|---|---|
| `.minprice` | money | Minimum allowed price |
| `.averageprice` | money | Reference price (used for value calculations) |
| `.maxprice` | money | Maximum allowed price |
| `.pricerange` | money | Max − Min |
| `.volume` | int | Volume per unit (cargo space cost) |
| `.waretransport` | waretransport | container / liquid / solid / condensate / passenger |
| `.transporttag` | tag | Transport-type tag (used by `find_station hastransport=`) |

### Production recipe

| Property | Type | Description |
|---|---|---|
| `.resources` | wareamountlist | Default recipe inputs (ware → required amount) |
| `.raceresources.{race}` | wareamountlist | Race-specific recipe (Argon vs Boron vs Teladi may differ) |
| `.products` | warelist | Wares this ware is a resource for (reverse lookup) |
| `.group.factory.name` | string | Display name of the factory module that produces this |
| `.group.isbuildable` | bool | Can this group be built |

### Linked macros

| Property | Type | Description |
|---|---|---|
| `.container` | macro | Container macro this ware uses (e.g. `liquid_storage_macro`) |
| `.objectmacro` | macro | Object macro for deployable wares (e.g. satellite's `eq_arg_satellite_02_macro`) |
| `.objectcount` | int | How many objects per "1 ware" (usually 1) |
| `.videomacro` | macro | Video preview macro |

### Restrictions

| Property | Type | Description |
|---|---|---|
| `.illegal` | bool | Illegal to *some* faction |
| `.illegalto.{faction}.{null}` | bool | Illegal to specified faction |
| `.illegalto.{faction}.{faction}` | bool | Illegal to faction 1, given licences held by faction 2 |
| `.buyrestriction.{faction}` | float | Notoriety threshold needed to buy from faction |
| `.sellrestriction.{faction}` | float | Notoriety threshold needed to sell to faction |
| `.isvolatile` | bool | Special handling (hazardous) |
| `.isdropallowed` | bool | Can be dropped from inventory |

### Research

| Property | Type | Description |
|---|---|---|
| `.isresearchable` | bool | Can be researched |
| `.research.unlocked` | bool | Player has researched this |
| `.research.precursors` | warelist | Tech tree precursors |
| `.research.resources` | wareamountlist | Resources needed to research |

### Mods (equipment upgrades)

| Property | Type | Description |
|---|---|---|
| `.isweaponmod` / `.isshieldmod` / `.isenginemod` / `.isshipmod` | bool | Primary ware for a mod type |
| `.isequipmentmod` | bool | Any of the above |
| `.equipmentmodquality` | int | Quality tier |
| `.softwareversion.base` / `.max` / `.next` / `.previous` | ware | Software version graph |

## Actions

### Add ware to inventory (NPC carries it)

```xml
<add_inventory ware="ware.inv_spaceflycaviar" exact="99"/>
```

Adds to `player.entity` by default. To target an NPC:

```xml
<add_inventory ware="ware.inv_securitybypasssystem" exact="99"
    entity="player.headquarters.defencenpc"/>
```

**Critical:** `ware=` must be a wareref — `ware.X` literal or a variable holding a wareref. A string like `"$wareName"` silently no-ops; money is charged but nothing is delivered.

When using a variable, the variable itself must already be a wareref:
```xml
<set_value name="$drop" exact="ware.energycells"/>
<add_inventory ware="$drop" exact="50"/>          <!-- OK -->
<add_inventory ware="'energycells'" exact="50"/>  <!-- BROKEN — string, not ware -->
```

### Add ware to cargo (ship/station container)

```xml
<add_cargo object="$Station" ware="ware.advancedcomposites" exact="200"/>
<add_cargo object="$Station" ware="ware.advancedelectronics" exact="1300"/>
```

`add_cargo` is for **container cargo**, `add_inventory` is for **NPC inventory**. Different storage.

### Add ware as ammo / deployables (ammostorage)

```xml
<add_ammo object="player.ship"
    macro="macro.eq_arg_satellite_02_macro"
    amount="1"/>
```

For deployables, missiles, mines, drones, lasertowers — these go in `ammostorage.{macro}`, **not** in cargo or inventory. `add_inventory ware=` will silently fail.

Use `$ware.objectmacro` to bridge ware → ammomacro:

```xml
<add_ammo object="$Ship"
    macro="$ware.objectmacro"
    amount="$Amount"/>
```

### Remove / transfer

```xml
<remove_inventory ware="ware.inv_spaceflycaviar" exact="50"/>

<transfer_inventory from="$Source" to="$Target"
    ware="ware.inv_securityslicer" exact="10"/>
```

### Add ware to a station's production / build list (less common)

```xml
<set_ship_wares_included container="$Wharf"
    wares="[ware.ship_arg_m_corvette_01_a]"/>
```

`set_equipment_wares_*` and `set_ship_wares_*` (absolute / included / excluded) let modders extend or restrict what a station can build.

## Libraries

Ware itself is a passive data type — most "ware operations" live on the [Container](/game/objects/container/) (cargo, prices, supply) or in higher-level libraries. Ware-specific helpers in `lib_generic.xml` are sparse:

| Library | Purpose | Source line |
|---|---|---|
| `md.LIB_Generic.Add_Wares_For_Module` | Add the production wares of a module to a station's list | 5089 |
| `md.LIB_Generic.FindShipMacroForCargo` | Pick a ship macro that can carry given ware | 1427 |

For per-ware reasoning (price queries, quantity availability, recipe lookup), use container accessors (`$station.cargo.{$ware}.amount`, `$container.buyprice.{$ware}`, `$ware.resources.list`) rather than libraries.

## Events

Ware-related events are container-side (trade) or entity-side (inventory). There is no `event_ware_*` family.

| Event | When | Notes |
|---|---|---|
| `event_trade_completed` | A trade finished (cargo moved + money moved) | Attrs: `seller=`, `buyer=`, `tradeoffer=`. Use `tradeoffer=$X` to track a specific trade offer |
| `event_trade_started` | A trade was initiated (cargo may not yet have moved) | Use this when you want to detect intent, not completion |
| `event_player_trade_completed` | Player-side wrapper of trade_completed | Player-only convenience |
| `event_object_changed_trade_subscription` | Container's subscription list changed | Used by trade UI |

## Common gotchas

- ⚠ **`add_inventory ware="$string"` silently no-ops** — money is charged, ware is not delivered. Must be `ware.{$string}` to resolve to a wareref. Same applies to `add_cargo`, `transfer_inventory`.
- ⚠ **`DeployObjectAtPosition` reads `ammostorage.{macro}`, not inventory.** For player deployables, use `add_ammo macro=` not `add_inventory ware=`. Memorable mistake: 48 errors / 2 hours before realising.
- ⚠ **`$ware.resources` returns a wareamountlist that DEGRADES when stored in a variable.** Access `.resources.list` inline every time:
  ```xml
  <do_for_each name="$res" in="$ware.resources.list">  <!-- OK every iteration -->
  ```
  Storing `<set_value name="$res" exact="$ware.resources"/>` and using `$res.list` later silently returns null.
- ⚠ **Module recipes via `$Mod.macro.ware.resources`**, NOT `$Mod.products.list.{1}.resources`. The latter returns null silently because `.products.list` items are not full ware-refs.
- ⚠ **`sellprice`/`buyprice` in debug logs are × 100.** Internal representation is 1/100-credit integer. A log line `sellprice=1000000` means 10 000 Cr. Same for `.money`.
- ⚠ **Ware uses `.name`, NOT `.knownname`.** Wares don't have unknown-status the way components do; `.knownname` returns null. For display use `.name`.
- ⚠ **Price math: pre-divide by 100 before multiplying.** Chained `(pct × count × price)` can overflow int32 to negative when intermediate exceeds 2^31. Vanilla pattern: `(pct * price) / 100` first, then `* count`.
- ⚠ **Race-specific recipes:** Boron, Terran, Khaak may have different production recipes for the same ware. Use `$ware.raceresources.{$race}` if your script cares about who is producing.

## Examples

### Example 1: Compute the total value of a ship's loadout

```xml
<set_value name="$ShipValue"
    exact="$ship.macro.ware.averageprice"/>

<do_for_each name="$missile" in="$ship.cargo.list">
    <set_value name="$ShipValue"
        operation="add"
        exact="$missile.ware.averageprice * $ship.cargo.{$missile}.amount"/>
</do_for_each>

<write_to_logbook
    text="$ship.knownname + ' is worth ' + $ShipValue"/>
```

Pattern from vanilla `lib_generic.xml:464`.

### Example 2: Reward the player with mission ware

```xml
<add_inventory
    ware="ware.inv_securitybypasssystem"
    exact="3"
    entity="player.entity"/>

<write_to_logbook
    text="'Received: 3 × ' + ware.inv_securitybypasssystem.name"/>
```

### Example 3: Deploy 4 satellites for the player

```xml
<add_ammo object="player.ship"
    macro="macro.eq_arg_satellite_02_macro"
    amount="4"/>

<write_to_logbook
    text="'Added 4 advanced satellites to ' + player.ship.knownname"/>
```

For the ware-side accessor: `ware.eq_arg_satellite_02.objectmacro` returns the deployable macro.

### Example 4: Iterate a production recipe

```xml
<do_for_each name="$res" in="ware.advancedelectronics.resources.list">
    <write_to_logbook
        text="$res.name + ': ' + ware.advancedelectronics.resources.{$res}"/>
</do_for_each>
```

Use `ware.X.resources.list` **inline every iteration** — do not store `.resources` into a variable.

## Architectural context

- **How faction economies decide what to produce, build, buy:** Architectural overview *Faction economy* — per-sector shortage formula reads ware demand vs supply, picks corrective action.
- **Trade offer lifecycle:** Architectural overview *Trade offer lifecycle* — buy/sell offer creation, `event_trade_started` → `event_trade_completed`, partial deliveries.
- **Workforce wares:** Architectural overview *Workforce* — `workforce.resources` per race, consumption rates, bonus formula.
- **Research tree:** Architectural overview *Research* — `research.precursors`, `research.resources`, unlock cascade.

## Related

- [Cargo](/game/economy/cargo/) — container of wares.
- [Trade offer](/game/economy/trade-offer/) — what offers wares.
- [Subscription](/game/economy/subscription/) — trade-offer subscription mechanism.
- [Macro](/lang/data/macro/) — how wares map to objects (data layer).
- [Faction](/game/factions/faction/) — owner of stations producing wares, source of buy/sell restrictions.
- [Container](/game/objects/container/) — abstract carrier of wares (station, ship, buildstorage).

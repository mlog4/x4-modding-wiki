---
title: Processing module
description: Station module that recycles space scrap into wares. Companion to production modules — input is towed recyclables, output is normal cargo.
---

A **Processing module** is a station [Module](/game/objects/module/) that converts space scrap into wares. Unlike [Production modules](/game/objects/production-module/) (which consume input wares from supply chains), processing modules consume **physical recyclable objects** — scrap cubes, derelict ship hulls — towed to the module by a [Ship](/game/objects/ship/) and processed at a designated furnace position.

Stations with processing modules are *recycling facilities* (`Station.isrecyclingfacility=true`). Vanilla typically has at least one such station per faction; the Scavenger faction's economy revolves around them.

**Inheritance:** `component → destructible → module → processingmodule`. The datatype adds furnace position and recipe accessors.

## Properties

### Processing-module-specific

| Property | Type | Description |
|---|---|---|
| `.furnacestartpos` | position | Position on the module near which an object should be before `<process_recyclable_object>` can run |
| `.products` | warelist | All produced wares (the recycling outputs) |
| `.resources` | warelist | All resource wares — but for recycling, the actual inputs are *recyclables*, not wares |
| `.resources.{ware}.primary` | bool | Primary resource (for processing modules that also accept ware inputs) |
| `.resources.{ware}.secondary` | bool | Secondary resource |

### Inherited

| Property | Source | Description |
|---|---|---|
| `.numdocks.{docksize}` | module | Connected docks |
| `.haswalkableroom` | module | Walkable interior |
| `.hull` | destructible | Damage state |

## Recyclable objects

Recyclables are objects in space the player or NPCs can tow to a furnace. Vanilla seeds them via `setup_gamestarts.xml:1774` (`macro.recyclable_gen_m_scrapcube_01_macro`) and similar.

Class membership: `.isclass.recyclable`. The recyclables drift in space and have a value when fed to a processing module.

## Actions

### Check if an object can be processed

```xml
<can_process_recyclable_object
    module="$ProcessingModule"
    object="$ScrapCube"
    result="$canDo"
    trade="$scrapoffer"/>
```

Pattern from vanilla `notifications.xml:4057`. `$canDo` returns true/false; `$scrapoffer` returns the buy offer the module is making for this object.

### Process a recyclable

```xml
<process_recyclable_object
    module="$ProcessingModule"
    object="$ScrapCube"
    trade="$scrapoffer"/>
```

Pattern from `notifications.xml:4067`. The module consumes the object, distributes wares, credits the player (or owner).

### Player towed a recyclable to a furnace

```xml
<event_player_towed_recyclable_near_furnace/>
```

Vanilla `notifications.xml:3993, 4030`. The event fires when the player drags a recyclable within `furnacestartpos` proximity.

## Events

| Event | When | Notes |
|---|---|---|
| `event_player_towed_recyclable_near_furnace` | Player approached a furnace with a recyclable in tow | `event.param`/`event.param2` describe the object and module |
| `event_player_recyclable_processing_started` | Processing began | Fires after `process_recyclable_object` |
| `event_player_recyclable_processed` | Processing complete | Final |
| `event_player_interaction param2="'recyclable_near_furnace'"` | Player triggered the interaction prompt | Vanilla `notifications.xml:4051` |

These are **player-specific events**. NPC recycling happens silently engine-side; only player-driven processing fires these.

## Common patterns

### "Find recycling facilities in player space"

```xml
<find_station_by_true_owner name="$Stations"
    space="player.galaxy"
    multiple="true"/>

<create_list name="$Recyclers"/>

<do_for_each name="$s" in="$Stations">
    <do_if value="$s.isrecyclingfacility">
        <append_to_list name="$Recyclers" exact="$s"/>
    </do_if>
</do_for_each>

<write_to_logbook
    text="'Recycling facilities in galaxy: '
        + $Recyclers.count"/>
```

`.isrecyclingfacility` is the station-side flag (parallel to `.istradestation`, `.isshipyard`).

### "Get the furnace position for towing"

```xml
<do_for_each name="$mod" in="$Station.modules">
    <do_if value="$mod.isclass.processingmodule">
        <set_value name="$FurnacePos"
            exact="$mod.furnacestartpos"/>
        <write_to_logbook
            text="'Furnace at: ' + $FurnacePos"/>
    </do_if>
</do_for_each>
```

## Common gotchas

- ⚠ **Inputs are physical objects, not cargo wares.** Don't expect `Station.cargo.{ware.recyclable}` — the input is a runtime object in space, towed to the module.
- ⚠ **`.furnacestartpos` is the *trigger position*, not the docking position.** The object must be NEAR this position for `process_recyclable_object` to succeed. The acceptance radius is engine-defined.
- ⚠ **`.isrecyclingfacility` is on the station, NOT on the processing module.** The flag is true when the station has at least one processing module.
- ⚠ **Vanilla recycling event family is player-only.** NPC recycling doesn't fire `event_player_recyclable_processed`. To observe NPC recycling, watch `event_object_destroyed` on `class.recyclable` objects.
- ⚠ **`.products` may differ from a normal production module's products.** Processing recipes typically output scrap-derived wares (refined metals, allagraphene in X4 9.0+). Check by ware.
- ⚠ **Memory note for X4 9.0:** Allagraphene chains and nividium mining are anticipated additions when 9.0 ships. Mods that touch processing-recipes should keep this in mind.
- ⚠ **Filter out processing modules in your "find normal production stations" filter.** Add `not .isrecyclingfacility` to the canonical [Production factory](/game/objects/production-factory/) exclusion idiom if you don't want recyclers to slip in.

## Examples

### Example 1: Detect when player processes scrap

```xml
<cue name="WatchPlayerRecycle" instantiate="true">
    <conditions>
        <event_player_recyclable_processed/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player processed scrap at '
                + event.param.knownname"/>
    </actions>
</cue>
```

### Example 2: Compute total recycling output of player-owned recyclers

```xml
<find_station_by_true_owner name="$Recyclers"
    space="player.galaxy"
    faction="faction.player"
    multiple="true"/>

<set_value name="$TotalOutput" exact="0"/>

<do_for_each name="$s" in="$Recyclers">
    <do_if value="$s.isrecyclingfacility">
        <do_for_each name="$mod" in="$s.modules">
            <do_if value="$mod.isclass.processingmodule">
                <do_for_each name="$product"
                    in="$mod.products.list">
                    <set_value name="$TotalOutput"
                        operation="add"
                        exact="$s.cargo.{$product}.amount"/>
                </do_for_each>
            </do_if>
        </do_for_each>
    </do_if>
</do_for_each>

<write_to_logbook
    text="'Player recycler stock: ' + $TotalOutput"/>
```

## Architectural context

- **Recyclable spawn locations:** Architectural overview *Recyclable seeding* — `setup_gamestarts.xml:1774` spawns scrap cubes in certain sectors at game start.
- **Scavenger economy:** Architectural overview *Pirate / Scavenger economy* — how recycling drives the Riptide-faction supply chain.
- **X4 9.0 chain additions:** Architectural overview *Allagraphene chains* — anticipated 9.0 processing expansion.

## Related

- [Module](/game/objects/module/) — parent abstraction.
- [Production module](/game/objects/production-module/) — companion that consumes wares (vs recyclables).
- [Station](/game/objects/station/) — host; `.isrecyclingfacility` is the discriminator.
- [Ship](/game/objects/ship/) — what tows recyclables to the furnace.
- [Ware](/game/economy/ware/) — outputs (refined metals, etc.).

---

:::tip[Pattern — module that consumes runtime objects, not wares]
Processing module is the only module type whose input is *physical objects in space*, not stocked cargo wares. The `furnacestartpos` + `process_recyclable_object` flow is unique. Same pattern as Build modules consuming "construction sites" (not wares).
:::

---
title: Mine
description: Deployable explosive — stationary or tracking, with optional friend/foe detection. Three vanilla macros covering distinct behaviours.
---

A **Mine** is a deployable explosive that detonates on contact. Players deploy them as area-denial weapons; NPC factions seed minefields around contested space via `PlaceMinefield` / `PlaceMinefieldIndiscriminative` libraries.

**Inheritance:** `component → destructible → object → mine`. Unlike [Satellite](/game/objects/satellite/) (1 property), mine has 6 own properties covering arming state and friend/foe lists.

**Three vanilla mine variants** (all under `class.mine`):

| Macro | Behaviour | Friend/foe? |
|---|---|---|
| `macro.weapon_gen_mine_01_macro` | Stationary, contact-trigger | No |
| `macro.weapon_gen_mine_02_macro` | Tracking, no friend/foe | No |
| `macro.weapon_gen_mine_03_macro` | Tracking + friend/foe (~1000m radius, 1500m max) | **Yes** |

The `_03_macro` is what vanilla `PlaceMinefield` library uses; `_01` and `_02` are the indiscriminative variants.

## Properties

### Mine-specific

| Property | Type | Description |
|---|---|---|
| `.isfriendfoe` | bool | Has friend/foe discrimination (true for `_03_macro`) |
| `.friendlist` | list | Friend list (only meaningful when `.isfriendfoe=true`) |
| `.foelist` | list | Foe list (only meaningful when `.isfriendfoe=true`) |
| `.target` | destructible | Current target (if tracking) |
| `.isarmed` | bool | Mine has armed itself (passed safety distance from launcher) |
| `.safetydistance` | length | Distance from launcher needed to arm. Only valid before `.isarmed=true` |

### Useful inherited

| Property | Source | Description |
|---|---|---|
| `.sector` / `.zone` / `.position` | object | Location |
| `.owner` / `.trueowner` | object | Deploying faction |
| `.macro` | component | Mine variant macro |
| `.hull` / `.hullpercentage` | destructible | Destructible state — shoot to disarm |

## Actions

### Place a minefield via vanilla library (preferred)

```xml
<run_actions ref="md.LIB_Generic.PlaceMinefield">
    <param name="SelectedTarget" value="$Target"/>
    <param name="MinSpawn" value="6"/>
    <param name="MaxSpawn" value="12"/>
    <param name="ExplosiveOwner" value="$Faction"/>
    <param name="MaxDistance" value="4km"/>
</run_actions>
```

Friend/foe mines (`_03_macro`), 1000m tracking radius, 1500m max distance. The library:
- Scatters mines randomly within `±15km / ±3km / ±15km` of the target zone center
- Increases spread (`MaxDistance + 1km`) every 5 mines for larger fields
- Returns the placed-mines list

Source: `lib_generic.xml:582-613`.

### Place a non-discriminating minefield

```xml
<run_actions ref="md.LIB_Generic.PlaceMinefieldIndiscriminative">
    <param name="SelectedTarget" value="$Target"/>
    <param name="MinSpawn" value="6"/>
    <param name="MaxSpawn" value="12"/>
    <param name="ExplosiveOwner" value="$Faction"/>
</run_actions>
```

Randomly picks between `_01_macro` (stationary) and `_02_macro` (tracking) per mine. **Hits everyone**, including the deploying faction. Use for ambush scripts, not for owned-territory defence.

Source: `lib_generic.xml:616-647`.

### Place a single mine directly

```xml
<create_object
    name="$Mine"
    macro="macro.weapon_gen_mine_03_macro"
    zone="$Zone"
    owner="$Faction">
    <position x="$x" y="$y" z="$z"/>
</create_object>
```

For one-off placements (Easter eggs, scripted events).

### Give the player deployable mines

```xml
<add_ammo
    object="player.ship"
    macro="macro.weapon_gen_mine_01_macro"
    amount="3"/>
```

Same deployable pattern as [Satellite](/game/objects/satellite/). Vanilla `rml_deployinplace.xml:143-145` shows the canonical sequence — all three mine variants.

### Find mines in a sector

```xml
<find_object name="$Mines"
    space="$Sector"
    class="class.mine"
    multiple="true"/>
```

To filter friend/foe-armed mines only:

```xml
<do_for_each name="$mine" in="$Mines">
    <do_if value="$mine.isfriendfoe and $mine.isarmed">
        <!-- live F/F mine -->
    </do_if>
</do_for_each>
```

## Libraries

| Library | Purpose | Source line |
|---|---|---|
| `md.LIB_Generic.PlaceMinefield` | Friend/foe minefield (`_03_macro`) with tracking | 582 |
| `md.LIB_Generic.PlaceMinefieldIndiscriminative` | Mixed `_01`/`_02` field, no F/F | 616 |
| `md.LIB_Generic.PlaceLasertowerfield` | Sibling helper — places lasertowers, not mines | 680 |
| `md.LIB_Generic.PlaceRiggedAsteroids` | Sibling helper — places trap-rigged asteroids | 650 |

These four cover the standard "fortify a zone" patterns. Use them rather than reinventing.

## Events

There is no `event_mine_X` family. Mine outcomes are observed through standard object events:

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Mine destroyed (by being shot, OR by exploding on a target) | Filter `event.object.isclass.{class.mine}` |
| `event_object_killed_object` | A mine killed a target | `event.object` = mine, `event.param` = victim |

The mine itself is `event.object` of `event_object_destroyed` regardless of whether the destruction reason was "shot at" or "detonated as designed".

## Common gotchas

- ⚠ **Friend/foe lists are only meaningful on `_03_macro` mines.** `.friendlist` and `.foelist` return null/empty on `_01` and `_02` variants. Check `.isfriendfoe` first.
- ⚠ **`.safetydistance` is invalid after the mine arms.** Reading it returns null when `.isarmed=true`. Only useful during the brief launch window.
- ⚠ **Indiscriminative mines hit the deploying faction too.** `PlaceMinefieldIndiscriminative` uses `_01` and `_02` — no friend filter. Don't seed your own territory with these.
- ⚠ **Mines in the player's ammostorage are macros, not wares.** `add_ammo macro=`, not `add_inventory ware=`. Same trap as Satellite.
- ⚠ **`.foelist` may not auto-populate from faction relations.** F/F mines pull their lists from the deploying faction's enemy list at placement time. Relations changes after placement do NOT update the lists. To refresh, destroy and replace.
- ⚠ **Vanilla minefields scatter ±15km on X/Z but only ±3km on Y.** Mines are placed in a flat plane, not a sphere. If your script expects 3D coverage, override the position-spread logic.
- ⚠ **`.target` is null until the mine detects a foe.** Only set briefly between detection and detonation; transient.

## Examples

### Example 1: Ambush wave — seed enemy approach with mines

```xml
<run_actions ref="md.LIB_Generic.PlaceMinefield">
    <param name="SelectedTarget" value="$AmbushZone"/>
    <param name="MinSpawn" value="10"/>
    <param name="MaxSpawn" value="20"/>
    <param name="ExplosiveOwner" value="faction.player"/>
    <param name="MaxDistance" value="8km"/>
</run_actions>

<write_to_logbook
    text="'Mine ambush ready in '
        + $AmbushZone.sector.knownname"/>
```

### Example 2: Give the player a starter mine kit

```xml
<add_ammo
    object="player.ship"
    macro="macro.weapon_gen_mine_01_macro"
    amount="3"
    comment="Stationary"/>
<add_ammo
    object="player.ship"
    macro="macro.weapon_gen_mine_02_macro"
    amount="3"
    comment="Tracker"/>
<add_ammo
    object="player.ship"
    macro="macro.weapon_gen_mine_03_macro"
    amount="3"
    comment="F/F"/>

<write_to_logbook
    text="'9 mines added to ' + player.ship.knownname"/>
```

Pattern from `rml_deployinplace.xml:143-145`.

### Example 3: Detect when a player mine killed a Xenon ship

```xml
<cue name="WatchMineKill" instantiate="true">
    <conditions>
        <event_object_killed_object/>
        <check_value
            value="event.object.isclass.{class.mine}
                and event.object.owner == faction.player
                and event.param.owner == faction.xenon"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player mine killed: '
                + event.param.knownname"/>
    </actions>
</cue>
```

## Architectural context

- **How NPCs decide where to lay minefields:** Architectural overview *Static defence positioning* — `factionlogic_staticdefense.xml` picks high-risk gates and calls `PlaceMinefield`.
- **How mine pricing / availability is gated:** Architectural overview *Equipment licences* — some faction-mine macros require licences to buy from equipment docks.

## Related

- [Satellite](/game/objects/satellite/) — sibling deployable, parallel `add_ammo` pattern.
- [Nav beacon](/game/objects/nav-beacon/) — sibling deployable, purely informational.
- [Resourceprobe](/game/objects/resource-probe/) — sibling deployable, scans resources.
- [Explosive](/game/objects/explosive/) — parent abstract type (also includes missile).
- [Ship](/game/objects/ship/) — owner / launcher.
- [Sector](/game/world/sector/) — minefield containers.
- [Faction](/game/factions/faction/) — owner; friend/foe relations seed the lists at placement.

---

:::tip[Pattern — deployable with framework library]
Mine is the canonical *deployable-with-library*: rather than inline `create_object` calls, you use `PlaceMinefield` or `PlaceMinefieldIndiscriminative`. Same idiom applies to [Lasertower placement](/game/objects/ship/) and rigged asteroids.
:::

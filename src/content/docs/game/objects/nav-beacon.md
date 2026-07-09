---
title: Nav beacon
description: Deployable map marker. A waypoint visible to its owner faction — players use them for personal map labels and as patrol/route anchors for NPCs.
---

A **Nav beacon** is a deployable map-marker object. It does not provide radar coverage like a [Satellite](/game/objects/satellite/) — its job is purely *map labelling*. Player deploys nav beacons to mark interesting positions; NPC factions deploy them as part of patrol-route definitions and territory boundary markers.

**Inheritance:** `component → destructible → object → navbeacon`. The datatype is **empty** — `navbeacon` adds zero properties; everything is inherited from `object`.

**Related but separate:** `class.jumpbeacon` is a distinct class (Pirate DLC) — player-deployable beacon that lets ships jump to it. They look similar in the UI but are different abstractions. See [Gate](/game/world/gate/) for jumpbeacon coverage.

## Properties

There are no nav-beacon-specific properties. All accessors are inherited from `object`:

| Property | Source | Description |
|---|---|---|
| `.sector` / `.zone` / `.position` | object | Location |
| `.owner` / `.trueowner` | object | Deploying faction |
| `.macro` | component | Deployment macro |
| `.knownname` | component | Display name (player can rename via UI) |
| `.hull` / `.hullpercentage` | destructible | Damage state |
| `.isclass.{class.navbeacon}` | component | Type check (NOT `.isclass.{class.gate}`!) |

## Actions

### Deploy a nav beacon (player gift / scripted)

```xml
<add_ammo
    object="player.ship"
    macro="ware.eq_arg_navbeacon_01.objectmacro"
    amount="1"/>
```

Same deployable pattern as [Satellite](/game/objects/satellite/): `add_ammo macro=` puts it in the player's ammostorage; the player deploys it from the UI.

### Direct-spawn via create_object

```xml
<create_object
    name="$Beacon"
    macro="macro.eq_arg_navbeacon_01_macro"
    owner="$Faction"
    sector="$Sector">
    <position x="0" y="0" z="0"/>
</create_object>
```

For NPCs and scripted placement.

### Find all nav beacons in a sector

```xml
<find_object name="$Beacons"
    space="$Sector"
    class="class.navbeacon"
    multiple="true"/>
```

## Events

Unlike [Satellite](/game/objects/satellite/) (no dedicated event), nav beacon has a launch event:

| Event | When | Notes |
|---|---|---|
| `event_navbeacon_launched` | Nav beacon deployed in a space | Filter by `space=` (sector/cluster/galaxy) or `group=`. `event.param2.{1}` is the new beacon. Vanilla `rml_deploy_in_sectors.xml:107`, `rml_deployinplace.xml:210`, `x4ep1_mentor_subscription.xml:8533` |
| `event_object_destroyed` | Nav beacon destroyed | Standard object event |

The `event_navbeacon_launched` is the main hook modders use to react to player nav beacon placement (e.g., the Mentor Subscription quest in `x4ep1_mentor_subscription.xml:8624` checks `event.param2.{1}.isclass.navbeacon and .isplayerowned`).

## Common gotchas

- ⚠ **Nav beacon ≠ jumpbeacon.** `class.navbeacon` is a map marker. `class.jumpbeacon` is a Pirate DLC deployable that allows jumping. Don't conflate them — `isclass.navbeacon` is FALSE for a jumpbeacon and vice versa.
- ⚠ **Nav beacon ≠ gate.** Nav beacons are not connectivity nodes; `find_gate` does not return them.
- ⚠ **Nav beacon datatype is empty.** No properties beyond inherited object accessors. Don't expect `.range`, `.power` etc. like satellites have.
- ⚠ **Same `add_ammo macro=` pattern as Satellite.** Don't try `add_inventory ware=` — it puts the ware in NPC inventory, not in the deployable bag. See [Satellite](/game/objects/satellite/) gotchas.
- ⚠ **NPC patrol nav beacons are not always visible to the player.** Faction-owned nav beacons may be hidden until uncovered. Filter `find_object` results by `.knowntoplayer` if your mod wants only player-visible markers.
- ⚠ **`event_navbeacon_launched` fires for ALL factions in scope.** Check `event.param2.{1}.isplayerowned` before assuming the beacon is the player's.
- ⚠ **A nav beacon's `.knownname` is the player's free-text label.** Empty before the player renames. Don't depend on it for unique identification — use the object ref.

## Examples

### Example 1: Give the player a nav beacon

```xml
<add_ammo
    object="player.ship"
    macro="ware.eq_arg_navbeacon_01.objectmacro"
    amount="1"/>

<write_to_logbook
    text="'Nav beacon added to '
        + player.ship.knownname"/>
```

### Example 2: React when the player deploys a nav beacon

```xml
<cue name="WatchPlayerBeacon" instantiate="true">
    <conditions>
        <event_navbeacon_launched space="player.galaxy"/>
        <check_value
            value="event.param2.{1}.isclass.navbeacon
                and event.param2.{1}.isplayerowned"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player placed nav beacon at '
                + event.param2.{1}.sector.knownname"/>
    </actions>
</cue>
```

Pattern from vanilla `x4ep1_mentor_subscription.xml:8624`.

### Example 3: List all player nav beacons galaxy-wide

```xml
<find_object name="$AllBeacons"
    space="player.galaxy"
    class="class.navbeacon"
    multiple="true"/>

<create_list name="$Mine"/>

<do_for_each name="$beacon" in="$AllBeacons">
    <do_if value="$beacon.isplayerowned">
        <append_to_list name="$Mine" exact="$beacon"/>
    </do_if>
</do_for_each>

<write_to_logbook
    text="'Player has ' + $Mine.count + ' nav beacons'"/>
```

## Architectural context

- **How NPC patrol routes use nav beacons:** Architectural overview *Patrol coordination* — patrol order definitions reference nav beacon group ids; planted beacons define waypoints.
- **Subscription tie-in:** The Mentor Subscription quest (`x4ep1_mentor_subscription.xml`) uses `event_navbeacon_launched` to gate progression on player exploration.

## Related

- [Satellite](/game/objects/satellite/) — sibling deployable, provides radar coverage (different role).
- [Gate](/game/world/gate/) — `class.jumpbeacon` lives here, the connectivity-deployable.
- [Resourceprobe](/game/objects/resource-probe/) — sibling deployable, scans for resources.
- [Mine](/game/objects/mine/) — sibling deployable, lays explosives.
- [Sector](/game/world/sector/) — where nav beacons exist.
- [Ware](/game/economy/ware/) — `ware.eq_arg_navbeacon_*` is the inventory item.

---

:::tip[Pattern — empty datatype]
Nav beacon is an example of a *concrete object with no specific properties*. Everything is inherited; the datatype exists only to give the object a distinct class for filtering. Same shape as [Drop](/game/objects/drop/), some [Adsign](/game/objects/adsign/) variants.
:::

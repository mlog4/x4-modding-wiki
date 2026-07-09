---
title: Defence station
description: Station subtype dedicated to combat — turrets, missile batteries, fighters. Defends a sector but doesn't produce or trade.
---

A **Defence station** is a [Station](/game/objects/station/) subtype dedicated to combat. It hosts defence modules (turrets, missile batteries, defence drones), patrol fighters, and acts as the strategic stronghold of a sector. Defence stations don't produce wares — they exist to deny enemy movement.

This page documents Defence-station-specific behavior. For all general station behavior (creation, ownership, hull, dockingbays, events), see the parent [Station](/game/objects/station/) page.

## Identification

| Flag | Meaning |
|---|---|
| `.isdefencestation` | Currently a defence station |
| `.isplanneddefencestation` | Planned/in-construction to be a defence station |

For early detection during construction, use `.isplanneddefencestation` (vanilla `factionlogic_stations.xml:241`).

## Properties (defence-station-relevant)

All accessors live on the parent `station` datatype (`scriptproperties.xml:848`). There is no separate `defencestation` datatype.

| Property | Type | Description |
|---|---|---|
| `.isdefencestation` | bool | Currently a defence station |
| `.isplanneddefencestation` | bool | Planned to be a defence station |
| `.dps.all` / `.dps.turrets.all` | hp/s | Combined DPS — typically very high on defence stations |
| `.maxcombatrange.turrets` | length | Max turret reach |
| `.hasarmeddefencedrones` | bool | Has armed defence drones available |
| `.iscapturable` | bool | Defence stations are typically not boardable (large hull, high resistance) |
| `.alertlevel` | alertlevel | Red / yellow / green — drives turret activation |

## Common defence-station-relevant patterns

### "Find the nearest defence station"

```xml
<find_station_by_true_owner name="$Candidates"
    space="player.galaxy"
    multiple="true"
    sortbydistanceto="player.ship"/>

<set_value name="$found" exact="null"/>

<do_for_each name="$station" in="$Candidates">
    <do_if value="$station.isdefencestation">
        <set_value name="$found" exact="$station"/>
        <break/>
    </do_if>
</do_for_each>
```

### "Bias fight-mission offers at defence stations"

```xml
<set_value name="$Chance_Fight"
    exact="$Chance_High"
    chance="100 * $OfferObject.isdefencestation"/>
```

Pattern from vanilla `genericmissions.xml:313` — defence stations bias mission offers toward combat tasks (parallel to pirate bases).

### "Filter pure defence stations (not wharf/shipyard hybrids)"

```xml
<do_if value="$station.isdefencestation
    and not ($station.iswharf or $station.isshipyard)">
    <!-- pure defence — no shipbuilding -->
</do_if>
```

Pattern from vanilla `gmc_retrieve_dead_drop.xml:2292`.

### "Watch for player capturing a defence station"

```xml
<cue name="WatchDefenceCapture" instantiate="true">
    <conditions>
        <event_object_changed_owner/>
        <check_value
            value="event.object.isdefencestation
                and event.param == faction.player"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player captured defence station: '
                + event.object.knownname"/>
    </actions>
</cue>
```

## NPC population behavior

Defence stations have **special NPC instantiation rules** (vanilla `npc_instantiation.xml:1634, 2057`). Most defence stations have minimal civilian NPCs — only a defence NPC, a representative-of-sorts, and maintenance crew. Player-owned defence stations get the full NPC complement; NPC-owned ones stay sparse to save resources.

If your mod adds custom NPCs to defence stations, be aware: the engine may cull them during sparsification if `not isplayerowned`.

## Construction macros

Defence stations are constructed using:

- **Group**: `defence_<faction_3-letter-code>` (e.g. `defence_arg`, `defence_tel`) in `libraries/stationgroups.xml`.
- **Plan**: e.g. `arg_defence` in `libraries/constructionplans.xml`.

A typical defence station has many defence modules, several storage modules (for ammo and repair supplies), connection modules, and habitation for crew. Production modules are absent.

## Common gotchas

- ⚠ **`.isdefencestation` is FALSE during construction.** Use `.isplanneddefencestation` for early detection.
- ⚠ **Defence stations can be hybrid (shipyard / wharf / equipment dock combined).** Don't assume mutual exclusion. The pure-defence filter is `.isdefencestation and not (.iswharf or .isshipyard)`.
- ⚠ **Defence stations are typically NOT capturable.** `.iscapturable=false` for most macros; high boarding resistance, no signal leak. Don't write mods that assume the player can board them.
- ⚠ **NPC-owned defence stations have reduced NPC population.** Engine sparsifies — your custom NPC additions may get culled. Check `.isplayerowned` before injecting characters.
- ⚠ **Turret activation depends on alert level.** A defence station at `alertlevel.green` has turrets deactivated. Set alert state via `set_alertlevel` if your mod needs guaranteed combat readiness.
- ⚠ **A faction can lose its defence station mid-game.** Sector ownership flip → defence station likely destroyed. Listen for `event_object_destroyed` on watched stations.

## Architectural context

- **How factions decide where to build defence stations:** Architectural overview *Faction goals* — `factiongoal_hold_space` evaluates sector value; defence stations placed at chokepoints (entry gates).
- **Static defence positioning:** Architectural overview *Static defence positioning* — `factionlogic_staticdefense.xml` scores each gate by destination ownership, places defence assets accordingly.
- **NPC sparsification:** Architectural overview *NPC instantiation* — engine-side rule that defence stations get fewer NPCs to manage performance.

## Related

- [Station](/game/objects/station/) — parent abstraction (all general properties/actions live there).
- [Faction](/game/factions/faction/) — owner; faction goals drive placement.
- [Shipyard](/game/objects/shipyard/) — sibling; some defence stations are also shipyards (rare).
- [Wharf](/game/objects/wharf/) — sibling; defence + wharf combo possible.
- [Defence module](/game/objects/defence-module/) — the contained part providing combat capability.
- [Sector](/game/world/sector/) — what the defence station defends.

---

:::tip[Pattern — IS-A subtype]
Same pattern as [Shipyard](/game/objects/shipyard/) / [Wharf](/game/objects/wharf/) / [Equipment dock](/game/objects/equipment-dock/) — this page only documents Defence-station-specific behavior. General station behavior lives on [Station](/game/objects/station/).
:::

---
title: Resource probe
description: Deployable scanner that detects mining yields in a 32 km cube around itself. Drives mining-routing decisions.
---

A **Resource probe** is a deployable scanner. Once placed in a sector, it samples mining yields within a **32 km × 32 km × 32 km cube** around itself and reports per-ware yield ratings. Modders and the player use them to find profitable mining locations before committing miner fleets.

**Inheritance:** `component → destructible → object → resourceprobe`. The datatype adds two scan accessors; the rest is inherited from `object`.

**Single vanilla variant:** `macro.eq_arg_resourceprobe_01_macro` (no advanced variant in vanilla).

## Properties

### Resource-probe-specific

| Property | Type | Description |
|---|---|---|
| `.currentyield` | wareamountlist | Total yield detected in the 32 km scan cube. Per-ware amount detected. |
| `.bestyieldrating.{ware}` | int 0..15 | The best per-ware yield rating found in the cube |

The 0..15 rating matches the sector-level `.yieldrating.{ware}` scale — useful for "is this probe finding a richer spot than the sector average?".

### Useful inherited

| Property | Source | Description |
|---|---|---|
| `.sector` / `.zone` / `.position` | object | Probe location |
| `.owner` / `.trueowner` | object | Deploying faction |
| `.macro` | component | Always `eq_arg_resourceprobe_01_macro` in vanilla |
| `.macro.ware.maxprice` | macro property | Build cost — used by `gm_find_resources.xml:938` for mission rewards |
| `.hull` / `.hullpercentage` | destructible | Damage state |

## Actions

### Give the player a resource probe

```xml
<add_ammo
    object="player.ship"
    macro="macro.eq_arg_resourceprobe_01_macro"
    amount="1"/>
```

Same deployable pattern as [Satellite](/game/objects/satellite/) / [Nav beacon](/game/objects/nav-beacon/) / [Mine](/game/objects/mine/). Resource probes live in `ammostorage.{macro}`, not in cargo or inventory.

### Direct-deploy at a position

```xml
<create_object
    name="$Probe"
    macro="macro.eq_arg_resourceprobe_01_macro"
    owner="$Faction"
    sector="$Sector">
    <position x="$x" y="$y" z="$z"/>
</create_object>
```

### Find all resource probes in a sector

```xml
<find_object name="$Probes"
    space="$Sector"
    class="class.resourceprobe"
    multiple="true"/>
```

### Read what a probe is finding

```xml
<do_for_each name="$ware"
    in="$Probe.currentyield.list">
    <set_value name="$amount"
        exact="$Probe.currentyield.{$ware}"/>
    <set_value name="$rating"
        exact="$Probe.bestyieldrating.{$ware}"/>
    <write_to_logbook
        text="$ware.name + ': ' + $amount
            + ' (rating ' + $rating + '/15)'"/>
</do_for_each>
```

**Iterate `.currentyield.list` inline** — `wareamountlist` degrades when stored. Same trap as everywhere else; see [Ware](/game/economy/ware/) Common gotchas.

## Events

| Event | When | Notes |
|---|---|---|
| `event_resourceprobe_launched` | A resource probe deployed in scope | Filter by `space=` or `group=`. Vanilla `rml_deployinplace.xml:211`, `rml_deploy_in_sectors.xml:108` |
| `event_object_destroyed` | Probe destroyed | Standard object event |

Parallel to `event_navbeacon_launched` — vanilla has launch events for nav beacon, resource probe, and satellite-related actions, but **NOT** satellite-launched specifically.

## Common gotchas

- ⚠ **`.currentyield` is a `wareamountlist` — degrades when stored in a variable.** Access `.list` inline every iteration. `<set_value name="$y" exact="$Probe.currentyield"/>` then `$y.list` returns null.
- ⚠ **Probes scan a 32 km cube only.** A probe at zone center sees a ~32 km radius effectively; placed at the sector edge it scans mostly empty space. For coverage, spread probes 32 km apart.
- ⚠ **Vanilla has only ONE probe variant.** No advanced version; no faction-specific variants. Always `eq_arg_resourceprobe_01_macro`.
- ⚠ **`add_ammo macro=`, NOT `add_inventory ware=`.** Same as Satellite / Mine / Nav beacon. Wrong action silently no-ops on deployable.
- ⚠ **`.bestyieldrating.{$ware}` returns 0 for wares not present in the cube.** Distinguish from "rating 0 (depleted)" by checking `.currentyield.{$ware}` separately — probes report 0 for both "no ware" and "no yield".
- ⚠ **Probes can be picked up and redeployed.** Vanilla `gm_find_resources.xml:938` notes "Player technically only needs to buy one probe. It can be deployed, deactivated and collected again." Don't assume each `event_resourceprobe_launched` represents a new probe purchase.
- ⚠ **NPC miners use sector-level `.yieldrating.{$ware}`, not probe data.** Probes are mostly a player UX tool. NPC mining behaviour reads `Sector.bestyieldrating.{$ware}` directly without needing a probe.

## Examples

### Example 1: Give the player one resource probe

```xml
<add_ammo
    object="player.ship"
    macro="macro.eq_arg_resourceprobe_01_macro"
    amount="1"/>

<write_to_logbook
    text="'Resource probe added to '
        + player.ship.knownname"/>
```

### Example 2: Find the richest probe-detected silicon spot in player space

```xml
<find_object name="$Probes"
    space="player.galaxy"
    class="class.resourceprobe"
    multiple="true"/>

<set_value name="$bestProbe" exact="null"/>
<set_value name="$bestRating" exact="0"/>

<do_for_each name="$probe" in="$Probes">
    <do_if value="$probe.trueowner == faction.player
        and $probe.bestyieldrating.{ware.silicon} gt $bestRating">
        <set_value name="$bestProbe" exact="$probe"/>
        <set_value name="$bestRating"
            exact="$probe.bestyieldrating.{ware.silicon}"/>
    </do_if>
</do_for_each>

<do_if value="@$bestProbe">
    <write_to_logbook
        text="'Best silicon spot: '
            + $bestProbe.sector.knownname
            + ' at rating ' + $bestRating + '/15'"/>
</do_if>
```

### Example 3: Auto-discover when player deploys a probe in Xenon space

```xml
<cue name="WatchPlayerProbeInXenon" instantiate="true">
    <conditions>
        <event_resourceprobe_launched space="player.galaxy"/>
        <check_value
            value="event.param2.{1}.isplayerowned
                and event.param2.{1}.sector.owner
                    == faction.xenon"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player probe in Xenon sector: '
                + event.param2.{1}.sector.knownname"/>
    </actions>
</cue>
```

## Architectural context

- **How "find resources" missions are generated:** Architectural overview *Resource discovery missions* — `gm_find_resources.xml` calculates probe-required count and lays out cutscene placements.
- **How NPC miners pick mining sites:** Architectural overview *Mining routing* — NPC miners read sector-level `.yieldrating` directly, bypassing probes.

## Related

- [Satellite](/game/objects/satellite/) — sibling deployable, parallel `add_ammo` pattern.
- [Nav beacon](/game/objects/nav-beacon/) — sibling deployable, parallel `event_X_launched` event.
- [Mine](/game/objects/mine/) — sibling deployable.
- [Asteroid](/game/objects/asteroid/) — what probes find (specifically `class.miningnode`).
- [Sector](/game/world/sector/) — `.bestyieldrating.{ware}` is the sector-level analog.
- [Ware](/game/economy/ware/) — mineable wares (`ware.silicon`, `ware.ore`, `ware.methane`, `ware.hydrogen`, ...).
- [Ship](/game/objects/ship/) — owner / launcher.

---

:::tip[Pattern — deployable with scan-state]
Resource probe is a deployable that *accumulates state over time* in `.currentyield`. Unlike satellites/beacons/mines (mostly passive), the probe's output evolves as the engine scans its cube. Inline-iterate `.currentyield.list` every read.
:::

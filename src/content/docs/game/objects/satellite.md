---
title: Satellite
description: Deployable map-coverage and trade-subscription beacon. Basic (eq_arg_satellite_01) and Advanced (eq_arg_satellite_02) variants.
---

A **Satellite** is a deployable object that provides map coverage and trade-offer subscriptions in a radius around itself. Players deploy them to reveal sectors and unlock trade offers; NPC factions deploy them as part of static-defence and intel.

**Inheritance:** `component → destructible → object → satellite`. The datatype is tiny — just one additional property (`.isadvanced`); everything else is inherited.

**Two vanilla variants:**

| Variant | Macro | `.isadvanced` | Notes |
|---|---|---|---|
| Basic satellite | `eq_arg_satellite_01_macro` | false | Smaller radar range, cheaper |
| Advanced satellite | `eq_arg_satellite_02_macro` | true | Larger radar range, supports trade subscription |

Both use the Argon macro id even when deployed by other factions — vanilla never created per-faction satellite macros.

## Properties

Most accessors come from inherited `object` / `destructible`. Satellite-specific is one bool.

### Satellite-specific

| Property | Type | Description |
|---|---|---|
| `.isadvanced` | bool | Advanced satellite (the `_02_macro`) — gives larger radar range + trade subscription |

### Useful inherited

| Property | Source | Description |
|---|---|---|
| `.sector` / `.zone` / `.position` | object | Location |
| `.owner` / `.trueowner` | object | Faction that deployed it |
| `.macro` | component | The deployment macro (use to distinguish variants) |
| `.macro.maxradarrange` | macro property | Radar coverage radius — used by `gm_achievecoverage.xml` |
| `.macro.ware.maxprice` | macro property | Build cost — `gm_achievecoverage.xml:780` |
| `.hull` / `.hullpercentage` | destructible | Damage state |

## Actions

### Deploy a satellite (NPC / scripted)

```xml
<create_object
    name="$Sat"
    macro="macro.eq_arg_satellite_02_macro"
    owner="$Faction"
    sector="$Sector">
    <position x="0" y="0" z="0"/>
</create_object>
```

Pattern from vanilla `factionlogic.xml:1425` (random basic/advanced) and `gm_achievecoverage.xml:447` (cutscene marker). NPCs deploy directly via `create_object`; they don't go through ammostorage.

### Give the player a deployable satellite

To put a satellite in the player's deployable inventory (so they can place it from the UI):

```xml
<add_ammo
    object="player.ship"
    macro="macro.eq_arg_satellite_02_macro"
    amount="1"/>
```

**Critical:** `add_ammo macro=`, **not** `add_inventory ware=`. Deployables live in `ammostorage.{macro}`, not in cargo or inventory. See [Ware](/game/economy/ware/) Common gotchas.

The ware-to-macro bridge for the inventory item:

```xml
<add_ammo
    object="player.ship"
    macro="ware.eq_arg_satellite_02.objectmacro"
    amount="1"/>
```

### Find satellites in a sector

```xml
<find_object name="$Sats"
    space="$Sector"
    class="class.satellite"
    multiple="true"/>
```

For player-owned versus enemy, filter by `.trueowner` after.

### Force-deploy programmatically (rare)

When the script needs to put a satellite at an exact `(sector, position)` without involving the player UI:

```xml
<create_object
    name="$Sat"
    macro="macro.eq_arg_satellite_02_macro"
    owner="faction.player"
    sector="$TargetSector">
    <position
        x="$Position.x"
        y="$Position.y"
        z="$Position.z"/>
</create_object>
```

## Libraries

There are no `LIB_Generic.Satellite*` helpers. The closest related framework:

| Library | Purpose | Source line |
|---|---|---|
| `md.LIB_Generic.UncoverMap_SectorsAndGates` | Reveal sectors directly without deploying satellites | 2056 |

For "what radar coverage do my satellites give me", the vanilla logic is in `gm_achievecoverage.xml`, not `lib_generic`.

## Events

There is no `event_satellite_X` family. Satellites use standard object events:

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Satellite destroyed | Filter `event.object.isclass.{class.satellite}` |
| `event_object_changed_owner` | Ownership changed | Rare — satellites are not usually capturable |

For "player just deployed a satellite", listen for `event_object_changed_sector` on player-owned objects (no satellite-specific event in vanilla).

## Common gotchas

- ⚠ **Satellites are NOT added to cargo or inventory.** They live in `ammostorage.{macro}`. Use `add_ammo macro=`, not `add_inventory ware=` or `add_cargo ware=`. Memorable mistake from production: 48 errors / 2 hours before realising.
- ⚠ **The bridge from ware to deploy-macro is `ware.X.objectmacro`.** Both `add_ammo macro="ware.eq_arg_satellite_02.objectmacro"` and `add_ammo macro="macro.eq_arg_satellite_02_macro"` work — the first is more flexible for ware-driven logic.
- ⚠ **No `event_satellite_deployed`.** To detect player deployment, monitor `add_ammo` indirectly (count `.ammostorage` deltas) or watch for new `class.satellite` objects in the player's sectors.
- ⚠ **Per-faction satellite macros don't exist.** Even Khaak / Xenon satellites use the Argon macro. Don't try `macro.eq_xen_satellite_02_macro` — it's invalid.
- ⚠ **NPC satellites use `create_object` directly.** `factionlogic.xml:1425` shows the pattern. Don't expect NPCs to go through ammostorage.
- ⚠ **`.macro.maxradarrange` is the coverage radius.** Use it for "is this position within satellite coverage" checks. `gm_achievecoverage.xml:779-815` has the vanilla coverage-math reference.
- ⚠ **Satellites can be destroyed by enemy AI.** They have low hull. If your mod depends on satellite presence for logic (intel, subscriptions), listen for `event_object_destroyed`.

## Examples

### Example 1: Give the player one advanced satellite

```xml
<add_ammo
    object="player.ship"
    macro="macro.eq_arg_satellite_02_macro"
    amount="1"/>

<write_to_logbook
    text="'1 Advanced Satellite added to '
        + player.ship.knownname"/>
```

### Example 2: Auto-deploy 4 satellites to cover a sector

```xml
<set_value name="$Positions" exact="[
    [40000, 0, 40000],
    [-40000, 0, 40000],
    [40000, 0, -40000],
    [-40000, 0, -40000]
]"/>

<do_for_each name="$pos" in="$Positions">
    <create_object
        name="$sat"
        macro="macro.eq_arg_satellite_02_macro"
        owner="faction.player"
        sector="$TargetSector">
        <position
            x="$pos.{1}"
            y="$pos.{2}"
            z="$pos.{3}"/>
    </create_object>
</do_for_each>

<write_to_logbook
    text="'Deployed 4 satellites in '
        + $TargetSector.knownname"/>
```

### Example 3: Count player satellites and their advanced/basic split

```xml
<find_object name="$AllSats"
    space="player.galaxy"
    class="class.satellite"
    multiple="true"/>

<set_value name="$Basic" exact="0"/>
<set_value name="$Advanced" exact="0"/>

<do_for_each name="$sat" in="$AllSats">
    <do_if value="$sat.trueowner == faction.player">
        <do_if value="$sat.isadvanced">
            <set_value name="$Advanced"
                operation="add" exact="1"/>
        </do_if>
        <do_else>
            <set_value name="$Basic"
                operation="add" exact="1"/>
        </do_else>
    </do_if>
</do_for_each>

<write_to_logbook
    text="'Player satellites — Basic: ' + $Basic
        + ' Advanced: ' + $Advanced"/>
```

## Architectural context

- **How coverage is calculated:** Architectural overview *Sector coverage math* — `gm_achievecoverage.xml` computes how many satellites of which type are needed for a given coverage radius.
- **How NPC factions place satellites:** Architectural overview *Static defence positioning* — `factionlogic_staticdefense.xml` and `factionlogic.xml:1425` deploy satellites at strategic positions.
- **Trade subscription tie-in:** Architectural overview *Subscriptions* — advanced satellites grant temporary trade-offer subscriptions to the deploying faction.

## Related

- [Ship](/game/objects/ship/) — deploys satellites from ammostorage.
- [Sector](/game/world/sector/) — what satellites cover.
- [Ware](/game/economy/ware/) — `ware.eq_arg_satellite_01` / `_02` are the inventory items; `.objectmacro` bridges to the deploy macro.
- [Navbeacon](/game/objects/nav-beacon/) — companion deployable for map marking.
- [Resourceprobe](/game/objects/resource-probe/) — companion deployable for resource scanning.
- [Lockbox](/game/objects/lockbox/) — companion sector object (not a deployable, but spawned in space).
- [Faction](/game/factions/faction/) — owner of deployed satellites.

---

:::tip[Pattern — deployable object]
Satellite is the canonical *deployable*: deployed by `create_object` (NPCs) or `DeployObjectAtPosition` (player UI, fed by `add_ammo macro=`). The same pattern applies to [Nav beacon](/game/objects/nav-beacon/), [Resource probe](/game/objects/resource-probe/), [Mine](/game/objects/mine/), and lasertowers.
:::

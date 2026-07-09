---
title: Loadout
description: Engine class for equipment configuration. Defined in libraries/loadouts.xml. Generated + applied at ship/station spawn. Thin datatype + key generate/apply actions.
---

A **Loadout** is X4's representation of an **equipment configuration** — which engines, shields, turrets, weapons, software, drones, and crew a ship or station starts with. Loadouts are defined in `libraries/loadouts.xml`, referenced by ID, and generated/applied via dedicated actions.

## Datatype (thin)

The `loadout` engine class has only ONE property:

| Property | Type | Description |
|---|---|---|
| `.wares` | warelist | All equipment wares in the loadout |

The interesting work happens in the **generation + application actions** below.

## Library definition

Loadouts are defined in `libraries/loadouts.xml` with this structure:

```xml
<loadout id="x4ep1_gamestart_trade_playertransporter" 
         macro="ship_tel_m_trans_container_01_a_macro">
    <macros>
        <engine macro="engine_tel_m_travel_01_mk1_macro" path="../con_engine_01" />
        <shield macro="shield_tel_m_standard_01_mk1_macro" path="../con_shield_01" optional="1" />
        <turret macro="turret_tel_m_laser_01_mk1_macro" path="../con_turret_01" optional="1" />
    </macros>
    <software>
        <software ware="software_trademk1" />
    </software>
    <virtualmacros>
        <thruster macro="thruster_gen_m_allround_01_mk1_macro" />
    </virtualmacros>
    <ammunition>
        <ammunition macro="env_deco_nav_beacon_t1_macro" exact="10"/>
    </ammunition>
</loadout>
```

Structure:
- `<loadout>` — root with `id` and `macro` (target ship/station)
- `<macros>` — equipment slots (engine / shield / turret / weapon / etc.) — `optional="1"` allows skip if no slot
- `<software>` — software wares (scanner / dock assist / trade computer / etc.)
- `<virtualmacros>` — equipment generated at runtime (thrusters typically)
- `<ammunition>` — ammo (missile loadouts, drone reserves)

## Common actions

### `<generate_loadout>` — create loadout from sequence

```xml
<generate_loadout 
    sequence="$ConstructionPlan" 
    level="0.9" 
    result="$Loadouts" 
    faction="$Faction"/>
```

Parameters:
- `sequence` — the construction sequence (for stations) or ship reference
- `level` — loadout level (0.0..1.0+), controls "richness"
- `result` — destination variable for generated loadouts
- `faction` — faction context (affects available loadouts)
- `wares` — optional restriction list
- `variation` — variation range
- `quality` — quality level (optional)

The loadout is **procedurally selected** from available loadouts matching the macro + faction + level constraints.

### `<apply_loadout>` — apply generated loadout

```xml
<apply_loadout 
    sequence="$ConstructionPlan" 
    index="$l" 
    loadout="$Loadouts.{$l}" />
```

Parameters:
- `sequence` — construction sequence (or ship)
- `index` — which step in sequence (for staged construction)
- `loadout` — the generated loadout to apply

## Common patterns

### "Generate + apply loadout for a station's construction"

From vanilla `factionsubgoal_buildstation.xml`:

```xml
<generate_loadout 
    sequence="$ConstructionPlan" 
    level="0.9" 
    result="$Loadouts" 
    faction="$Faction"/>

<do_for_each name="$l" in="$Loadouts" 
             counter="$counter">
    <apply_loadout 
        sequence="$ConstructionPlan" 
        index="$counter" 
        loadout="$l" />
</do_for_each>
```

### "Generate ship loadout at specific level"

```xml
<generate_loadout 
    ref="$ship" 
    level="1.0" 
    result="$ShipLoadout" 
    faction="faction.player"/>

<apply_loadout 
    ref="$ship" 
    loadout="$ShipLoadout" />
```

### "Force maximum loadout"

```xml
<generate_loadout level="1.0" variation="0" ... />
```

`variation="0"` removes randomization — always picks the highest-quality compatible loadout.

## Vanilla loadout categories

Vanilla `loadouts.xml` provides:
- Game start loadouts (per starting ship type)
- Faction baseline loadouts (per ship class)
- Story arc specific loadouts (e.g., `story_xenon_gateship` for [Terran Prelude](/vanilla-content/missions/terran-arcs/prelude/))
- Boron Carrier loadouts (Boron Ch8 — `Ch8_BoronCarrierLoadout` referenced in [Boron main story](/vanilla-content/missions/boron-arcs/main/))
- Pirate / Yaki loadout variants
- Race ship loadouts (Timelines + Welfare 1)

## Common gotchas

- ⚠ **Loadout level 0..1 (typically)** — but can exceed 1.0 for special variants. Don't assume bounded.
- ⚠ **`variation="0"` for deterministic loadout** — without it, runs are unrepeatable.
- ⚠ **`optional="1"` slots can be skipped** — your loadout XML must mark optionals correctly or vanilla loadouts may not apply.
- ⚠ **The `loadout` datatype is thin** — most useful info is in the library XML, not the engine class.
- ⚠ **Drones must be loaded via `<units>` in `create_ship`** — `add_units` post-create fails if pilot was set via `assign_control_entity`. See [drone loading gotcha](/wiki/).
- ⚠ **Race ships in Timelines are unlocked via Race ship handover in Timelines Epilogue** — see [Research + Epilogue](/vanilla-content/missions/timelines-arcs/research-epilogue/).

## Sample-grep verification

Confirmed vanilla examples found in:

- `factionlogic_stations.xml` — station loadout generation
- `factionsubgoal_buildstation.xml` — station-build loadout flow
- `finalisestations.xml` — station finalization loadout
- `boarding.xml` — boarding-specific marine loadouts (via crew)

## Common actions

| Action | Purpose |
|---|---|
| `<generate_loadout>` | Generate a loadout matching constraints |
| `<apply_loadout>` | Apply generated loadout to target |
| `<add_units>` (with `<pilot>` in create_ship) | Add drones to ship |
| `<add_ammo>` | Add ammo to ammostorage |
| `<evaluate_ammo_storage>` | Check current ammo state |

## Related

- [Ship](/game/objects/ship/) — primary loadout target
- [Station](/game/objects/station/) — secondary loadout target
- [Defensible](/game/objects/defensible/) — `.loadoutlevel`, `.loadoutvariation` properties
- [Weapon](/game/objects/weapon/) — what loadouts mount
- [Shield generator](/game/objects/shield-generator/) — what loadouts mount
- [Turret](/game/objects/turret/) — what loadouts mount

---

*Loadout is the bridge between data XML (loadouts.xml) and runtime instantiation. Modders write loadout XML for new equipment configurations and reference them via `generate_loadout` + `apply_loadout`. The thin datatype belies its central role in equipment generation.*

---
title: Habitation module
description: Station module that houses workforce. Provides the workforce that drives production-rate bonuses.
---

A **Habitation module** is a station [Module](/game/objects/module/) that houses workforce. Each module has a capacity for a specific race; the station's total workforce drives a multiplier on its [Production modules](/game/objects/production-module/) (`workforce.bonus`).

**Inheritance:** `component → destructible → module → habitationmodule`. The datatype adds 3 workforce-specific accessors.

## Properties

### Habitation-module-specific

| Property | Type | Description |
|---|---|---|
| `.workforce.capacity` | int | Maximum workers this module can house |
| `.workforce.race` | race | Race of the workforce (argon, paranid, teladi, ...) — each habitation is race-specific |
| `.resources` | warelist | All resource wares the workforce consumes (food, water, race-specific) |
| `.resources.{ware}.primary` | bool | Is this a primary resource (always required) |
| `.resources.{ware}.secondary` | bool | Is this a secondary resource (optional / race-specific) |

### Inherited

| Property | Source | Description |
|---|---|---|
| `.haswalkableroom` | module | Walkable interior (true for habitation — NPCs live there) |
| `.hull` | destructible | Damage state |

## Aggregate accessors (station-side)

The actual workforce values are read on the station (or container) level — habitation modules contribute, the station aggregates:

| Station property | Description |
|---|---|
| `.workforce.amount` | Current workers across ALL habitation modules |
| `.workforce.capacity` | Total capacity across ALL habitation modules |
| `.workforce.bonus` | Multiplier applied to production (0..1+) |
| `.workforce.optimal` | Workforce count for peak production |
| `.workforce.min` | Minimum workforce for the station to operate at all |
| `.workforce.{race}.amount` / `.capacity` | Per-race breakdown |

For modder logic about workforce, **work at the station level**, not per habitation module. Per-module accessors are useful only when building or auditing the station composition.

## Common patterns

### "Compute total habitation capacity for planned modules"

Pattern from vanilla `finalisestations.xml:500-518`:

```xml
<do_for_each name="$module" in="$PlannedModules">
    <set_value name="$Capacity"
        operation="add"
        exact="if @$module.workforce.capacity
               then $module.workforce.capacity
               else 0"/>
</do_for_each>
```

### "Find understaffed player stations"

```xml
<do_if value="$PlayerStation != player.headquarters
    and $PlayerStation.products.count
    and $PlayerStation.workforce.capacity
    and $PlayerStation.workforce.amount
        lt $PlayerStation.workforce.capacity">
    <!-- has habitation but isn't full -->
</do_if>
```

Pattern from `story_research_welfare_1.xml:114`. The composite check covers: not HQ, actively producing, has habitation, not full.

### "Mass-spawn NPCs proportional to workforce fill"

Pattern from `npc_instantiation.xml:1714-1719`:

```xml
<set_value name="$WorkforceFill"
    exact="($WorkforceCount)f
        / ($Object.workforce.capacity)f"/>
```

NPC density scales with how filled the station is.

## Common gotchas

- ⚠ **Each habitation module is race-specific.** Argon habitation houses Argons; doesn't accept Paranids. To support multiple races on one station, add multiple habitation types.
- ⚠ **`.workforce.capacity` on a single module vs the station.** Per-module = its own capacity; station = sum. Don't confuse.
- ⚠ **`.workforce.amount` is a runtime read on the station, NOT on the module.** Habitation module level doesn't track current occupancy.
- ⚠ **Habitation has resources (food/water/etc.).** Without supply, workforce drops over time. Read `.resources.list` to know what to deliver.
- ⚠ **`.workforce.bonus` may be null on player stations without workforce setup.** Default to `1.0f` when reading for damage / rate calcs.
- ⚠ **NPC visitor scaling uses `.workforce.capacity`.** Vanilla `npc_instantiation.xml:1714` reads it to decide how many NPC slots to fill. Don't expect "more workforce capacity = more visible bustle" unless you also have NPCs to spawn.

## Architectural context

- **Workforce contribution to production:** Architectural overview *Production cycle math* — workforce bonus multiplier as one factor of three (loadout × workforce × input availability).
- **Race-specific food chains:** Architectural overview *Workforce resources* — per-race consumption (cahoonas vs spaceweed vs medicalsupplies vs nostropoil).
- **NPC density on stations:** Architectural overview *NPC instantiation* — how station NPC counts scale with workforce capacity.

## Related

- [Module](/game/objects/module/) — parent abstraction.
- [Production module](/game/objects/production-module/) — what benefits from workforce.
- [Station](/game/objects/station/) — aggregator of all habitation.
- [Race](/game/factions/race/) — drives food chains.
- [Ware](/game/economy/ware/) — workforce resources (food / water / race-specific).
- [Welfare module](/game/objects/welfare-module/) — sibling, provides workforce morale bonus.

---

:::tip[Pattern — module that contributes to a station-level aggregate]
Habitation module is the canonical example of "per-module values aggregated at station level". You read individual modules during composition/audit; you read the station for runtime queries. Same shape as production modules contributing to `Station.products`.
:::

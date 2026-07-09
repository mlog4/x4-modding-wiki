---
title: Fleet unit
description: A fleet-rebuild placeholder — represents a ship slot in a fleet that has been destroyed but can be reconstructed via the rebuild system.
---

A **Fleet unit** is a fleet-rebuild placeholder — a ship slot in a fleet that has been destroyed (or is scheduled to be replaced) and tracks the rebuild work. The fleet reconstitution system uses these to maintain fleet composition over time.

**Inheritance:** None — `fleetunit` is its own root datatype.

## Properties

| Property | Type | Description |
|---|---|---|
| `.exists` | bool | Fleet unit exists |
| `.object` | controllable | The actual ship for this unit (set after rebuild completes) |
| `.toplevelcommander` | controllable | Fleet commander (the unit belongs to this fleet) |
| `.owner` | faction | Fleet owner |
| `.macro` | macro | Macro to reconstruct |
| `.loadout` | loadout | Loadout to apply on rebuild |
| `.build` | build | Active rebuild task (null if not yet building) |

## Fleet-side accessors

The fleet itself exposes its units via:

| Controllable property | Description |
|---|---|
| `.fleetunit` | The fleet unit this object IS (if it's a rebuild) |
| `.fleetunits` | List of ALL fleet units for the fleet |

So `Ship.fleetunit` tells you the unit this ship is filling; `Fleet.fleetunits` tells you all unit slots.

## Common patterns

### "How many units of the fleet are missing"

```xml
<set_value name="$Missing" exact="0"/>

<do_for_each name="$unit"
    in="$Fleet.fleetunits">
    <do_if value="not @$unit.object">
        <set_value name="$Missing"
            operation="add" exact="1"/>
    </do_if>
</do_for_each>

<write_to_logbook
    text="$Fleet.knownname + ' missing '
        + $Missing + ' units'"/>
```

### "Trigger rebuild for a destroyed unit"

There's no public `<rebuild_fleet_unit>` action — the engine handles this when a `class.ship` with a `.fleetunit` reference is destroyed and `.toplevelcommander` is a fleet commander. The fleet-reconstitution MD framework (`fleet_reconstitution.xml`) drives this:

```xml
<!-- Vanilla framework checks every X seconds: -->
<do_for_each name="$unit" in="$Fleet.fleetunits">
    <do_if value="not @$unit.object
        and not @$unit.build">
        <!-- needs rebuild — find a shipyard via canbuildmacro/canbuildclass -->
        <!-- see Shipyard / Wharf -->
    </do_if>
</do_for_each>
```

## Common gotchas

- ⚠ **`.object` is null until rebuild completes.** A fleet unit can exist without a physical ship. Always null-check.
- ⚠ **`.build` is null until a rebuild starts.** Without an active build, the unit is "lost and waiting for someone to reconstruct it".
- ⚠ **Fleet units only exist for ships destroyed FROM a fleet.** Random destroyed ships don't get a fleet unit. The original ship must have been part of a fleet via `.fleet.commander`.
- ⚠ **`.macro` and `.loadout` are the rebuild target.** Engine reconstitution uses these — don't try to reassign mid-rebuild.
- ⚠ **Fleet reconstitution depends on `Shipyard.canbuildmacro` / `.canbuildclass`.** A fleet unit needing an XL won't rebuild if no shipyard can build that XL class. See [Shipyard](/game/objects/shipyard/).

## Architectural context

- **Fleet reconstitution pipeline:** Architectural overview *Fleet reconstitution* — `fleet_reconstitution.xml` checks fleet composition, identifies missing units, finds compatible shipyards, dispatches builds.
- **Fleet vs subordinate distinction:** Architectural overview *Fleet structure* — fleets have a `.fleet.commander`; subordinates have a `.commander`. Fleet units exist only at the fleet level.

## Related

- [Ship](/game/objects/ship/) — what fills fleet unit slots.
- [Build](/game/behavior/build/) — `.build` accessor.
- [Macro](/lang/data/macro/) — `.macro` to rebuild.
- [Loadout](/game/behavior/loadout/) — `.loadout` to apply.
- [Faction](/game/factions/faction/) — fleet owner.
- [Shipyard](/game/objects/shipyard/) / [Wharf](/game/objects/wharf/) — where rebuilds happen.

---

:::tip[Pattern — slot-with-rebuild placeholder]
Fleet unit is a *slot* in a fleet's composition that survives ship destruction. The reconstitution framework uses this to maintain fleet identity over time. Unique pattern — nothing else in the API uses "slot waiting to be filled" semantics.
:::

---
title: Loadout
description: A ship-equipment template — the named bundle of weapons, shields, engines, and software a ship gets when built. Very thin datatype; almost all interaction is by macro id.
---

A **Loadout** is a ship-equipment template — the named bundle of weapons, shields, engines, and software a ship receives when built or refit. Most modder interaction is via the loadout's string id, not the runtime datatype.

**Inheritance:** None — `loadout` is its own root datatype. The datatype is **minimal** — only one accessor.

## Properties

| Property | Type | Description |
|---|---|---|
| `.wares` | warelist | All equipment wares in the loadout |

That's it. The runtime loadout datatype exposes the ware list; everything else lives in `libraries/loadouts.xml`.

## How loadouts are referenced

Loadouts are referenced by **string id** through various contexts:

- `[Build](/game/behavior/build/)` task: `.loadout` returns the loadout id string
- `[Construction sequence](/game/behavior/construction-sequence/)` entry: `.loadout` returns a loadout datatype value
- Ship macro: backend ID for default loadout
- `<generate_loadout level=>` action: produces a loadout for a ship

## Loadout level / variation / quality

The fuller loadout system uses level / quality / variation accessors on the parent [Defensible](/game/objects/defensible/):

| Defensible property | Description |
|---|---|
| `.loadoutlevel` | 0..1 — overall "tier" of the loadout used |
| `.minloadoutlevel` | Floor (from job definition) |
| `.loadoutvariation` | Variation range used |
| `.loadoutquantity.level` / `.variation` | Quantity overrides |
| `.loadoutquality.level` / `.variation` | Quality overrides |
| `.moduleloadoutlevel` / `.moduleloadoutquantity.X` / `.moduleloadoutquality.X` | Station-module loadout settings |
| `.loadout` | The current loadout (this datatype) |

## Common patterns

### "Read all wares in a build's loadout"

```xml
<do_if value="@$build.loadout">
    <do_for_each name="$ware"
        in="$build.loadout.wares">
        <write_to_logbook
            text="'Equip: ' + $ware.name"/>
    </do_for_each>
</do_if>
```

### "Generate a loadout for a created ship"

```xml
<generate_loadout
    object="$ship"
    level="1"
    faction="faction.argon"/>

<apply_loadout object="$ship"/>
```

Pattern from vanilla ship-generation flows. See [Ship → Actions → Create](/game/objects/ship/#create-a-ship) for the full context.

### "Compute loadout-level differences across player ships"

```xml
<set_value name="$Total" exact="0"/>
<set_value name="$Count" exact="0"/>

<do_for_each name="$ship" in="$PlayerShips">
    <do_if value="@$ship.loadoutlevel">
        <set_value name="$Total"
            operation="add"
            exact="$ship.loadoutlevel"/>
        <set_value name="$Count"
            operation="add" exact="1"/>
    </do_if>
</do_for_each>

<do_if value="$Count gt 0">
    <write_to_logbook
        text="'Avg loadout level: '
            + ($Total / $Count)"/>
</do_if>
```

## Common gotchas

- ⚠ **The loadout datatype is minimal — `.wares` is its only accessor.** All the level / variation / quality state lives on [Defensible](/game/objects/defensible/), not on the loadout itself.
- ⚠ **`.loadout` on Build returns a string id; on construction-plan-entry returns the datatype.** Same name, different types depending on context. Use the property docstring to disambiguate.
- ⚠ **`.loadoutlevel` is 0..1, not 0..100.** Vanilla normalises to fraction. Multiply by 100 for display.
- ⚠ **Loadouts are race-specific by macro.** Argon loadouts don't apply to Terran ships. Engine handles this during `generate_loadout` — modders rarely override.
- ⚠ **`.minloadoutlevel` comes from job definitions.** Job ships have a floor on how degraded their loadout can be. Player ships are unaffected.

## Related

- [Build](/game/behavior/build/) — `.loadout` accessor.
- [Construction sequence](/game/behavior/construction-sequence/) — entry-level `.loadout`.
- [Defensible](/game/objects/defensible/) — where loadoutlevel / quality / variation live.
- [Ship](/game/objects/ship/) — what loadouts equip.
- [Ware](/game/economy/ware/) — what's in the loadout.

---

:::tip[Pattern — thin pointer-into-static-data datatype]
Loadout is a *thin reference* — its datatype exposes nothing useful beyond `.wares`. All loadout intelligence lives in `libraries/loadouts.xml` (static data) or on the parent Defensible (level/quality state).
:::

---
title: Pier
description: Station module providing dock slots for capital ships. The 'numpierdocks' accessor controls how many L/XL ships can dock simultaneously.
---

A **Pier** is a station [Module](/game/objects/module/) that provides docking slots for capital ships ([Ship](/game/objects/ship/) class L and XL). Stations without piers can host only S/M ships at their built-in dockingbays; piers are how shipyards / trade stations / wharfs accommodate fleet visits.

**Inheritance:** `component → destructible → module → pier`. The datatype adds one accessor.

## Properties

### Pier-specific

| Property | Type | Description |
|---|---|---|
| `.numpierdocks` | int | Number of capital-ship dock locations on this pier |

### Inherited

| Property | Source | Description |
|---|---|---|
| `.numdocks.{docksize}` | module | Generic per-size dock counts (parallel mechanism) |
| `.haswalkableroom` | module | Walkable interior |
| `.hull` | destructible | Damage state |

## Common patterns

### "Count total pier dock locations on a station"

Pattern from vanilla `finalisestations.xml:759-792`:

```xml
<set_value name="$Total" exact="0"/>

<do_for_each name="$mod" in="$Station.modules">
    <do_if value="$mod.isclass.pier">
        <set_value name="$Total"
            operation="add"
            exact="$mod.numpierdocks"/>
    </do_if>
</do_for_each>

<write_to_logbook
    text="$Station.knownname + ' has '
        + $Total + ' pier dock slots'"/>
```

Vanilla `finalisestations.xml` aggregates `numpierdocks` across all pier modules during station finalisation to know the total trade-location count.

### "Filter buildable docking modules (pier OR dock area)"

```xml
<do_if value="$macro.isclass.dockarea
    or $macro.isclass.pier">
    <!-- a docking-providing module -->
</do_if>
```

Pattern from vanilla `x4ep1_mentor_subscription.xml:9162`.

## Common gotchas

- ⚠ **`numpierdocks` is the per-module count, not station total.** Sum across all piers to get station capacity.
- ⚠ **Pier docks are for capital ships (L/XL).** S/M ships use built-in dockingbays or [Dockarea](/game/objects/dockarea/) modules. Don't confuse the two.
- ⚠ **A station with zero piers cannot host capitals.** Capital ships will fail to dock; player will see "no suitable dock" error. Always check before sending capitals.
- ⚠ **Pier dock counts are static per macro.** Modders adding new pier macros set `numpierdocks` in the macro XML; it doesn't change at runtime.
- ⚠ **Vanilla also has `.numdocks.{docksize}` on module.** This parallel mechanism counts docks by size category. For pier-specific logic prefer `numpierdocks`; for generic per-size counts use `.numdocks.{docksize}`.

## Related

- [Module](/game/objects/module/) — parent abstraction.
- [Station](/game/objects/station/) — host; aggregates pier counts during finalisation.
- [Dockarea](/game/objects/dockarea/) — sibling, for S/M ship docking.
- [Ship](/game/objects/ship/) — capital ships need piers to dock.
- [Build module](/game/objects/build-module/) — has its own dock mechanism for construction vessels.

---

:::tip[Pattern — module with simple per-instance count]
Pier is the canonical example of "module that contributes a discrete count". Same shape as habitation contributing `workforce.capacity` — but cleaner because pier counts are integer slots rather than scaling values.
:::

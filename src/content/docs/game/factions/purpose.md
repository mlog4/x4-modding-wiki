---
title: Purpose
description: A ship/object's intended role — fight, trade, mine, build, salvage. Cross-cutting categorisation used by find_* filters.
---

A **Purpose** is an object's intended role — orthogonal to its size class. A `class.ship_m` ship can be `purpose.fight`, `purpose.trade`, `purpose.mine`, etc. Used heavily by `find_ship_by_true_owner` and similar to filter "what kind of ship am I looking for".

**Inheritance:** `dbdata → purpose`. Has a parent-child hierarchy.

## Properties

| Property | Type | Description |
|---|---|---|
| `.name` | string | Display name |
| `.rawname` | string | Raw text entry reference |
| `.description` | string | Description |
| `.parent` | purpose | Parent purpose (for the purpose hierarchy) |

## Vanilla purposes

Verified from vanilla MD/aiscript usage (see [Roadmap](/about/roadmap/)):

| Purpose | What it covers |
|---|---|
| `purpose.fight` | Combat ships — fighters, destroyers, corvettes |
| `purpose.trade` | Trade ships — transports, freighters |
| `purpose.mine` | Mining ships — drills, scoopers |
| `purpose.build` | Construction vessels |
| `purpose.rig` | Tugs |
| `purpose.salvage` | Salvage vessels |
| `purpose.auxiliary` | Resupplier ships |

## Common patterns

### "Find ships by purpose"

```xml
<find_ship_by_true_owner name="$Miners"
    space="$Sector"
    faction="faction.argon"
    primarypurpose="purpose.mine"
    multiple="true"/>
```

`primarypurpose=` is a dedicated `find_ship_by_true_owner` attribute — much more efficient than iterating ships and reading `.primarypurpose`.

### "Read a ship's purpose"

```xml
<do_if value="$ship.primarypurpose == purpose.fight">
    <!-- a combat ship -->
</do_if>
```

`.primarypurpose` is on [Ship](/game/objects/ship/).

### "Walk the purpose hierarchy"

```xml
<set_value name="$root" exact="$purpose"/>

<do_while value="@$root.parent">
    <set_value name="$root" exact="$root.parent"/>
</do_while>

<!-- $root is the top-level purpose -->
```

Most vanilla purposes are top-level (`.parent` is null) — the hierarchy is mostly flat.

## Common gotchas

- ⚠ **Purpose is independent of size class.** A `purpose.fight` ship can be xs, s, m, l, or xl. Don't conflate.
- ⚠ **`.parent` is usually null.** The hierarchy is mostly flat — most purposes are top-level. Don't write code that assumes a parent always exists.
- ⚠ **`find_ship primarypurpose=` is the canonical filter.** Faster than iterating and reading `.primarypurpose`. Use it whenever possible.
- ⚠ **`tag.solid` filter is broken in X4 9.x.** Use `primarypurpose="purpose.mine"` for "find mining ships" — see [Ship](/game/objects/ship/) gotchas.

## Related

- [Ship](/game/objects/ship/) — `.primarypurpose` accessor; `class.ship_*` for size.
- [Faction](/game/factions/faction/) — owner; faction logic uses purpose to allocate jobs.
- Job system — driven by macro purpose tags.

---

:::tip[Pattern — orthogonal categorisation enum]
Purpose is the canonical *orthogonal-to-size* enum. Size is "how big"; purpose is "what for". Combine for narrow filters: `class.ship_m + purpose.mine` = M-class miner.
:::

---
title: Ship size classes
description: The five ship size classes (xs/s/m/l/xl) and how to filter ships by them. No dedicated datatypes — pure class enum.
---

X4 ships come in **5 size classes** — `class.ship_xs` through `class.ship_xl`. These are not separate datatypes; all five share the [Ship](/game/objects/ship/) datatype. The size class is a *class label* used by `find_*` filters and game mechanics (boardable vs not, fits-in-dock-size, etc.).

This page collects size-specific guidance that doesn't belong on the parent [Ship](/game/objects/ship/) page.

## The five sizes

| Class | Typical examples | Boardable | Common purposes |
|---|---|---|---|
| `ship_xs` | Drones, mining drones, combat drones | No | Auxiliary (carried by larger ships) |
| `ship_s` | Fighters, scouts, interceptors | Via signalleak | Fight, scout |
| `ship_m` | Corvettes, miners, transports | Via signalleak | Fight, mine, trade, salvage |
| `ship_l` | Destroyers, freighters, builders | Via marines | Fight, trade, build, salvage |
| `ship_xl` | Carriers, resupplier, builders | Via marines | Fight, auxiliary, build |

## Filtering by class

```xml
<find_ship_by_true_owner name="$DestroyersAndCarriers"
    space="player.galaxy"
    faction="$Faction"
    class="[class.ship_l, class.ship_xl]"
    multiple="true"/>
```

`class=` accepts a single class OR a list of classes. Multi-class filter matches any.

### Single-size

```xml
<find_ship_by_true_owner name="$Miners"
    space="$Sector"
    faction="$Faction"
    class="class.ship_m"
    primarypurpose="purpose.mine"
    multiple="true"/>
```

Combine `class=` and `primarypurpose=` for narrow matches ("M-class miners").

## Reading a ship's size

```xml
<do_if value="$ship.class == class.ship_l">
    <!-- a destroyer / large ship -->
</do_if>

<do_if value="$ship.isclass.[class.ship_l, class.ship_xl]">
    <!-- a capital ship (L or XL) -->
</do_if>
```

`$ship.iscapitalship` is a vanilla shortcut for "ship_l OR ship_xl":

```xml
<do_if value="$ship.iscapitalship">
    <!-- equivalent to the .isclass.[ship_l, ship_xl] check -->
</do_if>
```

Use `.iscapitalship` when you want clarity; use the list form when you need other size combinations.

## Boarding capability

| Size | Boardable by marines? | Notes |
|---|---|---|
| `ship_xs` | No | Drones are not boardable |
| `ship_s` | Via signal leak | Marines insert through signal leak instead of pods |
| `ship_m` | Via signal leak | Same as ship_s |
| `ship_l` | Via marines + pods | Standard boarding |
| `ship_xl` | Via marines + pods | Standard boarding (high resistance) |

See [Boarding](/overviews/boarding/) for the full lifecycle.

## Dock-size compatibility

Ships dock at docking bays of matching size:

| Ship size | Required `docksize` tag |
|---|---|
| `ship_xs` | `tag.dock_xs` |
| `ship_s` | `tag.dock_s` |
| `ship_m` | `tag.dock_m` |
| `ship_l` | `tag.dock_l` or `pier_l` |
| `ship_xl` | `tag.dock_xl` or `pier_xl` |

L and XL ships dock at piers ([Pier](/game/objects/pier/)) rather than ordinary dock areas.

```xml
<find_dockingbay name="$dock"
    object="$Station"
    checkoperational="true"
    docksize="tag.dock_l"
    multiple="false"/>
```

`docksize=` accepts a tag value. Engine matches ship size to compatible dock.

## Build cost / time scaling

Vanilla scales build cost and time across sizes:

| Class | Relative build cost | Relative build time |
|---|---|---|
| `ship_xs` | 1× | 1× |
| `ship_s` | ~10× | ~3× |
| `ship_m` | ~50× | ~10× |
| `ship_l` | ~500× | ~30× |
| `ship_xl` | ~5000× | ~120× |

These are approximate — actual numbers depend on the specific ship macro. Modders adding new ships should follow vanilla's scale to avoid economic imbalance.

## Common gotchas

- ⚠ **`class.ship` matches ALL sizes.** `$obj.isclass.ship` is true for all of xs/s/m/l/xl. For specific size, use `.isclass.ship_l` etc.
- ⚠ **`ship_xs` (drones) are NOT free agents.** They're carried inside larger ships. `find_object` may not return them at top-level; query the carrier's `.units`.
- ⚠ **Build cost across sizes is steep.** A ship_xl costs 5000× a ship_xs. Mods adjusting costs should consider economic ripple effects.
- ⚠ **Boardable threshold is at ship_l.** Don't expect a player to board your custom ship_m via marines — they'll need a signal leak.
- ⚠ **Lasertower is class.ship despite looking deployable.** See [Lasertower](/game/objects/lasertower/).

## Cross-references

- [Ship](/game/objects/ship/) — parent datatype (all sizes share)
- [Spacesuit](/game/objects/spacesuit/) — special ship_xs subtype
- [Lasertower](/game/objects/lasertower/) — class.ship variant
- [Pier](/game/objects/pier/) — L/XL docking
- [Dockingbay](/game/objects/room/) — dock structure
- [Boarding](/overviews/boarding/) — size-dependent boarding mechanic

---

:::tip[Pattern — orthogonal class enum]
Ship size classes are **the size dimension** orthogonal to purpose (fight/trade/mine). Use `class.ship_X` for size and `purpose.X` for role — combine via `find_ship_by_true_owner class="..." primarypurpose="..."` for narrow filters.
:::

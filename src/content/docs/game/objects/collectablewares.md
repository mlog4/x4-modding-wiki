---
title: Collectable wares
description: Floating ware drop — dropped cargo containers or asteroid shards. The most common collectable type. Has money, unbundle flag, and dropped-container distinction.
---

A **Collectable wares** is a floating ware pickup — dropped cargo containers from destroyed transports, asteroid shards from mining, or scattered loot from raids. The most common collectable subtype.

**Inheritance:** `component → destructible → object → drop → collectable → collectablewares`.

## Properties

### Collectable-wares-specific

| Property | Type | Description |
|---|---|---|
| `.money` | money | Contained money (drops can carry credits too) |
| `.unbundle` | bool | Crate is flagged for converting its wares into ammo/units on pickup |
| `.isdroppedcontainer` | bool | True if this is a dropped container (not an asteroid shard or other natural collectable) |

### Useful inherited

| Property | Source | Description |
|---|---|---|
| `.cargo` | container (indirect) | Wares inside — see container chain |
| `.sector` / `.position` | object | Location |
| `.macro` | component | Macro variant |

## Common patterns

### "Distinguish dropped containers from asteroid shards"

Pattern from vanilla `notifications.xml:335, 402`:

```xml
<do_if value="event.param3.isclass.collectablewares
    and event.param3.isdroppedcontainer">
    <!-- dropped container — credit to source faction -->
</do_if>
```

Vanilla uses this to attribute ware drops to the destroyed ship's owner; asteroid shards are ownerless.

### "Find asteroid shards (mining output) in a sector"

Pattern from vanilla `scenario_advanced.xml:1565-1570`:

```xml
<find_object
    groupname="$asteroidshards"
    class="[class.collectablewares]"
    space="$ResourceSector"
    multiple="true"
    append="true"/>

<do_for_each name="$shard" in="$asteroidshards">
    <do_if value="not $shard.isdroppedcontainer">
        <!-- this is an asteroid shard, not a dropped container -->
    </do_if>
</do_for_each>
```

### "Canonical multi-class loot filter"

```xml
<do_if value="$ItemHolder.isclass.[class.lockbox,
    class.collectablewares, class.crate]">
    <!-- any ware-bearing loot the player can pick up -->
</do_if>
```

Pattern from `gm_bringitems.xml:391, 1811, 1827`. Use this when your mod accepts loot from any kind of holder.

## Events

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Picked up | Standard |

## Common gotchas

- ⚠ **`.isdroppedcontainer` vs `not .isdroppedcontainer`.** The first identifies player-attributed loot (someone's container was destroyed). The second identifies natural / unattributed (asteroid mining output). Mods that handle ownership / faction reputation need this distinction.
- ⚠ **`.unbundle=true` triggers ware → ammo/unit conversion on pickup.** Most ware-pickups stay as wares; this special flag converts contents to ammo or units automatically. Read before assuming "wares in = wares out".
- ⚠ **`.money` exists on this datatype.** A ware collectable can carry credits directly, not just wares. Sum both for total value.
- ⚠ **`class.collectablewares` is the loot-filter pivot.** Vanilla's "find any pickup-able ware-bearing object" idiom always includes this class.
- ⚠ **Asteroid shards don't have owners.** `.owner` returns `faction.ownerless` for mining shards. Don't expect attribution.

## Related

- [Collectable](/game/objects/collectable/) — parent.
- [Lockbox](/game/objects/lockbox/) — sibling loot container (different mechanic — shootable locks).
- [Crate](/game/objects/crate/) — sibling interior container (dock-slot based).
- [Asteroid](/game/objects/asteroid/) — what mining-derived shards come from.
- [Ware](/game/economy/ware/) — what's inside.
- [Ship](/game/objects/ship/) — what dropped them (for `.isdroppedcontainer=true`).

---

:::tip[Pattern — pickup with attribution flag]
Collectablewares is the canonical loot type with *source attribution* (`isdroppedcontainer`). This separates "player attacked someone and got their cargo" from "player mined an asteroid". Use the flag to control faction reputation hits and pickup logic.
:::

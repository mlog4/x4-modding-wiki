---
title: Connection module
description: Structural station module that links other modules. Most are simple connectors; some are venture-platform-specific.
---

A **Connection module** is a structural [Module](/game/objects/module/) that links other modules together — the connector pieces in a station's layout. Most NPC stations have many; the player adds them implicitly when picking adjacent module slots during construction.

**Inheritance:** `component → destructible → module → connectionmodule`. Datatype is thin — one venture-specific flag.

## Properties

### Connection-module-specific

| Property | Type | Description |
|---|---|---|
| `.isventuremodule` | bool | True if this connection module is for use with the Ventures DLC platforms |

### Inherited from module

| Property | Source | Description |
|---|---|---|
| `.numdocks.{docksize}` | module | Connected docks (rarely on connectors; mostly zero) |
| `.haswalkableroom` | module | Walkable interior |

## Common patterns

### "Detect player building a connection"

```xml
<check_value value="event.param3.isclass.connectionmodule"/>
```

Pattern from vanilla `tutorial_stations_building.xml:534`.

### "Filter out venture connectors when counting normal connections"

```xml
<do_if value="$macro.isclass.connectionmodule
    and not $macro.isventuremodule">
    <!-- normal connection module -->
</do_if>
```

Pattern from `x4ep1_mentor_subscription.xml:9162-9178`.

## Common gotchas

- ⚠ **Connection modules are usually invisible to gameplay logic.** They affect station shape and module-adjacency rules but not production / trade. Most mods can safely ignore them.
- ⚠ **`.isventuremodule` is the only discriminator.** No "size" or "type" subclassing — vanilla treats all connection modules uniformly except for the venture flag.
- ⚠ **Same `not .isventuremodule` filter applies to other module types.** Dock areas have the same flag (see [Build module](/game/objects/build-module/) and `x4ep1_mentor_subscription.xml:9162`).

## Related

- [Module](/game/objects/module/) — parent abstraction.
- [Pier](/game/objects/pier/) — also "linkage" but for ship docking.
- [Venture platform](/game/objects/venture-platform/) — uses venture-flagged connection modules.
- [Station](/game/objects/station/) — host.

---

:::tip[Pattern — structural module]
Connection module is a "filler" module — necessary for station shape but invisible to economy logic. Same role as adsigns and lighting modules.
:::

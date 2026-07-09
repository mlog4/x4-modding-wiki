---
title: Universe
description: Root galaxy container. Single instance per game (player.galaxy). Holds clusters / sectors / zones / all objects. Stub page.
---

**Universe** is the root container of the X4 galaxy. There is **one** universe per save — referenced as `player.galaxy` from MD/aiscript.

## Hierarchy

```
Universe (player.galaxy)
└── Cluster (cluster.*)
    └── Sector (cluster.*.sector*)
        └── Zone (sector.*.zone*)
            └── Component (ships, stations, items, etc.)
```

## Common access

```xml
<find_sector name="$X" space="player.galaxy" macro="..."/>
<find_object name="$Y" space="player.galaxy" macro="..."/>
```

## Macro check (universe variant)

Most arcs check the universe macro for main-galaxy filtering:

```xml
<check_value value="player.galaxy.macro == macro.xu_ep2_universe_macro"/>
```

The `macro.xu_ep2_universe_macro` is the main galaxy (Pirate DLC). Scenario games (Timelines) use different universe macros.

## Related

- [Cluster](/game/world/cluster/) — top-level subdivision
- [Galaxy](/game/world/galaxy/) — same as universe in most contexts
- [Sector](/game/world/sector/) — main location unit

---

*Stub page — full universe reference coming.*

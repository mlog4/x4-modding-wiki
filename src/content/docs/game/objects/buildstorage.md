---
title: Build storage
description: A station's construction-site materials container. Holds raw materials during construction; tied to a base station; can be scheduled for deconstruction.
---

A **Build storage** is the construction-site materials container for a [Station](/game/objects/station/) — it holds raw materials (hull parts, claytronics, etc.) that feed into ongoing builds. Every station with active construction has a build storage; it's accessed via `Station.buildstorage`.

**Inheritance:** `component → destructible → object → container → buildstorage`.

## Properties

### Build-storage-specific

| Property | Type | Description |
|---|---|---|
| `.base` | station | The station this build storage belongs to |
| `.isscheduledfordeconstruction` | bool | The base station is scheduled to be fully deconstructed |

### Inherited from container

Build storage inherits the full container API — `.cargo`, `.cargo.{ware}.target`, `.buyprices`, `.sellprices`, `.money`, `.workforce.X` (rare on storage), `.builds.queued`, `.builds.inprogress`, etc. The cargo is what's filled with build resources.

### Useful inherited

| Property | Source | Description |
|---|---|---|
| `.sector` / `.position` | object | Location (same as base station) |
| `.owner` | object | Owner faction (same as base station) |
| `.cargo` | container | Build resources currently stored |
| `.builds.queued` / `.builds.inprogress` | container | Active build tasks |

## Common patterns

### "Add resources to a station's build storage"

```xml
<add_cargo
    object="$Station.buildstorage"
    ware="ware.hullparts"
    exact="1000"/>
```

Pattern from `add_build_to_expand_station` workflows — the build storage is where resources arrive.

### "Check if construction is scheduled for completion"

```xml
<do_for_each name="$mod" in="$Station.modules">
    <do_if value="$mod.isclass.buildmodule
        and $mod.iswaitingforresources">
        <write_to_logbook
            text="'Build module starved at '
                + $Station.knownname"/>
    </do_if>
</do_for_each>
```

### "Use build storage as the build target"

Vanilla `factionsubgoal_buildstation.xml:211`, `finalisestations.xml:359`:

```xml
<add_build_to_expand_station
    object="$Station.buildstorage"
    buildobject="$Station"
    constructionplan="$ConstructionPlan"
    result="$BuildID"/>
```

The first param is the build storage (where resources go); `buildobject` is what gets expanded.

### "Detect scheduled deconstruction"

```xml
<do_if value="$Station.buildstorage.isscheduledfordeconstruction">
    <write_to_logbook
        text="$Station.knownname
            + ' is being deconstructed'"/>
</do_if>
```

`.isscheduledfordeconstruction` lets you know the player or AI has flagged the entire station for removal — different from "no active builds".

## Common gotchas

- ⚠ **Build storage is a container.** Add/remove cargo using normal container actions. `add_cargo object="$Station.buildstorage" ware="..." exact="..."`.
- ⚠ **`.base` is the owning station.** Use this to walk back from a build storage to the station it serves.
- ⚠ **Build storage has its own `.cargo` distinct from the station's main cargo.** Don't confuse — `Station.cargo` is the operational cargo (wares produced / sold); `Station.buildstorage.cargo` is construction materials.
- ⚠ **`.isscheduledfordeconstruction` is a one-way flag.** Once set, the station is on track for removal. Vanilla doesn't expose "cancel deconstruction" as a clean MD action.
- ⚠ **Build storage may exist without active builds.** A station that completed construction still has a build storage object (mostly empty cargo). Don't assume "build storage exists = currently building".
- ⚠ **Player station deconstruction is a multi-step flow.** The player schedules it; modules are removed in sequence; the station eventually destroys. Mid-flow, `.isscheduledfordeconstruction=true` but the station still exists.

## Architectural context

- **Station construction lifecycle:** Architectural overview *Construction sequence* — how build storage receives materials and feeds them into builds.
- **Resource delivery missions:** Architectural overview *Construction resource trades* — NPC trade ships deliver to build storages of mid-construction stations.
- **Deconstruction flow:** Architectural overview *Station deconstruction* — multi-stage process, `.isscheduledfordeconstruction` flag, module-by-module removal.

## Related

- [Station](/game/objects/station/) — `.buildstorage` accessor; `.base` points back.
- [Build module](/game/objects/build-module/) — consumes resources from the build storage.
- [Container](/game/objects/container/) — parent type with cargo/trade/price API.
- [Construction sequence](/game/behavior/construction-sequence/) — sequence of modules to build using these resources.
- [Build](/game/behavior/build/) — tasks that consume the resources.

---

:::tip[Pattern — purpose-specific container]
Build storage is the canonical *purpose-specific container* — a container subtype dedicated to one workflow (construction). Same shape as a hypothetical "ammostorage container" if it were exposed as a datatype.
:::

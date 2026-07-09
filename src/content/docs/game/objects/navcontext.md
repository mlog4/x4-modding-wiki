---
title: Nav context
description: A 'dynamic interior' container — a runtime-spawned set of rooms attached to a station or ship, used for mission-actor placement and special story rooms.
---

A **Nav context** is a runtime-spawned interior — a group of rooms attached to a [Station](/game/objects/station/) or [Ship](/game/objects/ship/), typically created by a mission cue to host story-specific NPCs (the Manager's Office, a kidnapper's hideout, a mad scientist's lab). Unlike normal station rooms (defined in macros and present from game start), nav contexts come and go with mission cues.

The vanilla "dynamic interior" UI / `gmc_dynamic.xml` framework is the canonical user of this datatype.

**Inheritance:** `component → destructible → navcontext`. Extends `destructible` directly, **not** `object`.

## Properties

### Navcontext-specific

| Property | Type | Description |
|---|---|---|
| `.ispersistent` | bool | Persistent — interior exists even in low attentions (player far away) |
| `.isprivate` | bool | Private — NPC slots only findable by directly querying contained rooms |
| `.rooms` | list | All [Rooms](/game/objects/room/) inside this nav context |

### Inherited

| Property | Source | Description |
|---|---|---|
| `.hull` / `.hullpercentage` | destructible | Damage state — usually invincible in vanilla |
| `.parent` | component | Containing station / ship |

## Where nav contexts come from

Nav contexts are spawned via dedicated engine actions (not standard `<create_object>`). The vanilla `gmc_dynamic.xml` framework picks a station with `.canhavedynamicinterior=true`, then attaches an interior:

```xml
<find_station
    name="$SelectedStation"
    space="$StationSpace"
    owner="$StationOwner"
    canhavedynamicinterior="true"
    tradestation="true"/>
```

Pattern from `gmc_madscientist.xml:278-287`. The `canhavedynamicinterior=` filter on `find_station` is **a dedicated attribute** — use it to find suitable hosts before spawning your interior.

## Container relationship

The `canhavedynamicinterior` accessor lives on the [Controllable](/game/objects/controllable/) (and inherited by station, ship). It tells you which objects *can* host a dynamic interior — typically those with a window connection (even for interiors without windows):

```xml
<do_if value="$InteriorObject.canhavedynamicinterior">
    <!-- can attach a nav context here -->
</do_if>
```

Pattern from `gmc_dynamic.xml:1387, 1465`.

## Cleanup events

When a mission ends, vanilla destroys the dynamic interior via `event_object_destroyed` with `method="killmethod.removed"`:

```xml
<event_object_destroyed
    object="$managersoffice.dynamicinterior"
    method="killmethod.removed"/>
```

Pattern from `diplomacy.xml:1450`. The `killmethod.removed` distinguishes "interior was cleanly cleaned up" from "interior was destroyed in combat" (combat destruction rare).

## Accessing the nav context

### From a contained room

```xml
$Room.dynamicinterior
```

Returns the nav context the room is part of (null if normal room).

### From an entity

```xml
<do_if value="$Intro_Agent.hascontext.{$managersoffice.dynamicinterior}">
    <!-- agent is inside this dynamic interior -->
</do_if>
```

Pattern from `diplomacy.xml:1454`.

### From cinematic camera matching

```xml
<match_parent class="class.navcontext"/>
```

Pattern from `cinematiccamera.xml:1207`. Used by cinematic-camera cues to detect when the framed subject is inside any nav context.

## Common patterns

### "Find rooms suitable for crate placement, dynamic-interior-aware"

Vanilla `gm_bringitems.xml:220` comment documents the type of objects accepted:

> room / walkablemodule / defensible / dynamicinterior component in which to find a crate slot

Nav contexts are treated as containers for crate slots / NPC slots / mission-actor placement.

### "Spawn a manager's office on a trade station"

```xml
<find_station
    name="$Host"
    space="$Sector"
    owner="faction.argon"
    tradestation="true"
    canhavedynamicinterior="true"/>

<do_if value="@$Host">
    <!-- ... mission-specific create_dynamic_interior call ... -->
</do_if>
```

The actual create-interior action is engine-side (`<create_dynamic_interior>`-style); modders typically piggyback on `gmc_dynamic.xml` rather than rolling their own.

## Events

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Nav context destroyed | Use `method="killmethod.removed"` for clean-up; standard destruction is rare |

There is no `event_navcontext_X` family. Standard destructible events apply.

## Common gotchas

- ⚠ **Nav context extends `destructible`, NOT `object`.** No `.sector` directly — read `.parent.sector`.
- ⚠ **`canhavedynamicinterior` is on the HOST controllable, not on the nav context.** Filter `find_station` with the attribute; the nav context itself doesn't expose it.
- ⚠ **Private nav contexts hide their NPC slots from `find_npc_slots` queries.** `isprivate=true` makes contained slots invisible to global finds. You must directly query the contained rooms.
- ⚠ **Persistence affects attention.** A non-persistent interior may vanish when the player is far away (engine offload). For story-critical hosts, set `.ispersistent=true` at create time.
- ⚠ **Vanilla `gmc_dynamic.xml` is the canonical user.** If your mod adds dynamic interior content, study `gmc_dynamic`, `gmc_madscientist`, `diplomacy.xml` (Manager's Office) for patterns. Don't roll your own framework — too many engine integration points.
- ⚠ **Crate slots in nav contexts work the same as in normal rooms.** `find_crate_slot` accepts nav contexts as the `object` parameter. See [Crate](/game/objects/crate/).
- ⚠ **`killmethod.removed` is the cleanup convention.** When destroying a nav context to end a mission, use this killmethod — vanilla event handlers distinguish it from combat-destroy.

## Examples

### Example 1: Detect when an NPC is inside a specific dynamic interior

```xml
<do_if value="@$MissionActor
    and $MissionActor.hascontext.{$MyDynamicInterior}">
    <write_to_logbook
        text="'Mission actor inside dynamic interior'"/>
</do_if>
```

Pattern from `diplomacy.xml:1454`.

### Example 2: Find a trade-station host for a new interior

```xml
<find_station
    name="$Host"
    space="player.galaxy"
    owner="faction.argon"
    tradestation="true"
    canhavedynamicinterior="true"
    multiple="false"/>

<do_if value="@$Host">
    <write_to_logbook
        text="'Dynamic interior host: ' + $Host.knownname"/>
</do_if>
```

Pattern from `gmc_madscientist.xml:281-287`.

### Example 3: Clean up a mission interior

```xml
<event_object_destroyed
    object="$MyInterior"
    method="killmethod.removed"/>
```

Note: this is the **event declaration** (in `<conditions>`), not an action — used to listen for the cleanup. To actually trigger the cleanup, signal the engine via the appropriate mission-cue path.

## Architectural context

- **Dynamic interior framework:** Architectural overview *Dynamic interiors* — `gmc_dynamic.xml`, attachment lifecycle, persistence vs attention, manager's office model.
- **Mission-actor placement:** Architectural overview *Mission actors* — how NPCs are placed inside nav contexts.
- **Crate / NPC slot lookup:** Architectural overview *Slot lookup* — `find_crate_slot` and `find_npc_slot` accept nav contexts as parents.

## Related

- [Room](/game/objects/room/) — contained rooms; `Room.dynamicinterior` accessor.
- [Station](/game/objects/station/) — common host (via `canhavedynamicinterior`).
- [Ship](/game/objects/ship/) — can also host (rare).
- [NPC](/game/characters/npc/) — populates nav contexts.
- [Crate](/game/objects/crate/) — uses nav contexts as crate-slot parents.

---

:::tip[Pattern — runtime-spawned interior with dedicated framework]
Nav context is the *only* runtime-spawned container datatype in the API — everything else (stations, ships, rooms) is created via macros at known times. Nav contexts spawn during gameplay via mission cues, persist (or not) based on attention, and clean up via `killmethod.removed`. The pattern is unique to story / mission content.
:::

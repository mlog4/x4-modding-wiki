---
title: Room
description: A walkable interior space inside a ship or station. Parent of dockingbay (and via walkablemodule, dockarea). Holds NPCs, control positions, and chairs.
---

A **Room** is a walkable interior space inside a [Ship](/game/objects/ship/) or [Station](/game/objects/station/). It hosts NPCs, control positions (helm, gunner, navigation), and chairs. Rooms form the navigable mesh the player walks across when leaving their ship to explore stations.

**Inheritance:** `component → room`. Note: room extends `component` directly (not destructible) — rooms have no hull state, they exist as long as their containing module exists.

**Subtypes:**

| Subtype | Datatype | Purpose |
|---|---|---|
| **dockingbay** | `dockingbay` (extends `room`) | Where ships dock — has assigned ship, dock state, launch position |
| **walkablemodule** | `walkablemodule` (extends `module`) | Module that hosts walkable rooms — has entry/exit positions |
| **dockarea** | `dockarea` (extends `walkablemodule`) | Walkable module specifically for docking (a station's "dock floor") |

Note that `walkablemodule` and `dockarea` extend the *module* chain rather than room — but they contain rooms. This page focuses on `room` itself with brief coverage of its dock-related siblings.

## Properties

### Room-specific

#### State

| Property | Type | Description |
|---|---|---|
| `.type` | roomtype | Room type enum |
| `.islocked` | bool | Room is locked (player can't enter) |
| `.isgrouplocked.{grouptag}` | bool | Specified group tag locked in this room |
| `.isprivate` | bool | Room is private (NPC slots only found via direct query) |
| `.iswalkable` | bool | Walkable in principle (false for in-space dockingbays) |
| `.iscurrentlywalkable` | bool | Currently walkable (false during room animations / navmesh loading) |
| `.haswalkableroom` | bool | This room OR any contained room is walkable |

#### Containment

| Property | Type | Description |
|---|---|---|
| `.dockarea` | dockarea | The dock area this room is part of |
| `.buildmodule` | buildmodule | The build module this room is part of |
| `.walkablemodule` | walkablemodule | The walkable module this room is part of |
| `.dynamicinterior` | navcontext | Dynamic interior containing this room |

#### NPCs

| Property | Type | Description |
|---|---|---|
| `.actors` | list | All NPCs currently in the room |
| `.slotactor.{slot}` | entity | NPC reserved for the specified slot |
| `.waypointactors.{slot}` | list | NPCs moving toward the slot |
| `.freemissionactorslot` | bool | Has a free mission-actor slot |
| `.slotcontext` | component | What contains the NPC slots (for virtual rooms = controllable; else the room) |

#### Chairs

| Property | Type | Description |
|---|---|---|
| `.ischairslot.{slot}` | bool | Slot is a chair-related NPC position |
| `.chairapproachslot.{slot}` | componentslot | Approach slot for the chair |
| `.chairbaseslot.{slot}` | componentslot | Base/anchor chair slot |
| `.chairroomslot.{slot}` | componentslot | Room slot for chair-NPC reservation |

#### Control positions

| Property | Type | Description |
|---|---|---|
| `.controlposition.{controlposition}.exists` | bool | Specified control position exists in this room |
| `.controlposition.{controlposition}.roomslot` | componentslot | Slot for entities working at this position |
| `.controlposition.{controlposition}.entity` | entity | Entity currently at the position |
| `.controlpositions.list` | list | All control positions in the room |
| `.hascontrolpanel.{controlpaneltype}` | bool | Room has a control panel of the type |

## Dockingbay subtype

Dockingbay is the most modder-relevant room subtype — 30 own properties on top of room's.

### Identity and state

| Property | Type | Description |
|---|---|---|
| `.assignedship` | ship | Ship currently assigned to dock here |
| `.pier` | pier | Pier module containing this dock |
| `.docked` | list | All ships currently docked |
| `.docksize` | list | Tag list of supported sizes |
| `.shipstorage.capacity` / `.free` | int | Internal-storage capacity (S/M ships stored inside) |
| `.dockstate` | dockstate | Current state (default / busy / etc.) |
| `.external` | bool | External dock (ship visible while docked) |
| `.isstorage` | bool | Internal storage bay (not surface dock) |
| `.islaunchtube` | bool | Launchtube (external + force undock speed) |

### Permissions

| Property | Type | Description |
|---|---|---|
| `.isdockingallowed` | bool | Not exclusively for undocking |
| `.isundockingallowed` | bool | Not exclusively for docking |
| `.isunitdockingallowed` | bool | Units may dock |
| `.isunitundockingallowed` | bool | Units may undock |
| `.isbuildingallowed` | bool | Building allowed here |
| `.istradingallowed` | bool | Trading allowed here |
| `.isplayeronly` | bool | Player-only dock |
| `.isshowroom` | bool | Showroom dock |
| `.isventureronly` | bool | Venturer-only dock |
| `.ishidden` | bool | Hidden from UI |

### Positions

| Property | Type | Description |
|---|---|---|
| `.dockslot` | componentslot | Slot the docked ship connects to |
| `.todockpos` | position | Where ship flies to dock |
| `.launchpos` | position | Where ship safely returns to flight |
| `.maxoffset.{sizetag}.position` / `.rotation` | position / rotation | Allowed offset to land |
| `.maxoffset.{$ship}.position` / `.rotation` | various | Accounts for ship's docking software |

### Venture

| Property | Type | Description |
|---|---|---|
| `.ventureplatform` | ventureplatform | Associated venture platform |

## walkablemodule subtype

`walkablemodule` (a `module` subtype) declares 4 own properties:

| Property | Type | Description |
|---|---|---|
| `.hasentrypos` | bool | Entry position defined |
| `.entrypos` | position | Dock area entry position |
| `.hasexitpos` | bool | Exit position defined |
| `.exitpos` | position | Dock area exit position |

## dockarea subtype

`dockarea` (extends `walkablemodule`):

| Property | Type | Description |
|---|---|---|
| `.isventuremodule` | bool | For use with venture platforms |
| `.ventureplatform` | ventureplatform | Associated platform |
| `.dock.{docksize}` | dockingbay | Available dock for this size (may be occupied) |
| `.freedock.{docksize}` | dockingbay | Free dock for this size |

## Common patterns

### "Find docking bays for ship landing"

Pattern from vanilla `guidance.xml:268`, `lib_create_ships.xml:127`, `lib_holomaptarget.xml:227`:

```xml
<do_if value="$Component.isclass.dockingbay
    and not $Component.isstorage">
    <!-- usable surface dock (not internal storage) -->
</do_if>
```

The `not .isstorage` check is important — internal storage bays look like dockingbays but aren't where the player lands.

### "Detect dynamic-interior room readiness"

Pattern from `npc_state_machines.xml:7348`:

```xml
<do_if value="$NextParent.isclass.room
    and $NextParent.iswalkable
    and not $NextParent.iscurrentlywalkable">
    <!-- room is animating / loading — wait -->
</do_if>
```

NPCs use this to avoid pathing into rooms that are mid-animation.

### "Verify a macro is a room (mission setup)"

Pattern from `gm_prisonbreak.xml:184-187`:

```xml
<do_if value="typeof $PrisonMacro == datatype.macro
    and $PrisonMacro.isclass.room">
    <!-- valid prison-room macro -->
</do_if>
```

### "NPC waiting until dock is default state"

Pattern from `npc_state_machines.xml:2509, 2576`:

```xml
<do_if value="$NPC.assignedcontrolled.parent.isclass.dockingbay
    and $NPC.assignedcontrolled.parent.dockstate
        == dockstate.default">
    <!-- dock is in normal idle state — NPC can act -->
</do_if>
```

### "Find dock areas while building stations"

Pattern from `finalisestations.xml:630`:

```xml
<do_if value="$PlannedModules.{$ModuleCounter}.isclass.dockarea">
    <!-- count this as a dock area in the plan -->
</do_if>
```

## Events

There is no `event_room_X` family. Standard component events:

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Room destroyed (containing module destroyed) | Rare — rooms rarely destroyed independently |

For NPC-in-room observation, see [NPC](/game/characters/npc/) Events (`event_entity_entered space=` with the room).

## Common gotchas

- ⚠ **Room extends `component` directly, NOT `destructible`.** No `.hull` — if the containing module is destroyed, the room is gone.
- ⚠ **`.iswalkable` vs `.iscurrentlywalkable`.** The first is "can in principle be walked"; the second adds the runtime state (navmesh loaded, animation idle). For NPC pathing use `.iscurrentlywalkable`.
- ⚠ **Internal storage bays are dockingbays.** `find_object_component class=class.dockingbay` returns BOTH surface docks and internal storage. Filter with `not .isstorage` for player-relevant docks.
- ⚠ **`.assignedship` is the ASSIGNED ship, not the currently docked.** A ship may have reserved the dock while still in transit. Use `.docked` for ships actually on the pad.
- ⚠ **`.dockstate == dockstate.default` is the "idle" state.** Any other state means the dock is busy with arrival / departure / cycling. NPCs wait for default.
- ⚠ **`controlposition` properties read from the parent's controllable.** For virtual rooms (ships with no walkable interior), `.slotcontext` is the controllable; for real rooms, it's the room itself.
- ⚠ **Dockingbay positions are in the dock's local coords.** `.todockpos` and `.launchpos` are offsets relative to the dock, not sector coordinates.
- ⚠ **Permissions stack with the station's overall permissions.** A dock with `.isplayeronly=false` may still reject the player if the parent station is hostile. Read both levels.

## Examples

### Example 1: Find a free dock on a station for a specific ship size

```xml
<do_for_each name="$DA" in="$Station.modules">
    <do_if value="$DA.isclass.dockarea">
        <set_value name="$dock"
            exact="$DA.freedock.{tag.dock_m}"/>
        <do_if value="@$dock">
            <write_to_logbook
                text="'Free M dock: ' + $dock.knownname"/>
            <break/>
        </do_if>
    </do_if>
</do_for_each>
```

### Example 2: List all NPCs in the player's currently-docked station

```xml
<do_if value="@player.ship.dock">
    <set_value name="$Station"
        exact="player.ship.dock.parent"/>

    <do_for_each name="$mod" in="$Station.modules">
        <do_if value="$mod.haswalkableroom">
            <do_for_each name="$actor" in="$mod.actors">
                <write_to_logbook
                    text="$actor.knownname"/>
            </do_for_each>
        </do_if>
    </do_for_each>
</do_if>
```

### Example 3: Identify whether the player is in a private room

```xml
<do_if value="@player.entity.controlled
    and player.entity.controlled.isclass.room
    and player.entity.controlled.isprivate">
    <write_to_logbook
        text="'Player in a private room'"/>
</do_if>
```

## Architectural context

- **Walkable interior pipeline:** Architectural overview *Walkable rooms* — when interiors are loaded, navmesh build, NPC respawn.
- **Docking lifecycle:** Architectural overview *Dock cycle* — `dockstate` transitions and how NPCs and the engine coordinate landing.
- **Control posts vs control positions:** Architectural overview *Control mapping* — controlpost (the job) vs controlposition (the physical seat in a room).

## Related

- [Module](/game/objects/module/) — containing module.
- [Walkablemodule](#walkablemodule-subtype) / [Dockarea](#dockarea-subtype) — module subtypes that contain rooms.
- [Dockingbay](#dockingbay-subtype) — room subtype.
- [NPC](/game/characters/npc/) — what populates rooms.
- [Controllable](/game/objects/controllable/) — parent for "virtual room" stations / ships.
- [Ship](/game/objects/ship/) — what docks at dockingbays.
- [Station](/game/objects/station/) — host.

---

:::tip[Pattern — rich interior datatype with multiple subtypes]
Room demonstrates a thicker datatype family than [Module](/game/objects/module/): the parent `room` has 25 properties, `dockingbay` adds another 30. The dock-related siblings (`walkablemodule`, `dockarea`) live in a parallel module hierarchy but reference rooms. This three-way mesh (room ↔ walkablemodule ↔ dockarea) is unique in the API.
:::

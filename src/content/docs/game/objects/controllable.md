---
title: Controllable
description: Engine abstract class for entities with a pilot/captain — ships and (via inheritance) defensible/station. Has order queue, crew, fleet hierarchy, software. ~120 properties.
---

A **Controllable** is the X4 engine abstract class for entities that have a **pilot, crew, and order queue** — ships and (via [Defensible](/game/objects/defensible/)) stations and modules with control. The class adds **command hierarchy** (commander/subordinates/fleet), **order queue** semantics, and **scanner/software** integration on top of [Object](/game/objects/object/).

**Inheritance:** `object → controllable`. Direct subclass: [Defensible](/game/objects/defensible/) (which in turn is parent of Ship/Station).

## Properties

### Control entities

Identifies the NPCs piloting/operating the controllable:

| Property | Type | Description |
|---|---|---|
| `.pilot` | entity | Pilot entity currently active |
| `.assignedpilot` | entity | Assigned pilot (may not currently be piloting) |
| `.aipilot` | entity | AI pilot entity |
| `.assignedaipilot` | entity | Assigned AI pilot |
| `.defencenpc` | entity | Defence control entity |
| `.tradenpc` | entity | Trade control entity |
| `.tradecomputer` | entity | Trade computer (player-controlled ship) |
| `.engineer` | entity | Engineer entity |
| `.shiptrader` | entity | Shiptrader entity |
| `.shadyguy` | entity | Shady guy (Pirate-DLC criminal NPC) |
| `.controlentity.default` | entity | Main control entity |
| `.controlentity.{$controlpost}` | entity | Control entity at a specific control post |
| `.controlposts.all` | list | All control posts for this object |
| `.controlposts.free` | list | All unoccupied control posts |
| `.controlposts.{$entity}` | list | Control posts the entity can take |
| `.controlroom` | room | The control room (or null) |
| `.controlpostslot.{$controlpost}` | componentslot | Slot for the entity at that control post |
| `.slotactor.{$componentslot}` | entity | Actor reserved for the specified NPC slot |

### Orders + queue

The order queue is **the** central controllable behavior. See [Order](/game/behavior/order/) for full details.

| Property | Type | Description |
|---|---|---|
| `.order` | order | Current order (queue head or default) |
| `.nextorder` | order | Next order in queue |
| `.defaultorder` | order | Default order if present |
| `.orders` | list | All orders in queue (current first) |
| `.buildorders` | list | Build/repair-related orders only |
| `.tradeorders` | list | Trade-related orders only |
| `.hasorderloop` | boolean | Are orders looping? (UI-only — read from MD, not settable) |
| `.hasblacklist.{type}.{group}` | boolean | Blacklist of given type+group exists |

### Command hierarchy

For fleet management:

| Property | Type | Description |
|---|---|---|
| `.commander` | controllable | Commander (if subordinate) |
| `.toplevelcommander` | controllable | Top-level commander (root of hierarchy) |
| `.commanderentity` | entity | Commander entity |
| `.assignment` | assignment | This subordinate's assignment under commander |
| `.canuseassignment.{$assignment}.{$controllable}` | boolean | Can use that assignment under specified commander |
| `.canhavecommander.{$component}` | boolean | Can $component be a commander for this |
| `.subordinates` | list | Direct subordinates |
| `.subordinates.{$assignment}` | list | Subordinates with specific assignment |
| `.allsubordinates` | list | All subordinates (recursive) |
| `.allcommanders` | list | All commanders in chain |
| `.activesubordinategroupids` | list | Subordinate groups with assigned ships |
| `.subordinategroupid` | integer | This object's subordinate group ID |
| `.subordinategroupassignment.{$id}` | assignment | Assignment of subordinate group |
| `.subordinategroupprotectedsector` | sector | Sector being protected by detached group (positiondefence only) |
| `.subordinategroupprotectedposition` | position | Position being protected |
| `.subordinategroupdockoverride` | boolean | Always dock at commander? |
| `.subordinategroupreinforcefleet` | boolean | Reinforce other groups when engaged? |
| `.subordinategrouprespondtodistresscalls` | boolean | Respond to faction distress? |
| `.subordinategroupresupplyatfleet` | boolean | Repair/resupply at fleet? |
| `.subordinategroupattackonsight` | boolean | Attack hostiles on sight? |

### Fleet (top-level)

| Property | Type | Description |
|---|---|---|
| `.fleet.name` | string | Fleet name (empty if not a fleet commander) |
| `.fleet.iscommander` | boolean | Is this a fleet commander? |
| `.fleet.commander` | controllable | Top-level fleet commander |
| `.fleetunit` | fleetunit | Fleet unit if this is a rebuild replacement |
| `.fleetunits` | list | Fleet units for this fleet |

### People (on-board NPCs)

Tracks crew/personnel as NPC templates (lower memory than actual NPCs):

| Property | Type | Description |
|---|---|---|
| `.people.{$npctemplate}` | npctemplateentry | NPC template entry for specific template |
| `.people.count` | integer | Number of people on board |
| `.people.free` | integer | Free space for more people |
| `.people.capacity` | integer | Max capacity |
| `.people.list` | list | All people on board |
| `.people.{$entityrole}.list` | list | People with specific role |
| `.people.{$entityrole}.count` | integer | Count per role |
| `.people.{$entityrole}.combinedskill` | integer | Combined skill across role (0-100) |

### Roles + slots

| Property | Type | Description |
|---|---|---|
| `.roleentity.{$seed}` | entity | Entity representing seed-based person |
| `.roleentity.{$npctemplate}` | entity | Entity representing template-based person |
| `.roleentities` | list | All instanced role entities |
| `.isnpcassignmentrestricted` | boolean | Is this object restricted from NPC assignment? |
| `.canhavecontrolentity.{$controlpost}` | boolean | Can have control entity at that post? |
| `.waypointactors.{$componentslot}` | list | Actors moving toward that waypoint |

### Scanner + software

| Property | Type | Description |
|---|---|---|
| `.hasscanner` | boolean | Has scanner software |
| `.longrange` | boolean | Has long-range scanner |
| `.maxscanlevel` | integer | Maximum scan level |
| `.software.compatible` | warelist | Compatible software wares |
| `.software.default` | warelist | Default-installed software |
| `.software.installed` | warelist | Currently installed software |
| `.software.dock` | ware | Dock assist software installed |
| `.software.longrange` | ware | Long range scanner installed |
| `.software.police` | ware | Police scanner installed |

### Walkability / interior

| Property | Type | Description |
|---|---|---|
| `.haswalkableroom` | boolean | Has rooms accessible to player/NPCs |
| `.canhavedynamicinterior` | boolean | Can contain a dynamic interior |

## Common access patterns

### "Get the pilot of a ship"

```xml
<set_value name="$pilot" exact="$ship.aipilot"/>
```

### "Get current order"

```xml
<do_if value="$ship.order.id == 'Patrol'">
    <!-- ship is on a patrol order -->
</do_if>
```

### "Find subordinates of a faction's fleet"

```xml
<do_for_each name="$sub" in="$commander.subordinates">
    <do_if value="$sub.iscapitalship">
        <!-- this is a capital sub -->
    </do_if>
</do_for_each>
```

### "Check if a ship can be commander of another"

```xml
<do_if value="$potentialcommander.canhavecommander.{$candidate}">
    <!-- candidate can command this ship -->
</do_if>
```

## Common gotchas

- ⚠ **`.hasorderloop` is UI-only — readable but NOT settable from MD/aiscript.** Engine-side flag; see [Repeat Orders UI gotcha in Wiki](/wiki/)
- ⚠ **`.commander` returns the DIRECT commander, NOT the top-level fleet commander.** Use `.toplevelcommander` for the fleet root.
- ⚠ **`.order` returns null if no orders are running** — null-check before accessing `.order.id`.
- ⚠ **`.subordinates` is direct only.** Use `.allsubordinates` to walk the full hierarchy (recursive).
- ⚠ **Slots and roles can be filled by actors that don't actually appear** — use `.slotactor` carefully.
- ⚠ **`.controlentity.{$controlpost}` returns null** if no entity is currently at that post. Check `.controlposts.free` first.

## Inheritance hierarchy

```
object  
  └── controllable                ← this class
       └── defensible (defensive abilities — shields/surfaces)
            ├── ship (mobile entities with full pilot crew)
            └── station/module (some — those with control posts)
```

## Common actions on controllable

| Action | Purpose |
|---|---|
| `<create_order>` | Add an order to the order queue |
| `<cancel_order>` | Cancel a specific order |
| `<cancel_all_orders>` | Clear the entire order queue |
| `<set_default_order>` | Set the default order |
| `<set_assignment>` | Set this controllable's assignment under commander |
| `<assign_control_entity>` | Assign an entity to a control post |
| `<release_control_entity>` | Release an entity from a control post |
| `<add_to_group>` | Add this controllable to a subordinate group |

## Related

- [Object](/game/objects/object/) — parent class
- [Defensible](/game/objects/defensible/) — child class (adds shields/surfaces)
- [Ship](/game/objects/ship/) — concrete subclass via defensible
- [Order](/game/behavior/order/) — what's in the order queue
- [Assignment](/game/factions/assignment/) — what subordinates do
- [Control post](/game/factions/controlpost/) — slots where entities operate
- [Entity role](/game/factions/entityrole/) — NPC roles (pilot, gunner, etc.)
- [Architectural overview: NPC orders](/overviews/npc-orders/) — how orders coordinate

---

*Controllable is one of the most-used engine classes — modders interact with it constantly via ships and station-control-posts. The order queue and fleet hierarchy are the central modeling concepts.*

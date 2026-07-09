---
title: Order
description: "A unit of behaviour on a controllable — 'this ship is currently doing X'. Game-side concept; for the XML schema to define new orders, see Aiscript → Order definition."
---

An **Order** is a unit of behaviour assigned to a [Controllable](/game/objects/controllable/) (ship or station). At any moment, a ship has at most one *active* order (`.order`), an optional *default* fallback (`.defaultorder`), and a *queue* (`.orders`).

Orders are the game-side runtime concept — "this ship is doing X". The *schema for writing a new order* (parameters, lifecycle, interrupts, attentions) is a different abstraction: see [Aiscript → Order definition](/lang/aiscript/order-definition/). **Two faces of the same word.**

**Vanilla scope:** 179 aiscript files in `aiscripts/*.xml`. The order ids most commonly invoked from MD: `Attack`, `Flee`, `Escort`, `Wait`, `Patrol`, `Undock`, `ProtectPosition`, `MiningRoutine`, `AssignCommander`, `RescueShip`, `DockAndWait`.

## Lifecycle and queue model

```
Ship's order queue (read by .orders):
┌─────────────────────────────────────────────┐
│  Q[0] = .order      ← currently running     │
│  Q[1] = .nextorder                          │
│  Q[2..]            queued                   │
└─────────────────────────────────────────────┘
           +
.defaultorder       ← fallback after queue drains
                       (the "loop" order in vanilla UI)
```

When the queue empties, the ship runs `.defaultorder` if set, else idles. Player-edited "Repeat Orders Default Behaviour" toggles whether the queue is itself looped — that's `.hasorderloop` (UI-only, **read-only from MD**).

## Properties

The order datatype, full list at vanilla `libraries/scriptproperties.xml:1686`.

| Property | Type | Description |
|---|---|---|
| `.exists` | bool | Order exists (use to null-check) |
| `.id` | string | Order id (`'Attack'`, `'ProtectPosition'`, ...) |
| `.name` | string | Display name |
| `.script` | string | Backing aiscript filename |
| `.description` | string | UI description |
| `.object` | object | The ship/station this order is on |
| `.state` | orderstate | started / critical / finish / queued / ... |
| `.canplayercancel` | bool | Player UI can cancel this |
| `.isinfinite` | bool | Order never completes by itself |
| `.isinloop` | bool | Inside a player-set order loop |
| `.istemporary` | bool | Removed when complete, even inside a loop |
| `.haspriority` | bool | Was enqueued before others |
| `.isoverride` | bool | Currently overriding another order |
| `.isrunning` | bool | State is started/critical/finish |
| `.isparameditable.{param}` | bool | Specific param accepts `edit_order_param` |
| `.istradecomputer` | bool | A trade-computer order |
| `.trade` / `.build` / `.operation` | various | Linked trade/build/operation, if any |
| `.requiredskill` | int | Min combined skill of control entity |
| `.$<param>` | various | Value of order parameter (`$ship.order.$range`, `$ship.order.$target`) |

**Order states** (`orderstate.X` enum, abbreviated):
- `started` — running normally
- `critical` — at a non-interruptible step (UI typically cannot cancel). Cited heavily in `encounters.xml` and `conversations.xml`.
- `finish` — running finish-block
- (other states: queued, paused, ...)

The runtime queue (`.order`, `.nextorder`, `.orders`, `.defaultorder`, `.hasorderloop`) lives on **the controllable**, not on this datatype — see [Ship → Properties → Orders](/game/objects/ship/#orders).

## Actions

### Create a queued order

```xml
<create_order id="'Attack'" object="$ship">
    <param name="target" value="$enemy"/>
</create_order>
```

By default the order is enqueued at the back of the queue. Common attributes:

| Attribute | Effect |
|---|---|
| `id="'XYZ'"` | The order id, **must be quoted string literal** |
| `default="true"` | Becomes the fallback / loop order — replaces `.defaultorder` |
| `immediate="true"` | Insert at the front; preempt current |
| `override="true"` | Override current order (current pauses, runs again after) |
| `priority="true"` | Insert before regular orders but after override orders |
| `name="$capturedOrder"` | Capture the resulting order ref into a variable |

### Replace the ship's behavior (the canonical idiom)

```xml
<cancel_all_orders object="$ship"/>
<create_order id="'ProtectPosition'" object="$ship" default="true">
    <param name="destination" value="[$sector, $position]"/>
</create_order>
```

This is the vanilla pattern for "make this ship do X from now on": cancel everything, create a new default. See `boarding.xml:2738-2739` and `gm_escort.xml:693`.

**Don't** use `cancel_order $defaultorder` — it doesn't replace the loop and the ship keeps its old behaviour.

### Inject an immediate priority order

```xml
<create_order id="'Attack'" object="$ship"
    immediate="true" override="true">
    <param name="target" value="$enemy"/>
</create_order>
```

Used by `conversations.xml:1026-1036` for "react to attack" comms (Attack / Flee).

### Cancel a specific order

```xml
<cancel_order order="$capturedOrder"/>
```

You need the ref from a `name="$X"` on creation, or pulled from `$ship.orders.{1}`.

### Edit a running order's parameter

```xml
<edit_order_param
    order="$ship.order"
    param="'range_internal'"
    value="null"/>
```

Only works for parameters where the backing aiscript marked the param as runtime-editable (check via `.isparameditable.{$param}`). See `encounters.xml:286-289` for vanilla pattern.

### Read a parameter from a running order

```xml
<do_if value="$ship.order.id == 'Attack'">
    <set_value name="$target" exact="$ship.order.$target"/>
</do_if>
```

## Common order ids and where they live

This is a *small* slice — full list is the 179 files in vanilla `aiscripts/`.

| Order id | Aiscript file | When to use |
|---|---|---|
| `'Attack'` | `order.fight.attack.object.xml` | Attack a target |
| `'Flee'` | `order.flee.xml` | Run from a threat |
| `'Wait'` | `order.wait.xml` | Idle in place |
| `'Patrol'` | `order.patrol.xml` | Patrol a region |
| `'Escort'` | `order.escort.xml` | Stay near and protect a target |
| `'ProtectPosition'` | `order.protectposition.xml` | Hold a `[sector, position]` |
| `'Undock'` | `order.undock.xml` | Leave current dock |
| `'DockAndWait'` | `order.dockandwait.xml` | Dock at target and idle |
| `'AssignCommander'` | `order.assigncommander.xml` | Become a subordinate |
| `'RescueShip'` | `order.rescue.xml` | Tow a disabled ship |
| `'MiningRoutine'` | `order.miningroutine.xml` | Auto-mine in a region |
| `'AttackInRange'` | `order.attackinrange.xml` | Attack any hostile in range |

To find the right id for a behaviour, search `aiscripts/order.X.xml` in vanilla.

## Libraries

There are no `LIB_Generic.Order*` libraries — order management is a small set of inline actions. The closest helpers:

| Library | Purpose | Source line |
|---|---|---|
| `md.LIB_Generic.ForceShipHalt` | Stop a ship — cancel all orders + give Wait | 2573 |
| `md.LIB_Generic.Setup_ShipGroup_Formation_v2` | Issue a formation order to a group | 1951 |
| `md.LIB_Generic.Setup_Ship_Turrets_HoldFire` | Turret behaviour (not orders, but related) | 2026 |
| `md.LIB_Generic.Setup_Ship_Turrets_Defend` | Turret behaviour | 2041 |

## Events

There are no `event_order_*` events. Order outcomes are observed indirectly:

| Indirect signal | Where |
|---|---|
| `event_object_attacked` | Combat orders responding |
| `event_object_destroyed` | Order target destroyed |
| `event_object_changed_sector` | Movement orders crossed a boundary |
| `event_trade_completed` | Trade order finished |
| `event_cue_signalled` | Custom — aiscript `signal_cue` from inside the order |

Pattern: if you need to wait for an order to complete, signal a cue from the aiscript's `<on_finish>` block (in your own order definition) rather than polling `.state`.

## Common gotchas

- ⚠ **`'AttackInRange' default="true"` rejected at runtime.** The action is accepted, save shows it queued, but at load the engine drops it. Use `ProtectPosition default="true"` + queued `AttackInRange` instead.
- ⚠ **`'ProtectPosition'` destination format is `[sector, position]`, not bare sector.** Vanilla aiscript reads `$destination.{1}` (sector) and `$destination.{2}` (position) — bare sector ref breaks both lookups with null errors.
- ⚠ **`cancel_order order="$ship.defaultorder"` doesn't swap defaults.** It just removes the current default; the ship has no fallback now. The vanilla idiom is `cancel_all_orders` + `create_order default="true"`.
- ⚠ **`.hasorderloop` is read-only from MD.** The "Repeat Orders Default Behaviour" UI toggle is engine-side. MD cannot enable / disable it. Use `ProtectPosition default="true"` (infinite default) for emulation.
- ⚠ **Order id literal must be a string (`'Attack'`), not bare (`Attack`).** Bare loops through the variable lookup and finds nothing.
- ⚠ **`edit_order_param` only works on params marked editable.** Check `.isparameditable.{$param}` first or grep your target aiscript for `<param editable="true"`.
- ⚠ **Removing a subordinate ship requires more than `cancel_order`.** Subordinate relationship is set via `set_command commander=`. To detach, call `set_command commander="null"`.
- ⚠ **Order parameters live under `$order.$name`, not `$order.name`.** Vanilla: `$ship.order.$target`, not `$ship.order.target`. The leading `$` matters.

## Examples

### Example 1: Make a captured ship hold a position

```xml
<cancel_all_orders object="$capturedShip"/>
<create_order id="'ProtectPosition'"
    object="$capturedShip"
    default="true">
    <param name="destination"
        value="[$capturedShip.sector, $capturedShip.position]"/>
</create_order>
```

### Example 2: Inject a Flee order when player relations drop below kill

```xml
<cue name="WatchPlayerHostile" instantiate="true">
    <conditions>
        <event_faction_relation_changed
            faction="faction.player"
            otherfaction="$Faction"/>
        <check_value
            value="$Faction.relationto.{faction.player}
                   lt $Faction.relation.kill.max"/>
    </conditions>
    <actions>
        <find_ship_by_true_owner name="$Ships"
            space="player.galaxy"
            faction="$Faction"
            multiple="true"/>
        <do_for_each name="$ship" in="$Ships">
            <create_order id="'Flee'"
                object="$ship"
                immediate="true">
                <param name="threat" value="player.entity"/>
            </create_order>
        </do_for_each>
    </actions>
</cue>
```

### Example 3: Tune a running Attack order

```xml
<do_if value="$ship.order.id == 'Attack'
       and $ship.order.isparameditable.{'holdfire'}">
    <edit_order_param
        order="$ship.order"
        param="'holdfire'"
        value="false"/>
</do_if>
```

Pattern from `scenario_combat.xml:979-980`.

## Architectural context

- **How NPC ship behavior is structured end-to-end:** Architectural overview *NPC orders* — state machine in aiscripts, `gmc_*` files for generic missions, attentions+interrupts for low-level reactions.
- **How orders interact with patrol coordination:** Architectural overview *Patrol coordination* — galaxy combat bus emits signals; per-faction priority queue picks responding fleets; each fleet's ships get `Attack` injected at right priority.
- **How orders interact with boarding:** Architectural overview *Boarding* — 5-phase state machine assigns specific orders per phase (`UndockMarines`, `BoardingApproach`, `Wait`, ...).
- **How to write your own order:** [Aiscript → Order definition](/lang/aiscript/order-definition/) — XML schema, params, lifecycle blocks, interrupts, attentions.

## Related

- [Ship](/game/objects/ship/) — what executes orders.
- [Order definition](/lang/aiscript/order-definition/) — the XML schema (language-side).
- [Interrupt](/lang/aiscript/interrupt/) — what preempts orders.
- [Attention](/lang/aiscript/attention/) — lower-level reactive behaviour.
- [Boarding operation](/game/behavior/boarding-operation/) — composite behaviour built from orders.
- [Trade](/game/economy/trade-offer/) — trade orders carry a `.trade` ref.

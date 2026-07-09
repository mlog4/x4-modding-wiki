---
title: NPC orders
description: How NPC ship behavior is structured — aiscript orders, lib helpers, orders.base lifecycle, interrupt integration, and the queue/default order model.
---

How does an Argon transport know to fly to a station, dock, sell its cargo, and return for more? It's not driven by MD missions — those are for missions. NPC ship behaviour runs through **aiscript orders**: declarative XML files in `aiscripts/order.*.xml` that define what a ship does and what it reacts to.

This overview explains how 81 vanilla order files compose into the runtime behaviour the player sees.

For the runtime data side (cancel orders, query state) see [Order](/game/behavior/order/). For the language schema see [Order definition](/lang/aiscript/order-definition/).

## Vanilla scope

```
aiscripts/
├── order.attack.xml
├── order.assist.xml
├── order.build.deploy.xml
├── order.collect.ship.xml
├── order.flee.xml
├── order.mining.routine.xml
├── order.patrol.xml
├── order.protect.position.xml
├── order.wait.xml
├── ... 72 more
├── interrupt.attacked.xml
├── interrupt.scanned.xml
├── ... more interrupts
├── lib.fleet.organize.defences.xml
├── lib.find.sectors.inrange.xml
├── ... lib helpers
└── orders.base.xml          ← shared lifecycle code
```

- **81 order files** (`order.X.xml`)
- **15 interrupt files** (`interrupt.X.xml`) — see [Interrupt](/lang/aiscript/interrupt/)
- **Many lib files** — shared utilities (`lib.X.xml`)
- **orders.base.xml (394 lines)** — base lifecycle code referenced by all orders

## The lifecycle pattern

```
   create_order (MD or engine)
            ↓
   ┌──────────────────────────────────┐
   │  Order queue                      │
   │  [active] → [next] → ... → [end]  │
   └──────────────────────────────────┘
            ↓
   Active order's <actions> running
            ↓
   ┌──────────────────────────────────┐
   │  Interrupts evaluated each tick   │
   │  (per-order subscription list)    │
   └──────────────────────────────────┘
            ↓
   ┌──────────────────────────────────┐
   │  - Order completes naturally      │
   │    → next order activates         │
   │  - Order interrupted              │
   │    → handler runs, order may end  │
   │  - Order cancelled                │
   │    → cleanup, next runs           │
   └──────────────────────────────────┘
            ↓
   Queue empty → fallback to .defaultorder
   (or idle if no default)
```

## orders.base.xml — shared lifecycle

Most orders share lifecycle code via `orders.base.xml`. It handles:

- **Setup at order start** — register the order with the entity, claim resources, etc.
- **Cleanup at order end** — release resources, reset state
- **Player vs NPC dispatch** — different UI / voice for player ships
- **Order parameter normalisation** — defaults, type coercion
- **Skipwait logic** — when a new override order arrives, base detects via `this.$skipwait`

Custom orders include base via:

```xml
<include_actions ref="orders.base"/>
```

Without this, your custom order is missing standard X4 niceties.

## Order anatomy (the schema)

Every aiscript order file has:

```
<aiscript>
├── <order id="X" .../>
│   ├── <params> ...
│   └── <requires> ...
├── <actions>            ← main execution
├── <on_abort>           ← cancellation cleanup
├── <on_finish>          ← natural completion
├── <attention min="...">← attention-level branching
└── <interrupts>         ← reactive handlers
    ├── <handler ref="AttackHandler"/>
    └── <handler ref="..."/>
</aiscript>
```

See [Order definition](/lang/aiscript/order-definition/) for the schema details.

## Default order vs queued orders

A ship has:

- `.defaultorder` — the fallback that fires when queue is empty
- `.orders` — queue of explicitly scheduled orders
- `.order` — currently active (front of queue, or default if queue empty)

Typical patterns:

| Pattern | What runs |
|---|---|
| Queue is empty, default = `'Wait'` | Ship waits in place |
| Queue is empty, default = `'Patrol'` | Ship patrols the sector |
| Queue is empty, default = `'ProtectPosition'` | Ship guards a position |
| Queue has `'Attack'` queued | Ship attacks first; queue advances |

The vanilla canonical pattern for "set this ship's default behaviour":

```xml
<cancel_all_orders object="$ship"/>
<create_order id="'ProtectPosition'" object="$ship" default="true">
    <param name="destination" value="[$sector, $position]"/>
</create_order>
```

`cancel_all_orders` clears queue + default; `create_order default="true"` sets the new default. See [Order → Cancel and swap orders](/game/behavior/order/#cancel-and-swap-orders).

## Interrupt integration

Each order subscribes to interrupts in its `<interrupts>` block:

```xml
<interrupts>
    <handler ref="AttackHandler"/>
    <handler ref="MissileLockHandler"/>
    <handler ref="ScannedHandler"/>
    <handler ref="InspectedHandler"/>
</interrupts>
```

When any of these events fires during the order, the handler runs and may:
- Modify order state (set `$flag`)
- Force the order to end (set `this.$skipwait`)
- Issue a new override order
- Just log without acting (`consume="false"`)

See [Interrupt](/lang/aiscript/interrupt/) for the handler reference.

## Attention integration

Aiscript orders use `<attention>` blocks to skip expensive logic when the player isn't watching:

```xml
<actions>
    <wait min="30s" max="120s"/>   <!-- runs at all attentions -->
</actions>

<attention min="insector">
    <actions>
        <!-- detailed movements only when player in sector -->
        <move_to ... />
    </actions>
</attention>
```

See [Attention](/lang/aiscript/attention/).

## Player vs NPC paths

Most order files split player-ship vs NPC-ship handling:

```xml
<do_if value="this.isplayerowned">
    <!-- player UI prompts, voice lines, camera framing -->
</do_if>
<do_else>
    <!-- silent NPC execution -->
</do_else>
```

Player paths are heavier — UI feedback, voice lines, sometimes auto-engage prompts. NPC paths just run the math. This is partially why `orders.base.xml` is 394 lines.

## MD ↔ Aiscript coupling

MD missions / cues create orders, but the actual behaviour runs in aiscript:

```
MD cue                     Aiscript order
──────────                 ─────────────
<create_order              order.protect.position.xml
    id="'ProtectPosition'" reads $destination
    object="$ship">        runs <actions> block
    <param                 subscribes to interrupts
        name="destination"  
        value="..."/>      
</create_order>
```

Mission cues observe outcomes via [signal_objects](/lang/md-framework/action/) emitted from the aiscript's `<on_finish>` block:

```xml
<!-- inside aiscript -->
<on_finish>
    <signal_objects
        object="this.$mission_cue"
        param="'order_done'"/>
</on_finish>
```

```xml
<!-- MD cue listens -->
<cue name="WatchOrderDone" instantiate="true">
    <conditions>
        <event_object_signalled
            object="this.$mission_cue"
            param="'order_done'"/>
    </conditions>
    ...
</cue>
```

This is the canonical mission ↔ ship-behaviour bridge.

## Why this matters for modders

### Custom orders

Adding a new order requires:
1. New `aiscripts/order.X.xml` file (see [Order definition](/lang/aiscript/order-definition/))
2. Test load — engine errors at load if XML invalid
3. Reference order id from MD with `<create_order id="'YourId'"/>`

### Custom interrupt handlers

Adding new interrupt handlers (see [Interrupt](/lang/aiscript/interrupt/)) lets you create reusable reaction logic that multiple orders can import.

### Vanilla file lookup

To understand "what does the AI do when X", grep `aiscripts/order.X.xml`. The 81 files cover most NPC behaviour; the lib files cover shared utilities.

### Performance

Orders run continuously while active. Interrupts evaluate each tick. Mods that add expensive logic to a popular interrupt (or a popular order) impact CPU for every NPC ship that uses it.

## Cross-references

- [Order (game)](/game/behavior/order/) — runtime data + queue management
- [Order definition (lang)](/lang/aiscript/order-definition/) — XML schema
- [Interrupt (lang)](/lang/aiscript/interrupt/) — handler library
- [Attention (lang)](/lang/aiscript/attention/) — fidelity branching
- [Ship](/game/objects/ship/) — what executes orders

## Related architectural overviews

- *Patrol coordination* — how patrol orders integrate with galaxy combat bus
- [Boarding](/overviews/boarding/) — boarding operations use specialised orders
- *Fleet reconstitution* — replacing destroyed ships uses build orders

---

:::tip[Pattern — modular aiscript composition]
NPC orders demonstrate **X4's modular AI architecture** — each behaviour is its own file, interrupts are reusable across orders, lib utilities are shared. 81 order files + 15 interrupt files + many libs = a kit of LEGO pieces. Modders extending AI behaviour should add new pieces rather than monolithic order overrides.
:::

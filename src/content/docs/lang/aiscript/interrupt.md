---
title: Interrupt
description: A reusable event handler attachable to aiscript orders. Defines conditions and actions for reactive ship behaviour (attacked, missile lock, lockbox found, scanned, etc.).
---

An **Interrupt** is a reusable event handler that runs *while an order is active*. When an interrupt's conditions match, the order pauses, the handler's actions run, and the order resumes (or is replaced). Orders subscribe to interrupts via `<handler ref="X"/>` in their `<interrupts>` block.

Vanilla provides **15 shared interrupt handlers** in `aiscripts/interrupt.*.xml` — every ship order references some subset of these.

**Inheritance relationship:** Interrupts are aiscript files like [Order definitions](/lang/aiscript/order-definition/), but their root is configured differently. They define *handlers* meant for `ref="X"` import, not standalone orders.

## Vanilla shared interrupts

| File | Handler purpose |
|---|---|
| `interrupt.attacked.xml` | Respond to being attacked (fight / flee / call for help) |
| `interrupt.changedsector.xml` | React when ship crosses sector boundary |
| `interrupt.disengage.xml` | Disengage from current combat |
| `interrupt.foundabandonedship.xml` | React on encountering abandoned ship |
| `interrupt.foundlockbox.xml` | React on encountering lockbox |
| `interrupt.inspected.xml` | React to scan / inspection |
| `interrupt.job.remove.xml` | Job lifecycle removal |
| `interrupt.lostreservation.xml` | Lost a reservation (dock, slot) |
| `interrupt.missilelock.xml` | Missile lock detected |
| `interrupt.npc.usecases.xml` | NPC use-case triggers |
| `interrupt.restock.xml` | Auto-restock when low on supplies |
| `interrupt.scanned.xml` | React to being scanned |
| `interrupt.stoporder.xml` | Player issued stop order |
| `interrupt.targetinvalid.xml` | Target became invalid |
| `interrupt.tide.xml` | Tides of Avarice tide event |

## File structure

```xml
<?xml version="1.0" encoding="utf-8" ?>
<aiscript name="interrupt.attacked"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="aiscripts.xsd"
    priority="10">

  <params>
    <param name="attacker"/>
    <param name="attackrespond"/>
    <param name="callforhelp"/>
    <param name="fleerespond"/>
    <param name="debugchance" default="0"/>
  </params>

  <interrupts>
    <library>
      <handler name="AttackHandler">
        <conditions>
          <!-- when to trigger -->
        </conditions>
        <actions>
          <!-- what to do -->
        </actions>
      </handler>
    </library>
  </interrupts>

</aiscript>
```

Root is still `<aiscript>` (same as [Order definitions](/lang/aiscript/order-definition/)). The interrupt-specific parts:

| Element | Purpose |
|---|---|
| `priority="N"` on root | Priority for ordering interrupt evaluation (higher = sooner) |
| `<interrupts>` | Container block |
| `<library>` | Marks handlers as reusable references |
| `<handler name="X">` | Named handler — what orders reference via `ref="X"` |

## Using interrupts in orders

In the order's body:

```xml
<interrupts>
  <handler ref="AttackHandler"/>
  <handler ref="MissileLockHandler"/>
  <handler ref="ScannedHandler"/>
</interrupts>
```

The `ref="AttackHandler"` lookup resolves to the named handler in any loaded `interrupt.X.xml` — engine-side resolution.

You can also define **inline handlers** in the order:

```xml
<interrupts>
  <handler consume="false">
    <conditions>
      <event_object_order_ready
          object="this.assignedcontrolled"/>
      <check_value value="this.isplayerowned"/>
    </conditions>
    <actions>
      <set_value name="this.$skipwait"/>
    </actions>
  </handler>
</interrupts>
```

Inline handlers don't need a `name=`. They're scoped to the containing order.

## Handler attributes

| Attribute | Purpose |
|---|---|
| `name="X"` | Library export name (for `ref="X"` import) |
| `ref="X"` | Reference to an exported handler |
| `consume="true/false"` | Whether the event is consumed (default true) |
| `priority="N"` | Override script-level priority for this handler |

`consume="false"` is the key for letting multiple handlers respond to the same event without one swallowing it.

## Conditions and actions

Within a handler, `<conditions>` and `<actions>` follow the same syntax as [MD Cue conditions and actions](/lang/md-framework/cue/) — with subtle differences:

- **Aiscript scope:** `this` is the entity executing the order (not a cue).
- **`event.X`:** event-specific properties (event.param, event.object — semantics depend on the triggering event).
- **Aiscript-specific actions:** ship-control actions (`move_to`, `attack_object`, `eject`, etc.) that have no MD equivalent.

See [MD Framework Condition](/lang/md-framework/condition/) for the event family overview (aiscripts use the same event types).

## Common patterns

### "Shared handler import"

```xml
<interrupts>
  <handler ref="AttackHandler"/>
</interrupts>
```

The simplest case — your order imports a vanilla handler.

### "Inline handler with multiple checks"

```xml
<interrupts>
  <handler consume="false">
    <conditions>
      <check_any>
        <event_object_attacked
            object="this.assignedcontrolled"/>
        <event_object_signalled
            object="this.assignedcontrolled"
            param2="'distress'"/>
      </check_any>
      <check_value
          value="this.assignedcontrolled.isunit"/>
    </conditions>
    <actions>
      <set_value name="this.$shouldHelp" exact="true"/>
    </actions>
  </handler>
</interrupts>
```

Multiple event sources via `check_any` + post-filter.

### "Custom interrupt file"

A custom interrupt is also an aiscript:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<aiscript name="interrupt.mlog_hero_protect"
    priority="5">
  <interrupts>
    <library>
      <handler name="HeroProtectHandler">
        <conditions>
          <event_object_attacked
              object="this.$hero"/>
          <check_value value="@this.$hero
              and this.$hero.hullpercentage lt 30"/>
        </conditions>
        <actions>
          <create_order id="'Flee'"
              object="this.$hero"
              override="true">
            <param name="threat"
                value="event.param.entity"/>
          </create_order>
        </actions>
      </handler>
    </library>
  </interrupts>
</aiscript>
```

Orders import via `<handler ref="HeroProtectHandler"/>`.

## Common gotchas

- ⚠ **`priority=` is script-level.** Set on the `<aiscript>` root. Higher priority interrupts evaluate first; the first one whose conditions match consumes the event (unless `consume="false"`).
- ⚠ **`consume="false"` lets the event flow to lower-priority handlers.** Use for "notice-but-don't-act" patterns.
- ⚠ **Inline handlers don't expose to other orders.** Only named handlers in a `<library>` block are importable via `ref=`.
- ⚠ **Handler conditions evaluate while order is active.** They run continuously (per event tick), not just once. Expensive condition logic affects performance.
- ⚠ **`this` is the entity, not the ship.** Use `this.ship` or `this.assignedcontrolled` for the controllable. Vanilla pattern in `interrupt.attacked` uses `this.defensible` for the host.
- ⚠ **Custom interrupts need a script reload to be discovered.** Adding a new `interrupt.X.xml` requires `/reloadai` in console or restart. Modifying an existing one auto-reloads in dev mode.
- ⚠ **Don't break vanilla handler refs.** If your mod replaces a vanilla `interrupt.attacked.xml`, all 100+ vanilla orders that reference `AttackHandler` go through your version. Test extensively.
- ⚠ **Library `<handler>` block requires `<library>` wrapper.** Top-level `<handler>` won't be discoverable as `ref=`. Vanilla pattern: `<interrupts><library><handler name="X">...</handler></library></interrupts>`.

## Examples

### Example 1: Read vanilla AttackHandler

Open `aiscripts/interrupt.attacked.xml` — it's the canonical reference for combat reactions. Notable conditions:
- `event.object.signal.{'attacked'}.response.id != 'ignore'`
- `event.object.isclass.ship`
- `event.object.order.state != orderstate.critical`
- `event.param.isoperational`

Then the response branches (`fight or flight`) decide what to do. Modders copying this pattern: read the full file and understand the response-id system before forking.

### Example 2: Custom defend-hero interrupt

(See "Custom interrupt file" pattern above.)

### Example 3: Import multiple shared interrupts

```xml
<interrupts>
  <handler ref="AttackHandler"/>
  <handler ref="MissileLockHandler"/>
  <handler ref="InspectedHandler"/>
  <handler ref="ScannedHandler"/>
  <handler ref="StopOrderHandler"/>
  <handler ref="TargetInvalidHandler"/>
</interrupts>
```

Most combat orders import this set. Pattern from `order.wait.xml`.

## Architectural context

- **Vanilla orders typically import 4-8 interrupts.** Look at `aiscripts/order.X.xml` for the import list to understand "what does this order react to".
- **Performance:** interrupts evaluate continuously while their order is active. Heavy condition logic in a popular interrupt impacts CPU.
- **MD vs Aiscript division:** MD missions react via cues; aiscript ships react via interrupts. Both share the event family.

## Related

- [Order definition](/lang/aiscript/order-definition/) — uses interrupts.
- [Attention](/lang/aiscript/attention/) — alternative reactive mechanism (attention-level branching).
- [MD Cue](/lang/md-framework/cue/) — parallel concept (event-driven reaction).
- [MD Condition](/lang/md-framework/condition/) — event types reference (shared with aiscript).

---

:::tip[Pattern — shared reactive handler library]
Interrupt is **the reusable reaction layer**. Vanilla provides 15 standard interrupts; orders subscribe via `ref=`. Your custom orders should reuse these whenever possible, only writing new interrupt files for genuinely novel events.
:::

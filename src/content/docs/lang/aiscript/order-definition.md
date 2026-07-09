---
title: Order definition
description: The XML schema for declaring a new ship order in an aiscript. Defines parameters, requirements, lifecycle blocks, and interrupt handlers.
---

An **Order definition** is the aiscript XML that declares a new ship order — the *language-side* of what the [Game API → Order](/game/behavior/order/) abstraction represents at runtime. While the game-side `order` datatype lets you read "this ship is doing X", the order definition is what you write to *create* new behaviour X.

Vanilla has **179 aiscript files** in `aiscripts/order.*.xml` — each one defines one order id (`'Attack'`, `'Wait'`, `'ProtectPosition'`, etc.).

This page closes the **two-faces-of-Order** distinction we noted in the [Order](/game/behavior/order/) game-side page.

## File location and root

```xml
<?xml version="1.0" encoding="utf-8" ?>
<aiscript name="order.wait"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="aiscripts.xsd"
    version="8">

  <order id="Wait"
      name="{1041, 101}"
      description="{1041, 102}"
      category="navigation"
      allowinloop="false">

    <params>
      <!-- ... -->
    </params>

  </order>

  <!-- ... lifecycle blocks ... -->

</aiscript>
```

The root is `<aiscript>`. The `name=` attribute is the filename minus `.xml` (`order.wait` for `order.wait.xml`). The `version=` is incremented on breaking changes for save migration.

## `<order>` element attributes

| Attribute | Purpose |
|---|---|
| `id="X"` | Order id (capitalised: `Wait`, `Attack`, `Patrol`) — quoted-string elsewhere in MD |
| `name="{page, line}"` | Localized display name (text-table reference) |
| `description="{page, line}"` | Localized description |
| `category="X"` | UI category: `navigation`, `combat`, `economy`, etc. |
| `allowinloop="true/false"` | Can be in the player's order loop |
| `default="true/false"` | Can be a default-order replacement |
| `infinite="true/false"` | Order never completes by itself |
| `override="true/false"` | Override-style order (vs queued) |

## `<params>` block

Parameter declarations — each `<param>` defines one parameter:

```xml
<params>
  <param name="target" type="object"
      default="null"
      comment="The target to attack"/>

  <param name="range" type="length"
      default="3km" text="{1041, 99}"
      comment="Engagement range">
    <input_param name="min" value="100m"/>
    <input_param name="max" value="50km"/>
    <input_param name="step" value="1km"/>
  </param>

  <param name="aggressive" type="bool"
      default="true" advanced="true"
      text="{1041, 100}"
      comment="Engage all hostiles in range"/>

  <param name="debugchance" type="bool"
      default="0" advanced="true"
      comment="Debug logging">
    <input_param name="truevalue" value="100"/>
  </param>

  <param name="state" type="internal"
      default="null"
      comment="Internal state — not editable"/>
</params>
```

| Attribute | Purpose |
|---|---|
| `name="X"` | Parameter name (accessed via `$X` in script) |
| `type="X"` | `object`, `bool`, `length`, `time`, `money`, `internal`, `position`, `list`, etc. |
| `default="X"` | Default value (expression evaluated at order time) |
| `text="{page, line}"` | Localized label for UI |
| `comment="X"` | Author comment (not user-visible) |
| `advanced="true/false"` | Hide in basic UI; show in advanced |
| `infinitevalue="X"` | Value that means "no limit" (UI displays as ∞) |
| `editable="true/false"` | Allow `<edit_order_param>` to modify at runtime |

`type="internal"` parameters are not user-editable — script-internal state.

The `<input_param>` children inside `<param>` define UI bounds: `min`, `max`, `step`, `truevalue` for booleans.

## Lifecycle blocks

After `<order>`, the order body uses these blocks:

```xml
<actions>
  <!-- main execution -->
</actions>

<on_abort>
  <!-- cancellation cleanup -->
</on_abort>

<on_finish>
  <!-- normal completion -->
</on_finish>

<attention min="unknown" max="medium">
  <!-- attention-specific branching (see Attention) -->
</attention>

<interrupts>
  <!-- handler references (see Interrupt) -->
  <handler ref="AttackHandler"/>
  <handler ref="MissileLockHandler"/>
</interrupts>
```

| Block | When it runs |
|---|---|
| `<actions>` | Order is active and running normally |
| `<on_abort>` | Order was cancelled (player or override) |
| `<on_finish>` | Order completed successfully |
| `<attention>` | Attention level changed (low / medium / focus) |
| `<interrupts>` | Specific events occur while order is active |

## Parameters in actions

Within `<actions>`, access parameters via `$X`:

```xml
<actions>
  <move_to destination="$target" range="$range"/>

  <do_if value="$aggressive">
    <attack_object target="$target"/>
  </do_if>

  <debug_text text="'Wait order tick'"
      chance="$debugchance"/>
</actions>
```

The variable `this` refers to the entity (NPC) executing the order; `this.ship` is the ship; `this.assignedcontrolled` is the ship being commanded.

## `<requires>` block

Filter which ships can use this order:

```xml
<requires>
  <match shiptype="shiptype.lasertower" negate="true"/>
</requires>
```

Pattern: order won't be available for lasertowers. Common filters: `shiptype=`, `class=`, `purpose=`.

## Save migration via `<patch>`

For breaking changes, version the order and patch existing instances:

```xml
<param name="fidget" type="internal" default="false">
  <patch value="false" sinceversion="7"/>
</param>
```

When a save from version ≤ 6 loads, `$fidget` is initialised to `false` for the migration. The `version=` on `<aiscript>` is the current version; `sinceversion=` on `<patch>` is when the patch became necessary.

## Interrupts

Interrupts are handlers that respond to events DURING order execution. Defined under `<interrupts>` with `<handler>` elements:

```xml
<interrupts>
  <handler ref="AttackHandler"/>            <!-- shared handler -->

  <handler consume="false">                  <!-- inline handler -->
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

`ref="X"` references a shared interrupt handler defined elsewhere; inline handlers define conditions + actions locally. `consume="false"` lets multiple handlers fire on the same event.

See [Interrupt](/lang/aiscript/interrupt/) for the full handler reference.

## Common gotchas

- ⚠ **`'AttackInRange' default="true"` is engine-rejected at runtime.** The action is accepted, save shows it queued, but at load the engine drops it. Use `'ProtectPosition' default="true"` + queued `AttackInRange` instead. (Game-side memory.)
- ⚠ **`'ProtectPosition'` destination must be `[sector, position]`, not bare sector.** Vanilla aiscript reads `$destination.{1}` (sector) and `$destination.{2}` (position) — bare sector ref breaks both lookups with null errors.
- ⚠ **`type="internal"` params are NOT user-editable.** Trying `<edit_order_param>` on an internal param fails silently. Mark as editable explicitly: `editable="true"` on the `<param>`.
- ⚠ **`this.ship` vs `this.assignedcontrolled`.** `this.ship` is the ship the order's entity is on (typically the same). `this.assignedcontrolled` is the controllable the entity has authority over. For multi-ship orders (commander operating subordinates), they differ.
- ⚠ **`allowinloop="false"` blocks the order from the player's loop UI.** Use this for one-shot orders that shouldn't repeat (e.g. `'Wait'` with timeout).
- ⚠ **`<patch sinceversion="N">` runs when loading a save from version < N.** Test save compatibility by loading old saves after a version bump.
- ⚠ **Default expressions evaluate in the order's scope at runtime.** Don't reference variables that don't exist yet — use literals or `this.ship.X` accessors.
- ⚠ **Order ids are case-sensitive strings.** `'Wait'` ≠ `'wait'`. Vanilla convention is PascalCase.
- ⚠ **Interrupts run while `<actions>` is paused.** They CAN modify state but should be brief — long-running interrupts block the main action flow.

## Examples

### Example 1: Minimal order

```xml
<?xml version="1.0" encoding="utf-8" ?>
<aiscript name="order.mlog_hello" version="1">

  <order id="MyHello"
      name="{1, 1}"
      description="{1, 2}"
      category="navigation">
    <params>
      <param name="duration" type="time"
          default="60s" text="{1041, 99}"/>
    </params>
  </order>

  <actions>
    <debug_text text="'Hello world from MyHello order'"/>
    <wait min="$duration" max="$duration"/>
  </actions>

</aiscript>
```

Minimal order — declares one parameter, waits for the duration, logs once.

### Example 2: Order with interrupt

```xml
<?xml version="1.0" encoding="utf-8" ?>
<aiscript name="order.mlog_patrol" version="1">

  <order id="MyPatrol"
      name="{1, 10}"
      category="navigation"
      allowinloop="true">
    <params>
      <param name="space" type="object"
          default="this.ship.sector"/>
    </params>
  </order>

  <actions>
    <do_while value="true">
      <run_script name="lib.move.zonewander">
        <param name="space" value="$space"/>
      </run_script>
      <wait min="10s" max="30s"/>
    </do_while>
  </actions>

  <interrupts>
    <handler ref="AttackHandler"/>
    <handler ref="MissileLockHandler"/>
  </interrupts>

</aiscript>
```

Reuses vanilla handler refs.

### Example 3: Patched param for save migration

```xml
<param name="aggressive" type="bool" default="true">
  <patch value="false" sinceversion="2"/>
</param>
```

Saves from version 1 load with `aggressive=false`; v2+ default is `true`.

## Architectural context

- **179 vanilla order files.** Modders should grep `aiscripts/order.X.xml` for similar orders to copy.
- **MD vs Aiscript:** MD defines mission cues; aiscript defines ship behaviour. They communicate via `<signal_objects>` / `<event_cue_signalled>`.
- **Order versioning:** Save compatibility is tricky. Test load with old saves after every order schema change.

## Related

- [Order (game-side)](/game/behavior/order/) — sister concept (runtime: "ship is doing X").
- [Interrupt](/lang/aiscript/interrupt/) — handlers used in `<interrupts>` block.
- [Attention](/lang/aiscript/attention/) — `<attention>` block branching.
- [Aiscript overview](/lang/aiscript/) — broader context.
- [MD Framework Cue](/lang/md-framework/cue/) — parallel concept for MD scripts.

---

:::tip[Pattern — schema for ship behaviour]
Order definition is **the language-side template** for what ships do. Pair this page with the game-side [Order](/game/behavior/order/) when designing new behaviours: game-side teaches you the *runtime view* (state, queue, lifecycle); this page teaches you the *authoring view* (params, actions, interrupts).
:::

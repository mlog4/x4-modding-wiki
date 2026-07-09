---
title: Assignment
description: A subordinate ship's role under its commander — escort, defence, mining, trade. Cosmetic/categorical only; doesn't drive skill or behaviour selection.
---

An **Assignment** is a subordinate ship's role under its commander — escort, mining, defence, attack, etc. Assignments are mostly cosmetic / categorical — they don't directly drive AI behaviour (orders do that) but tag the ship for UI grouping.

**Inheritance:** `dbdata → assignment`.

## Properties

| Property | Type | Description |
|---|---|---|
| `.name` | string | Display name (e.g. "Escort") |
| `.rawname` | string | Raw text entry reference |
| `.description` | string | Description |
| `.icon` | string | Icon for the UI |

That's the complete datatype. Vanilla assignment enum values:

- `assignment.escort`
- `assignment.attack`
- `assignment.defence`
- `assignment.positiondefence`
- `assignment.mining`
- `assignment.trade`
- `assignment.intercept`

## Common patterns

### "Set a ship's assignment"

```xml
<set_command
    commander="$flagship"
    assignment="assignment.escort"
    name="$escort"/>
```

Pattern from [Ship → Actions → Set commander](/game/objects/ship/#set-commander-subordination).

### "Read a ship's assignment"

```xml
<set_value name="$role"
    exact="$ship.assignment"/>

<do_if value="$role == assignment.mining">
    <!-- this is a mining subordinate -->
</do_if>
```

`.assignment` is on [Controllable](/game/objects/controllable/).

### "Filter subordinates by assignment"

```xml
<set_value name="$Miners"
    exact="$Flagship.subordinates.{assignment.mining}"/>
```

`.subordinates.{assignment.X}` is on [Controllable](/game/objects/controllable/) — returns only subordinates with the matching assignment.

## Common gotchas

- ⚠ **Assignment doesn't drive AI orders directly.** A ship with `assignment.escort` doesn't automatically follow the commander — you must also issue an `Escort` order. Assignment is the label; order is the behaviour.
- ⚠ **`assignment.positiondefence` is a special subgroup.** Detached subordinate groups with this assignment expose extra accessors (`subordinategroupprotectedsector`, etc.) on the commander — see [Ship → Properties → Ownership and command](/game/objects/ship/#ownership-and-command).
- ⚠ **Assignment changes at runtime.** Use `set_command` to switch a subordinate's assignment. The order may also need re-issuing.

## Related

- [Ship](/game/objects/ship/) — `.assignment` accessor.
- [Order](/game/behavior/order/) — what actually drives behaviour.
- [Controllable](/game/objects/controllable/) — `.subordinates.{assignment.X}` accessor.

---

:::tip[Pattern — label without behaviour]
Assignment is a *categorical tag* — it groups subordinates for UI and for some specialised assignment behaviours (`positiondefence`) but doesn't drive normal AI. Pair with the right order to make it functional.
:::

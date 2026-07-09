---
title: Scanner
description: Empty destructible datatype for ship/station scanner components. All meaningful state lives on the parent Controllable's hasscanner / maxscanlevel accessors.
---

A **Scanner** is the destructible component that provides radar and scan capabilities to a [Ship](/game/objects/ship/) or [Station](/game/objects/station/). Like [Shield generator](/game/objects/shield-generator/), the `scanner` datatype declares **no own properties** — its capabilities are exposed at the parent [Controllable](/game/objects/controllable/) level.

**Inheritance:** `component → destructible → scanner`. Extends `destructible` directly, **not** `object`.

## Properties

There are no scanner-specific properties (`scriptproperties.xml:1160`). Use:

- **Inherited from `destructible`:** `.hull`, `.hullpercentage`, `.parent`

### Parent-side accessors (where scanner state actually lives)

| Parent property (on [Controllable](/game/objects/controllable/)) | Description |
|---|---|
| `.hasscanner` | Has scanner software installed |
| `.longrange` | Has long-range scanner software |
| `.maxscanlevel` | Highest scan level (1-3 in vanilla) |
| `.software.longrange` | Currently installed long-range scanner ware |

Reading `Ship.maxscanlevel` is the canonical "what can this ship scan" query — used heavily by vanilla scenarios for secrecy mechanics.

## Common patterns

### "Is this ship scanner-capable enough to read a module's secrets?"

Pattern from vanilla `scenario_tutorials.xml:10568, 10601`:

```xml
<do_if value="$module.revealedpercentage gt 0
    and $module.revealedpercentage lt 100
    and $module.secrecylevel gt player.ship.maxscanlevel">
    <!-- player needs better scanner to fully reveal -->
</do_if>
```

The `.secrecylevel` on the target module is the "lock level"; `.maxscanlevel` on the scanning ship is the "key level". Player needs ≥ secrecy to fully reveal.

### "Does the player have long-range scanner installed?"

```xml
<do_if value="player.ship.longrange">
    <!-- long-range scan available -->
</do_if>
```

Pattern from `x4ep1_mentor_subscription.xml:1812`, `modes.xml:34` (negated for error gating).

### "Find scanners on a specific ship"

```xml
<find_object_component
    name="$Scanners"
    multiple="true"
    object="$Ship"
    class="class.scanner"/>
```

Use this only when you need to read scanner-component damage state. For "can this ship scan", read the parent's `.hasscanner` / `.maxscanlevel` directly.

## Events

No `event_scanner_X` family. Standard component events:

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Scanner destroyed | Filter on `class.scanner`. Parent's `.hasscanner` becomes false |
| `event_object_attacked` | Scanner attacked | Standard |

## Common gotchas

- ⚠ **Scanner declares NO datatype properties.** Same pattern as [Shield generator](/game/objects/shield-generator/) — all capability state on the parent.
- ⚠ **`scanner` extends `destructible`, NOT `object`.** No `.sector` directly.
- ⚠ **`maxscanlevel` is the MAX, not current.** A ship in combat may have its effective scan level reduced by damage; `maxscanlevel` reports the equipped maximum.
- ⚠ **Long-range vs short-range are distinct softwares.** `Ship.longrange` is true only with the long-range scanner ware installed; standard scanner sets `.hasscanner` but not `.longrange`.
- ⚠ **NPC ships have scanners too, with their own `maxscanlevel`.** Don't assume only the player needs to be scanner-checked.

## Architectural context

- **Secrecy / reveal mechanic:** Architectural overview *Scan mechanic* — how `.secrecylevel` on targets gates information disclosure based on scanner `.maxscanlevel`.
- **Long-range scan usage:** Architectural overview *Long-range mode* — UI mode that depends on `.longrange` ware.

## Related

- [Ship](/game/objects/ship/) — host; `.hasscanner`, `.maxscanlevel`, `.longrange` live here.
- [Station](/game/objects/station/) — also hosts scanners.
- [Controllable](/game/objects/controllable/) — the parent type that aggregates scanner accessors.
- [Shield generator](/game/objects/shield-generator/) — sibling empty-datatype destructible.
- [Engine](/game/objects/engine/) / [Weapon](/game/objects/weapon/) — sibling destructible components (these DO have datatype properties).
- [Ware](/game/economy/ware/) — `ware.software_scanner*`, `ware.software_longrange*` are the equip-able items.

---

:::tip[Pattern — empty datatype with parent-side aggregate]
Scanner is one of six [empty-datatype classes](/game/objects/shield-generator/#scanner-comparison) in the API. All have the same shape: class exists for engine filtering; meaningful state is on the parent. Look at the parent (`Controllable.hasscanner`, `Defensible.shield`) for the actual values.
:::

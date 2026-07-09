---
title: Ad sign
description: Destructible billboard / display sign attached to a station. Empty datatype. The player can shoot them out for minor consequences.
---

An **Ad sign** is a destructible billboard or display sign attached to a [Station](/game/objects/station/). They're cosmetic — visible from outside the station, can be shot down by the player, and contribute minor faction-relation consequences when destroyed.

**Inheritance:** `component → destructible → adsign`. The datatype is **empty** (`scriptproperties.xml:983`) — class label only.

## Properties

There are no adsign-specific properties. Use:

- **Inherited from `destructible`:** `.hull`, `.hullpercentage`, `.parent`

## Common patterns

### "React to ad sign destruction"

Vanilla `notifications.xml:101` uses this for narrator quips when the player shoots out signs:

```xml
<do_elseif value="event.param.isclass.adsign">
    <!-- narrator: 'that was someone's livelihood' -->
</do_elseif>
```

### "Find ad signs on a station"

```xml
<find_object_component
    name="$Signs"
    object="$Station"
    class="class.adsign"
    multiple="true"/>
```

Rarely useful — modders typically don't care about individual ad signs.

## Events

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Ad sign shot down | Filter `event.object.isclass.{class.adsign}` |
| `event_object_attacked` | Ad sign attacked | Standard |

## Common gotchas

- ⚠ **Ad sign declares NO datatype properties.** Empty class label, like [Scanner](/game/objects/scanner/), [Shield generator](/game/objects/shield-generator/), [Welfare module](/game/objects/welfare-module/).
- ⚠ **Destroying ad signs may impact faction relations.** The owning faction notices. Small negative hit; not zero. Vanilla doesn't expose the exact value — read the relation delta if your mod needs to track it.
- ⚠ **Ad signs are not in `Station.modules`.** They're attached components, not modules. Use `find_object_component` rather than iterating `.modules`.
- ⚠ **Most mods can ignore ad signs.** They contribute nothing to gameplay loops. The class exists primarily for narrator content (vanilla `notifications.xml`).

## Related

- [Station](/game/objects/station/) — host.
- [Destructible](/game/objects/destructible/) — parent type.

---

:::tip[Pattern — pure-flavour class]
Ad sign is a *pure-flavour class* — it exists for atmospheric content (narrator commentary, visual destruction). No gameplay loop requires it. Includable in audit listings but skipable for most mods.
:::

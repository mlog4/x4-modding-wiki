---
title: Collectable blueprints
description: Floating blueprint drop — gives the player blueprint wares on pickup. Rare, mission-tied.
---

A **Collectable blueprints** is a floating pickup that grants the player blueprint wares. Rare in vanilla — typically dropped by specific story missions or rewards, not random loot.

**Inheritance:** `component → destructible → object → drop → collectable → collectableblueprints`.

## Properties

### Collectable-blueprints-specific

| Property | Type | Description |
|---|---|---|
| `.blueprints` | warelist | Blueprint wares contained — added to player's blueprint set on pickup |

### Useful inherited

| Property | Source | Description |
|---|---|---|
| `.sector` / `.position` | object | Location |
| `.macro` | component | Macro |

## Common patterns

### "Spawn a blueprint pickup as a mission reward"

```xml
<create_object
    name="$Drop"
    macro="$BlueprintDropMacro"
    owner="faction.ownerless"
    sector="$Sector">
    <position x="$x" y="$y" z="$z"/>
</create_object>

<!-- Mission cue typically configures .blueprints on macro side -->
```

For runtime-attached blueprints, vanilla uses `<add_blueprints>` directly to the player (not via collectable):

```xml
<add_blueprints wares="[ware.module_X, ware.module_Y]"/>
```

That's a more reliable path than spawning a physical collectable.

### "Listen for player picking up a blueprint drop"

```xml
<cue name="WatchBlueprintPickup" instantiate="true">
    <conditions>
        <event_object_destroyed/>
        <check_value
            value="event.object.isclass.{class.collectableblueprints}
                and event.param.isplayerowned"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player picked up blueprints'"/>
    </actions>
</cue>
```

## Events

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Player picked it up | Standard |

## Common gotchas

- ⚠ **`.blueprints` is a warelist of *blueprint* wares.** A blueprint ware is the unlock token, not the produced item. Check `$ware.isresearchable` or naming convention (`ware.module_*`) to identify.
- ⚠ **Vanilla rarely uses physical blueprint drops.** Most blueprint grants go through `<add_blueprints wares=>` directly. Use the collectable form only when you specifically want a "fly to this location" UX.
- ⚠ **Pickup doesn't always add the blueprints automatically.** Some mission scripts attach a cue that listens for `event_object_destroyed` on the drop and explicitly calls `<add_blueprints>` — the collectable is a marker, not a guaranteed delivery.

## Related

- [Collectable](/game/objects/collectable/) — parent.
- [Ware](/game/economy/ware/) — blueprint wares (e.g. `ware.module_gen_dock_m_venturer_01`).
- [Ship](/game/objects/ship/) — what triggers pickup via fly-over.
- [Station](/game/objects/station/) — common host (HQ blueprint vault).

---

:::tip[Pattern — collectable as physical UX marker]
Collectableblueprints is the canonical "engineering reward as physical object". Most actual blueprint grants in vanilla use `<add_blueprints>` directly; the collectable form exists for UX moments where the player should physically fly to the reward.
:::

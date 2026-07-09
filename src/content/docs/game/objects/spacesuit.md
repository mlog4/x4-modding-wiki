---
title: Spacesuit
description: Player EVA suit. A specialised ship_xs subtype with oxygen tracking. Spawned when the player abandons their ship.
---

A **Spacesuit** is the player's EVA (extra-vehicular activity) suit — what they're in after abandoning a ship. Spacesuit is a specialised [Ship](/game/objects/ship/) subtype with oxygen tracking — it's the only ship type that runs out of life support if you stay outside too long.

**Inheritance:** `component → destructible → object → controllable → defensible → container → ship → spacesuit`.

## Properties

### Spacesuit-specific

| Property | Type | Description |
|---|---|---|
| `.oxygenempty` | bool | Suit is out of oxygen (player dies) |
| `.oxygenlow` | bool | Low oxygen warning threshold |
| `.oxygenpercentage` | float | Remaining oxygen (0..1) |
| `.oxygentimeremaining` | time | Seconds until depletion |

That's all the spacesuit datatype adds. Everything else is inherited from [Ship](/game/objects/ship/).

### Useful inherited

| Property | Source | Description |
|---|---|---|
| `.knownname` | component | Suit display name |
| `.macro` | component | Spacesuit macro |
| `.sector` / `.position` | object | Where the player is |
| `.cargo` | container | Suit cargo (limited) |

## When a spacesuit exists

A spacesuit only exists when the player is in EVA mode:

| State | `player.spacesuit` | `player.occupiedship` |
|---|---|---|
| Piloting a ship | null | the ship |
| On a station | null | null |
| In spacesuit | the spacesuit | null (if not piloting) |
| Spacesuit + jumped to ship | null | the ship |

The player can `<eject>` from a ship into EVA; spacesuit appears. Re-entering a ship transitions back. The spacesuit is a per-session object — it's not persistent across save/load reliably.

## Common patterns

### "Is the player in EVA"

```xml
<do_if value="@player.spacesuit">
    <!-- in EVA mode -->
</do_if>
```

### "Oxygen warning"

```xml
<do_if value="@player.spacesuit
    and player.spacesuit.oxygenlow
    and not player.spacesuit.oxygenempty">
    <!-- low oxygen, warn -->
</do_if>
```

### "Eject from ship"

There's no direct `<eject>` MD action for the player — vanilla handles ejection through UI / damage events. Mods that need to programmatically eject the player typically work through `<order>` mechanics or station interactions.

## Common gotchas

- ⚠ **Spacesuit is a `ship_xs` class** — not its own size. `$ship.isclass.ship_xs` is true for spacesuit AND drones. Filter via `isclass.spacesuit` for spacesuit specifically.
- ⚠ **Spacesuit lifetime is bounded by the EVA session.** Don't store long-term references to `player.spacesuit` — the suit goes away when player re-enters a ship.
- ⚠ **Oxygen drain is engine-side.** Don't try to read/write `.oxygenpercentage` directly to control survival — engine handles it.
- ⚠ **Spacesuit has tiny cargo capacity.** Don't expect to use it as a transport. Few wares fit; valuable wares (inv_*) the player carries personally are in `player.entity.inventory`, not `player.spacesuit.cargo`.

## Cross-references

- [Ship](/game/objects/ship/) — parent datatype
- [Ship size classes](/game/objects/ship-size-classes/) — spacesuit is ship_xs
- [Player](/game/characters/player/) — `player.spacesuit` accessor
- [NPC](/game/characters/npc/) — `player.entity` for inventory

---

:::tip[Pattern — single-instance per-session subtype]
Spacesuit is the only "single-instance per session" ship subtype — it exists only while the player is in EVA. Vanilla ships are persistent; spacesuit is transient. Treat as a short-lived special case rather than a normal ship.
:::

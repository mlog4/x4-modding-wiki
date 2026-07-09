---
title: Unlock
description: A conditional discovery that grants the player blueprints, discounts, commissions, or information at a station — based on relation and secrecy thresholds.
---

An **Unlock** is a conditional discovery that triggers when the player interacts with a [Station](/game/objects/station/) (often via [Signal leak](/game/objects/signal-leak/) or scanning). Each unlock has relation / secrecy thresholds, an allowed-owner whitelist, and a category — blueprint / commission / discount / information.

**Inheritance:** `dbdata → unlock`.

## Properties

### Identity

| Property | Type | Description |
|---|---|---|
| `.id` | string | Unlock id |
| `.name` | string | Display name |
| `.rawname` | string | Raw text entry reference |
| `.description` | string | Description |

### Eligibility filters

| Property | Type | Description |
|---|---|---|
| `.allowedowners` | list | Owner factions where this unlock can trigger (empty = all) |
| `.allowedwares` | list | Wares for trade-offer location unlocks (empty = all) |
| `.minrelation` | float | Minimum relation with owner |
| `.maxrelation` | float | Maximum relation with owner |
| `.secrecylevel.min` | int | Minimum secrecy level of component |
| `.secrecylevel.max` | int | Maximum secrecy level of component |

### Category flags

| Property | Type | Description |
|---|---|---|
| `.isblueprint` | bool | Reveals a blueprint ware |
| `.iscommission` | bool | Reveals a trade commission |
| `.isdiscount` | bool | Reveals a trade discount |
| `.isinformation` | bool | Reveals information |

Exactly one of the four `.isX` flags is true per unlock.

## Common patterns

### "Branch by unlock category"

```xml
<do_if value="$unlock.isblueprint">
    <!-- gain a blueprint ware -->
</do_if>
<do_elseif value="$unlock.isdiscount">
    <!-- gain a trade discount -->
</do_elseif>
<do_elseif value="$unlock.iscommission">
    <!-- gain a trade commission -->
</do_elseif>
<do_elseif value="$unlock.isinformation">
    <!-- reveal some info -->
</do_elseif>
```

### "Check eligibility against a station"

```xml
<set_value name="$rel"
    exact="faction.player.relationto.{$Station.owner}"/>

<do_if value="$unlock.minrelation le $rel
    and $unlock.maxrelation ge $rel
    and ($unlock.allowedowners.count == 0
        or $unlock.allowedowners.indexof.{$Station.owner} gt 0)">
    <!-- player is eligible for this unlock at this station -->
</do_if>
```

## Common gotchas

- ⚠ **`.minrelation` AND `.maxrelation` both apply.** Player relation must be in `[min, max]`. Some unlocks only trigger at high relation; others trigger at LOW relation (hostile discoveries).
- ⚠ **`.allowedowners` empty = all factions.** Don't treat empty list as "no factions allowed". Empty is the universal default.
- ⚠ **`.secrecylevel.min/max` gates by scanner ability.** Player needs scanner with adequate `.maxscanlevel` to trigger high-secrecy unlocks. See [Scanner](/game/objects/scanner/).
- ⚠ **One category flag per unlock.** Vanilla mods that try to combine (e.g. "this unlock is both blueprint AND discount") are not supported by the data model.
- ⚠ **Unlocks are db-defined.** Modders add unlocks via data files (`libraries/unlocks.xml`-style), not via runtime spawning.

## Related

- [Station](/game/objects/station/) — host (`.unlocks` accessor where applicable).
- [Faction](/game/factions/faction/) — `.allowedowners` checked against station owner.
- [Signal leak](/game/objects/signal-leak/) — common unlock trigger.
- [Scanner](/game/objects/scanner/) — `.maxscanlevel` gates secrecy-level unlocks.
- [Ware](/game/economy/ware/) — `.allowedwares` for trade-offer unlocks.

---

:::tip[Pattern — conditional db reference with category flags]
Unlock is the canonical *db reference with branching categories* — same data shape as [Trade offer](/game/economy/trade-offer/) but for discovery-trigger content rather than commerce.
:::

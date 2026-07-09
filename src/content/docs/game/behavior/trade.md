---
title: Trade
description: A trade entity — a buy/sell offer at a station, or an active trade order between buyer and seller. The unit of station economy.
---

A **Trade** is either a buy/sell offer at a [Station](/game/objects/station/), or an active trade order between buyer and seller. Trades are the unit of station economy — every [Trade subscription](/game/economy/subscription/) update is a list of trades; every trade-completed event references a trade.

**Inheritance:** None — `trade` is its own root datatype. Trade is a transient operation entity, not a physical object.

## Properties

The trade datatype has ~50 properties; group by concern.

### Identity

| Property | Type | Description |
|---|---|---|
| `.exists` | bool | Trade exists |
| `.available` | bool | Exists AND is available (not blocked) |
| `.isoffer` | bool | Buy or sell offer at a station |
| `.isorder` | bool | Active trade deal between buyer/seller |
| `.isbuyoffer` | bool | Buy offer at a station |
| `.isselloffer` | bool | Sell offer at a station |
| `.ware` | ware | What's being traded |

### Parties

| Property | Type | Description |
|---|---|---|
| `.buyer` | container | Buyer if defined |
| `.seller` | container | Seller if defined |
| `.owner` | container | Owner (seller for sellOffer; buyer for buyOffer) |
| `.exchangepartner.{container}` | container | Other party — for ship-to-ship the "other" container |

### Quantities

| Property | Type | Description |
|---|---|---|
| `.amount` | int | Trade amount |
| `.desiredamount` | int | What's wanted (may exceed affordable) |
| `.offeramount` | int | Trade amount + reserved amounts |
| `.minamount` | int | Minimum trade |
| `.transferredamount` | int | Wares already moved |
| `.destroyedamount` | int | Wares destroyed (e.g. drone-shot transport) |
| `.volume` / `.offervolume` / `.minvolume` | int | Volumes (mirrors amounts) |

### Pricing

| Property | Type | Description |
|---|---|---|
| `.price` | money | Total price for amount |
| `.unitprice` | money | Per-unit price |
| `.minprice` | money | Total for minimum amount |
| `.relativeprice` | float | -1.0..+1.0 between min and max |
| `.quantityfactor` | float | current/average price ratio |
| `.hasdynamicprice` | bool | True if price not fixed (player-set) |
| `.stocklevel` | float | amount / target (signed by buy/sell) |
| `.ispricelocked.{container}` | bool | Price locked on partner's side |

### Special trade types

| Property | Type | Description |
|---|---|---|
| `.bundle` | bool | Convert ammo/units → wares on transfer |
| `.unbundle` | bool | Convert ware → ammo/units on transfer |
| `.iswareexchange` | bool | Ware/crew exchange (not normal trade) |
| `.isshiptoship` | bool | Both partners are ships |
| `.iscrewexchange` | bool | Crew movement trade |
| `.isbuyerpassive` / `.issellerpassive` | bool | Stationary party in S2S |

### Free flags (mission rewards)

| Property | Type | Description |
|---|---|---|
| `.buyfree` | bool | Buyer doesn't actually pay |
| `.sellfree` | bool | Seller doesn't receive |
| `.buyfree.{object}` / `.sellfree.{object}` | bool | Per-object overrides |
| `.ismission` | bool | Trade spawned by a mission cue |
| `.missioncue` | cue | The spawning mission cue |

### Restrictions

| Property | Type | Description |
|---|---|---|
| `.restriction.factions` | list | Faction whitelist (empty = unrestricted) |
| `.restriction.inverted` | bool | List acts as blacklist instead |
| `.cantradewith.{container}` | bool | Specific container allowed |

### Linkage

| Property | Type | Description |
|---|---|---|
| `.tradeoffer` | trade | Source offer this order derived from |

## Common patterns

### "Watch player-relevant trades complete"

See [Ware → Events](/game/economy/ware/#events) for the canonical pattern with `event_trade_completed`.

### "Filter offers vs orders"

```xml
<do_if value="$trade.isoffer">
    <!-- it's a posted offer at a station -->
</do_if>
<do_elseif value="$trade.isorder">
    <!-- it's an active deal in progress -->
</do_elseif>
```

### "Read player's pending trade volume"

```xml
<set_value name="$total" exact="0"/>
<do_for_each name="$trade" in="player.ship.tradeorders">
    <set_value name="$total"
        operation="add"
        exact="$trade.volume"/>
</do_for_each>
```

## Common gotchas

- ⚠ **`.amount` vs `.desiredamount` vs `.offeramount`** — three different quantities: actual current amount, what the buyer wants (regardless of affordability), and amount-plus-reservations. Don't conflate.
- ⚠ **`.bundle` / `.unbundle` change content type on transfer.** A bundle trade converts ammo/units into wares; unbundle does the reverse. Check before assuming "wares in = wares out".
- ⚠ **Free trades still transfer wares.** `.buyfree=true` means the buyer pays nothing; the wares still move. Use for mission-reward trades that don't drain the treasury.
- ⚠ **Restriction list is a whitelist by default.** `.restriction.inverted=true` flips it to a blacklist. Read both fields to interpret correctly.
- ⚠ **Ship-to-ship trades have one stationary party.** `.isbuyerpassive` / `.issellerpassive` mark which side waits. Used for mining-ship-to-trader exchanges.

## Related

- [Trade offer](/game/economy/trade-offer/) — the user-facing concept that maps to `.isoffer` trades.
- [Ware](/game/economy/ware/) — what's traded.
- [Container](/game/objects/container/) — both parties.
- [Subscription](/game/economy/subscription/) — how players see trades.

---

:::tip[Pattern — transient operation entity with rich event surface]
Trade is the canonical *transient business entity* — created by stations/missions, completed/cancelled within seconds-to-minutes, fires the `event_trade_completed` event family. Same shape as [Build](/game/behavior/build/) (transient build task).
:::

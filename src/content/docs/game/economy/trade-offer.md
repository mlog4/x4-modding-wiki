---
title: Trade offer
description: Engine class for trade offers + orders. Single 'trade' type covers buy/sell offers + accepted orders. ~30 properties for amount, price, stock, mission integration.
---

A **Trade offer** (engine class: `trade`) is X4's representation of **buy offers, sell offers, and trade orders (deals)**. The same `trade` type covers all three — distinguished via `.isbuyoffer` / `.isselloffer` / `.isoffer` / `.isorder` flags.

## Properties

### Existence + availability

| Property | Type | Description |
|---|---|---|
| `.exists` | boolean | Trade exists |
| `.available` | boolean | Trade exists and is available |
| `.isbuyoffer` | boolean | Is a buy offer |
| `.isselloffer` | boolean | Is a sell offer |
| `.isoffer` | boolean | Is an offer (buy or sell) |
| `.isorder` | boolean | Is an order (accepted deal) |

### Parties

| Property | Type | Description |
|---|---|---|
| `.buyer` | container | Buyer container |
| `.seller` | container | Seller container |
| `.owner` | container | Owner (seller or buyer) |

### Ware + amount

| Property | Type | Description |
|---|---|---|
| `.ware` | ware | Trade ware |
| `.amount` | integer | Trade amount |
| `.desiredamount` | integer | Trade desired amount (may exceed affordable) |
| `.offeramount` | integer | Trade amount + reserved |
| `.offeramount.{$object}` | integer | Trade amount + reserved for $object |
| `.minamount` | integer | Minimum trade amount |
| `.transferredamount` | integer | Wares transferred for this trade |
| `.destroyedamount` | integer | Wares destroyed for this trade |
| `.volume` | integer | Total volume of trade amount |
| `.offervolume` | integer | Trade volume + reserved |
| `.offervolume.{$object}` | integer | Trade volume + reserved for $object |
| `.minvolume` | integer | Volume of minimum amount |

### Price

| Property | Type | Description |
|---|---|---|
| `.price` | money | Total price of trade amount |
| `.unitprice` | money | Price per single unit |
| `.minprice` | money | Total price of minimum amount |
| `.relativeprice` | float | Current price between min and max (-1.0 to +1.0) |
| `.quantityfactor` | float | Current/average price ratio |
| `.hasdynamicprice` | boolean | Price not fixed (e.g., player-set) |

### Stock level

| Property | Type | Description |
|---|---|---|
| `.stocklevel` | float | Trade amount / target amount ratio |
| `.stocklevel.{$amount}` | float | Amount / target amount ratio |

### Price locking

| Property | Type | Description |
|---|---|---|
| `.ispricelocked.{$container}` | boolean | Price locked on $container's trade partner |

### Bundle / unbundle

| Property | Type | Description |
|---|---|---|
| `.bundle` | boolean | Flagged for converting ammo/units → wares on transfer |
| `.unbundle` | boolean | Flagged for converting ware → ammo/units on transfer |

### Mission integration

| Property | Type | Description |
|---|---|---|
| `.ismission` | boolean | Trade spawned by mission cue |
| `.missioncue` | cue | Mission cue used |
| `.tradeoffer` | trade | Source trade offer (for orders) |

### Free trades (for mission rewards)

| Property | Type | Description |
|---|---|---|
| `.buyfree` | boolean | Buyer doesn't spend money |
| `.buyfree.{$object}` | boolean | Free for specific buyer |
| `.sellfree` | boolean | Seller doesn't receive money |
| `.sellfree.{$object}` | boolean | Free for specific seller |

## Common access patterns

### "List a station's sell offers"

```xml
<set_value name="$offers" exact="$station.tradeoffers.sell.list"/>
<do_for_each name="$offer" in="$offers">
    <write_to_logbook text="$offer.ware.name + ': ' + $offer.unitprice + 'Cr'"/>
</do_for_each>
```

### "Get a station's current sell price for a ware"

```xml
<set_value name="$price" exact="$station.sellprices.{ware.advancedcomposites}"/>
```

### "Check if trade offer is part of a mission"

```xml
<do_if value="$trade.ismission">
    <write_to_logbook text="'Mission offer: ' + $trade.missioncue.name"/>
</do_if>
```

### "Reserve trade amount for a specific buyer"

```xml
<set_value name="$reserved" exact="$trade.offeramount.{$myShip}"/>
```

## Common gotchas

- ⚠ **The same `trade` type covers offers AND orders.** Always check `.isoffer` vs `.isorder` before assuming meaning.
- ⚠ **`.amount` reflects current state; use `.offeramount.{$object}` for reservation-aware accounting** when working with specific buyer/seller.
- ⚠ **`.price` is the TOTAL** — use `.unitprice` for per-unit calculations.
- ⚠ **`.relativeprice` ranges -1.0 to +1.0** — not 0..1 or percentage. -1 = minimum price, +1 = maximum.
- ⚠ **Mission trades may be `.buyfree` or `.sellfree`** — your economy mod's accounting must handle these.
- ⚠ **`.tradeoffer` links orders back to source offers** — useful for understanding fulfilment.

## Common actions

| Action | Purpose |
|---|---|
| `<create_trade_offer>` | Spawn a new trade offer |
| `<remove_trade_offer>` | Remove an offer |
| `<transfer_money>` | Money transfer (part of trade flow) |
| `<transfer_inventory>` | Ware transfer (part of trade flow) |

## Related

- [Ware](/game/economy/ware/) — what trade exchanges
- [Container](/game/objects/container/) — owns trade offers
- [Cargo](/game/economy/cargo/) — what trades modify
- [Faction](/game/factions/faction/) — owner of trade contracts
- [Reward calculation](/overviews/reward-calculation/) — how mission trades price

---

*Trade offer is the central economic abstraction. Stations expose them as `.tradeoffers.*`, missions create them programmatically, and the price mechanics drive the entire X4 economy.*

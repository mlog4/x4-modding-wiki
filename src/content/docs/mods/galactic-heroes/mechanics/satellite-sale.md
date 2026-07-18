---
title: Satellite Sale to Factions
description: Sell your own basic or advanced satellites to any faction with rep ≥ +10 for cash based on the intel they contain — enemy fleets, stations, or Kha'ak infrastructure inside the satellite's radar coverage.
---

You can deploy your own satellite in a hot border sector, then **sell it to a faction** who wants the intelligence. If the satellite's radar sees enemy stations, hostile fleets, or Kha'ak hive structures inside its coverage area — and the buyer faction doesn't already know about those objects — they'll pay you for the intel.

This is a player-driven revenue path that turns the mod's information layer into gameplay. Deploy a network of satellites → sell each to the faction that cares most about what it sees → get paid per confirmed piece of intel.

## Access

Right-click your own deployed satellite (Interact_Menu_API) → **"Sell to faction..."** context menu.

Requirements:

- **Satellite must be yours** (`$sat.owner == faction.player`)
- **Satellite must be basic or advanced type** — specifically `eq_arg_satellite_01_macro` (basic, ~30 km radar) or `eq_arg_satellite_02_macro` (advanced, ~75-200 km radar)
- **Buyer faction must have rep ≥ +10** with you (`player.relationto.{$faction}.uivalue gt +10`)
- Excluded targets: mines, beacons, probes, laser towers — only satellites

## What counts as valuable intel

For each buyer faction, the mod scans everything inside the satellite's radar radius and asks two questions:

1. **Is this object useful to them?** — the object must be an enemy (`$faction.relationto.{$obj.owner}.uivalue le -25`) OR Kha'ak (always considered a threat by everyone)
2. **Do they already know about it?** — the mod runs a faction radar coverage scan. For every object in the satellite's radar, it checks whether the buyer faction has another satellite / station / ship with radar coverage over the same object. If yes, they already know — no new intel value.

Only **new intel on hostile targets** counts toward the price.

## Compensation table

Prices scale by **object type** and by **how far the object is from the buyer faction's home space**. The idea: intel in your own backyard is critical, intel in enemy space is less relevant, intel deep in unclaimed space is nearly worthless.

| Object type | On buyer faction's own sector | 1-hop neutral or enemy | > 1 hop |
|---|---|---|---|
| **Vanilla enemy station** (relation ≤ −25) | **500,000 cr** | 250,000 cr | 0 (free transfer) |
| **Vanilla enemy fleet** (L/XL capital OR M-class warship with subordinates) | **100,000 cr** | 50,000 cr | 0 |
| **Kha'ak hive / outpost** | **500,000 cr** | 250,000 cr | 0 |
| **Kha'ak defence platform** | **40,000 cr** | 20,000 cr | 0 |

**Multiple objects in one satellite's radar = sum of individual prices.** A well-placed advanced satellite in a hot border sector can see:

- 1× enemy Xenon station in own sector: 500 k
- 2× enemy Xenon Ks in own sector: 200 k (2 × 100 k)
- 3× Kha'ak defence platforms adjacent: 60 k (3 × 20 k)
- **Total: 760 k cr** for one sale

## What defines a "fleet"

Not every enemy warship counts — only leaders. Specifically:

- **L or XL capital ship as flagship** — always counts
- **M-class warship with `subordinates.count > 0`** — a corvette leading fighters is a fleet leader
- **M or S warship alone** — doesn't count (it's just a patrol, not a fleet)

Reward is per leader, not per ship-in-fleet — the intel value is "a coordinated force is here", not "N ships".

## Preview UI

The context menu shows a **preview panel** with per-faction breakdown:

- Argon Federation: 760,000 cr — 1 enemy station + 2 fleets in own sector
- Antigone Republic: 250,000 cr — 1 enemy station 1-hop away
- Teladi Company: 0 cr — no valuable objects visible OR they already know
- (etc. for every eligible faction with rep ≥ +10)

**Live computation** — the preview recalculates each time you open the menu (satellite may have gained/lost visibility since deployment).

**Snapshot at click** — the actual reward is snapshotted at the moment you click "Sell" on a specific faction. If the enemy fleet moves out of the satellite's radar between preview-open and sell-click, you still get paid for what was there at click-time.

## What happens on sale

1. **Money transfers:** `transfer_money` from buyer faction to player (using the snapshotted reward)
2. **Ownership transfers:** `change_object_owner` — the satellite now belongs to the buyer faction
3. **Radar coverage becomes theirs:** the buyer faction now has ongoing radar of that area (adding your satellite to their intel network)
4. **You lose the satellite** — it's no longer yours to deploy elsewhere or sell again to another faction

**One satellite = one sale.** Once transferred, the buyer owns it. If they later lose it to Kha'ak or Xenon aggression, that's their problem.

## Design intent

- **Reward observation.** The mod encourages the player to place satellites in interesting places. This mechanic turns "place satellite in border sector" from pure map-coverage into an income stream.
- **Faction identity through preference.** Argon buys different intel than Teladi. Argon cares about Xenon stations near Argon Prime; Teladi cares about Argon fleets near Teladi space. Your satellite location determines who's the best buyer.
- **Player agency in intel economy.** Faction radar networks aren't infinite. You can extend a faction's awareness by selling them satellites at strategic points — sometimes in exchange for their attention on your enemies.

## Example playthrough

You're patrolling near the Argon-Xenon border. You deploy an advanced satellite in "Silent Witness III" (Argon-owned, hot with Xenon activity).

- Open the map → right-click your satellite → **Sell to faction...**
- Preview panel opens:
  - **Argon Federation: 760,000 cr** (1 Xenon station + 2 Xenon Ks visible in own sector)
  - **Antigone Republic: 250,000 cr** (1 Xenon station 1-hop away, they don't know yet)
  - Others: 0 (no new intel or too far)
- Click Argon Federation — sell.
- +760,000 cr in your wallet.
- Satellite is now Argon's — you see it flip color on the map.
- The Argon admiral in Argon Prime (Sarah Kowalski, per current save) now gets updated threat feeds on those Xenon assets. Her next HeroManager tick may commit to a **sector reclaim** decision using the new intel.

Your intel just influenced faction military behaviour. That's the whole point.

## Configuration

The reward table lives in `MlogSatSaleInit` init actions in `mlog_heroes_satellite_sale.xml`. If you want to rebalance (e.g. 10× rewards for a "black market" playthrough), edit the numbers there.

## What's next

- **Advanced-satellite tier bonus** _(design pending)_ — currently basic and advanced pay the same per object, but the advanced radar radius covers ~5-10× the area. Future: advanced satellite reward multiplier for the wider coverage.
- **Faction-to-faction resale** _(concept)_ — buyer faction could later resell the intel to their allies. Not implemented; would need cross-faction rep bookkeeping.
- **Time-decay on intel value** _(design open)_ — currently intel value is snapshot-at-sale. A future feature could decay value if the fleet leaves quickly, encouraging opportunistic timing.

## Related mechanics

- [Faction Missions](../faction-missions/) — another player-driven revenue path
- [Perks system](../perks/) — cash rewards from satellite sales feed hero cash → LEARN progression

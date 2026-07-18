---
title: Recovery Points
description: Recovery Points (RP) are the resource that funds hero fleet rebuilding. Tick rates, ship costs, the 200-cap, and why full rebuild takes at least 25 minutes.
---

**Recovery Points (RP)** are the mod-side currency that funds a hero's fleet rebuilding after loss. Every living hero accumulates RP over game time; every ship the mod builds for a hero costs RP. The system is designed to make recovery **gradual**, not instant — a faction that just lost an admiral's fleet takes time to put a replacement in the field.

## Accumulation

Every hero in state `active` or `lost_flagship` (with cooldown elapsed) gets RP on a **5-minute game-time cron tick**. The rate scales with star rank:

| Hero rank | RP per tick (5 min) |
|---|---|
| ★ | 10 |
| ★★ | 20 |
| ★★★ | 40 |
| ★★★★ | 80 |

Higher-rank heroes accumulate faster — the design assumes senior officers have more faction support behind them.

**Cap = 200 RP.** Additional RP is thrown away — you cannot stockpile forever. This is deliberate: it forces the player and the mod to make choices about which ship to rebuild first, when to hold a wounded hero back to bank RP, and when to commit to expensive rebuilds.

**RP does not tick during:**

- **Death cooldown** — the period between a wounded / unscathed outcome and when the hero starts rebuilding. See [Death cycle](../death-cycle/).
- **Lineage vacancy** — the period between KIA and when a successor spawns. The RP register does not exist yet for the future bearer.

## Ship costs

Each ship class has an RP cost when the mod builds it for a hero:

| Ship class | RP cost |
|---|---|
| S (fighter) | 5 |
| M (corvette) | 10 |
| L (destroyer) | 40 |
| XL (capital) | 100 |

Ship cost **includes full crew** — captain, service, gunners. The mod handles it. The player never needs to supply the faction with a boarding party or logistics chain.

## Rebuild pace

The spend logic is deliberate — the mod builds **at most one ship per tick**. On every tick, for each hero whose state allows rebuild:

1. If the hero has no flagship → try to build the flagship first. If `$recovery_points >= flagship_cost` → create ship, deduct RP, add to fleet group.
2. Otherwise, if the escort is short of expected count → try to build **the largest missing escort ship** (L before M before S). If enough RP → build, deduct.
3. Otherwise → nothing this tick. RP keeps accumulating up to the 200 cap.

Result: a hero at ★★★★ who needs to rebuild a full **1 L + 4 M + 4 S** fleet (40 + 40 + 20 = 100 RP total ignoring escorts sub-costs) still takes at least **9 rebuild ticks = 45 minutes of game time** even if RP is in surplus. There is no instant respawn.

This creates the "faction is regrouping" feel:

- The player sees the hero on the map with just their flagship and one escort.
- Ten minutes later, another escort has joined.
- Twenty minutes later, the second capital ship arrives.
- The fleet slowly re-forms over the course of an in-game hour.

## Interaction with star rank

Higher-rank heroes recover faster in two dimensions:

- **RP tick is higher** (★★★★ = 80/tick vs ★ = 10/tick, 8× multiplier)
- **They still need more expensive ships** (★★★★ builds up to XL @ 100 RP; ★ tops out at L @ 40 RP)

Net effect: a ★★★★ hero recovers a full top-tier fleet in ~2 hours of game time; a ★ hero recovers a basic fleet in ~1 hour. Both feel meaningful because higher-rank losses are also bigger in absolute value.

## Interaction with death cycle

- After a **wounded** outcome: 120 min cooldown → RP tick resumes → rebuild starts.
- After an **unscathed** outcome: 30 min cooldown → RP tick resumes → rebuild starts.
- After a **KIA** outcome: no rebuild. The successor (if any) starts with 0 RP and gets a **full starting fleet as an initial grant** (bypassing the RP system for the first spawn). Then normal accumulation resumes.

The initial-grant rule for new bearers is a design compromise. Without it, every succession would leave the faction with no admiral for another hour. With it, the faction always has a functional officer as soon as the lineage cooldown expires.

## Player intervention _(planned)_

The concept doc calls out a future feature: **player supplies RP directly** to a favoured hero to accelerate their recovery. Not yet shipped. The interaction path will likely be a "Sponsor recovery" button on the hero detail page, gated behind player rep with the faction.

Once shipped, it will let the player:

- Save a favoured admiral from a slow rebuild
- Gain rep with the faction for the sponsorship
- Feel investment in the individual character, not just the faction

## UI

![Captain Sarah Kowalski detail page — Recovery points 65 / 200 (+2 / 2 min), 4/4 S escorts filled, active perks Logistic (+50% RP accrual) and Master Logistic (+100% RP accrual)](/x4-modding-wiki/img/mods/galactic-heroes/rp-balance.jpg)

The hero detail page shows:

- Current RP / cap (e.g. `160 / 200`)
- Next expected build (which ship class, when the next tick will spend)
- Fleet status (flagship + escort composition, missing slots highlighted)

## Related mechanics

- [Death cycle](../death-cycle/) — when RP starts / stops flowing
- [Lineage succession](../lineage-succession/) — why new bearers get a starting-fleet grant
- [XP and star progression](../xp-and-stars/) — why higher-rank heroes accumulate RP faster

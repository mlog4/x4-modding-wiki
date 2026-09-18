---
title: Recovery Points
description: Recovery Points fund a hero's fleet rebuilding — a doubling rate per star, a 200 cap, ship costs from 5 to 200 RP, and a rebuild that spends the whole balance in one tick rather than trickling.
---

**Recovery Points (RP)** are the mod-side currency that funds a hero's fleet rebuilding after loss. Every living hero accumulates RP over game time; every ship the mod builds for a hero costs RP. Recovery is meant to be **gradual** — a faction that just lost an admiral's fleet takes time to put a replacement in the field.

## Accumulation

Every hero in state `active` or `lost_flagship`, once its cooldown has elapsed, gets RP on a cron tick. The rate doubles with every star:

| Hero rank | RP per tick | ×2 at home on replenish |
|---|---|---|
| ★ | 1 | 2 |
| ★★ | 2 | 4 |
| ★★★ | 4 | 8 |
| ★★★★ | 8 | 16 |
| ★★★★★ | 16 | 32 |

**The fifth star doubles like the other four.** It briefly did not: when ★5 was added it was given the same 8/tick as ★4, which made the most expensive star in the game buy nothing at all on the RP curve. The flat step was removed and the rule restored.

A hero on the **replenish** decision at its home station earns at **double rate** — the strongest reason a damaged hero goes home rather than loitering. Perks modify the rate further: *Logistic* is +50%, *Master Logistic* +100%.

**Cap = 200 RP.** Anything past it is discarded. That is deliberate: it forces a choice about which ship to rebuild and when to hold a hero back, and it puts a ceiling on how much fleet can appear at once.

### The tick interval

| | Interval |
|---|---|
| Release build | 5 minutes |
| Debug build | 2 minutes |

⚠ **The current alpha ships with the debug flag on**, so the build you can install today ticks every **2 minutes**, not 5. The hero detail screen shows the live figure next to the balance — read it there rather than assuming.

**RP does not tick during:**

- **Death cooldown** — between a wounded or unscathed outcome and the start of rebuilding. See [Death cycle](../death-cycle/).
- **Lineage vacancy** — between KIA and a successor spawning. The RP register does not exist yet for the future bearer.

## Ship costs

| Ship class | RP cost |
|---|---|
| S (fighter) | 5 |
| M (corvette / frigate) | 10 |
| L (destroyer) | 40 |
| XL | 100 |
| XL — Xenon K destroyer | 100 |
| XL — Xenon I carrier | 150 |
| XL battleship — the Asgard | 200 |

The last three exist because some flagships are not interchangeable. A Xenon hero flies a **K** at ★1–2 and swaps to an **I** at ★3–4, so the two need different prices; the Asgard is the Terran and Segaris ★5 flagship and is the single most expensive thing the mod will build.

Cost **includes full crew** — captain, service, gunners. The player never supplies a faction with a boarding party or a logistics chain.

Perks scale these too: *Quartermaster* is −25% on escort rebuilds and *Master Quartermaster* −50%. The result is floored at 1 RP, so no discount ever makes a ship free.

## Rebuild pace — drain, not trickle

**A rebuild tick spends as much of the balance as it can**, rebuilding ship after ship in one pass until the RP runs out or the fleet is full. It is not one ship per tick.

The order within a pass is largest first: L escorts, then M, then S, so a hero that has banked enough gets its heavy ships back before its fighters.

This is why a hero's fleet appears to return in **bursts** rather than dribbling in. A ★★★★ hero sitting at 8 RP per tick accumulates quietly for several ticks with nothing visible happening, then crosses an escort cost and three ships appear at once.

That is the current model and it replaced a trickle: the earlier design built at most one ship per tick, which at the old rates made a full rebuild a predictable, very long wait. If you remember reading that here, it was true and is not any more.

## Interaction with death cycle

| Outcome | Cooldown before RP resumes |
|---|---|
| **Wounded** | 120 min |
| **Unscathed** | 30 min |
| **KIA** | no rebuild — see below |

(In a debug build those are 4 and 2 minutes.)

After a **KIA** there is no rebuild at all. The successor starts with 0 RP and is granted a **full starting fleet outright**, bypassing RP for that first spawn. Without that rule every succession would leave the faction with no officer for another hour on top of the succession cooldown; with it, the faction has a functional officer as soon as the lineage cooldown expires.

## What rank actually buys

Higher rank recovers faster in two ways at once, and spends more:

- **The tick doubles** — ★★★★★ accrues 16× what ★ does, 32× at home.
- **The fleet is bigger and heavier**, so there is more to pay for, and the expensive classes are only available further up.

The two roughly cancel in *feel*: a senior hero loses more and earns it back faster. What rank genuinely buys is the ability to field classes a junior hero cannot afford at all.

## Player intervention _(not shipped)_

The design calls for the player to **supply RP directly** to a favoured hero. It is not in the mod: there is no sponsor path anywhere in the shipped scripts.

What the hero page does offer instead is **gifting credits for faction favours** — four buttons from 100 000 cr up to 5 000 000 cr. That buys standing with the hero's faction, not recovery speed, and the two should not be confused.

## UI

![Captain Sarah Kowalski detail page — Recovery points 65 / 200 (+2 / 2 min), 4/4 S escorts filled, active perks Logistic (+50% RP accrual) and Master Logistic (+100% RP accrual)](/x4-modding-wiki/img/mods/galactic-heroes/rp-balance.jpg)

The hero detail page shows the current balance against the cap, the accrual rate and its interval in brackets, and the fleet's escort tally per class with anything pending marked.

## Honest list

- **The shipped alpha is a debug build.** Tick interval and every death cooldown are the short debug values, not the release ones tabled above.
- **Rates here have changed three times.** 10/20/40/80 originally, then 2/4/8/16, then halved to today's 1/2/4/8/16 with the ×2 replenish buff restoring the middle figure at home. Older write-ups quoting the first set are describing a mod that no longer exists.
- **There is no player-facing RP number for a pooled hero.** A hero that has not spawned has no RP register at all, so its detail page shows none.
- **Nothing decays.** RP sits at the cap indefinitely; a hero that never fights never spends and never loses it.

## Related mechanics

- [Death cycle](../death-cycle/) — when RP starts and stops flowing
- [Lineage succession](../lineage-succession/) — why new bearers get a starting-fleet grant
- [XP and star progression](../xp-and-stars/) — how a hero reaches the ranks that double the rate
- [Perks](../perks/) — Logistic, Master Logistic, Quartermaster and Master Quartermaster all move these numbers

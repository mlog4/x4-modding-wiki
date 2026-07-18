---
title: Kha'ak Hive Lord archetype
description: Warfront commander for Kha'ak factions. Defends hive clusters, counter-attacks on hive loss, rebuilds lost hives from RP. The defensive counterpart to the Seeder.
---

Kha'ak factions don't play the same game as everyone else. There's no economy, no diplomacy, no faction reputation to shift. Just **expansion + attrition**. **Hive Lords** are the defensive commanders — they hold what the Kha'ak already have.

## Coverage

- **6 template pools** across the Kha'ak factions
- Typically **1–2 living Hive Lords** across all Kha'ak factions at once
- Every active Hive Lord commands a Kha'ak Queen or equivalent capital as flagship

## Decision cycle

Hive Lords react to threats against Kha'ak territory:

- **Warfront defence** — protect Kha'ak sector clusters when player / NPC fleets approach. Highest priority.
- **Counter-attack** — after losing a hive, strike back at the sector where the loss occurred. Adds pressure on the aggressor's forces.
- **Hive rebuild** — restore destroyed hives from RP over time. Slow but persistent.
- **Multi-hive coordination** — Hive Lords in adjacent sectors may reinforce each other during major engagements.

Unlike Admirals, Hive Lords do not have "idle patrol" — they always have a target (a hive to defend, a sector to counter-attack, or a rebuild task). The Kha'ak are not a "peace" faction; there is no default rest state.

## Ship scaling

Hive Lords always fly Kha'ak capitals:

| Rank | Flagship | Escort |
|---|---|---|
| ★ | Kha'ak Corvette or basic Queen equivalent | 2× Kha'ak fighters |
| ★★ | Standard Queen | 4× Kha'ak fighters |
| ★★★ | Improved Queen | 6× Kha'ak fighters / 1× cluster |
| ★★★★ | Elite Queen | 8× Kha'ak fighters / 2× clusters |

Kha'ak fleets look meaner than admiral fleets of the same rank — no S/M/L class variety, just numeric density.

## Behaviour example — hive defence + counter-attack

You approach a Kha'ak sector at the edge of Kha'ak space with a small warfleet. You're planning to destroy a hive station.

- Ten minutes into your engagement, the Kha'ak Hive Lord of the "Deep Voice" lineage (★★★, 3,400 XP) commits to a **warfront defence** decision. Their Queen + escort screen enters the sector from the opposite gate.
- The engagement gets much harder. Your fleet takes losses. You retreat with the hive damaged but not destroyed.
- Two game-hours later, you come back with reinforcements and finish the hive.
- The Hive Lord's decision cycle now flips: **counter-attack**. Their fleet moves to the adjacent Argon border sector and engages Argon patrols. The Argon admiral (see [Admiral](../admiral/)) responds with home-space defence.
- If you were watching the map, you'd see the Kha'ak fleet suddenly become a problem for Argon — because you hit their hive.

**Consequences propagate.** The Kha'ak don't just sit there — they react to losses with proportional aggression.

![Kha'ak Hive Lord Manifold-of-Spires — Hive consciousness shard inhabiting the resonance lattices of multiple Kha'ak nests simultaneously. ★★ (2/5), 278 XP, 72 kills, 750 000 cr, last kill ship_m (+1 XP) in Pious Mists IV. HQ: KHK Kha'ak Installation in Mists of Artemis, decision = Idle guarding hive, escorts 2 M / 4 S filled. Active perks: Khaak Seed / Prepared / Second in Line / Veteran. Kha'ak flagships are Kha'ak Queens or Corvettes, not human destroyers](/x4-modding-wiki/img/mods/galactic-heroes/khaak-hivelord.jpg)

The Kha'ak Order Board carries different order types than human factions — it's a war-only board, no economy tasks:

![Kha'ak Order Board — no coordinator or raider tasks; admiral-type order types: $hive_development 26 tasks, $swarm_summon 1 task, $small_resonance 1 task, $big_resonance 1 task, $system_resonance 7 tasks, $call_for_help 3 tasks, $fleet_defense 3 tasks. Active heroes: Manifold-of-Spires (hive_lord ★★, idle) and Brood-Mother (seeder ★★★, guard_hive)](/x4-modding-wiki/img/mods/galactic-heroes/khaak-order-board.jpg)

## Recovery cycle

- Same [d100 death roll](../../mechanics/death-cycle/) as other archetypes on Queen destruction. Default 20% KIA / 60% wounded / 20% unscathed.
- Same [Recovery Points](../../mechanics/recovery-points/) rebuild pace, but ship costs match the Kha'ak class scheme (Queen ≈ L or XL cost).
- Same [lineage succession](../../mechanics/lineage-succession/) — a KIA'd Hive Lord's lineage will spawn a successor after 120 min. Different name from a Kha'ak name pool. Same visual "Deep Voice" flavour if in-universe backstory allows.

## Relationship to Seeders

Hive Lords are **reactive** — they defend and counter-attack. **Seeders** are **proactive** — they find undefended sectors and drop new hives.

Together they form a **self-propagating Kha'ak threat**:

1. Seeder finds an undefended border sector adjacent to Kha'ak space
2. Seeder drops a new hive
3. Nearby Hive Lord (if any) picks up the new hive in its territory and begins defensive rotation
4. If the player / NPC attacks the new hive, the Hive Lord counter-attacks

If you clear out one Kha'ak sector, the Seeder will eventually find another vulnerable sector and start over. If you clear a hive, the Hive Lord will rebuild it from RP over the next hour or so of game time.

The design intent: **Kha'ak feel like a persistent, adaptive threat** — not a static garrison to be cleared once and forgotten.

## What's next

- **Kha'ak-flavoured decision UI** — currently their decisions surface in the same menu as human archetypes. Planned: a distinct "warfront overview" for Kha'ak, showing hive clusters instead of individual heroes.
- **Sector-level Kha'ak coordination** — currently Hive Lords coordinate loosely. Planned: a per-cluster "warfront ledger" so multiple Hive Lords in the same cluster share threat state.
- **Boss-tier Kha'ak Hive Lord** — future concept: a named ★★★★★ Hive Lord for endgame content, requiring player-scale coordination to take down.

## Related pages

- [Kha'ak Seeder archetype](../khaak-seeder/) — the aggressive expansion counterpart
- [Admiral archetype](../admiral/) — the human-faction commander archetype
- [Death cycle](../../mechanics/death-cycle/)
- [Recovery Points](../../mechanics/recovery-points/)

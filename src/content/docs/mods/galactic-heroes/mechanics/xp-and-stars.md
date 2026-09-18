---
title: XP and star progression
description: How heroes gain experience, class-based kill weights, star rank thresholds, and what unlocks at each ★. Concrete numbers for balance discussion.
---

Every hero has an XP counter and a star rank (★ → ★★★★★). XP goes up when the hero's fleet kills something meaningful. Higher stars mean a tougher flagship, a bigger escort screen, and access to the [perks](../perks/) that gate on rank.

## What counts as a kill

XP is awarded when either **the hero's flagship** or **any escort ship subordinate to the flagship** deals the final blow to a valid target. The event is registered by the mod's `MlogHeroesKillWorker` watcher and credited to the hero's `$xp` register cell.

**Not counted:**

- **Self-destruction** (collision, suicide) — the vanilla `event_object_killed_object` fires with `killer == victim`, and the mod's watcher filters it out.
- **Kills by other factions** — if an Argon fleet in the same sector kills the same Xenon capital, only whichever hero's fleet dealt the last hit gets the credit.
- **Boarding captures** — a different event (`event_object_boarded`); deliberately excluded (capture ≠ heroic kill).
- **Damage without kill credit** — assist is not implemented; only the final kill matters.
- **Drones and mass-traffic NPCs** — filtered out (see weights below).

## Kill weights per class

| Target class | XP | Credits to the hero |
|---|---:|---:|
| `class.ship_xs` (drones, escape pods) | **0** | 0 |
| Mass-traffic NPCs (taxis, civilian filler) | **0** | 0 |
| `class.ship_s` (fighters, Xenon N) | **1** | 10 000 |
| `class.ship_m` (corvettes, Xenon P) | **2** | 25 000 |
| `class.ship_l` (destroyers, Xenon Terraformer) | **8** | 125 000 |
| `class.ship_xl` (capitals, Xenon K) | **16** | 500 000 |
| `class.station` | **20** | 1 000 000 |
| `class.module` / `class.buildmodule` | **2** | 10 000 |

**Every kill also pays the hero personally.** That second column is not decoration: a hero's private balance is what buys [perks](../perks/), and the tier prices run to tens of millions. Cracking stations is how a hero affords an epic perk; shooting fighters is not.

### The weights were cut, hard

An earlier build used **S 1, M 5, L 25, XL 100, station 200, module 25** and progression was far too fast — a single admiral reached ★★★, a thousand XP, inside three hours of play. Everything above S was divided down until the third star was a milestone again.

If you have read those older numbers somewhere, that is what they were. They are not the mod's numbers now.

### Archetype changes what a kill is worth

| Archetype | XP from its fleet's kills |
|---|---|
| Admiral, coordinator, engineer, hive lord | class weight × **1.0** |
| Pirate raider | class weight × **0.5**, floored at 1 |
| Kha'ak seeder | **0 from this path** |

The raider is halved because kills are not what a raider is for — plunder is, and that pays separately.

The seeder is zeroed here deliberately. Its XP comes from a **separate watcher awarding +1 per Kha'ak ship killed anywhere**, so crediting its fleet kills too would count the same event twice. One consciousness, one XP path.

### Perks scale it again

XP gain is multiplied by the hero's own perks — **Attentive** +50%, **Dedicated Hunter** +100% — so two heroes in the same battle do not bank the same number.

## Star rank thresholds

| Rank | XP threshold |
|---|---|
| ★ | 0 (starting) |
| ★★ | 100 XP |
| ★★★ | 1,000 XP |
| ★★★★ | 10,000 XP |
| ★★★★★ | 100,000 XP |

**Those thresholds are also per-hero.** Two rare and epic perks lower them: **Quick Learner** −25% and **Tactical Genius** −50% XP needed for the next star. A Tactical Genius reaches ★★★ at 500 XP, not 1 000.

Two more perks skip the bottom of the ladder outright at spawn: **Veteran** grants +200 XP, which is ★★ immediately, and the epic **Legendary Veteran** grants +1 000, which is ★★★ from the first tick.

Progression is **logarithmic** — each rank takes ~10× more XP than the previous. Practical implications:

- **★★** is achievable in one-two combats. Early engagement hook — the player sees "the mod is working" quickly.
- **★★★** takes several hours of active hero life. A memorable veteran.
- **★★★★** takes dozens of hours or a high kill-rate in hot zones. Legendary status for one faction.
- **★★★★★** is the identity tier — reached only through very long, active service. Each faction gives its ★★★★★ heroes a distinctive flagship or fleet identity (see [C-029 fleet rework](https://github.com/mlog4/galactic_heroes/blob/main/concepts/C-029_fleet_composition_rework.md)).

## What unlocks per rank

Flagship and escort composition auto-scale with rank. Details are per-archetype (see [Admiral](../../archetypes/admiral/), [Pirate Raider](../../archetypes/pirate-raider/), [Coordinator](../../archetypes/coordinator/), [Engineer](../../archetypes/engineer/), etc.). The **default admiral scaling** used as a baseline:

| Rank | Flagship | S | M | L | Aux | Notes |
|---|---|---:|---:|---:|---|---|
| ★ | L destroyer | 4 | 0 | 0 | — | Starting fleet |
| ★★ | L destroyer | 8 | 4 | 0 | — | Add frigate wing |
| ★★★ | XL carrier | 16 | 4 | 1 | — | Carrier promotion |
| ★★★★ | XL carrier | 32 | 8 | 2 | resupplier | Veteran fleet — and the first rank with a support ship |
| ★★★★★ | XL carrier | 48 | 16 | 8 | resupplier | The L wing quadruples: eight destroyers, not two |

**★5 is a real tier with real numbers**, not a placeholder. The step that matters is the L column going 2 → 8 — a ★★★★★ admiral fields a destroyer squadron in its own right, on top of the carrier.

**The auxiliary ship arrives at ★4** and is easy to miss because it is not an escort: it is a resupply vessel that follows the fleet.

Counts here are the **base**. A hero's perks add to them — *Squad Commander* is +2 S from the first star, *Capital Ship Commander* +1 L, *Heavy Squad Expert* +4 M — which is why a ★★ admiral in game may show 10 S escorts where this table says 8.

**Faction-flavour applies:** the flagship macro is drawn from the faction's own catalog, so an Argon admiral gets a Behemoth-line destroyer; a Teladi admiral gets an Osaka-line; a Paranid admiral gets a Zeus-line. This is why the same "L destroyer" row looks different for different admirals in the roster.

**Sub-factions inherit parent-race templates by design** (Antigone uses Argon templates, Hatikvah uses Argon, Holy Order uses Paranid, etc.). This is intentional, not a gap — sub-faction ships come from the parent race's shipyards, and per-sub-faction templates would be identical duplicates.

### Per-archetype divergence from the default

- **Pirate Raider** starts on M corvette + S fighter, promotes to L destroyer + M frigate at ★3, XL Erlking-tier at ★4-5. Smaller and more mobile than admiral.
- **Engineer** is **M-miner-flagship only across all ranks** (no capital promotion) — a small S-fighter escort scales 0→4 at ★1-★4. See [Engineer archetype](../../archetypes/engineer/).
- **Coordinator has no personal escort** — its flagship is stationary at HQ. What scales with rank is how many whole faction **fleets** it may hold at once: one per star. See [Coordinator archetype](../../archetypes/coordinator/).
- **Kha'ak Hive Lord** parallels the Coordinator but for scattered Kha'ak, and has no per-star cap at all: each ship commandeered costs RP, and one flat ceiling of 100 ships applies. See [Hive Lord archetype](../../archetypes/khaak-hive-lord/).
- **Kha'ak Seeder** flagship stays M Kha'ak across all ranks; escort screen grows ★2=2S → ★3=2M+4S → ★4=4M+8S. Fleet is small because seeder power is in the **network** (hives + outposts), not in the flagship. See [Seeder archetype](../../archetypes/khaak-seeder/).

## Perks — the personality layer on top of stars

Star ranks give **fleet strength**. [Perks](../perks/) give **personality**. Both live on the hero: two ★★★ Argon admirals with the same fleet composition can play very differently if one has Lucky (−10% KIA chance) + Master Logistic (+100% RP accrual) and the other has Dedicated Hunter (+100% XP from combat) + Capital Ship Expert (+2 L escorts).

Perks are **authored on pool templates**, unlock on cash milestones or via LEARN purchase, and are **preserved across clone respawns** — a lineage's accumulated perks are the lineage's reputation. See [Perks system](../perks/) for the full model.

![Perks catalog — Tier: common (Attentive +50% XP from combat, Capital Ship Commander +1 L-class escort, Heavy Squad Commander +2 M-class corvettes/frigates, Leader +1 faction hero cap when hero reaches ★4, Logistic +50% RP accrual, Long Lasting Buff +50% engineer duration, Lucky Leader ★3 cap raise, Khaak Seed +1 RP per Khaak ship lost, Prepared +200 RP at spawn, Quartermaster -25% RP cost when rebuilding, Second in Line, Squad Commander +2 S-class fighters from first star, Third in Line, Veteran +200 XP at spawn, Volunteer 10× more likely to be picked). Tier: rare (Capital Ship Expert +2 L destroyers from ★3, Dedicated Hunter +100% XP from combat, Efficient Service 30 min cooldown, Heavy Squad Expert +4 M corvettes, Lucky -10% KIA chance, Master Logistic +100% RP accrual, Master Quartermaster -50% RP cost, Master Technician +20% buff potency, Quick Learner -25% XP needed, Reduced Cost 50 RP service, Squad Expert +4 S fighters from ★). Tier: epic (Legendary Veteran +1000 XP at spawn → ★3 immediately, Tactical Genius -50% XP needed)](/x4-modding-wiki/img/mods/galactic-heroes/perks-catalog.jpg)

Perks unlock via one of three paths: **conditional** (kills / stars / age / quest triggers), **automatic** at 10M cr accumulation, or **learn** at tier-based cost (common 20M cr / rare 50M cr / epic 100M cr). Learned + unlocked perks are preserved across clone respawns.

## Memorial preservation

When a hero loses their flagship (see [Death cycle](../death-cycle/)), **XP does not reset**. The hero keeps:

- Total XP
- Star rank
- Kill count
- Last kill record

Rationale: **the career belongs to the hero, not the ship**. Walter Korkov with 5,000 XP stays a 3★ admiral after losing his first Vanguard. The successor bearer under lineage succession (see [Lineage](../lineage-succession/)) is a *different person* and starts fresh, but the memorial hero keeps every achievement they earned in life.

Result: heroes who survive many battles become progressively more powerful; heroes who die young leave a shorter legacy on the wall. No XP grinding through deliberate deaths.

## UI

![Kha'ak Hive Lord Manifold-of-Spires — Hive consciousness shard, ★★ (2/5), 278 XP, 72 kills, last kill ship_m (+1 XP) in Pious Mists IV, active perks Khaak Seed / Prepared / Second in Line / Veteran, locked perk Leader auto-unlocks at ★★★★](/x4-modding-wiki/img/mods/galactic-heroes/xp-progression.jpg)

The hero detail page shows:

- Current stars, as a filled/unfilled bar out of five (`**---  (2/5)`)
- XP total
- Progress bar to next rank
- Kill count
- Last kill (target class + faction + sector)

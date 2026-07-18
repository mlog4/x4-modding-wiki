---
title: XP and star progression
description: How heroes gain experience, class-based kill weights, star rank thresholds, and what unlocks at each ★. Concrete numbers for balance discussion.
---

Every hero has an XP counter and a star rank (★ → ★★★★★). XP goes up when the hero's fleet kills something meaningful. Higher stars mean a tougher flagship, a bigger escort screen, and (once shipped) per-archetype perks.

## What counts as a kill

XP is awarded when either **the hero's flagship** or **any escort ship subordinate to the flagship** deals the final blow to a valid target. The event is registered by the mod's `MlogHeroesKillWorker` watcher and credited to the hero's `$xp` register cell.

**Not counted:**

- **Self-destruction** (collision, suicide) — the vanilla `event_object_killed_object` fires with `killer == victim`, and the mod's watcher filters it out.
- **Kills by other factions** — if an Argon fleet in the same sector kills the same Xenon capital, only whichever hero's fleet dealt the last hit gets the credit.
- **Boarding captures** — a different event (`event_object_boarded`); deliberately excluded (capture ≠ heroic kill).
- **Damage without kill credit** — assist is not implemented; only the final kill matters.
- **Drones and mass-traffic NPCs** — filtered out (see weights below).

## Kill weights per class

| Target class | XP awarded | Design intent |
|---|---|---|
| `class.ship_xs` (drones, escape pods) | **0** | Filtered — prevents drone-farm cheese |
| Mass-traffic NPCs (taxis, civilian filler) | **0** | Filtered — only real combat counts |
| `class.ship_s` (fighters, Xenon N) | **1** | Baseline unit |
| `class.ship_m` (corvettes, Xenon P) | **5** | 5× S value |
| `class.ship_l` (destroyers, Xenon Terraformer) | **25** | 25× S value |
| `class.ship_xl` (capitals, Xenon K) | **100** | 100× S value — big kills matter |
| `class.station` | **200** | Highest value — station kills are the top achievement |

Weights are tuned so:

- One rare XL kill ≈ 20 routine S kills — the mod values "big-target work" over kill-count grinding.
- Stations are the highest reward — a hero who cracks a Xenon station gets a career milestone.
- Drone-swarm sectors don't inflate stats.

## Star rank thresholds

| Rank | XP threshold |
|---|---|
| ★ | 0 (starting) |
| ★★ | 100 XP |
| ★★★ | 1,000 XP |
| ★★★★ | 10,000 XP |
| ★★★★★ | 100,000 XP |

Progression is **logarithmic** — each rank takes ~10× more XP than the previous. Practical implications:

- **★★** is achievable in one-two combats. Early engagement hook — the player sees "the mod is working" quickly.
- **★★★** takes several hours of active hero life. A memorable veteran.
- **★★★★** takes dozens of hours or a high kill-rate in hot zones. Legendary status for one faction.
- **★★★★★** is the identity tier — reached only through very long, active service. Each faction gives its ★★★★★ heroes a distinctive flagship or fleet identity (see [C-029 fleet rework](https://github.com/mlog4/galactic_heroes/blob/main/concepts/C-029_fleet_composition_rework.md)).

## What unlocks per rank

Flagship and escort composition auto-scale with rank. Details are per-archetype (see [Admiral](../../archetypes/admiral/), [Pirate Raider](../../archetypes/pirate-raider/), [Coordinator](../../archetypes/coordinator/), [Engineer](../../archetypes/engineer/), etc.). The **default admiral scaling** used as a baseline:

| Rank | Flagship | S escorts | M escorts | L escorts | Notes |
|---|---|---:|---:|---:|---|
| ★ | L destroyer | 4 | 0 | 0 | Starting fleet |
| ★★ | L destroyer | 8 | 4 | 0 | Add frigate wing |
| ★★★ | XL carrier | 16 | 4 | 1 | Carrier promotion |
| ★★★★ | XL carrier | 32 | 8 | 2 | Veteran fleet |
| ★★★★★ | Per-faction identity | 32+ | 8+ | 2+ | Each faction chooses: keep carrier + scale escorts, swap to a signature capital, or introduce a second flagship (see C-029) |

**Faction-flavour applies:** the flagship macro is drawn from the faction's own catalog, so an Argon admiral gets a Behemoth-line destroyer; a Teladi admiral gets an Osaka-line; a Paranid admiral gets a Zeus-line. This is why the same "L destroyer" row looks different for different admirals in the roster.

**Sub-factions inherit parent-race templates by design** (Antigone uses Argon templates, Hatikvah uses Argon, Holy Order uses Paranid, etc.). This is intentional, not a gap — sub-faction ships come from the parent race's shipyards, and per-sub-faction templates would be identical duplicates.

### Per-archetype divergence from the default

- **Pirate Raider** starts on M corvette + S fighter, promotes to L destroyer + M frigate at ★3, XL Erlking-tier at ★4-5. Smaller and more mobile than admiral.
- **Engineer** is **M-miner-flagship only across all ranks** (no capital promotion) — a small S-fighter escort scales 0→4 at ★1-★4. See [Engineer archetype](../../archetypes/engineer/).
- **Coordinator has no personal escort** — flagship is stationary at HQ. Instead, ★-scaled `subordinates` capacity (5 / 10 / 20 / 30) determines how many faction military jobs they can commandeer at once. See [Coordinator archetype](../../archetypes/coordinator/).
- **Kha'ak Hive Lord** parallels Coordinator but for scattered Kha'ak: capacity 8 / 15 / 25 / 40. See [Hive Lord archetype](../../archetypes/khaak-hive-lord/).
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

- Current stars (★ / ★★ / ★★★ / ★★★★)
- XP total
- Progress bar to next rank
- Kill count
- Last kill (target class + faction + sector)

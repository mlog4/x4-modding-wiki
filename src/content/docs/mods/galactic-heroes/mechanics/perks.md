---
title: Perks system
description: Static catalog of ~28 perks in 3 tiers (common / rare / epic). Authored per pool template, auto-unlock at cash milestones, LEARN new at 20M/50M/100M by tier, preserved across clone respawns.
---

Star ranks give a hero a **fleet**. Perks give them a **personality**. Two ★★★ Argon admirals with identical Kowalski-lineage fleets can play very differently if one has **Lucky** (-10% KIA chance) + **Master Logistic** (+100% RP accrual) and the other has **Dedicated Hunter** (+100% XP from combat) + **Capital Ship Expert** (+2 L escorts).

Perks are the "meta-layer" of hero differentiation. They never touch combat stats (attack, defence, speed — that's vanilla X4's domain). They modify **mod-side parameters** only: XP rates, RP rates, escort counts, buff potency, decision thresholds, cooldowns, spawn multipliers.

![Perks catalog — Tier: common (Attentive +50% XP from combat, Capital Ship Commander +1 L-class escort, Heavy Squad Commander +2 M-class corvettes/frigates, Leader +1 faction hero cap when hero reaches ★4, Logistic +50% RP accrual, Long Lasting Buff +50% engineer duration, Lucky Leader ★3 cap raise, Khaak Seed +1 RP per Khaak ship lost, Prepared +200 RP at spawn, Quartermaster -25% RP cost when rebuilding, Second in Line, Squad Commander +2 S-class fighters from first star, Third in Line, Veteran +200 XP at spawn, Volunteer 10× more likely to be picked). Tier: rare (Capital Ship Expert +2 L destroyers from ★3, Dedicated Hunter +100% XP from combat, Efficient Service 30 min cooldown, Heavy Squad Expert +4 M corvettes, Lucky -10% KIA chance, Master Logistic +100% RP accrual, Master Quartermaster -50% RP cost, Master Technician +20% buff potency, Quick Learner -25% XP needed, Reduced Cost 50 RP service, Squad Expert +4 S fighters from ★). Tier: epic (Legendary Veteran +1000 XP at spawn → ★3 immediately, Tactical Genius -50% XP needed)](/x4-modding-wiki/img/mods/galactic-heroes/perks-catalog.jpg)

## Tiers

Perks are categorized into three tiers with different LEARN costs:

| Tier | Perks (count) | LEARN cost | Character |
|---|---|---|---|
| **Common** | ~15 | **20 M cr** | Small quality-of-life bumps: +50% XP, +50% RP, +1 escort slot, +200 spawn bonus |
| **Rare** | ~11 | **50 M cr** | Meaningful power upgrades: +100% XP, +100% RP, doubled escort tier, -10% KIA |
| **Epic** | 2 | **100 M cr** | Career-defining: Legendary Veteran (+1000 XP at spawn, instant ★3), Tactical Genius (-50% XP threshold) |

The tier determines **cost** and **prio order** for the LEARN system. Higher-tier perks are learned first once eligible. Prio also breaks ties within a tier (each perk in the catalog has a `$prio` field).

## What perks look like

Each perk in the catalog has:

- **id** — internal slug (`$veteran`, `$logistic`, `$lucky`)
- **name** — display text (`Veteran`, `Logistic`, `Lucky`)
- **description** — one-line rule (`+200 XP at spawn`, `+50% Recovery Points accrual`)
- **tier** — `common` / `rare` / `epic`
- **prio** — priority number for LEARN ordering (higher = learned first)
- **applies_to** — archetype filter (`admiral`, `raider`, `engineer`, `coordinator`, `hive_lord`, etc. — some perks are universal, some archetype-specific)
- **effects** — string list of runtime modifiers (`spawn_xp_bonus:200`, `rp_rate_multiplier:0.5`, `kia_chance_modifier:-10`, `expected_s_bonus:2`)

Effects apply automatically at 5 runtime sites: **RpAccrualWorker** (RP tick math), **KillWorker** (XP gain math), **FleetLossWatcher** (KIA chance math), **LevelUpWorker** (fleet expand math), **Engineer service action** (buff pct / duration / cost math).

## How a hero gets a perk

There are three ways a perk becomes active on a hero:

### 1. Authored on the pool template

Every pool template author-declares a list of perks that are **specific to this lineage**:

```
$arg_admiral_001 (Sarah Kowalski lineage) = table[
  $founder_name = 'Captain Sarah Kowalski',
  $perks = [
    table[$id='logistic',        $initially_active=true],
    table[$id='lucky',           $initially_active=false],
    table[$id='master_logistic', $initially_active=false],
  ],
  ...
]
```

At spawn, the mod copies this list into the bearer's `$perks_state`. Perks with `$initially_active=true` apply from turn 1. Perks with `false` sit **locked** — visible on the hero detail page but their effects are suppressed until they activate.

### 2. Auto-unlock at cash milestone

When a hero's `$money` register reaches **10 M cr** (through gifts, faction favours, mission rewards), all locked perks on the template automatically become active. This is the primary "grind" path — the player can raise a hero's cash through gifts and see the whole authored list unlock at once.

Cash flow into a hero:
- **Gift buttons** on the hero detail page: +100 k / +500 k / +1 M / +5 M cr per click (also raises faction favours: +1 / +5 / +10 / +50)
- **Faction Missions** (see [Faction Missions](../faction-missions/)) — cash reward from completed player-facing contracts goes to the faction's hero (Coordinator or top admiral)
- **Kill-based faction favours** — later expansion

Once cash ≥ 10 M cr, the template's locked perks auto-unlock in one batch. This is the design "milestone" moment — a lineage the player has invested in unlocks its full initial capability.

### 3. LEARN system — buy new perks

Once **all authored template perks are active**, the hero can LEARN new eligible perks that aren't in the template list. This is the endgame progression — a hero the player has invested in can grow beyond their original lineage design.

LEARN cost by tier:

| Tier | Cost per perk learned |
|---|---|
| Common | **20 M cr** |
| Rare | **50 M cr** |
| Epic | **100 M cr** |

The **highest-prio** perk (from the pool of `$applies_to` matches not yet in the hero's `$perks_state`) is learned first. Then the next highest-prio, and so on.

**Example progression for Sarah Kowalski (Argon admiral, `admiral` archetype):**

1. Spawn — Logistic active (from template, `$initially_active=true`), Lucky and Master Logistic locked
2. Gift +5 M cr → hero cash now ~5 M. Nothing changes yet.
3. Gift +5 M cr again → hero cash now ~10 M. Auto-unlock fires: **Lucky + Master Logistic activate**. All 3 authored perks now active.
4. Gift +20 M cr → hero cash now ~30 M. LEARN eligible: common tier at 20 M cr. **Attentive (highest common-tier prio matching `admiral`)** learned. Cost deducted from hero's cash.
5. Gift +20 M cr → hero cash now ~30 M. LEARN eligible: common tier at 20 M cr. **Capital Ship Commander** learned. Cost deducted.
6. ... progressive purchases up to rare and epic tiers.

**Note:** LEARN uses the hero's own cash (`$money` register), not the player's. Gifts from the player raise the hero's cash. Faction Missions rewards feed the same pool.

## Preservation across clone respawns

**LEARNed + unlocked perks are preserved across clone respawns.** When a bearer is KIA'd and the lineage's clone spawns 120 game-minutes later, the clone's `$perks_state` **inherits** the previous bearer's perks_state exactly.

This is the important part. Sarah Kowalski (original) accumulates 30 M cr through player gifts + kills → auto-unlocks + LEARNs Attentive + Capital Ship Commander. Sarah Kowalski dies in a Xenon incursion. 120 game-minutes later, Sarah Kowalski (Clone #1) spawns:

- ★1, 0 XP, 0 RP, empty kill count (fresh combat record)
- **BUT** `$perks_state` inherited: Logistic + Lucky + Master Logistic + Attentive + Capital Ship Commander all active from turn 1
- Full starting fleet immediately (RP-bypass grant, see [Recovery Points](../recovery-points/))

The lineage's **institutional weight** — the accumulated perks — survives the individual clone's death. This is the mechanical reason to care about a specific lineage across multiple bearers. See [Lineage succession](../lineage-succession/) for the full clone model.

## Full catalog (v0.1)

### Tier: common (20 M cr to LEARN)

| Perk | Applies to | Effect |
|---|---|---|
| **Attentive** | admiral, raider, coordinator | +50% XP gain from combat |
| **Capital Ship Commander** | admiral, coordinator | +1 L-class destroyer escort (kicks in from ★3) |
| **Heavy Squad Commander** | admiral, coordinator | +2 M-class corvettes/frigates in escort (kicks in from ★2) |
| **Leader** | admiral, coordinator | +1 faction hero cap when this hero reaches ★4 |
| **Logistic** | admiral, raider, coordinator, engineer | +50% Recovery Points accrual rate |
| **Long Lasting Buff** | engineer | Engineer station buff duration +50% |
| **Lucky Leader** | admiral, coordinator | +1 faction hero cap when this hero reaches ★3 (early Leader) |
| **Khaak Seed** | hive_lord, seeder | Each Kha'ak ship lost adds +1 RP, outpost +5, hive +10 |
| **Prepared** | all | +200 Recovery Points at spawn — fleet-building reserve ready from day one |
| **Quartermaster** | admiral, raider, coordinator, hive_lord | -25% RP cost when rebuilding escorts |
| **Second in Line** | all | Cannot spawn until faction has ≥1 active hero (delayed spawn — better templates fill first) |
| **Squad Commander** | admiral, raider, coordinator | +2 S-class fighters in escort from ★1 |
| **Third in Line** | all | Cannot spawn until faction has ≥2 active heroes |
| **Veteran** | all | +200 XP at spawn — promoted to ★2 immediately |
| **Volunteer** | all | Spawn weight ×10 (10× more likely to be picked when template is available) |

### Tier: rare (50 M cr to LEARN)

| Perk | Applies to | Effect |
|---|---|---|
| **Capital Ship Expert** | admiral, coordinator | +2 L-class destroyer escorts from ★3 (rare upgrade of Capital Ship Commander) |
| **Dedicated Hunter** | admiral, raider, hive_lord | +100% XP gain from combat (rare upgrade of Attentive) |
| **Efficient Service** | engineer | Engineer service cooldown halved (30 min instead of 60 min) |
| **Heavy Squad Expert** | admiral, coordinator | +4 M-class corvettes/frigates in escort (rare upgrade of Heavy Squad Commander) |
| **Lucky** | all | -10% chance of KIA in death roll |
| **Master Logistic** | admiral, raider, coordinator, engineer | +100% Recovery Points accrual rate (rare upgrade of Logistic) |
| **Master Quartermaster** | admiral, raider, coordinator, hive_lord | -50% RP cost when rebuilding escorts (rare upgrade of Quartermaster) |
| **Master Technician** | engineer | Engineer station buff potency relative +20% |
| **Quick Learner** | admiral, raider, coordinator | -25% XP needed to reach next star |
| **Reduced Cost** | engineer | Engineer service costs 50 RP instead of 100 |
| **Squad Expert** | admiral, raider, coordinator | +4 S-class fighters in escort from ★1 (rare upgrade of Squad Commander) |

### Tier: epic (100 M cr to LEARN)

| Perk | Applies to | Effect |
|---|---|---|
| **Legendary Veteran** | all | +1000 XP at spawn — promoted to ★3 immediately |
| **Tactical Genius** | all | -50% XP needed to reach next star (epic upgrade — doubles Quick Learner) |

## Design intent

- **Personality without stat inflation.** Perks give hero-vs-hero differentiation without touching combat stats. Two heroes with the same template + same star can still play very differently.
- **Player investment survives death.** Cash + LEARN spending on a lineage is preserved across clone respawns — the player's investment is protected against permadeath.
- **Cash is the currency of care.** Gifts, mission rewards, and (later) kill-based favours all flow into hero cash. Cash → auto-unlock → LEARN. The whole progression is one economy.
- **Authored + generic mix.** Each pool template authors a **specific personality** through its perk list. LEARN adds a **generic power** curve on top. Neither replaces the other — a well-designed template + LEARN progression makes a hero uniquely-shaped.

## What's next

- **Phase 2 unlock triggers (deferred)** — `kills:500`, `stars:3`, `age:24h`, `quest:argon_supply_chain` style condition-based unlocks are spec'd in [C-009](https://github.com/mlog4/galactic_heroes/blob/main/concepts/C-009_perk_system.md) but not currently wired into runtime. Instead, the auto-unlock at 10 M cr + LEARN system covers the perk progression path in v0.1.
- **Perk removal / re-spec** _(design open)_ — currently perks are one-way. A future "clinic" or "meditation" mechanic may allow re-spec at a cash cost.
- **Faction-wide perk pools** — currently the LEARN eligible pool is filtered by `$applies_to` archetype match. A future upgrade may add faction-flavour filters (e.g. only Teladi admirals can LEARN "Auditor Auditor" — a Teladi-specific rare perk).

## Related mechanics

- [XP and star progression](../xp-and-stars/) — the star tier is what perks like Squad Commander, Leader, Capital Ship Expert are keyed off
- [Recovery Points](../recovery-points/) — the RP tick that Logistic / Master Logistic modify
- [Lineage succession — the clone system](../lineage-succession/) — how LEARN investments survive clone respawns
- [Faction Missions](../faction-missions/) — cash rewards that feed hero cash → auto-unlock → LEARN

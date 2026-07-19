---
title: Pirate Raider archetype
description: Freelance criminal. Targets civilians (purpose.trade / .mine / .build). Own decision cascade (flee/replenish/raid/lurk). ★3 Joint Raid drains all RP. ★4 Pirate Base + base ship spawn cron. Own Order Board task types.
---

Pirates operate on different rules from admirals. There's no faction territory to defend, no home_sector to patrol, no strategic faction command. Instead, each pirate has a **home_station** (a specific hideout, not a sector) and a decision cascade tuned for **freelance criminality**: attack when strong, flee when weak, replenish at hideout, lurk when idle.

Post iter 21 (build_018), Raiders are also the mod's first archetype to actively use the [Scout-Saboteur](../saboteur/) dispatch as a side-effect. Piracy is asymmetric warfare; saboteurs fit the aesthetic.

## Coverage

- **4 templates** across the pirate faction set: Scale Plate Pact, Duke's Buccaneers, Riptide Rakers, Yaki Clans (Xenon Mil Units templates share raider mechanics for now — narrative model TBD)
- Typically **1-2 living raiders per faction** in a fully-developed save
- Small fleets — solo or in pairs, mobile, deniable

## Playstyle — freelance criminality

- **No home_sector** — has a **home_station** instead (a specific pirate hideout, e.g. Silver Fang's base in Riptide Sanctuary)
- **XP economy inverted** — kills give **×0.5** admiral rate (pirates aren't professional soldiers), but plunder gives **×1.0** full rate. Grinding kills is inefficient; robbing civilians is efficient.
- **Higher mortality profile** — smaller fleets = higher KIA % on flagship loss unless perks (Lucky) mitigate. Compensated by **flee** decision, not by dragged-out fights.
- **Target civilians preferentially** — Phase A iter 20 introduced `purpose.fight` filter; iter 21 inverted it. Raiders now target `purpose.trade` / `.mine` / `.build` first, avoid `.fight` military.

Canonical archetype example: **Vryss Korrock** (template `sca_raider_001`, Boron-born former Argon Federation tactician, defected after the "Ferral Affair 821 NT" — a fictional Scale Plate Pact incident).

## Decision cascade (C-006 v0.2 — first-match wins)

```mermaid
flowchart TD
  Start[for each active raider] --> Q1{state ==<br/>lost_flagship?}
  Q1 -- yes --> R1["🩹 flee<br/>no order<br/>wait for RpAccrualWorker<br/>Path A flagship rebuild"]
  Q1 -- no --> Q2{at_home AND<br/>(not fleet_full OR<br/>hull ≤80%)?}
  Q2 -- yes --> R2["🔧 replenish<br/>Patrol home_station<br/>RP ×2 buff"]
  Q2 -- no --> Q3{(fleet_damaged OR<br/>hull ≤80%)<br/>AND NOT at_home?}
  Q3 -- yes --> R3["🩹 flee<br/>MoveGeneric home_station<br/>noattackresponse=true"]
  Q3 -- no --> Q4{fleet_full?}
  Q4 -- yes --> R4["⚔️ raid<br/>closest non-pirate sector<br/>range 5, exclude Xenon/Kha'ak"]
  Q4 -- no --> R5["🕶️ lurk<br/>Patrol home_station<br/>opportunistic side-jobs"]
```

### The five decisions

| ID | Icon | Trigger | What it does |
|---|---|---|---|
| **flee** (lost_flagship) | 🩹 | `state == lost_flagship` | Same as admiral retreat — wait for RP rebuild. |
| **replenish** | 🔧 | `at_home AND (not fleet_full OR hull ≤80%)` | Patrol home_station. Triggers RP ×2 buff + drone restock + hull repair via 100 RP + drain rebuild loop. |
| **flee** (damaged, away) | 🩹 | `(fleet_damaged OR hull ≤80%) AND NOT at_home` | MoveGeneric to home_station with noattackresponse=true. Clean pass-through — no engagement during retreat. |
| **raid** | ⚔️ | `fleet_full` (all escorts present + flagship healthy) | Closest non-pirate sector within 5 cluster hops. **Excludes Xenon/Kha'ak** — pirates raid soft civilian factions. |
| **lurk** | 🕶️ | Fallback when fleet not full and not damaged | Patrol home_station in a loose orbit. Opportunistic — evaluates saboteur dispatch, joint raid trigger, base ship spawn as side-effects. |

**Force-decision lock:** debug builds include `$decision_force_until` — a 60-min lock so a player-forced raid mode survives HMW re-evals on low-★ pirates whose fleet_full check would otherwise revert them to lurk after taking losses.

## Ship scaling per star rank

Raiders are lighter than admirals — they fly light and mobile, punch above their weight in engagements:

| Rank | Flagship | Escort |
|---|---|---|
| ★ | **L Barbarossa-class destroyer** (updated to L in build_012 phase B — was M Cerberus at first, but ★1 raiders were too weak to trigger natural raids) | 1× S fighter → 2× S at ★★ |
| ★★ | Improved L destroyer | 2× S |
| ★★★ | Fleet destroyer or **L Erlking-class** | 3× S / 1× M |
| ★★★★ | **XL Erlking or top-tier destroyer** | 2× M / 4× S |

Barbarossa @ ★ satisfies `fleet_full` immediately after spawn, so raids trigger via natural HMW eval without needing a force button. This was the key balance fix in iter 14 phase B.

## Order Board — the pirate task board

The Order Board is faction-level, not archetype-specific — every faction has a board. But the **raider order types** are unique to pirates:

| Task type | Requirement | Reward |
|---|---|---|
| **$trader_ambush** | Intercept a specific NPC trader on their route. Small or Medium raider. | Cash + XP + faction rep + trader's cargo if scavenged |
| **$satellite_deploy** | Establish long-range observation posts in border sectors. Higher pay, more risky sectors than admiral $satellite. | Cash + rep + info hook |

Raiders **claim** the cheapest task they qualify for from their faction's board on HMW tick. They then execute it as their `raid` target. On success — task removed from board, reward paid. On failure — task may re-enter the board or expire; raider's rep with the faction (rr₀) drops.

Note that pirate factions also have very few tasks in absolute numbers (Yaki: 3 total tasks in the "Order Board" screenshot). Pirate faction task pools are **small and precious** — an active raider consumes their board's capacity quickly.

![Yaki Order Board detail — no admiral tasks, no coordinator tasks; Pirate / Raider order types: $trader_ambush 1 task, $satellite_deploy 1 task. Active heroes: Shateigashira Yuna Ishikawa, raider archetype, ★, decision = flee. The Yaki are a small pirate faction; a single raider is enough to work their board](/x4-modding-wiki/img/mods/galactic-heroes/pirate-detail.jpg)

## Own economic outputs (C-006 v0.2 pattern)

Beyond raid ↔ replenish, raiders have three economic outputs unique to the archetype. All drain ALL free RP via greedy big-first algorithm at archetype-specific multipliers.

### Joint Raid (★3+)

- **Cost:** drain ALL free RP at 4× base ship_class_cost
- **Effect:** spawn a wave of freelance pirate escorts loaded on top of the raider's own fleet for one raid engagement
- **Cooldown:** 60 min
- **Result @ 100 RP:** 2M + 1S (with fleet mix)
- **Result @ 200 RP:** 1L + 1M
- **Result @ 300 RP:** 1L + 3M + 1S (heavy joint force)
- Fleet returns to freelance status post-raid; the spawned ships are transient

Design intent: ★3 raider unlocks the "joint raid" identity — pirates coordinate for a big score, then disperse.

### Pirate Base (★4+)

- **Cost:** 200 RP
- **Effect:** creates a `pirate_base` station in raider's current sector
- **Persistence:** stored on `$active_heroes.{h}.$pirate_base` (cap 1 per raider)
- **Lifecycle:**
  - Hull → 0 in spawn worker check → auto-cleanup on next tick
  - On full KIA → base destroyed via `<destroy_object>` in FlagshipLostWorker
  - On wounded / unscathed → base survives (they can rebuild fleet from it)

Only ★★★★ raiders build bases. This is endgame — the raider has become **infrastructure**, not just a rogue captain.

### Base Ship Spawn (★4+, cron 60 min)

- **Gates:** `pirate_base.exists AND RP ≥ 150`
- **Cost:** drain ALL free RP at 2× base ship_class_cost
- **Effect:** spawn defenders (25%) + patrollers (75%) from the pirate base
- **Composition:** vanilla AssignCommander pattern — each spawned ship gets a random behaviour (defender=static, patroller=roaming)

★★★★ raider with a pirate base becomes a **local threat generator** — every 60 min, more pirate ships appear from the base, raiding traffic in nearby sectors.

## Behaviour example — a Yaki raider ambush

Shateigashira Yuna Ishikawa, Yaki Clans, ★ (starting), 6 XP, decision = `flee` (per the screenshot she's in retreat state — probably just took losses).

- Two HMW ticks later (10 min), Yuna is back at home_station, RP tick has restored escort, fleet is now full.
- `replenish` cycle completes.
- Next tick: fleet_full, at_home. `raid` decision fires. Picker finds the closest non-pirate non-Xenon non-Kha'ak sector within 5 hops — Hatikvah's Choice II (Hatikvah Free League controls it, but Yaki are hostile to Hatikvah).
- Yuna's frigate + 2× S escort move to Hatikvah's Choice II.
- Enter sector. Vryss's `trader_ambush` task from her Order Board matches a Teladi trader passing through. She engages.
- Trader dies, cargo scavenged. XP +5 (M-class = 5 base × 0.5 raider = 2.5 XP for kills, plus plunder XP).
- Task removed from board. Faction rep bump.
- Retreats via `flee` if damaged in the fight, else stays for another opportunity.

## Recovery cycle

Same [d100 death roll](../../mechanics/death-cycle/) on flagship destruction. Pirate templates typically have **higher `$crit_fail_chance`** than admirals by design — piracy is dangerous work. Perks like Lucky (-10% KIA) help.

On wounded / unscathed, RP rebuild via [Recovery Points](../../mechanics/recovery-points/). XP / ★ / kill count preserved. Pirate Base (if any) survives.

On KIA, standard lineage vacancy → [clone](../../mechanics/lineage-succession/) spawns with inherited perks. If the KIA'd raider had a Pirate Base, the base is destroyed in the flagship loss event.

## Design intent

- **Asymmetric warfare, not attrition.** Pirates don't win by out-shipping the enemy; they win by picking soft targets and bailing when it goes wrong.
- **The Order Board is a small, precious pool.** Pirate factions have few tasks. This means pirate progression is bottlenecked by faction reputation influx, not by ship inventory.
- **Endgame = infrastructure.** ★4 pirate isn't just a great captain — they're a **local pirate presence** that grows over game time via their base.

## What's next

- **Cross-faction contract sharing** — pirate factions occasionally advertising on each other's boards. Not implemented; would need shared task pool.
- **Player-hostile contracts against the player** — if the player has burned relations with a pirate faction, that faction's raiders can pick a "hunt the player" task. Not implemented.
- **Player-hostile contracts targeting a specific NPC** — the player pays a pirate faction to strike a target. Not implemented.
- **★★★★★ tier signature ship** — currently reserved for future per-faction identity (see [C-029](https://github.com/mlog4/galactic_heroes/blob/main/concepts/C-029_fleet_composition_rework.md)).

## Related pages

- [Admiral archetype](../admiral/) — the parallel, non-pirate archetype
- [Military Coordinator](../coordinator/) — the disciplined military counterpart
- [Kha'ak Hive Lord](../khaak-hive-lord/) — the Kha'ak analog (no board, just war)
- [Scout-Saboteur](../saboteur/) — the shared mechanic Raiders use (as of iter 21) for asymmetric ops
- [XP and star progression](../../mechanics/xp-and-stars/) — pirate XP multiplier is ×0.5 for kills, ×1.0 for plunder
- [Death cycle](../../mechanics/death-cycle/) — raiders die same as admirals, but often with higher $crit_fail_chance

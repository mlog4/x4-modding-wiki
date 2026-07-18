---
title: Pirate Raider archetype
description: Order Board contractor. Pirates don't follow faction command — they pick tasks from a shared board. 4 task types, faction savings buffer, per-hero cooldowns.
---

Pirates operate differently from admirals. There is no strategic faction command guiding them — instead, each pirate faction has a shared **Order Board**, and every raider reads the board, picks the cheapest task they can afford, claims it, and acts.

## Coverage

- **4 template pools** across pirate factions (Duke's Buccaneers, Fallen Families, Riptide Rakers, Court of Curbs — plus Scale Plate Pact and others as they become available)
- Typically **1–2 living raiders per pirate faction** in a fully-developed save
- Raiders are usually solo or in small pairs — much smaller fleets than admirals

## The Order Board

Every pirate faction has its own board. Tasks appear over time and disappear when claimed and completed / failed.

![Order Board — pick a faction to inspect. All 22 factions listed with hero count + open task count: Argon Federation 3/72, Godrealm of Paranid 3/82, Teladi Company 4/149, Antigone Republic 2/44, Holy Order 2/70, Ministry of Finance 1/91, Hatikvah Free League 1/36, Zyarth Patriarchy 3/58, Free Families 3/49, Quettanauts 2/12, Terran Protectorate 3/32, Queendom of Boron 3/30, Segaris Pioneers 2/14, Vigor Syndicate 2/28, Riptide Rakers 2/10, Scale Plate Pact 1/18, Duke Buccaneers 1/30, Yaki Clans 1/3, Xenon Mil Units 4/199, Kha'ak 2/37. Total: 45 heroes across 22 factions, 1064 tasks](/x4-modding-wiki/img/mods/galactic-heroes/order-board-menu.jpg)

### How the board fills

- Faction **Reputation Points (RP)** — different from hero RP — tick up over game time
- RP is sourced from **DA-Eco signals**: station losses in the faction's operating area, faction incidents, sector-ownership shifts, etc. Without DA-Eco, RP falls back to a slow synthetic tick.
- When faction RP reaches a threshold, a **new task** is generated on the board.
- Task cost is deducted from faction **savings** when a raider claims it.
- If savings deplete → no new tasks until RP replenishes savings.

The savings buffer prevents runaway task generation. A pirate faction on a hot streak spends its savings fast, then goes quiet until income catches up.

### Task types (current build)

The 4 shipping task types:

| Task | What it does | Reward source |
|---|---|---|
| **Trader ambush** | Intercept a specific NPC trader on their route. Requires a Small or Medium ship. | Cash + XP + faction rep + trader's cargo if scavenged |
| **Sector recon** | Deploy 3× satellites in a specific target sector. Requires satellites in cargo. | Cash + info hook (used by later pirates on follow-up tasks in the same sector) |
| **Satellite deploy** | Establish long-range observation posts in border sectors. Similar to recon but higher pay, more risky sectors. | Cash + rep + info hook |
| **Fishing** | Low-risk patrol in a lightly-defended sector, opportunity strike on whatever prey shows up. Ongoing task with capped reward. | Cash per opportunistic kill, up to a cap; XP; low rep gain |

### Task lifecycle

1. **Generated** — appears on the board with reward, requirements, target details
2. **Claimed** — a raider picks the cheapest task they can afford + qualify for
3. **In progress** — raider flies to target, executes task
4. **Success** — raider gets XP + cash + faction rep bonus; task removed from board
5. **Failed** — raider loses cash + rep; task may re-enter the board or expire

**Failure has consequences:**

- Failed ambush → lost cash, no XP, hero rep with faction drops
- Repeated failures → temporary Order Board access ban (raider must "sit out" and rebuild rep)
- Successful streak → XP + rep bonus, higher-tier tasks unlock

## Ship scaling per star rank

Raider fleets are smaller than admiral fleets — pirates fly light and mobile:

| Rank | Flagship | Escort |
|---|---|---|
| ★ | Medium corvette | 1× S fighter |
| ★★ | Improved corvette or light frigate | 2× S |
| ★★★ | Frigate or light destroyer | 3× S / 1× M |
| ★★★★ | Destroyer | 2× M / 4× S |

Raiders can't take on capital-class engagements solo — they need to pick their targets. High-rank raiders can attempt station-adjacent ops that low-rank raiders can't.

## Behaviour example — a fishing task

You are patrolling near Hatikvah's Choice, sector previously known for pirate activity.

- A ★★ raider of the "Silver Fang" lineage picks the fishing task for this sector from the Riptide Order Board. Cost: 5,000 credits from faction savings. Reward cap: 20,000 credits + XP + rep.
- The raider enters the sector with their frigate and 2× S escort. They patrol at LoA, watching for prey.
- Ten minutes later, a Teladi TS transport enters the sector. The raider engages, kills the ship, scavenges the cargo. XP goes up.
- Twenty minutes later, an Argon patrol arrives. The raider disengages and jumps out. Task ends when the raider leaves the sector, either intact or wounded.
- The raider's XP total went up. Their Order Board access is on cooldown briefly. Faction savings absorbed the task cost but got some of it back from the kill.

The player did not intervene. All of this played out through the Order Board flow, per-hero cooldowns, and vanilla AI orders.

![Yaki Order Board detail — no admiral tasks, no coordinator tasks; Pirate / Raider order types: $trader_ambush 1 task, $satellite_deploy 1 task. Active heroes: Shateigashira Yuna Ishikawa, raider archetype, ★, decision = flee. The Yaki are a small pirate faction; a single raider is enough to work their board](/x4-modding-wiki/img/mods/galactic-heroes/pirate-detail.jpg)

Board tasks are readable per-faction with archetype breakdown. Argon Federation for example shows the admiral-type tasks (station 4, fishing 3, recon 12, satellite 51, hunting 2) that are the peaceful-faction analogue of the pirate board:

![Argon Federation Order Board detail — admiral order types (station, fishing, recon, satellite, hunting) with counts, plus active heroes Sarah Kowalski (admiral, ★, hunting), Lara Wolfe (admiral, ★, hunting), Daria Sokolova (engineer, ★, replenish)](/x4-modding-wiki/img/mods/galactic-heroes/order-board-argon.jpg)

## What's next

- **More task types** — planned: hijacked-cargo runs, station raids (higher-tier), bounty contracts against specific NPC targets
- **Cross-faction contract sharing** — the pirate factions may sometimes advertise on each other's boards (rare, for lore reasons)
- **Player interaction hook** — planned: player can post pirate-hostile contracts against a specific NPC (via player faction rep gating), effectively "hiring" a pirate faction for a strike

## Related pages

- [Admiral archetype](../admiral/) — the faction-command counterpart
- [Kha'ak Hive Lord](../khaak-hive-lord/) — the Kha'ak analog (no board, just war)
- [XP and star progression](../../mechanics/xp-and-stars/) — how raider ranks work
- [Death cycle](../../mechanics/death-cycle/) — raiders die same as admirals, d100 roll, cooldown, RP rebuild

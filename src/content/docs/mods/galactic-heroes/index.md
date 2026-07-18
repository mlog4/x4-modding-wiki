---
title: Galactic Heroes
description: Named NPC heroes for X4 9.x — admirals, pirate raiders, Kha'ak hive lords, seeders. Real flying quest-NPCs with XP, star ranks, d100 death cycle, lineage succession. Overview + deep-dive links.
---

X4's galaxy simulates trade, war, and station-building — at the level of factions, not people. A war between Argon and Holy Order is a relation value, a few job queues, some patrol routes. There is no **Argon admiral whose loss the empire feels**. There is no **infamous Buccaneer raider players hunt across sectors**.

**Galactic Heroes** adds a thin layer of named characters on top of vanilla. Each hero is a real flying quest-NPC with a name, a biography, an archetype, XP gained from confirmed kills, star-rank progression (★ → ★★★★★), a fleet that rebuilds from Recovery Points, and a d100 death roll on flagship loss. When a hero dies for good, the lineage template goes on cooldown and a successor may take over weeks later with fresh XP and a new face.

The design goal is **emergent drama from system rules**, not authored quest content.

> **⚠ Alpha status.** Three archetypes ship in a working state (Admiral, Kha'ak Hive Lord + Seeder, Pirate Raider). ~10 more are designed but unbuilt. Save-compat is best-effort within a major version. Not recommended for casual playthroughs yet — but stable enough for observation, testing, and feedback.

## Installation & configuration

### Requirements

- **X4 Foundations 9.0** or newer (currently developed against 9.0 beta)
- **[SirNukes Mod Support APIs](https://www.nexusmods.com/x4foundations/mods/503)** — required for the Heroes menu (Simple Menu API)
- **[DeadAir Scripts (mlog4 fork)](/x4-modding-wiki/mods/deadair-scripts-fork/)** and **[DeadAir Economy Overhaul (mlog4 fork)](/x4-modding-wiki/mods/deadair-eco-fork/)** — strongly recommended companions (Pirate Order Board sources faction Reputation Points from DA-Eco signals; without them, task generation falls back to a slow synthetic tick)
- **All Egosoft DLCs** — all optional; mod adapts to what you have

### Install

- **Nexus (manual):** Download the latest ZIP, extract into `X4 Foundations/extensions/` (folder must be named `mlog_heroes`).
- **Steam Workshop:** _Coming soon_ — currently Nexus-only during alpha.

### First-time setup — what to expect

1. Launch a game. The mod does not require any menu configuration to start.
2. **In the first 5–10 minutes of game time**, `HeroManager` wakes up on its LoA cron, scans faction state, starts populating the hero roster. Nothing visible on the map yet.
3. **After ~15 minutes**, first heroes spawn on their flagships. Yellow markers appear in Argon Prime, Second Contact II, Getsu Fune, and other faction capitals.
4. **After ~30–60 minutes**, heroes have committed to their first campaigns. Admirals are patrolling contested borders. Pirate Raiders are pulling Order Board tasks. Kha'ak Hive Lords are on the warfront.
5. Open **Extensions → Galactic Heroes** menu any time to see who is alive and what they are doing.

![Galactic Heroes top-level menu — Active heroes / Hero pool / KIA archive / Retired archive / Perks catalog / Order Board](/x4-modding-wiki/img/mods/galactic-heroes/menu-topmenu.jpg)

### Recommended play patterns

- **Observer** — keep the Heroes menu open, watch the roster. When a hero climbs ★★★ or dies, note the story. Great for chill exploration playthroughs.
- **Ally** — track a friendly admiral, join their combat when a big engagement starts, gain rep + XP bonus.
- **Hunter** — track an enemy hero, hunt their flagship. On kill, watch the d100 roll play out — you may be responsible for a KIA that goes on the wall permanently.
- **Interventionist** _(future feature)_ — supply Recovery Points to a favoured hero, accelerate their recovery. Not shipped yet.

## In-game menu tour

The Heroes menu is your control panel. Open via **Extensions → Galactic Heroes** (icon appears once SirNukes API is loaded).

![Active heroes by faction — Argon Federation, Godrealm of Paranid, Teladi Company, Antigone Republic, Holy Order of the Pontifex, Ministry of Finance, Hatikvah Free League, Zyarth Patriarchy, Free Families, Quettanauts each showing living admirals/coordinators/engineers with star rank, XP, RP, current decision, sector](/x4-modding-wiki/img/mods/galactic-heroes/menu-roster.jpg)

Top-level items:

| Menu section | What it shows |
|---|---|
| **Roster** | Every living hero: name, faction, archetype, star rank, current activity, home sector. Filter by faction / archetype / star. |
| **Hero detail** (click a row) | Biography, XP breakdown, kill count, RP balance, flagship + escort composition, current activity, Track button. |
| **Order Board** | Pirate-only. Active tasks per pirate faction, faction savings, claim history. |
| **KIA archive** _(planned)_ | Every dead hero — final stats, cause of death, name on the wall. |
| **Settings** _(planned)_ | `$crit_fail_chance` d100 dial (cinematic / balanced / grimdark / roulette), tick rate overrides, debug logging. |

Every hero has a **Track button** — attaches a live objective marker to the flagship via vanilla Guidance API. Same tracking overlay you'd get from a story mission.

The **Factions submenu** lists every faction the mod has spawned heroes into. Relation column is the mod-internal faction disposition (used for admiral decision-making); Favours is the standing the player has built through gifts to heroes; Heroes is the current living count:

![Factions list — Argon Federation (relation 30, favours 8/1000, 3 heroes), Godrealm of Paranid (30, 8, 3), Teladi Company (30, 8, 5), Antigone Republic (30, 8, 2), Holy Order of the Pontifex (30, 8, 2), Realm of the Trinity (30, 8, 0), Court of Curbs (30, 8, 0), Ministry of Finance (30, 8, 1), Hatikvah Free League (30, 8, 1), Zyarth Patriarchy (30, 8, 3), Free Families (30, 8, 3), Quettanauts (30, 8, 2), Terran Protectorate (30, 8, 3), Queendom of Boron (30, 8, 3), Segaris Pioneers (30, 8, 2), Vigor Syndicate (30, 8, 2), Riptide Rakers (30, 8, 2), Scale Plate Pact (30, 8, 1), Duke Buccaneers (30, 8, 1), Yaki Clans (30, 8, 1), Xenon Mil Units (30, 8, 4), Khaak (30, 8, 2)](/x4-modding-wiki/img/mods/galactic-heroes/factions-list.jpg)

![Captain Sarah Kowalski — Argon admiral ★, RP=65/200 (+2/2 min), 11 XP, 9 kills, 420 000 cr, flagship in Hatikvah's Choice I with 4/4 S-class escorts, perks Logistic + Lucky + Master Logistic, biography and Track hero button](/x4-modding-wiki/img/mods/galactic-heroes/menu-hero-detail.jpg)

## Deep dives

Every mechanic gets its own page below. Read in the order shown for the full model, or jump straight to the archetype that interests you.

### Mechanics

- **[XP and star progression](./mechanics/xp-and-stars/)** — kill weights per class, XP thresholds, what each star unlocks, memorial preservation across recovery
- **[Death cycle (d100 roll)](./mechanics/death-cycle/)** — the roll, the outcomes (KIA / wounded / unscathed), configurable difficulty
- **[Recovery Points](./mechanics/recovery-points/)** — RP tick rates per rank, ship rebuild costs, the 200-cap, why rebuilds take at least 25 minutes
- **[Lineage succession](./mechanics/lineage-succession/)** — pool templates, KIA archive, when a legend dies and who takes over

### Archetypes

- **[Admiral](./archetypes/admiral/)** — faction military leader; multi-sector campaigns; home-space defence
- **[Pirate Raider](./archetypes/pirate-raider/)** — Order Board contractor; 4 task types; faction savings; per-hero cooldowns
- **[Kha'ak Hive Lord](./archetypes/khaak-hive-lord/)** — warfront commander; counter-attack; hive rebuild
- **[Kha'ak Seeder](./archetypes/khaak-seeder/)** — swarm expansion; drops new hives in undefended sectors

## Design philosophy — why the mod is thin

Under the hood, the mod is deliberately minimal. Explicitly out of scope:

- **No new ships, weapons, or station modules.** Heroes use whatever the faction already owns.
- **No new ware types, economy nodes, or supply chains.** Faction Reputation Points plug into existing economy signals (DA-Eco hooks).
- **No new diplomatic mechanics.** Future Diplomat archetype will *call* vanilla diplomatic operations, not replace them.
- **No custom save format.** Heroes are vanilla quest-NPCs with the standard yellow marker. Persistence is what X4 already does for Boso Ta.
- **No custom UI framework.** Simple Menu API handles everything.
- **No per-frame AI.** HeroManager ticks every few game-minutes; all in-flight behaviour delegates to vanilla orders (patrol / protect / attack / commandeer).

Result: **minimal engine footprint, low frame cost, deep integration with X4's living galaxy**. The mod is a strategic decision layer, not a behavioural simulator.

## Known conflicts

| With | Status | Notes |
|------|--------|-------|
| **mlog_frs (Faction Radar Sharing)** | ⚠ Bundled | Do NOT install the standalone `mlog_frs` mod — Galactic Heroes bundles the same code internally. Loading both causes ID conflicts. |
| **VRO 5.01** | ⚠ Untested | Mod does not replace ships, but places heroes on faction-owned ships. Aggressive faction overhauls may need an adapter. Report if you try. |
| **X4-Reemergence** | ❌ Not yet | RE isn't on 9.0. Waiting on RE v1.9 update. |
| **Faction expansion mods** (Apus / ETW / Kaiori) | ⚠ Partial | Modded factions currently get no heroes. Design is spec'd but implementation pending; on the roadmap. |
| **Everything else** | ✅ Compatible | DA Scripts, DA Eco, SirNukes, TaterTrade, Zero-Transporter, mlog_dev_bridge — all coexist cleanly. |

## Known limitations & alpha caveats

Honest list. None are blockers, but they are real:

- **Pirate Order Board needs DA-Eco** for meaningful task flow. On vanilla install, task generation is very slow (falls back to synthetic tick).
- **Performance tested up to ~30 active heroes.** Theoretical cap ~160 (16 factions × 10). No measurements past 30.
- **Xenon archetype** currently uses Admiral templates — mechanically works but narratively wrong. Proper Xenon design pending.
- **Coordinator, Engineer, ~10 more archetypes** designed in `concepts/` but unbuilt.
- **Perk system** — designed in C-009, unbuilt.
- **Player rep gating** — heroes visible at rep ≥ 0, bio at ≥ 10, live tracking at ≥ 20 — spec'd but not enforced yet.
- **Modded faction support** — Apus / ETW / Kaiori don't get heroes yet.
- **Localization** — text mostly inline. EN + RU baseline. Full t-file extraction pending.

## Links and source

- **Nexus:** _(link pending)_
- **GitHub:** [github.com/mlog4/galactic_heroes](https://github.com/mlog4/galactic_heroes)
- **License:** TBD (likely MIT or similar permissive) — will be set before v1.0

**Design corpus in the source repo:** 31 concept docs, 23 iteration plans, 19 engine research notes. Contributors should start with `concepts/C-001_overall_vision.md` and `docs/DESIGN.en.md`.

**Credits:**
- **mlog4** — design + implementation
- **DeadAirRT** — Expeditionary Corps pattern (battle-tested multi-sector flotilla logic that Galactic Heroes borrows for admiral decision cycles); DA-Eco signals that feed Pirate Order Board
- **SirNukes** — Mod Support APIs (Simple Menu API for the Heroes menu)
- **Egosoft** — Guidance API + quest-NPC persistence primitives Galactic Heroes builds on

## Version notes

**v0.1 (alpha, current):** Three shipping archetypes (Admiral × 10 templates × 8 factions, Kha'ak Hive Lord × 6 templates, Kha'ak Seeder × 4 templates, Pirate Raider × 4 templates with 4 task types on Order Board). LoA HeroManager cron, XP + star progression proven, death cycle + d100 outcome + lineage succession proven, Heroes menu via SirNukes API, "Track this hero" via vanilla Guidance API.

**Next release targets:** Xenon proper archetype, Coordinator, Engineer, perk system C-009, player-rep gating.

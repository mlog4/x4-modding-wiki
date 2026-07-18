---
title: Scout-Saboteur (shared mechanic)
description: Asymmetric tactical primitive. A cheap one-way S-class ship deploys 2-10 mines in enemy territory and self-destructs. Available to Pirate Raider, Military Coordinator, and Kha'ak Hive Lord.
---

Vanilla X4 NPCs do many things, but they don't **deploy mines**. Turret grids, patrols, blockades — yes. Sacrificial mine-layers — no. So a mod that adds NPC-driven mine deployment is adding a **tactical primitive** that the vanilla galaxy doesn't have.

The **Scout-Saboteur** is exactly that. It's not a separate archetype (no lineage, no career, no XP). It's a **shared combat decision** that a Raider, Coordinator, or Hive Lord can execute — a way to **spend RP for an asymmetric tactical effect** in an enemy sector.

## The mechanic

A saboteur is a **one-way ship**. The dispatching hero:

1. Picks a target sector (enemy trade waypoint, enemy-facing gate, enemy fleet's likely path)
2. Spends ~30 RP (variable per ship class / dispatcher)
3. Spawns a cheap S-class fighter (from the hero's fleet template `$tier1.$s_macro`) loaded with mines in its `ammostorage`
4. Sends the saboteur to the target position via cross-sector orders (vanilla `move` + `deployobjectatposition` chain)
5. On arrival, saboteur deploys **2-10 mines** (dynamic — determined by the ship's `ammostorage.{mine}.count` after the `add_ammo` call; vanilla silently caps at deployable storage)
6. Once all mines are deployed, saboteur self-destructs — either via `move.random` triggered destroy pattern, OR by flying into own minefield → chain reaction → maximum coverage

Total time per saboteur dispatch: **3-5 game-minutes** including travel.

## Three tactical use cases

### A. Offensive minelaying — sabotage deep in enemy territory

- **Target:** enemy trade route waypoint, deep inside a hostile faction's own space
- **Cargo:** FF mines (targets enemy faction ships)
- **Effect:** enemy trade freighters start losing hulls on their normal routes → economic drag on the target faction
- **Best for:** a Coordinator who lacks force superiority for a proper invasion, but can afford asymmetric disruption

### B. Defensive minelaying — drop-and-forget at your own gate

- **Target:** an enemy-facing gate in your OWN faction's border sector
- **Cargo:** FF mines (friend-or-foe — protects you AND your allies from anyone hostile passing through)
- **Effect:** enemy invasion attempts through this gate lose escorts BEFORE they engage → attackers arrive at combat weakened
- **Recurring pattern:** ★2 Coordinator dispatches saboteur → mines used up by an enemy incursion → 30 min later, dispatch a new saboteur
- **Cheaper than a static 100-turret grid** (vanilla-scale defence grids are usually 5-30 objects anyway — mines fit that range while being consumable)

### C. Counter-mine clearance — sacrificial run through enemy field

- **Target:** an enemy-mined gate that blocks your main fleet's offensive
- **Cargo:** ZERO mines (the saboteur's job here is to trigger, not to lay)
- **Effect:** saboteur flies INTO the enemy mine field → chain reaction clears the field → main fleet proceeds without hitting mines
- **Least common** — requires prior knowledge of enemy mines, which is rare

## Who can dispatch

The Scout-Saboteur is a **shared** decision available to specific archetypes:

- **[Pirate Raider](../pirate-raider/)** — as of iter 21 (build_018), Raiders auto-dispatch saboteurs when their eval identifies a hot enemy trade waypoint. Fits pirate playstyle (asymmetric harass, low investment, high disruption).
- **[Military Coordinator](../coordinator/)** — from ★2. Coordinators use saboteurs both offensively (harass enemy economy) and defensively (own-space minefield maintenance).
- **[Kha'ak Hive Lord](../khaak-hive-lord/)** — from ★2. Fits Kha'ak swarm-suicide aesthetic perfectly. Kha'ak already have "throw fighters at problems" as their identity; saboteur is a formalized version.

**NOT available to Admirals.** Admirals are **survival-first**: they command from safety, subordinates take the risks — but subordinate suicide is a bridge too far. Admirals delegate risk to escorts, not sacrifice them.

**NOT available to Engineers or Seeders** — different roles entirely.

## Mine count is dynamic (design deviation from concept)

Original C-012 spec called for "10-20 mines per dispatch". Actual shipped behaviour: **2-10 mines**.

Why: X4 9.x silently caps `ammostorage.{weapon_gen_mine_03_macro}.count` at the ship's own deployable-mine capacity. An S-class fighter's ammostorage is small. Loading 20 mines via `add_ammo` results in 2-10 actually loaded (rest discarded).

For higher mine counts, a future variant would need a bigger ship class (M frigate saboteur → 20+ mines) or a `create_object` MD bypass (spawn mines directly, skip ammostorage).

## RP cost & cooldown

- **Cost:** ~30 RP per dispatch (baseline; can be modified by archetype-specific perks)
- **No per-hero cooldown enforced** — the RP cost is the natural throttle. A ★★ Coordinator with 10 RP/tick can dispatch a saboteur every 15 game-minutes if they choose to spend everything on it.
- **In practice:** Coordinators tend to dispatch 1 saboteur per HeroManager tick when they have a target; Raiders dispatch opportunistically when their eval finds a hot trade waypoint.

## Behaviour example — Coordinator defensive mine drop

Argon Coordinator Vasquez (★★★, 4,200 XP) sees an enemy Xenon L destroyer in Silent Witness IV — Argon's northern buffer sector. The Xenon is likely to pass through the Argon Prime gate next.

- HMW eval identifies Argon Prime gate as a critical defence point.
- Vasquez commits to a **saboteur dispatch** side-effect (parallel to their primary `faction_defense` decision).
- Spawns an Argon S-class fighter loaded with FF mines. RP -30.
- Saboteur flies to Argon Prime gate (2 sectors, ~3 minutes travel), deploys 5 mines around the gate mouth.
- Self-destructs.
- Ten minutes later, the Xenon L destroyer approaches the gate, hits the mine field, chain reaction takes out the destroyer's engine array + shields.
- Argon patrols engage the crippled Xenon and finish it off.
- The saboteur cost 30 RP + one S-fighter's build cost (paid by faction job pool, not by Vasquez). The kill went to whichever patrol dealt the last hit.

## Design intent

- **NPC access to a player-tier tactic.** Mines are a valid X4 tactic; before Heroes, only players used them. Now Kha'ak, pirates, and disciplined faction militaries do too.
- **Cheap risk-transfer.** The saboteur costs a single S-fighter + 30 RP. If the enemy doesn't hit the mines, you lose nothing consequential. If they do, you kill above your investment.
- **Discrete-cost tactical primitive.** RP is a discrete resource; saboteur is a discrete action. Compared to admiral "commit fleet to sector" which is expensive and reversible slowly, saboteur is fast, cheap, deniable.
- **Archetype fit-to-role.** Raiders sabotage (fits piracy). Coordinators sabotage (fits strategic warfare). Kha'ak sabotage (fits swarm-suicide). Admirals do not (fits survival-first). Every archetype gets access to the primitives that fit their role.

## What's next

- **Bigger ship saboteurs** — for larger mine payloads, use M-class instead of S-class. Requires modding fleet templates to include a "saboteur variant" per faction.
- **Specialized saboteurs** — variations by cargo: EMP-only, hull-damage-only, trap-only. Currently all use standard mines.
- **Coordinated waves** — multiple saboteurs from multiple archetypes converging on the same target for maximum coverage. Currently each dispatches independently.
- **Player counter-saboteur** — a "sweep gate" mission or ability for the player to clear enemy-laid mines. Not implemented; would fit a player counter-hero role.

## Related pages

- [Pirate Raider archetype](../pirate-raider/) — the first archetype to use saboteur (iter 21)
- [Military Coordinator archetype](../coordinator/) — uses saboteur as a defensive + offensive primitive
- [Kha'ak Hive Lord archetype](../khaak-hive-lord/) — Kha'ak-native user of saboteur (thematic fit)
- [Recovery Points](../../mechanics/recovery-points/) — the RP economy that gates saboteur dispatch frequency

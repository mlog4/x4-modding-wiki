---
title: Kha'ak Seeder archetype
description: Aggressive swarm-expansion AI for Kha'ak factions. Finds undefended border sectors and deploys new hives. The offensive counterpart to the Hive Lord.
---

**Seeders** are the aggressive counterpart to [Hive Lords](../khaak-hive-lord/). While Hive Lords hold what the Kha'ak already have, Seeders **find new territory** — undefended sectors adjacent to Kha'ak space — and drop **new hives** in them.

## Coverage

- **4 template pools** across the Kha'ak factions
- Typically **1 active Seeder at a time** across all Kha'ak factions
- Seeder fleets are smaller than Hive Lord fleets — they need mobility, not combat mass

## Decision cycle

Seeders scan the sector graph looking for expansion targets:

- **Sector eligibility check** — adjacent to existing Kha'ak space, no faction has strong military presence, no player-owned station, has a viable hive-drop position
- **Prioritize by risk × reward** — undefended-and-close beats defended-and-strategic
- **Move to target** — Seeder flies to the chosen sector under vanilla `move` orders
- **Drop hive** — creates a new Kha'ak hive station at the chosen position via vanilla station-creation flow
- **Retreat to home** — after successful drop, the Seeder returns to Kha'ak space to re-arm and start scanning again

If the target sector becomes defended between "chosen" and "arrival" (e.g. an admiral commits to protect it), the Seeder aborts and picks a new target next cycle.

## Ship scaling

Seeders are lighter than Hive Lords — they trade combat power for mobility and deployment gear:

| Rank | Flagship | Escort |
|---|---|---|
| ★ | Kha'ak Corvette with drop gear | 1× Kha'ak fighter |
| ★★ | Improved corvette | 2× Kha'ak fighters |
| ★★★ | Light Queen variant | 3× Kha'ak fighters |
| ★★★★ | Elite drop Queen | 4× Kha'ak fighters / 1× cluster |

A ★★★★ Seeder can drop hives in sectors that ★ Seeders can't safely reach — they can survive brief engagements with defensive fleets during the drop window.

## Behaviour example — spreading

The player is running a busy trading route through the Antigone sectors. Kha'ak activity has been quiet for weeks.

- The Kha'ak Seeder of the "Silent Weaver" lineage (★★, 250 XP — Seeders don't gain XP as fast as combat archetypes) runs its scan cycle.
- The scanner finds an undefended border sector two jumps from Antigone Memorial. No player stations. No Argon patrols in the vicinity. Good candidate.
- The Seeder moves through neutral space, entering the target sector without incident (fights would trigger admiral responses; the Seeder avoids them by going through unclaimed sectors).
- Ten minutes after entering the sector, the Seeder deploys a new Kha'ak hive.
- The Kha'ak Hive Lord of the "Deep Voice" lineage in the adjacent sector picks up the new hive in its defensive rotation.
- If Antigone Republic notices the new hive within its patrol range, the Antigone admiral commits to a sector-reclaim decision.

If nobody clears the hive, it will grow. Over time, that sector becomes Kha'ak territory. **The universe is expanding without a script telling it to.**

![Brood-Mother — Distributed Brood-Mother of the Kha'ak hive network. Drifts between mineral-rich systems, seeding nests and hive structures, then teleports to safety when threatened. ★★★ (3/5), 1060 XP, 59 kills, last kill ship_s (+1 XP) in Matrix #451. Flagship "Hive Drone of Brood-Mother" in Sanctuary of Darkness, decision = Guarding hive. Escorts 2 M / 4 S filled. Perks: Legendary Veteran / Lucky / Lucky Leader / Khaak Seed / Volunteer](/x4-modding-wiki/img/mods/galactic-heroes/khaak-seeder-drop.jpg)

The Seeder Network state is exposed on the hero detail page — this is the swarm-expansion machinery in action:

![Brood-Mother Seeder Network detail — Threat (current sector) 0, Hives (galaxy-wide) 6, Outposts/Nests (galaxy-wide) 3, Can teleport = no, Spawn sector default fallback = Sanctuary of Darkness, Summon pool size 0 ship(s) tracked for kill XP, Small summon CD ready (RP >= 100), Outpost CD (*2+) ready (RP >= 150), Hive CD (*3+) ready (RP >= 200), Big summon CD (*4 only) ready (RP >= 150), Quota (max seeders) 1](/x4-modding-wiki/img/mods/galactic-heroes/seeder-network.jpg)

The cooldown ladder (small → outpost → hive → big summon) is what makes Kha'ak expansion **gradual**. A ★★★ Seeder like Brood-Mother has all cooldowns armed, but each drop still costs RP and drains the reservoir — so drops happen at a measured pace, not in a burst.

## Recovery cycle

- Same [d100 death roll](../../mechanics/death-cycle/) on Seeder ship destruction. Seeders die more often than Hive Lords because they operate in contested space and their fleets are lighter.
- On KIA, the Seeder [lineage](../../mechanics/lineage-succession/) enters vacancy for 120 min. During the drought, no new hives are being seeded — Kha'ak expansion slows.
- On wounded / unscathed, [Recovery Points](../../mechanics/recovery-points/) rebuild the fleet gradually. During recovery, no new hives get dropped.

## Relationship to Hive Lords

Seeders and Hive Lords together model a **self-propagating Kha'ak threat**:

1. **Seeder** finds an undefended border sector
2. Seeder **drops a new hive**
3. Nearby **Hive Lord** picks up the new hive in its defensive rotation
4. If attacked, Hive Lord **counter-attacks** — putting pressure back on the aggressor
5. If the aggressor gives up, Seeder finds another target

Clearing one Kha'ak sector doesn't stop the Kha'ak. The Seeder will eventually find another vulnerable position. Over enough time, unattended Kha'ak factions spread. The player is under low but constant pressure to keep patrols active.

## What's next

- **Seeder priority tuning** — currently the sector-eligibility check is simple (adjacency + no defence). Planned: economic value weighting so Kha'ak preferentially target resource-rich sectors.
- **Seeder / Hive Lord shared warfront ledger** — Seeders currently don't know Hive Lord decisions and vice versa; planned coordination via shared state.
- **Player-buildable Kha'ak repellers** _(concept, not spec'd)_ — a way for the player to build permanent defensive stations that Seeders won't target. Would give a way to lock down "cleaned" territory.

## Related pages

- [Kha'ak Hive Lord archetype](../khaak-hive-lord/) — the defensive counterpart
- [Admiral archetype](../admiral/) — how human-faction admirals react to Kha'ak expansion
- [Death cycle](../../mechanics/death-cycle/)
- [Recovery Points](../../mechanics/recovery-points/)

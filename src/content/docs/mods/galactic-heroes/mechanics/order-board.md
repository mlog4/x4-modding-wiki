---
title: The Order Board
description: The shared work queue every hero acts from — 31 task types across five archetypes, posted by faction planners, claimed by priority and reachability, and readable in game through a live read-only inspector that only prints three sections.
---

Heroes in this mod do not run a private script each. They all read one queue.

The **Order Board** is that queue: a faction posts work, and any hero of that faction who can reach it may claim it. It is the reason two admirals of the same faction do not both fly to the same emergency, and the reason a hero who is idle is genuinely idle rather than waiting on a timer.

It is also the mod's best debugging surface, so it ships as a screen you can open.

## The inspector

The board is **read-only in the UI**. You cannot post a task, cancel one, or steer a hero from here. What you get is the truth of what the AI is currently working on.

![Galactic Heroes - Order Board. Header reads "Order Board - pick a faction to inspect". One row per faction with its live counters: Antigone Republic heroes 2 tasks 35, Argon Federation heroes 3 tasks 73, Duke Buccaneers heroes 1 tasks 27, Free Families heroes 3 tasks 52, Godrealm of Paranid heroes 3 tasks 81, Hatikvah Free League heroes 1 tasks 31, Holy Order of the Pontifex heroes 2 tasks 60, Khaak heroes 2 tasks 41, Ministry of Finance heroes 1 tasks 83, Queendom of Boron heroes 3 tasks 32, Quettanauts heroes 2 tasks 10, Riptide Rakers heroes 2 tasks 8, Scale Plate Pact heroes 1 tasks 18, Segaris Pioneers heroes 2 tasks 17, Teladi Company heroes 4 tasks 107, Terran Protectorate heroes 3 tasks 36, Vigor Syndicate heroes 2 tasks 22, Xenon Mil Units heroes 4 tasks 233, Yaki Clans heroes 1 tasks 3, Zyarth Patriarchy heroes 3 tasks 57. A footer totals the galaxy: 45 heroes across 20 factions, 1026 tasks](/x4-modding-wiki/img/mods/galactic-heroes/order-board-menu.jpg)

The footer is the honest summary of the whole mod at that moment: **45 heroes, 20 factions, 1026 live tasks.**

Two things in that list are worth reading twice. The Xenon are carrying **233 tasks against 4 heroes** — a faction generating far more work than it can staff, which is what a front line looks like from the inside. The Yaki have 3 tasks and one hero, which is what a faction with almost no territory looks like.

## One faction's board

Click a faction and the work is grouped into sections.

![Galactic Heroes - Order Board - Teladi Company. Order types for the admiral: station duty 16 tasks, fishing 1, recon 19, satellite 70, urgent defence 1. Coordinator order types: invasion 2, defensive build 2, fishing 1, satellite 67, recon 19. A Pirate / Raider order types section reads "no active raider tasks". Below, an Active heroes table lists Karyo admiral 2 stars on Urgent defence, Ryyzz admiral 2 stars on Strike a station, Risi-Lik coordinator 2 stars Idle, and Krrztt engineer 2 stars on Replenish](/x4-modding-wiki/img/mods/galactic-heroes/order-board-faction.jpg)

The split is not cosmetic. **A task is typed to an archetype and only that archetype claims it.** A raider will never pick up station duty, and an admiral will never run a saboteur job — so the Pirate/Raider section here is empty not because anything is wrong, but because the Teladi employ no raiders.

There are only three section headings, and the mod has five archetypes that produce work. [What that costs the screen](#why-the-screen-says-otherwise) is worth reading before you take the first heading at face value.

The *Active heroes* table below is the other half of the picture: it shows what each hero actually decided, which is how you catch a hero idling next to a board full of work it cannot reach.

## A single task

Drill once more and you get the rows themselves.

![Galactic Heroes - OB - Teladi Company - fishing (admiral). A table with columns ID, Target, Sector, Status / Claimant, Prio / Age holds one row: task 1039, target Jump Gate, sector Fires of Defeat, status "in progress / Ryyzz", priority 5.65625, age 24 minutes. A footer reads "Total: 1 task(s) for this faction"](/x4-modding-wiki/img/mods/galactic-heroes/order-board-tasks.jpg)

Five columns, and each one answers a question you would otherwise have to guess at:

| Column | What it tells you |
|---|---|
| **ID** | The task's identity. It is stable, so you can watch one task across several visits. |
| **Target / Sector** | What the work is about and where. |
| **Status / Claimant** | `open` with no name, or `in progress` with the hero who took it. |
| **Prio** | The score the claim is decided on. Highest wins. |
| **Age** | How long it has been on the board. A high age on an open task means nobody can reach it. |

That priority is a **fraction, not a rank** — 5.65625 here. Scores are computed, not assigned, so two tasks of the same kind still order deterministically against each other.

## How a hero picks

The claim is the whole decision model, and it is short:

1. Filter the board to **this hero's faction**.
2. Filter to tasks that are **reachable** — the hero's current sector, plus faction-owned sectors one cluster away.
3. Filter to `status == 'open'`, **plus the task this hero already holds**.
4. Take the **highest priority** survivor, mark it `in_progress`, and stamp it with the hero's key and the claim time.

Step 3 reads like a technicality and is a scar. The scan originally matched `open` only — but claiming sets `in_progress`, so on the very next tick a hero could not see its own task, the lookup returned nothing, and the hero fell through to other behaviour. **A hero abandoned the job it had just taken, every tick, because the filter that found work excluded work in progress.**

Reachability in step 2 is why the board can be long and a hero still idle. Work three jumps away is not a task that hero has; it is a task somebody else will take.

## The 31 task types

Five archetypes produce and claim work. The board, however, has **three sections** — and that mismatch is the one thing to understand before reading the screen.

### Admiral — 6

| Type | | Type | |
|---|---|---|---|
| `station` | station duty | `urgent_defense` | urgent defence |
| `fishing` | fishing | `hunting` | hunting |
| `recon` | recon | `satellite` | satellite |

### Coordinator — 8

| Type | | Type | |
|---|---|---|---|
| `emergency` | emergency | `defensive_dismantle` | defensive dismantle |
| `invasion` | invasion | `fishing` | fishing |
| `defensive_repair` | defensive repair | `satellite` | satellite |
| `defensive_build` | defensive build | `recon` | recon |

### Pirate raider — 8

| Type | | Type | |
|---|---|---|---|
| `trader_ambush` | trader ambush | `saboteur_run` | saboteur run |
| `fishing` | fishing | `base_reinforce` | base reinforce |
| `satellite` | satellite deploy | `base_build` | base build |
| `recon` | recon | `joint_raid` | joint raid |

### Kha'ak — 9

These are not faction work. The whole block is written only when a faction has a Kha'ak [hive lord](../../archetypes/khaak-hive-lord/) or [seeder](../../archetypes/khaak-seeder/), and each type is claimable by one of them alone.

| Hive lord — 4 | | Seeder — 5 | |
|---|---|---|---|
| `swarm_summon` | swarm summon | `small_resonance` | small resonance |
| `gate_defense` | gate defence | `big_resonance` | big resonance |
| `call_for_help` | call for help | `system_resonance` | system resonance |
| `fleet_defense` | fleet defence | `hive_development` | hive development |
| | | `expansion` | expansion |

Four names repeat across archetypes — `fishing`, `satellite` and `recon` for the admiral, the coordinator and the raider alike. **The same word is a different task.** A raider's `satellite deploy` is not an admiral's `satellite`; they are separate rows on the board, produced by different planners, and claimable only by their own archetype.

### Why the screen says otherwise

The board prints **three** sections — *Order types*, *Coordinator order types*, *Pirate / Raider order types* — from a field on each declared row. There is no Kha'ak section, so all nine Kha'ak types carry that field set to `admiral` and appear under the first heading.

**That heading is wrong for them, and it is a display bug rather than a design.** No Argon admiral has ever summoned a swarm or tuned a resonance; the claim for every one of those nine is gated on the hero being a Kha'ak hive lord or seeder. You only ever see them on the Kha'ak faction's own page, where the section label is the only misleading thing on screen.

The tables above are grouped by the archetype that actually does the work, taken from those claim gates rather than from the section field.

## Reading the board as a diagnostic

The inspector was built to answer questions about the AI that no log line answers well:

- **A hero is idle and the board is long.** Look at the sectors: the work is out of reach, not being ignored.
- **A faction's task count climbs and never falls.** It is generating work faster than its hero cap can absorb — the cap arithmetic is on the [hero pool screen](../../#in-game-menu-tour).
- **A task's age keeps growing while it stays open.** Nobody of the right archetype is near it. The Teladi raider section above is the extreme case: no raiders, so raider work would sit forever.
- **Two heroes, one target.** Should be impossible; the claim is exclusive. If you ever see it, it is a bug worth reporting.

## Honest list

- **The board is read-only.** By design for now: the queue is the AI's, and a player-editable queue is a different feature with different failure modes.
- **⚠ The Kha'ak types are printed under the admiral heading.** A real display bug: the board has three section headings and five archetypes produce work, so the nine hive lord and seeder types are declared into the admiral section for want of anywhere else. Only the label is wrong — the claim gates are correct, and no admiral can take one.
- **Priority is not explained in the UI.** You see the number, not its terms. That is deliberate while the weights are still being tuned — a documented formula that then changes is worse than a visible score.
- **Counts are live, not historical.** The screen shows what is on the board now. Completed tasks leave it, and their record goes to the hero's [chronicle](../../corporate/chronicle/) instead.
- **Per-faction pages are registered lazily.** A faction's detail page exists after you first open it, so a fresh session registers them as you browse. This is a Simple Menu API constraint, not a choice.

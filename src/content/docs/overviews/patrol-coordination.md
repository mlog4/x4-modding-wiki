---
title: Patrol coordination
description: The galaxy combat bus that routes distress calls to nearest available patrols. CentralInformationCenter + per-faction priority queue + per-instance engagement.
---

When an Argon trade ship is attacked by Xenon in Argon Prime, the Argon faction sends reinforcements — but not just any reinforcements. Vanilla decides WHICH ships, from WHERE, with WHAT priority. That decision is made by the **Patrol Coordination Service** — a sub-system of [Faction goals](/overviews/faction-goals/) implementing X4's galaxy-wide combat reaction.

`factiongoal_patrolcoordinationservice.xml` is **1260 lines**, the longest single subsystem in faction logic.

## The three components

```
┌──────────────────────────────────────────┐
│  Layer 1: CentralInformationCenter (CIC) │
│  - Singleton (one per galaxy)             │
│  - Listens for ALL faction distress calls │
│  - Maintains master list of incidents     │
└─────────────────┬────────────────────────┘
                  ↓ broadcasts to
┌──────────────────────────────────────────┐
│  Layer 2: Per-faction PCS instance       │
│  - One instance per active faction        │
│  - Evaluates each incident against        │
│    own resources / interests              │
│  - Selects responses                      │
└─────────────────┬────────────────────────┘
                  ↓ dispatches
┌──────────────────────────────────────────┐
│  Layer 3: Per-patrol Send_Patrol         │
│  - Spawns or redirects specific ships     │
│  - Tracks arrival / disruption            │
│  - Reports outcomes back                  │
└──────────────────────────────────────────┘
```

## Layer 1: CentralInformationCenter

`CentralInformationCenter` is a single galaxy-wide cue that:

- Listens for distress calls from any faction (`Listen_DistressCalls`)
- Adds each incident to `MasterList_DistressCalls`
- Periodically trims old entries (`Trim_MasterList`, every 780s = 13 min)
- Broadcasts to per-faction instances

The master list is the "combat news ticker" for the whole galaxy. Every faction's PCS reads from it.

The data per incident:

| Field | Meaning |
|---|---|
| Attacker | Object doing the attacking |
| Attacked | Object being attacked |
| Position | Where it's happening (zone + sector + cluster) |
| Time | When the call came in |

Old entries (> `$Time_DataObsolete` minutes) are trimmed — the master list is recency-weighted.

## Layer 2: Per-faction PCS instance

Each active faction registers its own PCS instance via `Register_Factions`. The instance:

1. **Processes signals** (`Process_Signal`) — when an incident is added or updated, evaluate relevance
2. **Designates scouts** (`Designate_Scout`) — sends recon ships to verify
3. **Reinforces positions** (`Reinforce_Position`) — main response coordinator
4. **Sends patrols** (`Send_Patrol`) — dispatches specific ships
5. **Analyzes threats** (`Analyze_Threat`) — weighs force vs incident
6. **Acts** (`Act`) — executes chosen response

The instance maintains its own **priority queue** of incidents — high-priority threats (e.g. attack on a HQ) jump the queue regardless of recency.

### Decision weights

The `Analyze_Threat` cue evaluates multiple factors:

- **Distance from response ships** — closer = higher priority
- **Threat strength** — bigger attackers need bigger response
- **Faction relations** — defending allies vs ignoring strangers
- **Available patrol ships** — what's in range
- **Strategic value of target** — HQ > standard station > civilian ship

These weights feed `Act`, which selects 0..N patrol responses.

## Layer 3: Send_Patrol

For each selected response, `Send_Patrol` spawns or redirects ships:

```
   Send_Patrol
            ↓
   ┌──────────────────────────────┐
   │  Identify available ships     │
   │  - Existing patrols in area    │
   │  - Defending fleets            │
   │  - On-call reinforcements      │
   └────────────┬─────────────────┘
                ↓
   ┌──────────────────────────────┐
   │  Issue orders                  │
   │  - Patrol_Arrived (success)    │
   │  - Patrol_Disrupted (failure)  │
   └──────────────────────────────┘
```

Each patrol dispatch is tracked as a sub-instance. The PCS waits for outcome events (arrival, engagement, ship loss) before considering the incident "addressed".

## Why this architecture matters

### Galaxy-wide visibility

Without a CIC, each faction would only react to threats in its own visible space. The CIC means Argon knows about Boron's distress (and may choose to help).

### Faction independence

Each faction's PCS evaluates incidents in isolation. Argon's PCS doesn't know what Teladi's PCS plans — they may both respond to the same incident, or neither, depending on their independent calculations.

### Priority queue prevents starvation

Without a priority queue, low-importance incidents could starve high-importance ones if they kept arriving. The queue ensures HQ attacks always get response, even mid-firefight.

### Decoupled dispatch

`Send_Patrol` is decoupled from `Reinforce_Position` — the latter decides "I want a response", the former handles the mechanics. This lets vanilla swap out dispatch implementations without changing decision logic.

## Subscription / signal pattern

The PCS uses a publisher-subscriber model:

```
   Ship attacks happen
            ↓
   Engine fires event_object_attacked
            ↓
   Listen_DistressCalls catches it
            ↓
   CIC adds to MasterList_DistressCalls
            ↓
   Each faction's PCS instance receives broadcast
            ↓
   Process_Signal evaluates relevance
   (most factions ignore most incidents)
            ↓
   If relevant: Analyze_Threat → Act → Send_Patrol
```

The "most factions ignore most incidents" property is what makes this scalable — each PCS only deeply evaluates incidents within its scope.

## Distress call data structure

The `$DistressCalls` variable holds per-incident records:

```
$DistressCalls.{N} = [
   {1}: AttackedObject (ship/station)
   {2}: AttackedSector
   {3}: TimeStamp
   ...
]
```

Vanilla `factiongoal_patrolcoordinationservice.xml:300` shows the lookup pattern. Modders extending PCS should follow this shape.

## Why this matters for modders

### Adding custom factions

A new faction needs `Register_Factions` to wire it into the CIC. Without registration, the faction never receives distress signals — its territory will go undefended in incidents it can't see.

### Tuning response intensity

Mods that want "Argon responds harder" can adjust the weights in `Analyze_Threat` — but be careful: the system is balanced for the existing weights. Overly aggressive response inflates combat traffic.

### Custom response types

`Send_Patrol` is the dispatch primitive. Custom responses (e.g. "deploy lasertowers", "spawn defence fleet") should mirror its arrival/disruption tracking pattern.

### Performance

CIC + per-faction PCS scales linearly with active factions. Mods adding many factions (e.g. ~24 active) add 2× the PCS workload. Vanilla tunes for 10-12 active factions.

## Cross-references

- [Faction goals](/overviews/faction-goals/) — parent system (PCS is a goal)
- [Faction](/game/factions/faction/) — owner of the PCS
- [Sector](/game/world/sector/) — where incidents happen
- [Ship](/game/objects/ship/) — what patrols dispatch
- [NPC orders](/overviews/npc-orders/) — what patrols receive

## Related architectural overviews

- [Faction goals](/overviews/faction-goals/) — Patrol is part of the goal registry
- [NPC orders](/overviews/npc-orders/) — what patrol ships execute
- [Mission framework](/overviews/mission-framework/) — separate but parallel "ships doing things" system

---

:::tip[Pattern — galaxy-wide combat bus]
Patrol coordination is **X4's combat broadcast system** — singleton CIC + per-faction subscribers + per-instance dispatch. The pub-sub shape scales to many factions because each subscriber filters at receive time. Mods extending combat AI should hook into the CIC bus, not bypass it.
:::

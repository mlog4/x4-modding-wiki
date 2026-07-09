---
title: Faction goals
description: How factions pick strategic actions — hold, invade, plunder, patrol. The two-tier registry pattern with PriorityGoals + EvaluatedGoals, FactionSubgoals, and the goal contract.
---

Above [Faction economy](/overviews/faction-economy/) (which manages day-to-day stations and freighters) sits a higher layer: **faction goals**. This is where vanilla decides "should Argon invade Boron space?" or "should Teladi run plunder operations?" — strategic, multi-stage actions that take time to play out.

Vanilla implements goals across 4 `factiongoal_*.xml` files (Hold / Invade / Plunder / Patrol) plus 4 `factionsubgoal_*.xml` files (BuildStation / DefendArea / PrepareStagingArea / Recon). The whole system is tied together by a **two-tier evaluation pattern**.

## The two tiers

```
┌──────────────────────────────────────────┐
│  Per-faction tick                        │
└────────────────┬─────────────────────────┘
                 ↓
┌──────────────────────────────────────────┐
│  Tier 1: PriorityGoals                   │
│  - Must-run goals                        │
│  - Examples: Hold_Space                  │
│  - Run regardless of competing options    │
└────────────────┬─────────────────────────┘
                 ↓
┌──────────────────────────────────────────┐
│  Tier 2: EvaluatedGoals                  │
│  - Compete for execution                 │
│  - Examples: Invade / Plunder / Patrol   │
│  - Faction picks best based on weight    │
└────────────────┬─────────────────────────┘
                 ↓
┌──────────────────────────────────────────┐
│  Selected goal runs                      │
│  - Drives subgoals (Recon, BuildStation, │
│    DefendArea, PrepareStagingArea)        │
└──────────────────────────────────────────┘
```

The distinction:

- **PriorityGoals** ALWAYS execute their evaluation/action loop if their conditions are met. They don't compete.
- **EvaluatedGoals** evaluate their weight per tick; the faction picks the highest-weight option to actually run.

This lets vanilla express both "Argon must defend its space at all times" (Hold = PriorityGoal) and "Argon picks ONE strategic operation per tick" (Invade vs Plunder vs Patrol = EvaluatedGoals).

## Goal contract

Every goal — priority or evaluated — exposes the same contract:

| Cue / phase | Purpose |
|---|---|
| `Start` | Initial setup when goal first becomes active |
| `Init` | Per-cycle initialization |
| `Evaluate` | Returns a `EvaluationResult` indicating fitness |
| `Cleanup` | Cleanup when goal ends |
| `Update_Sub_Goal` | Propagate state to active subgoals |

**`EvaluationResult` enum values** (used by `Evaluate`):

- `success` — goal achieved
- `failure` — goal can no longer proceed
- `cancel` — caller-initiated stop
- `inprogress` — still working
- `partial` — partial success, continue
- `priority` — promote to high-priority status

Each goal's `Evaluate` returns one of these, and the parent (PriorityGoals or EvaluatedGoals dispatcher) decides next action based on the result.

## The 4 vanilla goals

### Hold_Space (PriorityGoal)

`factiongoal_hold_space.xml` — defends faction territory. Runs always for any active faction. Triggers subgoals (DefendArea, PrepareStagingArea) to respond to threats.

### Invade_Space (EvaluatedGoal)

`factiongoal_invade_space.xml` — picks an enemy sector to invade, sets up staging, executes the invasion. Highly involved: 4-phase state machine (prepare → beachhead → retreat → handoff), uses Recon subgoal to scout.

### Plunder (EvaluatedGoal)

`factiongoal_plunder.xml` — sends raiders to disrupt enemy trade. Has its own broker pattern: NPC factions outsource plunder targets to specific ship missions. 375 lines.

### Patrol (PatrolCoordinationService)

`factiongoal_patrolcoordinationservice.xml` — galaxy-wide combat coordination. Maintains a master list of distress calls, evaluates response weights, dispatches patrol ships.

## The 4 vanilla subgoals

Subgoals are reusable building blocks that any goal can invoke:

| Subgoal | Purpose |
|---|---|
| `BuildStation` (`factionsubgoal_buildstation.xml`) | Build a station as part of a larger plan |
| `Recon` (`factionsubgoal_recon.xml`) | Scout a sector for intel |
| `DefendArea` (`factionsubgoal_defendarea.xml`) | Defend a specific area |
| `PrepareStagingArea` (`factionsubgoal_preparestagingarea.xml`) | Pre-position assets for upcoming operations |

Subgoals follow the same contract as goals (Start / Init / Evaluate / Cleanup / Update_Sub_Goal). The composability is the point — Invade_Space uses Recon + PrepareStagingArea; Hold_Space uses DefendArea. Same subgoal, different parents.

## Registry pattern

Each faction has a `FactionGoals` registry containing all active goals + subgoals:

```
FactionGoals (per-faction global table)
├── [active goal] Hold_Space (PriorityGoal)
│   └── DefendArea subgoal for Argon Prime
├── [active goal] Invade_Space (EvaluatedGoal)
│   ├── Recon subgoal scouting Boron territory
│   └── PrepareStagingArea subgoal in adjacent cluster
└── ...
```

The registry is the source of truth for "what's this faction doing right now". Modders extending faction behaviour add to this registry.

## Why this matters for modders

### Adding a custom goal

A custom goal (priority OR evaluated) needs:

1. New `factiongoal_X.xml` file mirroring vanilla structure
2. Registration in the FactionGoals registry on faction init
3. Implementation of the 5-cue contract (Start / Init / Evaluate / Cleanup / Update_Sub_Goal)
4. Tested EvaluationResult values

### Reusing subgoals

The 4 vanilla subgoals are well-tested. A custom goal that needs "build a station" should call `BuildStation` rather than inlining the logic. Subgoals were designed for reuse.

### Don't touch subgoals

`x4_md_subgoal_recon_stable` — Vanilla subgoals are battle-tested. DA mods (and other major mods) deliberately don't modify subgoals because they're a "stable foundation for custom faction AI". Build on them, don't fork them.

### Performance

Each goal's `Evaluate` runs per faction per tick. With ~12 active factions × 4 evaluated goals = 48 evaluations per tick. Heavy evaluation logic (galaxy-wide scans) adds up. Vanilla goals cache aggressively.

### Cross-cluster operations

Invade_Space and Hold_Space frequently use `$LocalClusters` + `$AdjacentClusters` patterns to operate across cluster boundaries. Custom goals targeting cross-cluster strategy should mirror this — see `factiongoal_hold_space.xml:136-152`.

## Cross-references

- [Faction economy](/overviews/faction-economy/) — the layer BELOW goals (day-to-day stations)
- [Faction (game)](/game/factions/faction/) — owner of goals
- [Sector (game)](/game/world/sector/) — goals operate on sectors
- [Cluster (game)](/game/world/cluster/) — cross-cluster operations use `$LocalClusters` / `$AdjacentClusters` patterns

## Related architectural overviews

- [Faction economy](/overviews/faction-economy/) — child system
- *Patrol coordination* — overlapping with Patrol goal
- *Mission framework* — goals can spawn missions via the framework

---

:::tip[Pattern — registry-based two-tier strategic AI]
Faction goals are **X4's strategic AI layer** — the registry pattern + two-tier evaluation + composable subgoals = a clean architecture for multi-faction strategy. Modders extending this should follow the same shape: register new goals in FactionGoals, implement the 5-cue contract, and reuse subgoals where possible. Vanilla's 8 goal/subgoal files are a small but well-designed kit.
:::

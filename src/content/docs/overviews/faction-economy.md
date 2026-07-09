---
title: Faction economy
description: How NPC factions decide what to produce, build, or buy. Per-faction Econ_Manager reads shortage data, evaluates per-sector, picks one of several corrective actions.
---

How do NPC factions grow their economies during gameplay? Argon doesn't just stand still — they expand when shortages appear, build new factories, and request more freighters. This is driven by **factionlogic_economy.xml** — ~4100 lines of MD running per-faction tick logic.

This overview explains the **shortage → evaluation → corrective action** loop that makes NPC economies dynamic.

## The loop

```
┌──────────────────────────────────────────┐
│  Per-faction tick (every N minutes)      │
│  → EvaluateShortages                     │
└────────────────┬─────────────────────────┘
                 ↓
┌──────────────────────────────────────────┐
│  EvaluateShortages                       │
│  - Iterate faction sectors               │
│  - Read demand vs supply per ware        │
│  - Compute shortage scores               │
└────────────────┬─────────────────────────┘
                 ↓
┌──────────────────────────────────────────┐
│  Per-sector evaluation                   │
│  → EvaluateSectorShortage                │
│  - Which wares are short?                │
│  - Which station type can fix?           │
└────────────────┬─────────────────────────┘
                 ↓
┌──────────────────────────────────────────┐
│  Pick corrective action                  │
│  (one of N Request_X cues)               │
└────────────────┬─────────────────────────┘
                 ↓
┌──────────────────────────────────────────┐
│  Request_X runs                          │
│  - Find suitable site                    │
│  - Issue build / spawn / etc.            │
│  - Wait for outcome                      │
└────────────────┬─────────────────────────┘
                 ↓
┌──────────────────────────────────────────┐
│  Outcome handler                         │
│  - Built / disregarded / destroyed       │
│  - Update faction state                  │
└──────────────────────────────────────────┘
```

## EvaluateShortages — the trigger

The top-level cue `EvaluateShortages` runs per-faction on a heartbeat. It walks the faction's sectors, reading ware demand and supply data, and identifies sectors where supply lags demand.

For each affected sector, it dispatches to `EvaluateSectorShortage` which determines:
- Which wares are short
- Which station-type (production factory, shipyard, defence station) can address the shortage
- Whether the faction has resources / budget to act

## Corrective actions (the Request_X cues)

When a shortage is identified, vanilla picks one of several **Request_X** actions:

| Action cue | What it does |
|---|---|
| `Request_Production_Module` | Add a production module to an existing factory |
| `Request_Freighter` | Spawn a new transport ship to cover supply |
| `Request_Commandeerable_Freighter` | Spawn a freighter that the player can capture (balance lever) |
| (and others) | New station construction, defence reinforcement, etc. |

Each `Request_X` is a substantial sub-cue with `_Disregarded`, `_Destroyed`, `_Started`, `_Built`, `_Spawned`, `_Not_Requested` sub-handlers. The state machine tracks:
- Disregard (faction decided not to act after all)
- Destruction (the requested asset was destroyed before completion)
- Successful build / spawn

The verbose `_Disregarded` handling reflects that NPC economy decisions are tentative — many factors can cancel a planned build (faction goes hostile, budget changes, sector ownership flips).

## Per-sector heuristics

`EvaluateSectorShortage` reads several signals:

| Signal | Source | Indicates |
|---|---|---|
| `Container.cargo.{ware}.target - .amount` | Per-station target deficit | How much is missing |
| `iswaitingforresources` on production modules | Build module state | Supply chain stalled |
| `iswaitingforstorage` on production modules | Build module state | Output backed up |
| `Sector.yieldrating.{ware}` | Sector data | Mining capacity |

The heuristic isn't pure shortage — it combines stalled state, deficit, and *capability* (does the sector have resources for the missing ware).

## Why this matters for modders

### Don't break this loop

Custom mods that touch production modules (paused state, custom cargo) can confuse the shortage evaluator. Vanilla's `EvaluateSectorShortage` reads `iswaitingforresources` and `iswaitingforstorage` directly — pause your custom modules with `<set_production_paused>` rather than alternative mechanisms.

### Faction expansion adds to constructionplans

When `Request_Production_Module` decides to build, it ultimately calls into the [Construction sequence](/overviews/construction-sequence/) pipeline. Custom plans in [constructionplans.xml](/lang/data/constructionplans-xml/) are eligible — your mod's plans are real options for NPC factions.

### NPC factions ignore non-vanilla wares by default

If your mod adds new wares, NPC factions don't know to demand them. To integrate:
1. Add wares to faction-relevant production chains
2. Update `factionlogic` data so faction recognises ware demand
3. Or accept that only player stations produce/consume new wares

### Performance impact

`EvaluateShortages` runs per-faction per-tick across all sectors. Mods that add many factions or many sectors can multiply this cost. The vanilla tick interval is tuned for ~10 factions; adding more without adjusting the interval impacts CPU.

## Vanilla file structure

`factionlogic_economy.xml` (4103 lines) organises like:

```
factionlogic_economy.xml
├── Manage_Stations (top-level state machine)
│   ├── EvaluateShortages (heartbeat)
│   │   └── EvaluateSectorShortage (per-sector)
│   ├── Request_Production_Module
│   │   ├── Request_Production_Module_Generate_Sequence
│   │   ├── Request_Production_Module_Sequence_Generated
│   │   ├── Request_Production_Module_Disregarded
│   │   ├── Request_Production_Module_Started
│   │   └── Request_Production_Module_Evaluate_Build
│   ├── Request_Freighter
│   │   ├── Request_Freighter_Spawned
│   │   ├── Request_Freighter_Disregarded
│   │   ├── Request_Freighter_Destroyed
│   │   ├── Request_Freighter_Built
│   │   └── Request_Freighter_Not_Requested
│   └── Request_Commandeerable_Freighter (similar)
└── (additional cues for support / cleanup)
```

The Disregard / Destroyed / Built handler pattern is consistent across all `Request_X` actions. Custom mods extending this should follow the same shape.

## Cross-references

- [Production module](/game/objects/production-module/) — what the loop manages
- [Storage module](/game/objects/storage-module/) — `iswaitingforstorage` signal source
- [Production factory](/game/objects/production-factory/) — the station type
- [Build module](/game/objects/build-module/) — what builds new modules
- [Faction](/game/factions/faction/) — owner of the economy
- [Sector](/game/world/sector/) — `yieldrating` data source
- [constructionplans.xml](/lang/data/constructionplans-xml/) — modder-extensible build catalogue

## Related architectural overviews

- [Galaxy seeding](/overviews/galaxy-seeding/) — initial state before this loop runs
- [Construction sequence](/overviews/construction-sequence/) — what `Request_Production_Module` calls into
- *Faction goals* — the layer ABOVE economy (which decides hold / invade / patrol)
- *Trade routing* — separate but related ware-distribution system

---

:::tip[Pattern — per-faction tick with state-machine corrective actions]
Faction economy is **MD's largest state machine** (~4100 lines). The recurring shape: evaluate shortage → pick request → wait for outcome → handle disregard/destroyed/built. Modders extending faction behaviour should mimic this shape rather than inventing new patterns — vanilla's UX expectations are baked into the `_Disregarded` flow.
:::

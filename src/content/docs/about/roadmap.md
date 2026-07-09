---
title: Coverage roadmap
description: All game abstractions a modder may need to interact with, with current site coverage and priority tier.
---

This page is the **coverage roadmap** for the Game API. It lists every game-side abstraction discovered by scanning vanilla `libraries/scriptproperties.xml` (~140 datatypes) and vanilla MD/aiscript usage of `class.*` enum values (~80 distinct classes), with current site coverage status.

**Current status: ~95% Game API coverage**, plus complete [Modding language](/lang/), [Architectural overviews](/overviews/), and [Wiki](/wiki/) sections.

## Status legend

| Symbol | Meaning |
|---|---|
| ✅ | Page fully written, sample-grep verified |
| 🟡 | Placeholder index/page exists, content not yet filled |
| ⬜ | Not yet present on site |
| ⏭ | Out of scope — not a useful page for modders (abstract base types, pure script primitives) |

## Tier legend

| Tier | Meaning |
|---|---|
| **T1** | Must-have. Touched by most modders, every project asks about it. |
| **T2** | Common. Many modders will look it up at some point. |
| **T3** | Rare. Edge-case work or specific subsystems. |

---

## 🌌 World — spatial hierarchy (8)

| Abstraction | Tier | Status | Notes |
|---|---|---|---|
| galaxy | T2 | ✅ | Filled. Root container with .representatives |
| cluster | T1 | ✅ | Filled |
| **sector** | T1 | ✅ | Filled |
| zone | T2 | ✅ | Filled. Sub-sector unit with adjacency graph |
| highway | T2 | ✅ | Filled. Local + super highway |
| gate | T1 | ✅ | Filled. Plus jumpbeacon, highwayentrygate, highwayexitgate |
| region | T2 | ✅ | Filled. Empty datatype, parent-side position-tests |
| space | T3 | ⏭ | Abstract base — skip |

## 🚀 Controllable objects (4 base + ~16 subtypes)

### Stations and subtypes (T1 → all)

| Abstraction | Tier | Status | Notes |
|---|---|---|---|
| **station** | T1 | ✅ | Filled |
| ↳ shipyard | T1 | ✅ | Filled. Builds XL/L ships |
| ↳ wharf | T1 | ✅ | Filled. Builds S/M ships |
| ↳ equipmentdock | T1 | ✅ | Filled. Installs equipment (no ship build) |
| ↳ tradestation | T1 | ✅ | Filled. Cross-faction marketplace |
| ↳ defencestation | T2 | ✅ | Filled. Fortress |
| ↳ productionfactory | T1 | ✅ | Filled. Defined by exclusion of other Station subtypes |
| ↳ piratebase | T2 | ✅ | Filled. Scavenger/Riptide bases |
| ↳ headquarters | T1 | ✅ | Filled. Player HQ + Faction HQ (two distinct flags) |
| buildstorage | T3 | ✅ | Filled. Purpose-specific container |

### Ships and size classes (T1 → all)

| Abstraction | Tier | Status | Notes |
|---|---|---|---|
| **ship** | T1 | ✅ | Filled |
| ↳ ship_xs / s / m / l / xl | T1-T2 | ✅ | Combined in [Ship size classes](/game/objects/ship-size-classes/) |
| spacesuit | T2 | ✅ | Filled. Player EVA, 4 oxygen properties |
| lasertower | T2 | ✅ | Filled. Dual identity (deployable + class.ship) |

**Purposes** (cross-cutting): purpose.fight, .trade, .mine, .build, .rig, .salvage, .auxiliary. May get a single "Ship purposes" page rather than 7 separate pages.

## 📡 Deployables & free-space objects (12)

| Abstraction | Tier | Status | Notes |
|---|---|---|---|
| satellite | T1 | ✅ | Filled. Basic + advanced |
| navbeacon | T2 | ✅ | Filled. Map markers (jumpbeacon is separate — under Gate) |
| resourceprobe | T2 | ✅ | Filled. Scans 32 km cube |
| mine | T2 | ✅ | Filled. Deployable explosives (F&F + indiscriminative) |
| lockbox | T2 | ✅ | Filled. World-spawned loot with shootable locks |
| crate | T3 | ✅ | Filled. Interior crate-slot loot (NOT floating cargo!) |
| datavault | T2 | ✅ | Filled. 3-state lock with 'datavault_unlocked' signal |
| checkpoint | T3 | ✅ | Filled. Engine-exposed but no active vanilla use — mod hook |
| anomaly | T3 | ✅ | Filled. Story wormholes with directed-graph transition API |
| missile | T2 | ✅ | Filled. In-flight munition + explosive base |
| bomb | T3 | ✅ | Filled. Engine class without datatype — mod hook |
| countermeasure | T3 | ✅ | Filled. Engine-driven via countermeasureresistance |

**Note:** lasertower lives under `class.ship` (autonomous controllable), but appears in the deployables menu. Cross-link from here and from Ship subtypes.

## 🌍 Natural / environmental (4)

| Abstraction | Tier | Status | Notes |
|---|---|---|---|
| asteroid | T2 | ✅ | Filled. Incl. miningnode/crystal/recyclable class siblings |
| celestialbody | T3 | ✅ | Filled. Visual-only class label |
| adsign | T3 | ✅ | Filled. Destroyable billboard, pure flavour |
| signalleak | T2 | ✅ | Filled. data/voice/mission leak types |

## 🔧 Object parts (16)

| Abstraction | Tier | Status | Notes |
|---|---|---|---|
| **module** | T1 | 🟡 | Generic; placeholder exists |
| ↳ buildmodule | T2 | ✅ | Filled. 50+ accessors, buildprocessor children |
| ↳ connectionmodule | T2 | ✅ | Filled. Structural |
| ↳ defencemodule | T2 | ✅ | Filled. Class label without datatype |
| ↳ habitationmodule | T2 | ✅ | Filled. Workforce capacity per-race |
| ↳ welfaremodule | T3 | ✅ | Filled. Workforce-bonus contributor |
| ↳ pier | T2 | ✅ | Filled. Capital-ship dock slots |
| ↳ production | T1 | ✅ | Filled. Makes wares (most modded) |
| ↳ processingmodule | T2 | ✅ | Filled. Recycles physical scrap (not cargo wares) |
| ↳ storagemodule | T1 | ✅ | Filled. Cargo capacity |
| ↳ ventureplatform | T3 | ✅ | Filled. Ventures DLC-gated platform |
| weapon | T2 | ✅ | Filled. Parent of turret/missileturret/missilelauncher |
| engine | T3 | ✅ | Filled. Boost + travel mode state |
| scanner / radar | T3 | ✅ | Filled. Empty datatype, Controllable aggregates |
| shieldgenerator | T3 | ✅ | Filled. Empty datatype, parent-side aggregate |
| room | T2 | ✅ | Filled. Includes dockingbay/walkablemodule/dockarea sub-coverage |
| controlpanel | T3 | ✅ | Filled. 5 hack types + iscontrolpanelhacked state |
| navcontext | T3 | ✅ | Filled. Runtime-spawned dynamic interiors |

## ⛏ Collectibles / drops (5)

| Abstraction | Tier | Status | Notes |
|---|---|---|---|
| drop | T3 | ✅ | Filled. Abstract parent |
| collectable | T3 | ✅ | Filled. Practical filter pivot |
| collectableammo | T2 | ✅ | Filled. ammo.count + ammo.macro |
| collectablewares | T2 | ✅ | Filled. Money + isdroppedcontainer attribution |
| collectableblueprints | T2 | ✅ | Filled. Physical UX marker for blueprints |
| collectabledata | T2 | ✅ | Filled. Timeline/audiologs sibling to datavault |

## 👤 Characters & entities (4)

| Abstraction | Tier | Status | Notes |
|---|---|---|---|
| **npc** | T1 | ✅ | Filled |
| nonplayer | T3 | ⏭ | Abstract base — skip |
| entity | T3 | ⏭ | Abstract base — skip |
| player | T2 | ✅ | Filled. Root accessor keyword with ~90 props |

## 🏴 Faction & data layer (12)

| Abstraction | Tier | Status | Notes |
|---|---|---|---|
| **faction** | T1 | ✅ | Filled |
| race | T2 | ✅ | Filled. 8 races, workforce.resources |
| **ware** | T1 | ✅ | Filled |
| controlpost | T3 | ✅ | Filled. Skill-relevance template |
| assignment | T3 | ✅ | Filled. Label without behaviour |
| purpose | T2 | ✅ | Filled. Orthogonal-to-size categorisation |
| entitytype | T3 | ✅ | Filled. Archetype layer |
| entityrole | T3 | ✅ | Filled. Role with tier-based skill system |
| missiongroup | T3 | ✅ | Filled. Thematic mission bucket |
| notification | T2 | ✅ | Filled. Player preference toggle |
| unlock | T2 | ✅ | Filled. Conditional discovery with category flags |
| licence | T2 | ✅ | Filled. Faction-pair permission data |
| group | T3 | ✅ | Filled. Runtime component collection |

## 🎯 Behavior / operations (8)

| Abstraction | Tier | Status | Notes |
|---|---|---|---|
| **order** | T1 | ✅ | Filled. Concept here; XML-definition schema lives in Aiscript |
| trade | T2 | ✅ | Filled. ~50 props, transient business entity |
| build | T2 | ✅ | Filled. Task entity with type flags |
| operation | T3 | ⏭ | Abstract base — skip |
| boardingoperation | T1 | ✅ | Filled. 4-phase board lifecycle (pre/approach/infiltration/internalfight) |
| diplomacyactionoperation | T2 | ✅ | Filled (combined with event operation page) |
| diplomacyeventoperation | T2 | ✅ | Filled (combined with action operation page) |
| constructionsequence | T2 | ✅ | Filled. Module list with staged-construction system |
| fleetunit | T2 | ✅ | Filled. Slot-with-rebuild placeholder |
| loadout | T2 | ✅ | Filled. Thin pointer-into-static-data |

---

## Summary

| Category | Total | ✅ | 🟡 | ⬜ | ⏭ |
|---|---|---|---|---|---|
| World | 8 | 7 | 0 | 0 | 1 |
| Stations + ship | 21 | 17 | 0 | 4 | 0 |
| Deployables | 12 | 12 | 0 | 0 | 0 |
| Natural | 4 | 4 | 0 | 0 | 0 |
| Object parts | 18 | 17 | 1 | 0 | 0 |
| Collectibles | 6 | 6 | 0 | 0 | 0 |
| Characters | 4 | 2 | 0 | 0 | 2 |
| Faction & data | 13 | 13 | 0 | 0 | 0 |
| Behavior | 10 | 8 | 0 | 0 | 2 |
| **Total** | **96** | **86** | **1** | **4** | **5** |

**Current coverage:** 86 / 91 in-scope abstractions = **~95%**.

### Other site sections

| Section | Status |
|---|---|
| [Modding language](/lang/) — MD Framework | ✅ 7/7 complete |
| [Modding language](/lang/) — Aiscript | ✅ 3/3 complete |
| [Modding language](/lang/) — UI / Lua | ✅ 4/4 complete |
| [Modding language](/lang/) — Data schemas | ✅ 5/5 complete |
| [Architectural overviews](/overviews/) | ✅ 12/12 complete |
| [Wiki](/wiki/) — standalone entries | 3 published, more topics possible |

## Rollout plan (T1 first)

Tier-1 in-scope abstractions, ordered by likely modder demand:

1. faction (relations, money — touched by virtually every mod)
2. ship (the largest single-page write — many properties, libraries, events)
3. ware (cargo, trade, production)
4. order (behavior baseline)
5. npc (crew, missionactors)
6. shipyard (parented by Station, smaller)
7. wharf, equipmentdock, tradestation (Station subtypes)
8. cluster (sector parent)
9. gate
10. ship_s / ship_m / ship_l / ship_xl / ship_xs (or one combined size-class page)
11. headquarters
12. productionfactory
13. storagemodule, production (module subtypes most modders touch)
14. boardingoperation

After T1 is done (~14 pages), assess: do we have enough coverage to be useful? If yes — publish. If no — T2 next.

## Modding language side (parallel inventory — to be added)

This page lists Game API abstractions only. A parallel inventory for [Modding language reference](/lang/) — Cue, Library, Action, Order definition, Helper API, FFI, data schemas — will be built when we test schema on a language primitive (Cue is the planned first test case).

---

:::tip[Source]
This inventory was extracted by scanning vanilla X4 9.0 `libraries/scriptproperties.xml` (datatype declarations) + grepping vanilla `md/` and `aiscripts/` for `class.X` enum usage. See [About this prototype](/about/) for the verification protocol applied to each page.
:::

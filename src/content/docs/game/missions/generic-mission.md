---
title: Generic missions
description: "Templated BBS-style missions in gm_*.xml + gmc_*.xml + rml_*.xml. The bread-and-butter mission system: 37 templates, 6 catalogues, 67 reusable libraries."
---

A **Generic mission** is a TEMPLATE — `gm_bringitems` knows how to do "deliver wares to a station", and is instantiated many times with different parameters (which wares, which station, which faction, reward amount). This is the bread-and-butter X4 mission system: the missions players find at BBS terminals, signal leaks, and faction representatives.

Vanilla has:
- **37 `gm_*.xml`** templates
- **6 `gmc_*.xml`** catalogues
- **67 `rml_*.xml`** reusable phase libraries

For the layered architecture overview see [Architectural overview: Mission framework](/overviews/mission-framework/). This page focuses on **how to use the layers** as a modder.

## Layer 1: gm_* — the templates

Each `gm_*` file implements one mission kind. The 37 vanilla templates:

| Template | What it does |
|---|---|
| `gm_achievecoverage` | Achieve satellite coverage in a region |
| `gm_ambush` | Ambush a passing convoy |
| `gm_assassinate` | Kill a specific NPC |
| `gm_barterwares` | Trade wares between two stations |
| `gm_board_ship` | Capture a ship via boarding |
| `gm_bringitems` | Deliver wares (most common BBS) |
| `gm_buildstation` | Build a station |
| `gm_claimplot` | Claim a sector plot |
| `gm_deployinplace` | Deploy satellites/probes/mines |
| `gm_destroy_matching_objects` | Destroy objects matching criteria |
| `gm_destroy_objects` | Destroy specific objects |
| `gm_destroy_rarelyonsight` | Destroy a rare-spawn |
| `gm_escort` | Escort an NPC ship |
| `gm_find_object` | Find a specific object |
| `gm_find_resources` | Locate an asteroid field |
| `gm_getexactcrew` | Recruit specific crew |
| `gm_getexactfleet` | Acquire ships matching criteria |
| `gm_hackpanel` | Hack a station data panel |
| `gm_joinsubscription` | Join a faction subscription |
| `gm_killmasstraffic` | Destroy mass-traffic ships |
| `gm_largesupply` | Large-scale supply runs |
| `gm_patrol` | Patrol a region |
| `gm_prisonbreak` | Rescue a captured NPC |
| `gm_repairobject` | Repair a damaged object |
| `gm_repairsignalleaks` | Repair signal leaks |
| `gm_reputation` | Gain reputation via task |
| `gm_rescue_ship`, `gm_rescue_ship_2` | Rescue a stranded ship |
| `gm_retrieveitem` | Retrieve an item from a crate |
| `gm_sabotage` | Sabotage station defences |
| `gm_scan` | Scan an object / region |
| `gm_supplyfactory` | Supply wares to a factory |
| `gm_support_invasion` | Support military invasion |
| `gm_trackship` | Track a ship's movement |
| `gm_transport_passengers` | Transport NPCs to a destination |
| `gm_unlockshadyguy` | Unlock a black-market contact |

## Anatomy of a gm_* file

Vanilla templates share a structure. `gm_bringitems.xml` (2056 lines) is canonical:

```
<library name="LIB_<Mission>_*"/>      <!-- helper libraries (LookupGreedyCost, etc.) -->

<cue name="TextOffsets">                 <!-- text-table offset constants -->
<cue name="FeedbackValueManager">        <!-- mission-impact tracker for AI factions -->

<cue name="Start" namespace="this">
    <cue name="Do_Not_Start_Mission"/>   <!-- early-bail conditions -->
    <cue name="Do_Start_Mission">
        <cue name="With_Offer">          <!-- offer flow (BBS / signal leak / NPC) -->
            <cue name="CreateOffer"/>    <!-- the actual create_mission call -->
            <cue name="Offer_Management" ref="md.GenericMissions.OfferMission"/>
            <cue name="Offer_End"/>      <!-- offer expiry -->
        </cue>
        <cue name="Without_Offer">       <!-- auto-spawn variant (e.g. lockbox loot pickup) -->
            <cue name="..."/>            <!-- timer-based or trigger-based start -->
        </cue>
    </cue>
</cue>
```

Two main flavors:

| Flavor | When to use |
|---|---|
| **With_Offer** | Standard BBS mission — player sees offer, can accept/decline |
| **Without_Offer** | Triggered by world event (player picks up lockbox → mission auto-starts) |

## Layer 2: gmc_* — the catalogues

The 6 catalogues PICK which `gm_*` to instantiate when an offer source becomes available:

| Catalogue | Picks from | Offer source |
|---|---|---|
| `gmc_assisted_task` | Various gm_* | NPC representative |
| `gmc_dynamic` | Various gm_* | Signal leak (random encounter) |
| `gmc_improve_station_defences` | gm_destroy_*, gm_patrol | Station faction representative |
| `gmc_madscientist` | gm_find_*, gm_destroy_* | Mad scientist NPC (story content) |
| `gmc_retrieve_dead_drop` | gm_retrieveitem | Black market contact |
| `gmc_supervised_mining` | gm_find_resources | Mining guild rep |

A catalogue's job: select a template, compute parameters (which faction, what wares, which sector), pass to the template's offer cue.

## Layer 0: rml_* — reusable phases

The 67 `rml_*` libraries provide sub-objectives. A mission `gm_X` references `rml_X` (and others) via library calls:

```xml
<run_actions ref="md.RML_Deliver_Wares.Setup">
    <param name="Mission" value="$MissionCue"/>
    <param name="Wares" value="$RequestedWares"/>
    <param name="Destination" value="$Station"/>
</run_actions>
```

| Common rml_* | Used by |
|---|---|
| `rml_find_object` | gm_assassinate, gm_board_ship, gm_destroy_objects, gm_find_object, gm_retrieveitem |
| `rml_buildstation` | gm_buildstation, gm_supplyfactory |
| `rml_collect_crates` | gm_retrieveitem, gm_rescueship_2 |
| `rml_deploy_in_sectors` | gm_deployinplace, gm_achievecoverage |
| `rml_destroy_components` | gm_destroy_*, gm_sabotage |
| `rml_escort` | gm_escort, gm_largesupply |
| `rml_trade_wares` | gm_barterwares, gm_largesupply |

For your custom mission template: identify which `rml_*` covers each sub-objective and reference it via `<run_actions ref=>`. Don't reimplement.

## The orchestrator: genericmissions.xml

`md/genericmissions.xml` (1930 lines, 81 cues) is the **dispatch hub**. Key public cues:

| Cue | Purpose |
|---|---|
| `md.GenericMissions.OfferMission` | Reference cue used by all `gm_*` for offer management |
| `md.GenericMissions.SetupMissionAfterAccept` | Standard post-accept setup |
| `md.GenericMissions.CleanupMission` | Standard cleanup (markers, anchored objects) |
| `md.GenericMissions.AbortMission` | Player-initiated abort path |

Custom missions should reference these for vanilla-style lifecycle integration.

## Mission offer locations

Offer sources are objects that have `.offerlocations`:

| Source type | Used by |
|---|---|
| **BBS terminal** (control panel) | NPC representative offer |
| **Signal leak** | Dynamic encounters (`gmc_dynamic`) |
| **NPC actor** | Assisted task (`gmc_assisted_task`) |
| **Station (direct)** | Faction-direct offers |

Each catalogue picks an offer-source pattern matching its theme.

## Reward distribution

All generic missions route rewards through:

```xml
<run_actions ref="md.LIB_Reward_Balancing.GetReward">
    <param name="Mission" value="$MissionCue"/>
    <param name="ResultStorage" value="$RewardSnapshot"/>
</run_actions>
```

See [Architectural overview: Reward calculation](/overviews/reward-calculation/) for the full reward math.

## Common gotchas

- ⚠ **`Without_Offer` missions auto-spawn but still need cleanup** — `<event_mission_aborted>` cleanup is mandatory
- ⚠ **`rml_*` libraries write into the mission cue's `$X` namespace** — clashes with your local variables if both pick the same name
- ⚠ **`gmc_*` catalogues choose templates probabilistically** — your custom mission won't appear unless added to a catalogue or offered directly
- ⚠ **Adding a new mission group requires `missiongroups.xml` diff** — without it, mission group filter on HUD won't show your mission
- ⚠ **Multi-language text** — text constants in `t/0001-L044.xml` (English); missing translations show `readtext{page,id}` literals
- ⚠ **DLC-only templates** — `gm_joinsubscription` is Pirate DLC; guards needed (see [DLC handling](/wiki/dlc-handling/))

## Adding a new generic mission

1. Pick template-or-catalogue:
   - Want a new mission KIND? → Write `gm_my_mission.xml` (model on closest vanilla)
   - Want existing kind in new context? → Diff a `gmc_*` catalogue
2. Reuse `rml_*` for sub-objectives
3. Reference `md.GenericMissions.OfferMission` for offer lifecycle
4. Reference `md.LIB_Reward_Balancing.GetReward` for reward
5. Register a mission group (or reuse existing)
6. Add text constants to your mod's `t/<lang>.xml`

## Code references (vanilla)

| Concern | File |
|---|---|
| Canonical With_Offer/Without_Offer split | `gm_bringitems.xml` |
| Catalogue picker logic | `gmc_dynamic.xml` (random) / `gmc_assisted_task.xml` (themed) |
| Reusable phase | `rml_find_object.xml`, `rml_collect_crates.xml` |
| Orchestrator hub | `genericmissions.xml:1-200` (setup) + `OfferMission` cue |
| Reward math | `lib_reward_balancing.xml` |

## Related

- [Architectural overview: Mission framework](/overviews/mission-framework/) — three-tier composition
- [Architectural overview: Reward calculation](/overviews/reward-calculation/) — `LIB_Reward_Balancing`
- [Mission events](/game/missions/mission-events/) — events vanilla `gm_*` use
- [Story missions](/game/missions/story-mission/) — bespoke counterpart
- [Subscription missions](/game/missions/subscription-mission/) — DLC faction subscriptions
- [Signal leak](/game/objects/signal-leak/) — primary `gmc_dynamic` offer source
- [Mission group](/game/factions/missiongroup/) — HUD categorisation

---

*The three-tier layering pays off when you write a custom mission: an hour of reading vanilla `rml_*` saves a week of reimplementing find-object / collect-crates / deliver-wares logic.*

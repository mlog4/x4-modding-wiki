---
title: Missions
description: All player-facing missions in X4 — story arcs, generic BBS missions, faction subscriptions, the main plot, and tutorials. Six categories, separate code paths, shared event API.
---

A **mission** in X4 is anything the player accepts that produces an objective marker, tracks progress, and pays out at completion. Vanilla has **six distinct categories** of mission, each with its own code path. They share a common event API (`event_mission_aborted`, `create_mission` action, `.hasmission` accessor) but the rest of their lifecycle differs.

## The six categories

| Category | Code lives in | Examples | Page |
|---|---|---|---|
| **Story** | `story_*.xml` | Paranid story, Buccaneers (Pirate), Welfare research | [Story missions](/game/missions/story-mission/) |
| **Generic** (BBS-style) | `gm_*.xml` + `gmc_*.xml` + `rml_*.xml` | Find object, board ship, deliver wares, escort | [Generic missions](/game/missions/generic-mission/) |
| **Faction subscription** | `x4ep1_*_subscriptions.xml` | War subs, Trade subs, Pirate subs, Mentor subs | [Subscription missions](/game/missions/subscription-mission/) |
| **Plot** | `plot.xml` | Claim plot of space (sector ownership) | [Plot missions](/game/missions/plot-mission/) |
| **Tutorial** | `tutorial_*.xml` | Flight basics, mining, stations | [Tutorial missions](/game/missions/tutorial-mission/) |
| **Reusable phases** | `rml_*.xml` | Building blocks reused by gm_/story_/subscription | See [Generic missions](/game/missions/generic-mission/#layer-0-rml_) |

For the layered architecture of how `gm_*`/`gmc_*`/`rml_*` compose, see [Architectural overview: Mission framework](/overviews/mission-framework/).

## The shared lifecycle

Whatever the category, a mission follows the same 5-step flow:

```
Offer creation     → create_mission (action) — sets up the offer
   ↓
Player discovers   → event_player_discovered_mission_offer
   ↓
Player accepts     → event_briefing_started + accept (LIB c_mission_accept)
   ↓
Progress tracking  → custom per-mission cues, sub-objectives
   ↓
Resolution         → completion (reward) / event_mission_aborted (cleanup)
```

Each category implements the middle three steps differently, but `create_mission` and `event_mission_aborted` are universal — see [Mission events](/game/missions/mission-events/) for the full event catalog.

## Decision matrix — which category for your mod?

| You want to add… | Use category |
|---|---|
| Hand-authored narrative for a faction | Story |
| Repeatable BBS-style player-pick missions | Generic |
| Faction-loyalty repeating offers | Subscription |
| Sector-ownership / claim-territory | Plot |
| Player onboarding for a feature | Tutorial |
| Sub-objective reused across mission types | Reusable phases (rml_) |

## Key common gotchas

- ⚠ `create_mission` requires an offer source (`.offerlocations` host) — not all objects can offer
- ⚠ `event_mission_aborted` fires for BOTH player-cancelled AND system-cancelled — distinguish via `event.param`
- ⚠ Mission rewards must route through `LIB_Reward_Balancing` for economy-consistent payouts
- ⚠ Map markers / `NewTarget` Guidance need explicit cleanup on abort — they don't auto-remove

## Cross-references

- [Architectural overview: Mission framework](/overviews/mission-framework/) — the layered composition
- [Architectural overview: Reward calculation](/overviews/reward-calculation/) — `LIB_Reward_Balancing`
- [Cue](/lang/md-framework/cue/) — `.hasmission` / `.missioncue` accessors
- [Mission group](/game/factions/missiongroup/) — categorisation taxonomy
- [Mission events](/game/missions/mission-events/) — full event + action catalog

---

*Pick the right category before you start writing. Adding a faction subscription mission as a `gm_*` template won't give you the loyalty-tier UI the player expects from subscriptions.*

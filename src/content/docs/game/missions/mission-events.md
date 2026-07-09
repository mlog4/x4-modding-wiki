---
title: Mission events & API
description: Full catalog of mission events, actions, and accessor properties. Shared by all mission categories. With vanilla code references for each.
---

This page is the **catalog of mission-related events, actions, and accessors** that every mission category uses. Cross-references to vanilla source for each entry.

## Events (cue conditions)

Events fire from the engine and trigger cue activation when present in `<conditions>`.

### `event_player_discovered_mission_offer`

Fires when the player first becomes aware of a mission offer (BBS terminal opened, signal leak scanned, NPC approached).

```xml
<conditions>
    <event_player_discovered_mission_offer/>
</conditions>
<actions>
    <!-- event.param = the mission cue offering -->
    <set_value name="$discovered_offer" exact="event.param"/>
</actions>
```

**Used by**: `genericmissions.xml` (offer-tracking), HUD discovery notifications.  
**event.param**: the mission cue (`.missioncue`) offering itself.

### `event_briefing_started`

Fires when the player opens the briefing UI for a mission offer.

```xml
<conditions>
    <event_briefing_started cue="$MissionCue"/>
</conditions>
```

The `cue=` attribute is **mandatory** — filters to your specific mission's briefing.  
**Used by**: All `gm_*` (BriefingStarted phase), tutorial scripts, story scripts.  
**event.param**: usually the player entity.

### `event_briefing_cancelled`

Fires when the player closes the briefing without accepting (clicked "Decline" or ESC).

```xml
<conditions>
    <event_briefing_cancelled cue="$MissionCue"/>
</conditions>
<actions>
    <!-- Cleanup partial briefing state -->
</actions>
```

**Used by**: `gm_bringitems.xml` and similar — to revert any briefing-side-effects.

### `event_briefing_submission_selected` / `_unselected`

Fires when the player selects/deselects a SUBMISSION on a multi-option briefing (e.g. "Choose: A or B").

```xml
<conditions>
    <event_briefing_submission_selected cue="$MissionCue"/>
</conditions>
<actions>
    <!-- event.param.$submission = which option was selected -->
</actions>
```

**Used by**: Briefings with branching choices.

### `event_briefing_interact_button_clicked`

Fires when the player clicks a custom interaction button on the briefing.

```xml
<conditions>
    <event_briefing_interact_button_clicked cue="$MissionCue"/>
</conditions>
<actions>
    <!-- event.param.$button = which interact button -->
</actions>
```

**Used by**: Briefings with extra "Inspect target" / "View map" style buttons.

### `event_mission_aborted`

Fires when the mission is cancelled by ANY path:

- Player cancels via map (right-click → Abandon)
- Engine cancels (faction destroyed, station gone, time expired)
- Script self-cancels (`remove_mission` action)

```xml
<conditions>
    <event_mission_aborted cue="$MissionCue"/>
</conditions>
<actions>
    <!-- Universal cleanup: markers, anchored objects, spawned content -->
</actions>
```

**Used by**: EVERY `gm_*` and `story_*` (cleanup cue). The **single most important event** in the mission API.  
**event.param**: cause / actor info, varies by abort path.

### NO event for completion

There is **no `event_mission_completed`** in MD. Missions are "completed" by the script's own logic — when objectives satisfy, the script calls `remove_mission` and signals its completion-handler cue.

This is by design — completion semantics differ per mission (deliver wares = reach station; destroy = target dead), so there's no single engine signal.

## Actions (in `<actions>` blocks)

### `create_mission`

The action that registers a mission with the engine. Establishes the offer flow + UI integration.

```xml
<create_mission
    cue="$MissionCue"           
    name="'{8001, 100}'"        
    description="..."
    briefing="$BriefingCue"     
    category="war"              
    missiongroup="$MissionGroup"
    active="false"              
    icon="$iconmacro"
/>
```

| Attribute | Meaning |
|---|---|
| `cue` | The cue that "owns" the mission lifecycle |
| `name` / `description` | Text references (use readtext page,id format) |
| `briefing` | Cue that handles the briefing UI |
| `category` | UI category — `war`, `tutorial`, `subscription`, `dynamic`, `story` |
| `missiongroup` | [Mission group](/game/factions/missiongroup/) reference |
| `active` | `true` = forced (no decline), `false` = offered (player can decline) |
| `icon` | Custom icon macro for HUD |

**Used by**: Every mission script that surfaces in HUD.

### `remove_mission`

Removes the mission from the active list. Triggers `event_mission_aborted` for any cue listening on `cue=$MissionCue`.

```xml
<remove_mission cue="$MissionCue"/>
```

**Used by**: Self-completion path (after reward distribution), self-abort path.

## Cue accessor properties

Properties available on cue references — used to query mission state.

### `.hasmission`

Boolean — whether the cue currently has an active mission registered via `create_mission`.

```xml
<do_if value="$MissionCue.hasmission">
    <!-- Active or offered -->
</do_if>
```

### `.hasactivemission`

Boolean — whether the mission is currently ACCEPTED (not just offered). Subset of `.hasmission`.

```xml
<do_if value="$MissionCue.hasactivemission">
    <!-- Player has accepted, mission in progress -->
</do_if>
```

**Used by**: Code that needs to distinguish "offer pending" from "in progress".

### `.missioncue`

Cue reference — returns the **cue owning the mission**. Useful when starting from a non-mission cue.

```xml
<set_value name="$Owner" exact="event.param.missioncue"/>
```

### `.activemissiontype` / `.missiontype`

Mission category enum — what `category="..."` was passed to `create_mission`.

### `.missioncount` / `.missions`

`.missions` returns a list of mission cues; `.missioncount` returns size. Used by offer hosts to limit concurrent offers.

### `.mission` / `.mission_offer`

Reference to the mission descriptor. `.mission` for active missions; `.mission_offer` for offered-but-not-accepted.

### `.offerlocations`

Where a mission cue exposes its offer (BBS, NPC, signal leak). The offer host MUST support `.offerlocations`.

## Library references (`run_actions ref=`)

Vanilla mission scripts call these library refs heavily — your custom mission should too.

### `md.GenericMissions.OfferMission`

The canonical offer-management cue. Handles offer expiry, player discovery, accept/decline routing. Referenced from every `gm_*` Offer cue.

```xml
<cue name="Offer_Management" ref="md.GenericMissions.OfferMission">
    <conditions>...</conditions>
</cue>
```

### `md.GenericMissions.SetupMissionAfterAccept`

Standard post-accept setup. Initializes objective markers, mission UI.

### `md.GenericMissions.CleanupMission`

Standard teardown. Removes markers, releases anchored objects.

### `md.LIB_Reward_Balancing.GetReward`

Calculates economy-consistent reward. See [Architectural overview: Reward calculation](/overviews/reward-calculation/).

```xml
<run_actions ref="md.LIB_Reward_Balancing.GetReward">
    <param name="Mission" value="$MissionCue"/>
    <param name="ResultStorage" value="$Reward"/>
</run_actions>
```

### `md.RML_<phase>.<entry>`

Reusable phase libraries — see [Generic missions → Layer 0](/game/missions/generic-mission/#layer-0-rml_).

| Library | Entry | Use |
|---|---|---|
| `md.RML_Find_Object.Setup` | Setup | Find-object sub-objective |
| `md.RML_Deliver_Wares.Setup` | Setup | Deliver-wares phase |
| `md.RML_Destroy_Components.Setup` | Setup | Destroy-objects phase |
| `md.RML_ClaimPlot.ClaimPlot` | ClaimPlot | Sector ownership transfer |
| `md.RML_Collect_Crates.Setup` | Setup | Collect floating crates |
| `md.RML_Escort.Setup` | Setup | Escort an object |

## Categories enum (for `create_mission category=`)

| Category | UI treatment |
|---|---|
| `war` | War subscription HUD section |
| `tutorial` | Yellow tutorial overlay |
| `subscription` | Subscription mission list |
| `dynamic` | Random encounter HUD |
| `story` | Story arc list |
| `guidance` | Guidance Mission (HUD-only, no list) |
| `assisted_task` | Assisted task UI |

Match your mission category to the closest vanilla equivalent — players have learned to recognize the HUD treatment per category.

## Event-flow summary

```
create_mission (action)
     ↓
event_player_discovered_mission_offer (player sees offer)
     ↓
event_briefing_started (player opens briefing)
     ↓
   ├─ event_briefing_cancelled (declined)
   ├─ event_briefing_submission_selected (option picked)
   └─ Accept (via LIB c_mission_accept)
        ↓
        Mission becomes active (.hasactivemission = true)
        ↓
        Custom progression cues
        ↓
   ┌────────────────┴───────────────┐
   ↓                                ↓
   Script-driven completion         Player/system abort
   (no engine event;                   ↓
    script calls remove_mission)       event_mission_aborted
        ↓
        event_mission_aborted (fires on remove_mission too!)
        ↓
        Cleanup cue runs
```

**Critical**: `event_mission_aborted` fires on BOTH script-completion `remove_mission` AND player-cancel. Use `event.param` to distinguish if your cleanup differs.

## Common gotchas

- ⚠ **`event_mission_aborted` fires on completion too** — your cleanup runs on completion path; distinguish via cue ordering or `event.param`
- ⚠ **No `event_mission_accepted` exists** — listen for `event_briefing_started` + custom signal; vanilla uses `BriefingStarted` cue with branch
- ⚠ **`create_mission` without `briefing=` shows empty briefing UI** — every offered mission needs a briefing cue
- ⚠ **`active="true"` missions can't be declined or aborted by player** — only by script
- ⚠ **`.missioncue` of `event.param` is empty if event isn't mission-related** — null-check before use
- ⚠ **Briefing events are FILTERED by `cue=`** — without it your handler catches ALL briefings, including unrelated ones

## Code references (vanilla)

| Concern | Where to read |
|---|---|
| Briefing handler pattern | `gm_bringitems.xml` `BriefingStarted` cue |
| Cleanup on abort | Every `gm_*` `event_mission_aborted` handler |
| `create_mission` canonical call | `gm_bringitems.xml` `CreateOffer` cue |
| Library invocation | `gm_claimplot.xml` ClaimPlot_Ref usage |
| Reward distribution | `lib_reward_balancing.xml` |
| Forced-active mission | `tutorial_*.xml` (active="true" pattern) |
| Subscription mission lifecycle | `x4ep1_war_subscriptions.xml` mission-generation chains |

## Related

- [Generic missions](/game/missions/generic-mission/) — primary user of these events
- [Story missions](/game/missions/story-mission/) — uses the same API
- [Subscription missions](/game/missions/subscription-mission/) — orchestrates via these events
- [Cue (lang)](/lang/md-framework/cue/) — `.hasmission` accessor details
- [Architectural overview: Mission framework](/overviews/mission-framework/) — system-level view
- [Architectural overview: Reward calculation](/overviews/reward-calculation/) — `LIB_Reward_Balancing`

---

*The mission API is small but the patterns matter. Once you know `create_mission` / `event_mission_aborted` / `.hasmission` + the three library refs, you can write any mission category that vanilla supports.*

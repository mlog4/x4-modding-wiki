---
title: Story missions
description: Hand-authored narrative arcs in story_*.xml. Linear progression, character-tied, often DLC-gated. Vanilla has 7 story scripts.
---

A **Story mission** is hand-authored narrative content. Unlike Generic missions (which template a kind of mission and instantiate many copies), story missions are **bespoke** — each script is unique, character-tied, sector-tied, and usually linear in progression.

Vanilla has **7 story scripts** in `md/`.

## Vanilla story scripts

| File | Story arc | Trigger | DLC |
|---|---|---|---|
| `story_paranid.xml` | Paranid civil war / Cardinal | Reputation with Paranid + sector visit | Base |
| `story_buccaneers.xml` | Buccaneers (Riptide) arc | Pirate DLC mid-game | Pirate |
| `story_ventures.xml` | Ventures intro / station traveller | Ventures DLC active | Ventures |
| `story_diplomacy_intro.xml` | First contact with diplomacy system | Faction relation + dock | Kingdom End |
| `story_research_embassy.xml` | Diplomacy research | HQ research progress | Kingdom End |
| `story_research_welfare_1.xml` | Welfare-module research | HQ research progress | Base |
| `story_research_xen_equipment.xml` | Xenon-tech research | HQ + Xenon encounter | Base |

## Anatomy of a story script

Story scripts share a common structure:

```xml
<mdscript name="StoryParanid" version="1">
    <cues>
        <!-- Setup cue: runs once on game start, sets globals -->
        <cue name="Setup" version="2">
            <conditions>
                <event_game_started/>
            </conditions>
            <actions>
                <set_value name="md.StoryParanid.$state" exact="0"/>
                <!-- Anchor characters, mark mission groups -->
            </actions>
        </cue>

        <!-- Phase-0 trigger: discovery / first encounter -->
        <cue name="Phase0_StartTrigger" instantiate="true">
            <conditions>
                <check_value value="$state == 0"/>
                <event_object_signalled_event/>
                <!-- character / sector specific condition -->
            </conditions>
            <actions>
                <create_mission ... />
                <set_value name="$state" exact="1"/>
            </actions>
        </cue>

        <!-- Phase-N progression cues -->
        <cue name="Phase1_..." />
        <cue name="Phase2_..." />
        ...

        <!-- Cleanup cue: handles abort / completion teardown -->
        <cue name="Cleanup">
            <conditions>
                <event_mission_aborted cue="$MissionCue"/>
            </conditions>
            <actions>
                <!-- Remove markers, despawn spawned NPCs -->
            </actions>
        </cue>
    </cues>
</mdscript>
```

Key patterns:

- **State machine via global integer** — `md.X.$state = 0..N` tracks current phase
- **Phase guards in conditions** — each phase-N cue has `check_value $state == N` so wrong-phase events don't fire
- **Setup runs once** — see [Setup runs once gotcha](/wiki/) — patches recover state after save load
- **Cleanup unified** — single cue handles abort regardless of phase

## Triggering story progression

Three trigger mechanisms vanilla uses:

### 1. Visit-a-sector

```xml
<conditions>
    <event_object_changed_sector object="player.entity"/>
    <check_value value="event.param == cluster.cluster_14.sector002"/>
</conditions>
```

Used by Paranid story Phase 0 — entering specific sectors fires the encounter.

### 2. Reputation-tier

```xml
<conditions>
    <event_faction_relation_changed/>
    <check_value value="event.param == faction.paranid"/>
    <check_value value="faction.paranid.relationto.{faction.player}.uivalue ge 10"/>
</conditions>
```

Used for diplomacy-gated content.

### 3. Talk-to-NPC

```xml
<conditions>
    <event_npc_talked actor="$Cardinal"/>
</conditions>
```

The script anchors specific NPC actors at setup, then listens for player conversation.

## Mission offer vs. forced mission

Story missions sometimes BYPASS the offer/accept flow:

- **Offered**: `create_mission` action with `briefing` element — player sees a mission offer at the NPC, can decline
- **Forced**: `create_mission` action with `active="true"` — appears already-active, no decline option

Vanilla story arcs typically use offered for hooks, forced for chains-in-progress.

## Anchoring characters / sectors

Story scripts need long-lived references:

```xml
<set_value name="md.StoryParanid.$Cardinal"
    exact="find_actor namespace="this" name="actor_paranid_cardinal_01"/>

<add_anchored_object
    object="md.StoryParanid.$Cardinal"
    reason="STORY_PARANID"/>
```

`add_anchored_object` prevents the engine from despawning the NPC during cleanup sweeps. The `reason=` string is for debug visibility — you can grep `add_anchored_object reason=STORY_X` to find what holds an object alive.

## Mission groups

Each story registers itself with a mission group for HUD UI categorization:

```xml
<set_value name="$MissionGroup"
    exact="missiongroup.MG_StoryParanid"/>

<create_mission ...
    missiongroup="$MissionGroup"/>
```

Mission groups are declared in `md/missiongroups.xml` — see [Mission group](/game/factions/missiongroup/).

## Common gotchas

- ⚠ **State machine collapses if a phase event fires twice** — always increment `$state` BEFORE the long action sequence, or use `<reset_cue cue="this"/>` for guard cues
- ⚠ **`add_anchored_object` leaks NPCs into the world forever** if not paired with `remove_anchored_object` in cleanup
- ⚠ **DLC story scripts crash at load without faction guards** — see [DLC handling](/wiki/dlc-handling/)
- ⚠ **`event_npc_talked` requires `actor=` to be a specific NPC** — not a class / faction filter
- ⚠ **Forced missions (active=true) cannot be declined** — only use for explicit player-already-committed flows

## Code references (vanilla)

| Concern | Where to read |
|---|---|
| Cardinal anchor + civil war | `story_paranid.xml:50-200` |
| Briefing structure | `story_paranid.xml:300-600` |
| Phase progression pattern | All `story_*.xml` files share it |
| Cleanup pattern | Bottom of each `story_*.xml` |
| Save migration patches | `story_paranid.xml:1-30` (look for `<patch>`) |

## Related

- [Generic missions](/game/missions/generic-mission/) — templated counterpart
- [Mission events](/game/missions/mission-events/) — `event_mission_aborted` semantics
- [Architectural overview: Mission framework](/overviews/mission-framework/) — three-tier composition
- [Architectural overview: Save migration](/overviews/save-migration/) — how `version=` survives story-in-progress saves
- [Mission group](/game/factions/missiongroup/) — HUD categorisation

---

*Story scripts are X4's "bespoke content" mechanism — when your mod needs hand-authored narrative not a template, this is the pattern. If your mod templates a kind of mission and produces N variations, you want [Generic missions](/game/missions/generic-mission/) instead.*

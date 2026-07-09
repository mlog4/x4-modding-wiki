---
title: Terran Core (Restricted Core) story
description: How Terran patrols enforce Solar System restricted access. Not a player-objective arc — a permanent gameplay system. Sets up Earth/Moon Inner Core + Mars/Venus/Mercury Outer Core patrols.
---

The **Terran Core arc** (`story_terran_core.xml`, 744 lines) is NOT a player-objective story — it's the **permanent gameplay system** that enforces Terran-territory restricted access. It runs in the background continuously, generating Terran patrols that approach-warn, firm-warn, and trespass-warn the player about the Solar System restricted core.

- **Script**: `story_terran_core.xml`
- **DLC**: Cradle of Humanity
- **Type**: **Permanent gameplay system**, not a chapter-based story
- **Trigger**: `event_cue_signalled md.Setup.Start`

## Restricted Core territory

The script defines two tier territories:

### Inner Core (most restricted)

| Sector | Macro |
|---|---|
| **Earth** | `cluster_104_sector001` |
| **Moon / Luna** | `cluster_104_sector002` |

Stored as `$TerranInnerCoreSectors` group.

### Outer Core (restricted)

| Sector | Macro |
|---|---|
| **Mars** | `cluster_101_sector001` |
| **Venus** | `cluster_102_sector001` |
| **Mercury** | (code references "mercury, venus, mars" but doesn't always show sector macro inline) |
| **Asteroid Belt** | `cluster_100_sector001` |

Stored as `$TerranOuterCoreSectors` group.

Different patrols + warning systems apply per territory tier.

## How it works

### Restricted Core patrol system

The script runs an instantiated `RestrictedCore` cue per faction interaction:

```
RestrictedCore (instantiated)
├── RestrictedCore_Setup
├── RestrictedCore_SetupActor
├── RestrictedCore_SetupCommander (instantiated)
├── RestrictedCore_CommanderPromoted (instantiated)
├── RestrictedCore_CommanderKilled (instantiated)
├── RestrictedCore_SubordinateKilled (instantiated)
├── RestrictedCore_NewJobShip (instantiated)
├── RestrictedCore_Sector_Enter (instantiated)
├── RestrictedCore_Sector_Exit (instantiated)
├── RestrictedCore_Sector_Refresh
│   └── RestrictedCore_Sector_Refresh_Interval (checkinterval="1s", instantiated)
├── RestrictedCore_Patrol
│   ├── RestrictedCore_Patrol_FindJob_DEBUG (instantiated)
│   ├── RestrictedCore_Patrol_DestroyCommander_DEBUG (instantiated)
│   ├── RestrictedCore_Patrol_DestroyFleetRandom_DEBUG (instantiated)
│   ├── RestrictedCore_Patrol_Relation (instantiated)
│   ├── RestrictedCore_Patrol_Engage (instantiated)
│   │   ├── RestrictedCore_Patrol_AbortPersuit_Timeout
│   │   ├── RestrictedCore_Patrol_AbortPersuit_Sector (checkinterval="10s", instantiated)
│   │   └── RestrictedCore_Patrol_AbortPersuit
└── RestrictedCore_Broadcasts
    ├── RestrictedCore_ApproachWarning (instantiated)
    │   └── RestrictedCore_ApproachWarning_Speak_Ref (refs LIB_Dialog.Speak_Actor)
    ├── RestrictedCore_ApproachWarningFirm (instantiated)
    │   └── RestrictedCore_ApproachWarningFirm_Speak_Ref (refs LIB_Dialog.Speak_Actor)
    └── RestrictedCore_TrespassingWarning (instantiated)
```

### Three warning tiers

When player approaches Inner Core territory, three escalating warnings fire:

1. **Approach Warning** — gentle "you're approaching restricted territory"
2. **Approach Warning Firm** — firm warning to leave
3. **Trespassing Warning** — final warning, ship engagement imminent

Each warning has a dedicated cue with `Speak_Ref` for spoken delivery.

### Patrol engagement mechanics

If player ignores warnings and enters restricted core:

- `RestrictedCore_Patrol_Engage` fires — patrol engages player
- `RestrictedCore_Patrol_AbortPersuit_Timeout` — patrol gives up after timeout
- `RestrictedCore_Patrol_AbortPersuit_Sector` (10s polling) — patrol breaks off if player leaves territory
- `RestrictedCore_Patrol_AbortPersuit` — abort logic

This creates the **classic "approach + flee" Terran gameplay** familiar from Cradle of Humanity.

### Commander promotion / death tracking

If patrol commander dies:
- `RestrictedCore_CommanderKilled` fires — handles death
- `RestrictedCore_CommanderPromoted` — promotes a subordinate to fill the role
- `RestrictedCore_SubordinateKilled` — subordinate loss tracking

This maintains patrol continuity over long play sessions.

### DEBUG cues (testing only)

Vanilla provides DEBUG cues for testing:
- `RestrictedCore_Patrol_FindJob_DEBUG` — find a patrol job
- `RestrictedCore_Patrol_DestroyCommander_DEBUG` — kill commander for testing
- `RestrictedCore_Patrol_DestroyFleetRandom_DEBUG` — destroy random fleet for testing

Mods should NOT rely on these; they're for vanilla development testing.

## Job ship integration

`RestrictedCore_NewJobShip` (instantiated) — fires whenever a new Terran job ship spawns in restricted territory. This lets the system register new patrols into the tracking system automatically.

## Mission entries

Since this is a permanent gameplay system, there are no player-facing "mission entries" in the traditional sense. Instead:

| What player encounters | When | Cue trigger |
|---|---|---|
| **Spoken approach warning** | Player flies near restricted sector | `RestrictedCore_ApproachWarning` |
| **Firmer approach warning** | Player continues toward restricted sector | `RestrictedCore_ApproachWarningFirm` |
| **Trespassing warning** | Player enters restricted sector | `RestrictedCore_TrespassingWarning` |
| **Patrol engages** | Player remains in restricted territory | `RestrictedCore_Patrol_Engage` |
| **Patrol breaks off** | Player exits territory or timeout | `RestrictedCore_Patrol_AbortPersuit_*` |

## Mod conflict risks

- ❌ **Mods that change Solar System sector ownership** break Restricted Core territory recognition
- ❌ **Mods that disable Terran patrol behavior** trivialize the restricted core gameplay
- ❌ **Mods that change `LIB_Dialog.Speak_Actor`** affect spoken warnings
- ❌ **Mods that disable `ApproachObject_Handler` or sector enter/exit events** break sector boundary detection
- ⚠ **Combat-rebalance mods** affect patrol engagement feasibility
- ⚠ **Mods adding bulk job ships in Solar System** can collide with patrol registration
- ⚠ **Faction-rebalance mods that change `faction.terran` relations** affect warning thresholds

## Code references

| Concern | Cue |
|---|---|
| Inner Core sectors | `$TerranInnerCoreSectors` group |
| Outer Core sectors | `$TerranOuterCoreSectors` group |
| Patrol system | `RestrictedCore_Patrol*` block |
| 3-tier warnings | `RestrictedCore_*Warning*` cues |
| Pursuit abort | `RestrictedCore_Patrol_AbortPersuit*` |
| Commander tracking | `RestrictedCore_Commander*` cues |
| Sector boundary | `RestrictedCore_Sector_Enter`/`_Exit` |
| Refresh polling | `RestrictedCore_Sector_Refresh_Interval` (1s) |

## Related

- [Terran arcs overview](/vanilla-content/missions/terran-arcs/)
- [Terran Prelude](/vanilla-content/missions/terran-arcs/prelude/) — preceding cinematic
- [HQ Discovery](/vanilla-content/missions/terran-arcs/hq-discovery/) — concurrent Terran arc
- [Yaki arc](/vanilla-content/missions/terran-arcs/yaki/) — Yaki uses Terran Outpost mechanics that interact with Restricted Core

---

*Terran Core is not a "mission" — it's the **persistent restricted-territory enforcement system** that gives Cradle of Humanity its distinctive feel. Your mod's interference with Solar System sectors, Terran patrol behaviors, or warning systems breaks the iconic "you do not have permission to be here" gameplay.*

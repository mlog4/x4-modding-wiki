---
title: Boron Epilogue
description: Post-Main-story arc. Kingdom End gates opening + news anchor announcements. Final state-transition for Boron territory.
---

The **Boron Epilogue** is the post-Main-story conclusion. After the player completes the Main arc, the epilogue triggers Kingdom End gate openings + news anchor announcements signaling the new territorial state.

- **Script**: `story_boron_epilogue.xml`
- **Size**: 8KB (small, transitional)
- **DLC**: Kingdom End
- **MDScript version**: 4 (`Start` cue)

## Trigger conditions

Epilogue fires after Main story state advanced past Ch7. Specifically:

- `Setup_StoryState` validates story state
- `Setup_StoryStateWait` polls until state ready

## Setup

The epilogue creates a single dedicated NPC:

- **Gate Opening Announcer** (`Setup_GateOpeningAnnouncer`) — News-anchor style voice character

---

## Mission entry: "Kingdom End Gate Opening"

### Cue: `GateOpening_TriggerHandling`

- **In-game name**: Kingdom End gates opening news event
- **Path/Chapter**: Epilogue (main)
- **Find in game**: Auto-fires after Main story Ch7 conclusion
- **Prerequisites**: Main story state = "completed"
- **What player encounters**:
  - **Trigger validation**: `KingdomEndGateOpened_OnFailCheck` ensures cleanup if state not ready
  - **Trigger event**: `KingdomEndGateOpened_Trigger` — initiates the gate-opening sequence
  - **Open remaining Kingdom End gates**: `OpenRemainingKEGates` — all Kingdom End sector gates open
  - **News anchor announces** (`OpenRemainingKEGates_NewsAnchorSpeak`, 30s polling):
    - News-anchor voice over reports the gate openings
    - Player receives announcements about Kingdom End territory access
- **Where**: Player anywhere (announcement is universal); gates open in Kingdom End sectors
- **NPCs involved**: News Anchor (Gate Opening Announcer)
- **Reward**:
  - All Kingdom End gates opened (sectors `cluster_606_sector001` Kingdom End I + connected)
  - Boron territory accessible without restriction
  - Story state advanced to "Boron arc fully complete"
- **Chains to**: End of Boron content arc (epilogue is terminal)
- **Code reference**: `story_boron_epilogue.xml` `GateOpening_TriggerHandling`

### Mod conflict risks

- ❌ **Mods that disable specific Kingdom End gates** may collide with `OpenRemainingKEGates`
- ❌ **Mods that change Kingdom End sector layout** affect which gates get opened
- ⚠ **News anchor mods** may collide with `Setup_GateOpeningAnnouncer`
- ⚠ **Custom faction mods that change Kingdom End sector ownership** affect post-epilogue state

---

## Effects after epilogue

Post-epilogue state:

- **All Kingdom End sectors connected** — Rolk's Demise, Atreus Clouds, Menelaus Oasis, Towering Wave, Reflecting Stars, Kingdom End I all reachable
- **News notification queue** — player receives several news announcements about the gate openings (30-second polling spreads them out)
- **Story state**: `gamestart.storystate.story_boron_*` flags fully set
- **Faction state**: Boron return acknowledged; trade routes possible

## Code references

| Concern | Cue |
|---|---|
| Story state wait | `Setup_StoryStateWait` |
| Gate Opening Announcer setup | `Setup_GateOpeningAnnouncer` |
| Validation check | `KingdomEndGateOpened_OnFailCheck` |
| Trigger | `KingdomEndGateOpened_Trigger` |
| Gate opening | `OpenRemainingKEGates` |
| News announcements | `OpenRemainingKEGates_NewsAnchorSpeak` |

## Related

- [Boron arcs overview](/vanilla-content/missions/boron-arcs/)
- [Prelude](/vanilla-content/missions/boron-arcs/prelude/) — entry arc
- [Main story](/vanilla-content/missions/boron-arcs/main/) — preceding 8-chapter arc

---

*The Epilogue is a state-transition rather than an interactive arc. It's small but critical — without it, Kingdom End remains partially gate-locked even after the player completes the climax.*

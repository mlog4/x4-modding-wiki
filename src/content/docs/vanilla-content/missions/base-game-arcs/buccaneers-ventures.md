---
title: Buccaneers + Ventures arcs
description: Two small base game arcs — Buccaneers (540 lines, Buccaneer flagship encounter with Betty/Boso/Dal trio commentary) + Ventures (499 lines, Venture construction system at HQ with Skipper testing).
---

Two small base-game arcs that share a similar structural pattern — **passive event listeners** with NPC commentary chains. Together less than 1100 lines, they're vanilla's "ambient narrative" examples — gameplay-adjacent rather than chapter-arc.

## Buccaneers arc

**Script**: `story_buccaneers.xml` (540 lines)  
**Theme**: Buccaneer encounters with commentary by Betty / Boso / Dal trio

### Setup

The Buccaneers arc has **no $Page set** (commented out as `00000`). It runs as an ambient encounter system.

### Mechanic: encounter polling

Two main encounter types, each polling every 2 seconds:

| Encounter type | Cue | Polling |
|---|---|---|
| **Ship Encounter** | `Ship_Encounter` | 2s |
| **Station Encounter** | `Station_Encounter` | 2s |
| **Station Warning** | `Station_Warning` | 2s |

### Mission entry: "Buccaneer Ship Encounter"

- **Cue**: `Ship_Encounter` (2s polling)
- **In-game name**: Encounter with Buccaneer ship
- **Find in game**: Player passes near a Buccaneer ship
- **What player encounters**:
  - **3-way commentary chain**:
    - `Ship_Encounter_Dialog_Betty` → `Ship_Encounter_Dialog_Betty_Speak_Actor_Ref` (refs LIB_Dialog.Speak_Actor)
    - `Ship_Encounter_Dialog_Boso` → `Ship_Encounter_Dialog_Boso_Speak_Actors_Ref` (refs LIB_Dialog.Speak_Actors)
    - `Ship_Encounter_Dialog_Dal` → `Ship_Encounter_Dialog_Dal_Speak_Actors_Ref` (refs LIB_Dialog.Speak_Actors)
  - Betty + Boso + Dal each provide their flavor of commentary
  - Player decides whether to engage or avoid
- **Reward**: Lore exposition through commentary
- **Code reference**: `story_buccaneers.xml` `Ship_Encounter` block

### Mission entry: "Buccaneer Station Encounter"

- **Cue**: `Station_Encounter` (2s polling)
- **In-game name**: Encounter with Buccaneer station
- **What player encounters**:
  - Same 3-way commentary structure as Ship Encounter
  - Betty/Boso/Dal each comment on the station
- **Code reference**: `story_buccaneers.xml` `Station_Encounter` block

### Mission entry: "Buccaneer Station Warning"

- **Cue**: `Station_Warning` (2s polling)
- **In-game name**: Buccaneer station broadcasts warning
- **What player encounters**:
  - A Buccaneer speaks a warning via `Station_Warning_Dialog_Buccaneer_Speak_Actor_Ref`
  - Player ignores/responds at own risk
- **Code reference**: `story_buccaneers.xml` `Station_Warning`

### Debug guidance system

| Cue | Purpose |
|---|---|
| `Debug_Station_Guidance` (instanced) | DEBUG: guide player to a Buccaneer station |
| `Debug_Ship_Guidance` (instanced) | DEBUG: guide player to a Buccaneer ship |
| `Reset_Dialog` (instanced) | Reset dialog state for testing |

### Mod conflict risks — Buccaneers

- ❌ **Mods that disable Betty / Boso / Dal NPCs** break the commentary trio
- ❌ **Mods that change Buccaneer faction behavior** affect encounter triggers
- ⚠ **Mods adding ambient dialog systems** can collide with 2s polling encounters
- ⚠ **Conversation mods** may collide with Speak_Actor / Speak_Actors libraries

### Buccaneer flagship

The Buccaneer flagship (mentioned in [Story arcs catalog](/vanilla-content/story-arcs/#buccaneers-arc)) is referenced as **Helianthus** (page 20101, line 120901). Vanilla's earlier code referenced the named flagship; the trio commentary system in this script is the **ambient encounter layer**.

---

## Ventures arc

**Script**: `story_ventures.xml` (499 lines)  
**Theme**: Venture construction system + Skipper testing

### Setup

Ventures arc handles **venture construction lifecycle** — the player's ships sent to other players' games via the Ventures system.

### Skipper Debug system

The arc has a complete Skipper debug system for testing:

| Cue | Purpose |
|---|---|
| `Debug_Skipper_Ventures` (onfail=cancel) | Skipper root |
| `Debug_Skipper_Spawn` (instanced, comment: "placed by SkipperShip") | Spawn Skipper |
| `Debug_Skipper_Disconnect` (instanced) | Disconnect Skipper |
| `Debug_Skipper_Despawn` (instanced) | Despawn Skipper |
| `Debug_Skipper_Conversation_Start` (instanced) | Begin conversation |
| `Debug_Skipper_Conv_Main` (instanced) | Main conversation |
| `Debug_Skipper_VentureModulesHQ` (instanced) | Test Venture modules at HQ |

### Mechanic: Venture construction lifecycle

| Cue | Purpose |
|---|---|
| `Venture_Boso_Comments` (instanced, comment: "fire and forget speaks") | Boso Ta ambient comments |
| `Venture_Boso_Comments_Speak_Ref` (refs LIB_Dialog.Speak_Actor) | Spoken Boso commentary |
| `Venture_Construction_Setup` (onfail=cancel) | Setup Venture construction |
| `Venture_ConstructionStarted` (instanced) | Construction begins event |
| `Venture_ConstructionStarted_Comments` (onfail=cancel) | Comments when construction starts |
| `Venture_ConstructionComplete` (instanced) | Construction completes event |
| `Venture_Destroyed` (instanced) | Venture destroyed event |

### Mission entry: "Venture Construction"

- **Cue chain**: `Venture_Construction_Setup` → `Venture_ConstructionStarted` → `Venture_ConstructionComplete`
- **In-game name**: Build a Venture module
- **Find in game**: Player initiates Venture module construction at HQ
- **What player encounters**:
  - Construction setup phase
  - Boso Ta provides "fire and forget" ambient commentary during construction
  - Construction-started event fires (with Boso Ta speak)
  - Construction-complete event fires
  - Player can use the Venture module
- **NPCs involved**: Boso Ta (commentary), Skipper (debug system)
- **Reward**: Venture module operational
- **Code reference**: `story_ventures.xml` `Venture_*` block

### Mission entry: "Venture Destroyed"

- **Cue**: `Venture_Destroyed` (instanced)
- **In-game name**: Venture destroyed event handler
- **What player encounters**:
  - If a Venture is destroyed in transit / by event
  - System handles state cleanup
- **Reward**: State maintained correctly

### Mod conflict risks — Ventures

- ❌ **Mods that disable Boso Ta** break the comment chain
- ❌ **Mods that disable Ventures module mechanics** break entire arc
- ❌ **Mods that change Venture construction events** affect lifecycle tracking
- ⚠ **Mods adding bulk HQ module construction** can collide with detection
- ⚠ **Custom NPC mods at HQ** may collide with Skipper Debug

---

## Why these arcs are small

Both Buccaneers and Ventures are **ambient encounter systems**, not chapter-arcs:

- **Buccaneers** is the "Buccaneer faction is around" ambient layer — gives players narrative context whenever they encounter Buccaneers, without forcing a story
- **Ventures** is the "Venture mechanics work" wrapper — provides ambient Boso commentary + handles construction lifecycle events

For modders, these are **template patterns** for ambient narrative content — small, polling-based, NPC-commentary-driven scripts that enrich gameplay without forcing story progression.

## Code references

| Concern | Cue (Buccaneers / Ventures) |
|---|---|
| Ship encounter | `Ship_Encounter` (Buccaneers, 2s) |
| Station encounter | `Station_Encounter` (Buccaneers, 2s) |
| Station warning | `Station_Warning` (Buccaneers, 2s) |
| 3-way commentary | Betty / Boso / Dal `_Speak_Actor[s]_Ref` cues |
| Venture lifecycle | `Venture_Construction_Setup` → `Started` → `Complete` |
| Venture destroyed | `Venture_Destroyed` (instanced) |
| Boso Ta comments | `Venture_Boso_Comments` (fire-and-forget) |
| Skipper Debug | `Debug_Skipper_Ventures` (Ventures), `Debug_Station_Guidance` / `Debug_Ship_Guidance` (Buccaneers) |

## Related

- [Mission encyclopedia](/vanilla-content/missions/) — landscape
- [Story arcs catalog](/vanilla-content/story-arcs/) — Buccaneers + Ventures high-level entries
- [Wiki: DLC handling](/wiki/dlc-handling/) — Pirate DLC (Buccaneers), Ventures DLC (Ventures system)
- [Scenario Hub](/vanilla-content/missions/timelines-arcs/scenario-hub/) — different small-arc template (anthology Hub)

---

*Buccaneers and Ventures are the rare vanilla examples of "ambient narrative" arcs — small, encounter-driven, polling-based scripts that enrich gameplay without forcing story progression. The 3-way commentary (Betty/Boso/Dal) and the fire-and-forget Boso comments are templates worth studying for mod authors adding similar ambient flavor.*

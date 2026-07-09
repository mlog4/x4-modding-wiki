---
title: Research Abandoned Ships + Timelines Epilogue
description: Two final Timelines arcs — HQ research that unlocks 5 abandoned ships (Cutlass / Odachi / Sapporo / Elite Sport / Kestrel Sport) and the 246KB Epilogue with RaceShip Handover.
---

Two Timelines arcs sit outside the Hub-and-spoke structure:

- **[Research: Abandoned Ships](#research-abandoned-ships)** — HQ research unlocking 5 ships
- **[Epilogue](#epilogue)** — post-Timelines closure arc with RaceShip Handover

---

## Research: Abandoned Ships

**Script**: `story_research_abandoned_ships.xml` (43KB)  
**DLC**: Timelines

This is an HQ research arc that follows a **per-ship pattern** — each of 5 abandoned ships has its own:
- Setup cue
- Claimed event
- Research cue (referencing the shared `Research_Unlock` library)

### The 5 abandoned ships

| Ship | Setup cue | Claimed cue | Research ref |
|---|---|---|---|
| **Cutlass** | `Cutlass_Setup` | `Cutlass_Claimed` | `Cutlass_Reasearch` (ref `Research_Unlock`) |
| **Odachi** | `Odachi_Setup` | `Odachi_Claimed` (v2) | `Odachi_Reasearch` (ref `Research_Unlock`) |
| **Sapporo** | `Sapporo_Setup` (v2) | `Sapporo_Claimed` (v6) | `Sapporo_Reasearch` (ref `Research_Unlock`) |
| **Elite Sport** | `Elite_Sport_Setup` | `Elite_Sport_Claimed` (v2) | `Elite_Sport_Reasearch` (ref `Research_Unlock`) |
| **Kestrel Sport** | `Kestrel_Sport_Setup` | `Kestrel_Sport_Claimed` (v2) | `Kestrel_Sport_Reasearch` (ref `Research_Unlock`) |

**Vanilla typo (confirmed)**: All five cues are named `_Reasearch` (note: "Reasearch" — same typo as Cypher research arc). Modders referencing these cues must use the misspelled form.

### Per-ship pattern

```
<Ship>_Setup → <Ship>_Claimed → <Ship>_Reasearch
```

Each ship follows the same lifecycle:
1. **Setup** registers the abandoned ship's existence + location
2. **Claimed** fires when the player claims the ship
3. **Reasearch** (via `Research_Unlock` library) gates research at HQ to unlock the ship's blueprint / equipment

### Ship names + categorization

Based on the macro names:

| Ship | Class hint | Likely real-world inspiration |
|---|---|---|
| **Cutlass** | Sword name | Argon family ship |
| **Odachi** | Long Japanese sword | Yaki / Terran ship |
| **Sapporo** | Japanese city | Yaki / Terran-Japanese themed |
| **Elite Sport** | Sport class | High-performance racer |
| **Kestrel Sport** | Kestrel = falcon, sport | High-performance racer |

The presence of **two "Sport" variants** (Elite Sport + Kestrel Sport) suggests these are linked to Timelines Race scenarios — race winners may receive these ships.

### Mission entry: "Cutlass Research"

- **Cue chain**: `Cutlass_Setup` → (claim event) → `Cutlass_Reasearch`
- **In-game name**: Cutlass abandoned ship research
- **Find in game**: HQ research menu (after Cutlass claimed)
- **What player encounters**:
  - Player encounters abandoned Cutlass somewhere (specific sector per setup)
  - Claims it (boarding or salvage)
  - Returns to HQ
  - Research entry unlocks
  - Standard research timer
- **Reward**: Cutlass blueprint / capability unlock
- **Chains to**: HQ research framework

(Same pattern for Odachi, Sapporo, Elite Sport, Kestrel Sport.)

### Mod conflict risks — Abandoned Ships

- ❌ **Mods that change abandoned ship macros** affect all 5 ships
- ❌ **Mods that disable HQ research** break the entire arc
- ❌ **Mods that change ship-claim mechanics** affect Claimed events
- ⚠ **Mods adding more abandoned ships** can collide with these 5
- ⚠ **Race scenario mods** may interfere with Elite Sport / Kestrel Sport delivery

### Code references — Research

| Concern | Cue |
|---|---|
| Per-ship pattern | `<Ship>_Setup` → `<Ship>_Claimed` → `<Ship>_Reasearch` |
| Research library ref | `Research_Unlock` (shared across all 5) |
| Vanilla typo | `Reasearch` (NOT Research) — modders must match the typo |

---

## Epilogue

**Script**: `story_timelines_epilogue.xml` (246KB)  
**DLC**: Timelines  
**MDScript version**: 3

The Timelines Epilogue is a **post-completion arc** — fires after player completes Timelines content, handling:
- Boso Ta unlock at HQ
- Race ship handover
- Gate openings
- Save migration patches

### Setup phase

| Cue | Purpose |
|---|---|
| `Setup_Remember_Boso_HQ_Check` | Verify Boso Ta state at HQ |
| `Activate_Story_InitialDelay` (60s polling) | Initial delay before activation |
| `Patch_Userdata` (instanced) | Save migration patch |

### Race Ship Handover

| Cue | Purpose |
|---|---|
| `RaceShip_Handover` (v2) | Hand over a race-winning ship to player |

This connects to the abandoned ships research arc — **race winners receive Elite Sport / Kestrel Sport / similar via this cue**.

### Debug Skipper system

The Epilogue has a comprehensive Debug Skipper system for testing:

| Cue | Purpose |
|---|---|
| `Debug_Skipper` | Skipper system root |
| `Debug_Skipper_Spawn` (instanced) | Spawn Skipper |
| `Debug_Skipper_Disconnect` (instanced) | Disconnect Skipper |
| `Debug_Skipper_Conversation_Start` (instanced) | Begin conversation |
| `Debug_Skipper_Conversation_Main` (instanced) | Main conversation menu |
| `Debug_Skipper_Unlock_Boso` (instanced) | **DEBUG: Unlock Boso Ta** at HQ |
| `Debug_Skipper_Open_Gates` (instanced) | **DEBUG: Open gates** |

The DEBUG cues let vanilla developers test the Boso unlock + gate opening sequence without playing through Timelines content.

### Mission entries

Specific per-mission entries for the Epilogue are extensive — the arc is 246KB. Key milestones:

1. **InitialDelay** — 60-second activation timer
2. **Boso Ta check + unlock** at HQ
3. **Gate openings** for additional access
4. **Race ship handover** (if applicable)
5. **Final dialogue + cleanup**

### Mod conflict risks — Epilogue

- ❌ **Mods that change Boso Ta's HQ presence** break unlock check
- ❌ **Mods that override gate-opening mechanics** affect post-Timelines accessibility
- ❌ **Mods that change race ship reward mechanics** break handover
- ⚠ **Save-migration mods** may collide with `Patch_Userdata`

### Code references — Epilogue

| Concern | Cue |
|---|---|
| Boso HQ check | `Setup_Remember_Boso_HQ_Check` |
| Initial delay | `Activate_Story_InitialDelay` (60s) |
| Race ship handover | `RaceShip_Handover` (v2) |
| Save patch | `Patch_Userdata` (instanced) |
| Debug Boso unlock | `Debug_Skipper_Unlock_Boso` |
| Debug gate opening | `Debug_Skipper_Open_Gates` |

---

## Cross-arc connections

- **Race scenarios** (in scenarios catalog) → race-winning unlocks **Race Ship Handover** in Epilogue
- **Research arc** → unlocks Elite Sport / Kestrel Sport → tied to Race Ship Handover
- **Epilogue** → unlocks Boso Ta at HQ (cross-DLC: Boso also features in Cradle of Humanity content)
- **Epilogue gate openings** → may affect access to other DLC sectors

## Related

- [Timelines arcs overview](/vanilla-content/missions/timelines-arcs/)
- [Scenario Hub](/vanilla-content/missions/timelines-arcs/scenario-hub/) — orchestrator
- [Scenarios catalog](/vanilla-content/missions/timelines-arcs/scenarios-catalog/) — 20+ scenarios (including Race)
- [Boss + epic scenarios](/vanilla-content/missions/timelines-arcs/boss-scenarios/) — boss battles + Refugees
- [Wiki: DLC handling](/wiki/dlc-handling/) — Timelines required
- [Tides of Avarice → Cypher](/vanilla-content/missions/tides-arcs/cypher/) — also uses `_Reasearch` typo pattern

---

*The Abandoned Ships research arc + Epilogue close out Timelines content. Note the vanilla typo `Reasearch` — modders must match it exactly when referencing these cues.*

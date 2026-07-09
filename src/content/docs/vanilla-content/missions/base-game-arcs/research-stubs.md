---
title: Embassy + Xenon Equipment research stubs
description: Two tiny base game research arcs (153 + 152 lines). They're stub scripts that activate other systems — Embassy office room (via Mentor Subscriptions) and Quantum Data Shard collection (Xenon equipment).
---

The two base-game research arcs `story_research_embassy.xml` (153 lines) and `story_research_xen_equipment.xml` (152 lines) are **TINY stub scripts** — together less than 310 lines. They don't contain elaborate missions; they're **event listeners** that activate other systems via the X4Ep1 Mentor Subscriptions infrastructure.

## Embassy research

**Script**: `story_research_embassy.xml` (153 lines)  
**Theme**: Activate Embassy Office Room when research unlocks

### What the script does

The script has **3 cues total**:

1. **`Patch_Userdata`** (instanced, fires on `event_game_loaded`)
   - If `ware.research_diplomacy_network.research.unlocked`, sets `userdata storystate "research_diplomacy_network" = 1`
   - Save migration for completed research

2. **`Start`** (namespace=this)
   - Conditions: `md.Setup.Start` signaled + main galaxy (`xu_ep2_universe_macro`)
   - Sets debug + character cutscene table

3. **`Check_Research_Unlocked`** (onfail=cancel)
   - Waits for `md.X4Ep1_Mentor_Subscriptions.UnlockResearch` to complete

4. **`Research_Unlocked`** 
   - When research unlocked, signals `md.X4Ep1_Mentor_Subscriptions.Manage_EmbassyOffice_Room` 
   - Cancels self (one-time activation)

### What modders need to know

This arc is **NOT** a chapter-based story. It's a **one-shot activator**:

```
Player completes diplomacy_network research at HQ
    ↓
event_cue_completed md.X4Ep1_Mentor_Subscriptions.UnlockResearch
    ↓
signal md.X4Ep1_Mentor_Subscriptions.Manage_EmbassyOffice_Room
    ↓
Embassy Office Room appears at HQ (managed by Mentor Subscriptions)
```

The actual **Embassy Office Room** mechanic lives in `md.X4Ep1_Mentor_Subscriptions` (Pirate DLC). This script is the **trigger glue** between base game research and the DLC-provided embassy.

### Mod conflict risks — Embassy research

- ❌ **Mods that disable `ware.research_diplomacy_network`** prevent activation
- ❌ **Mods that change `md.X4Ep1_Mentor_Subscriptions.Manage_EmbassyOffice_Room`** affect embassy appearance
- ⚠ **Mods adding bulk research wares** must not collide with `research_diplomacy_network`

---

## Xenon Equipment research

**Script**: `story_research_xen_equipment.xml` (152 lines)  
**Theme**: Quantum Data Shard collection + Xenon-equipment research

### Key mechanic: Quantum Data Shard

This arc tracks the player collecting a **Quantum Data Shard** (`ware.inv_quantum_data_shard`):

```xml
<cue name="Quantum_Data_Shard_Collected">
  <conditions>
    <event_inventory_added object="player.entity"/>
    <check_value value="event.param.{ware.inv_quantum_data_shard}?"/>
  </conditions>
  <actions>
    <set_value name="$QuantumDataShard" exact="1"/>
    <write_incoming_message 
        title="{30005,14100}" 
        text="{30005,14110}" 
        source="{30301,101}" 
        highpriority="true"/>
  </actions>
</cue>
```

### Mission entry: "Quantum Data Shard Discovery"

- **Cue**: `Quantum_Data_Shard_Collected`
- **In-game name**: Quantum Data Shard discovered (player inventory message)
- **Find in game**: Player collects `inv_quantum_data_shard` ware
- **What player encounters**:
  - Incoming message arrives:
    - Title text: `{30005, 14100}`
    - Body text: `{30005, 14110}`
    - Source text: `{30301, 101}`
    - **High priority** notification
  - Story state flag `$QuantumDataShard = 1` set
- **Where**: Anywhere — player discovers shard from a vault / crate / encounter
- **Reward**: Story progression flag set
- **Chains to**: Research_Unlocked (if research framework ready)

### Mission entry: "Research Unlock + Boson Notification"

- **Cue chain**: `Check_Research_Unlocked` → `Research_Unlocked`
- **In-game name**: Xenon equipment research available at HQ
- **What player encounters**:
  - After research framework ready + Quantum Shard collected
  - If player has previously met Boso Ta (`$BoronMet?`), Boso Ta gets a **ShowCharacterBoron** cutscene assignment:
    ```xml
    <set_value name="$CharacterCutsceneTable.{$Boso}" exact="table[$key = 'ShowCharacterBoron']"/>
    ```
  - Research entry at HQ unlocks
  - Standard research flow

### Mod conflict risks — Xenon Equipment

- ❌ **Mods that disable `ware.inv_quantum_data_shard`** prevent collection trigger
- ❌ **Mods that override `event_inventory_added`** affect detection
- ❌ **Mods that disable Boso Ta** affect ShowCharacterBoron cutscene path
- ⚠ **Mods adding bulk inventory items** can collide with collection detection logic
- ⚠ **Custom message systems** may collide with `write_incoming_message`

### Where to find the Quantum Data Shard

The arc itself doesn't spawn the shard — it relies on **other content** (likely vault content, crates, or specific scenario rewards) to place the shard in player inventory. Modders adding equivalent rare-item-detection arcs should follow this pattern.

---

## Combined notes

Both arcs are **trigger glue** rather than independent stories:

| Arc | Trigger | Activates |
|---|---|---|
| Embassy research | Research unlocked | Embassy Office Room (in Mentor Subscriptions) |
| Xenon equipment | Quantum Shard collected | HQ research entry + Boso Boron cutscene |

Their **tiny size** (<160 lines each) reflects this — they're "glue scripts" connecting events to systems.

## Why they exist as separate scripts

Vanilla could have embedded these in larger arcs (Welfare 1 or Diplomacy Intro), but separated them because:
- **Modular**: easier to enable/disable per content
- **Save-migration-aware**: independent `Patch_Userdata` cues
- **Conditional**: arcs may not fire (e.g., player who doesn't collect Quantum Shard never triggers Xen Equipment)

For modders adding similar trigger-glue arcs, this is the canonical pattern: **tiny dedicated script** + **event_cue_completed listener** + **signal_cue to system**.

## Related

- [Mission encyclopedia](/vanilla-content/missions/) — landscape
- [Diplomacy Intro](/vanilla-content/missions/base-game-arcs/diplomacy-intro/) — companion arc to Embassy research
- [Welfare research](/vanilla-content/missions/base-game-arcs/welfare-research/) — companion HQ research arc
- [Pirate Welfare 2](/vanilla-content/missions/pirate-arcs/welfare-2/) — uses similar research-glue pattern
- [Tides of Avarice: Cypher](/vanilla-content/missions/tides-arcs/cypher/) — also uses tiny `Research_Unlock` pattern

---

*Two tiny scripts demonstrate X4's "glue script" pattern — minimal code connecting an event to a system. When your mod adds research-triggered content, follow this pattern: small script + event listener + signal to system.*

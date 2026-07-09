---
title: Cypher research arc
description: Tiny research arc following Unbihexium ship claim. HQ research path to unlock further Tides content. Single research entry + Boso Ta mentor closure speak.
---

The **Cypher research arc** (`story_research_cypher.xml`, only 6KB) is the **smallest story script in vanilla X4** — a single research arc triggered by the player claiming the **Cypher ship** at the end of Unbihexium. It serves as a closure / epilogue research line with Boso Ta's mentor closure dialog.

- **Script**: `story_research_cypher.xml`
- **DLC**: Tides of Avarice
- **Theme**: HQ research → mentor closure speak

## Trigger

The arc activates when:
- `Cypher_Claimed` event fires (player claimed the Cypher ship from Unbihexium climax)
- `$ShipClaimed = 1` flag set

## Arc structure (compact)

```
Cypher_Claimed (player claimed Cypher ship)
    ↓
Cypher_Reasearch (ref Research_Unlock library)
    ↓
Check_Research_Unlocked → Research_Unlocked
    ↓
Research_Unlocked_Wait → Unhide_Research (1min polling) — research entry becomes visible
    ↓
Research_Entry_Selected (instantiated)
    ↓
Research_Finished (instantiated)
    ↓
Research_Finished_LastMentorSpeak (10s polling)
    ↓
Research_Finished_Speak_Ref_v2 (refs LIB_Dialog.Speak_Actor)
    ↓
Boso Ta delivers closing mentor speak
```

## Mission entries

### "Cypher Research Unlock"

- **Cue**: `Cypher_Claimed` → `Cypher_Reasearch` → `Check_Research_Unlocked` → `Research_Unlocked`
- **In-game name**: Research entry available at HQ
- **Path/Chapter**: Cypher research (entry)
- **Find in game**: HQ research menu, after Unbihexium Ch3 complete
- **Prerequisites**: Cypher ship claimed (story state from Unbihexium)
- **What player encounters**:
  - **Research_Unlocked_Wait** → wait state for research visibility
  - **Unhide_Research** (1-minute polling) — periodically checks if research should appear
  - Player sees new research entry in HQ menu
- **Where**: Player HQ research menu
- **Reward**: Research entry available
- **Code reference**: `story_research_cypher.xml` `Cypher_Claimed` block

### "Research Selection"

- **Cue**: `Research_Entry_Selected`
- **In-game name**: Begin Cypher research
- **Path/Chapter**: Cypher research (Selection)
- **Find in game**: Player selects research at HQ
- **What player encounters**:
  - Research starts (instantiated cue per session)
  - Research countdown begins
- **Reward**: Research underway
- **Chains to**: `Research_Finished`
- **Code reference**: `story_research_cypher.xml` `Research_Entry_Selected`

### "Research Finish + Mentor Closure Speak"

- **Cue**: `Research_Finished` → `Research_Finished_LastMentorSpeak` (10s) → `Research_Finished_Speak_Ref_v2`
- **In-game name**: Research complete; Boso Ta mentor closure
- **Path/Chapter**: Cypher research (climax)
- **Find in game**: Auto-fires when research completes
- **What player encounters**:
  - Research completion event
  - **Mentor closure system**:
    - `Research_Finished_LastMentorSpeak` polls every 10s
    - When conditions met, `Research_Finished_Speak_Ref_v2` (refs `LIB_Dialog.Speak_Actor`) fires
    - **Boso Ta** delivers a **closing mentor speech**
  - The "Last Mentor Speak" naming suggests this is **Boso Ta's last mentor recognition** in vanilla DLC content
- **Where**: Wherever player is when polling triggers
- **NPCs involved**: Boso Ta
- **Reward**: 
  - Research-related unlocks (precise effects TBD per text page lookup)
  - **Mentor narrative closure** — Boso Ta acknowledges player's mentor arc completion
- **Code reference**: `story_research_cypher.xml` `Research_Finished*`

### Mod conflict risks — Cypher

- ❌ **Mods that disable Boso Ta** prevent mentor closure speech
- ❌ **Mods that change HQ research mechanics** break unlock detection
- ❌ **Mods that change LIB_Dialog.Speak_Actor** affect speak delivery
- ⚠ **Mods adding bulk HQ research** may collide with `Unhide_Research` polling

---

## Why Cypher is special

Cypher is **the smallest story arc in vanilla** but **closes a longer narrative thread**:
- Tides of Avarice introduced player to espionage + mentor relationships
- Unbihexium Ch3 ended with `Ship_Claimed` state
- Cypher research arc delivers the **final mentor recognition** for that journey
- The "Last Mentor Speak" name implies this is canonically Boso's farewell to player as student

For modders: this is the **shortest-but-complete vanilla story arc pattern** — a useful template for short follow-up arcs in mod content.

## Code references

| Concern | Cue |
|---|---|
| Trigger event | `Cypher_Claimed` |
| Research_Unlock library ref | `Cypher_Reasearch` (note: vanilla typo "Reasearch") |
| Research visibility | `Research_Unlocked_Wait` → `Unhide_Research` |
| Research selection | `Research_Entry_Selected` (instantiated) |
| Research finish | `Research_Finished` (instantiated) |
| Mentor closure poll | `Research_Finished_LastMentorSpeak` (10s) |
| Mentor closure speak | `Research_Finished_Speak_Ref_v2` (refs LIB_Dialog.Speak_Actor) |

**Vanilla typo note**: The cue is literally named `Cypher_Reasearch` (with "Reasearch" instead of "Research") — modders referencing this cue must use the misspelled form.

## Related

- [Tides arcs overview](/vanilla-content/missions/tides-arcs/)
- [Unbihexium arc](/vanilla-content/missions/tides-arcs/unbihexium/) — preceding arc (triggers Cypher)
- [Wiki: DLC handling](/wiki/dlc-handling/) — Tides of Avarice required

---

*Cypher is the shortest vanilla story arc — but its presence as a "mentor closure" demonstrates that **even small arcs deserve narrative resolution**. The pattern is useful template for mod authors who want compact follow-up arcs without rebuilding the full HQ research framework.*

---
title: Unbihexium arc
description: 250KB Tides of Avarice main story. Espionage mission across 3 chapters — Encounter / Boso Call (Data Vault) / Dal Call (Final Escort). Sobert agent unlock + Unbihexium element.
---

The **Unbihexium arc** (`story_unbihexium.xml`, 250KB) is the **Tides of Avarice main story**. Named after **Unbihexium** (element 126 — a hypothetical superheavy element, symbolic of the rare/valuable resource at stake), the arc is an **espionage mission across 3 chapters** involving the player's Sobert cover identity, encounters with a Courier antagonist, a Data Vault retrieval, and a final escort mission.

- **Script**: `story_unbihexium.xml`
- **DLC**: Tides of Avarice (`ego_dlc_mini_02`)
- **Text page**: 30255
- **Chapters**: Ch1 (Encounter) → Ch2 (Boso Call + Data Vault) → Ch3 (Dal Call + Final Escort)

## Initial setup phase

Before Chapter 1, several setup elements must complete:

| Cue | Purpose |
|---|---|
| `Setup_Locations` | Sector references (7 sectors) |
| `Setup_DataVault` | Data Vault object placement |
| `Data_Vault_Seen` (+ `_Complete`) | Track player discovery of Data Vault |
| `Setup_Characters` | 6 character setups |
| `Setup_Sobert_Fake_Identity` | Player cover identity initialized |
| `Update_Paranid_Coverfaction` (+ `_Activated`) | Cover-faction relations setup |
| `Unlock_Sobert_Agent` | Sobert agent capabilities unlocked |
| `Recruitment_Sobert` + `Placement_Sobert` | Recruit Sobert as agent |
| `Agents_Unlocked` (+ `_Check`, `_Event`) | Agent system unlock |
| `Debug_Unlock_Embassy` | DEBUG: skip to embassy unlock |
| `Check_For_Diplomatic_Mentor_Ending` | Diplomatic mentor ending check |

The setup establishes the **espionage gameplay framework** — cover identity, agent recruitment, diplomatic states.

## Chapter 1 — Encounter

Player encounters a mysterious Courier ship + Squadron in combat.

### Mission entry: "Hostile Encounter"

- **Cue**: `Ch1_Encounter` / `Ch1_Encounter_Force`
- **In-game name**: Encounter with Courier squadron
- **Path/Chapter**: Unbihexium Ch1
- **Find in game**: Active after Tides DLC initialization complete
- **Prerequisites**: DLC ready; Sobert identity setup
- **What player encounters**:
  - **Mission offer**:
    - `Ch1_1_Create_Offer` — main offer creation (+ `_Signal` instanced for repeated signals)
    - `Ch1_AutoAccept` — auto-accept path
    - `Ch1_AcceptMission_Signal` + `Ch1_AcceptMission` — manual accept paths
  - **Objective 1 — Talk + Approach toggling**:
    - `Ch1_Objective1_Toggle` — toggle between talk/approach objectives
    - `Ch1_Objective1_Toggle_Talk_Ref` (refs `ApproachObject_Handler`) — talk-objective approach detection
    - `Ch1_Objective1_Toggle_Approach_Ref` (refs `ApproachObject_Handler`) — approach-objective detection
    - `Ch1_Objective1_Toggle_Talk` / `_Approach` — instantiated per toggle
    - `Ch1_Objective_Toggle_Done` — toggle completed
  - **Objective sequence**:
    - `Ch1_Objective_Fight` — combat objective
    - `Ch1_Objective_TalkTo` — talk objective
    - `Ch1_Objective_Find_Relief` — find Relief NPC
  - **Squadron Fight**:
    - `Ch1_1_SquadronFight` — main squadron combat
    - `Ch1_1_Create_Stranded_Ship` — spawn stranded ship named **"Berenice"** (page 30255, line 201) — story prop / reward
- **Where**: Tides-specific sector (likely cluster_40 or cluster_41)
- **NPCs involved**: Courier (antagonist), Squadron Leader (combat), Relief (rescue target)
- **Reward**: Encounter resolved; Chapter 2 unlocked
- **Chains to**: `Ch2_2_Boso_Call` (Chapter 2 entry)
- **Code reference**: `story_unbihexium.xml` `Ch1_Encounter*` block

### Mod conflict risks — Ch1

- ❌ **Mods that change Outlaw faction hostility** affect Courier squadron behavior
- ❌ **Combat-rebalance mods** affect squadron fight difficulty
- ❌ **Mods that affect `ApproachObject_Handler`** break objective toggling
- ⚠ **Stranded-ship encounter mods** can collide with Ch1_1_Create_Stranded_Ship

---

## Chapter 2 — Boso Call + Data Vault

Boso Ta calls player; player retrieves data from Data Vault.

### Mission entry: "Boso Ta's Call (Ch2)"

- **Cue**: `Ch2_2_Boso_Call`
- **In-game name**: Boso Ta comm
- **Path/Chapter**: Unbihexium Ch2 (entry)
- **Find in game**: After Ch1 completes
- **What player encounters**:
  - Boso Ta initiates comm call
  - Mission briefing for Data Vault retrieval
- **NPCs involved**: Boso Ta
- **Chains to**: `Ch2_Mission`
- **Code reference**: `story_unbihexium.xml` `Ch2_2_Boso_Call`

### Mission entry: "Data Vault Retrieval + Sobert Conversation"

- **Cue**: `Ch2_2_Data_Vault` + `Ch2_1_Conversation` (+ Sobert variant)
- **In-game name**: Retrieve from Data Vault — talk to contacts using Sobert identity
- **Path/Chapter**: Unbihexium Ch2 (main)
- **Find in game**: After Boso call
- **What player encounters**:
  - **Relief Ship setup**: `Ch2_Relief_Ship` / `Ch2_Relief_Ship_Force`
  - **Conversation chain**:
    - `Ch2_Conversation_Started` — conversation begins
    - `Ch2_Conversation_Start` (instanced) — start per session
    - `Ch2_Conversation_Intro_Choices` (instanced) — player choices
    - `Ch2_Conversation_Sobert` (instanced) — Sobert identity dialog branch
    - `Ch2_Conversation_Sobert_Complete` — Sobert path complete
  - **Data Vault retrieval**:
    - `Ch2_2_Data_Vault` — main vault interaction
    - `Ch2_2_Dal_Call` — Dal Busta secondary call during vault
- **Return phase**:
  - `Ch2_3_Return` — return to home
  - `Ch2_3_Await_Call` — wait for next call
  - `Ch2_3_Call_Return` (1s interval) — return-call polling
  - `Ch2_3_Call_Escort` — escort follow-up
  - `Ch2_3_Order_MoveTo` — move-to order
  - `Ch2_3_Call_Idle_Chatter` — idle chatter during travel
    - `Ch2_3_Dal_Call` — Dal Busta cue during chatter
    - `Ch2_3_Boso_Call_Unbi` — Boso "Unbihexium" callout
  - **Approach stranded ships**:
    - `Ch2_3_ApproachingStranded_1_Ref` (refs ApproachObject_Handler)
    - `Ch2_3_ApproachingStranded_2_Ref` (refs ApproachObject_Handler)
- **Where**: Data Vault location + Sobert contacts
- **NPCs involved**: Boso Ta, Dal Busta, Sobert contacts, Relief, Courier (dismissed at end via `Ch2_Dismiss_CourierActor`)
- **Reward**: Data acquired; Chapter 3 unlocked
- **Chains to**: `Ch3_Final_Escort`
- **Code reference**: `story_unbihexium.xml` `Ch2_*` block

### Mod conflict risks — Ch2

- ❌ **Mods that change Data Vault macro** break vault interaction
- ❌ **Mods that disable conversations** affect Sobert dialog branches
- ⚠ **Cover-faction interference** breaks Sobert path

---

## Chapter 3 — Dal Call + Final Escort

Final chapter: escort mission with Sobert + Relief, climactic encounter.

### Mission entry: "Dal Call + Final Escort"

- **Cue**: `Ch3_2_Dal_Call` → `Ch3_Final_Escort` (+ `_Force`)
- **In-game name**: Final escort + climax
- **Path/Chapter**: Unbihexium Ch3 (climax)
- **Find in game**: After Ch2 complete
- **What player encounters**:
  - Dal Busta call to start Ch3
  - **Final Escort mission** (`Ch3_Mission`):
    - `Ch3_1_SobertReliefShip_Cutscenes` — Sobert + Relief ship cutscenes
    - `Ch3_1_Create_SpaceSuit` — spacesuit EVA segment
  - Combat / escort climax
- **Where**: Final mission sectors (likely Tides-specific)
- **NPCs involved**: Dal Busta, Sobert, Relief, climactic enemies
- **Reward**: Arc complete; Sobert as permanent agent; Embassy unlocked
- **Chains to**: End of arc → unlocks `Cypher_Claimed` event in [Cypher research arc](/vanilla-content/missions/tides-arcs/cypher/)
- **Code reference**: `story_unbihexium.xml` `Ch3_*` block

### Mod conflict risks — Ch3

- ❌ **Mods that disable spacesuit EVA** break Ch3 spacesuit segment
- ❌ **Mods that change agent unlock paths** affect Sobert permanence

---

## Arc completion summary

A completed Unbihexium arc yields:

- **Sobert as permanent agent** for player diplomacy
- **Embassy unlocked** (precursor to Kingdom End embassy system)
- **Diplomatic Mentor ending** triggered (mentor recognition)
- Faction state advances for cover-faction-related arcs
- Story state set; `Cypher_Claimed` event eligible to fire
- [Cypher research arc](/vanilla-content/missions/tides-arcs/cypher/) becomes available

## Code references

| Concern | Cue |
|---|---|
| Setup characters | `Setup_Characters` block |
| Sobert cover identity | `Setup_Sobert_Fake_Identity` |
| Agent unlock | `Unlock_Sobert_Agent`, `Agents_Unlocked` |
| Ch1 Encounter | `Ch1_Encounter*` |
| Ch1 Objective toggle | `Ch1_Objective1_Toggle*` |
| Ch1 Squadron fight | `Ch1_1_SquadronFight` |
| Ch2 Boso call | `Ch2_2_Boso_Call` |
| Ch2 Data Vault | `Ch2_2_Data_Vault` |
| Ch2 Sobert conversation | `Ch2_Conversation_Sobert*` |
| Ch2 Return + chatter | `Ch2_3_*` block |
| Ch3 Dal call | `Ch3_2_Dal_Call` |
| Ch3 Final escort | `Ch3_Final_Escort*` |
| Ch3 Spacesuit segment | `Ch3_1_Create_SpaceSuit` |

## Related

- [Tides arcs overview](/vanilla-content/missions/tides-arcs/)
- [Cypher research](/vanilla-content/missions/tides-arcs/cypher/) — research follow-up after Unbihexium claimed
- [Mission encyclopedia](/vanilla-content/missions/) — landscape

---

*Unbihexium is X4's first espionage-narrative arc with cover identities, fake-faction relations, and agent recruitment. Your mod's interference with diplomacy mechanics, cover factions, or Sobert agent system breaks the 3-chapter mission chain.*

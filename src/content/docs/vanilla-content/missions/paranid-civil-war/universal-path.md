---
title: Paranid Civil War — Universal path
description: All Uni_1/Uni_2/Uni_3 missions. Mediator route through the Paranid schism. Per-mission entries with vanilla cue refs, in-game text refs, mod conflict risks.
---

The **Universal path** (Uni) is the **mediator route** through the Paranid Civil War. The player works to reunify the Holy Order with the Godrealm rather than picking a side. Three chapters, ~12 individual missions.

For the arc overview see [Paranid Civil War overview](/vanilla-content/missions/paranid-civil-war/). For the alternate route see [Escalation path](/vanilla-content/missions/paranid-civil-war/escalation-path/).

## Chapter 1 — The Sink (mediator response)

Player encounters "the Sink" event and responds with mediation rather than escalation. Chapter 1 covers initial response, fleet delivery to mediator forces, assassination of a Paranid Legate antagonist, and the first diplomatic relation shift.

### Mission entry: "Dal Busta at his Desk"

- **Cue**: `Uni_1_Dal_Desk`
- **In-game name**: Background event — no UI mission yet
- **Path/Chapter**: Universal Chapter 1
- **Find in game**: After player accepted Prologue, Dal Busta starts sitting at his desk waiting
- **Prerequisites**:
  - Prerequisites complete (player accepted prologue)
  - Player **NOT** at HQ context (`not player.entity.hascontext.{$HQ}`)
- **What player encounters**:
  - 5-minute waiting timer (`checktime="player.age + 5min"`)
  - 60-second polling interval
  - When timer elapses + condition met, fires `Setup_Dal_Desk_Busy`
- **Where**: Dal Busta's location (typically a Paranid station — vanilla code anchors his location)
- **NPCs involved**: Dal Busta
- **Reward**: None — pacing cue
- **Chains to**: `Setup_Dal_Desk_Busy` → next conversation trigger
- **Code reference**: `story_paranid.xml` `Uni_1_Dal_Desk`

#### Mod conflict risks

- ⚠ **Mods that move Dal Busta to HQ** invert the condition — arc stalls
- ⚠ **Mods with high HQ retention rate** (player rarely leaves HQ) extend this wait indefinitely

---

### Mission entry: "Sink Explanation"

- **Cue**: `Uni_1_Sink_Explanation`
- **In-game name**: Conversation with Dal Busta about "The Sink"
- **Path/Chapter**: Universal Chapter 1
- **Find in game**: Conversation event triggered after `Uni_1_Dal_Desk` setup completes
- **Prerequisites**: `Uni_1_Sink_Explanation` cue signaled by prior cue chain
- **What player encounters**:
  - Dal Busta speaks (text line `30220806`: "That's where we come in.")
  - Multi-section conversation explaining "The Sink" (the Cipher/sector_25_sector002 anomaly)
  - Player can confirm intent or cancel
- **Player choices**:
  - **Confirm** → progresses to `Uni_1_Sink_Explanation_Section_Confirm` → fires `Uni_1_Deliver_Fleet`
  - **Cancel** → returns to wait state
- **Where**: Conversation context (typically remote comm)
- **NPCs involved**: Dal Busta
- **Reward**: 
  - On version 2+ save migration: Paint mod ware `paintmod_0112` × 10 (`{30004,10001}` reward text)
- **Chains to**: `Uni_1_Deliver_Fleet`
- **Code reference**: `story_paranid.xml` `Uni_1_Sink_Explanation` + section cues

#### Mod conflict risks

- ❌ **Mods that ware-rebalance `paintmod_0112`** affect the reward
- ⚠ **Conversation-disabling mods** can hang this stage

---

### Mission entry: "Deliver Fleet to Mediator Forces"

- **Cue**: `Uni_1_Deliver_Fleet_Mission`
- **In-game name**: Mediator Fleet Delivery
- **Path/Chapter**: Universal Chapter 1
- **Find in game**: Becomes active mission after Sink Explanation confirmed
- **Prerequisites**: Player confirmed Sink Explanation
- **What player encounters**:
  - Mission requires delivering a fleet of ships to mediator-aligned location
  - Reference library: `md.RML_Deliver_Fleet.DeliverFleet`
  - **Cost**: ~200-250 million credits (vanilla code comment in `Uni_1_Deliver_Fleet_Setup`)
- **Objectives**:
  - Acquire required ships (player must buy/build)
  - Deliver to specified destination
  - Mission check periodically verifies delivery progress
- **Where**: Delivery destination — Paranid space (specific location set in setup)
- **NPCs involved**: Dal Busta (post-delivery dialogue line `30220985`)
- **Reward**: Mediator-faction relation boost + arc progression
- **Chains to**: `Uni_1_Deliver_Fleet_Mission_Completed` → `Uni_1_Assassinate_Legate`
- **Code reference**: `story_paranid.xml` `Uni_1_Deliver_Fleet_Mission` + `Uni_1_Deliver_Fleet_Setup`

#### Mod conflict risks

- ❌ **Mods that cap player credits below 250M** make this mission unaffordable
- ❌ **Mods affecting `RML_Deliver_Fleet` library** affect delivery verification
- ⚠ **Mods that change ship macros for Paranid** may break the fleet composition requirements

---

### Mission entry: "Assassinate the Legate"

- **Cue**: `Uni_1_Assassinate_Legate_Mission`
- **In-game name**: Assassination — Xatenmanckett's Flagship
- **Path/Chapter**: Universal Chapter 1
- **Find in game**: Becomes active after fleet delivered
- **Prerequisites**: `Uni_1_Deliver_Fleet` completed
- **What player encounters**:
  - Target: **Xatenmanckett's flagship** — a Paranid Phoenix-class carrier (`ship_par_xl_carrier_02_a_macro`)
  - Ship spawned with elite Paranid pilot + crew (`paranid_elite_military_crew`)
  - Ship is **commandeerable=false** but **capturable=true** — player can board, not just hack-takeover
  - Located in `$LegateSector` (set by `Uni_1_Assassinate_Legate_Setup`)
  - Mid-mission: Xat attack dialog (text line `30220801`)
  - Almost-dead trigger: arrival of Xat fleet support
- **Objectives**:
  - Find Xatenmanckett's flagship
  - Destroy or capture it
- **Where**: Specific Paranid sector — `$LegateSector` (assigned at runtime)
- **NPCs involved**: 
  - Xatenmanckett (Legate — target NPC)
  - Xat (combatant, arrives in support)
  - Dal Busta (post-kill dialog line `30220810`)
- **Reward**: Major Holy Order relation boost; story progression to Chapter 2
- **Chains to**: `Uni_1_Diplomatic_Change` → Chapter 1 wrap-up → Chapter 2 Duke Call
- **Code reference**: `story_paranid.xml` `Uni_1_Assassinate_Legate` (full block including setup, dialog, completion)

#### Mod conflict risks

- ❌ **Mods that re-macro `ship_par_xl_carrier_02_a_macro`** break the flagship spawn
- ❌ **Mods that make `tag.elitepilot` Paranid pilots not exist** break pilot selection
- ❌ **Mods that disable `paranid_elite_military_crew`** break crew spawning
- ⚠ **Boarding overhaul mods** affect the capture-vs-destroy choice
- ⚠ **Mods adding extra Paranid elites in the sector** may interfere with target identification

---

### Mission entry: "Diplomatic Change — Chapter 1 conclusion"

- **Cue**: `Uni_1_Diplomatic_Change`
- **In-game name**: Diplomatic Reset (not a player-facing mission, but a state change)
- **Path/Chapter**: Universal Chapter 1 (conclusion)
- **Find in game**: Auto-fires after Assassinate Legate complete
- **Prerequisites**: Legate killed/captured + arc state advanced
- **What player encounters**:
  - Faction relations shift — Holy Order rep increases significantly
  - Godrealm Paranid rep may decrease modestly
  - UI shows relation-change notifications
- **Where**: Auto-applied (no physical location)
- **NPCs involved**: None (state change)
- **Reward**: Permanent relation shifts
- **Chains to**: `Uni_1_Mediation_Fleet_Patrol` (Chapter 1 epilogue) → Chapter 2
- **Code reference**: `story_paranid.xml` `Uni_1_Diplomatic_Change`

#### Mod conflict risks

- ⚠ **Mods that lock relation values** may prevent the shift, hanging chapter advance

---

### Mission entry: "Mediation Fleet Patrol" (Chapter 1 epilogue)

- **Cue**: `Uni_1_Mediation_Fleet_Patrol`
- **In-game name**: Mediation Fleet ongoing patrol
- **Path/Chapter**: Universal Chapter 1 (epilogue / bridge to Chapter 2)
- **Find in game**: Auto-fires after diplomatic change
- **Prerequisites**: Chapter 1 main missions complete
- **What player encounters**:
  - Player's delivered mediation fleet now patrols the contested region
  - Periodic check (`Uni_1_Mediation_Fleet_Patrol_Check`) ensures fleet maintains assignment
  - Builds toward Chapter 2 prerequisites
- **Where**: Mediation region (Paranid contested space)
- **NPCs involved**: Player fleet ships
- **Reward**: Ongoing rep maintenance
- **Chains to**: Chapter 2 trigger (Sinks_Unification_Stage_2.$RunMission becomes true)
- **Code reference**: `story_paranid.xml` `Uni_1_Mediation_Fleet_Patrol`

#### Mod conflict risks

- ❌ **Mods that disrupt fleet patrolling behavior** may cause fleet to abandon area, breaking Chapter 2 trigger
- ⚠ **Combat-rebalance mods** may cause patrol fleet losses, breaking patrol checks

---

## Chapter 2 — Duke / Trinity courtship

Player meets Duke (Trinity faction leader) and helps establish a Palace stronghold in Trinity space. Two sub-arcs: buy a blueprint OR build the palace yourself.

### Mission entry: "Duke's Call"

- **Cue**: `Uni_2_Duke_Call`
- **In-game name**: Duke comm call
- **Path/Chapter**: Universal Chapter 2 (entry)
- **Find in game**: Comm call from Duke after Chapter 1 epilogue completes
- **Prerequisites**: 
  - `Sinks_Unification_Stage_2.$RunMission` is true (set by Chapter 1 conclusion)
  - Custom gamestart can override interval: `$DukeCallInterval = if $story_paranid_uni_1 then 20s else 5min`
- **What player encounters**:
  - Duke initiates comm
  - Multi-section conversation establishing Chapter 2 stakes
- **Where**: Anywhere (comm call)
- **NPCs involved**: Duke
- **Reward**: Chapter 2 unlocked
- **Chains to**: `Uni_2_Palace_Foundation`
- **Code reference**: `story_paranid.xml` `Uni_2_Duke_Call`

#### Mod conflict risks

- ❌ **Mods that despawn Duke** block Chapter 2 entirely
- ⚠ **Custom gamestart mods setting `$story_paranid_uni_1`** trigger this quickly — verify intended behavior

---

### Mission entry: "Palace Foundation"

- **Cue**: `Uni_2_Palace_Foundation`
- **In-game name**: Build/Acquire Palace at Pious Mists II
- **Path/Chapter**: Universal Chapter 2 (main)
- **Find in game**: Active mission after Duke's Call
- **Prerequisites**: Duke's Call accepted
- **What player encounters**:
  - Mission location: **Pious Mists II** (`cluster_22_sector001`) — Trinity homeworld sector
  - Plot position created automatically (near ecliptic — `y=0m`)
  - Two paths for completion:
    1. **Offer Blueprint** — Duke offers a station blueprint for purchase (sub-cue `Uni_2_Palace_Foundation_Offer_Blueprint`)
    2. **Build Station** — Player builds the palace directly (sub-cue `Uni_2_Palace_Foundation_Build_Station_Complete`)
- **Cost**:
  - Build path: ~25 million credits (without blueprints)
  - Buy-then-build: ~525 million credits (with blueprints)
- **Where**: `cluster_22_sector001` (Pious Mists II / Trinity Sanctum)
- **NPCs involved**: Duke (offers blueprint or oversight)
- **Reward**: Palace built, Trinity-area presence established, Chapter 3 unlocked
- **Chains to**: Chapter 3 (Boso Call)
- **Code reference**: `story_paranid.xml` `Uni_2_Palace_Foundation` + sub-cues

#### Mod conflict risks

- ❌ **Mods that change `cluster_22_sector001` owner** or accessibility break Palace Foundation
- ❌ **Mods that affect station blueprint economy** affect cost
- ❌ **Trinity faction destruction mods** make Duke's involvement impossible
- ⚠ **Mods using Pious Mists II for other content** collide with plot reservation

---

## Chapter 3 — Final mediation

Player completes the reunification arc by delivering inventory + resources for the diplomatic ceremony.

### Mission entry: "Boso Ta's Call"

- **Cue**: `Uni_3_Boso_Call`
- **In-game name**: Boso Ta comm
- **Path/Chapter**: Universal Chapter 3 (entry)
- **Find in game**: Comm call from Boso Ta after Chapter 2 complete
- **Prerequisites**:
  - `Sinks_Unification_Stage_3.$RunMission` is true
  - Custom gamestart can override: `$BosoCallInterval = if $story_paranid_uni_2 then 25s else 5min`
- **What player encounters**:
  - Boso Ta calls player from HQ
  - Conversation about final ceremony preparations
- **Where**: Anywhere (comm)
- **NPCs involved**: Boso Ta
- **Reward**: Chapter 3 unlocked
- **Chains to**: `Uni_3_Deliver_Inventory`
- **Code reference**: `story_paranid.xml` `Uni_3_Boso_Call`

#### Mod conflict risks

- ❌ **Mods that move/despawn Boso Ta** block Chapter 3
- ⚠ **HQ-replacement mods** may break Boso Ta context

---

### Mission entry: "Deliver Inventory"

- **Cue**: `Uni_3_Deliver_Inventory`
- **In-game name**: Inventory delivery for ceremony
- **Path/Chapter**: Universal Chapter 3 (main mission 1)
- **Find in game**: Active after Boso's Call
- **Prerequisites**: Boso Call accepted
- **What player encounters**:
  - Player delivers specific inventory items to ceremony location
  - Tracking: `Uni_3_Deliver_Inventory_Ref`
  - Tracks via `Uni_3_Deliver_Inventory_Credits_Conversation`
- **Where**: Ceremony location (Pious Mists II / Trinity area)
- **NPCs involved**: Boso Ta, Duke, recipient NPCs
- **Reward**: Credits + arc progression
- **Chains to**: `Uni_3_Deliver_Resources`
- **Code reference**: `story_paranid.xml` `Uni_3_Deliver_Inventory`

---

### Mission entry: "Deliver Resources"

- **Cue**: `Uni_3_Deliver_Resources`
- **In-game name**: Resource delivery for ceremony
- **Path/Chapter**: Universal Chapter 3 (main mission 2)
- **Find in game**: Active after Inventory delivered
- **Prerequisites**: `Uni_3_Deliver_Inventory` complete
- **What player encounters**:
  - Player delivers wares to ceremony station
  - Station preparation: `Uni_3_Deliver_Resources_Prepare_Station`
  - Tracking: `Uni_3_Deliver_Resources_Ref`
- **Where**: Ceremony station location
- **NPCs involved**: Boso Ta, station crew
- **Reward**: Arc completion approaches
- **Chains to**: `Uni_3_Diplomatic_Change` (arc conclusion)
- **Code reference**: `story_paranid.xml` `Uni_3_Deliver_Resources`

---

### Mission entry: "Final Diplomatic Change" (arc conclusion)

- **Cue**: `Uni_3_Diplomatic_Change`
- **In-game name**: Reunification finalized
- **Path/Chapter**: Universal Chapter 3 (conclusion)
- **Find in game**: Auto-fires after Deliver Resources complete
- **Prerequisites**: All Chapter 3 missions complete
- **What player encounters**:
  - Major faction relation shifts — Paranid + Holy Order reconciled
  - Story state advances to "Universal path complete"
  - Custom gamestart flag `gamestart.storystate.story_paranid_uni_3` honored
- **Reward**:
  - Permanent relation gains with Holy Order + Godrealm Paranid
  - "Mediator of the Paranid" implicit role
  - Arc concluded — no further Paranid Civil War missions
- **Chains to**: End of arc
- **Code reference**: `story_paranid.xml` `Uni_3_Diplomatic_Change`

#### Mod conflict risks (arc conclusion)

- ⚠ **Mods that lock Holy Order + Paranid relations** prevent final reconciliation
- ⚠ **Save-state mods that re-trigger story arcs** must respect `$story_paranid_uni_3` flag

---

## Path completion summary

A completed Universal path yields:

- Trinity Palace built at Pious Mists II (`cluster_22_sector001`)
- Mediator Fleet active in the contested region
- Significant relation gains with both Paranid factions
- Faction state set to `story_paranid_uni_3 = true`
- Trinity faction recognizes player as mediator
- Arc concluded; no further Paranid Civil War content available

## Related

- [Paranid Civil War overview](/vanilla-content/missions/paranid-civil-war/)
- [Prologue](/vanilla-content/missions/paranid-civil-war/prologue/)
- [Escalation path](/vanilla-content/missions/paranid-civil-war/escalation-path/) — alternate route
- [Mission encyclopedia](/vanilla-content/missions/) — other vanilla arcs
- [Mod-conflict checklist](/vanilla-content/mod-conflict-checklist/)

---

*The Universal path is the diplomatic resolution. ~12 missions, 250M-525M credit investment minimum, 7+ hours of play. Your mod's relation changes can short-circuit it; your mod's economy changes can make it unaffordable; your mod's NPC spawning can starve it of slots.*

---
title: Paranid Civil War — Escalation path
description: All Esc_1/Esc_2/Esc_3 missions. Military escalator route. Per-mission entries with vanilla cue refs, in-game text refs, mod conflict risks.
---

The **Escalation path** (Esc) is the **military escalator route** through the Paranid Civil War. The player picks a side and drives the conflict to military resolution rather than diplomatic reconciliation. Three chapters, ~14 individual missions.

For the arc overview see [Paranid Civil War overview](/vanilla-content/missions/paranid-civil-war/). For the alternate route see [Universal path](/vanilla-content/missions/paranid-civil-war/universal-path/).

## Chapter 1 — The Sink (escalator response)

Player encounters "the Sink" event and responds with escalation. Chapter 1 covers initial response, pirate disruption + flagship capture, fleet delivery, and Chapter 1 conclusion.

### Mission entry: "Dal Busta at his Desk" (Esc variant)

- **Cue**: `Esc_1_Dal_Desk`
- **In-game name**: Background pacing
- **Path/Chapter**: Escalation Chapter 1
- **Find in game**: After prologue accepted with escalation-inclined choices
- **Prerequisites**:
  - Prerequisites accepted
  - Player NOT at HQ context
- **What player encounters**: Same wait-then-trigger pattern as Universal variant
- **Where**: Dal Busta's location
- **NPCs involved**: Dal Busta
- **Reward**: None (pacing)
- **Chains to**: Sink Explanation (Esc)
- **Code reference**: `story_paranid.xml` `Esc_1_Dal_Desk`

#### Mod conflict risks
Same as Universal Dal Desk variant.

---

### Mission entry: "Sink Explanation" (escalation response)

- **Cue**: `Esc_1_Sink_Explanation_Section_Confirm`
- **In-game name**: Conversation — escalation response to The Sink
- **Path/Chapter**: Escalation Chapter 1
- **Find in game**: Conversation after Esc Dal Desk
- **Prerequisites**: `Esc_1_Dal_Desk` setup complete
- **What player encounters**:
  - Dal Busta presents the Sink situation
  - Player chooses escalation response (commits to Esc path)
- **Player choices**:
  - **Confirm escalation** → fires `Esc_1_Disperse_Pirates_Mission`
  - Cancel → return to wait
- **Where**: Conversation context
- **NPCs involved**: Dal Busta
- **Reward**: Path commitment to Escalation
- **Chains to**: `Esc_1_Disperse_Pirates_Mission` + `Esc_1_Insurgence_Fleet_Orders`
- **Code reference**: `story_paranid.xml` `Esc_1_Sink_Explanation_*`

---

### Mission entry: "Disperse Pirates — Flagship Capture"

- **Cue**: `Esc_1_Disperse_Pirates_Mission`
- **In-game name**: Disperse Pirate Forces (Briefing description visible in code)
- **Path/Chapter**: Escalation Chapter 1
- **Find in game**: Active mission after Sink Explanation escalation
- **Prerequisites**: Sink Explanation confirmed (escalation)
- **What player encounters**:
  - Mission description includes:
    - Player-gender-aware briefing variant (text `{30220, 9010}` female / `{30220, 9009}` male)
    - "Diplo and Eco Prediction" addendum (text `{30220, 8015}` + `{30220, 9007}` + `{30220, 9008}`)
  - Disperse pirate fleet activities
  - Includes a **flagship handover** sub-objective — title text `Esc_1_Disperse_Pirates_Mission_Handover_Flagship_Title`
  - Ship-captured sub-cue (`Esc_1_Disperse_Pirates_Mission_Ship_Captured`)
  - Surrender sub-cue (`Esc_1_Disperse_Pirates_Mission_Surrender`)
- **Objectives**:
  - Engage pirate fleet
  - Capture flagship (either via combat surrender or boarding)
  - Optional: drive enemy fleet to surrender
- **Where**: Pirate hostile sector (set by setup cue)
- **NPCs involved**: Pirate flagship captain, escort fleet
- **Reward**: Captured flagship, story progression
- **Chains to**: `Esc_1_Deliver_Fleet_Mission`
- **Code reference**: `story_paranid.xml` `Esc_1_Disperse_Pirates_Mission` (v2)

#### Mod conflict risks

- ❌ **Mods that rebalance boarding mechanics** affect flagship-capture outcome
- ❌ **Mods that change "surrender" semantics** affect Surrender sub-cue
- ⚠ **Mods removing player-gender voice variants** show wrong text
- ⚠ **Pirate-faction-overhaul mods** may change spawned pirate composition

---

### Mission entry: "Deliver Fleet" (Esc variant)

- **Cue**: `Esc_1_Deliver_Fleet_Mission`
- **In-game name**: Insurgent fleet delivery
- **Path/Chapter**: Escalation Chapter 1
- **Find in game**: Active after Disperse Pirates complete
- **Prerequisites**: Pirates dispersed + flagship handled
- **What player encounters**:
  - Player delivers fleet to insurgent forces
  - Reference library: `md.RML_Deliver_Fleet.DeliverFleet` (same as Universal but different recipient)
- **Where**: Delivery destination (different from Universal)
- **NPCs involved**: Dal Busta (oversight)
- **Reward**: Story progression
- **Chains to**: `Esc_1_Return_To_HQ` → Diplomatic Change (Esc)
- **Code reference**: `story_paranid.xml` `Esc_1_Deliver_Fleet_Mission` + `Esc_1_Deliver_Fleet_Ref`

---

### Mission entry: "Return to HQ" (Esc Chapter 1 wrap)

- **Cue**: `Esc_1_Return_To_HQ`
- **In-game name**: Return to HQ for Chapter 1 conclusion
- **Path/Chapter**: Escalation Chapter 1 (wrap)
- **Find in game**: After fleet delivered
- **Prerequisites**: Fleet delivered
- **What player encounters**:
  - Player returns to HQ
  - Dal Busta conversation finalizes Chapter 1
  - Triggers diplomatic state changes
- **Where**: Player HQ
- **NPCs involved**: Dal Busta, Boso Ta
- **Reward**: Story progression
- **Chains to**: `Esc_2_Boso_Call`
- **Code reference**: `story_paranid.xml` `Esc_1_Return_To_HQ`

---

## Chapter 2 — Haven Foundation

Player establishes a Haven station in Nopileos' Fortune VI (`cluster_04_sector002`). Includes claim-plot, build, recruit station manager, and antagonist NPC Gride placement.

### Mission entry: "Boso Ta's Call" (Esc Chapter 2 entry)

- **Cue**: `Esc_2_Boso_Call`
- **In-game name**: Boso Ta comm
- **Path/Chapter**: Escalation Chapter 2 (entry)
- **Find in game**: Comm after Chapter 1 conclusion
- **Prerequisites**: `Sinks_Escalation_Stage_2.$RunMission` is true
- **What player encounters**:
  - Boso Ta calls player
  - Briefing prep for Haven Foundation mission
- **Where**: Comm
- **NPCs involved**: Boso Ta
- **Reward**: Chapter 2 unlocked
- **Chains to**: `Esc_2_Briefing_Boso_Conversation_Header` → `Esc_2_Briefing_Dal_Conversation_Header`
- **Code reference**: `story_paranid.xml` `Esc_2_Boso_Call`

---

### Mission entry: "Briefing — Boso & Dal"

- **Cue**: `Esc_2_Briefing_Boso_Conversation_Header` + `Esc_2_Briefing_Dal_Conversation_Header`
- **In-game name**: Pre-mission briefing
- **Path/Chapter**: Escalation Chapter 2
- **Find in game**: Conversation sequence after Boso Call
- **Prerequisites**: Boso Call accepted
- **What player encounters**:
  - Boso Ta briefing about Haven concept
  - Dal Busta briefing about strategic value
  - Sets up mission stakes
- **Where**: HQ or remote comm
- **NPCs involved**: Boso Ta, Dal Busta
- **Reward**: Briefing complete
- **Chains to**: `Esc_2_Haven_Foundation` + (via separate path) `$GrideActor` placement
- **Code reference**: `story_paranid.xml` `Esc_2_Briefing_*`

---

### Mission entry: "Haven Foundation"

- **Cue**: `Esc_2_Haven_Foundation`
- **In-game name**: Build/Acquire Haven at Nopileos' Fortune VI
- **Path/Chapter**: Escalation Chapter 2 (main)
- **Find in game**: Active mission after briefing
- **Prerequisites**: Briefing complete
- **What player encounters**:
  - Mission location: **Nopileos' Fortune VI** (`cluster_04_sector002`)
  - Plot position: `[0m, 0m, 100km]` (100km from sector origin, ecliptic)
  - Two paths:
    1. **Claim Plot** then **Build Station** — full build path
    2. **Buy Blueprints** + build — costlier option
  - Sub-cues:
    - `Esc_2_Haven_Foundation_Claim_Plot_Ref` — claim plot reference
    - `Esc_2_Haven_Foundation_Build_Station_Ref` — building reference
    - `Esc_2_Recruit_Station_Manager_Mission_Deliver_Crew_Ref` — recruit manager
- **Cost**:
  - Build path: ~80 million credits
  - Buy-then-build: ~620 million credits (with blueprints)
- **Where**: `cluster_04_sector002` (Nopileos' Fortune VI)
- **NPCs involved**: Boso Ta, Dal Busta, Gride (antagonist appears nearby)
- **Reward**: Haven built, station manager recruited, Chapter 3 unlocked
- **Chains to**: `Esc_3_Briefing`
- **Code reference**: `story_paranid.xml` `Esc_2_Haven_Foundation` (v3)

#### Mod conflict risks

- ❌ **Mods that change `cluster_04_sector002` owner** break Plot Sector finder
- ❌ **Mods that affect station blueprint economy** affect cost
- ❌ **Mods using `cluster_04_sector002` for own content** collide with plot reservation
- ⚠ **NPC Placement Manager slot pressure** at this sector affects Gride placement

---

### Mission entry: "Recruit Station Manager"

- **Cue**: `Esc_2_Recruit_Station_Manager_Mission_Deliver_Crew_Ref`
- **In-game name**: Recruit Haven Manager
- **Path/Chapter**: Escalation Chapter 2 (sub-objective)
- **Find in game**: Active during/after Haven built
- **Prerequisites**: Haven Foundation underway
- **What player encounters**:
  - Player must recruit + deliver a station manager
  - Reference library: probably `RML_Deliver_Crew`
- **Where**: Haven station + recruiter location
- **Reward**: Manager recruited, Haven operational
- **Chains to**: Chapter 2 conclusion → `Esc_2_Diplomatic_Change`
- **Code reference**: `story_paranid.xml` `Esc_2_Recruit_Station_Manager_*`

---

### Mission entry: "Esc Chapter 2 Diplomatic Change"

- **Cue**: `Esc_2_Diplomatic_Change`
- **In-game name**: Faction state update
- **Path/Chapter**: Escalation Chapter 2 (conclusion)
- **Find in game**: Auto-fires after Haven + Manager complete
- **What player encounters**:
  - Relation shifts reflect military escalation choice
  - Holy Order may shift further toward player (anti-Godrealm gain)
  - Godrealm relations may worsen
- **Reward**: Permanent shifts
- **Chains to**: Chapter 3 Briefing
- **Code reference**: `story_paranid.xml` `Esc_2_Diplomatic_Change`

---

## Chapter 3 — Final Assault

Military endgame. Player delivers inventory + resources for final assault, conducts double-Sink check, joins Gride at staging point, completes the assault, and wraps up at HQ.

### Mission entry: "Esc Chapter 3 Briefing"

- **Cue**: `Esc_3_Briefing`
- **In-game name**: Final Assault Briefing
- **Path/Chapter**: Escalation Chapter 3 (entry)
- **Find in game**: After Chapter 2 conclusion
- **Prerequisites**: Esc Chapter 2 complete
- **What player encounters**:
  - Briefing dialogue with Dal Busta
  - Conversation header cue: `Esc_3_Briefing_Dal_Conversation_Header`
- **Where**: Comm or HQ
- **NPCs involved**: Dal Busta
- **Reward**: Chapter 3 unlocked
- **Chains to**: `Esc_3_Deliver_Inventory`
- **Code reference**: `story_paranid.xml` `Esc_3_Briefing`

---

### Mission entry: "Esc Deliver Inventory"

- **Cue**: `Esc_3_Deliver_Inventory` (v2)
- **In-game name**: Inventory delivery for assault
- **Path/Chapter**: Escalation Chapter 3
- **Find in game**: Active after briefing
- **Prerequisites**: Briefing complete
- **What player encounters**:
  - `$DeliverInventoryTable` — table-based inventory specification
  - Sub-cues: `Esc_3_Deliver_Inventory_Ref`, `Esc_3_Deliver_Inventory_Credits_Conversation`, `Esc_3_Deliver_Inventory_End_Boso_Speak_Finished`
- **Where**: Delivery target (assault staging)
- **NPCs involved**: Boso Ta (end dialog), Dal Busta
- **Reward**: Credits + arc progression
- **Chains to**: `Esc_3_Deliver_Resources`
- **Code reference**: `story_paranid.xml` `Esc_3_Deliver_Inventory`
- **Mission group**: `missiongroup.story_paranid_escalation`

---

### Mission entry: "Esc Deliver Resources"

- **Cue**: `Esc_3_Deliver_Resources`
- **In-game name**: Resource delivery for assault
- **Path/Chapter**: Escalation Chapter 3
- **Find in game**: Active after Inventory delivered
- **Prerequisites**: Inventory delivered
- **What player encounters**:
  - Station preparation: `Esc_3_Deliver_Resources_Prepare_Station`
  - Ref library: `Esc_3_Deliver_Resources_Ref`
  - Failsafe: `Esc_3_Deliver_Resources_Failsafe`
- **Where**: Resource delivery destination
- **Reward**: Arc progression
- **Chains to**: `Esc_3_Double_Sink_Completion_Check`
- **Code reference**: `story_paranid.xml` `Esc_3_Deliver_Resources`

---

### Mission entry: "Double Sink Completion Check"

- **Cue**: `Esc_3_Double_Sink_Completion_Check`
- **In-game name**: Verify both Sinks resolved
- **Path/Chapter**: Escalation Chapter 3 (gate)
- **Find in game**: After both deliveries complete
- **Prerequisites**: Inventory + Resources delivered
- **What player encounters**:
  - Gate cue verifies both Sink-related events resolved
  - Dal Busta speaks (text `{30220, 30220853}` female / `{30220, 30220852}` male):
    > "Looks like you've done your part. The fleet should now be ready to take on the last heroic defenders of civilised negotiations. I believe Gride is already waiting for you at the staging point."
  - Followed by additional speak lines `30220938`, `30220940`/`30220939`
- **Where**: Cutscene context
- **NPCs involved**: Dal Busta
- **Reward**: Gate passes — Final Assault unlocked
- **Chains to**: `Esc_3_Final_Assault`
- **Code reference**: `story_paranid.xml` `Esc_3_Double_Sink_Completion_Check`

---

### Mission entry: "Final Assault"

- **Cue**: `Esc_3_Final_Assault`
- **In-game name**: Final Assault — join Gride at staging point
- **Path/Chapter**: Escalation Chapter 3 (climactic mission)
- **Find in game**: Active after Double Sink check passed
- **Prerequisites**: Resources delivered + Double Sink check pass
- **What player encounters**:
  - Gride waiting at staging point
  - Gride conversation: `Esc_3_Final_Assault_Gride_Conversation_Header`
  - "Insult Again" sub-cue (`Esc_3_Final_Assault_Gride_Conversation_Insult_Again`) — Gride may insult player additional times
  - Assault combat content
- **Where**: Assault target location
- **NPCs involved**: Gride (commander), Dal Busta (oversight), assault targets
- **Reward**: Story climax, large faction shift
- **Chains to**: Post-assault dialog → `Esc_3_Wrap_Up_Headquarters`
- **Code reference**: `story_paranid.xml` `Esc_3_Final_Assault` + `Esc_3_Final_Assault_*`

#### Mod conflict risks

- ❌ **Mods that despawn Gride** prevent Final Assault from starting
- ❌ **Combat-rebalance mods** affect assault feasibility
- ⚠ **Mods that change Phoenix/elite ship behaviors** affect assault dynamics

---

### Mission entry: "Wrap Up at Headquarters"

- **Cue**: `Esc_3_Wrap_Up_Headquarters`
- **In-game name**: Talk to Dal Busta at HQ — final conversation
- **Path/Chapter**: Escalation Chapter 3 (arc conclusion)
- **Find in game**: Active after Final Assault
- **Prerequisites**: Final Assault complete
- **What player encounters**:
  - Boso Ta speaks (text `30220941`): "Well, that was ominous!" + (female `30220943` / male `30220942`): "Come back to headquarters and we'll wrap things up."
  - Objective: `objective.talkto` — talk to Dal Busta
  - Vanilla code TODO note: "We probably have to move Dal to the HQ here if he isn't there already"
- **Where**: Player HQ
- **NPCs involved**: Dal Busta, Boso Ta
- **Reward**: Arc completed (Escalation path)
- **Chains to**: `Esc_3_Wrap_Up_Headquarters_Dal_Conversation_Header` → `Esc_3_Wrap_Up_Headquarters_Dal_Conversation_Finished` → end of arc
- **Code reference**: `story_paranid.xml` `Esc_3_Wrap_Up_Headquarters`

#### Mod conflict risks

- ❌ **HQ-replacement mods** break the `objective.talkto Dal Busta` final objective
- ⚠ **Dal Busta movement/teleport mods** may interfere with HQ relocation (Egosoft's own TODO note suggests this is fragile)

---

## Path completion summary

A completed Escalation path yields:

- Haven station built at Nopileos' Fortune VI (`cluster_04_sector002`)
- Station manager recruited
- Final assault completed
- Holy Order significantly favored (anti-Godrealm shift)
- Faction state set to `story_paranid_esc_3 = true`
- Arc concluded; no further Paranid Civil War content available

## Related

- [Paranid Civil War overview](/vanilla-content/missions/paranid-civil-war/)
- [Prologue](/vanilla-content/missions/paranid-civil-war/prologue/)
- [Universal path](/vanilla-content/missions/paranid-civil-war/universal-path/) — alternate route
- [Mission encyclopedia](/vanilla-content/missions/) — other vanilla arcs
- [Mod-conflict checklist](/vanilla-content/mod-conflict-checklist/)

---

*The Escalation path is the militarist resolution. ~14 missions, 80M-620M credit investment, climactic Final Assault with Gride. Your mod's combat-balance changes, faction relation changes, and `cluster_04_sector002` ownership changes all risk breaking the arc.*

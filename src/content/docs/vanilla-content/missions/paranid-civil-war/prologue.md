---
title: Paranid Civil War — Prologue
description: How the arc starts. Dal Busta call, prerequisites, two-path choice mechanic. Detailed per-mission encyclopedia entry for arc entry.
---

The **Prologue** of the Paranid Civil War arc is the trigger phase — what fires Dal Busta's call to the player, the introduction conversation, and how the path choice is set up. There's no "mission" in the UI sense yet, but it's a fully-specified arc entry path that mods can break.

## Entry conditions (when arc becomes available)

The arc activates when the player's relation with **either Paranid faction** reaches **friendly** (UI value 10):

```xml
<set_value name="$EntryRelation" 
    exact="faction.paranid.relation.friend.min" 
    comment="0.01 (UI value 10) = friendly"/>

<conditions>
    <event_player_relation_changed faction="faction.holyorder"/>
    <event_player_relation_changed faction="faction.paranid"/>
    <check_value value="event.param2.{1} ge $EntryRelation"/>
</conditions>
```

Triggering on **permanent relation change** only (transient is filtered out via `not event.object`).

## Story state — character setup

Before the prologue can fire, the script has already anchored these characters in vanilla:

- **Dal Busta** (the antagonist contact — calls player)
- **Boso Ta** (HQ ally — appears in Chapter 1 returns)
- **Cardinal** (Holy Order leader)
- **The Sink** location at `cluster_25_sector002` (Cipher sector) — landmark referenced later
- **Paranid Monument** (`landmarks_par_monument_01_macro` at `cluster_11_sector001`) — 8km no-trespass radius zone established

These are set up by `Initialise` cue at story start, regardless of whether prerequisites are yet met.

---

## Mission entry: "Dal Busta's Call"

### Cue: `Prerequisites_Trigger_Dal_Call`

- **In-game name**: Not displayed (this is a comm call, not a UI mission)
- **Path/Chapter**: Prologue
- **Find in game**: Comm call from Dal Busta after relation prerequisite met
- **Prerequisites**:
  - Player relation ≥ friendly (UI 10) with `faction.paranid` OR `faction.holyorder`
  - Player not yet in Chapter 1
- **What player encounters**:
  - Dal Busta initiates a comm call
  - "Your recent exploits might have opened up a new opportunity for us." (text refs `{30200,30200003}` male / `{30200,30200004}` female player)
- **Player choices**:
  - **{30220, 201}** "And what might that be?" — Continue (accept prologue)
  - **{30220, 202}** "I'm not interested." — Abort (decline arc entirely)
- **Where**: Anywhere — comm call doesn't require physical proximity
- **NPCs involved**: Dal Busta (caller)
- **Reward**: None — pure narrative entry
- **Chains to**: `Prerequisites_Dal_Conversation` → `Prerequisites_Dal_Conversation_Section_Accept`
- **Code reference**: `story_paranid.xml` `Prerequisites_Trigger_Dal_Call_Parent` block

### Mod conflict risks — "Dal Busta's Call"

- ❌ **Mods that despawn Dal Busta** at game start block the arc forever — the call can't happen
- ❌ **Comm-disabling mods** during the relation-up event miss the trigger window
- ⚠ **Mods that auto-max relations on game start** trigger the call before player has context — confusing to new players
- ⚠ **Custom NPC mods that take over `faction.paranid` representative voicelines** may collide with Dal Busta's dialogue
- ⚠ **Custom mission mods using `faction.paranid` BBS slots** may push the prerequisite trigger off the offer board

---

## Mission entry: "Talk to Dal at the HQ" (special shortcut)

### Cue: `Prerequisites_Trigger_Dal_Call_HQ_Skip_Header`

A **special-case shortcut** for players who reach high relation with **both** Paranid factions while Dal Busta is physically at the player's HQ.

- **Cue**: `Prerequisites_Trigger_Dal_Call_HQ_Skip_Header`
- **In-game name**: "Paranid Civil War" (text ref `{30220, 205}`)
- **Path/Chapter**: Prologue (alternate entry)
- **Find in game**: Talk to Dal Busta in person while he's visiting the player HQ
- **Prerequisites**:
  - `$HQ` exists AND Dal Busta is at the HQ AND player is at the HQ
  - Player relation with BOTH Paranid factions ≥ `$TargetRelation` (-0.0099, UI -9, "allowed to dock")
- **What player encounters**:
  - Conversation option appears in Dal Busta's dialogue: "Paranid Civil War"
  - Bypasses the standard comm-call flow
  - Skips directly to Chapter 1 intro
- **Player choices**:
  - **{30220, 205}** "Paranid Civil War" — Skip to Chapter 1
- **Where**: Player HQ
- **NPCs involved**: Dal Busta (in person), HQ context
- **Reward**: Same as standard prologue (none — entry only)
- **Chains to**: `Ch1_Intro` (skips standard prerequisite handover)
- **Code reference**: `story_paranid.xml` `Prerequisites_Trigger_Dal_Call_HQ_Skip_Header`

### Mod conflict risks — "Talk to Dal at HQ"

- ❌ **HQ-replacement mods** break the `$HQ` context check
- ❌ **Mods that prevent Dal Busta from visiting HQ** disable this shortcut
- ⚠ **Mods that change HQ dock context** may confuse `hascontext.{$HQ}` check

---

## Mission entry: "Accept Dal Busta's Offer"

### Cue: `Prerequisites_Dal_Conversation_Section_Accept`

- **In-game name**: Conversation continuation
- **Path/Chapter**: Prologue (final entry step)
- **Find in game**: Player has continued through Dal Busta's conversation, reaches the "accept" choice
- **Prerequisites**: Player chose to continue through prerequisites conversation
- **What player encounters**:
  - Dal Busta: "Nice!" (text ref `{30220, 30220359}`)
  - Arc commits — player is now in Chapter 1
- **Where**: Wherever conversation started (HQ or remote comm)
- **NPCs involved**: Dal Busta
- **Reward**: Arc starts
- **Chains to**: `Ch1_Intro` → Chapter 1 missions begin
- **Code reference**: `story_paranid.xml` `Prerequisites_Dal_Conversation_Section_Accept`

### Mod conflict risks — "Accept Dal Busta's Offer"

- ❌ **Mods that intercept `event_conversation_next_section`** for Dal Busta block acceptance
- ⚠ **Mods that mass-bind Dal Busta conversations** may collide

---

## Mission entry: "Decline Dal Busta's Offer"

### Cue: `Prerequisites_Dal_Conversation_Section_Abort`

- **In-game name**: Conversation continuation
- **Path/Chapter**: Prologue (declined)
- **Find in game**: Player chose "I'm not interested." in prerequisites conversation
- **Prerequisites**: Player declined entry
- **What player encounters**:
  - Dal Busta: "That's too bad." (text ref `{30200, 30200005}`)
  - Arc enters declined state but **CAN be re-accepted later** via the same prerequisites mechanism (relation re-check)
- **Where**: Same as conversation context
- **NPCs involved**: Dal Busta
- **Reward**: None — narrative branch
- **Chains to**: Arc returns to `Prerequisites_Trigger_Availability` waiting state — relation re-meets prerequisite → fire again
- **Code reference**: `story_paranid.xml:Prerequisites_Dal_Conversation_Section_Abort`

### Mod conflict risks — "Decline Dal Busta's Offer"

- ⚠ **Multiple abort cycles** — vanilla guards via `$PrerequisitesAbortedAlready` flag; your mod's mass-relation-changes may exhaust patience
- ⚠ **Mods that disable conversation aborts** may hang the prerequisite flow

---

## Mission entry: "Escape — skip the arc entirely"

### Cue: `Prerequisites_Dal_Conversation_Escape`

A **permanent decline** option. Player chooses to skip the arc forever (cutscene fires, arc state set to "completed-via-escape").

- **Cue**: `Prerequisites_Dal_Conversation_Escape`
- **In-game name**: Escape sequence (cutscene)
- **Path/Chapter**: Prologue (permanently declined)
- **Find in game**: Player chose to escape during the prerequisites cutscene
- **Prerequisites**: Player initiated escape flow
- **What player encounters**:
  - Brief cutscene
  - Dal Busta speaks final line
  - Arc state set to permanently skipped — no further calls
- **Where**: Cutscene
- **NPCs involved**: Dal Busta
- **Reward**: Player loses access to all Paranid Civil War rewards (Trinity blueprint, Haven blueprint, faction rep boosts)
- **Chains to**: End of arc for this save
- **Code reference**: `story_paranid.xml` `Prerequisites_Dal_Conversation_Escape`

### Mod conflict risks — "Escape — skip the arc"

- ❌ **Mods that re-trigger story arcs** that should be permanently skipped — check `$HasCustomGamestartSkip` flag before re-triggering
- ⚠ **Save-migration**: Custom game starts that skip the arc via `gamestart.storystate.story_paranid_esc_0..3` must respect this flag

---

## Path commitment

After accepting Dal Busta's offer in the prologue, the player enters **Chapter 1**. **Chapter 1 is shared logic** between Universal and Escalation paths — the path divides based on **player decisions during Chapter 1 dialogues**.

Specifically, the player's response to the **Sink Explanation** event determines:

- Choosing a **mediation** response → Universal path (Uni_1)
- Choosing an **escalation** response → Escalation path (Esc_1)

For details of Chapter 1 missions and the path-split, see:

- [Universal path](/vanilla-content/missions/paranid-civil-war/universal-path/) — Uni_1 onwards
- [Escalation path](/vanilla-content/missions/paranid-civil-war/escalation-path/) — Esc_1 onwards

## Related

- [Paranid Civil War overview](/vanilla-content/missions/paranid-civil-war/) — arc landscape
- [Universal path](/vanilla-content/missions/paranid-civil-war/universal-path/) — mediator-route missions
- [Escalation path](/vanilla-content/missions/paranid-civil-war/escalation-path/) — escalator-route missions
- [Mission encyclopedia](/vanilla-content/missions/) — other vanilla arcs
- [Story arcs catalog](/vanilla-content/story-arcs/) — high-level reference

---

*The Prologue is short but critical — break it and the entire 20K-line arc is unreachable. Most "Paranid story doesn't start" bug reports trace to mod side-effects in this 30-line window.*

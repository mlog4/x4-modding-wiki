---
title: Diplomacy Intro arc
description: 10K-line base game arc introducing the Diplomacy / HAT (Hatikvah) system. 11 parts (Pt1-Pt11) covering player's first contact with embassy system. Triggered by Wayward Scion + others.
---

The **Diplomacy Intro arc** (`story_diplomacy_intro.xml`, 9693 lines) is the **base game's introduction to the Diplomacy / Embassy system**. The arc introduces the **Hatikvah (HAT) faction** as the diplomatic intermediary and walks the player through 11 parts (Pt1-Pt11) covering first contact, gift station presentation, police scan handling, and Dal Busta desk management.

- **Script**: `story_diplomacy_intro.xml`
- **DLC**: Base game (no DLC required, though Kingdom End expands it)
- **Text page**: 30202 — "Diplomatic mentor mission page"
- **Parts**: 11 (Pt1-Pt11)

## Trigger

The arc fires automatically from game start hooks (e.g., Wayward Scion's `gs_intro.xml` signals `md.Story_Diplomacy_Intro.Pt_1_Call_Initial_Delay`).

## Sectors anchored

Preferable Hatikvah sectors (the script appends multiple):

| Variable | Macro | Vanilla name |
|---|---|---|
| `$PreferableHatikvahSectors` | `cluster_29_sector001` | Hatikvah's Choice I |
| `$PreferableHatikvahSectors` | `cluster_08_sector001` | Silent Witness I |
| `$PreferableHatikvahSectors` | `cluster_29_sector002` | Hatikvah's Choice II |

These are the Hatikvah-friendly territories where the HAT_Station is typically placed.

The script also dynamically searches for offer sectors within `maxdistance="2"` of `$Hat_Station`.

## Persistent characters

| Character | Role |
|---|---|
| **HAT Announcer** | Initial HAT broadcast (referenced from gs_intro) |
| **Reen** | HAT faction representative (mentioned across other arcs) |
| **Kat** | NPC conversation partner |
| **Cline** | NPC conversation partner |
| **Dal Busta** | Cross-arc desk management |

## Setup phase

| Cue | Purpose |
|---|---|
| `PATCH_AddStoryMentors` | Save migration — add story mentors to existing saves |
| `Initialise` | Standard initialization |
| `Conv_Started_Kat` | Conversation event handler for Kat |
| `Conv_Started_Cline` | Conversation event handler for Cline |
| `Patch_Userdata` | Save migration |

## The 11 Parts (Pt1-Pt11)

The arc divides into 11 sequential parts:

### Pt1 — Initial Call + Player at HAT Station

| Cue | Purpose |
|---|---|
| `Pt_1_Call_Initial_Delay` | Initial delay before HAT call |
| `Pt_1_Call_Trigger` | Trigger the HAT call |
| `Pt_1_Call_Trigger_CancelDelay` | Cancel delay (early trigger path) |
| `Pt_1_Offer_Call_Lines` | Offer call dialogue lines |
| `Pt_1_Offer_Call_Lines_Cleanup` | Cleanup after offer lines |
| `Pt_1_Offer_Call_Trigger` | Trigger the offer call |
| `Pt_1_Unlock_Invite_Call` | Unlock invite call mechanism |
| `Pt1_Player_Left_HAT_Station` (1s polling) | Track if player leaves HAT Station |

**Player encounters**:
- HAT broadcast (audible comm)
- HAT Announcer voice-over
- HAT Station location revealed
- Player travels to HAT Station
- Reen welcomes player
- Story state advances

### Pt2-Pt10 — Diplomatic progression

Each part advances player's understanding of Diplomacy / Embassy mechanics:

- Pt2: First contact + relation establishment
- Pt3: Negotiate / cultural exchange
- Pt4: Gift presentation
- Pt5-Pt8: Various diplomatic challenges
- Pt9-Pt10: Climax + resolution

(Specific per-part cues exist but aren't fully cataloged here — the arc is 10K lines.)

### Pt11 — Skip mechanism

| Cue | Purpose |
|---|---|
| `Pt_11_Skip_Trigger` | Player can skip remaining content |

This is the **arc closure** — once Pt11 fires, the arc concludes.

## Mission entries (selected key missions)

### Mission entry: "HAT Broadcast → First Contact"

- **Cue chain**: `Pt_1_Call_Initial_Delay` → `Pt_1_Call_Trigger` → `Pt_1_Offer_Call_Trigger`
- **In-game name**: HAT broadcasts to player
- **Path/Chapter**: Pt1
- **Find in game**: After initial delay (set by game start)
- **What player encounters**:
  - HAT broadcast comm — "We have a proposition for you..."
  - Player must travel to HAT_Station
  - Reen as initial contact
- **Where**: HAT_Station (one of `$PreferableHatikvahSectors`)
- **NPCs involved**: HAT Announcer (broadcast), Reen (in-person)
- **Reward**: Diplomacy system unlocked
- **Chains to**: Subsequent Pt2 onwards
- **Code reference**: `story_diplomacy_intro.xml` `Pt_1_Call_*`

### Mission entry: "Talk to Kat / Cline"

- **Cue**: `Conv_Started_Kat` (+ `Conv_Started_Cline`)
- **In-game name**: Conversations with Kat / Cline
- **Find in game**: Player approaches Kat or Cline at HAT Station
- **What player encounters**:
  - Conversation triggered by `event_conversation_started`
  - Dialogue with Kat OR Cline (likely Hatikvah faction members)
- **NPCs involved**: Kat, Cline
- **Chains to**: Various part progressions

### Mission entry: "Police Scan event"

- **Cue**: `Event_Police_Scan` → `Event_Police_Scan_Check_Player`
- **In-game name**: Police scan during diplomatic mission
- **What player encounters**:
  - Police attempt to scan player
  - Check player state (illegal cargo / cover / etc.)
  - Diplomatic implications based on outcome
- **Mod risk**: Mods disabling police behavior break this event handler

### Mission entry: "Create Gift Station"

- **Cue**: `Create_Gift_Station`
- **In-game name**: Setup a gift station for diplomatic gift
- **What player encounters**:
  - Script creates a temporary "gift station" object
  - Player must interact with it (deliver or receive gift)
- **Mod risk**: Custom faction mods that change gift station mechanics

### Mission entry: "Dal Busta desk management"

- **Cue chain**: `Dal_RemoveDesk` → `Dal_DeskClean` → `Dal_DeskBusy`
- **In-game name**: Dal Busta's desk state
- **What player encounters**:
  - At specific points, Dal Busta's desk is "busy", "clean", or removed
  - Diplomatic story relies on Dal being present / available

## Mod conflict risks (Diplomacy Intro-specific)

- ❌ **Mods that disable HAT broadcast / Reen / Kat / Cline** break arc
- ❌ **Mods that change `cluster_29` / `cluster_08` ownership** affect HAT_Station placement
- ❌ **Mods that override game start hooks** break Pt_1_Call_Initial_Delay trigger
- ❌ **Mods that disable Dal Busta** break desk-management mechanics
- ❌ **Mods that disable police-scan event** break Pt-progression that relies on police scan handler
- ⚠ **Mods adding bulk NPCs at HAT_Station** can collide with Kat/Cline/Reen spawning
- ⚠ **Custom game starts** that skip initial delay must signal correct cue (`md.Story_Diplomacy_Intro.Pt_1_Call_Initial_Delay`)

## Code references

| Concern | Cue |
|---|---|
| Game-start hook | `Pt_1_Call_Initial_Delay` (referenced from gs_intro.xml) |
| Kat conversation | `Conv_Started_Kat` |
| Cline conversation | `Conv_Started_Cline` |
| HAT Station tracking | `Pt1_Player_Left_HAT_Station` (1s polling) |
| Police scan | `Event_Police_Scan` + `_Check_Player` |
| Gift station | `Create_Gift_Station` |
| Dal Busta desk | `Dal_RemoveDesk` / `Dal_DeskClean` / `Dal_DeskBusy` |
| Pt1 offer lines | `Pt_1_Offer_Call_Lines` + cleanup |
| Pt11 skip | `Pt_11_Skip_Trigger` |
| Story mentors patch | `PATCH_AddStoryMentors` |
| Save migration | `Patch_Userdata` |

## Related

- [Mission encyclopedia](/vanilla-content/missions/) — landscape
- [Embassy research](/vanilla-content/missions/base-game-arcs/research-stubs/) — follow-up arc (tied to diplomacy)
- [Game starts catalog](/vanilla-content/game-starts/) — Wayward Scion hooks Diplomacy intro
- [Tides of Avarice: Unbihexium](/vanilla-content/missions/tides-arcs/unbihexium/) — uses similar cover-faction patterns
- [Story arcs catalog](/vanilla-content/story-arcs/) — high-level catalog

---

*The Diplomacy Intro is the player's first encounter with X4's embassy/diplomacy system. 11 parts spread across 10K lines guide the player through the mechanic. Your mod's interference with HAT, Reen, Kat, Cline, police scans, or Dal Busta breaks the entire chain.*

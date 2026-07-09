---
title: Paranid Civil War — arc overview
description: 20K-line story arc about the Holy Order vs Godrealm Paranid schism. Two branching paths (Universal / Escalation), 3 chapters each, 30+ individual missions.
---

The **Paranid Civil War** is X4's largest narrative arc — **20,236 lines** of MD code, **30+ individual missions** across two branching paths and three chapters each. The player intermediates between the **Holy Order of Pontifex** (zealot faction) and the **Godrealm of the Paranid** (orthodox faction).

This page is the arc overview. For per-mission detail see:

- [Prologue — finding the arc](/vanilla-content/missions/paranid-civil-war/prologue/) — how player first encounters the story
- [Universal path](/vanilla-content/missions/paranid-civil-war/universal-path/) — Uni_1, Uni_2, Uni_3 missions (mediator route)
- [Escalation path](/vanilla-content/missions/paranid-civil-war/escalation-path/) — Esc_1, Esc_2, Esc_3 missions (escalator route)

## Script reference

- **File**: `md/story_paranid.xml`
- **Lines**: 20,236
- **MDScript name**: `Story_Paranid`
- **Text page**: 30220 (Paranid Story)
- **Universe restriction**: Main galaxy only (`xu_ep2_universe_macro`)

## The two paths

```
Prologue (relation ≥ friendly with Paranid OR Holy Order)
    ↓ Dal Busta calls player
    ↓ Player accepts arc
    ↓
[PATH CHOICE]
    ↓
    ├──→ Universal path (Uni)
    │       Chapter 1: Sink — pacify the conflict
    │       Chapter 2: Duke — court the Duke (Trinity)
    │       Chapter 3: Mediation — final mediation
    │
    └──→ Escalation path (Esc)
            Chapter 1: Sink — also Sink BUT escalating
            Chapter 2: Haven Foundation — build a Haven station
            Chapter 3: Final Assault — military endgame
```

Path semantics (from code structure):

| Path | Theme | Outcome |
|---|---|---|
| **Universal** (Uni) | Diplomatic mediator | Player unifies the schism, reconciliation |
| **Escalation** (Esc) | Military escalator | Player picks a side, military resolution |

The two paths share Chapter 1 conceptually (both deal with "the Sink" event) but diverge in execution. Chapter 2-3 are fully distinct.

## Persistent characters

These characters are anchored across the arc — your mod **must not** despawn or destroy them:

| Character | Role | First appearance |
|---|---|---|
| **Dal Busta** | Antagonist / story driver | Prerequisites — calls player when relation threshold met |
| **Boso Ta** | HQ ally, conversation partner | Chapter 1 returns to HQ |
| **The Cardinal** | Holy Order leader | Cardinal's Redress sector |
| **Duke** | Trinity faction leader | Uni Chapter 2 |
| **Xat** | Combatant / honor guard | Universal Chapter 1 |
| **Gride** | Antagonist | Escalation chapters |
| **Legate** | Paranid official | Universal Chapter 1 (target of Uni_1_Assassinate_Legate) |

Stored in `md.Plot.Actors.$X` for cross-arc reuse — see [Story arcs catalog](/vanilla-content/story-arcs/#persistent-characters).

## Sector locations

The arc anchors specific sectors. Your mod **must not** change ownership / accessibility of:

| Sector macro | Vanilla name | Story role |
|---|---|---|
| `cluster_35_sector001` | Lasting Vengeance | Derelict discovery (early scene) |
| `cluster_36_sector001` | Cardinal's Redress | Cardinal encounter |
| `cluster_11_sector001` | (Paranid Monument sector) | Paranid Monument — central landmark with 8km no-trespass radius |
| `cluster_25_sector002` | (Cipher sector) | Cipher investigation |
| `cluster_22_sector001` | Trinity Sanctum | Trinity homeworld — Uni Chapter 2 hub |
| `cluster_04_sector001` | Nopileos' Fortune II | Chapter 2 plot hub |
| `cluster_04_sector002` | (Nopileos adjacent) | Esc plot sector |

The **Paranid Monument** (in cluster_11_sector001) is a specific landmark object — macro `landmarks_par_monument_01_macro`. The story enforces an 8km no-trespass radius via `Generic_Guard_Response` cues.

## Prerequisites — when the arc starts

The arc triggers when the player reaches **friendly relation (UI value 10)** with **either**:

- `faction.paranid` (Godrealm Paranid), OR
- `faction.holyorder` (Holy Order of Pontifex)

```xml
<set_value name="$EntryRelation" 
    exact="faction.paranid.relation.friend.min" 
    comment="0.01 (UI value 10) = friendly"/>
```

When that threshold is met, `Prerequisites_Trigger_Availability` fires → Dal Busta calls the player on the comm.

## Path choice mechanic

Once Chapter 1 starts (after player accepts Dal Busta's call), the path divides based on **player action choices** during Chapter 1 dialogues. The code reflects this via separate `Uni_1_*` vs `Esc_1_*` cue trees that initialize from different conversation branches.

The player **cannot freely switch paths** mid-arc. Path commitment is fixed by Chapter 1 endings.

## Chapter beats — at a glance

### Universal path

| Chapter | Theme | Key missions |
|---|---|---|
| **Uni 1** | The Sink — pacify | Dal Desk → Sink Explanation → Deliver Fleet → Assassinate Legate → Mediation Patrol → Diplomatic Change |
| **Uni 2** | Duke / Trinity | Duke Call → Palace Foundation (offer blueprint OR build) |
| **Uni 3** | Final mediation | Boso Call → Deliver Inventory → Deliver Resources → Diplomatic Change |

### Escalation path

| Chapter | Theme | Key missions |
|---|---|---|
| **Esc 1** | The Sink — escalate | Dal Desk → Sink Explanation → Disperse Pirates (flagship capture) → Deliver Fleet → Diplomatic Change |
| **Esc 2** | Haven Foundation | Boso Call → Briefing → Haven Foundation (claim plot, build station, recruit manager) → Diplomatic Change |
| **Esc 3** | Final Assault | Briefing → Deliver Inventory → Deliver Resources → Final Assault (military endgame) → Wrap Up Headquarters |

For mission-by-mission detail navigate to [Universal path](/vanilla-content/missions/paranid-civil-war/universal-path/) or [Escalation path](/vanilla-content/missions/paranid-civil-war/escalation-path/).

## Custom-gamestart skip flags

If your mod adds a custom game start, you can **skip parts** of the arc via these flags:

| Flag | Effect |
|---|---|
| `gamestart.storystate.story_paranid_uni_0` | Skip Uni prerequisites + Chapter 1 |
| `gamestart.storystate.story_paranid_uni_1` | Skip Uni Chapter 2 |
| `gamestart.storystate.story_paranid_uni_2` | Skip Uni Chapter 3 |
| `gamestart.storystate.story_paranid_uni_3` | Mark arc as fully completed (Uni path) |
| `gamestart.storystate.story_paranid_esc_0..3` | Same for Escalation path |

Use these to start players "mid-arc" or skip the arc entirely. See `gs_scientist.xml` for an example of a story-state-preloaded start.

## Save migration patches

The script has multiple `<patch sinceversion="N">` blocks for save-load recovery. Key ones:

- **sinceversion 9** (5.0 Beta 1) — `Esc_1_Cooldown_Update_Objective` fix
- **sinceversion 12** (5.0 Beta 6 Hotfix 1) — Multi-mission state recovery

Your mod's changes to this arc must respect these patch points — see [Wiki: Save compatibility](/wiki/save-compatibility/).

## Common mod-conflict patterns specific to this arc

### Relation mods

- Mods that auto-set `faction.player.relationto.{faction.paranid} = max` at game start trigger the arc immediately
- Mods that make Paranid + Holy Order both ≤ enemy permanently block the arc forever
- Recommended: leave initial faction relations at vanilla defaults

### Sector-ownership mods

- Mods claiming Cardinal's Redress (cluster_36) for player at game start break Chapter 1
- Mods spawning hostiles in Paranid Monument zone (cluster_11) collide with the Generic_Guard_Response cue chain
- Mods replacing Nopileos' Fortune II macro break Chapter 2

### NPC-spawning mods

- Mods filling all `tag.actor_paranid_*` slots starve Cardinal / Duke / Dal Busta / Boso Ta spawns
- Mods adding bulk NPC arcs at HQ collide with `Uni_1_Return_To_HQ` Boso conversation cues

### Custom mission mods

- Generic missions at Paranid stations during prerequisites phase may delay Dal Busta call by competing for offer slots
- Mission templates assigning Cardinal's Redress or Trinity Sanctum as target may collide with story expectations

## Related

- [Mission encyclopedia index](/vanilla-content/missions/)
- [Story arcs catalog](/vanilla-content/story-arcs/) — high-level story arcs landscape
- [Prologue](/vanilla-content/missions/paranid-civil-war/prologue/) — how the arc starts
- [Universal path](/vanilla-content/missions/paranid-civil-war/universal-path/) — Uni missions detailed
- [Escalation path](/vanilla-content/missions/paranid-civil-war/escalation-path/) — Esc missions detailed
- [Mod-conflict checklist](/vanilla-content/mod-conflict-checklist/) — broader checklist
- [Story missions (technical)](/game/missions/story-mission/) — how to write your own

---

*The Paranid Civil War is the highest-stakes vanilla arc — touching Trinity, Holy Order, Godrealm, Antigone, and player factions across 7 sectors. Mod compatibility audits should walk through both paths.*

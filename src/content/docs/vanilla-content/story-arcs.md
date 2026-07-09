---
title: Story arcs catalog
description: All 7 vanilla story arcs — what happens, where, who's involved, what your mod must avoid breaking. Base game + Cradle of Humanity + Pirate + Ventures + Kingdom End.
---

This catalog describes **all 7 hand-authored story arcs** in vanilla X4. Per arc: what happens, where, which factions/sectors/NPCs it touches, what your mod must NOT disturb.

## At-a-glance table

| Arc | Script | LoC | DLC | Touched factions | Touched sectors |
|---|---|---|---|---|---|
| Paranid civil war | `story_paranid.xml` | 20,236 | Base | argon, paranid, holyorder, antigone, alliance, teladi, buccaneers, trinity | 7 (see below) |
| Buccaneers | `story_buccaneers.xml` | 540 | Pirate | buccaneers, ownerless | Argon Prime adjacent |
| Ventures | `story_ventures.xml` | 499 | Ventures | (ventures-specific) | Player HQ sector |
| Diplomacy intro | `story_diplomacy_intro.xml` | ~3K | Kingdom End | hat (Hatikvah faction) | argon space |
| Embassy research | `story_research_embassy.xml` | ~2K | Kingdom End | various | Player HQ |
| Welfare research | `story_research_welfare_1.xml` | ~5K | Base | argon, paranid, civilian, criminal | Multi-sector |
| Xenon equipment research | `story_research_xen_equipment.xml` | ~3K | Base | xenon, player | Player HQ |

---

## Paranid civil war

**Script**: `story_paranid.xml` (20,236 lines — the largest narrative script)  
**DLC**: Base game (vanilla)  
**Page reference**: 30220

### What happens

The Paranid civil war centers on the **Holy Order vs Godrealm split** (vanilla pre-existing schism) and the player's role mediating it. The arc spans **multiple chapters** with bifurcating outcomes — universe path (`story_paranid_uni_*`) vs escape path (`story_paranid_esc_*`).

Major beats:

1. **Discovery of a Paranid derelict** in Lasting Vengeance (cluster_35_sector001)
2. **Encounter with the Cardinal** (Holy Order leader) in Cardinal's Redress (cluster_36_sector001)
3. **Investigation of cipher/conspiracy** in cluster_25_sector002
4. **Trinity homeworld involvement** in cluster_22_sector001
5. **Plot revelation** at Nopileos' Fortune II (cluster_04_sector001)
6. **Player choice** affecting Paranid faction balance

### Sectors touched

| Sector macro | Vanilla name | Story role |
|---|---|---|
| `cluster_04_sector001` | Nopileos' Fortune II | Chapter 2 hub |
| `cluster_04_sector002` | Nopileos' Fortune V (adjacent) | Plot sector / Buccaneer overlap |
| `cluster_11_sector001` | Paranid sector w/ Monument | Paranid Monument location |
| `cluster_22_sector001` | Trinity Sanctum | Trinity home / plot sector |
| `cluster_25_sector002` | (Cipher sector) | Conspiracy investigation |
| `cluster_35_sector001` | Lasting Vengeance | Derelict discovery |
| `cluster_36_sector001` | Cardinal's Redress | Cardinal encounter |

### Persistent characters

The story anchors several NPCs that persist across save/load:

- **Cardinal** — Holy Order leader, Cardinal's Redress sector
- **Boso Ta** — Reappears across multiple arcs (also in HQ research)
- **Dal Busta** — Antagonist
- **Trinity Honour Guard Leader** — Anchored to Trinity Sanctum
- **Various Holy Order officers** — Sector-anchored

These actors are typically stored as `md.Plot.Actors.$X` for cross-arc reuse.

### Relation effects

The arc directly modifies:

- `faction.player ↔ faction.paranid`
- `faction.player ↔ faction.holyorder`  
- `faction.player ↔ faction.godrealm` (Trinity outcome)
- `faction.player ↔ faction.trinity` (chapter 4+)

### Mod conflict risks

- ❌ **Don't destroy Cardinal's Redress sector content** — story will hang if Cardinal can't be found
- ❌ **Don't set `faction.player.relationto.{faction.paranid}` to max early** — arc gates progression on specific tier transitions
- ❌ **Don't spawn-replace the Paranid Monument** in cluster_11_sector001
- ❌ **Don't make Trinity Sanctum (cluster_22) hostile to player at game start** — Chapter 4 hooks dialog requires neutral entry
- ⚠ **Custom missions in cluster_36 risk briefing-cue collision** during Cardinal encounters

---

## Buccaneers arc

**Script**: `story_buccaneers.xml` (540 lines)  
**DLC**: Pirate (x4ep1)  
**Faction**: buccaneers (Riptide), ownerless

### What happens

Short Pirate-DLC arc introducing the **Buccaneers / Riptide pirate faction**:

1. Player encounters a buccaneer flagship (Helianthus per code reference, page 20101 line 120901)
2. Buccaneer captain proposes player join their cause
3. Player either joins (unlocks Pirate subscription path) or rejects (Buccaneer hostility)
4. Buccaneers establish presence in Argon-adjacent space

### Mod conflict risks

- ❌ **Don't replace the Buccaneer flagship macro** — story references a specific macro via `find_object`
- ⚠ **Buccaneer relation changes affect arc availability** — your mod making Buccaneers hostile-by-default skips the introduction
- ⚠ **Pirate DLC presence required** — see [Wiki: DLC handling](/wiki/dlc-handling/)

---

## Ventures arc

**Script**: `story_ventures.xml` (499 lines)  
**DLC**: Ventures

### What happens

Introduces the **Ventures NPC station traveler** at the player HQ. The traveler explains the Ventures system (sending ships to other players' games for rewards). Short tutorial-like arc.

### Mod conflict risks

- ⚠ **Player HQ required** — arc gates on HQ existing; mods that skip HQ delay or replace HQ may break the trigger
- ⚠ **Ventures NPC anchor** — don't remove ventures-tagged NPCs

---

## Diplomacy intro arc

**Script**: `story_diplomacy_intro.xml`  
**DLC**: Kingdom End  
**Linked module**: `x4ep1_gamestart_intro` (Wayward Scion start)

### What happens

The Wayward Scion start introduces this arc via **HAT (Hatikvah Free League) broadcast**:

1. Game start fires HAT broadcast 30 seconds in (see `gs_intro.xml`)
2. NPC named **Reen** opens the diplomacy storyline
3. Player introduces themselves to the diplomacy system
4. Embassy / first contact mechanics unlocked

### Sectors touched

Initial Wayward Scion sectors:

```
cluster_29_sector001, cluster_29_sector002,
cluster_14_sector001, cluster_07_sector001,
cluster_08_sector001, cluster_34_sector001,
cluster_13_sector001, cluster_12_sector001
```

These are pre-uncovered on the map at game start.

### Mod conflict risks

- ❌ **Don't disable the HAT announcer NPC at start** — story can't begin
- ⚠ **Kingdom End DLC presence required**
- ⚠ **Custom game starts must signal `md.Story_Diplomacy_Intro.Pt_1_Call_Initial_Delay`** if you want the diplomacy intro available

---

## Embassy research arc

**Script**: `story_research_embassy.xml`  
**DLC**: Kingdom End

### What happens

HQ research line that unlocks **Embassy mechanic** — players can establish embassies with factions for relation bonuses + content access.

### Mod conflict risks

- ⚠ **HQ research progress required** — gates on terraforming-system research nodes; don't break research dependencies
- ⚠ **Don't add custom factions WITHOUT embassy support** — diplomacy UI will list them but interactions break

---

## Welfare research arc

**Script**: `story_research_welfare_1.xml` (~5K lines)  
**DLC**: Base game

### What happens

HQ research line that culminates in **Welfare module unlock**. Multi-step:

1. Argon civilian rep approaches player (relation-gated)
2. Research mission chain (deliver wares, build prototypes)
3. Criminal interference subplot
4. Paranid involvement in mid-stage
5. Welfare module recipe unlocked

### Touched factions

argon, civilian, criminal, paranid, faction.list (for general checks), faction.player

### Mod conflict risks

- ❌ **Don't max relations with civilians by mod side-effect** — arc gates on reaching specific relation
- ❌ **Don't disable criminal faction at game start** — antagonist arc breaks
- ⚠ **HQ welfare-research node alteration breaks arc**

---

## Xenon equipment research arc

**Script**: `story_research_xen_equipment.xml`  
**DLC**: Base game

### What happens

HQ research line that unlocks **Xenon-derived equipment** (Xenon-tech mining lasers, scanners, modules). Story-gated on player encountering Xenon hostilities and recovering wreckage.

### Mod conflict risks

- ❌ **Don't make Xenon non-hostile** — wreckage-recovery missions can't generate
- ⚠ **HQ research node dependency** — custom research mods must not displace this node

---

## Persistent characters — vanilla anchors

These characters persist across save/load and across story arcs:

| Character | Script | Anchor location |
|---|---|---|
| Boso Ta | `story_paranid.xml` + `terraforming.xml` | HQ / Skipper context |
| Cardinal | `story_paranid.xml` | Cardinal's Redress sector |
| Dal Busta | `story_paranid.xml` | Cipher sector |
| Trinity Honour Guard Leader | `story_paranid.xml` | Trinity Sanctum |
| Reen | `story_diplomacy_intro.xml` | HAT broadcaster |
| Buccaneer Captain | `story_buccaneers.xml` | Buccaneer flagship |

Your mod **must not** `destroy_object` or `despawn` any of these. If you spawn NPCs near them, use [NPC Placement Manager](/game/characters/npc/) `$slottags` rather than fixed positions to avoid clash.

## Common mod-vs-story conflict patterns

### Sector-ownership mods

If your mod changes sector ownership early (e.g. "Player starts with Cardinal's Redress"), story arcs that find_sector + check_owner will fail. **Test**: load mod, watch debug.log for `Property lookup failed` near story scripts.

### Faction relation mods

Many arcs gate progression on relation thresholds. Mods that:
- Set player ↔ faction relations at game start
- Apply auto-rep-gain
- Add relation events on game start

…all risk firing arc conditions out-of-order. Pre-flight test: walk through the affected story with your mod active.

### NPC spawning mods

Mods that bulk-spawn NPCs (admiral arcs, character mods, etc.) compete for **NPC slots** on stations. Story arcs may fail to place their NPCs if your mod has filled the slots. Use `$slottags=[tag.npc_generic]` + low spawn priority.

### Mission template mods

If you add new `gm_*` templates, vanilla catalogues (gmc_*) won't pick them up unless you diff the catalogues. Conversely, vanilla missions WILL keep firing — your custom missions just compete for offer slots.

## Code references

| Concern | File |
|---|---|
| Paranid arc full content | `story_paranid.xml` |
| Sector references catalog | All `story_*.xml` (search `find_sector macro=`) |
| Persistent actor pattern | `plot.xml` (storage) + `story_*.xml` (creators) |
| Custom-gamestart skip flags | `story_paranid.xml:15-40` (`$story_paranid_uni_*` / `_esc_*`) |
| HAT broadcast trigger | `gs_intro.xml:30s delay → md.Story_Diplomacy_Intro.Pt_1_Call_Initial_Delay` |

## Related

- [Vanilla content index](/vanilla-content/)  — landscape
- [Game starts catalog](/vanilla-content/game-starts/) — which starts unlock which arcs
- [Terraforming catalog](/vanilla-content/terraforming/) — HQ research interactions
- [Story missions (technical)](/game/missions/story-mission/) — how to write your own
- [Wiki: Mod compatibility](/wiki/mod-compatibility/) — broader compatibility discipline

---

*Vanilla story arcs are X4's bedrock content. A mod that respects them coexists silently; a mod that breaks them ships the worst kind of bug — invisible to mod author, devastating to player save.*

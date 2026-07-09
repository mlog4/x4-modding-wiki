---
title: Yaki arc
description: The 1.1MB Yaki story — LARGEST single arc in vanilla X4. 23 chapters across Yaki/Terran/Pioneer conflict. Yaki cover identity + Wingmate + Headquarters + invasion fleet.
---

The **Yaki arc** (`story_yaki.xml`, **1,103,751 bytes ~1.1MB**) is **THE LARGEST single arc in vanilla X4** — **23 chapters (Ch1-Ch23)**. The arc spans the Yaki pirate faction's relationship with the player, including taking a Yaki cover identity, recruiting a Yaki Wingmate, establishing operations at the Yaki Headquarters, and ultimately the Yaki "freedom mission" with an invasion fleet confrontation.

- **Script**: `story_yaki.xml`
- **DLC**: Cradle of Humanity
- **Size**: 1,103,751 bytes (18,732 lines)
- **Chapters**: 23 (Ch1-Ch23)
- **Factions touched**: argon, antigone, civilian, khaak, ministry, ownerless, pioneers, player, teladi, terran, **yaki**, xenon

## Sectors anchored

Yaki arc anchors **at least 12 sectors**:

| Variable | Macro | Role |
|---|---|---|
| `$TerranOutpostSector` | `cluster_48_sector001` | Terran outpost (key recurring location) |
| `$TerranBorderSector` | `cluster_100_sector001` | Asteroid Belt — Terran border |
| `$YakiExitSector` | `cluster_112_sector002` | Yaki exit point |
| `$SecretServiceSector` | `cluster_101_sector001` | Mars — Secret Service contact |
| `$TrackYakiSector1` / `$TrackYakiSector2` | `cluster_100_001` / `cluster_107_001` | Yaki tracking sectors |
| `$AmbushWreckSector` | `cluster_108_sector001` | Ambush wreck location |
| `$DamagedTraderSector` | `cluster_109_sector001` | Damaged trader rescue location |
| `$MiningFleetSector` | `cluster_110_sector001` | Mining fleet location (Neptune adjacent) |
| `$ConversationPuzzleSector` | `cluster_115_sector001` | Brennan's Triumph (puzzle conversation) |
| `$YakiHomeSector` | `cluster_112_sector001` | **Yaki Headquarters location** |
| `$XenonSectorNextToYaki` | `cluster_33_sector001` | Xenon-Yaki border |

The arc covers a **wide swath of the Solar System + Yaki space**, threading through 12+ sectors over its 23 chapters.

## Persistent infrastructure

### Yaki cover identity (Cover_Handler)

A standout feature: the player takes a **Yaki cover identity** on a specific ship — only ONE ship at a time can have the Yaki cover.

```
Cover_Handler (v2)
├── Cover_Activation_Proximity_Check (3s polling)
│   └── Cover_Deactivation_Proximity_Check (3s polling)
```

This is X4's earliest **cover-faction system**, predecessor to Tides of Avarice's Sobert.

### Terran Outpost

`Setup_Terran_Outpost` (v4) + `Terran_Outpost_Friendly_Fire_Protection` — A persistent Terran outpost with friendly-fire protection (so player can't accidentally provoke).

### Yaki Headquarters

`Setup_Yaki_Headquarters` (v5) — the Yaki HQ, central plot location.

### Secret Service Station

`Setup_Secret_Service_Station` (v2) + `Secret_Service_Contact_Conversation_Greeting` — covert contact infrastructure.

### Yaki Leader

`Setup_Yaki_Leader` — comment: *"Listen to this cue being cancelled to catch the moment the Yaki are considered to be gone FOR NOW, and the plot should end."*

The Yaki Leader is the arc's persistent character. When the leader cue cancels, the arc concludes (Yaki considered gone).

### Yaki Pirate Jobs deactivation

`Deactivate_Yaki_Pirate_Jobs` (v2) — at certain story points, Yaki pirate jobs are deactivated. This affects faction.yaki AI behavior universe-wide.

### Yaki Wingmate

`Setup_Yaki_Wingmate` — comment: *"Switch faction, background, loadout, etc. for the Wingmate character."*

A wingmate character that gets re-assigned during the arc (faction/background/loadout swap).

### Dal Busta (optional)

`DEBUG_Setup_Dal` — comment: *"The story works with or without him. If he exists, he'll offer extra advice, and an optional mission at the end."*

**Dal Busta is OPTIONAL** for Yaki arc — your mod that disables Dal won't break Yaki, but loses additional content.

## Chapter-level structure

23 chapters is too many to list per-mission here. Key milestone chapters identified from cue structure:

### Ch1 — Escort + Silverback

- `Ch1_Setup_Escort_Ship` (v2) — initial escort mission setup
- `Ch1_Silverback_Friendly_Fire_Protection` — protects the **Silverback** from accidental friendly fire

**Silverback** is a **Military Supply Transport** escort ship (named at page 30225, line 202). Captain: **Nowak Lee** ("This is captain Nowak Lee of the Military Supply Transport Silverback."). The Silverback requires friendly-fire protection during the early arc to survive player accidents during escort missions.

### Ch2 — Defence Deployment

- `Ch2_Deploy_Defences_Ref` (refs `md.RML_DeployInPlace.DeployInPlace`) — deploy defensive structures

### Ch20 — Yaki Headquarters Invulnerability + Wingmate placement

- `Ch20_Make_Yaki_Headquarters_Invulnerable` (v2) — story-state makes Yaki HQ invulnerable
- `Ch20_Setup_Wingmate_In_Office_Patch_Helper` — wingmate placement save migration
- `Ch20_Setup_Appropriate_Welcome` (v2) — adjust welcome for chapter context

### Ch22 — Invasion Fleet + Freedom Mission

- `Ch22_Dal_Wingmate_Speak_Ref` (refs `md.LIB_Dialog.Speak_Actors`) — Dal + Wingmate joint speak
- `Ch22_Boso_Wingmate_Speak_Ref` — Boso + Wingmate joint speak
- `Ch22_Dialog_Inform_Mission_Invasion_Fleet_Approaching` — Invasion fleet approaching!
- `Ch22_Dialog_Freedom_Mission_Discussion_Prepared_Variant_*` — Freedom Mission variants
- `Ch22_A_Inform_Terran_Fleet` (v2) — inform Terran fleet
- `Ch22_C_Clean_Up_Mission` (v4) — Ch22 cleanup
- `Ch22_D_Setup_Reward_Ship` (1s polling) — setup reward ship
- `Ch22_F_FindObject_Ref` / `Ch22_G_FindObject_Ref` (refs `RML_FindObject.FindObject`) — find objects for reward

The Ch22 sequence is the **arc climax**: invasion fleet announcement → Freedom Mission discussion → Terran fleet response → cleanup → reward ship.

### Ch23 — Mission abort handling

- `Ch23_Dialog_Mission_Aborted_Cutscene` (instanced) — abort cutscene
- `Ch23_Dialog_Mission_Aborted_In_Person` (instanced) — in-person abort dialog

Ch23 handles **arc-failure / mission-abort** paths gracefully.

## Save migration patches

Yaki arc has multiple `Patch_*` cues for save compatibility:

- `Patch_Return_Cover_Ability` — fix cover ability state on save load
- `Patch_Transition_To_New_Cover_Handler` (v2) — migrate cover handler from older save version
- `PATCH_AddStoryMentors` — add story mentors
- `Setup_Terran_Outpost_Patch_Helper` — outpost setup migration
- `Ch20_Setup_Wingmate_In_Office_Patch_Helper` — wingmate placement migration
- `Ch22_Dialog_Freedom_Mission_Discussion_Prepared_Variant_Patch_While_Running` — Ch22 dialog mid-flight migration
- `Ch22_Dialog_Freedom_Mission_Discussion_Prepared_Variant_Patch_After_Cancel` — Ch22 dialog post-cancel migration

The **6+ patch cues** signal this is the most save-migration-aware arc in vanilla. Your mod's modifications must respect every patch.

## Debug_Skipper system

Like other large vanilla arcs, Yaki includes a **Debug_Skipper testing system**:
- `Debug_Skipper_Spawn` (instanced)
- `Debug_Skipper_Disconnect` (instanced)
- `Debug_Skipper_Conversation_Start/Main/Chapter_Options/Chapter_Selected/HQ/Reputation/Reputation_Selected` (all instanced)

This lets vanilla developers test individual chapters via Skipper conversation. **Modders should NOT depend on these**.

## Path completion summary

A completed Yaki arc yields:

- **Yaki Headquarters** unlocked / invulnerable per story state
- **Yaki Wingmate** as ally
- Yaki cover identity capabilities
- Reward ship from Ch22
- Story-state advance: Yaki considered "gone" (Yaki Leader cue cancellation)
- 23 chapters worth of accumulated faction state changes

## Mod conflict risks (Yaki-specific)

- ❌ **Mods that disable Yaki faction** break the entire 1.1MB arc
- ❌ **Mods that change Yaki Headquarters macro** break Ch20 invulnerability + Ch22 climax
- ❌ **Mods that disable Cover_Handler / cover-faction mechanics** break entire mid-arc
- ❌ **Mods that disable Friendly_Fire_Protection** affect Silverback (Ch1) + Terran Outpost
- ❌ **Mods that bulk-spawn Yaki ships** can conflict with story Yaki ship setup
- ❌ **Mods that change Yaki Pirate Jobs** affect `Deactivate_Yaki_Pirate_Jobs`
- ⚠ **Mods that disable Dal Busta** lose optional Dal content but don't break arc
- ⚠ **Custom faction cover systems** can collide with Cover_Handler
- ⚠ **Mods that change `cluster_112_sector001`** affect Yaki Home

## Code references

| Concern | Cue |
|---|---|
| Yaki Leader cue (cancellation = arc end) | `Setup_Yaki_Leader` |
| Yaki Headquarters | `Setup_Yaki_Headquarters` (v5) |
| Cover identity system | `Cover_Handler` (v2) + proximity checks |
| Wingmate | `Setup_Yaki_Wingmate` |
| Terran Outpost | `Setup_Terran_Outpost` (v4) + friendly fire protection |
| Secret Service Station | `Setup_Secret_Service_Station` (v2) |
| Ch1 Silverback | `Ch1_Setup_Escort_Ship` + Silverback FF protection |
| Ch2 Defence Deploy | `Ch2_Deploy_Defences_Ref` (refs RML_DeployInPlace) |
| Ch20 HQ invulnerability | `Ch20_Make_Yaki_Headquarters_Invulnerable` (v2) |
| Ch22 Invasion fleet climax | `Ch22_Dialog_Inform_Mission_Invasion_Fleet_Approaching` |
| Ch22 reward | `Ch22_D_Setup_Reward_Ship` (1s polling) |
| Ch23 mission abort | `Ch23_Dialog_Mission_Aborted_*` |
| Pirate Jobs deactivation | `Deactivate_Yaki_Pirate_Jobs` (v2) |

## Related

- [Terran arcs overview](/vanilla-content/missions/terran-arcs/)
- [Terran Core](/vanilla-content/missions/terran-arcs/core/) — Solar System restricted-territory enforcement (interacts with Yaki Ch1 Terran Outpost)
- [HQ Discovery](/vanilla-content/missions/terran-arcs/hq-discovery/) — concurrent Terran arc
- [Terran Terraforming](/vanilla-content/missions/terran-arcs/terraforming/) — references Yaki Scientist (cross-arc character)
- [Wiki: Save compatibility](/wiki/save-compatibility/) — Yaki's 6+ patches require strict save discipline

---

*Yaki is **the largest single arc in vanilla X4** — 1.1MB of MD, 23 chapters, 12+ sectors, optional Dal Busta integration, Yaki cover identity. Your mod compatibility audit MUST play through at least Ch1 through Ch22 climax to validate non-interference.*

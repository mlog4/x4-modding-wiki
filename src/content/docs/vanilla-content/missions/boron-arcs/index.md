---
title: Boron (Kingdom End) arcs
description: All 3 Kingdom End story arcs — Prelude, Main (1.6MB largest in vanilla), Epilogue. Boron Queen reclaim Boron home space arc.
---

The **Kingdom End DLC** (Boron) is the newest major content DLC, adding the **Boron faction return** and the recovery of Boron home space. It ships **3 arcs**:

- **[Prelude](/vanilla-content/missions/boron-arcs/prelude/)** — Heretic's End encounter, gate opening
- **[Main story](/vanilla-content/missions/boron-arcs/main/)** — The largest single arc in vanilla X4 (1.6MB, 10 chapters Ch0-Ch9 including Khaak Assault carrier combat)
- **[Epilogue](/vanilla-content/missions/boron-arcs/epilogue/)** — Kingdom End gates opening post-resolution

## Boron home space sectors

Kingdom End added these sectors (Boron home space):

| Sector macro | Vanilla name | Role |
|---|---|---|
| `cluster_601_sector001` | Watchful Gaze | Border/entry sector |
| `cluster_602_sector001` | Barren Shores | Prelude location |
| `cluster_603_sector001` | Great Reef | Story exploration |
| `cluster_604_sector001` | Ocean of Fantasy | Story midpoint |
| `cluster_605_sector001` | Sanctuary of Darkness (SoD) | Major story hub |
| `cluster_606_sector001` | Kingdom End I | Queen content |
| `cluster_606_sector002` | Reflecting Stars | Queen content |
| `cluster_606_sector003` | Towering Wave | Queen content |
| `cluster_607_sector001` | Rolk's Demise | Late-game content |
| `cluster_608_sector001` | Atreus Clouds | Late-game content |
| `cluster_609_sector001` | Menelaus Oasis | Late-game content |

Plus pre-existing sectors used as Kingdom End touch-points:

- `cluster_31_sector001` (Heretic's End) — Prelude location
- `cluster_30_sector001` (Morning Star III) — Story side content
- `cluster_48_sector001` (Getsu Fune) — Bridge to other content

## Persistent characters

The Boron arc anchors many characters (more than any other DLC):

| Character | Role |
|---|---|
| **Alliance Leader (ALI)** | Player's main contact, faction.alliance |
| **Nila** | Companion Boron NPC, multi-chapter |
| **LedaWe** | Story-specific Boron |
| **Boron Queen** | The Queen of Boron, Chapter 7 climax |
| **Mission Specialist** | Story logistics |
| **Boron Herald** (2 variants) | Court ceremonial |
| **Boron Announcer** | Court ceremonial |
| **Boron Scientist** | Research dialogue |
| **Bar Witness** | Side-quest NPC |
| **Paranid Emissary** | Diplomatic NPC |
| **Numanckaret** | Named Boron Captain |

Your mod **must not** despawn any of these or block their dialog.

## Faction interactions

- `faction.boron` — main Boron faction
- `faction.alliance` — Alliance subfaction (Alliance Leader)
- `faction.paranid` — Diplomatic content
- `faction.holyorder` — Court relations
- `faction.player` — All player-facing content

## Key gameplay features

The arc introduces / heavily uses:

- **Long-Range Scan (LRS)** — Chapter 1 hint system (`Ch1_Player_LRS_Hint`)
- **Watchful Gaze proximity checks** — early exploration gating
- **Boron Queen Transport Ship** — Chapter 7 transport mission
- **Sanctuary of Darkness** — central plot hub
- **Approach handlers** (`md.LIB_Generic.ApproachObject_Handler`) — used extensively for narrative gating

## Mod conflict risks (Boron-specific)

- ❌ **Kingdom End DLC required** — script load failure without it
- ❌ **Mods that change `faction.boron` relations at start** affect arc availability
- ❌ **Mods that change `faction.alliance` make Alliance Leader hostile** break arc
- ❌ **Mods that block access to Watchful Gaze / Barren Shores** prevent arc start
- ❌ **Mods that destroy Sanctuary of Darkness sector** break Chapter 6+
- ⚠ **Boron-relation mods** affect arc tone and outcome dialog
- ⚠ **Map mods that change Kingdom End sector layouts** break narrative flow

## Related

- [Mission encyclopedia](/vanilla-content/missions/) — landscape
- [Prelude](/vanilla-content/missions/boron-arcs/prelude/) — arc entry
- [Main story](/vanilla-content/missions/boron-arcs/main/) — biggest vanilla arc (Ch0-Ch7)
- [Epilogue](/vanilla-content/missions/boron-arcs/epilogue/) — Kingdom End gates opening
- [Game starts catalog](/vanilla-content/game-starts/) — gs_boron1, gs_boron2

---

*Kingdom End is X4's most ambitious single DLC narratively. Your mod's compatibility audits should walk through it on at least one save.*

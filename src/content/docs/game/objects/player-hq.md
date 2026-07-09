---
title: Player Headquarters (HQ)
description: Player's central station — research, terraforming, embassy, story arc anchor. Macro station_pla_headquarters_base_01_macro. Two constructionplan variants depending on game start.
---

The **Player Headquarters (HQ)** is the **player's central station** — the anchor for HQ research, terraforming, embassy (Mentor Subscriptions), and most major story arc hooks (Paranid Civil War, HQ Discovery, Welfare research, Yaki arc, etc.).

NOT a special engine class — the HQ is a [Station](/game/objects/station/) with a specific macro and constructionplan. Modders interact with it via that macro identity.

## Macro

```
macro.station_pla_headquarters_base_01_macro
```

## Construction plans (two variants)

Depending on game start / unlock path:

| Constructionplan | Used by |
|---|---|
| `x4ep1_playerheadquarters` | Default — used in [Mentor Subscriptions](/vanilla-content/missions/pirate-arcs/) HQ creation |
| `x4ep1_playerheadquarters_pioneer_configuration` | Pioneer variant — used in [HQ Discovery](/vanilla-content/missions/terran-arcs/hq-discovery/) when game start is `x4ep1_gamestart_terran2` |

## Owner

- **Player faction**: `faction.player` (canonical)
- **Pioneer variant**: `faction.pioneers` (during HQ Discovery transition; ownership changes to player after arc)

## Sector

The HQ's sector is set per-game-start:

| Game start | HQ sector |
|---|---|
| Wayward Scion / Young Gun / others | Set by Mentor Subscriptions setup |
| Terran Cadet / Pioneer | `cluster_114_sector001` (HQ Sector — Brennan's Triumph area) |
| Custom-gamestart skip | Created via `Setup_Remember_Boso_HQ` mechanism |

## Identification check (canonical)

To identify a station as the player HQ:

```xml
<do_if value="$station.macro.ismacro.{macro.station_pla_headquarters_base_01_macro}">
    <!-- This is the Player HQ -->
</do_if>
```

This check appears in many vanilla scripts — see `npc_itemtrader.xml`, `npc_shadyguy.xml`.

## Story arcs anchored to HQ

The HQ is the **physical anchor** for:

| Story arc | Connection |
|---|---|
| [HQ Discovery](/vanilla-content/missions/terran-arcs/hq-discovery/) | How the player finds and claims the HQ |
| [Paranid Civil War](/vanilla-content/missions/paranid-civil-war/) | Dal Busta desk at HQ; conversations at HQ |
| [Welfare research](/vanilla-content/missions/base-game-arcs/welfare-research/) | Research entry at HQ |
| [Diplomacy Intro](/vanilla-content/missions/base-game-arcs/diplomacy-intro/) | Dal Busta HQ desk management |
| [Yaki arc](/vanilla-content/missions/terran-arcs/yaki/) | Yaki contacts at HQ |
| [Terran Core / Terraforming](/vanilla-content/missions/terran-arcs/) | Terraforming projects at HQ |
| [Pirate Welfare 2](/vanilla-content/missions/pirate-arcs/welfare-2/) | Research follow-up at HQ |
| [Tides of Avarice: Unbihexium / Cypher](/vanilla-content/missions/tides-arcs/) | Sobert agent + research at HQ |
| [Boron Main story](/vanilla-content/missions/boron-arcs/main/) | LRS hints + research from HQ |
| [Timelines Epilogue](/vanilla-content/missions/timelines-arcs/research-epilogue/) | Boso HQ unlock |

## Special HQ features

The HQ is a special station with:

- **Research system** — `ware.research_X.research.unlocked` properties for tracking research progress
- **Terraforming infrastructure** — see [Terraforming catalog](/vanilla-content/terraforming/)
- **Embassy office room** — added by `md.X4Ep1_Mentor_Subscriptions.Manage_EmbassyOffice_Room` when Embassy research unlocks
- **Skipper / Boso Ta meeting point** — many vanilla NPCs cross-arc at HQ
- **Anchored encyclopedia entry** — `encyclopedia="true"` flag

## HQ pre-creation example (custom gamestart skip)

From [HQ Discovery](/vanilla-content/missions/terran-arcs/hq-discovery/) vanilla code:

```xml
<create_station 
    name="$HQ" 
    macro="macro.station_pla_headquarters_base_01_macro" 
    constructionplan="'x4ep1_playerheadquarters_pioneer_configuration'" 
    sector="$HQSector" 
    owner="faction.pioneers" 
    encyclopedia="true">
    <safepos x="-207000" y="-1100" z="-31000" />
</create_station>
```

## Mod conflict risks

- ❌ **Mods that replace the HQ macro** break ALL story arcs that reference it
- ❌ **Mods that change the constructionplan** affect initial HQ state
- ❌ **Mods that disable research / terraforming systems** break HQ functionality
- ❌ **HQ-replacement mods incompatible with most story content** — especially HQ Discovery
- ⚠ **HQ-relocation mods** may break sector-bound arcs (Boron LRS, Wayward Scion intro)
- ⚠ **Custom HQ macros must match `macro.ismacro` check** — many vanilla scripts hardcode the macro

## Related

- [Station](/game/objects/station/) — HQ inherits from station
- [Container](/game/objects/container/) — HQ uses container's build infrastructure
- [Faction](/game/factions/faction/) — `faction.player` typical owner
- [HQ Discovery story](/vanilla-content/missions/terran-arcs/hq-discovery/) — main HQ acquisition arc
- [Terraforming catalog](/vanilla-content/terraforming/) — HQ-anchored terraforming
- [Architectural overview: Faction economy](/overviews/faction-economy/) — economic context

---

*The Player HQ is the most modder-impacted single station in vanilla. Its macro identity is checked in ~20 vanilla scripts; changing it breaks them all. If your mod adds custom HQ-style stations, use a different macro and integrate via your own story arcs.*

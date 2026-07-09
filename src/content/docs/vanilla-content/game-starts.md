---
title: Game starts catalog
description: All 8 vanilla game starts — Wayward Scion, Young Gun, Boso Ta, Workshop, etc. What each starts the player with, which story arcs unlock, conflict risks.
---

X4 ships **8 game starts** (`gs_*.xml`). Each is a distinct player-experience: starting sector, starting ship, starting wealth, starting story hooks. This catalog covers what each start does and how mods that touch starts can conflict.

## Game starts at a glance

| Start ID | Script | Display name | DLC | Theme |
|---|---|---|---|---|
| Wayward Scion | `gs_intro.xml` | Wayward Scion | Pirate (x4ep1) | Story-driven default |
| Young Gun | `gs_tutorial.xml` | Young Gun | Pirate (x4ep1) | Guided tutorial start |
| Custodian Errand (Boso Ta) | `gs_boso.xml` | The Custodian's Errand (Boso Ta) | Pirate (x4ep1) | Skipper-anchored |
| Untested Explorer | `gs_discover.xml` | The Untested Explorer | Pirate (x4ep1) | Explorer-themed |
| Dedicated Warrior | `gs_fight.xml` | The Dedicated Warrior | Pirate (x4ep1) | Combat-themed |
| Unworthy Entrepreneur | `gs_trade.xml` | The Unworthy Entrepreneur | Pirate (x4ep1) | Trade-themed |
| Terraforming Scientist | `gs_scientist.xml` | (Scientist start) | Pirate (x4ep1) | Late-game start with HQ + research |
| Station Workshop | `gs_workshop.xml` | Custom Gamestart (Workshop) | Pirate (x4ep1) | Sandbox / station design |

**Note**: All these scripts depend on `x4ep1_gamestart_*` modules — they require the **Pirate DLC** despite some being "vanilla-feel" starts. The actual base-game start (pre-DLC) used a slightly different chain.

---

## Wayward Scion (gs_intro)

**The default story start**. The "canonical" experience for new players.

### What you get

- Pre-uncovered map of 8 sectors:
  - `cluster_29_sector001`, `cluster_29_sector002` (Argon space)
  - `cluster_14_sector001` (starting sector)
  - `cluster_07_sector001`, `cluster_08_sector001`
  - `cluster_34_sector001`, `cluster_13_sector001`, `cluster_12_sector001`
- Pre-uncovered shipyards / wharfs / trade stations in the above
- HAT broadcast triggered 30 seconds in → opens [Diplomacy intro arc](/vanilla-content/story-arcs/#diplomacy-intro-arc)

### What unlocks

- Diplomacy intro story → embassy research → diplomacy mechanics
- Standard relation tiers (default Argon = friendly)
- Standard generic mission availability

### Mod conflict risks

- ⚠ **HAT broadcaster needed** — mods that disable HAT spawning break the intro
- ⚠ **8 pre-uncovered sectors expected to be Argon-friendly territory** — mods that change ownership of these break the "safe start" assumption

---

## Young Gun (gs_tutorial)

**Tutorial-focused start** for new players. Heavy guidance.

### What you get

- Smaller initial map (3 sectors: cluster_06, cluster_13, cluster_14)
- Heavily-guided early game with tutorial missions
- Starting ship + basic credits

### What unlocks

- All [Tutorial missions](/game/missions/tutorial-mission/) become available
- Story arcs start delayed until tutorials complete

### Mod conflict risks

- ⚠ **Tutorial overhauls** (mods that change controls/UI) confuse the tutorial scripts
- ⚠ **Tutorial scripts assume vanilla key bindings** — modded bindings show wrong on-screen prompts

---

## Custodian's Errand / Boso Ta (gs_boso)

Start named "The Custodian's Errand" — Boso Ta linked. Themed around **Grand Exchange**.

### What you get

- Initial map covers cluster_01 (Grand Exchange) + cluster_02 + cluster_03
- Starting context: Boso Ta-associated NPC
- Possibly HQ-already-unlocked path

### Mod conflict risks

- ❌ **Don't disable Boso Ta** — anchored NPC required
- ⚠ **HQ-related mods break this start specifically**

---

## Untested Explorer (gs_discover)

**Explorer-themed start**. Smaller starting bubble, exploration encouraged.

### What you get

- Pre-uncovered: cluster_01_sector001, cluster_04_sector002, cluster_06, cluster_13
- Starting ship oriented toward exploration (scanner-equipped)
- Reduced starting credits

### Mod conflict risks

- ⚠ **Map-overhaul mods break the discovery loop** — discovery missions reference specific gates
- ⚠ **Scanner-equipment mods that change scanner mechanics affect early gameplay**

---

## Dedicated Warrior (gs_fight)

**Combat-focused start**. Starting in Paranid-adjacent space, hostile encounters expected.

### What you get

- Pre-uncovered: cluster_09, cluster_10, cluster_11 (Paranid Monument!), cluster_18, cluster_19
- Combat-oriented starting ship
- Possibly anti-Paranid relations

### Mod conflict risks

- ❌ **Paranid Monument (cluster_11) referenced** — story_paranid.xml uses this; combat start places player there → arc-interaction risk
- ⚠ **Combat-rebalance mods that nerf player damage make this start frustrating**

---

## Unworthy Entrepreneur (gs_trade)

**Trade-focused start**. Starting in Teladi territory.

### What you get

- Pre-uncovered: cluster_19, cluster_20, cluster_42, cluster_43
- Trade-oriented starting ship (cargo capacity)
- Starting credits higher than other starts

### Mod conflict risks

- ⚠ **Economy mods affect this start most** — trade-themed gameplay relies on vanilla ware prices
- ⚠ **Teladi-relation mods change the starting environment**

---

## Terraforming Scientist (gs_scientist)

**Late-game start** with HQ already unlocked + terraforming research progress.

### What you get

- Pre-unlocked HQ
- Starting research progress (welfare module, possibly more)
- Likely starting credits + advanced ship
- All starting research feeds into [Terraforming catalog](/vanilla-content/terraforming/)

### Mod conflict risks

- ❌ **Terraforming-rebalance mods break this start severely** — pre-progressed state assumes vanilla resource costs
- ❌ **HQ-replacement mods incompatible** — start expects vanilla HQ macro
- ⚠ **Research-tree mods cause initial-research state to be malformed**

---

## Station Workshop (gs_workshop)

**Sandbox start** for station-design experimentation. "Welcome to your office. Here you can plan and design your station layouts."

### What you get

- Station design plot pre-allocated
- "Plan Build" option available immediately on map
- Likely high starting credits / infinite cargo for design iteration
- Map covers stage-design relevant areas

### Mod conflict risks

- ⚠ **Station building mods affect this start most** — sandbox premise relies on vanilla module catalog
- ⚠ **Module diff'ing mods change what's available in build menu**

---

## Common start-mod conflicts

### Custom start mods (most common)

Modders often add new game starts. Vanilla pattern:

```xml
<cue name="Start" module="my_mod_gamestart_X">
    <conditions>
        <event_cue_signalled cue="md.Setup.GameStart"/>
    </conditions>
    <actions>
        <!-- Uncover map -->
        <run_actions ref="md.LIB_Generic.UncoverMap_SectorsAndGates">...</run_actions>
        <!-- Spawn starting ship -->
        <!-- Set starting credits -->
        <!-- Hook into specific story arcs OR skip them -->
    </actions>
</cue>
```

**Critical**: `gamestart.storystate.story_paranid_uni_*` flags (see [Story arcs catalog](/vanilla-content/story-arcs/)) control which story arcs activate. Custom starts must set these flags to control story behavior.

### Mid-game start mods

Some mods give "skip to mid-game" starts. These need to:

1. Set HQ as already-unlocked (matching gs_scientist pattern)
2. Set research progress accordingly
3. Set faction relations to reflect mid-game state
4. Possibly mark some story arcs already-complete

Half-done states confuse subsequent story progression.

### Faction-rebalance mods

If your mod changes initial faction relations galaxy-wide, **every game start is affected**. Test each:

- Does Wayward Scion still feel "balanced"?
- Does Dedicated Warrior still have combat targets?
- Does Trade still have viable routes?

Don't assume one good test covers all.

## Code references

| Concern | File |
|---|---|
| Game start canonical pattern | `gs_intro.xml` (Wayward Scion) |
| Map uncovering | `md.LIB_Generic.UncoverMap_SectorsAndGates` (called from every gs_) |
| Story state flags | `gamestart.storystate.story_*` |
| Start hook to story | `gs_intro.xml:30-50` (HAT broadcast trigger) |
| Mid-game state setup | `gs_scientist.xml` (HQ + research preload) |

## Related

- [Vanilla content index](/vanilla-content/)  — landscape
- [Story arcs catalog](/vanilla-content/story-arcs/) — what each start unlocks
- [Terraforming catalog](/vanilla-content/terraforming/) — gs_scientist preload
- [Tutorial missions (technical)](/game/missions/tutorial-mission/) — gs_tutorial integration
- [Wiki: DLC handling](/wiki/dlc-handling/) — all starts are x4ep1 modules

---

*Game starts are the player's first impression. A mod that breaks vanilla starts loses the player in the first 5 minutes — when frustration tolerance is lowest.*

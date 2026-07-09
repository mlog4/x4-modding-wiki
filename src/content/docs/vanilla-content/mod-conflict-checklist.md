---
title: Mod-conflict checklist
description: Pre-publish checklist organized by mod category. What to verify against vanilla content before your mod ships, ordered by failure cost.
---

This is the **pre-publish checklist** — for each common mod category, here's what vanilla content your mod must coexist with. Items ordered by failure cost (top = most dangerous to miss).

## Universal pre-publish checks

Apply these to EVERY mod regardless of category:

- [ ] **Test all 8 [game starts](/vanilla-content/game-starts/)** — at minimum 60 seconds in each. Any debug.log spam? UI overlay breaks?
- [ ] **Test save-resume cycle** — save with mod enabled, quit, restart, load. See [Wiki: Save compatibility](/wiki/save-compatibility/)
- [ ] **Test DLC absence** — for each DLC, disable it and verify your mod still loads. See [Wiki: DLC handling](/wiki/dlc-handling/)
- [ ] **Test with no other mods active** — your mod alone
- [ ] **Test with 1-2 popular mods active** (workshop top-list) — known conflicts surface here
- [ ] **Check debug.log for `Property lookup failed:`** — silent vanilla breakage shows here
- [ ] **Verify content.xml dependencies declared** — every DLC requirement / dependency on other mods

---

## If your mod adds factions

### Vanilla content to coexist with

- [Story arcs](/vanilla-content/story-arcs/) — many arcs check specific faction relations + hostility
- [Faction subscriptions](/vanilla-content/faction-subscriptions/) — vanilla wars expect known faction set

### Pre-publish checks

- [ ] **Faction relations initialized cleanly** — see existing factionrelations.xml; don't leave gaps
- [ ] **Faction relations to all 24+ vanilla factions defined** — missing entries default unpredictably
- [ ] **Faction-internal hostility configured** — your faction should have at least one "enemy of" and one "ally of"
- [ ] **Add to god.xml seeding** — see [god.xml docs](/lang/data/god-xml/)
- [ ] **Add to libraries/factions.xml** — race + headquarters + display name
- [ ] **Add station macros** — without these, no faction infrastructure
- [ ] **Test that vanilla wars (ARG_VS_XENON etc.) still work** — your faction shouldn't disrupt vanilla war contact NPCs
- [ ] **Test that subscriptions still load** — vanilla subscription scripts iterate `faction.list` — your faction must not break iteration

### Conflict hot spots

- Mods that hardcode faction lists in MD scripts (your faction won't appear in their UIs)
- Vanilla `gmc_*` catalogues that filter by faction (your faction won't generate missions unless explicit)
- Vanilla relation-tier checks fire at game start; your faction's default relations may trigger wrong arcs

---

## If your mod adds missions

### Vanilla content to coexist with

- [Generic mission catalog](/game/missions/generic-mission/) — 37 vanilla templates already exist
- [Story arcs catalog](/vanilla-content/story-arcs/) — story missions you may interfere with
- [Faction subscriptions](/vanilla-content/faction-subscriptions/) — repeating offer feeds

### Pre-publish checks

- [ ] **Mission group declared** — see [Mission group](/game/factions/missiongroup/) — without one, your mission shows as uncategorized
- [ ] **Mission category set in `create_mission`** — `war`/`dynamic`/`subscription`/`assisted_task`/`story`/`tutorial`/`guidance`
- [ ] **Reward routed through `LIB_Reward_Balancing`** — vanilla economy-consistent
- [ ] **Cleanup cue handles `event_mission_aborted`** — see [Mission events](/game/missions/mission-events/)
- [ ] **`event_mission_aborted` fires on completion too** — your cleanup runs on completion path; ensure it's idempotent
- [ ] **Offer location supports `.offerlocations`** — see [Generic missions](/game/missions/generic-mission/#mission-offer-locations)
- [ ] **Text references in `t/<lang>.xml`** — missing translations show `{page,id}` literals
- [ ] **Test your mission interacts cleanly with vanilla story arcs** — particularly Paranid civil war if your mission touches HOL/argon/paranid

### Conflict hot spots

- Your custom signal-leak missions compete with `gmc_dynamic` offers
- Your custom BBS-style missions compete with `gmc_assisted_task` offers
- Mission groups overlap: vanilla `MG_*` constants taken; pick distinct `mlog_*` prefix

---

## If your mod adds new sectors or changes ownership

### Vanilla content to coexist with

- [Story arcs](/vanilla-content/story-arcs/) — references specific sector macros (cluster_04_sector001 for Paranid story chapter 2, cluster_35_sector001 for derelict, cluster_36_sector001 for Cardinal, cluster_11_sector001 for Paranid Monument, cluster_22_sector001 for Trinity)
- [Game starts](/vanilla-content/game-starts/) — pre-uncovered sectors expected to be specific faction
- Terraforming planets

### Pre-publish checks

- [ ] **Don't replace sector macros referenced by story arcs** — grep `story_*.xml` for `cluster_X` before changing X
- [ ] **Don't change ownership of `cluster_36_sector001` (Cardinal's Redress)** at game start — Paranid story expects neutral
- [ ] **Don't change ownership of `cluster_11_sector001` (Paranid Monument)** — story breaks
- [ ] **Don't change ownership of `cluster_22_sector001` (Trinity Sanctum)** — Trinity arc breaks
- [ ] **New sectors registered in galaxy macro** — without registration, factions ignore them
- [ ] **Sector ownership decided** — null-owner sectors fall to default behavior
- [ ] **Test gates connect properly** — orphan sectors break exploration

### Conflict hot spots

- god.xml diff conflicts with other sector mods
- Vanilla story `find_sector` calls fail if you've changed macro IDs

---

## If your mod changes economy / ware values

### Vanilla content to coexist with

- [Terraforming catalog](/vanilla-content/terraforming/) — 99 projects consuming many wares
- [Faction subscriptions → Trade](/vanilla-content/faction-subscriptions/#trade-subscriptions--2-guilds) — trade missions price-sensitive
- Reward calculation for ALL missions

### Pre-publish checks

- [ ] **Test terraforming UI** — costs sensible? Players able to afford?
- [ ] **Test mission rewards** — generic mission for "deliver 100 microchips" — what reward does vanilla offer with your mod?
- [ ] **Test faction economy soak** — let game run 2 hours, factions still solvent?
- [ ] **Test trade subscription missions** — Antigone/Teladi missions still profitable?

### Conflict hot spots

- Ware-value changes propagate through 100+ vanilla calculations
- Missing ware value definitions (you removed a ware) → vanilla scripts reference non-existent ware

---

## If your mod adds custom game starts

### Pre-publish checks

- [ ] **Standardize naming**: `module="my_mod_gamestart_X"`
- [ ] **Uncover map via `md.LIB_Generic.UncoverMap_SectorsAndGates`** — don't write custom uncovering
- [ ] **Set `gamestart.storystate.story_paranid_*` flags** if your start should skip Paranid intro
- [ ] **Don't break HAT broadcast** — vanilla intro arc needs it for non-custom starts
- [ ] **Set starting relations explicitly** — don't rely on defaults

### Conflict hot spots

- Multiple custom-start mods overwriting each other's setup
- Custom start that doesn't set storystate flags → vanilla Paranid arc tries to start mid-game

---

## If your mod changes NPC spawning

### Vanilla content to coexist with

- Story arc anchored NPCs (Cardinal, Boso Ta, Reen, etc. — see [Story arcs → Persistent characters](/vanilla-content/story-arcs/#persistent-characters))
- Subscription contact NPCs (war contacts, mentor RM_SETA)
- Terraforming Skipper

### Pre-publish checks

- [ ] **Don't fill all `tag.npc_*` slots on key stations** — story NPCs need slots
- [ ] **Spawn NPCs with `$slottags=[tag.npc_generic]`** — vanilla compatible
- [ ] **Use `add_anchored_object` for persistent NPCs** — paired with cleanup
- [ ] **Don't `destroy_object` on actors you didn't create**
- [ ] **Test that vanilla Cardinal/Boso Ta/Reen still spawn** — your mod's bulk NPC spawning may starve them of slots

### Conflict hot spots

- NPC Placement Manager has finite slot capacity per station
- Multiple character mods spawning at same station = race / lost spawns

---

## If your mod adds tutorials

### Pre-publish checks

- [ ] **Register in `md.Tutorial_Global.$completed_tutorials`** — see [Tutorial missions](/game/missions/tutorial-mission/)
- [ ] **Don't re-offer completed tutorials** — track completion flag
- [ ] **Use `signal_cue md.HUD.ShowGuidance` for prompts** — vanilla mechanism
- [ ] **Patch-migration for completed_tutorials list** — older saves don't have your tutorial id

---

## Integration with existing mods

If you're publishing alongside common mod stacks, check compatibility with:

| Common mod | What it changes | Your mod's risk |
|---|---|---|
| **DeadAir mods** | Economy + scripts | Economic conflicts; mission reward math |
| **VRO** (Variety Rebalance Overhaul) | Ship balance | Combat-tuning conflict |
| **SirNuke's Hotkey Manager** | UI hotkeys | UI hook conflict |
| **Mules**, **Improved Trade** | Trader behavior | Trade subscription interference |
| **Sector Satellites** | NPC spawning | NPC slot pressure |
| **Civilian Density** | Mass traffic | `gm_killmasstraffic` mission target population |

(Where applicable — your mod's manifest can declare an `optional` dependency or recommend mod load order.)

---

## When something breaks

If your mod ships and players report breakage:

1. **Get debug.log** — players send `Documents/Egosoft/X4/<save>/debug.log` 
2. **Search for `Property lookup failed:` near your mod's namespace**
3. **Search for `event_mission_aborted` in unexpected places** — mission cleanup running for the wrong cause
4. **Check `add_anchored_object` leaks** — your mod's actors persisting after they should despawn
5. **Walk save through every vanilla story arc** — verify each still fires correctly

See [Wiki: Debugging strategies](/wiki/debugging-strategies/) for the diagnosis ladder.

---

## Related

- [Vanilla content index](/vanilla-content/)  — landscape
- [Story arcs catalog](/vanilla-content/story-arcs/)
- [Terraforming catalog](/vanilla-content/terraforming/)
- [Faction subscriptions catalog](/vanilla-content/faction-subscriptions/)
- [Game starts catalog](/vanilla-content/game-starts/)
- [Wiki: Mod compatibility](/wiki/mod-compatibility/) — broader compatibility discipline
- [Wiki: Save compatibility](/wiki/save-compatibility/) — version=/patch= discipline
- [Wiki: DLC handling](/wiki/dlc-handling/) — DLC presence checks
- [Wiki: Debugging strategies](/wiki/debugging-strategies/) — diagnose conflicts

---

*The cost of a conflict checklist run is ~30 minutes. The cost of a broken save report from a player is ~3 hours of debugging + a 2-star Workshop review. The arithmetic recommends itself.*

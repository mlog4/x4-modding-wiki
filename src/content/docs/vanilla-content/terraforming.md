---
title: Terraforming catalog
description: 99 vanilla terraforming projects across 13 categories. What each does, resources required, why your economy mod needs to care.
---

The terraforming system is X4's **late-game economic+narrative** content. The player invests massive ware quantities + research time across hundreds of in-game hours to transform planets. Vanilla ships **99 distinct projects** across **13 categories**.

This page is a player-facing catalog of what terraforming covers and where mods commonly conflict.

## Project categories (99 total)

| Category | Count | Theme |
|---|---|---|
| **Xenon** | 15 | Manage Xenon threats during terraforming |
| **Biosphere** | 10 | Forestation, fertilization, parasites |
| **Training** | 9 | Population training projects |
| **Economy** | 8 | Banks, campuses, clinics, nividium |
| **Amenities** | 8 | Resorts, temples, parks, fine dining |
| **Cleanup** | 6 | Methane/carbon/toxin removal |
| **Events** | 6 | Quakes, ice melt, global warming events |
| **Housing** | 5 | Population housing |
| **Industry** | 4 | Manufacturing projects |
| **Water** | 3 | Cloud particles, import, irrigation |
| **Special** | 3 | Moholes, blackdust, volcano caps |
| **Power** | 3 | Power infrastructure |
| **Atmosphere** | 3 | Methane/helium/nitrogen handling |

## Sample projects from each category

### Water (3 projects)

| ID | Display name | Effect |
|---|---|---|
| `tmp_cloudparticles` | Cloud Seeding | Triggers rainfall, increases water |
| `wat_import` | Water Import | Import ice/water from off-planet |
| `wat_irrigation` | Irrigation Network | Distribute water across surface |

### Atmosphere (3 projects)

| ID | Effect |
|---|---|
| `atm_methane_import` | Increase methane atmospheric content |
| `atm_nitrogen_fix` | Nitrogen-fix bacteria, atmosphere balance |
| `atm_helium_import` | Import helium for atmospheric pressure |

### Cleanup (6 projects)

| ID | Effect |
|---|---|
| `atm_methane_oxidizers` | Build oxidizer infrastructure |
| `atm_methane_oxidize` | Consume oxidizers to remove methane |
| `atm_carbon_mineralizers` | Mineralizer infrastructure |
| `atm_carbon_mineralize` | Consume mineralizers, remove CO2 |
| `atm_toxin_cleanup` | Toxin removal |
| `ter_radioactive_cleanup` | Radiation cleanup |

The **infrastructure → consume** two-step is a vanilla pattern — build the converter, then operate it. Modders adding terraforming projects should follow this.

### Biosphere (10 projects)

| ID | Effect |
|---|---|
| `bio_jumpstart` | Initial life seeding |
| `bio_cyanobacteria` | Atmosphere conversion via bacteria |
| `bio_reintroduce` | Reintroduce native species |
| `bio_cull` | Population control |
| `bio_tailored` | Engineered lifeforms |
| `bio_parasites_cull` | Eliminate problem parasites |
| `bio_toxicfruit_cull` | Remove toxic fruit population |
| `bio_toxicfruit_genemod` | Gene-modify toxic fruit to be safe |
| `agr_fertilize` | Agricultural fertilization |
| `agr_forestation` | Forest planting |

### Special (3 projects)

| ID | Effect |
|---|---|
| `tmp_moholes` | Drill moholes for geothermal access |
| `tmp_blackdust` | Application of blackdust for albedo change |
| `ter_volcanocaps` | Cap active volcanoes |

### Events (6 projects)

These are **NEGATIVE events** that fire during terraforming — quakes, ice melt, runaway warming. Players must respond:

| ID | Event |
|---|---|
| `evt_quake_mild`, `evt_quake_moderate`, `evt_quake_severe` | Earthquake disasters |
| `evt_icemelt` | Catastrophic ice melt |
| `evt_globalwarming_co2` | Runaway CO2 warming |
| `evt_globalwarming_methane` | Runaway methane warming |

### Economy (8 projects)

| ID | Effect |
|---|---|
| `eco_bank` | Build banking infrastructure |
| `eco_bank_supply` | Run the bank (passive income) |
| `eco_campus` | Build campus (training capacity) |
| `eco_campus_supply` | Operate campus |
| `eco_clinic` | Build clinic |
| `eco_clinic_supply` | Operate clinic |
| `eco_nividium` | Build nividium-extraction infrastructure |
| `eco_nividium_supply` | Operate nividium mining |

### Amenities (8 projects)

| ID | Theme |
|---|---|
| `ame_art_college` | Art college |
| `ame_finedining` | Fine dining establishments |
| `ame_resort_tropical` | Tropical resort |
| `ame_resort_winter` | Winter resort |
| `ame_temple` | Religious temple |
| `ame_themepark` | Theme park |
| `ame_venues` | Entertainment venues |
| `ame_zoo` | Zoo |

### Xenon (15 projects)

The largest category — Xenon-management during terraforming. Includes alertness mitigation, production reduction, defensive projects. (Details intentionally compressed — vanilla terraforming is THE place to look at how Xenon are mechanically integrated.)

## Resource consumption — wares used

Terraforming projects consume a broad spread of vanilla wares:

```
energycells, advancedcomposites, advancedelectronics, antimattercells,
antimatterconverters, claytronics, dronecomponents, engineparts, 
fieldcoils, foodrations, graphene, helium, hullparts, hydrogen, ice, 
majadust, majasnails, meat, medicalsupplies, methane, ...
```

The ware consumption is **massive** — a single major project can consume thousands of advanced wares. This is the late-game economic gold sink.

## Skipper NPC

The terraforming arc revolves around the **Skipper NPC** (also called the Skipper). Players interact via Skipper conversations. Vanilla has Debug_Skipper cues for testing — these show the conversation structure modders should follow.

Skipper appears in `terraforming.xml` (`Debug_Skipper`, `Terraforming_Skipper_Project_StartedProduction`, `Terraforming_Skipper_Project_Finished`).

## Where conflicts arise

### Economy-rebalance mods

Terraforming consumes the same wares as ship production. Mods that:

- Make advanced wares cheaper → trivialize terraforming
- Make advanced wares scarcer → make terraforming impossible
- Add new "advanced" ware tiers → terraforming projects skip them (won't auto-include in supply chain)

Test: open terraforming UI after enabling your mod. Are projected costs sensible?

### HQ replacement mods

Terraforming gates on **player HQ**. Mods that:

- Skip the HQ unlock
- Replace HQ with a custom station
- Move HQ to non-standard sector

…break the terraforming Skipper anchor. Specifically, `Terraforming_Skipper_Project_StartedProduction` listens at HQ.

### Sector-replacement mods

Terraforming targets specific terraformable planets. Mods that:

- Replace cluster/sector macros referenced by terraforming
- Change planet macros (`planet_X_macro`)
- Add new planets without terraforming registration

…break the project library. Your new planets won't appear; vanilla planets may de-register.

### Mod adding new terraforming projects

To add a new project:

1. Diff `libraries/terraforming.xml` — declare a new `<project id=>` entry
2. Add to a `group=` (or declare a new group)
3. Specify resource consumption (wares + amounts)
4. Set `duration=` and `repeatcooldown=`
5. Add text references (`name="{20227,XXXX}"` format)

The 99 vanilla projects show what's possible; copy the closest pattern.

### Engine-event conflicts

If your mod fires custom faction events at the player HQ, watch for **Skipper conversation interruption** — the Skipper steps through scripted dialog and ignores parallel events badly.

## Common gotchas

- ⚠ **Project repeats need `repeatcooldown=`** — without it, players can spam-execute infinite times
- ⚠ **`resilient="true"`** flag — controls whether the project survives a save-load mid-execution
- ⚠ **Resource caps** — terraforming projects must respect station storage capacity; oversize requests stall
- ⚠ **Debug_Skipper bypasses gating** — vanilla uses `Debug_Skipper_CheatHQStorage` etc. for testing; **don't** ship a mod that relies on debug cues
- ⚠ **Group `xenon`** projects have hidden activation conditions tied to Xenon threat — your mod making Xenon docile breaks these

## Code references

| Concern | Where to read |
|---|---|
| Full project definitions | `libraries/terraforming.xml` (99 projects) |
| Project state machine | `terraforming.xml` (5616 lines, Skipper + project lifecycle) |
| Resource cost pattern | Search `<ware ware=` in `libraries/terraforming.xml` |
| Test/Debug Skipper conversations | `terraforming.xml` `Debug_Skipper_*` cues |
| Project completion handler | `terraforming.xml` `Terraforming_Skipper_Project_Finished` |
| Schema | `libraries/terraforming.xsd` |

## Related

- [Vanilla content index](/vanilla-content/)  — landscape
- [Story arcs catalog](/vanilla-content/story-arcs/) — research arcs unlock terraforming
- [Architectural overview: Faction economy](/overviews/faction-economy/) — economy interaction
- [Macro (data layer)](/lang/data/macro/) — how planet macros work
- [Wiki: Mod compatibility](/wiki/mod-compatibility/) — broader compatibility

---

*Terraforming is the closest X4 gets to a Civilization-style late game. A mod that adds 1 new project gives players hundreds of hours of new content; a mod that subtly breaks vanilla terraforming silently ruins the late game and players blame X4, not your mod.*

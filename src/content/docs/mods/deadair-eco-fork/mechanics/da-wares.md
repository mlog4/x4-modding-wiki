---
title: DA custom wares
description: The 3 secondary-resource wares that bind DA-Eco's economy — Advanced Schematics, Military Schematics, Labor Union Contracts. Deep dive on the secondary-resource mechanic, own production modules, and the circular dependency they create.
sidebar:
  order: 2
---

DA-Eco adds three custom production wares whose only purpose is to act as **secondary resources** for vanilla production. They're the mod's marquee feature — the mechanism that binds the whole economy in a circular dependency.

## The three wares

Full definitions at [`libraries/wares.xml:1887-2083`](https://github.com/mlog4/deadair_eco):

| Ware id | Display name | Volume | Prices (min / avg / max) | Primary consumers |
|---|---|---:|---|---|
| `da_adv_schematics` | Advanced Schematics | 100 m³ | 210 / 280 / 540 | Advanced Electronics (14 units/cycle), Antimatter Converters (19), Claytronics (54) |
| `da_mil_schematics` | Military Schematics | 50 m³ | 90 / 120 / 250 | Advanced Composites (31 units/cycle) |
| `da_laborunion_contracts` | Labor Union Contracts | 25 m³ | 38 / 50 / 115 | Antimatter Cells (38 units/cycle) |

## The secondary-resource mechanic

X4 engine rule: if a production module has a `<secondaryresource>` block referencing ware X, and the module's storage contains enough X, the production cycle runs at:

- **`product=2.0`** (double the output units per cycle).
- **`cycle=0.25`** (finish 4× faster).

Net effect: **8× production throughput** for that cycle, as long as the secondary ware is stocked.

DA-Eco applies this pattern to **every vanilla production ware**. Every ware definition gets:

```xml
<effect type="secondaryresource" product="0.1" cycle="0.25"/>
<secondary>
  <ware ware="da_adv_schematics" amount="14"/>  <!-- or mil_schematics / laborunion_contracts -->
</secondary>
```

The `amount` per secondary is calibrated to ware-value ratios — expensive downstream wares need more schematics per cycle than cheap upstream wares.

## Which vanilla wares consume which DA ware

The 3 DA wares each attach to specific vanilla wares based on economic tier:

### Advanced Schematics — high-tech wares

Attached to modules producing:
- Advanced Electronics (14 units per cycle)
- Antimatter Converters (19)
- **Claytronics (54)** — biggest consumer, drives most Adv Schematics demand

### Military Schematics — military-industrial wares

Attached to modules producing:
- Advanced Composites (31 units per cycle)

### Labor Union Contracts — foundational wares

Attached to modules producing:
- Antimatter Cells (38 units per cycle)

## DA-ware production modules

Each DA ware has **2 production module variants**:
1. `_01` (default) — inputs claytronics + energy cells (vanilla recipe path)
2. `_02` (Terran-specific) — inputs computronic substrate + silicon carbide (Terran chain)

### Module characteristics (all 6)

Every DA-ware module has these signature values:

- **`cycle=0.5`** (base cycle multiplier — very fast).
- **`product=5.0`** (base output multiplier — 5× baseline).
- **Workforce boost is the HIGHEST in the game** — `workforce optimal` fully applied gives 5.0× production while consuming very little input.

Combined with full workforce:
- **~10 units per 5 min cycle** without workforce.
- **~50 units per 5 min cycle** with full workforce — a **5× improvement** just from staffing.

DA-ware production is deliberately **workforce-dependent**: without habitation on the station, the modules barely produce. With full staffing, they flood the ware market.

## Circular dependency created

The DA-ware mechanic creates a **closed loop**:

```
DA schematics ── produce by ──► Claytronics (or Computronic + SilCarbide)
                                        │
                                        │ needs workforce (habitation)
                                        ▼
Claytronics production ── boosted by ──► DA Advanced Schematics
                                        │ 
                                        │ workforce needs food + medical
                                        ▼
Food/medical production ── boosted by ──► DA Labor Union Contracts
                                        │
                                        │ needs Antimatter Cells
                                        ▼
Antimatter Cells production ── boosted by ──► DA Labor Union Contracts
```

**Every part of the economy needs every other part.** A player who tries to run a self-sufficient "one huge station does everything" strategy gets bottlenecked immediately — DA-ware modules require workforce which requires food which requires cross-galaxy production which requires DA-wares.

## Trading and ownership

All 3 DA wares are declared as **producible** by 20 faction owners:
- All 6 vanilla races (Argon / Antigone / Paranid / Split / Teladi / Terran)
- Segaris Pioneers, Boron, Hatikvah, Ministry of Finance, Alliance of the Word, Godrealm of the Paranid
- Pirates: Duke's, Riptide, Fallen Families, Free Families, Scale Plate, Yaki, Vigor
- Storyline factions

Modded factions **cannot** produce DA wares (owner list is hardcoded) but **can** trade them normally.

Kha'ak and Xenon are excluded — Kha'ak don't run production and Xenon operate on separate rules ([see Xenon specifics](./xenon-specifics/)).

## Bigger factories mechanic

Separately from DA-wares, DA-Eco unlocks the "bigger factories" pattern in [`libraries/parameters.xml`](../reference/library-changes/#parametersxml):

- `<limits production="1→25">` — vanilla lets a station host 1 identical module per type; DA lets it host 25 (in practice limited by ProductionLimit=5).
- `<maxlimits production="3→25">` — same principle for hard caps.
- `production chance=100%` on gen-modules (was 15-65%) — every attempted module generation always succeeds.

Combined with `factionlogic_economy.xml` `Request_Factory ProductionLimit 1→5` and `Request_Production_Module WantedProductions 1-2 per tick`, NPC factions naturally grow their existing stations by 1-2 modules per tick until they hit the 5-module-per-type cap.

**Result:** a mature Argon Hull Parts factory has 5 Hull Parts production modules on one station (vanilla had 1 per station, needing 5 stations).

## Placeholder module asset note

The `README.md` mentions:
> These are using **placeholder station modules** for now. The wares are secondary resources that stations can use to double production amount and are produced in modules.

The 6 module macros live in `assets/structures/production/`. Visually they reuse vanilla generic-production module models (cost + time to model custom station modules was prohibitive). Functionally they work correctly — the "placeholder" label is only about visual assets, not gameplay behavior.

## Design intent

Why did DeadAirRT add these three specific wares?

1. **Break the "self-sufficient homebase" strategy.** A player building one big station gets no DA-ware boost — they need to trade for schematics (or build separate DA-ware factories). Rewards distributed logistics.
2. **Give workforce a strong reason to exist.** DA-ware modules have the game's largest workforce boost. Without habitation, they barely function. Encourages hab-heavy station designs.
3. **Add a mid-late-game economic mission target.** Once basic Hull Parts / Weapon Components are flowing, players pivot to producing DA-wares → high-value trades → funds capital ships.
4. **Give NPCs the same tools.** NPCs auto-build DA-ware modules per the [bigger-factories mechanic](#bigger-factories-mechanic), so the ambient economy benefits without any player action.

## Related pages

- [Mechanics overview](./) — where DA-wares fit in the overall design philosophy
- [Storage sizing](./storage-sizing/) — how station storage is auto-sized to fit DA-ware volume needs
- [Library changes → wares.xml](../reference/library-changes/#waresxml-2084-lines) — the ~700-patch scope

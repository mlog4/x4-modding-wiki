---
title: Fill Statistics Menu
description: Read-only running totals — Faction Account balances, Wares Added/Removed by ware id, Ships Modified counts per faction.
sidebar:
  order: 2
---

Live statistics dashboard for what DA Fill has done since gamestart. Three sections stacked vertically: **Faction Account**, **Wares Added / Removed**, **Ships Modified**. All values accumulate — they are not reset per Fill Interval.

## In-game view

The menu is **taller than the screen** — you scroll it to see the bottom sections. Two screenshots below cover the top and bottom.

**Top:** Faction Account section + start of Wares Added/Removed.
![Fill Statistics part 1 — Faction Account and start of Wares Added/Removed](/x4-modding-wiki/img/mods/deadair-scripts/fill-statistics-1.jpg)

**Bottom:** Continues Wares Added/Removed + Ships Modified section.
![Fill Statistics part 2 — end of Wares Added/Removed and Ships Modified table](/x4-modding-wiki/img/mods/deadair-scripts/fill-statistics-2.jpg)

## Section 1: Faction Account

Running credit balance per faction. Populated by DA's [budget accounting](../#mechanic):

- Wares generated at production add to the balance (through the vanilla economy).
- Fill operations subtract `AmountAdded × ware.averageprice` from the balance.
- A faction with a high balance has been earning more than DA has been spending on their behalf → they will continue to fill aggressively next tick.
- A faction with `0.00 Cr` or a very low balance is either newly-created, hasn't produced anything of value yet, or has been spending down its balance faster than earning.

### Observed values in the sample save

| Rank | Faction | Total Value |
|---|---|---|
| 1 | Riptide Rakers | 792,686,696.00 Cr |
| 2 | Quettanauts | 136,931,560.00 Cr |
| 3 | Zyarth Patriarchy | 127,152,859.00 Cr |
| 4 | Free Families | 87,608,561.00 Cr |
| 5 | Duke's Buccaneers | 48,084,330.00 Cr |
| 6 | Ministry of Finance | 38,144,794.00 Cr |
| 7 | Xenon | 27,013,876.00 Cr |
| 8 | Antigone Republic | 1,439,913.00 Cr |
| 9-... | Alliance of the Word / Argon Federation / Segaris Pioneers / Yaki | 0.00 Cr |
| 10-... | Godrealm of the Paranid (24) / Ministry of Finance / Terran Protectorate (17) / Provinces Adrift (17) / Scale Plate Pact (7) / Teladi (2) / Vigor (2) / Hatikvah (2) / Holy Order (2) | pocket change |

**Read:** by mid-game the pirate/criminal factions (Riptide, Quettanauts, Zyarth, Free Families, Duke's) are the richest — they've been generating value that DA hasn't had to spend restocking their stations. The Terran/Argon lawful factions sit near zero because DA has been fill-restocking them heavily to keep the vanilla economy responsive.

## Section 2: Wares Added / Removed

Per-ware running totals of how much DA has added and removed across all faction stations.

### Columns

| Column | Meaning |
|---|---|
| **Ware** | Ware id (localized display name — Antimatter Cells, Claytronics, Silicon Wafers, etc.). |
| **Added Number** | Total units DA has added to any station via the Min-threshold fill logic. |
| **Removed Number** | Total units DA has removed via the Max-threshold trim logic. |
| **Net Number** | `Added − Removed`. Positive = DA is net-supplying this ware; negative = DA is net-draining. |

### Interpretation examples from the sample save

- **Advanced Composites:** Added 21,952; Removed 111,010; Net **−89,058**. DA is trimming excess AC from stations more than supplying. Might indicate the economy is over-producing AC.
- **Advanced Electronics:** Added 935,840; Removed 32,575; Net **+903,265**. Heavy DA supply — factions want AE more than they generate.
- **Energy Cells:** Added 11,448,859; Removed 55,056,960; Net **−43,608,101**. DA is aggressively trimming excess Energy Cells — probably the economy massively overproduces at solar plants.
- **Silicon:** Added 189,886; Removed 4,782,583; Net **−4,592,697**. Same pattern — solar production floods silicon consumers.
- **Terran MRE:** Added 358,080; Removed 4,065; Net **+354,015**. DA subsidizes MRE heavily — Terran habitats are under-supplied by their own economy.
- **Stimulants:** Added 844,743; Removed 0; Net **+844,743**. Pure supply — nobody produces enough Stimulants.

**Read:** the Net column tells you which wares are net-imports vs net-drains. Heavy negative Nets on production feedstocks (Energy Cells, Silicon, Water) suggest baseline solar / basic-resource production is over-tuned in your save. Heavy positive Nets on finished goods (Advanced Electronics, Terran MRE) suggest the economy consistently under-produces those.

## Section 3: Ships Modified

Per-faction running total of ship modifications applied via [Fill Ship Mods](../#ship-mods) toggles.

### Columns

| Column | Meaning |
|---|---|
| **Faction** | The subject faction. |
| **Total Military Ships Modified** | Cumulative count of military ships (combat classes) that received ship-mod fills. |
| **Total Civilian Ships Modified** | Cumulative count of civilian ships (traders, miners, transports) that received ship-mod fills. |

### Observed values in the sample save

| Faction | Military | Civilian |
|---|---|---|
| Terran Protectorate | 1,239 | 47 |
| Provinces Adrift | 312 | 53 |
| Teladi Company | 283 | 53 |
| Godrealm of the Paranid | 256 | 53 |
| Holy Order of the Pontifex | 245 | 47 |
| Zyarth Patriarchy | 216 | 20 |
| Argon Federation | 176 | 51 |
| Antigone Republic | 165 | 41 |
| Segaris Pioneers | 174 | 51 |
| Vigor Syndicate | 91 | 8 |
| Free Families | 1 | 45 |
| Scale Plate Pact | 9 | 4 |
| Quettanauts | 0 | 9 |
| Duke's Buccaneers | 0 | 0 |
| Hatikvah Free League | 0 | 6 |

**Read:** military ship-mod fills concentrate on lawful high-tech factions (Terran, Paranid, Argon). Pirate/criminal factions get fewer military mods (they don't run mod distribution the same way) but civilian mods spread more evenly.

## When to check

- **Balancing a save:** the Wares Added/Removed section is the diagnostic for over-produced vs under-produced wares — informs manual player-side interventions or preset tuning.
- **Faction health check:** the Faction Account section shows which factions are cash-flush vs cash-starved.
- **Ship-mod distribution:** the Ships Modified section confirms your ship-mod toggles are actually firing.

## Notes

- **Numbers are cumulative** across the entire save. There is no per-interval or per-hour breakdown.
- **No reset button** — the numbers only reset if you start a new save or manually clear `$DADVT.$DAFillFactionAccounts` / `$DAFillWareStatistics` via developer tools.

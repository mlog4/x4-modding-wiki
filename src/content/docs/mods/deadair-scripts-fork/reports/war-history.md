---
title: War History
description: Per-faction-pair active conflict statistics — War Fatigue, War Score, Military / Civilian / Stations kill breakdowns by size class. Same page as DA Dynamic War → War History.
sidebar:
  order: 11
---

Per-faction-pair active conflict statistics. Each pair gets its own section with War Fatigue, War Score, and ship-kill breakdowns by class.

**Note:** this is the same menu reached from [DA Dynamic War → War History](../../configuration/dynamic-war/war-history/). Two entry points, same data.

## In-game view

![War History — 4 conflicts visible (ANT-TEL, ARG-TEL, ARG-TER, FRF-ZYA) with all stats + start of GDPAR-FRF](/x4-modding-wiki/img/mods/deadair-scripts/report-war-history.jpg)

## Per-pair structure

Each faction-pair has one section. Columns:

| Column | Meaning |
|---|---|
| **Faction (left)** | The first faction in the pair. |
| **Faction (right)** | The second faction. |
| **Conflict Intensity** (header line) | Descriptor: `Low-Intensity Conflict` / `Military Campaign` / `Balanced Victory of N` / etc. |
| **War Fatigue** | 0-100 fatigue scale. High = about to enter ceasefire. Different value per side. |
| **War Score** | Weighted score. Positive = winning; negative = losing. |
| **Military Ships Killed — Total** | Total military ships this side lost to the other. |
| **Military Ships Killed — XL/L/M/S** | Breakdown by size class. |
| **Civilian Ships Killed** | Same structure — total + breakdown. |
| **Stations Killed** | Total stations destroyed. |

## Observed sample-save conflicts

**Antigone Republic vs Teladi Company — Low-Intensity Conflict**

| Metric | Antigone | Teladi |
|---|---:|---:|
| War Fatigue | 30 | 0 |
| War Score | -18 | 18 |
| Military Killed Total | 5 (XL:0/L:0/M:0/S:5) | 12 (XL:0/L:0/M:0/S:12) |
| Civilian Killed Total | 12 (XL:0/L:1/M:10/S:1) | 17 (XL:0/L:1/M:16/S:0) |
| Stations Killed | 0 | 0 |

Antigone is losing badly to Teladi — score -18. Antigone lost 12 civilians (mostly M-class traders) — Teladi is attacking Antigone commerce.

---

**Argon Federation vs Teladi Company — Low-Intensity Conflict**

| Metric | Argon | Teladi |
|---|---:|---:|
| War Fatigue | 7 | 0 |
| War Score | -5 | 5 |
| Military Killed | 6 (XL:0/L:0/M:0/S:6) | 9 (XL:0/L:1/M:2/S:6) |
| Civilian Killed | 2 (XL:0/L:0/M:2/S:0) | 1 (XL:0/L:0/M:1/S:0) |
| Stations Killed | 0 | 0 |

Argon losing slightly (-5). Small conflict — few kills.

---

**Argon Federation vs Terran Protectorate — Military Campaign**

| Metric | Argon | Terran |
|---|---:|---:|
| War Fatigue | -6 (negative!) | 42 |
| War Score | 14 | -14 |
| Military Killed | 71 (XL:1/L:1/M:2/S:67) | 24 (XL:0/L:1/M:2/S:21) |
| Civilian Killed | 2 (XL:0/L:0/M:1/S:1) | 13 (XL:2/L:1/M:8/S:2) |
| Stations Killed | 0 | 0 |

**Argon score +14** — winning against Terran. 71 Terran military kills vs 24 Argon losses. Terran War Fatigue at 42 — approaching ceasefire threshold.

The **negative Argon War Fatigue (-6)** is unusual — could indicate they're actively rebuilding capacity faster than losses accumulate.

**Terran lost 13 civilians incl 2 XL** — someone raided a Terran auxiliary/carrier fleet.

---

**Free Families vs Zyarth Patriarchy — FRF-ZYA Balanced Victory of 135299.659**

| Metric | Free Families | Zyarth |
|---|---:|---:|
| War Fatigue | 9 | 12 |
| War Score | 0 | 0 |
| Military Killed | 19 (XL:0/L:0/M:9/S:10) | 4 (XL:0/L:0/M:0/S:4) |
| Civilian Killed | 0 | 12 (XL:0/L:0/M:12/S:0) |
| Stations Killed | 0 | 0 |

The intensity label "**FRF-ZYA Balanced Victory of 135299.659**" is unusual — DA computed a specific victory value 135,299.659 (probably a credit-value ratio or a diplomatic score). Score 0/0 = deadlocked.

**Zyarth already collapsed** per [Military Ship Count](./military-ship-count/) — 0 military ships. Free Families essentially "won" but the war state is technically still active for stats purposes.

---

**Godrealm of the Paranid vs Free Families — Low-Intensity Conflict**

Partially visible in screenshot:
- Paranid War Fatigue -10 (rebuilding), Free Families +14
- Paranid Score 14 (winning), Free Families -14

## Conflict intensity types (observed)

- **Low-Intensity Conflict** — sporadic engagement, low kill counts.
- **Military Campaign** — dedicated fleet vs fleet action, high kills.
- **Balanced Victory of N** — deadlock with a specific victory value.

Other DA intensities likely exist (not visible in this screenshot): High-Intensity Conflict, Total War, Skirmish, etc.

## War Fatigue mechanic

Each side accumulates fatigue from taking losses. When fatigue crosses a DA-configured threshold (see [DA Dynamic War → main menu](../../configuration/dynamic-war/)), that side pushes for ceasefire.

**Negative fatigue** = side has recovered / rebuilt beyond its losses. Rare but happens.

## Read the sample save globally

- **Argon at war with Terran** — Argon winning (14 to -14). Terran fleet at 4228 threat, Argon at 2. Impossible? Unless the numbers here represent specific engagements not full-fleet total.
- **Antigone / Argon both losing to Teladi** — Teladi Company is on the offensive commercially and militarily.
- **Free Families vs Zyarth = frozen conflict** — Zyarth militarily dead but war continues on paper.
- **Godrealm on the rise** — Paranid gaining ground vs Free Families.

## Use cases

- **"Should I intervene in war X?"** — check War Score to see who's losing. Reinforce the underdog if you have a stake.
- **"Is war X ending?"** — check both War Fatigue values. If both > 60-70, ceasefire likely soon.
- **"Who's actually killing whom?"** — Military vs Civilian columns reveal targeting patterns.
- **"Where should I sell weapons?"** — factions with high losses need replacements.

## Notes

- **Requires DW Stat Tracking `Enabled`** on the [DA Dynamic War main menu](../../configuration/dynamic-war/) — otherwise numbers show 0 across the board.
- **Same page as [DA Dynamic War → War History](../../configuration/dynamic-war/war-history/)** — no data difference, just two entry points.
- **Wars end** (via ceasefire) — the pair disappears from this list. Historical events aren't retained.
- **Modded faction wars** appear here if the modded faction is registered in DA's DW system.

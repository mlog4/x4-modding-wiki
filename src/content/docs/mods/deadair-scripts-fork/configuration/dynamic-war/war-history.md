---
title: War History
description: Read-only statistics per faction pair — War Fatigue, War Score, ship-kill breakdown by class (XL/L/M/S), civilian kills, station kills. Requires DW Stat Tracking on.
sidebar:
  order: 6
---

Read-only statistics report. Every active or historical faction-pair conflict is listed with its intensity classification and detailed kill counters. Requires **Enable DW Stat Tracking** to be `Enabled` in the [main menu](../).

## In-game view

![War History — Antigone Republic vs Teladi Company, Argon Federation vs Teladi, Argon Federation vs Terran Protectorate](/x4-modding-wiki/img/mods/deadair-scripts/dw-war-history.jpg)

## Layout per conflict pair

Each conflict pair is a two-column vertical block (side A on the left, side B on the right):

```
+------------------------+------------------------+
| Antigone Republic      | Teladi Company         |
+------------------------+------------------------+
|         Low-Intensity Conflict                  |
+------------------------+------------------------+
| War Fatigue:      28   | War Fatigue:      -5   |
| War Score:       -19   | War Score:        19   |
+------------------------+------------------------+
|             Military Ships Killed               |
+------------------------+------------------------+
| Total: 3  XL:0/L:0/M:0/S:3 | Total: 12  XL:0/L:0/M:0/S:12 |
+------------------------+------------------------+
|             Civilian Ships Killed               |
+------------------------+------------------------+
| Total: 8  XL:0/L:1/M:7/S:0 | Total: 13  XL:0/L:1/M:12/S:0 |
+------------------------+------------------------+
| Stations Killed: 0     | Stations Killed: 0     |
+------------------------+------------------------+
```

## Fields

| Field | Meaning |
|---|---|
| **Conflict header** (e.g. `Low-Intensity Conflict`, `Military Campaign`) | Intensity classification — determined by fatigue / score thresholds. |
| **War Fatigue** | Per-side fatigue counter. High fatigue = pending cool-down / lower probability of new events. Can be negative (recent positive events). |
| **War Score** | Net "who's winning" measure for this pair. Positive = this side ahead, negative = this side losing. Sum should be zero across the pair. |
| **Military Ships Killed** | Total + breakdown by ship class (XL / L / M / S) of enemy military kills. |
| **Civilian Ships Killed** | Total + class breakdown of civilian kills. Civilian losses tend to accumulate faster and matter for public-opinion flavor. |
| **Stations Killed** | Number of stations of the enemy destroyed by this side. |

## Conflict classifications

Observed in the screenshot:

- **Low-Intensity Conflict** — border skirmishes; modest ship losses on either side, no station attacks. Fatigue in the 5-30 range.
- **Military Campaign** — full-scale war; ship losses in the tens/hundreds, station kills possible. Fatigue and score numbers get much larger.

There may be additional classifications (e.g. Cease-Fire, Cold War) that DA emits under different threshold combinations — [open a Nexus / GitHub issue](https://www.nexusmods.com/x4foundations/mods/2205) with a screenshot if you see one not documented here.

## When to check

- After a major DW event fires — see who's on which end.
- To evaluate whether your bounty-hunting / trading has meaningfully shifted the balance.
- Diagnosing "why won't this war end" — high fatigue on both sides usually means it's about to.

## Notes

- Statistics only populate when `Enable DW Stat Tracking` is **Enabled** on the [main DA Dynamic War menu](../).
- Turning tracking off doesn't wipe existing history — it just stops adding new entries.

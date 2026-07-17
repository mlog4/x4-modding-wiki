---
title: Trade Stations Report
description: Galaxy-wide trade-station browser — faction, sector, M subordinates, storage capacity in millions m³. Introduced mlog088-089 in v3.0-beta1.
sidebar:
  order: 1
---

Lists every trade station galaxy-wide with faction, sector, subordinate count, and storage capacity. Introduced mlog088-089 in v3.0-beta1.

> **📷 Screenshot needed:** Trade Stations Report — full view with several factions visible.
> _File: `report-tradestations.jpg`_

## Columns

| Column | Meaning |
|---|---|
| **ID** | 3-4 char station idcode (e.g. `VZX-868`). |
| **Fac** | 3-letter faction shortname (e.g. `ARG`, `TER`, `PIO`). |
| **Sector** | Sector known-name. |
| **M subs** | Number of M-class subordinate ships (traders, mostly). |
| **Cont M** | Container-storage capacity, millions of m³ (raw max, not fill). |
| **L/S M** | Liquid + Solid storage capacity, millions of m³. |

## Sort order

Composite key: `owner.shortname + '/' + sector.knownname` — stations group by faction, sector-sorted within.

## Storage units

Internal m³ divided by 1,000,000. Sub-1M capacities show as `0`.

## Source

- Cue: `MlogDaTsReportBuild` in [`md/mlog_da_report_tradestations.xml`](https://github.com/mlog4/deadair_scripts)
- SMA menu ID: `mlog_da_report_tradestations_menu`

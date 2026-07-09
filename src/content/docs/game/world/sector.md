---
title: Sector
description: Main spatial unit containing objects.
---

:::caution[Placeholder]
This page is a placeholder for the prototype. Full content will be added after the structure is approved.
:::

A **Sector** is a spatial unit in the X4 universe. Sectors contain [Zones](./zone/), [Ships](../objects/ship/), [Stations](../objects/station/), [Resource regions](../objects/resource-region/), [Highways](./highway/), and [Gates](./gate/).

The world hierarchy: **Universe → Cluster → Sector → Zone**.

## What will be on this page (planned)

- **Properties:** `.cluster`, `.zones`, `.economy`, `.security`, `.owner`, `.trueowner`, `.ships`, `.stations`, `.resources`, `.adjacentsectors`, `.tags`.
- **Actions:** ownership changes, position calculations.
- **Libraries:** `FindSectorExitPoints`, `FindSectorEntryPoints`, `FindNearestEnemySectorForFaction`.
- **Events:** `event_contained_sector_changed_true_owner` (⚠ payload is **cluster**, not sector).
- **Examples:** listing stations by faction, checking adjacent sectors.

## Related

- [Cluster](./cluster/) — parent.
- [Zone](./zone/) — child.
- [Station](../objects/station/) — common contained object.
- [Ship](../objects/ship/) — common contained object.

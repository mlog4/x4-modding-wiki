---
title: Build plot
description: Sector area claimed by player faction for station construction. Owned slot in space where modules can be built. Stub page.
---

**Build plot** is a **sector area claimed by a faction** for station construction. Stations are built on plots — a plot is the spatial allocation of "this section of space is mine for construction."

## Properties

- `.sector` — the sector containing the plot
- `.owner` — the faction owning the plot
- `.station` — the station built (if any) on this plot

## Common context

When the player wants to build a station:
1. Open map → claim plot in sector
2. Plot becomes player-owned (in player faction or specific faction)
3. Player can place modules on the plot
4. Station construction begins

## Mod conflict risks

Mods that change sector ownership or plot-claim mechanics affect:
- Plot availability
- Station construction
- Boron Main story Ch7 (Sanctuary of Darkness plot)
- Paranid Civil War (cluster_04_sector002 / cluster_22_sector001 plot reservations)

## Related

- [Station](/game/objects/station/) — built on a plot
- [Sector](/game/world/sector/) — contains plots
- [Build module](/game/objects/build-module/) — construction module
- [Build storage](/game/objects/build-storage/) — storage on build modules

---

*Stub page — full build plot reference coming.*

---
title: Dockarea
description: Container of dockingbays + dock UI on a station or carrier ship. Where ships dock to enter interior. Stub page.
---

**Dockarea** is the container of [dockingbays](/game/objects/dockingbay/) on a station or carrier ship. The dockarea provides the dock UI for entering / leaving ships, transferring crew, etc.

## Properties

- `.dockingbays` — list of dockingbays in this dockarea
- `.dockedships` — list of currently docked ships
- `.parent` — the station or ship containing this dockarea

## Common context

Dockareas live on:
- [Station](/game/objects/station/) — main station dock for S/M/L/XL ships (each module dock has its dockarea)
- [Ship](/game/objects/ship/) — carrier ships (XL carriers, M-class explorers) have a dockarea

## Related

- [Dockingbay](/game/objects/dockingbay/) — single slot in dockarea
- [Pier](/game/objects/pier/) — capital ship docking variant
- [Station](/game/objects/station/) — has dockareas
- [Build module](/game/objects/build-module/) — construction-specific dockarea

---

*Stub page — full dockarea reference coming.*

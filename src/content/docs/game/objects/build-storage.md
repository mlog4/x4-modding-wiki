---
title: Build storage
description: Storage component on a Build module. Holds wares needed for construction. Stub page.
---

**Build storage** is the **storage component** of a [Build module](/game/objects/build-module/). It holds construction wares (hull parts, claytronics, etc.) that the build module consumes during station construction.

## Properties

- `.parent` — the build module containing this storage
- `.cargo` — the wares currently held for construction
- `.cargo.capacity` — maximum storage capacity

## Common context

When a station is under construction:
1. Build module pulls wares from build storage
2. Build storage consumed for each construction step
3. Resupply via traders
4. When storage is empty, construction pauses until refilled

## Related

- [Build module](/game/objects/build-module/) — parent containing build storage
- [Container](/game/objects/container/) — cargo abstract class
- [Cargo](/game/economy/cargo/) — generic cargo abstraction
- [Ware](/game/economy/ware/) — what fills the storage

---

*Stub page — full build storage reference coming.*

---
title: Resource region
description: Sub-type of Region for asteroid fields and resource-rich zones. Holds ore/silicon/nividium/ice clouds. Stub page.
---

**Resource region** is the **resource-rich sub-type of [Region](/game/world/region/)** — asteroid fields (ore, silicon, nividium) and gas/fluid clouds (hydrogen, methane, helium, ice).

## Properties

- Inherits region's position-test exposure
- `.resources` — what wares the region produces (when scanned)
- `.density` — relative resource density 0..15

## Common context

- Player flies into a resource region → asteroids visible
- Mining ships harvest resources from the region
- Region's resource profile determined by region definitions (`libraries/region_definitions.xml`)

## Common usage

```xml
<find_object name="$AsteroidField" 
    space="$sector" 
    region="true" 
    has_resource="ware.ore"/>
```

## Related

- [Region](/game/world/region/) — parent class
- [Resource probe](/game/objects/resource-probe/) — deployable for scanning regions
- [Asteroid](/game/objects/asteroid/) — what's mined inside resource regions
- [Ware](/game/economy/ware/) — what regions yield

---

*Stub page — full resource region reference coming.*

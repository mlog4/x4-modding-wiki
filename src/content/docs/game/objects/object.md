---
title: Object
description: Root engine abstract class. Almost every X4 entity (ship, station, character, ware, region) inherits from object. Stub page — full inheritance reference coming.
---

**Object** is the root abstract class in the X4 engine class hierarchy. Almost every entity the modder interacts with — ships, stations, characters, wares, regions, components — inherits ultimately from `object`.

## Properties (universal)

Most-used universal properties (from `scriptproperties.xml`):

- `.exists` — boolean: does the reference resolve?
- `.macro` — the object's macro reference
- `.class` — the object's engine class
- `.isclass.{class.X}` — is this object of a specific class?

## Related

- [Controllable](/game/objects/controllable/) — sub-class with pilot/captain
- [Defensible](/game/objects/defensible/) — sub-class with shields/hull
- [Container](/game/objects/container/) — sub-class with cargo
- [Destructible](/game/objects/destructible/) — sub-class with destruction state

---

*Stub page — full property + inheritance reference coming.*

---
title: Object types
description: Things that exist in the X4 world.
---

Objects that can be spawned, manipulated, destroyed, and queried.

## Stations

[**Station**](./station/) is the parent abstraction. Specialized subtypes:

- [Shipyard](./shipyard/) — builds XL/L ships.
- [Wharf](./wharf/) — builds M/S ships.
- [Equipment Dock](./equipment-dock/) — sells equipment.
- [Trade Station](./trade-station/) — economic hub.
- [Defence Station](./defence-station/) — combat installation.
- [Production Factory](./production-factory/) — produces wares.
- [Pirate Base](./pirate-base/) — pirate hub.
- [Player Headquarters](./player-hq/) — special player station.

A station contains:

- [Modules](./module/) — production, dock, defence, habitation, storage, connection.
- [Dockareas](./dockarea/) — docking infrastructure.
- [Build plot](./build-plot/) — construction area.

## Ships

[**Ship**](./ship/) is the parent abstraction. Subtypes by class (XS/S/M/L/XL) and by purpose (fight/trade/mine/transport/build).

A ship contains:

- [Crew](../factions/crew/) — pilot, captain, engineer, marines, service crew.
- [Cargo](../economy/cargo/) — inventory.
- [Loadout](./loadout/) — weapons, shields, engines.

## Other objects

- [Resource region](./resource-region/) — asteroid spheres for mining.
- (Highway and Gate are listed under [World](../world/) since they're spatial infrastructure.)

---

## Prototype status

- [Station](./station/) — **full prototype page**.
- [Shipyard](./shipyard/) — subtype example (brief).
- [Module](./module/) and [Ship](./ship/) — placeholders.

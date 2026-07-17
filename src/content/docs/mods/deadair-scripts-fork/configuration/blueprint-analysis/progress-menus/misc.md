---
title: Misc
description: Blueprint scan progress for everything not covered by Station Modules / Ships / Equipment. Mines, lockboxes, nav beacons, resource probes, venture platforms, sensor arrays.
sidebar:
  order: 4
---

Blueprint-progress viewer for wares that don't fit the [Station Modules](../station-modules/) / [Ships](../ships/) / [Equipment](../equipment/) categories. Single ungrouped list, alphabetized.

## In-game view

![Misc — 9 tracked entries, 2 completed](/x4-modding-wiki/img/mods/deadair-scripts/bp-misc.jpg)

## How this category is populated

Source: [`md/deadairdynamicuniversemenus.xml:6974-6976`](https://github.com/mlog4/deadair_scripts). The Misc menu walks every ware in `$DABPTracking` and includes only those whose macro **does not match** any of the classes handled by the other 3 category pages:

```
NOT class.pier, class.dockarea, class.production, class.storage,
    class.defencemodule, class.buildmodule, class.connectionmodule,
    class.habitation, class.welfaremodule, class.processingmodule,
    class.ship_xs, class.ship_s, class.ship_m, class.ship_l, class.ship_xl,
    class.turret, class.missileturret, class.missilelauncher,
    class.engine, class.shieldgenerator, class.weapon,
    class.satellite, class.missile, class.countermeasure
```

Everything else lands here. Typical members: mines, lockboxes, beacons, probes, venture platforms, wide area sensor arrays.

## Observed sample-save state (9 entries)

| Ware | Progress |
|---|---|
| Cluster Mine | 0/20 |
| Friend/Foe Mine | 0/20 |
| Lockbox | 0/20 |
| Mine | 0/20 |
| Nav Beacon | 0/20 |
| Resource Probe | 0/20 |
| Tracker Mine | 0/20 |
| **Venture Platform** | **completed** ✓ |
| **Wide Area Sensor Array** | **completed** ✓ |

## Read

- **Venture Platform completed** — player has scanned a Venture-network platform enough times. Now buildable.
- **Wide Area Sensor Array completed** — big passive sensor rig unlocked.
- **Mines (4 variants at 0/20)** — very close to completing on any scan. Mines are cheap-tier — scan 5-6 minefields and you'll have all four.
- **Lockbox 0/20** — pick up lockbox blueprint by scanning any pirate lockbox. Won't take long.

## Requirement source

All Misc-category wares use the `$DABPUnkownClassRequirement` fallback (default = **20**) at [`md/deadairdynamicuniverse.xml:282`](https://github.com/mlog4/deadair_scripts). There's no per-class slider for these — the single "Unknown Object Class" row at the bottom of the [Scan Settings](../../#scan-settings--how-it-works) table controls all of them.

**Practical consequence:** if you don't want the misc-blueprint completions cluttering your bank, raise the "Unknown Object Class" slider on the main menu. Or lower it for even faster acquisition.

## Design intent

These are low-stakes utility / infrastructure blueprints — you'll unlock them naturally as you explore. DA doesn't gate them heavily because most players want them available early for setting up defensive infrastructure (mines, sensors) and mission tools (nav beacons for Venture routes).

The visible sensor + venture platform completions in the sample save match the observed 30+ hour player progression — those are the first Misc blueprints anyone typically picks up when running Venture missions or setting up border-sector nav beacons.

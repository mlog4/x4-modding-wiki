---
title: DA Blueprint Analysis
description: Police-scan blueprint acquisition. Enemy ships accumulate blueprint fragments across scans; enough fragments awards the blueprint to the player.
---

Police assets scan enemy ships for blueprint fragments. Once a ship's blueprint accumulates enough fragments across scans, the blueprint is awarded to the player.

## Mechanic

Works with the vanilla `policeassetscannedship` engine signal. Fires when your police-tagged ship scans an enemy ship. Each scan awards fragments; the fragments-per-scan and required-total are configurable per macro class (S/M/L/XL). Once a specific ship's fragment total reaches the requirement, the blueprint is added to your bank.

> **📷 Screenshot needed:** DA Blueprint Analysis submenu.
> _File: `menu-blueprint.jpg`_

> **📷 Screenshot needed:** In-game notification when a blueprint fragment is collected.
> _File: `bp-scan-notification.jpg`_

## Settings

| Setting | Default | Effect |
|---|---|---|
| `BP_Enable` | `true` | Master toggle. |
| `BP_DebugEnable` | `false` | Verbose `[BP]` log lines. |
| `BP_UnknownClassRequirement` | `20` | Fragments needed for an unknown-class ship blueprint (default fallback when no macro-specific rule applies). |

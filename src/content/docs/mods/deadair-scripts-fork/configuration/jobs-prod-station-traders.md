---
title: Prod Station Traders (PST)
description: Subordinate M-class traders for production factories. Analog of ST for factories; shuttles inputs/outputs per recipe. Introduced in v3.0-beta1 Phase 4.
sidebar:
  order: 10
---

Analog of [Station Traders (ST)](../jobs-station-traders/) for **production factories** (not trade stations). Each factory gets subordinate M-traders that specifically shuttle inputs/outputs for that recipe. Introduced in v3.0-beta1 Phase 4.

> **📷 Screenshot needed:** DA Jobs → Prod Station Traders submenu.
> _File: `menu-prod-station-traders.jpg`_

## Settings

| Setting | Default | Effect |
|---|---|---|
| `PST_Enabled` | `true` | Master toggle. |
| `PST_QuotaPerStation` | `2` | M-traders per factory. Lower than ST because factories usually have fewer wares in play. |
| `PST_ReconcileIntervalMin` | `60` (min) | Reconcile pass interval. |
| `PST_DebugVerbose` | `false` | Verbose `[PST]` log lines. |

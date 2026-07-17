---
title: Mlog Trade Optimizer
description: Economic top-up pass for trade stations and production factories. Keeps ware prices moving so vanilla NPC traders don't stall on flat prices.
---

Economic top-up pass that walks trade stations and production factories, adjusting ware prices when supply is stuck / demand is high. Keeps the price signal moving so vanilla NPC traders don't stall on flat prices.

> **📷 Screenshot needed:** Mlog Trade Optimizer submenu.
> _File: `menu-trade-optimizer.jpg`_

## Settings

| Setting | Default | Effect |
|---|---|---|
| `TradeOpt_Enable` | `true` | Master toggle. |
| `TradeOpt_Interval` | `300` (min = 5h game time) | How often the optimizer runs. Long by design — economic churn shouldn't be sub-hourly. |
| `TradeOpt_ProcessTradeStations` | `true` | Include trade stations in the pass. |
| `TradeOpt_ProcessFactories` | `true` | Include production factories in the pass. |

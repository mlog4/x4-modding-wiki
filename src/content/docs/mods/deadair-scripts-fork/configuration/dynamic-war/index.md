---
title: DA Dynamic War
description: Periodic AI-to-AI relation shifts drive galaxy politics. Full setting reference — event weights, race modifiers, fatigue, plus 6 sub-menus (Increase/Decrease/Unlock Relations, Ignored Factions, Sector Logic, War History).
sidebar:
  order: 2
---

Periodic AI-to-AI relation shifts drive galaxy politics on their own. Six event types (Close Ally / Large Increase / Small Increase / Small Decrease / Large Decrease / Nemesis) plus a No-Change roll, weighted per-interval, produce natural political evolution.

## In-game view

![DA Dynamic War — full option list + sub-menu list](/x4-modding-wiki/img/mods/deadair-scripts/menu-dynamic-war.jpg)

Layout:

- **Top section (`DA Dynamic War Options`)** — 20 configurable fields covering master toggles, event weights, modifiers, and fatigue behavior.
- **Bottom section (`DA Dynamic War Menus`)** — 6 sub-menus for direct player intervention and observation.

## Mechanic

Every `Dynamic War Interval` minutes DA picks up to `Maximum Factions to Check` factions and runs an event roll. The roll picks one outcome from the weighted pool (Close Ally / Large Increase / Small Increase / Small Decrease / Large Decrease / Nemesis / No Change). The chosen event's magnitude gets scaled by three modifiers (Primary Race, Current Relations, Common Relations) and applied. The **fatigue system** then cools that faction down so it can't be picked again for `DW Minimum Time before Fatigue ending` minutes.

Optional layers:

- **DW Favors** — factions accumulate "debts" from prior positive events; alliances can be "called in" later.
- **Flavor Text** — small thematic messages accompany minor shifts.
- **AI Relations Cap** — hard cap so runaway war/peace can't push relations past sane bounds.

## Settings

### Master toggles

| Setting | Default | Effect |
|---|---|---|
| **Enable Dynamic War** | `Enabled` | Master toggle for the whole system. |
| **Enable DW Favors** | `Enabled` | Factions can call in debts from past positive events. |
| **Enable AI Relations Cap** | `Enabled` | Hard-cap runaway relation drift at sane bounds. |
| **Dynamic War Interval** | `30 min` | How often the war engine evaluates. Lower = more frequent shifts. |

### Event weights

Each interval fire picks one outcome from this weighted pool. Higher weight = more likely. **Total weight** = sum of all seven values; each weight's share of the total is its probability.

| Weight | Default | Event |
|---|---|---|
| **Close Ally Weight** | `1` | Rare — a strong positive bond forms/persists. |
| **Large Increase Weight** | `16` | Notable positive shift (alliance nudge, cooperation event). |
| **Small Increase Weight** | `32` | Frequent — small positive nudge. |
| **Small Decrease Weight** | `32` | Frequent — small negative nudge. |
| **Large Decrease Weight** | `16` | Notable negative shift (declaration of hostility). |
| **Nemesis Weight** | `1` | Rare — a lasting rivalry / instant enemy status. |
| **No Change Weight** | `0` | Nothing happens this roll. `0` = always fire an event; raise to make interval-rolls sometimes idle. |

Default distribution is **symmetric around neutral**: same total up/down pull, with rare "extreme" events (Close Ally, Nemesis) framing the middle.

### Event modifiers

Modifiers scale the event magnitude after it's chosen.

| Modifier | Default | Effect |
|---|---|---|
| **Primary Race Modifier** | `25 %` | Same-race factions (e.g. two Argon successor states) get their event scaled by this factor. Higher = shared-race factions drift together more strongly. |
| **Current Relations Modifier** | `25 %` | Momentum term — events magnified in the direction of the current relation trajectory. |
| **Common Relations Modifier** | `25 %` | Shared-friend / shared-enemy influence — factions with common allies/enemies pulled together, factions with shared enemies pulled together. |

### Flavor + evaluation

| Setting | Default | Effect |
|---|---|---|
| **Enable DW Flavor Text** | `Enabled` | Small thematic messages accompany minor shifts. |
| **Maximum Factions to Check** | `4` | Max number of factions considered per interval fire. Higher = larger politics ripples per tick. |
| **Enable DW Stat Tracking** | `Enabled` | Track war-event statistics for the [War History](./war-history/) report. |

### Fatigue

Cool-down system so a faction can't participate in back-to-back events.

| Setting | Default | Effect |
|---|---|---|
| **Enable DW Fatigue** | `Enabled` | Enable the cool-down system. Off = faster / more chaotic politics. |
| **DW Minimum Time before Fatigue ending** | `120 min` | Fatigue cool-down duration. Higher = slower faction rotation through the event picker. |

### Debug

| Setting | Default | Effect |
|---|---|---|
| **Enable DW Debug** | `Disabled` | Verbose `[WAR]` log lines. |

## DA Dynamic War Menus

Six sub-menus provide direct player intervention and observation:

- **[Increase Relations](./increase-relations/)** — spend Diplomatic Favors to buy +5 relation with a target faction.
- **[Decrease Relations](./decrease-relations/)** — same, in reverse.
- **[Unlock Relations](./unlock-relations/)** — toggle per-faction lock (locked factions don't participate in DW at all).
- **[DW Ignored Factions](./ignored-factions/)** — toggle per-faction "ignored" state (soft skip within DW picks).
- **[Sector Faction Logic Menu](./sector-faction-logic/)** — toggle faction logic per-sector.
- **[War History](./war-history/)** — read-only statistics per faction pair (fatigue, score, ship-kill breakdown).

## Gameplay effect at recommended defaults

1-2 minor events per game hour, and a major shift (Large Increase / Large Decrease) every 8-15 hours. Close Ally / Nemesis events are rare (once per ~50 hours combined). Feels organic. In a 100+ hour save you can watch the political map fully redraw itself.

## Turn off if

You want vanilla static faction relations. Some players prefer canonical Argon-Antigone / Split-Paranid tension without evolution. Set **Enable Dynamic War** to Disabled — everything else stays configurable in case you want to toggle back later.

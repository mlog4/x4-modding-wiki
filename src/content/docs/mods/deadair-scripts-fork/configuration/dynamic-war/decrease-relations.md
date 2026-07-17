---
title: Decrease Relations
description: Spend Diplomatic Favors to buy -5 relation between a source faction and a target. Useful for provoking wars or breaking unwanted alliances.
sidebar:
  order: 2
---

Mirror of [Increase Relations](../increase-relations/) — spend the source faction's Diplomatic Favors to buy **-5** relation with each target.

## In-game view

![Decrease Relations submenu — same layout as Increase, Buy -5 Relation buttons](/x4-modding-wiki/img/mods/deadair-scripts/dw-decrease-relations.jpg)

## Layout

Same structure as [Increase Relations](../increase-relations/):

- **Faction dropdown** — source faction whose favors you're spending.
- **Table:** Faction / Relations / `Buy -5 Relation (1 <src> Diplomatic Favor)` button.

## Special row states

- **`<Faction> Relations Locked.`** — locked factions cannot be adjusted; use [Unlock Relations](../unlock-relations/) first.
- **`Buy -5 Relation (0 Cr)`** — some entries have a free / non-favor price path (Val Selton shows `(0 Cr)` in the screenshot). This is DA's handling of factions the source is already at max-hostile with — no favor cost, but confirmation still needed. Look at the price text carefully before clicking.

## Why decrease?

- Trigger a proxy war between AI factions you dislike.
- Break an unwanted alliance that DA formed between two neighbors.
- Set up a "nemesis" scenario for role-play.
- Undo an accidental Increase purchase.

## Interaction with DW

Buying decrease doesn't disable the auto DW picker — future DW events can still push the relation back up. If you want a permanent hostility state, combine this with:

- [Ignored Factions](../ignored-factions/) — stop DW from touching one side.
- [Unlock Relations](../unlock-relations/) — lock the relation entirely.

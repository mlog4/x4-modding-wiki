---
title: Subscription
description: Game-side reference for faction subscription system (Pirate DLC). Repeating mission feeds. Implemented in MD, not a vanilla scriptproperties datatype.
---

A **Subscription** is a Pirate-DLC feature — the player **subscribes** to a faction's mission feed (war, trade, pirate, mentor themes), and the script repeatedly offers missions of that theme. Implemented entirely in MD, not as a vanilla `scriptproperties.xml` datatype.

For full content + per-faction details see → **[Faction subscriptions catalog](/vanilla-content/faction-subscriptions/)**

## Vanilla subscription types

| Type | Script | Theme |
|---|---|---|
| **War** | `x4ep1_war_subscriptions.xml` (17K lines) | Help faction X fight faction Y |
| **Trade** | `x4ep1_trade_subscriptions.xml` (6.5K) | Deliver supplies / clear pirates from trade lanes |
| **Pirate** | `x4ep1_pirates_subscriptions.xml` (3.8K) | Raid faction X |
| **Mentor** | `x4ep1_mentor_subscription.xml` (3K) | Personal-progression coaching |

## How subscriptions work

```
Player encounters subscription contact NPC
    ↓
gm_joinsubscription mission offered → player accepts → subscribed
    ↓
Background polling cue (Check_Cooldown, 5s interval) checks state
    ↓
When cooldown elapses + subscription active → generate mission
    ↓
Mission piggybacks on existing gm_* template (with subscription-specific context)
    ↓
Tier advances based on success rate + count
```

## Subscription state

Stored in MD globals per-faction-per-subscription:

```
md.X4Ep1_War_Subscriptions.$subscribed.{faction.argon} = true
md.X4Ep1_War_Subscriptions.$tier.{faction.argon} = 3
md.X4Ep1_War_Subscriptions.$mission_count.{faction.argon} = 12
```

## Tier system

Each subscription advances through tiers (typically 5 levels):

- **Tier 0**: Easy missions, small rewards
- **Tier 1**: After 5 successful + relation milestone
- **Tier 2**: After 10 successful + larger relation milestone
- **Tier 3**: Unlocked after scripted milestone
- **Tier 4**: After 25 missions + max relation
- **Tier 5**: Endgame, locked behind significant progression

Tiers reset on unsubscribe.

## Related arcs

- [Faction subscriptions catalog](/vanilla-content/faction-subscriptions/) — full per-type breakdown
- [Subscription missions (technical)](/game/missions/subscription-mission/) — how to write your own
- [Mission encyclopedia](/vanilla-content/missions/) — landscape of all missions

## Cross-DLC subscription scripts

Note that Terran DLC adds Terran-specific subscription extensions:
- `x4ep1_trade_terran.xml` (79KB) — Terran trade
- `x4ep1_war_terran.xml` (132KB) — Terran war
- Split DLC: `x4ep1_war_split.xml` (96KB)

These extend the base subscription system with faction-specific content.

## Mod conflict risks

- ❌ **Pirate DLC required** for the entire subscription system
- ❌ **Mods that disable Scaleplate / Loanshark / Yaki factions** break their subscription paths
- ❌ **Mods changing faction relations** affect subscription gating
- ⚠ **Custom factions can't slot into vanilla subscriptions** without diff'ing `DefineNonSubscriptionWars` for War or analogous for other types

## Related

- [Faction](/game/factions/faction/) — subscription is faction-driven
- [Mission group](/game/factions/missiongroup/) — subscriptions categorize their missions
- [Subscription missions](/game/missions/subscription-mission/) — how to write subscriptions
- [Architectural overview: Mission framework](/overviews/mission-framework/) — bigger context

---

*Subscription is X4's deepest faction-loyalty mechanic — and the most code-heavy in vanilla (war subscriptions alone = 17K lines). Your mod's interference with faction relations, contact NPCs, or subscription gating breaks the system.*

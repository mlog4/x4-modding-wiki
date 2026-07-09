---
title: Faction subscriptions catalog
description: All 4 vanilla subscription types — War / Trade / Pirate / Mentor — with per-faction content. What's offered, who's involved, where conflicts arise.
---

The Pirate DLC (x4ep1) introduced **faction subscriptions** — repeating mission feeds the player joins via a contact NPC. Vanilla ships **4 subscription scripts** with content for specific faction pairs. This catalog lists who's covered and where mod conflicts arise.

For the technical mission lifecycle see [Game API → Subscription missions](/game/missions/subscription-mission/). This page is the **content catalog**.

## At-a-glance

| Subscription | Script | Faction context | Tier system |
|---|---|---|---|
| **War** | `x4ep1_war_subscriptions.xml` (17K lines) | 5 war pairs (see below) | Yes (5 tiers per war) |
| **Trade** | `x4ep1_trade_subscriptions.xml` (6.5K lines) | Antigone Guild + Teladi Guild | Yes |
| **Pirate** | `x4ep1_pirates_subscriptions.xml` (3.8K lines) | Scaleplate Pirates | Yes |
| **Mentor** | `x4ep1_mentor_subscription.xml` (3K lines) | Personal mentor (RM_SETA) | Single tier |

## War subscriptions — 5 wars

Vanilla covers **5 distinct war fronts**. The player can subscribe to each independently.

| War pair | Theme | Contact NPC location |
|---|---|---|
| **ARG_VS_XENON** | Argon vs Xenon (main Xenon war) | Argon military rep |
| **ARG_VS_HOL** | Argon vs Holy Order | Argon political rep |
| **PAR_VS_HOL** | Godrealm Paranid vs Holy Order | Paranid (godrealm) military rep |
| **HOL_VS_ARG** | Holy Order vs Argon (mirror) | Holy Order officer |
| **HOL_VS_PAR** | Holy Order vs Godrealm | Holy Order officer |

Each war is a **state machine** tracked per-player-save:

- Subscribed: yes/no
- Tier: 0-5
- Mission count: integer
- Cooldown timer: per-war

The **threat report system** (between-mission newsfeed) delivers status updates to the player even when no mission is active.

### What each war offers

Generic war mission types per war flow:

- **Kill X ships of enemy faction**
- **Destroy enemy station modules**
- **Defend ally station from incoming attack**
- **Escort ally fleet through contested space**
- **Sabotage enemy supply lines**
- **Hack enemy data panel**

Higher tier unlocks larger/more dangerous targets + bigger rewards.

### Mod conflict risks — war subscriptions

- ❌ **Don't make the warring factions allied at game start** — `Set_Subscription_Status` checks faction.X.relationto.{faction.Y} to gate war activation; allied factions → subscription unavailable
- ❌ **Don't despawn faction war contact NPCs** without re-establishing them
- ⚠ **Custom factions can't slot into vanilla wars** without diff-ing `DefineNonSubscriptionWars` and adding contact-NPC infrastructure
- ⚠ **Faction-deactivated path triggers cleanup** — if your mod permanently destroys e.g. faction.holyorder, ARG_VS_HOL / PAR_VS_HOL / HOL_VS_PAR / HOL_VS_ARG all cleanup-self
- ⚠ **Pirate DLC required**

---

## Trade subscriptions — 2 guilds

| Guild | Theme | Activities |
|---|---|---|
| **ANTIGONE_GUILD** | Antigone Republic trade guild | Trade route protection, supply delivery, ware barter, ferrying |
| **TELADI_GUILD** | Teladi trade guild | Profit-themed missions, smuggling-adjacent, mineral trade |

Each guild has tier progression. Higher tiers unlock:

- Larger trade-cargo missions
- Rare ware deliveries
- Premium-route protection assignments
- Access to specific cargo unlocks (e.g. luxury wares)

### What trade missions look like

- **Deliver wares to X by Y** (time-pressure)
- **Barter wares between stations** (multi-leg)
- **Protect convoy through hostile space**
- **Buy supply for faction at cost-plus** (margin-based)

### Mod conflict risks — trade subscriptions

- ❌ **Don't make Antigone or Teladi hostile at start** — guild access requires non-hostile
- ❌ **Don't replace luxury ware macros** (`majadust`, `majasnails`, etc.) without trade subscription registration
- ⚠ **Economy mods that change ware values reshape trade reward math** — vanilla calibrates ware values for sensible rewards; rebalances break that

---

## Pirate subscriptions — Scaleplate Pirates

**SCALEPLATE_PIRATES** is the only Pirate guild script. Theme: raiding, smuggling, illegal cargo runs.

### What pirate missions offer

- **Raid trade routes** (kill Argon/Teladi traders)
- **Steal cargo from specific ships**
- **Sabotage anti-pirate operations**
- **Run contraband** to specific stations
- **Capture ship for ransom**

### Mod conflict risks — pirate subscriptions

- ❌ **Don't make Scaleplate Pirates docile** at start
- ⚠ **Don't disrupt the smuggler economy** — pirate missions need viable smuggling targets
- ⚠ **Custom pirate factions** can't reuse Scaleplate subscription infrastructure without diff'ing the cue tree
- ⚠ **Pirate DLC required**

---

## Mentor subscription — RM_SETA

The **Mentor subscription** is the simplest — single-flow, personalized progression coaching. The contact NPC offers **incremental skill-up missions** tailored to player current capabilities.

### What mentor missions are

- **Personal-progression missions** — challenge level scales with player
- **Skill-specific tasks** — combat skills, exploration, trade, building
- **Boss missions** — culminating challenge

### Mod conflict risks — mentor subscription

- ⚠ **Mod-induced player power changes confuse calibration** — mentor scales difficulty based on player stats; mods that 10× player damage trivialize all mentor missions
- ⚠ **Single-flow simpler than war** — good starting point if you're writing your own subscription (see [Subscription missions → Adding your own](/game/missions/subscription-mission/#adding-your-own-subscription))

---

## Subscription tier mechanics (universal)

All four subscription types share the tier-advancement pattern:

```
Tier 0 (starting): Easy missions, small rewards
Tier 1: Unlocked after 5 successful missions
Tier 2: Unlocked after 10 successful + relation milestone
Tier 3: Unlocked after specific story / scripted milestone
Tier 4: Unlocked after 25 missions + max relation tier
Tier 5: Endgame tier, locked behind significant progression
```

Tiers reset on unsubscribe.

## Common mod-vs-subscription patterns

### Faction mod adds new subscription

Two paths:

1. **Use existing script as template** — diff `x4ep1_mentor_subscription.xml` (simplest) and replace the contact + theme
2. **Write standalone** — copy the structure but new namespace; faction integration via your own MD scripts

In both cases you need:

- Contact NPC (spawned + anchored)
- Tier registry (`md.YourMod.$tier.{faction.X}`)
- Cooldown timer
- Mission generator (often piggybacks on vanilla `gm_*`)
- Save migration patches

### Relation mod breaks subscription gating

Many subscription cooldowns check relation to target faction. If your mod sets relations:

```xml
<!-- Vanilla pattern -->
<conditions>
    <event_faction_relation_changed/>
    <check_value value="faction.argon.relationto.{faction.player}.uivalue ge 15"/>
</conditions>
```

…then your mod setting relation to 30 at game start **fires this immediately**, possibly out-of-order from intended subscription progression.

### Economy mod breaks reward math

Subscription rewards route through `LIB_Reward_Balancing`. Your economy mod's ware-value changes feed into reward calculation. Test: accept a subscription mission, check the offered reward feels sensible.

## Code references

| Concern | File |
|---|---|
| War subscription orchestration (most complex) | `x4ep1_war_subscriptions.xml` ARG_VS_XENON namespace |
| Trade subscription (Antigone guild) | `x4ep1_trade_subscriptions.xml` ANTIGONE_GUILD |
| Pirate subscription | `x4ep1_pirates_subscriptions.xml` SCALEPLATE_PIRATES |
| Mentor (simplest template) | `x4ep1_mentor_subscription.xml` RM_SETA |
| Subscription join hook | `gm_joinsubscription.xml` |
| Reusable join library | `rml_joinsubscription.xml` |
| Threat report system | `x4ep1_war_subscriptions.xml` GenerateThreatReports |

## Related

- [Vanilla content index](/vanilla-content/)  — landscape
- [Game API → Subscription missions](/game/missions/subscription-mission/) — technical reference
- [Story arcs catalog](/vanilla-content/story-arcs/) — Paranid civil war affects HOL faction relations
- [Wiki: DLC handling](/wiki/dlc-handling/) — Pirate DLC required
- [Architectural overview: Reward calculation](/overviews/reward-calculation/) — `LIB_Reward_Balancing`

---

*Vanilla subscriptions are the closest X4 has to repeating "guild quest" content. Your faction mod's subscription needs to fit into this ecosystem, not parallel it — players expect the same UI + tier semantics.*

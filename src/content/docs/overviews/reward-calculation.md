---
title: Reward calculation
description: How vanilla computes mission credits, notoriety, mod parts, and info rewards. The LIB_Reward_Balancing central formula and its multipliers.
---

When the player completes a "Find this object" mission for Argon, the engine awards a specific number of credits, a notoriety boost, and possibly mod parts. The math behind those numbers is **LIB_Reward_Balancing** — a single 914-line library that vanilla missions delegate to.

This overview explains the formula, the multipliers, and how to tune rewards for custom missions.

For the mission-side perspective, see [Mission framework](/overviews/mission-framework/).

## The library structure

`md/lib_reward_balancing.xml` is **914 lines** containing ~12 named libraries. The most important:

| Library | Purpose |
|---|---|
| `GetValue_Credits` | Computes base credit reward |
| `GetValue_Notoriety` | Computes notoriety boost |
| `Allocate_RewardWeight` | Weighs different reward types |
| `Apply_RewardMultiplier` | Applies difficulty / faction multipliers |
| `DetermineAdditionalReward` | Picks bonus rewards (mod parts, info) |
| `Apply_TimeBonusCr` | Time-based completion bonus |
| `TimeBonusCr_Max` | Cap on time bonus |
| `Get_Suitable_Mod_Part` | Picks an appropriate mod part for the player |

Missions call these via `<run_actions ref="md.LIB_Reward_Balancing.X">` rather than computing rewards themselves.

## Credit reward formula (high level)

The credit reward for a mission depends on:

1. **Base value** — a per-mission-type baseline (find = X, deliver = Y, board = Z)
2. **Difficulty multiplier** — easy / medium / hard tier
3. **Faction multiplier** — friendlier factions pay more
4. **Time bonus** — completing under target time adds bonus

A simplified pseudo-formula:

```
credits = base_value
        × difficulty_multiplier
        × faction_relation_multiplier
        × (1 + time_bonus_fraction)
```

The actual computation involves many lookups and clamps. Vanilla aims for a **steep difficulty curve** — high-tier missions pay disproportionately more than mid-tier, creating a "go for the big jobs" incentive.

### Difficulty tier multipliers

Vanilla tier-based credit multipliers (approximate, from memory of LIB_Reward_Balancing):

| Tier | Multiplier (credits) |
|---|---|
| Trivial | 1× |
| Easy | 1.4× |
| Medium | 8× |
| Hard | 40× |
| Very Hard | 400× |
| Insane | 1000× |

This steep curve is intentional — vanilla wants players to seek out harder missions for outsized rewards.

## Notoriety reward (relation boost)

Notoriety follows a **flatter curve** than credits — vanilla wants long-term relation progression, not "complete one mission = instant friend":

| Tier | Multiplier (notoriety) |
|---|---|
| Trivial | 1× |
| Easy | 1.2× |
| Medium | 4× |
| Hard | 10× |
| Very Hard | 20× |

Notoriety doesn't scale exponentially because the relation system has a finite top (`+30`); a 1000× multiplier would make missions trivially raise relations.

## RelationBoost brackets

The notoriety reward is also gated by current relation tier — at different relation brackets, you get different bonuses:

| Player relation with faction | Boost behaviour |
|---|---|
| Neutral or below | Standard notoriety reward |
| Friendly | Standard reward, plus mod parts at some tiers |
| Ally | Larger mod-part rewards, possibly blueprint reveals |

At the highest relation tier (`ally`), vanilla also awards **mod parts**, **info reveals**, and at certain milestones, **seminars** (player ability points). These extras are gated through `DetermineAdditionalReward` + `Get_Suitable_Mod_Part`.

## Mod parts

Mod parts (`ware.modpart_*`) are crafting reagents for the player's mod-equipment system. Each mod part has a quality tier (`t1` / `t2` / `t3`).

`Get_Suitable_Mod_Part` picks a mod part based on:
- Player's current relation tier (higher tier → better mod parts)
- Mission difficulty (harder missions → better mod parts)
- Random variance (so two identical missions don't always give the same part)

Example mod parts referenced by vanilla:
- `ware.modpart_shieldgeneratorcoil_t1` / `_t2` / `_t3`
- `ware.modpart_engine*`
- `ware.modpart_weapon*`

See [Shield generator gotchas](/game/objects/shield-generator/#common-gotchas) for the mod-parts-vs-runtime distinction.

## Time bonus

Missions with a target time award bonus credits for fast completion:

```
time_bonus_cr = base × bonus_fraction × time_remaining_ratio
```

Capped at `TimeBonusCr_Max` to prevent absurdly fast completion from skewing rewards.

## Discount system (TODO)

`Get_Discounts` is referenced in the file as a TODO placeholder — vanilla intends to add a "discount unlock" reward type (player gets X% off this faction's wares) but the implementation is incomplete. Modders extending the reward system shouldn't depend on this slot until vanilla ships it.

## Info reveals

At high relation tiers, some missions reveal data — sector knowledge, blueprint hints, NPC tip-offs. These are dispatched via `DetermineAdditionalReward` and shown as encyclopedia entries.

## How custom missions integrate

Custom missions should call `LIB_Reward_Balancing` libraries rather than computing rewards directly:

```xml
<run_actions
    ref="md.LIB_Reward_Balancing.GetValue_Credits"
    result="$credits">
    <param name="Difficulty" value="$myDifficulty"/>
    <param name="MissionType" value="missiontype.find"/>
    <param name="Faction" value="$myFaction"/>
</run_actions>

<transfer_money
    from="$QuestGiver"
    to="player.entity"
    amount="($credits)Cr"/>
```

This way:
- Your mission integrates with the player's economy
- Players don't see jarring reward inconsistencies
- Your mission scales with the existing tier system

### Direct reward (skipping LIB_Reward_Balancing)

If you skip the library and pay a fixed sum, your mission rewards will be either ridiculously over- or under-valued compared to vanilla. Most modders accept the library's values and tune via the difficulty parameter.

## Why this matters for modders

### Vanilla balance assumes the library

Vanilla NPC economy is balanced assuming missions pay through `LIB_Reward_Balancing`. A mod that pays 10× the library values inflates the player's economy.

### Mod parts are a vanilla resource

Mod parts come exclusively from missions + lockboxes. Adding more sources via custom missions can flood the player's crafting economy. Tune carefully.

### Notoriety inflation

Notoriety rewards from custom missions stack with vanilla rewards. A mod that gives `set_faction_relation +0.5` per mission completion will quickly max relations. Use `LIB_Reward_Balancing.GetValue_Notoriety` for vanilla-consistent values.

### Reward type extension

If your mod adds a new reward type (new ware, mod part variant), reference it from `DetermineAdditionalReward` for vanilla integration. This requires diffing the library — possible but error-prone with multiple mods.

## Cross-references

- [Faction](/game/factions/faction/) — relation system that notoriety affects
- [Ware](/game/economy/ware/) — `modpart_*` and reward wares
- [Mission framework](/overviews/mission-framework/) — what calls these libraries
- [Shield generator](/game/objects/shield-generator/) — mod parts mentioned in gotchas

## Related architectural overviews

- [Mission framework](/overviews/mission-framework/) — parent system
- [Faction goals](/overviews/faction-goals/) — strategic actions that drive faction relations

---

:::tip[Pattern — central balance library]
Reward calculation is **X4's single balance authority** — every mission delegates here. 914 lines of formulas + lookups for ONE concern (rewards). Modders adding custom missions should call into it; modders extending the reward system should diff carefully, knowing vanilla's economy assumes this library.
:::

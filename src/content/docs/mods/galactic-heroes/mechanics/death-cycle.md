---
title: Death cycle (d100 roll)
description: When a hero's flagship is destroyed, a d100 roll decides KIA / wounded / unscathed. Distribution, outcomes, cooldowns, and how to tune the difficulty.
---

Heroes can die for real. When a hero's **flagship** is destroyed, the mod fires a d100 roll to decide their fate. The roll is not a coin flip — it is a **symmetric distribution around a "wounded" bucket**, and it is tunable by the player.

## What triggers the roll

Only **flagship loss** triggers the death cycle. Not:

- Loss of an escort ship (recorded but does not affect hero state — future: "attrition = N/M escorts")
- Hero NPC missing from flagship (boarding / kidnap — future stage 2)
- Flagship faction change (capture — separate case, not a death event)

This is a deliberate MVP simplification. The clean flow is: **flagship dies → hero loses command → roll for fate → cooldown → recovery**.

## The roll

When the mod's `MlogHeroesFleetLossWatcher` fires with `event.object == hero.$flagship`, the mod rolls:

```
roll = random.range(0, 99)

if roll < $crit_fail_chance
    → KIA
elif roll < (100 - $crit_fail_chance)
    → wounded
else
    → unscathed
```

The distribution is symmetric around the wounded bucket. With default `$crit_fail_chance = 20`, the split is:

| Roll | Outcome | Probability |
|---|---|---|
| 0–19 | KIA | 20% |
| 20–79 | Wounded | 60% |
| 80–99 | Unscathed | 20% |

## Outcomes

### KIA (Killed in Action)

- **20% chance** at default settings.
- Hero is **permanently gone**. The instance moves to `$kia_heroes` archive with full stats: name, faction, final XP, final ★, kill count, last kill, cause of death, `$kia_at = player.age`.
- The **lineage template** enters vacancy: `$vacant_until = player.age + $succession_cooldown_min` (default 120 game-minutes).
- After the cooldown, HeroManager may pick this template again and spawn a **new bearer** — fresh XP, new face, new name from the pool. See [Lineage succession](../lineage-succession/) for the full flow.
- Old bearer never returns. Dead is dead.

![KIA archive UI — "no fallen heroes — all bearers still alive or in active recovery"; the archive shows every hero permanently lost with their final stats, cause of death, and $kia_at timestamp](/x4-modding-wiki/img/mods/galactic-heroes/kia-archive.jpg)

### Wounded

- **60% chance** at default settings.
- Hero **survives** but is out of action. The `$admiral` entity is destroyed on the mod side (they escape the burning wreck via game abstraction).
- Fleet is cleared: `$flagship = null`, `$escorts = []`.
- Hero enters a **120 game-minute cooldown**. During cooldown, RP does not tick (see [Recovery Points](../recovery-points/)).
- After cooldown, the same bearer starts rebuilding from RP. XP / ★ / kill count preserved.

### Unscathed

- **20% chance** at default settings.
- Hero **escapes the wreck** intact. Flagship gone but the person is fine.
- Same state changes as wounded, but shorter cooldown: **30 game-minutes**.
- Rationale: faction quickly issues a new command to a proven officer; less institutional shock.

## Configurable difficulty

The KIA / Unscathed % is set by `$crit_fail_chance` in `MlogHeroesInit` actions. Valid range 0–50 (values above 50 flip the distribution).

| `$crit_fail_chance` | Distribution | Feel |
|---|---|---|
| 10 | 10% KIA / 80% wounded / 10% unscathed | "Cinematic" — deaths rare but memorable |
| **20 (default)** | 20% / 60% / 20% | Balanced — regular attrition, occasional permanent losses |
| 35 | 35% / 30% / 35% | "Grimdark" — heroes die often, high succession churn |
| 50 | 50% / 0% / 50% | "Russian roulette" — every flagship loss is either final or clean escape |

Once the Settings menu ships (planned), the dial will be surfaced in-game. Currently the parameter is edited in `deploy/md/mlog_heroes.xml` `MlogHeroesInit` init actions.

## Why symmetric 20/60/20?

- **Worst-case and best-case are equiprobable** — the mod does not bias toward doom or salvation.
- **Wounded is the modal outcome** — most losses feel like a "grinding war of attrition", not a moment of finality. This preserves narrative momentum.
- **The parameter is a dial** — a balance-tester can push toward cinematic or grimdark to taste. The design is not opinionated about which flavour is "correct".

## What the player sees

- **Immediate on flagship destruction**: a notification banner names the hero and the outcome ("KIA" / "Wounded" / "Escaped").
- **After a KIA**: the hero disappears from the [roster](../../#in-game-menu-tour). Their entry moves to the KIA archive (planned UI — currently accessible only via debug).
- **After a wounded / unscathed outcome**: the hero remains in the roster with state = `lost_flagship`. The Track button is hidden. The detail page shows "Awaiting recovery" and a countdown to cooldown end.

![Xenon Mil Unit Model 6 — admiral ★★, state = lost_flagship, decision = Retreating; flagship XL_K destroyed; escorts show "0 / 4 (rebuild pending)" for M-class and "0 / 8 (rebuild pending)" for S-class; RP=37/200 rebuilding at +2/2 min](/x4-modding-wiki/img/mods/galactic-heroes/recovery-lost-flagship.jpg)

The screenshot above is a real recovery in progress — Xenon Mil Unit rolled Wounded on flagship loss, is now in the 120-min cooldown, and their fleet slots read "rebuild pending" until Recovery Points refill.

## Related mechanics

- [Recovery Points](../recovery-points/) — how the fleet rebuilds after wounded / unscathed outcomes
- [Lineage succession](../lineage-succession/) — what happens after a KIA, when the successor may spawn, and how the archive works
- [XP and star progression](../xp-and-stars/) — memorial preservation across recovery (XP does not reset when a wounded hero rebuilds)

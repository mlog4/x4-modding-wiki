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
crit = clamp($crit_fail_chance + perk modifiers, 0, 100)
roll = random 1..100

if   roll <= crit          → KIA
elif roll <= (100 - crit)  → wounded
else                       → unscathed
```

The distribution is symmetric around the wounded bucket. With the default `$crit_fail_chance = 20` and no perks:

| Roll | Outcome | Probability |
|---|---|---|
| 1–20 | KIA | 20% |
| 21–80 | Wounded | 60% |
| 81–100 | Unscathed | 20% |

### Perks move the dial, per hero

`crit` is not a constant. It is the setting **plus whatever the hero's own perks contribute**, clamped to 0–100.

One perk does this today: **[Lucky](../perks/)** — rare, available to all six archetypes — carries `$kia_chance_bonus = -10`. A Lucky hero rolls **10% KIA / 80% wounded / 10% unscathed**, halving its chance of dying on any given flagship loss.

So 20% KIA is the galaxy default, not a fact about the hero you are watching. Check its perk list before assuming the odds.

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

⚠ **Those are release figures.** The current alpha ships with the debug flag on, and in a debug build the cooldowns are **4 minutes wounded, 2 minutes unscathed** and the succession vacancy is **10 minutes** rather than 120. A hero coming back far faster than this page says is the build, not a bug.

## Configurable difficulty

The KIA / Unscathed share is set by `$crit_fail_chance` in `MlogHeroesInit`. Values above 50 flip the distribution, so 0–50 is the useful range.

| `$crit_fail_chance` | Distribution | Feel |
|---|---|---|
| 10 | 10% KIA / 80% wounded / 10% unscathed | "Cinematic" — deaths rare but memorable |
| **20 (default)** | 20% / 60% / 20% | Balanced — regular attrition, occasional permanent losses |
| 35 | 35% / 30% / 35% | "Grimdark" — heroes die often, high succession churn |
| 50 | 50% / 0% / 50% | "Russian roulette" — every flagship loss is either final or clean escape |

⚠ **Unlike most of the mod's tuning, this one is not a slider.** It is a script constant, and there is no death-roll row anywhere on the Settings screens — changing it means editing `mlog_heroes.xml`. Much of the rest of the mod is declared data with a default, a range and a hint; the death roll is not, and that is a gap rather than a decision.

What the Settings → Heroes screen does carry for this system is the **Succession test** bench — buttons that simulate a succession, force-spawn an admiral, or audit every hero flagship — plus per-hero *(debug) Force loss → KIA / Wounded / Unscathed* buttons on the hero detail page. Those force an outcome rather than rolling for it, which is how the three branches get exercised without waiting for a real death.

## Why symmetric 20/60/20?

- **Worst-case and best-case are equiprobable** — the mod does not bias toward doom or salvation.
- **Wounded is the modal outcome** — most losses feel like a "grinding war of attrition", not a moment of finality. This preserves narrative momentum.
- **The parameter is a dial** — a balance-tester can push toward cinematic or grimdark to taste. The design is not opinionated about which flavour is "correct".

## What the player sees

- **Immediate on flagship destruction**: a notification banner names the hero and the outcome ("KIA" / "Wounded" / "Escaped").
- **After a KIA**: the hero disappears from the [roster](../../#in-game-menu-tour). Their entry moves to the **KIA archive**, which is a menu page of its own — final stats, cause of death, and the last deeds the [chronicle](../../corporate/chronicle/) kept under the memorial cap.
- **After a wounded / unscathed outcome**: the hero remains in the roster with state = `lost_flagship`. The Track button is hidden. The detail page shows "Awaiting recovery" and a countdown to cooldown end.

![Xenon Mil Unit Model 6 — admiral ★★, state = lost_flagship, decision = Retreating; flagship XL_K destroyed; escorts show "0 / 4 (rebuild pending)" for M-class and "0 / 8 (rebuild pending)" for S-class; RP=37/200 rebuilding at +2/2 min](/x4-modding-wiki/img/mods/galactic-heroes/recovery-lost-flagship.jpg)

The screenshot above is a real recovery in progress — Xenon Mil Unit rolled Wounded on flagship loss, is now in the 120-min cooldown, and their fleet slots read "rebuild pending" until Recovery Points refill.

## Related mechanics

- [Recovery Points](../recovery-points/) — how the fleet rebuilds after wounded / unscathed outcomes
- [Lineage succession](../lineage-succession/) — what happens after a KIA, when the successor may spawn, and how the archive works
- [XP and star progression](../xp-and-stars/) — memorial preservation across recovery (XP does not reset when a wounded hero rebuilds)

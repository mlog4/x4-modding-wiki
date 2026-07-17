---
title: Xenon ship mods per Evolution level
description: Full per-level breakdown of the 6 equipment mod categories (Engine, Ship, Shield, Weapon, Missile, Eco) applied to newly built Xenon ships at each Evolution level 1-10.
sidebar:
  order: 7
---

Every Evolution level unlocks one **new tier of equipment mods across 6 categories**. Newly built Xenon ships get the current-level mod on their appropriate slot: engine mod on engines, ship mod on hull, shield mod on shields, and so on. The mod is applied at build time via `apply_equipment_mods` — existing ships in the field are **not** retroactively upgraded.

Verified against [`libraries/equipmentmods.xml`](https://github.com/mlog4/deadair_scripts) and `LibraryEvolutionSetEQMods` in `md/deadairdynamicuniverse.xml` (line ~3589).

## The six categories

At each level, DA assigns six mod ware IDs to `$DAEvolutionCurrentEQMods` in this order:

| Slot | Category | Ware id pattern | Primary stat | Bonus slots |
|---|---|---|---|---|
| 1 | **Engine** | `mod_engine_xenon_L_da` | forwardthrust | up to 4 |
| 2 | **Ship (hull)** | `mod_ship_xenon_L_da` | mass reduction | up to 2 |
| 3 | **Shield** | `mod_shield_xenon_L_da` | capacity | none |
| 4 | **Weapon (turret/gun)** | `mod_weapon_xenon_L_da` | damage | up to 2 |
| 5 | **Missile weapon** | `mod_weapon_xenon_missile_L_da` | rotationspeed | none |
| 6 | **Ship eco (economy hull variant)** | `mod_ship_xenon_eco_L_da` | mass reduction | up to 3 |

**All bonus rolls have chance=1.0** — the "up to N" bonuses are always all applied, so there's no randomness in the outcome. Values are constant per level (min == max in the source).

Where `L` = Evolution level 1-10.

Mod **quality tier**: Levels 1-3 → quality 1, Levels 4-6 → quality 2, Levels 7-10 → quality 3.

## 1. Engine mod (`mod_engine_xenon_L_da`)

Every engine mod boosts forward thrust and stacks four guaranteed bonuses on top: rotation thrust, boost thrust, travel thrust, and travel charge time.

| Level | forwardthrust | rotationthrust | boostthrust | travelthrust | travelchargetime | Quality |
|---|---|---|---|---|---|---|
| 1 | ×1.05 | ×1.05 | ×1.05 | ×1.025 | ×0.95 (5% faster) | 1 |
| 2 | ×1.10 | ×1.10 | ×1.10 | ×1.05 | ×0.90 | 1 |
| 3 | ×1.15 | ×1.15 | ×1.15 | ×1.075 | ×0.85 | 1 |
| 4 | ×1.20 | ×1.20 | ×1.20 | ×1.10 | ×0.80 | 2 |
| 5 | ×1.25 | ×1.25 | ×1.25 | ×1.125 | ×0.75 | 2 |
| 6 | ×1.30 | ×1.30 | ×1.30 | ×1.15 | ×0.70 | 2 |
| 7 | ×1.35 | ×1.35 | ×1.35 | ×1.175 | ×0.65 | 3 |
| 8 | ×1.40 | ×1.40 | ×1.40 | ×1.20 | ×0.60 | 3 |
| 9 | ×1.45 | ×1.45 | ×1.45 | ×1.225 | ×0.55 | 3 |
| 10 | ×1.50 | ×1.50 | ×1.50 | ×1.25 | ×0.50 (50% faster) | 3 |

At Evolution level 10 a Xenon ship's engine is **50% stronger on forward + rotation + boost thrust, 25% stronger on travel thrust, and its travel drive charges twice as fast**.

## 2. Ship (hull) mod (`mod_ship_xenon_L_da`)

Reduces ship mass (primary) and stacks two guaranteed bonuses: drag reduction and hull HP.

| Level | mass | drag | maxhull | Quality |
|---|---|---|---|---|
| 1 | ×0.95 (5% lighter) | ×0.975 | ×1.025 (+2.5% HP) | 1 |
| 2 | ×0.90 | ×0.95 | ×1.05 | 1 |
| 3 | ×0.85 | ×0.925 | ×1.075 | 1 |
| 4 | ×0.80 | ×0.90 | ×1.10 | 2 |
| 5 | ×0.75 | ×0.875 | ×1.125 | 2 |
| 6 | ×0.70 | ×0.85 | ×1.15 | 2 |
| 7 | ×0.65 | ×0.825 | ×1.175 | 3 |
| 8 | ×0.60 | ×0.80 | ×1.20 | 3 |
| 9 | ×0.55 | ×0.775 | ×1.225 | 3 |
| 10 | ×0.50 (half mass) | ×0.75 | ×1.25 (+25% HP) | 3 |

At L10 the hull is **half its normal mass, 25% less draggy, and has 25% more HP** — so much lighter + tankier, which multiplies with the engine mod's thrust boost to make L10 Xenon ships noticeably more agile than vanilla.

## 3. Shield mod (`mod_shield_xenon_L_da`)

Straight shield capacity boost, no bonus rolls.

| Level | capacity | Quality |
|---|---|---|
| 1 | ×1.05 | 1 |
| 2 | ×1.10 | 1 |
| 3 | ×1.15 | 1 |
| 4 | ×1.20 | 2 |
| 5 | ×1.25 | 2 |
| 6 | ×1.30 | 2 |
| 7 | ×1.35 | 3 |
| 8 | ×1.40 | 3 |
| 9 | ×1.45 | 3 |
| 10 | ×1.50 (+50% shield HP) | 3 |

## 4. Weapon mod (`mod_weapon_xenon_L_da`)

Boosts weapon damage (primary) and stacks two guaranteed bonuses: mining efficiency and turret rotation speed.

| Level | damage | mining | rotationspeed | Quality |
|---|---|---|---|---|
| 1 | ×1.05 | ×1.10 | ×1.05 | 1 |
| 2 | ×1.10 | ×1.20 | ×1.10 | 1 |
| 3 | ×1.15 | ×1.30 | ×1.15 | 1 |
| 4 | ×1.20 | ×1.40 | ×1.20 | 2 |
| 5 | ×1.25 | ×1.50 | ×1.25 | 2 |
| 6 | ×1.30 | ×1.60 | ×1.30 | 2 |
| 7 | ×1.35 | ×1.70 | ×1.35 | 3 |
| 8 | ×1.40 | ×1.80 | ×1.40 | 3 |
| 9 | ×1.45 | ×1.90 | ×1.45 | 3 |
| 10 | ×1.50 (+50% dmg) | ×2.00 (2× mining) | ×1.50 (turrets track 50% faster) | 3 |

The **rotationspeed** bonus is why L10 Xenon turrets track fast-moving player ships — same reason vanilla combat mods raise this stat. The mining bonus applies to mining weapons on their miners.

## 5. Missile weapon mod (`mod_weapon_xenon_missile_L_da`)

Boosts missile weapon rotation speed only — no other bonuses.

| Level | rotationspeed | Quality |
|---|---|---|
| 1 | ×1.05 | 1 |
| 2 | ×1.10 | 1 |
| 3 | ×1.15 | 1 |
| 4 | ×1.20 | 2 |
| 5 | ×1.25 | 2 |
| 6 | ×1.30 | 2 |
| 7 | ×1.35 | 3 |
| 8 | ×1.40 | 3 |
| 9 | ×1.45 | 3 |
| 10 | ×1.50 | 3 |

Reads modest but matters for missile boat classes (Xenon K's missile launchers, etc.) where turret rotation gates dps.

## 6. Ship eco mod (`mod_ship_xenon_eco_L_da`)

Applied to Xenon economy-class ships (miners, transports). Same primary as the regular ship mod (mass reduction) but with **three** bonus slots including radar cloak and a stronger hull boost.

| Level | mass | drag | radarcloak | maxhull | Quality |
|---|---|---|---|---|---|
| 1 | ×0.95 | ×0.975 | −0.05 (5% harder to detect) | ×1.05 | 1 |
| 2 | ×0.90 | ×0.95 | −0.10 | ×1.10 | 1 |
| 3 | ×0.85 | ×0.925 | −0.15 | ×1.15 | 1 |
| 4 | ×0.80 | ×0.90 | −0.20 | ×1.20 | 2 |
| 5 | ×0.75 | ×0.875 | −0.25 | ×1.25 | 2 |
| 6 | ×0.70 | ×0.85 | −0.30 | ×1.30 | 2 |
| 7 | ×0.65 | ×0.825 | −0.35 | ×1.35 | 3 |
| 8 | ×0.60 | ×0.80 | −0.40 | ×1.40 | 3 |
| 9 | ×0.55 | ×0.775 | −0.45 | ×1.45 | 3 |
| 10 | ×0.50 | ×0.75 | −0.50 (50% harder to detect) | ×1.50 (+50% HP) | 3 |

**Note on maxhull:** the eco variant's hull boost is **larger** than the combat ship mod (+50% at L10 vs +25%). Xenon miners are meaningfully tankier than their spec at high evolution. Combined with radar cloak, they're hard to find AND hard to kill — a real change from vanilla behavior where a miner is basically free XP for a solo fighter.

## What this looks like in gameplay

A rough thumbnail of a fresh Xenon K straight off the shipyard at Evolution level 10, vs a fresh one at level 0:

| Stat | L0 (vanilla) | L10 | Change |
|---|---|---|---|
| Forward thrust | baseline | ×1.50 | +50% |
| Rotation thrust | baseline | ×1.50 | +50% |
| Travel charge | baseline | ×0.50 | 2× faster |
| Hull mass | baseline | ×0.50 | half |
| Hull HP | baseline | ×1.25 | +25% |
| Shield HP | baseline | ×1.50 | +50% |
| Weapon damage | baseline | ×1.50 | +50% |
| Turret rotation | baseline | ×1.50 | +50% |

That's not "a bit tougher". A pilot who knows L0 K encounters instinctively will get killed by L10 K encounters unless they adjust — the K arrives faster, dodges faster, out-DPS's, and eats 50% more shield damage before it starts losing hull.

## Data source

All values above come straight from [`libraries/equipmentmods.xml`](https://github.com/mlog4/deadair_scripts) lines 3-502 in the current head. The `min` and `max` fields are identical per level, so there's zero variation — you always get exactly the numbers listed. Ware definitions live in the same folder's `wares.xml`.

## Related

- [DA Evolution](../) — the main configuration menu.
- [Xenon Evolution is time-based, not combat-based](../../../mechanics/#xenon-evolution-is-time-based-not-combat-based) — how levels advance.
- [Xenon Evolution status report](../../../reports/evolution-status/) — the in-game read-only report for the current tier.

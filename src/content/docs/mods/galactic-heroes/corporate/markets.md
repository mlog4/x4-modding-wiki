---
title: Ships, parts and seminars
description: The three goods markets behind the Exchange's other tabs — decommissioned hulls and Xenon trophies priced off hull damage, equipment mods asked from the ware database, and crew seminars at ten times shop price.
---

The [Galactic Exchange](../galactic-exchange/) has four tabs and only the first is a share market. The other three sell things.

They share one skeleton: **each faction lists stock once an hour, a lot sits for six hours, unsold lots are withdrawn, and nothing exists until you pay.** An offer is a row in a list; the item is created at purchase. Only the goods differ.

All three are reachable without leaving the Exchange screen, and all three are gated on what factions think of you.

## Decommissioned hulls

Factions retire ships. This is where the hulls go.

![Galactic Exchange, SHIPS tab. A status row shows Portfolio 1640600 Cr, Cash 8277370 Cr, Commission 5 percent. Offers are grouped under faction headings - Antigone Republic, Argon Federation, Duke's Buccaneers, Hatikvah Free League, Holy Order of the Pontifex, Godrealm of the Paranid, Teladi Company, Free Families. Each row gives the ship name, the word decommissioned, its class ship_s, ship_m or ship_l, whether it is military or civilian, a hull damage percentage and a price, with a Buy button - for example Elite Vanguard, decommissioned, ship_s, military, 51 pct, 14 k Cr; Cerberus Sentinel ship_m military 7 pct 423 k Cr; Phoenix E ship_l military 13 pct 2051 k Cr; and a Kestrel Vanguard at 0 pct for 36 k Cr](/x4-modding-wiki/img/mods/galactic-heroes/exchange-ships.jpg)

### Who offers what

| Knob | Default | Meaning |
|---|---|---|
| Civilian hulls from relation | 10 | Traders, miners, transports |
| Military hulls from relation | 20 | Anything armed |
| Small hulls, at most | 4 | per faction, per hour |
| Medium hulls, at most | 2 | per faction, per hour |
| Large hull chance | 50% | at most one, when it rolls |
| Very large hull chance | 10% | at most one, when it rolls |

The shape of that table is the design: **small hulls are stock, large hulls are an event.** A faction you are merely tolerated by will show you freighters; a faction that likes you will occasionally put a destroyer on the board.

### The price is the damage

Price falls out of two multiplications, not a table:

> price = average ware price × (100 − decommission discount) × (100 − hull damage)

| Knob | Default |
|---|---|
| Decommission discount | 60% |
| Worst hull damage | 60% |
| Damage discount weight | 100% |
| Offer shelf life | 6 h |

At the defaults an undamaged hull costs **40%** of its ware price, and the worst hull on the board — 60% damaged — costs **16%**. That is the whole spread, and the damage column on screen is therefore also the price column: the Kestrel Vanguard above at 0% costs more than the Elite Vanguard at 51% despite being the same class.

Damage weight is the knob that decides whether wrecks are bargains. At 100% damage counts in full; at 0 a battered hull costs the same as a fresh one and the percentage becomes decoration.

### What never appears

Candidates are **sampled from ships actually flying in your galaxy**, not read from a list of macros. Three consequences fall out of that, all of them wanted:

- A ship from a DLC you do not own cannot be offered, because it is not out there to sample.
- Rarity is inherited from the galaxy. An Asgard is rare in the market because an Asgard is rare in space.
- A hull with no priced ware produces no offer — which quietly keeps **story and unique ships off the market** without anybody having to name them.

### Xenon trophies

The same tab carries prizes taken from the Xenon, and they deliberately break every rule above.

| | Ordinary hull | Xenon trophy |
|---|---|---|
| Condition | damaged, priced down | sold whole |
| Discount | 60% decommission | none |
| Equipment | stripped to a bare hull | **full weapons and shields** |
| Needs relation | 10 civilian / 20 military | 20 |
| How many | up to 4 S and 2 M each hour | at most one, on a chance roll |
| Chance by class | L 50%, XL 10% | S 25%, M 10%, L 2% |

A trophy is cheaper than it sounds, because a ship ware's price covers the **hull only** — so the Xenon gear on top is effectively free. That is intended: a trophy should feel like a prize somebody else won and cashed in, not a fair transaction.

## Equipment mods

![Galactic Exchange, MOD PARTS tab. Rows are grouped into Basic and common, Advanced, and Exceptional. Each row names the part, repeats its tier, says whether it is a primary or common mod, gives the quantity available such as x8 or x20, how many you already have, a price, and a Buy button. Basic and common parts run 30000 Cr for common ones such as Extended Fuel Container, Nividium Oxide and Tuning Software, and 100000 Cr for primary ones such as Basic Engine Fuel Injector and Basic Ship Nanoweave; Advanced primary parts are 500000 Cr; Exceptional primary parts are 2500000 Cr](/x4-modding-wiki/img/mods/galactic-heroes/exchange-modparts.jpg)

| Knob | Default | | Knob | Default |
|---|---|---|---|---|
| Basic and common, at least / at most | 5 / 10 | | Primary part price | 200% of the mod |
| Advanced, at least / at most | 2 / 5 | | Common part price | 60% of the mod |
| Exceptional, at least / at most | 1 / 2 | | Part shelf life | 6 h |

The catalogue is **asked for, not listed**: the mod queries the game's own ware database for everything flagged as an equipment mod and reads each one's quality tier from the ware itself. Naming the parts in script would have been dozens of chances to reference a ware from a DLC the player does not own — which in X4 is a load-time rejection that drops the whole library silently.

That tier is then **cross-checked against a second source**. The game's own `wares.xml` says mk1 ×43 at 50 000 Cr, mk2 ×26 at 250 000 Cr, mk3 ×15 at 1 250 000 Cr. If the roll produces three buckets of those sizes at those prices, quality 1/2/3 = basic/advanced/exceptional is confirmed by two sources that cannot both be wrong the same way. The prices on screen are that arithmetic: 50 000 × 200% = **100 000**, 250 000 × 200% = **500 000**, 1 250 000 × 200% = **2 500 000**.

### Who sells

Every claimspace faction **except the Xenon, the Kha'ak and the pirates** — and "pirate" is the engine's own tag rather than a list the mod keeps. Follow that honestly and it produces two results worth knowing:

- The **Hatikvah Free League do not sell**, because vanilla tags them `pirate plunder`.
- The **Riptide Rakers do**, because they are tagged `scavenger` and not pirate.

Both are the game's opinion, not the mod's, and the seller list is logged on every roll so the disagreement stays visible instead of looking like a bug.

**This rule is the mod-part market's alone.** The hulls tab gates on relation only — which is why the Hatikvah and the Duke's Buccaneers both appear in the ships screenshot above and neither of them sells you a single part.

Offers are **aggregated by ware rather than by seller** here, unlike the ships tab — a page of identical Tuning Software rows from eleven factions is a worse screen than one row with a count.

## Crew seminars

![Galactic Exchange, SEMINARS tab. Three groups: Basic, For 1-Star crew and For 2-Star crew. Basic Seminar (Piloting) x46 at 42900 Cr and Basic Seminar (Management) x52 at 46200 Cr; Seminar for 1-Star Crew (Management) x29 at 99000 Cr and (Piloting) x21 at 90000 Cr; Seminar for 2-Star Crew (Management) x10 at 196800 Cr and (Piloting) x12 at 177600 Cr. Each row shows the skill it trains, the quantity available, how many you hold, the price and a Buy button](/x4-modding-wiki/img/mods/galactic-heroes/exchange-seminars.jpg)

Six wares: **management and piloting, first three levels only.**

| Knob | Default | | Knob | Default |
|---|---|---|---|---|
| Basic, at least / at most | 5 / 10 | | Seminar price | **1000%** of shop |
| 1-star, at least / at most | 2 / 5 | | Seminar shelf life | 6 h |
| 2-star, at least / at most | 1 / 2 | | | |

That multiplier is not a typo and it is the whole model. It started at 200% — "twice the shop price" — and was raised fivefold, because at 200% seminars were simply better bought here than found, and the market replaced the gameplay it was meant to garnish.

| Seminar | Shop | Exchange |
|---|---|---|
| Basic (management) | 4 620 | 46 200 |
| Basic (piloting) | 4 290 | 42 900 |
| 1-star (management) | 9 900 | 99 000 |
| 1-star (piloting) | 9 000 | 90 000 |
| 2-star (management) | 19 680 | 196 800 |
| 2-star (piloting) | 17 760 | 177 600 |

Like the mod parts, **what counts as a seminar is asked, not listed** — the mod queries wares tagged `seminar` and takes the level from the ware's own level tags. The deprecated gift-inventory seminars are excluded without being named, because they do not carry that tag; and if a DLC ever adds a third trainable skill, it appears here with no code change.

## Turning them off

![Galactic Heroes - Exchange settings, second page. A Seminar market section with Enable the seminar market and the at-least / at-most counts for basic, 1-star and 2-star seminars, seminar price at 1,000 percent of shop and a 6 hour shelf life. A Modification-part market section with the basic, advanced and exceptional counts, a 6 hour part shelf life, primary part price 200 percent and common part price 60 percent. Below, a Debug block of dev buttons: roll seminars now, probe where a mod can be delivered, roll modifications now, roll offers now, scan what the market can see, spawn one hull at HQ, and several Exchange levers](/x4-modding-wiki/img/mods/galactic-heroes/settings-exchange-markets.jpg)

Each market has its own master switch — **Enable the surplus market**, **Enable the modification market**, **Enable the seminar market** — and each is independent of the share market and of the others. Turning one off stops its offers; it does not disable the Exchange screen or the tab.

The `[dev]` row underneath is the answer to a real problem: stock rolls once an hour and a lot lives six hours, so a short test session would see one roll and conclude the market was empty. **`[dev] roll offers now` runs the same code path the hourly timer runs** — not a shortcut around it — which is what makes a five-minute check meaningful.

## Honest list

- **Hull sampling depends on traffic.** A quiet galaxy or an early save offers fewer candidates, so an empty-looking ships tab in the first hour is normal rather than broken.
- **Delivery differs by good.** Seminars carry the inventory tag and go straight to you; assembled equipment mods do not, and the purchase reads the inventory back before charging so a silent delivery failure becomes a visible one.
- **Commission applies here too.** The 5% on the status row is charged on these tabs as well as on shares.
- **Trophy supply is not modelled.** A trophy appears on a chance roll for a faction at +20; nothing checks that the faction actually fought the Xenon for it.
- **Prices ignore your reputation past the gate.** Relation decides *whether* a faction offers you something, not what it charges. A friendlier faction shows you more, not cheaper.

---
title: Galactic Exchange
description: A share market for the 17 corporations — issued-share control basis, private and self-holding ceilings, raid and defence steps, subsidiaries, and why the takeover pass ships disarmed.
---

The **Galactic Exchange** is a secondary market in the seventeen [corporations](../corporations/). You can buy a stake in a company, watch its price move with the contracts it wins, and take a side in a slow corporate war that has no combat in it.

Corporations trade too — and for them a share purchase is not an investment. It is a move.

![Galactic Exchange, shares tab with one company selected. A status row shows the player's Portfolio value, Cash and the 5 percent Commission. Four tabs run across the screen: [ SHARES ] selected, then Ships, Mod Parts and Seminars. The table columns are CORPORATION, PRICE, CHANGE, CONTRACTS, TREASURY, YOU HOLD and VALUE, one row per company with its three-letter ticker in brackets - AMH, AMC, ASR, AXM, BLW, CIN, CVN, GRL, HAL, QTW, RAH, SBL, THL, VRD and the rest. Change shows a percentage move or a dash where the price did not move this tick. Harborlight Commerce Trust is picked out with a caret, and below the table a panel headed "What Harborlight Commerce Trust is trying to do, in the order it will act" numbers four intentions - keep a cash reserve (marked "a limit, not a goal"), have one faction fine a rival over its contracts there (with the standing it spent), hold one market and break into another (each with the standing held against the standing needed, and the credits still to finish). A trade line follows with the lot size, price, 5 percent commission, what buying costs and what selling pays, the outstanding float as a fraction of the 10000 authorized shares and the hours to the next tranche; then a share-count slider, a BUY button and a greyed-out "cannot sell"](/x4-modding-wiki/img/mods/galactic-heroes/exchange-shares.jpg)

Pick a company and the screen stops being a price list. The panel underneath is **the same intention list the planner is working from**, annotated with what the company has and what it still needs — standing held against standing required, credits still to find. You are not reading a summary of the company; you are reading its plan, before it acts on it.

`cannot sell` is greyed because you hold none. There is no short.

## What a share is worth

Price is not a random walk. A company is valued as **treasury plus capitalised contract income**:

> value ≈ treasury + (contracts × reward × *periods priced in*)

The *periods priced in* knob is the whole argument between two ways of seeing a company:

| Knob | Default | Range |
|---|---|---|
| Periods of income priced in | 40 | 0–200 |
| Trading commission | 5% | 0–10% |
| Hours between share issues | 240 h | 24–720 |

At 40, a contract paying 250 000 cr in cash is capitalised at 8 000 000 cr — a 27× divergence between what the company *earns* and what the company *is worth*. That number decides more than the share price: **every raid step is priced off the same valuation**, so capitalisation is also the cost of a takeover. Measured on build 1168, a 200-share step cost 30 421 600 cr against a raider holding 14 589 600 — and 82% of defences failed on "cannot afford".

Lower it to make the contest liquid. Raise it to make a portfolio, rather than a bank balance, decide the price.

**Commission is friction, not a fix.** At 5%, a position has to gain more than 10% before flipping it pays. The round-trip exploit was closed by making this a secondary market, not by the fee.

## Control is counted on issued shares

Each corporation has **10 000 authorized shares**, of which only part is ever issued — float plus whatever the company holds of itself. Everything that matters is measured against **issued**, not authorized.

That distinction is not pedantry. It was a bug:

> On the authorized 10 000, control was arithmetically unreachable. A raider holding **96% of every share in existence** read as **46%**.

| Knob | Default | Must stay below |
|---|---|---|
| Control threshold | 51% of issued | — |
| Private holder ceiling | 25% of issued | control threshold |
| Self-holding ceiling | 40% of issued | control threshold |
| Faction stake in its own corporations | 10% of issued | private holder ceiling |
| Shares moved per raid or defence step | 200 | — |
| Defence reserve held back | 50% | — |
| Threat alarm | 25% held by one outsider | — |

Those `must stay below` relations are the rule of the whole system, expressed as arithmetic: **only a corporation can take a corporation.** A hero, a faction or the player is capped below the control threshold by construction, so no amount of buying makes an outsider an owner.

It did not always hold. The private ceiling was once 2 500 shares on a 4 800-share register while control was 2 448 — the ceiling sat *above* control, and nothing could say so, because the two numbers were unrelated literals. They are declared constants with a stated invariant now, and the invariant is checked.

## Raids and defences

A takeover is a campaign, not an event. A corporation moves **200 shares per step**, which is deliberately small: an instant takeover cannot be answered, and a defence that cannot exist is not a mechanic.

The defender's tools:

- **Defence reserve** — half the treasury is walled off from ordinary spending once the company is under threat.
- **Buy-back** — the company buys its own shares, up to the self-holding ceiling. Hold the ceiling long enough and an issue is forced, which throws the treasury's shares back onto the market.
- **The alarm** — a company notices it is being raided when one outsider passes 25% of issued.

Conservation makes the ceilings two sides of one number: whatever the defence may not hold, a raider can reach. That was measured exactly, at every value up to 49%.

The alarm threshold turns out to matter more than the step size. An offline sweep of the whole parameter space found that with a real poison pill, alarming at 0% or 10% holds a raider off indefinitely, while alarming at 25% loses the company on tick 15. **That result is from the offline simulation and has not yet been reproduced in game.**

## The takeover pass ships disarmed

This is the most important thing on the page.

The pass that decides who controls whom **reports its verdicts and does not execute them**. Default off; a session lever arms it.

That is not timidity. Changing the control basis from authorized to issued does not gradually enable takeovers — it *reclassifies stakes that already exist in a save being played*. Measured before the catch was written, holdings of **96%, 96% and 87% of issued** were already sitting on registers. The first armed pass would have absorbed several corporations at once, irreversibly, in somebody's running game.

So the shipped behaviour is a dry run: the log tells you what would have happened, and nothing happens. If you want the live version in your own session, arm it deliberately.

## Subsidiaries

A company past the control threshold may **subordinate** rather than absorb. The parent can sweep the subsidiary's treasury — but the subsidiary keeps a floor of **40% of what it was founded with**, and the floor is a percentage precisely because a flat figure did not survive the roster (see [Corporations](../corporations/#debt-liabilities-and-liquidation)).

## The other three tabs

The Exchange screen has four tabs and only the first is a share market. The other three sell goods, share one listing skeleton, and have a page of their own: **[Ships, parts and seminars](../markets/)**.

| Tab | What it sells | Gated on |
|---|---|---|
| **Shares** | Stakes in the 17 corporations | nothing — every company is listed |
| **Ships** | Decommissioned faction hulls, and Xenon hulls taken as trophies | relation 10 civilian, 20 military, 20 trophies |
| **Mod Parts** | Equipment mods, asked from the game's own ware database | not sold by the Xenon, the Kha'ak or anyone the engine tags pirate |
| **Seminars** | Crew training in management and piloting, first three levels | nothing, but priced at ten times shop |

## Everything on this page is a slider

![Galactic Heroes - Exchange settings. A Galactic Exchange (share market) section listing every constant this page describes as its own row with a live value: market tick interval, initial float, issue per period, periods of income priced in, trading commission, hours between issues, subsidiary keeps (percent of founding capital), control threshold, private holder ceiling, self-holding ceiling, shares moved per raid or defence step, defence reserve, threat alarm, faction stake in its own corporations, the three corporation-mission standing values, deeds kept when a hero dies, and the three corporation-mission board settings. Below it a Ship and modification markets section begins with Enable the surplus market, then Who offers what (civilian and military hulls by relation), How much is offered per faction per hour (small and medium hull counts, large and very large hull chances), Condition and price (worst hull damage, decommission discount, damage discount weight, offer shelf life) and a Xenon trophies group](/x4-modding-wiki/img/mods/galactic-heroes/settings-exchange.jpg)

Every number quoted above is one of these rows, not a literal in the code. The slider and the driver read the same declared value, so a constant cannot be changed in one place and stay stale in the other — and the invariants (*private holder ceiling below control threshold*, and the rest) are checked against what the sliders currently say, not against what they said when the code was written.

## Honest list

- **Takeovers are disarmed by default.** Everything about control, absorption and subordination is computed and logged; nothing is executed until the session lever is thrown.
- **The alarm result is simulated, not observed.** The parameter sweep that says the alarm decides the contest ran offline against the mod's own constants. It is untested in game.
- **Issues are rare on purpose.** 240 game hours is ten in-game days — a test session will never see one. Use the `[dev]` float button on the Exchange screen rather than waiting.
- **Prices move on contracts, and contracts move slowly.** Long flat stretches are the normal shape, not a stalled market. A stretch of 17 flat ticks out of 188 was investigated and turned out to be prices moving right up to a bankruptcy.
- **The exchange is self-contained.** No vanilla economy is touched; nothing here feeds ware prices or station finance.

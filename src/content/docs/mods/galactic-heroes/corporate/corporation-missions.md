---
title: Corporation missions
description: Six hack jobs corporations offer the player against rivals they are already fighting. Built on vanilla control-panel missions, gated on grudge, and remembered by the company you took the job against.
---

Corporations at war with each other do not only hire pirates — they hire **you**.

A corporation mission is a paid job against a rival's managed station. It is offered only when the two companies are already fighting, so the board fills as feuds start and empties as they settle. **Both sides of a feud hire**, which means you may be offered work against a company you worked for last week — and it will remember.

![Galactic Heroes - Corporation missions. Header text reads "A corporation pays to hurt a rival it is already fighting on the exchange. Both sides of a feud hire, so you may be offered work against a company you worked for last week - and it will remember." Below: "Nothing is on offer. Corporations hire when they are already fighting one another, so this fills as feuds start - there is nothing here to fix."](/x4-modding-wiki/img/mods/galactic-heroes/corp-missions.jpg)

The empty state above is the normal early-game state, and the screen says so rather than looking broken. On a fresh save the corporations have not yet started fighting each other.

## The six jobs

Every job is a **hack of one control panel** on a rival-managed station, driven through X4's own control-panel mission machinery rather than a custom implementation. What the mod supplies is the target rule, the brief, the reward and the politics.

| Job | Panel | Reward | Needs grudge | Level |
|---|---|---|---|---|
| **Count the doors** | personnel list | 90 000 cr | 0 | 1 |
| **Open the books** | storage | 180 000 cr | 1 | 2 |
| **Undercut them** | trade | 200 000 cr | 1 | 2 |
| **Bleed the line** | production | 250 000 cr | 1 | 3 |
| **Blind the watchdogs** | security | 280 000 cr | 2 | 3 |
| **Stall the cranes** | construction | 300 000 cr | 2 | 3 |

**Grudge** is how badly the two companies are already at odds. *Count the doors* needs none — it is reconnaissance, and a company will pay for a personnel list about anyone. *Stall the cranes* and *Blind the watchdogs* need a real feud, because they are acts of sabotage that the target will notice.

The briefs are written from the client's side, which is most of the characterisation the layer needs:

| Job | What the client says |
|---|---|
| Count the doors | *Before anything else, we want to know who works there.* |
| Open the books | *We want to know what they are holding before the next tender.* |
| Undercut them | *Their traders are winning on price. Change the price.* |
| Bleed the line | *Their output pays for the campaign against us. Stop it.* |
| Blind the watchdogs | *Somebody else has work to do there afterwards. Make it quiet first.* |
| Stall the cranes | *Every week they do not expand is a week we do.* |

*Blind the watchdogs* is the one worth reading twice. Nobody says what the other work is.

## The board

| Knob | Default | Range |
|---|---|---|
| Missions on offer at once | 5 | 0–30 |
| Minutes between offers | 30 | 5–240 |
| Minutes an offer stays up | 120 | 10–1440 |

One offer appears per pass, so the interval is also how fast the board refills after you clear it. An untaken job is withdrawn after its time is up — without that, the board would quietly become a list of jobs against stations that changed hands hours ago.

Set *missions on offer* to **0** and corporations stop hiring entirely. The dev levers still work, so the feature is off rather than broken.

## Standing — being on somebody's list

Taking the job is the easy part. The consequence is that two companies now have an opinion about you.

| Knob | Default | Meaning |
|---|---|---|
| Standing gained for a mission done | +10 | with the client |
| Standing lost for a mission done against you | −15 | with the victim |
| Standing floor | −30 | below this, a corporation stops hiring you |

The loss is deliberately **larger than the gain**. Playing both sides of a feud costs you more than it pays, and a few jobs taken carelessly will close a client permanently. Set the loss to zero and nobody minds who you work for; set the floor to −100 and no company ever refuses you.

Standing is per corporation, and it is not faction reputation — hacking a station managed by Harborlight does not upset the Argon Federation, whatever Harborlight thinks of you.

## Honest list

- **The board is empty until corporations feud.** This is the design, not a bug, and the screen says so.
- **The payment path has never been observed end to end in a soak.** It is built and checked, but no long run has yet caught a completed corporation mission being paid — that needs a player to take one and finish it.
- **All six jobs are hacks.** Destroy / deliver / escort variants are designed and not built. The hack family shipped first because it is the one X4 already supports cleanly for a third party's station.
- **Targets are rival-managed stations only.** A corporation will not send you against a station nobody manages, and never against its own.

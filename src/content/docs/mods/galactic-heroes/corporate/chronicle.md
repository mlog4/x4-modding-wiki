---
title: Chronicle
description: The append-only event log every hero and every corporation carries — 36 event kinds, what gets written and what is deliberately not, the memorial cap, and why the kind table is rebuilt on every open.
---

A hero who dies leaves a record. A corporation that is liquidated leaves a record. The **chronicle** is the append-only log that makes the mod's history readable after the fact — the part that turns "45 heroes are alive" into "this one was promoted twice, lost a flagship at Matrix #451, and was killed nine game-hours later."

It is not a debug view. It is the reason a permadeath system is worth having: nothing in the mod can be undone, so everything has to be legible afterwards.

## Thirty-six kinds, three families

| Family | Kinds | Examples |
|---|---|---|
| **Corporate** (2000s) | 19 | founded, tender won / lost, contract matured, raid ordered / succeeded / failed, scandal, discredit, incident, station lost, liability settled, shares bought / sold, dividend paid, bankrupt, acquired |
| **Activity** (3000s) | 11 | kill, battle, task taken / done / abandoned, flagship lost, retreat, donation, contract taken, exchange buy |
| **Career** (5000s) | 6 | enlisted, promoted, perk unlocked, perk bought, died, succeeded |

An entry stores a timestamp and a kind, plus whatever parameters that kind needs. The text is assembled when a panel is opened, never when the event is written — which is what lets the same saved entry render in a different language after you switch the game over.

## What is deliberately not written

Twelve of the thirty-six kinds are declared and never passed. That is not an oversight list; most of them are **throughput**, and a chronicle of throughput is not a history:

> A contract award happens every planning cycle. Writing each one would bury the founding, the first raid and the liquidation under thousands of bookkeeping lines — and the company's story is the thing the log exists for.

The build reports every declared-but-unwritten kind on each deploy, so the gap is visible rather than forgotten. Some of those twelve are genuinely missing and will be wired up; the rest are a decision, recorded as one.

## The memorial cap

| Knob | Default | Range |
|---|---|---|
| Deeds kept when a hero dies | 20 | 0–200 |

A dead hero keeps this many milestones and recent deeds, so the career can be read back afterwards. The archive is append-only and never forgets a hero — which is exactly why the cap exists: without it a long game would carry every line of every career forever in its save. Set it to 0 to keep the statistics and drop the story.

## Where you read it

- **Corporation dossier** → *Chronicle* section: founding, tenders, raids, scandals, liquidation.
- **Hero detail** → the career: enlistment, promotions, perks, kills, the death.
- **KIA archive** → frozen records of everyone permanently lost.
- **Retired archive** → heroes mustered out by faction succession rather than killed.

## One implementation note worth stating

The table mapping a kind to its text is **rebuilt every time a panel opens, and never stored**.

That looks wasteful and is not. A table seeded into a cue variable is written into the savegame — so a mod update that adds a new event kind would be invisible to an existing game, which would render the new entries as blanks. Rebuilding costs one table construction on a path that only runs while somebody is looking at a panel.

An unknown kind **names itself** instead of rendering as an empty row. An empty row reads as broken data; a row that prints its own kind is a tripwire for a kind added to the code and not to the table.

## Honest list

- **12 of 36 kinds are never written today.** Some are deliberate (throughput), some are pending. The deploy report names them individually every build.
- **The chronicle is per entity, not global.** There is no galaxy-wide feed; you read a company's history in its dossier and a hero's in theirs.
- **It is localised, not logged.** Chronicle text lives on the mod's text page like every other string, so it renders in the language the game is running.

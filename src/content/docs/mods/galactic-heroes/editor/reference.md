---
title: Editor reference — every screen
description: Screen-by-screen reference for the Galactic Heroes Editor — the eight tabs, the corporation permanence rules, the 104 validation codes and their three kinds, where a finding is shown, the text page a pack carries, and the six "What was read" screens that prove the harvest worked.
---

The [walkthrough](../walkthrough/) builds one pack end to end. This page is the reference: what every screen holds, and why.

## The window

The title bar carries the open pack file and **the build stamp of the editor itself** — `Galactic Heroes Editor — ewt32.ghpack.json [build 2026-09-18 17:15]`, and `DEBUG` when it is a debug build. Which build am I looking at should be a reading, not a deduction.

The toolbar is seven buttons:

| Button | What it does |
|---|---|
| **New** / **Open…** / **Save** / **Save as…** | the `.ghpack.json` source file — your pack, not the extension |
| **Check** | run the validator and go to the Check tab |
| **Export…** | write the extension into the export folder |
| **Export into the game** | write it straight into `extensions/<packid>` — asks first, game must be closed |

The status bar is two halves. On the left, what is in this pack and what the host already has: *"1 fleet template(s), 1 hero(es) in this pack · 17 fleet(s) and 261 hero(es) already in the game, shown read only."* On the right, the harvest receipt: *"6 archetypes · 28 perks · 390 ships · 17 host fleets · 261 host heroes · 1 PROBLEM(S)."* Zeroes on the right mean the folders on the Pack tab are wrong.

## The eight tabs

| Tab | Authors | Notes |
|---|---|---|
| **Pack** | the manifest, the text page number and the three folders | [covered in the overview](../#first-run) |
| **Fleets** | fleet templates | a ladder, one tier per hero star |
| **Heroes** | hero templates | [covered in the walkthrough](../walkthrough/#3-write-the-hero) |
| **Missions** | corporation missions | see below |
| **Spend plans** | what heroes buy, in order | [covered in the walkthrough](../walkthrough/#4-spend-plans-optional) |
| **Corporations** | companies | not a catalogue entry — see below |
| **Check** | nothing — it reports | 104 rules, the full list; the same findings are shown on every other tab |
| **What was read** | nothing — it reports | six screens proving the harvest |

**Fleets**, **Heroes** and **Corporations** share a left-hand shape: a filter box, then **In this pack** above **Already in Galactic Heroes — read only**, then **Add**, **Copy into this pack** and **Remove**. Host objects are shown so you can read, filter and copy them; they can never be edited, because an edit to something the host owns would be silently discarded and the host may reshape it in any later version.

**Missions** and **Spend plans** list only what the pack itself defines, with **Add**, **Copy** and **Delete**. What the host already declares is on the *What was read* screens instead — [Spend](#spend--the-hosts-plans-in-order) for its eleven plans.

## Missions

A corporation mission is paid work a company offers you against a rival it is already fighting. The mod ships six; a pack can add more. See [Corporation missions](../../corporate/corporation-missions/) for what they are in game.

![Galactic Heroes Editor, Missions tab. A left-hand panel explains that these are missions a corporation offers the player against a rival, and that the target is chosen at runtime: a station managed by a corporation the client is already paying to hurt. Below it an empty list with Add, Copy and Delete buttons. The right pane holds Mission id "test" and empty Title, Briefing and Objective boxes. A section headed "What the player does there" says the panel list is read from the game's own schema, so it is whatever your installed version declares, and that hack_* panels break something while access_* panels only look and are worth less; under it an empty Control panel dropdown. A second section, "When it is offered, and for how much", says a grudge counts campaigns one corporation has already run against another, that zero means the mission is offered without a feud and two means it waits for a real one; under it empty Reward, Minimum grudge and Mission level boxes](/x4-modding-wiki/img/mods/galactic-heroes/editor-missions.jpg)

| Field | What it decides |
|---|---|
| **Mission id** | permanent, prefixed, unique against the host's own six |
| **Title** | what the player reads in the corporation's offer list |
| **Briefing** | the longer text |
| **Objective** | the one line the game shows while the mission is active |
| **Control panel** | what the player actually walks up to and uses |
| **Reward** | base payout in credits |
| **Minimum grudge** | how many campaigns one company must already have run against the other before this is offered. `0` means "offer it even without a feud." |
| **Mission level** | difficulty band |

The **control panel list is read out of the game's own schema** — `libraries/common.xsd` declares them as the `controlpaneltypelookup` enumeration — not typed into the editor. A patch that adds a panel gives it to the editor with no code change, and a panel that does not exist is an error rather than a mission nobody can finish.

One note rather than an error is worth knowing about: `access_*` panels only *look* at something, `hack_*` panels *break* it. An access panel with a sabotage-sized reward is a balance choice, not a defect, so the editor says it out loud and lets you keep it. For scale, the core reconnaissance mission pays 90,000.

## Corporations are not like the rest

![Galactic Heroes Editor, Corporations tab. The left panel explains that companies this pack founds are listed beside the host's, so you can see which faction and which niche are already taken. "In this pack" holds ewt32_corp_001 with no name; "Already in Galactic Heroes - read only" lists the seventeen host companies by id and name - cinderhaul Cinderhaul Reclamation, greenlane Greenlane Holdings, blackgate Blackgate Freeport Capital, quietwater Quietwater Intelligence, amaranth Amaranth Health Trust, halcyon Halcyon Arms Concord, rahar Rahar Ascendant Capital, bellwright Bellwright Capital, ascension Ascension Reach Trust, axiom Axiom Claytronics, harborlight Harborlight Commerce Trust, deeptide Deeptide Stewardship Fund, covenant Covenant Trust, sable Sable Ledger Assurance, amitra Amitra Concord Capital, throughline Throughline Capital and verdant Verdant Accord Trust. The right pane holds Id, an empty Name, an empty Origin faction with a note that it is not decoration because favour accrual, relation gates and market access all key off it, and Bucket A. A "How it behaves" section holds Founding capital 100000000, Aggression 100 and Defence reserve -1, each with a sentence explaining it. A "Who they are" section holds Field, Dirty side and Backstory. At the bottom, "What this company will be" reads: this company joins a market of 17; at 100M it is an even match for the companies already there, neither predator nor prey; it goes after rivals as readily as anybody else on the board; it has no origin faction yet, and the host refuses a corporation without one](/x4-modding-wiki/img/mods/galactic-heroes/editor-corporations.jpg)

Everything else the editor writes is a **catalogue entry**. The mod wipes its fleet and hero tables on every load and each extension registers into the empty table, so exporting again simply replaces what was there.

A corporation is not that. It owns money, contracts, favours, liabilities, a chronicle and a share register, and **all of it lives in the player's save.** So the host's registration is *ensure-exists*, and the split matters:

| Field | On a save that already has the company |
|---|---|
| name, bucket, lore, aggression, defence reserve | re-read on every load, so an edit **does** take effect |
| **founding capital** | read **once**, at founding — an edit never tops it up |

**There is no way to remove one, either.** Uninstalling a pack leaves its corporations in the save, inert but intact, because every contract, grudge, share register and chronicle entry that ever named them would otherwise dangle. The Remove button says so before it does anything.

That permanence is why an id collision is an **error** here rather than a warning. A colliding fleet id produces a refused registration and a missing fleet, which is annoying. A colliding corporation id produces two packs both believing they own a company that holds money and shares in a live save, and that cannot be repaired afterwards.

### The three behaviour knobs

Each defaults to what every corporation in the mod does today, so a company written without touching them behaves exactly like one written before the fields existed.

- **Founding capital** — the host's own companies start with 100,000,000. This is the number that decides a takeover: a raider roughly **1.6× richer** than its target reaches control, so this field is what says whether a company is predator or prey.
- **Aggression** (percent, 100 = ordinary) — scales the two budgets that gate whether the company commissions raids and assaults against rivals. `0` is a company that trades, bids and defends but never moves against anybody. It changes nothing else.
- **Defence reserve %** (`-1` = follow the mod's global) — the share of its own money it refuses to spend buying back shares when somebody is taking it over.

The **What this company will be** line at the bottom says what the three add up to in sentences, because three integers do not tell an author that they have just founded somebody's lunch.

**Origin faction is not decoration.** Favour accrual, relation gates and market access all key off it, and the host refuses a corporation without one.

## What it refuses

104 rules: **68 errors, 28 warnings, 8 notes.** Errors block export; warnings and notes do not. Every issue says what to do about it, and double-clicking a row on the Check tab jumps to the field it is about.

### Where it says it

The check runs by itself about a third of a second after any edit, and every finding carries an address — the object, the nested object (a tier, a perk row, a plan step) and the field. That address is used in four places at once:

| Where | What you see |
|---|---|
| the tab header | `Heroes ✖ 2` or `Fleets ⚠ 1` — the worst kind and the count, so a problem two tabs away is visible |
| the object's row in the list | the same mark; a perk row, a plan step or a tier is tinted, with the findings as its tool tip |
| above the form | one line per error or warning, message and fix together, five at a time and then a scroll bar; notes are counted underneath and listed on the Check tab |
| the field itself | a red or amber outline on the box that sets it, with the message and the fix as its tool tip |

Fix the field and every mark goes. The Check tab remains the full list, notes included, and its double-click lands on the tab, selects the object and the row, and focuses the field.

One finding is not a rule about the pack but about the screen: **text typed into a number box** (`GH140`). WPF keeps the previous number and says nothing; the editor shows the box outlined, names the value the field still holds, and refuses to export until the box holds a number again.

The rules fall into three kinds, and keeping them apart is the point:

**1. What the host also enforces** — no id, no tiers, a tier with no flagship, no archetype, no faction, a duplicate id. Checking here is not redundant: the host can only refuse, hours later, into a log file the author may never open.

**2. What the host *cannot* enforce.** Namespacing above all. Once a save has seen an id it is permanent, and a collision between two guest packs cannot be repaired. The host cannot tell an unprefixed guest id from a core one — the editor knows which pack it is writing.

**3. What makes a template good rather than valid** — a perk the archetype cannot use, a fleet hung on a station-bound hero that will never upgrade it, a founder name that repeats its own rank. None of these break anything, and **all three are defects the core roster itself contains.**

| Codes | About |
|---|---|
| `GH001`–`GH009` | the pack itself: id, prefix length, display name, registering nothing, version, the text page |
| `GH010`–`GH023` | fleet templates: tiers, flagships, escort counts, ship sources |
| `GH030`–`GH057` | heroes: ids, group, rank, faction, archetype, fleet, biography, the spend plan it names |
| `GH060`–`GH069` | perks on a hero: unknown, duplicated, unreachable, wrong archetype |
| `GH080`–`GH096` | corporations: collisions, origin faction, capital, aggression, reserve |
| `GH100`–`GH111` | corporation missions: ids, title, objective, panel, reward, grudge |
| `GH120`–`GH131` | spend plans: ids, label, steps, a perk step naming nothing or a perk twice, a shares target |
| `GH140` | text typed into a number box |
| `GH150` | a brace in a name or a story — X4 reads `{…}` on a text page as a reference to another entry |

The generator also handles what an author cannot see coming: an apostrophe in a biography would end an MD string literal, a `"` would end the XML attribute, and `--` is illegal inside an XML comment. All three are neutralised at the one place they are written.

### What the rules say about the host

Pointing the editor's rules at the mod that taught it those rules costs nothing, and the self-test writes the result to `host-audit.txt`. **Zero errors**, and four kinds of warning:

| | |
|---|---|
| `GH047` ×200 | a founder name that repeats its own rank — the game prints "Commodore Commodore Falo" |
| `GH063` ×16 | a perk whose `applies_to` does not include the hero's archetype, so nothing reads its effects |
| `GH042` ×14 | a coordinator carrying a `$fleet_template_id`, which `fleet_upgrades=false` means is never used |
| `GH021` ×9 | a tier with an escort ship chosen and a count of zero |

The audit also found one thing in the *editor* rather than the mod: `GH017` fired five times on the Xenon fleets, which declare `XL_I` and `XL_K` for the I and the K. Those are the host's own class labels, not typos, and the rule now compares only the size.

## What was read

Six screens, and the reason they exist is that **an empty list somewhere else in the editor is always a harvest failure, never an empty world.** If a dropdown has nothing in it, the answer is here.

### Reading — did it read, from where, and how much

![Galactic Heroes Editor, What was read, Reading screen. A "Problems while reading" box holds one red line: "ignored extensions_disabled_backup_20260820: it holds extensions in a folder the game does not load from, so nothing in it is really installed". Below, "Where the game loads data from" lists the sources in load order with their entry counts - base 461598 packed and 383 loose, ego_dlc_boron 9039 packed, ego_dlc_mini_01 591, ego_dlc_mini_02 1418, ego_dlc_pirate 7206, ego_dlc_split 11290, ego_dlc_terran 15111, ego_dlc_timelines 7021 - each with 2 or 4 loose files. A Counts block follows, opening with "text read from the mod 1438 string(s) (0001.xml, 0001-l007.xml; the first is the one shown)", then archetypes 6 with admin retired, perks 28, task kinds 26, decision kinds 19, decision sets 6, host fleet templates 17, host hero templates 261 in 53 groups, factions in the game 32 of which 0 from mods, 19 claim space and 6 tagged pirate, factions used by the host 22, ranks used by the host 133, ship macros 390 broken down by source, and the default decision set for each archetype](/x4-modding-wiki/img/mods/galactic-heroes/editor-read-reading.jpg)

Three blocks:

- **Problems while reading** — anything skipped and why. The line in the shot is a good example of the class: a folder named `extensions_disabled_backup_20260820` holds extensions the game does not load from, so reading it would have offered ships that are not really installed.
- **Where the game loads data from** — every archive and folder X4 will read, in load order, with its entry count.
- **Counts** — the harvest in one block. This is the fastest way to answer "did it see my mod?"

### Game — what the installed game provides

![Galactic Heroes Editor, What was read, Game screen. A note says a faction listed here is one a hero can belong to, read from libraries/factions.xml in every source, and that "claims space" is the game's own tag for a faction that owns territory - without it the mod cannot resolve a home sector and the hero never spawns. A table with columns id, from, claims space, pirate and tags lists alliance from base with no claim space, antigone, argon, boron from ego_dlc_boron, buccaneers which is both claimspace and pirate, civilian which is hidden, court from ego_dlc_split, criminal hidden, fallensplit which is pirate but claims no space, freesplit, and hatikvah which is claimspace and pirate](/x4-modding-wiki/img/mods/galactic-heroes/editor-read-game.jpg)

Every faction the game has, with its source and its tags. **`claims space` is the one to read**: it is the game's own tag for a faction that owns territory. Without it the mod cannot resolve a home sector, and a hero of that faction never spawns. The `from` column tells you whether a faction came from the base game, a DLC or a mod.

### Heroes — what the host declares

![Galactic Heroes Editor, What was read, Heroes screen. An Archetypes table with columns id, label, commands, fleet upgrades, station bound, Kha'ak only and subordinate cap lists six rows: admiral labelled Admiral commands fleet with fleet upgrades on, cap 0; engineer labelled Engineer the same; raider labelled Raider the same; seeder labelled Seeder commands summon_pool with fleet upgrades on and Kha'ak only ticked, cap 0; coordinator labelled Coordinator commands fleet_leaders with fleet upgrades off, station bound ticked and a subordinate cap of 5; hive_lord labelled Hive Lord commands subordinates with fleet upgrades off, station bound and Kha'ak only ticked, and a cap of 8. A Perks table below gives each perk its name and what it does: Veteran, common, +200 XP at spawn - promoted to second star immediately; Logistic, +50% Recovery Points accrual rate; Attentive, +50% XP gain from combat; Quick Learner, rare, -25% XP needed to reach next star; Lucky, rare, -10% chance of KIA in death roll; Volunteer, spawn weight ten times more likely to be picked when a slot opens; Second in Line and Third in Line, which cannot spawn until the faction already has one or two active heroes; Khaak Seed, which adds RP to a shared grief pool on each three-minute cycle; Squad Commander, +2 S-class fighters in escort from first star; Master Technician, rare, engineer station buff potency relative +20%; and Quartermaster, -25% RP cost when rebuilding escorts](/x4-modding-wiki/img/mods/galactic-heroes/editor-read-heroes.jpg)

The archetype table is the most useful thing on this screen, because **it is where the differences between the six live**:

| Column | Why it matters to a pack |
|---|---|
| **commands** | `fleet`, `summon_pool`, `fleet_leaders`, `subordinates` — what the hero actually directs |
| **fleet upgrades** | off for coordinators and hive lords. Giving one a fleet template is a warning: nothing will ever build it. |
| **station bound** | the hero does not fly. It also means the hero cannot be hired. |
| **Kha'ak only** | seeder and hive lord |
| **subordinate cap** | coordinator 5, hive lord 8; zero for the rest |

:::note[Where the words come from]
Galactic Heroes keeps all of its text on a translatable page rather than inline, so a perk name is stored as `readtext.{65644}.{6567}` and a rank as `readtext.{65644}.{6935}`. The editor reads the mod's own text file and resolves them, which is why this screen says "Veteran" and not a number.

It reads the **default** page — the one X4 falls back to for every language that has no page of its own, and which is therefore always complete. Translations beside it are found and listed on the *Reading* screen, but not used for display. A reference the page does not hold is **left visible** rather than blanked: an id that resolves to nothing is a defect in the mod, and showing it is how anybody finds out.

An older host with no `t` folder still carries its text inline, and everything simply displays as it always did.

The editor also **writes** a page. Every string a player reads in your pack — founder name, a rank the host does not have, biography, a company's name, field, dirty side and backstory, mission title, briefing and objective — goes to `t/0001.xml` on the pack's own page, and the script refers to it exactly the way the host does. A rank the host already has is written as the host's reference, so it stays translated wherever the host is. The page number is picked free of every page the installed game, DLC and mods declare (the harvester reads one language of every source's `t` folder for its page ids) and shown on the Pack tab; the ids on the page are assigned at the first export, saved into the pack file, and never move — a translation lines up by them.

:::

### Decisions — the two halves, compared

![Galactic Heroes Editor, What was read, Decisions screen. A note explains that two lists describe decisions - the catalogue says what a decision can BE, the sets say what a template offers - and that they live in different files and neither knows about the other, so they are compared here. "Decision kinds the host declares" lists each kind with its label and the archetypes that may take it: idle, replenish and retreat name all six - admiral, engineer, raider, seeder, coordinator, hive_lord - while guard names admiral, engineer, raider and coordinator, guard_hive names seeder and hive_lord, hunting names admiral and raider, urgent_defense names admiral and coordinator, station_strike names admiral and raider, fishing and recon name admiral, raider and coordinator, and raid and lurk name the raider alone. A declared-by column reads core throughout. A line notes that 5 declared kinds are offered by no set - fishing, hunting, player_contract, recon, station_strike - because the decision worker reaches for some of these on its own, so it is a note and not a fault. "Task kinds the host declares" lists fishing, recon and satellite worked by admiral, coordinator and raider, then station, expansion, hunting, urgent_defense, fleet_defense, gate_defense, call_for_help, hive_development and swarm_summon all listed against the admiral alone, with a declared-by column reading core. A Decision sets block spells out the six sets - adm, rdr, eng, coord, hive and seeder - with their decisions and priorities](/x4-modding-wiki/img/mods/galactic-heroes/editor-read-decisions.jpg)

Two lists describe decisions, they live in different files, and **neither one knows about the other** — so the editor compares them here.

- **Decision kinds** — the catalogue: what a decision can *be*, and which archetypes may take it. A kind is a name and its holders, never behaviour; the behaviour lives in the mod's decision worker.
- **Task kinds** — what a faction's board can ask for, and which archetype works it. A decision is what a hero *chooses*; a task is what the board *offers*. An archetype is composed from both.
- **Decision sets** — what a template *offers*, with priorities. These are the six the host keeps private, and the ones your exported pack carries as literals.

Two columns repay attention. **`declared by`** reads `core`, or `core-no-page` for a task type that exists on the board and has no drill-down page in the mod's [Order Board](../../mechanics/order-board/). And the line under the first table — *"5 declared kind(s) are set by no set"* — is a **note, not a fault**: the decision worker reaches for some kinds on its own without any set offering them.

:::caution[The task table says `admiral` more often than it should]
Read the second table as *which board section a task is filed under*, not as *which archetype owns it*. The board prints three section headings while five archetypes produce work, so the catalogue files the leftovers under `admiral` — which is why `swarm_summon`, `hive_development`, `gate_defense`, `fleet_defense`, `call_for_help` and `expansion` all appear against the admiral here. **They are Kha'ak work.** The hive lord claims the first four and the seeder the last two, and the authority for that is the claim gate in the mod's decision script, not this column.

The editor shows the catalogue faithfully; the catalogue is what is wrong. If you are composing an archetype from this screen, check [the Order Board page](../../mechanics/order-board/) for who actually claims a task type.
:::

### Spend — the host's plans, in order

![Galactic Heroes Editor, What was read, Spend screen. A note says a plan is an ORDERED build order, not a set of priorities: step 1 is bought before step 2 whatever the perk's tier says, and the screen is read-only so a pack author can point a hero at one. "Plans the host registers" reads 11 plans, 98 steps in total of which 21 buy shares, and 6 of 6 archetypes name a default. A table lists line "Career Officer" with 11 steps, 8 perks and 3 shares, then survivor, hunter, squad, logistician, scholar, capital, legend, technician, staff and swarm, each opening with veteran. "The selected plan, step by step" lists eleven rows for the Career Officer plan: veteran, logistic, 10,000,000 cr of shares most_expensive, quartermaster, squad_commander, 40,000,000 cr of shares, quick_learner, lucky, 120,000,000 cr of shares, legendary_veteran and tactical_genius. A closing block says a hero resolves its plan the way it resolves its fleet - the template's own spend_plan_id first, the archetype default second, nothing third - and that 66 templates name this plan directly, it being also the default for admiral and raider](/x4-modding-wiki/img/mods/galactic-heroes/editor-read-spend.jpg)

Read-only, and here so a pack author can point a hero at an existing plan instead of writing one.

The closing block is the part worth reading: a hero resolves its plan **the way it resolves its fleet** — the template's own `spend_plan_id` first, the archetype's default second, nothing third. A hero that resolves to nothing keeps the tier ladder, so **a plan is an override, never a requirement.**

### Live — what the running game is actually deciding

![Galactic Heroes Editor, What was read, Live screen. A note explains that this shows what the running game is deciding right now, read from its own dump, while the other screens show what a decision CAN be - and that either can look healthy while the other is wrong. "The snapshot" says the log has no finished MLOG_DECISIONS dump, and to ask the game for one through the dev bridge signal cue mlog_heroes_decisions and then reopen the screen; it names the debug.log path it is reading. A "Re-read the log" button sits below. Headings for "Kinds the game holds that the catalogue does not declare" and "Decisions held" follow, with an empty table having columns faction, hero, archetype, slot, kind, target and sector](/x4-modding-wiki/img/mods/galactic-heroes/editor-read-live.jpg)

The other five screens show what a decision **can** be. This one shows what **is** being decided, read out of the running game's own dump in `debug.log`. Either can look healthy while the other is wrong, which is the whole reason it is a separate screen.

It needs the game to have written a dump — asked for through the mod's dev bridge — and the screen says so when there is none, along with the exact log path it is reading. **Kinds the game holds that the catalogue does not declare** is the row that catches a decision the mod produces and never documented.

## Two test lanes

Both must pass before a build is worth shipping, and `tools/build.ps1` runs both **from the Release binary**:

```
GalacticHeroesEditor.exe --selftest <dir>   # headless: harvest, validate, generate, read back; every rule made to fire
GalacticHeroesEditor.exe --uitest <file>    # opens the real window: 8 tabs, 34 behaviour checks
```

The self-test walks the validator's own table of codes and refuses to finish green while a code exists that no case has ever made fire. Measured before that check was written: 86 codes, 23 ever exercised. It also feeds the editor pack files it did not write — nulls, unknown fields, not JSON at all — and the generated text page back through the editor's own reader.

`--uitest` exists because **a XAML binding is not checked at compile time.** A misspelled binding path builds cleanly and shows an empty combo box to someone with no way to know four hundred ships were meant to be in it. WPF reports every one of those, but only to a trace listener nobody attaches. This one attaches, and fails the run. It caught a real crash — `RowHeight="Auto"`, where `RowHeight` is a `double` — on its first run.

It has since earned its keep twice more. A reported bug — a group name typed into a hero, gone the moment you left the tab — was **reproduced** in it before anything was changed, one step per dispatcher tick, so the step that destroyed the value named itself: not typing, not the list rebuild, not saving. Leaving the tab and coming back.

The cause is a trap in WPF rather than in this program, and it is worth knowing if you write WPF: the group box is an editable `ComboBox` whose `Text` is bound **TwoWay**, and whose `ItemsSource` is a list of suggestions. Clearing that list makes the box reset its `Text` — and a TwoWay `Text` writes the empty string straight back over the model. Two rules came out of it: a suggestion list feeding an editable control is **append-only**, and nothing may be selected while the whole vocabulary is replaced.

A second WPF trap, found on 2026-09-21 and worth knowing for the same reason: **the UI lane could not fail the build.** It ended with `Application.Shutdown(1)`, and a WPF app's generated `Main` is `void` — it discards what `Run()` returns — so the process exited 0 whatever the lane found, and the build script read every UI failure as a pass. It exits through `Environment.Exit` now, the script also reads the verdict the lane prints, and `--uitest-fail` provokes a red on demand to prove the path carries one. Nothing green before that date was evidence about the UI lane.

## Related

- [Editor overview](../) · [Walkthrough](../walkthrough/)
- [Order Board](../../mechanics/order-board/) — where task kinds end up
- [Corporations](../../corporate/corporations/) · [Corporation missions](../../corporate/corporation-missions/)

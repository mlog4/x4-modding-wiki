---
title: Walkthrough — your first pack
description: Build a Galactic Heroes extension from an empty window to a hero flying in game — pack id, a fleet copied from the host and retuned, a hero with perks and a spend plan, the check, and the two ways to export. Roughly fifteen minutes.
---

This walks the whole path once: empty window → a Terran admiral of your own, flying a fleet you tuned, in a running game. Nothing here needs Mission Director.

Budget about fifteen minutes. Every step names the screen it happens on.

## 1. Name the pack

**Pack** tab, *The extension*.

| Field | What to put |
|---|---|
| **Pack id** | lower-case letters, digits and underscores. This becomes the folder name inside the game, the name of the generated script, and **the prefix every id in the pack must carry**. |
| **Display name** | what the player sees in the extensions menu. |
| **Author**, **Version**, **Description** | the manifest. Version is a plain integer and must go up for the game to see an update. |

The pack id is the one decision you cannot take back. **Once a save has seen an id, it is permanent**, and two packs that pick the same one collide in a way nobody can repair afterwards. Your own name plus the pack is the usual answer — `mlog4_frontier`, not `heroes`. The checker warns on anything short.

Save the file now: **Save as…** writes a `.ghpack.json`. That file is your source; the exported extension is the build output, and you can throw it away and re-export at any time.

## 2. Borrow a fleet, then change it

**Fleets** tab.

![Galactic Heroes Editor, Fleets tab. A left-hand list is in two groups: "In this pack" holding ewt32_admiral_terran_basic with 5 tiers, and "Already in Galactic Heroes - read only" holding seventeen host templates from admiral_argon_basic to seeder_khaak_basic, each with 5 tiers. Buttons underneath read Add, "Copy into this pack" and Remove. The right-hand pane explains that a fleet template is a ladder, one entry per hero star, and shows the fleet id followed by tier cards. Tier 1: class L, flagship ship_ter_l_destroyer_01_a_macro, 4 S escorts of ship_ter_s_fighter_01_a_macro, 0 M, 0 L, no auxiliary. Tier 2 adds 8 S and 4 M corvettes. Tier 3 moves to class XL with ship_ter_xl_carrier_01_a_macro, 16 S, 4 M, 1 L and an ship_ter_xl_resupplier_01_a_macro auxiliary. Tier 4 shows 32 S, 8 M, 2 L](/x4-modding-wiki/img/mods/galactic-heroes/editor-fleets.jpg)

The list is always two groups: **In this pack**, which you can edit, and **Already in Galactic Heroes — read only**, which you cannot. The host's own templates are shown beside yours deliberately. You cannot edit them — a change to a borrowed object would be silently thrown away, and the mod that owns it may reshape it in any later version — but you can read them, filter them, and copy them.

Select `admiral_terran_basic` in the read-only group and press **Copy into this pack**. You get an editable template under an id of your own, with your prefix applied and a collision counted past.

:::note[This is the recommended way to start]
Copying is not a shortcut around learning the format — it is how you see a *working* ladder before you build one. The self-test copies **all 278** host templates and checks that every single copy validates with zero errors; a feature that produced broken copies would be worse than not having one.
:::

### What a tier is

A fleet template is a **ladder: one entry per hero star.** A hero promoted to ★N is given the ships in tier N. The ladder may be any length — the mod stops climbing when it runs out of tiers — but **every tier needs a flagship**, which is the one thing the host refuses a template for.

Each tier holds:

- **class** — the flagship's size label (the host uses five values, and `M` is the commonest of all)
- **flagship** — the macro the hero personally flies
- **S / M / L** — a count and a macro for each escort size
- **auxiliary** — one support ship, typically a resupplier from ★3 upward

Change what you like. A count of zero means "none"; an escort macro with a count of zero is flagged, because it is almost always a half-finished edit.

Every ship in the dropdowns came from your own install, so a ship a mod added is in the list like any other — and the exported manifest will declare that mod as an optional dependency automatically.

## 3. Write the hero

**Heroes** tab. Press **Add**, or copy a host hero the same way you copied the fleet.

![Galactic Heroes Editor, Heroes tab. A long left-hand list shows "In this pack" with one entry, ewt32_ant_admiral_003 "Admiral Drake Test", above "Already in Galactic Heroes - read only" listing host heroes by id. The right pane holds the hero form: Template id, Group (sublist) argon_admirals, Founder name "Drake Test", Rank Admiral with a note that the game prints the rank in front of the name so it should not be repeated, Faction argon, Archetype admiral described as commanding a fleet and taking fleet upgrades, Fleet template ewt32_admiral_terran_basic with a summary line reading "5 tier(s), topping out at XL flagship + 48S + 16M + 4L + aux - from this pack" and a "Show it" button, an empty Spend plan with a line saying it is inherited from the admiral archetype - Career Officer, 11 steps, 8 perk and 3 shares, opens with veteran - a Decision set "adm" with its decisions and priorities spelled out, a Spawns checkbox reading "this hero may appear in the game", and a Biography. Below is a Perks grid with columns Perk, Active at spawn, Unlock by and Target, holding capital_commander, tactical_genius unlocked by 4 stars, master_quartermaster unlocked by 6 kills, squad_expert and logistic](/x4-modding-wiki/img/mods/galactic-heroes/editor-heroes.jpg)

Field by field:

| Field | What it decides |
|---|---|
| **Template id** | permanent, must carry your pack prefix. |
| **Group (sublist)** | which roster bucket the hero belongs to — `argon_admirals` and so on. Joining a host group is perfectly ordinary. |
| **Founder name** | the name of the first hero off this template. Successors get their own. |
| **Rank** | **the game prints the rank in front of the name**, so do not put it in the name as well. The single commonest defect in the core roster is exactly that — 200 founders whose names repeat their own rank, so the game prints "Commodore Commodore Falo". |
| **Faction** | any faction the game has. A faction with no `claimspace` tag has no territory, so the mod cannot resolve a home sector and the hero never spawns. |
| **Archetype** | one of six. It decides everything else — what the hero commands, whether it upgrades its fleet, whether it is station-bound. |
| **Fleet template** | yours or the host's. The line underneath says what it actually is, and **Show it** jumps to that fleet. |
| **Spend plan** | optional. Leave it empty and the hero inherits its archetype's default, named in the line below. |
| **Decision set** | which behaviours the hero offers, with priorities. Spelled out under the box, because the host keeps these private and the pack carries a copy. |
| **Spawns** | uncheck to keep a template in the pack without it appearing in game. |
| **Biography** | free text. An apostrophe would end an MD string literal and a quote would end an XML attribute — both are neutralised on export, so write normally. |

### Perks

The grid below takes one row per perk, with three columns that matter:

- **Active at spawn** — the hero starts with it.
- **Unlock by** — `stars`, `kills` or `age`, if the perk should turn on later.
- **Target** — the number to reach. Stars and kills take a whole number; **age takes a duration such as `24h`**, because a bare number is a different type in the scripting language and the comparison never becomes true.

A perk that is neither active at spawn nor given an unlock **can never turn on**, and the checker says so. A perk that is *both* is flagged too — the unlock is dead weight.

A perk whose `applies_to` list does not include this hero's archetype is a **warning, not an error**: nothing breaks, nothing reads its effects either. The core roster contains 16 of them.

## 4. Spend plans (optional)

**Spend plans** tab. A plan is what a hero buys with its money, **in order**.

![Galactic Heroes Editor, Spend plans tab. A left panel lists "Plan 1 (ewt32_plan_1)" with Add, Copy and Delete buttons. The right pane holds Plan id ewt32_plan_1 and Label "Plan 1", then a table headed "Steps, in the order they are bought" with columns kind, perk, shares target (cr), pick and buys. Two perk rows are present: veteran and capital_expert, each with a 10000000 shares target and "most_expensive" as the pick. Buttons read Add perk step, Add shares step, Move up, Move down and Remove. A "What this plan does" summary reads "2 step(s): 2 perk, 0 shares. No hero in this pack names it yet, so nothing runs it." followed by a warning that 1 perk step names no perk](/x4-modding-wiki/img/mods/galactic-heroes/editor-spend-plans.jpg)

Order is the whole meaning. **Step 1 is bought before step 2 whatever the perk tiers say**, and a hero that cannot afford a step **waits** for it rather than skipping to a cheaper one — so moving a row changes what heroes save for. Two kinds of step:

- **perk** — buy a named perk.
- **shares** — buy shares until the holding reaches a credit target, with a pick rule such as `most_expensive`.

A step that cannot run is skipped rather than blocking the ones below it: a perk the hero's archetype cannot take is skipped permanently, a share step with no seller on the market is skipped until there is one.

The **What this plan does** line underneath is the part worth reading. Above it says, correctly, that no hero in this pack names the plan yet — so nothing runs it.

## 5. Check

**Check** tab, or the **Check** button in the toolbar.

![Galactic Heroes Editor, Check tab. A "Check now" button sits beside the summary "0 error(s), 3 warning(s), 20 note(s). Warnings do not block export." A hint reads "Double-click a line to go to the template it is about." The grid has columns for severity, Code, Where, What is wrong and What to do. A WARNING GH004 says the short pack id ewt32 makes a short prefix and a short prefix collides, and to prefer something nobody else will pick. Two WARNING GH069 rows say the perks tactical_genius and master_quartermaster are active at spawn and also have an unlock condition, so the unlock is dead weight. Twenty INFO GH023 rows follow, each naming a ship macro in the fleet that comes from ego_dlc_terran or ego_dlc_timelines, and explaining that the exported manifest declares that source as an OPTIONAL dependency so the pack still loads without it and simply cannot build that ship](/x4-modding-wiki/img/mods/galactic-heroes/editor-check.jpg)

86 rules, in three severities:

| | |
|---|---|
| **54 errors** | block export. Every one is something the host would refuse at load, or something a save could not recover from. |
| **25 warnings** | do not block. The pack will load; the warning says what it will look like in game. |
| **7 notes** | information the author could not otherwise have. Most of them are the DLC dependency lines above. |

Every row says **what to do about it**, and **double-clicking a row jumps to the template it is about**. The shot above is a healthy pack: a short-prefix warning, two perks that are active at spawn *and* carry a pointless unlock, and twenty notes telling you which DLC each Terran ship came from.

The [reference](./reference/#what-it-refuses) explains the three kinds of rule and why checking things the host already checks is not redundant.

## 6. Export

Two buttons, and the difference matters.

**Export…** writes the pack into your export folder — `<export folder>/<packid>/` with `content.xml`, `md/<packid>.xml` and `README.txt`. Copy that folder into `X4 Foundations/extensions/` yourself. This is what you upload.

**Export into the game** writes the same three files straight into `extensions/<packid>` in your install. It asks first, it names the exact folder, and it overwrites what is there. **The game must be closed.**

Either way the check runs first. If the pack has errors, nothing is written and you land on the Check tab with the count.

## 7. Confirm it loaded

Start the game and search `debug.log` for your pack's build banner:

```
EWT32 BUILD ewt32_v1
```

The banner is written as a **literal**, not assembled at runtime, so finding it proves the file on disk is the one the game is running — not a stale copy in another extensions folder. The same trick is why the host announces `MLOG_HEROES BUILD <label>` on every load.

After that, your hero is in the pool like any other: it spawns when its faction has a slot, climbs the ladder you wrote, and dies by the same [d100 roll](../mechanics/death-cycle/) as everybody else.

## Where things go wrong

| Symptom | Cause |
|---|---|
| A dropdown is empty | the harvest failed. *What was read → Reading* names the source and the reason. |
| The hero never appears | its faction has no `claimspace` tag, so there is no home sector to spawn into — or **Spawns** is unchecked. |
| The fleet never grows | the archetype has `fleet upgrades` off. Coordinators and hive lords do; they command differently. See the [archetype pages](../archetypes/coordinator/). |
| The banner is not in the log | the game is loading a different copy of the pack, or the extension is disabled in the extensions menu. |
| An edit to a corporation did nothing | founding capital is read **once**, at founding. [The rest of that story](./reference/#corporations-are-not-like-the-rest) is on the reference page. |

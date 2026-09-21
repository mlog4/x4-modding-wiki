---
title: The Galactic Heroes Editor
description: A Windows desktop app that builds extensions to Galactic Heroes without writing Mission Director script — fleets, heroes, spend plans, corporations and corporation missions, validated by 104 rules before anything reaches a save, every finding shown on the page it is about. What it is, why nothing about the mod is hardcoded in it, and how to get it running.
---

Galactic Heroes ships **261 hero templates in 22 factions**. Sooner or later somebody wants the 262nd — their own admiral, their own fleet, a company of their own invention — and the honest answer used to be "learn Mission Director, then edit the mod."

Editing the mod is the worst possible answer. It breaks on the next release, it cannot be shared, and two people who both do it cannot both be installed.

The **Galactic Heroes Editor** is the other answer. It is a small Windows desktop app that writes a **separate X4 extension** which registers into the host mod through a published seam. You never open the host. You never write a line of MD. And the editor refuses to export a pack that the host would reject — or that a save could not recover from.

![Galactic Heroes Editor, Pack tab. The window title reads "Galactic Heroes Editor - ewt32.ghpack.json [build 2026-09-18 17:15]". A toolbar carries New, Open, Save, Save as, Check, Export and "Export into the game". Eight tabs run below it: Pack, Fleets, Heroes, Missions, Spend plans, Corporations, Check and "What was read". The Pack tab holds two sections: "The extension" with Pack id ewt32, Display name test221, Author mlog4, Version 1 and a Description box reading "rwar"; and "Where things are" with the X4 game folder, the Galactic Heroes md folder and an export folder, each with a Browse button, and a "Reload from these folders" button. The status bar reads "1 fleet template(s), 1 hero(es) in this pack - 17 fleet(s) and 261 hero(es) already in the game, shown read only" on the left and "6 archetypes - 28 perks - 390 ships - 17 host fleets - 261 host heroes - 1 PROBLEM(S)" on the right](/x4-modding-wiki/img/mods/galactic-heroes/editor-pack.jpg)

## The three layers

The editor is the top of a stack, and it only works because the two layers under it exist.

| Layer | What it is | Where it lives |
|---|---|---|
| **1. Registration windows** | The host opens a short window on every game load and signals "anyone want to register a fleet template?" Seven such windows exist: fleets, roster, spend plans, corporations, missions, the decision catalogue and factions. | inside `mlog_heroes` |
| **2. Guest packs** | A separate extension that subscribes to those signals and calls the host's registrar. No `<diff>`, no file edit, no load-order requirement. Proved end to end by `mlog_heroes_example_pack`. | your own extension |
| **3. This editor** | Writes layer 2 for you, and checks it first. | a desktop app |

The seam matters more than the tool. A pack built this way **survives a host update**, because it never touched the host. Two packs from two authors can both be installed, because neither one owns the table they write into.

## Nothing about the mod is hardcoded in it

This is the design decision the whole program rests on, and it is worth stating plainly because it is unusual: **the editor contains no list of archetypes, no list of perks, no list of ships and no list of factions.**

Every one of those is read out of your own installation when the editor starts:

| what it offers you | where it read it |
|---|---|
| 6 archetypes, with their capability flags | `mlog_heroes_archetypes.xml` |
| 28 perks, with what they apply to and their tier | `mlog_heroes_data.xml` |
| 6 shared decision sets and their priorities | `mlog_heroes_roster.xml` |
| 19 decision kinds and 26 task kinds | `mlog_heroes_catalog.xml` |
| all 261 host heroes and all 17 host fleets, in full | the host's own roster and fleet files |
| 390 ships, each attributed to the base game, a DLC **or a mod** | every archive and folder the game loads |
| every faction the game has, including ones mods add | `libraries/factions.xml` in every source |

So when Galactic Heroes gains a seventh archetype or a new perk, it appears in the editor's combo boxes **with no new release of the editor**. And when your install differs from the author's — a DLC you do not own, a ship mod you do — the editor offers what *you* have, not what somebody else had.

The corollary is the reason the [*What was read*](./reference/#what-was-read) tab exists at all: if a list somewhere in the editor is empty, the question is always "what did the harvest fail to read", and that tab answers it. A silently empty list is the failure mode worth engineering against.

### It reads the packed game without unpacking it

X4 ships its data in `.cat`/`.dat` pairs, and the usual assumption is that you need an unpacker. You do not. The `.cat` is a **plain-text index** — `path size mtime md5`, one line per file — and the `.dat` beside it is an **uncompressed concatenation** of those files in index order, with no header. A file's offset is the sum of the sizes before it, so reading one is a seek.

The editor does that for every source the game will load, in load order: base game, each DLC, then each mod folder, packed or loose. **Measured: 767 ms for 517,000 entries across 16 sources.** Every archive is checked before it is trusted — the sizes must sum to the `.dat` length exactly — and one that fails is skipped and reported rather than read at wrong offsets.

Two consequences you will actually notice:

- **Ships a mod adds are selectable.** The first source to introduce a macro name owns it. That matters more than it sounds: VRO ships 287 ship-macro files and only **24** are new ships — the other 263 are `<diff>` patches of vanilla hulls. Keeping the first occurrence attributes those to the base game, which is what your pack must actually depend on.
- **Factions a mod adds are selectable.** Tested against three real faction mods: reemergence (6 factions), a Star Wars conversion (34), chemodun's xenon_buff (2). The Star Wars file has 36 `<faction id=` elements and the parser takes 34 — the other two are `khaak` and `xenon` under a `<replace>`, which rewrites vanilla factions rather than adding any.

## What you can author

| Object | Registers into | Re-exporting replaces it? |
|---|---|---|
| **Fleet templates** | the fleet table | yes — the host wipes and rebuilds the table on every load |
| **Hero templates** | the roster | yes |
| **Spend plans** | the spend table | yes |
| **Corporation missions** | the mission table | yes |
| **Corporations** | the company register | **no** — see below |

[Corporations are the exception](./reference/#corporations-are-not-like-the-rest), and the editor says so in four places. A fleet or a hero is a catalogue entry that lives in the mod. A corporation owns money, contracts, favours, a share register and a chronicle, and all of that lives **in your save**. Registration for a company is *ensure-exists*: some fields refresh every load, founding capital is read once, and a company that has reached a save can never be removed.

That permanence is why an id collision is an **error** here rather than a warning.

## Requirements

- **Windows** with the **.NET 9 desktop runtime**
- **X4 Foundations** installed, and **Galactic Heroes** installed or checked out — the editor needs to read both
- No connection to anything. The editor is offline and writes only where you point it.

## Getting it

:::caution[Not released yet]
The editor is not on GitHub yet. This page documents the build the author runs; the public release is planned but has no date. Until then it is built from source.
:::

```
powershell -ExecutionPolicy Bypass -File tools/build.ps1
powershell -ExecutionPolicy Bypass -File tools/make-shortcut.ps1
```

Use `build.ps1` rather than a bare `dotnet build`. The bare command defaults to **Debug** while the desktop shortcut launches **Release**, and the two can drift by a day without anything looking wrong. `build.ps1` builds Release, runs both test lanes **from the Release binary**, and refuses outright if the binary is older than a source file.

The window title carries its own build stamp for the same reason — `[build 2026-09-18 17:15]`, and `DEBUG` when it is one. Which build am I looking at should be a reading, not a deduction from file timestamps.

## First run

Everything starts on the **Pack** tab, in the *Where things are* section. Three folders:

| Field | What it is |
|---|---|
| **X4 game folder** | your X4 Foundations install. Everything about ships, factions and DLC comes from here. |
| **Galactic Heroes md folder** | the `md` folder of the installed or checked-out host mod. Every archetype, perk, hero and fleet comes from here. |
| **Export folder** | where **Export…** writes a finished pack. Not the game — that is a separate button. |

Press **Reload from these folders** after changing any of them. The status bar's right-hand side is the receipt: `6 archetypes · 28 perks · 390 ships · 17 host fleets · 261 host heroes`. If those read zero, the paths are wrong, and *What was read → Reading* will say why.

The paths are remembered between sessions in `%AppData%\GalacticHeroesEditor\settings.json`.

## The shape of a working session

1. **Pack tab** — pick a pack id. It becomes the folder name in the game, the name of the generated script, and the prefix every id in the pack must carry. Ids are permanent once a save has seen them, so pick one nobody else will: your own name plus the pack is the usual answer.
2. **Author** fleets, heroes, plans, missions, companies — or copy something the host already has and edit the copy.
3. **Check** — 104 rules, and they run by themselves a moment after every edit. A finding shows on the tab header, on the object's row, above the form, and as a red or amber outline on the very box that sets the field. Errors block export; warnings do not.
4. **Export…** to a folder, or **Export into the game** to write straight into `extensions/<packid>`.
5. Start the game and look in `debug.log` for the pack's own build banner.

The [walkthrough](./walkthrough/) does all five with one hero, and the [reference](./reference/) covers every screen.

## Where a pack ends up

Export writes a complete X4 extension — four files, nothing else:

```
<packid>/
├── content.xml        the manifest
├── md/<packid>.xml    the script: a build banner and one registration call per object
├── t/0001.xml         the text page: every name, rank, story and mission line, numbered
└── README.txt         what was exported, where it goes, and how to translate it
```

The script is the same shape as the hand-written example pack: cues marked `instantiate="true"`, a build banner written as a **literal** so a deploy tool can verify the mod on disk is the one running, and one registrar call per template. It contains no `<diff>` and writes into no host table directly, so **load order between your pack and the host does not matter**.

**The text page is what makes a pack translatable.** Every string a player reads — a founder's name, a biography, a company's name and story, a mission's title — is written to `t/0001.xml` on the pack's own page, and the script refers to it as `readtext.{page}.{id}`, exactly as the host refers to its own text. That file is the *default* page: it holds every string in the language you wrote, and X4 shows it to every player whose language has no page of its own. To add a language, copy it to `t/0001-l007.xml` (Russian; the generated `README.txt` lists the others) and translate the entries, keeping the ids — they never move between exports. A rank the host already has is written as the host's own reference, so it stays translated in every language the host ships without you doing anything. The page number is chosen free of every page the installed game, DLC and mods declare, and shown on the Pack tab; keep it, because a translation names it.

Every DLC a chosen ship comes from is declared an **optional** dependency, exactly as the host does it. A hard dependency makes the extensions menu scream at a player who does not own that DLC; an optional one lets the pack load and simply not build that ship.

One thing the generator does that you could not do by hand: it writes the **shared decision sets out as literals**. The host keeps them as locals of its seed library, where a guest cannot name them. Copying them by hand is the cost the example pack documents — the editor pays it once, on everyone's behalf.

## Related

- [Walkthrough — your first pack](./walkthrough/)
- [Screen-by-screen reference](./reference/)
- [Archetypes](../archetypes/admiral/) — what the six of them can do
- [Perks](../mechanics/perks/) · [Corporations](../corporate/corporations/) · [Corporation missions](../corporate/corporation-missions/)

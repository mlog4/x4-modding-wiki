---
title: Modding language reference
description: The languages and frameworks a mod is written in — MD, Aiscript, Lua, data schemas.
---

The **Modding language reference** covers the languages and frameworks a mod is *written in*. These are not in-universe abstractions — they are constructs in the modder's editor that exist to control what happens in-game.

When you have a question like:

- *"How does a Cue's lifecycle work?"* → look up [Cue](/lang/md-framework/cue/)
- *"What attributes can `<order>` take in an aiscript?"* → look up [Order definition](/lang/aiscript/order/)
- *"How do I register a Lua callback for an MD signal?"* → look up [Globals](/lang/ui-lua/globals/) (RegisterEvent)
- *"What's the schema of `god.xml`?"* → look up [god.xml](/lang/data/god-xml/)

You'll find: schema, attributes, lifecycle, common idioms, gotchas, examples.

For the in-universe entities these languages control — Station, Ship, Sector, Faction — see the [Game API](/game/) instead.

## Categories

### ⚙️ [MD Framework](/lang/md-framework/)

The high-level event-driven scripting language used for missions, story content, and most mod logic. Cue, Library, Action, Condition (event), Expression, Variable, Namespace.

### 🤖 [Aiscript Framework](/lang/aiscript/)

The lower-level language used to define NPC ship behavior. Order definition, Interrupt, Attention, state-machine patterns.

### 🖥️ [UI / Lua](/lang/ui-lua/)

Player-facing UI written in Lua. Helper API, Globals (`RegisterEvent`, `SetScript`), FFI bridge, third-party APIs (SN Mod Support APIs).

### 📦 [Data schemas](/lang/data/)

XML schemas modders read or diff to add game content. `god.xml`, `parameters.xml`, `macro.xml`, `stationgroups.xml`, `constructionplans.xml`, etc.

---

## Why is this separate from Game API?

A modder reasoning about *what they want to do* uses a different mental model than a modder reasoning about *how to write it*. Mixing the two — Cue under the same heading as Station — buries language constructs in a list of game entities and slows lookup.

The two trees cross-reference freely. The [Cue](/lang/md-framework/cue/) page mentions Station as an example of an object you can manipulate; the [Station](/game/objects/station/) page mentions which Cue events fire about it.

---

## Prototype status

All pages in this section are currently placeholders demonstrating the navigation structure.

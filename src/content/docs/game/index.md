---
title: Game API
description: In-universe abstractions a mod interacts with — sectors, stations, factions, wares.
---

The **Game API** describes the in-universe abstractions a mod interacts with: things that exist in the X4 universe, their properties, what you can do to them, and what events they fire.

When you have a question like:

- *"How do I change ownership of a ship?"* → look up [Ship](/game/objects/ship/)
- *"How do I list stations in a sector?"* → look up [Sector](/game/world/sector/)
- *"How do I react when a station is destroyed?"* → look up [Station](/game/objects/station/) (Events section)

You'll find: description, properties, actions, libraries, events, examples, gotchas, related abstractions.

For *how to write* the code that uses these — Cue, Library, Event/Condition, Action, Variable, Expression — see the [Modding language reference](/lang/) instead.

## Categories

### 🌌 [World](/game/world/)

The spatial hierarchy where everything exists — Universe → Cluster → Sector → Zone, plus Highway and Gate.

### 🚀 [Object types](/game/objects/)

Things that exist in the world — Station (and its 8 subtypes), Ship, Module, Resource region.

### 🏴 [Factions](/game/factions/)

Who owns and controls things — Faction (parent), Player, NPC factions, Crew.

### 💰 [Economy](/game/economy/)

Ware, Trade offer, Subscription, Inventory, Cargo.

### 🎯 [Behavior](/game/behavior/)

What objects do in-universe — Order (a ship is executing X), Mission (a player has accepted Y), Conversation, Boarding operation.

For the *language-side* of behavior (how to *write* an order or a generic mission) see [Aiscript Framework](/lang/aiscript/) and [MD Framework](/lang/md-framework/).

---

## Prototype status

**Currently filled:** [Station](/game/objects/station/) and [Sector](/game/world/sector/). Other pages are placeholders to demonstrate navigation structure.

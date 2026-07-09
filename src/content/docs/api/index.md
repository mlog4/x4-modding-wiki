---
title: API Reference
description: Hierarchical abstractions for X4 modders.
---

The API reference is organized by **abstractions** — the things a modder needs to interact with when writing a mod.

When you have a question like:

- *"How do I change ownership of a ship?"* → look up [Ship](./objects/ship/)
- *"How do I list stations in a sector?"* → look up [Sector](./world/sector/)
- *"How do I react when a station is destroyed?"* → look up [Station](./objects/station/) (Events section)

You'll find: description, properties, actions, libraries, events, examples, gotchas, related abstractions.

## Categories

### 🌌 [World](./world/)

The spatial hierarchy where everything exists — Universe → Cluster → Sector → Zone, plus Highway and Gate.

### 🚀 [Object types](./objects/)

Things that exist in the world — Station (and its 8 subtypes), Ship, Module, Resource region.

### 🏴 [Factions](./factions/)

Who owns and controls things — Faction (parent), Player, NPC factions, Crew.

### 💰 [Economy](./economy/)

Ware, Trade offer, Subscription, Inventory, Cargo.

### 🎯 [Behavior](./behavior/)

What objects do — Order, Mission, Conversation, Boarding operation.

### ⚙️ [MD Framework](./md-framework/)

How a mod's code talks to the game — Cue, Library, Action, Condition (event), Expression.

### 🤖 [Aiscript Framework](./aiscript/)

How NPC behavior is defined — Order definition, Interrupt, Attention.

### 📦 [Data layer](./data/)

Assets and XML schemas — Macro, Component, god.xml, stationgroups.xml.

### 🖥️ [UI / Lua](./ui-lua/)

Player-facing UI — Helper API, Globals, third-party APIs (SN Mod Support APIs).

---

## Prototype status

**Currently filled:** the [Station](./objects/station/) page is the only fully-populated entry. Other pages are placeholders to demonstrate the navigation structure.

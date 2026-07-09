---
title: Data layer
description: Assets, macros, components, XML schemas.
---

:::caution[Placeholder section]
Prototype shows structure only. Pages to be filled after approval.
:::

## Core abstractions

- **Macro** — configured instance of a component (ship_arg_m_trans_container_01_a_macro, dock_arg_l_01_macro, …).
- **Component** — visual/geometric definition (3D mesh references + connection points).
- **Index registries** — `index/macros.xml`, `index/components.xml` (name → file path).

## XML data schemas

- **god.xml** — galaxy seeding (52 landmarks + 269 stations + 174 products + per-gamestart overrides).
- **stationgroups.xml** — group name → list of construction plans.
- **constructionplans.xml** — per-plan module list with positions and connections.
- **parameters.xml** — global balance tunables.
- **defaults.xml** — per-class defaults.
- **mapdefaults.xml** — per-cluster/sector economy/security/tags.
- **wares.xml** — ware definitions + production recipes.
- **jobs.xml** — NPC ship spawn definitions.
- **factions.xml** + **factionlogic.xml** — faction definitions.

## Common questions (planned)

- *"How do I add a new ship to the game?"* → Macro → Step-by-step (index entry + macro file + component reference).
- *"How do I override a vanilla wares.xml entry?"* → XML schemas → `<diff>` `<replace>` example.
- *"What is the difference between a Macro and a Component?"* → Macro = configured instance; Component = visual/geometric template.

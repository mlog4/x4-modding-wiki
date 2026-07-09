---
title: Modding Wiki
description: Gotchas, patterns, and workflow.
---

:::caution[Placeholder section]
Wiki content from the old site can be migrated here after verification.
:::

The wiki is a collection of short, focused entries on:

- **Gotchas** — bugs, edge cases, surprising behavior.
- **Patterns** — recurring techniques used by mods.
- **Workflow** — modder workflow tips.

Unlike the API reference (organized by abstraction), the wiki is organized by topic.

## Planned topics

- **Game data gotchas** — UI scale vs internal scale, money/prices ×100 in logs, faction relation float vs uivalue.
- **MD patterns** — Bridge/Worker pattern, listener race avoidance, reset_cue for recurring workers, library for return-by-value.
- **MD traps** — XML comment double-hyphen breaks scripts, instantiate=true drops entity writes, signal_cue param drops, double quotes in attr strings break LIBXML2.
- **Lua/UI traps** — utf8 missing, uitable as widget ID, FFI restrictions.
- **Workflow** — deploy paths (Steam only), reading debug.log, full sync after every build.

---
title: 'Mlog: Configuration Presets'
description: One-click configuration profiles for the DA Menu — three built-in presets (Default / All disabled / Debug) covering 82 fields across every subsystem.
sidebar:
  order: 1
---

Apply an entire configuration profile in one click instead of touching 60+ sliders individually. Introduced in v3.0-beta1 Phase B (mlog080+).

## In-game view

![Mlog: Configuration Presets — 3 built-in profiles with Apply buttons](/x4-modding-wiki/img/mods/deadair-scripts/menu-presets.jpg)

Layout:

- **Currently applied** shows the ID of the last-applied preset (`(none)` if no preset applied yet).
- **Built-in presets** — three rows: `All disabled`, `Debug (verbose logging)`, `Default (recommended)`. Each row = one **Apply** button.
- **Footer:** _"Applying a preset overwrites current settings. You can still tweak individual values in the other menus after."_

## Built-in presets

| Preset | ID | Intent |
|---|---|---|
| **Default (recommended)** | `default` | Most feature masters ON with sensible values. Match to the user's slot 1 preferences (validated by user testing). Use this as your primary configuration. |
| **All disabled** | `all_off` | Every master toggle OFF. Sub-features and DA rates stay at DA-vanilla defaults so re-enabling a subsystem later gives sane behavior. Vanilla-like experience with the mod loaded. |
| **Debug (verbose logging)** | `debug` | All masters ON with every `*_DetailedDebug` flag ON. Useful for issue reporting and development sessions. Expect heavy `script.log` spam. |

## Apply mechanism

Clicking **Apply** on a preset writes every field in the preset's `$settings` table to the corresponding DA runtime variable. Fields NOT present in the preset are left untouched (so future extensions of the preset scope don't reset existing user tweaks). Applied state persists across saves; the `last_applied_id` is tracked so the menu can visually indicate which preset is active.

## Coverage

**82 fields covered** across all 14 subsystems (as of mlog086). Fields NOT yet in preset scope:

- Per-faction Jobs Quotas (nested tables — Phase B v2 scope)
- Per-station ST/PST overrides

## Making your own preset

Currently custom presets are code-only (add a new entry to `md/mlog_da_presets.xml` registry). A UI-driven "Save current as preset" feature is planned for Phase B v2.

## Source

- Runtime registry: `md.$mlog_da_presets_state.$registry.$<id>`
- Last-applied tracker: `md.$mlog_da_presets_state.$last_applied_id`
- Definitions: [`md/mlog_da_presets.xml`](https://github.com/mlog4/deadair_scripts) in the mod source.

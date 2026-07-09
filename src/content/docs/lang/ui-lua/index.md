---
title: UI / Lua
description: Player-facing UI in Lua.
---

:::caution[Placeholder section]
Prototype shows structure only. Pages to be filled after approval.
:::

## Vanilla framework

- **Globals** — `RegisterEvent`, `SetScript`, `CallEventScripts`, `CallUpdateScripts`.
- **Helper API** — 200+ functions in `ui/addons/ego_detailmonitorhelper/helper.lua` for menu authoring.
- **FFI bridge** — C function calls from Lua.

## Third-party APIs

- **SN Mod Support APIs** — Simple Menu API, Simple Menu Options, Interact Menu, Hotkey API, Named Pipes, Time, Chat Window, Userdata.

## Common questions (planned)

- *"How do I add a custom menu to the game?"* → Helper API → `Helper.registerMenu` walkthrough.
- *"How do I handle events from MD in my Lua code?"* → Globals → `RegisterEvent("MyMod.X", ...)` example.
- *"How do I add an option to the Extension Options menu?"* → SN APIs → Simple Menu Options.
- *"Why doesn't `utf8` work in my Lua code?"* → Gotchas → `utf8` is nil in X4 sandbox.
- *"Why is the table widget ID, not the object?"* → Gotchas → `uitable` semantics.

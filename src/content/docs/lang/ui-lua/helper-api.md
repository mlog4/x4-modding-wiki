---
title: Helper API
description: The ~200-function Lua API in helper.lua for menu authoring. Tables, frames, buttons, dropdowns, the vanilla UI building blocks.
---

The **Helper API** is a ~200-function Lua library in `ui/addons/ego_detailmonitor/helper.lua` (and adjacent files) that vanilla menus use to construct UI. Modders adding custom menus call into Helper to build tables, frames, buttons, dropdowns, sliders, and the various visual primitives.

There is no formal documentation — modders learn Helper by reading vanilla menu code (`menu_*.lua`).

## File layout

```
ui/addons/
├── ego_detailmonitor/
│   ├── helper.lua          ← Helper API definitions
│   ├── menu_*.lua          ← Menu implementations
│   └── ...
├── ego_options/
└── ...
```

Helper functions are usually attached to a `Helper` global table. Some addons replicate or extend it.

## Most-used functions

### Menu construction

| Function | Purpose |
|---|---|
| `Helper.registerMenu(menu)` | Register a new menu with the engine |
| `Helper.initMenu(menu, defaults)` | Set common menu defaults |
| `Helper.setKeyBinding(menu, ...)` | Configure keybindings for the menu |
| `Helper.closeMenuForSubSection(menu, ...)` | Close + return to parent menu |

### Frames

| Function | Purpose |
|---|---|
| `Helper.createFrameHandle(...)` | Create a frame anchor for sub-table |
| `Helper.viewCreated` | Lifecycle callback for "view exists now" |
| `Helper.removeAllWidgetScripts(menu)` | Cleanup attached scripts |

### Tables

| Function | Purpose |
|---|---|
| `Helper.createTable(menu, frame, ...)` | Create a layout table |
| `Helper.createTableConfig(...)` | Configure column widths / heights |
| `Helper.headerRow(...)` / `Helper.rowConfig(...)` | Row styling |

### Buttons / interactive

| Function | Purpose |
|---|---|
| `Helper.buttonConfig(...)` | Configure button visual |
| `Helper.standardButtons*` | Vanilla button shortcuts |
| `Helper.createButtonText*` | Button text styling |
| `Helper.dropdownConfig(...)` | Dropdown options |
| `Helper.editboxConfig(...)` | Text-input boxes |

### Layout / sizing

| Function | Purpose |
|---|---|
| `Helper.standardSizeX` / `Helper.standardSizeY` | Default dimensions |
| `Helper.headerRowHeight` | Standard header height |
| `Helper.standardFontSize` | Default font size |

## Common patterns

### "Register a menu"

```lua
local Helper = require("extensions.MyMod.helper_required")

local menu = {
    name = "MyMod_Menu",
    onShowMenu = onShowMenu,
    onUpdate = onUpdate,
    cleanup = cleanup,
}

function init()
    Helper.registerMenu(menu)
    Helper.setKeyBinding(menu, ...)
end
```

Standard menu registration pattern.

### "Build a table layout"

```lua
function onShowMenu()
    menu.frame = Helper.createFrameHandle(menu, {
        x = 100, y = 100,
        width = 800, height = 600,
    })

    local frametable = menu.frame:addTable(2, {
        tabOrder = 1, x = 0, y = 0,
    })

    frametable:setColWidth(1, 200)
    frametable:setColWidth(2, 600)

    local row = frametable:addRow(true, {bgColor = ...})
    row[1]:createText("Label")
    row[2]:createButton({...}):setText("Click me")

    menu.frame:display()
end
```

Tables nested inside frames is the canonical pattern.

## Common gotchas

- ⚠ **`utf8` is nil in X4 8.x+ despite vanilla UI code referencing it.** Use a `string.lower()` fallback helper if your code needs locale-aware lower-casing.
- ⚠ **`uitable` in framework callbacks is a numeric ID, NOT the object.** Capture the actual table object via `menu.viewCreated` callback; NEVER compare to addTable's return value.
- ⚠ **`Helper.removeAllWidgetScripts` is required in `cleanup`.** Without it, callbacks leak across menu invocations. Vanilla pattern.
- ⚠ **`menu.infoFrame` must be set to `nil` in `cleanup`.** Otherwise the next menu open spams "invalid fontstring" errors per MD event. Memorable bug (cost 200k errors / 4h before fix).
- ⚠ **Helper functions are global-table-based.** Adding to `Helper.X` from a mod adds to the singleton. Use `mlog_` prefix or local tables to avoid collisions.
- ⚠ **No formal API documentation.** Read vanilla menus (`menu_*.lua`) for usage. Egosoft does not provide a Helper reference.
- ⚠ **Menu lifecycle callbacks fire in a specific order.** `onShowMenu` → `onUpdate` (repeated) → `cleanup`. Don't allocate persistent state in `onShowMenu` without freeing in `cleanup`.

## Architectural context

- **200+ functions across `helper.lua` files.** No formal docs — read vanilla.
- **Helper is not the only Lua library.** Egosoft splits responsibility across `extensions/ego_options/helper.lua`, `helper_required.lua`, and others. Each subsystem has its own helper.
- **SN Mod Support APIs** ([Simple Menu API](/lang/ui-lua/sn-apis/), etc.) wrap Helper with friendlier abstractions. Most mods use these instead of raw Helper.

## Related

- [Globals](/lang/ui-lua/globals/) — `RegisterEvent` / `SetScript` for MD bridging.
- [FFI](/lang/ui-lua/ffi/) — C function calls.
- [SN APIs](/lang/ui-lua/sn-apis/) — friendlier wrappers around Helper.
- Vanilla menus (`ui/addons/*/menu_*.lua`) — reading material.

---

:::tip[Pattern — undocumented Lua framework]
Helper is **X4's primary UI framework** — used by every vanilla menu. No formal docs exist; learn by reading vanilla code. For most mods, prefer [SN Mod Support APIs](/lang/ui-lua/sn-apis/) over raw Helper — they're easier and don't break with Helper changes.
:::

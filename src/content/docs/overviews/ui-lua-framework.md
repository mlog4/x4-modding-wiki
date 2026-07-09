---
title: UI Lua framework
description: How the vanilla UI is implemented — Lua scripts inside ui/addons calling the Helper API, FFI to engine, and event bus to MD. The four layers and how mods plug in.
---

How does X4's UI work? Every menu, HUD widget, and on-screen indicator is implemented in Lua, running inside `ui/addons/*/`. This overview maps the layers: Helper API, FFI, the event bus to MD, and where the [SN Mod Support APIs](/lang/ui-lua/sn-apis/) plug in.

For per-API details see [Helper API](/lang/ui-lua/helper-api/), [Globals](/lang/ui-lua/globals/), [FFI](/lang/ui-lua/ffi/), [SN APIs](/lang/ui-lua/sn-apis/).

## The four layers

```
┌──────────────────────────────────────────┐
│  Layer 4: Mod menus (community)          │
│  - SN APIs (Simple Menu API, etc.)        │
│  - Custom Lua menus                       │
└────────────────┬─────────────────────────┘
                 ↓ uses
┌──────────────────────────────────────────┐
│  Layer 3: Vanilla menus                  │
│  - ui/addons/*/menu_*.lua                 │
│  - Built on Helper API                    │
└────────────────┬─────────────────────────┘
                 ↓ uses
┌──────────────────────────────────────────┐
│  Layer 2: Helper API                     │
│  - ui/addons/ego_detailmonitor/helper.lua │
│  - ~200 functions for table/frame/button  │
└────────────────┬─────────────────────────┘
                 ↓ uses
┌──────────────────────────────────────────┐
│  Layer 1: Engine bindings (Globals/FFI)  │
│  - RegisterEvent, SetScript               │
│  - ffi.C.GetComponentData, etc.           │
│  - C strings, raw pointers                │
└──────────────────────────────────────────┘
```

Each layer builds on the previous. Most mod menus use Layer 4 (SN APIs), which builds on the rest.

## Layer 1: engine bindings

The engine injects globals into every Lua script's scope:

- `RegisterEvent(name, handler)` — subscribe to MD events
- `AddUITriggeredEvent(name, value)` — fire MD events from Lua
- `SetScript(slot, fn)` — register lifecycle handlers
- `CallEventScripts(name, args)` — invoke registered scripts
- `ffi.C` — direct C function access (LuaJIT FFI)

These are the **lowest-level access points** — engine state via FFI, MD bridge via event functions, lifecycle via SetScript.

See [Globals](/lang/ui-lua/globals/) and [FFI](/lang/ui-lua/ffi/) for details.

## Layer 2: Helper API

`ui/addons/ego_detailmonitor/helper.lua` defines ~200 Lua functions wrapping the raw engine calls into menu-building primitives:

- `Helper.createFrameHandle(...)` — wraps engine frame creation
- `Helper.createTable(...)` — wraps engine table widget
- `Helper.registerMenu(menu)` — wraps engine menu registration

Helper is **uncomfortably low-level** for mod authors — it works directly with widget IDs (FFI integers) and exposes engine quirks. But it's stable across versions.

See [Helper API](/lang/ui-lua/helper-api/) for the reference.

## Layer 3: vanilla menus

Each vanilla menu is a Lua file in `ui/addons/*/menu_*.lua` (e.g. `menu_map.lua`, `menu_object.lua`, `menu_options.lua`). Each menu:

1. Registers itself via `Helper.registerMenu(menu)`
2. Defines `onShowMenu` to build the layout
3. Defines `onUpdate` for per-frame ticks
4. Defines `cleanup` to free resources

Vanilla menus are the **reference implementation** of "how to build a complete menu with Helper". Modders adding custom menus typically read vanilla code for patterns.

### Menu lifecycle

```
   User opens menu
            ↓
   Engine calls onShowMenu(menu)
            ↓
   Menu builds frames + tables + widgets
            ↓
   Engine calls onUpdate(dt) per frame
            ↓
   ┌──────────────────────────────────┐
   │  User interacts (click, scroll)   │
   │  - Engine fires UI events         │
   │  - Menu callbacks run              │
   └────────────────┬─────────────────┘
                    ↓
   ┌──────────────────────────────────┐
   │  User closes menu                  │
   │  - Engine calls cleanup()          │
   │  - Menu frees widget scripts       │
   │    and references                  │
   └──────────────────────────────────┘
```

The lifecycle is **strict** — failing to call `Helper.removeAllWidgetScripts(menu)` in `cleanup` leaks callbacks across menu invocations.

## Layer 4: mod menus

Mods typically use the [SN Mod Support APIs](/lang/ui-lua/sn-apis/) instead of raw Helper:

- **Simple Menu API (SMA)** — describe menus from MD, no Lua needed
- **Simple Menu Options** — settings menus
- **Interact Menu API** — right-click context menu
- **Hotkey API** — custom keybindings

SN APIs hide the Helper / FFI complexity. Most mods don't touch Layer 2 directly anymore.

## The MD ↔ Lua event bus

A separate concern from menu building: how does MD signal to Lua menus that data changed?

```
   MD side:
   <raise_lua_event
      name="'mlog_my_event'"
      param="$data"/>
            ↓
   Engine routes to Lua side
            ↓
   Lua handler (registered via RegisterEvent):
   function onMyEvent(_, data)
      -- update menu state
   end
            ↓
   Lua side:
   AddUITriggeredEvent(
      "mlog_my_event_handled",
      "ok")
            ↓
   Engine routes back to MD
            ↓
   MD cue:
   <event_ui_triggered
      screen="'mlog_my_event_handled'"
      control="'ok'"/>
```

The bus is **string-based** — typos silently fail. Convention is `mlog_` prefix on event names.

See [Globals](/lang/ui-lua/globals/) for the full pattern.

## Common patterns

### Menu reads MD state

```
   onShowMenu → AddUITriggeredEvent("get state")
                                  ↓
   MD cue → raise_lua_event("state data", $state)
                                  ↓
   Lua handler updates menu
```

Bi-directional: Lua asks → MD provides.

### MD pushes UI updates

```
   MD detects change → raise_lua_event("update")
                                  ↓
   Lua handler refreshes display
```

One-way: MD pushes when something changes.

### Persistent settings via Userdata API

```
   onShowMenu → read from Userdata API → display
                                  ↓
   onUserChange → write to Userdata API
```

The Userdata API (one of the SN APIs) provides per-save persistent storage outside MD vars.

## Why this matters for modders

### Use SN APIs by default

Raw Helper is hard and undocumented. SN APIs are friendlier and version-stable. Use them unless you specifically need Helper's flexibility.

### Lua-side state is volatile

Lua-side variables don't survive save/load. Persistent state must go through:
- MD vars (via event bus)
- Userdata API
- The engine's preference system (Userdata wraps this)

### FFI is sandbox-restricted

X4 9.x's sandbox restricts some FFI calls (`GetWareData` notably). For data lookups, prefer the MD-bridge pattern (MD resolves, Lua receives via event) over raw FFI. See [FFI](/lang/ui-lua/ffi/) gotchas.

### Custom menus need cleanup

If your menu leaks references (e.g. doesn't nil-out `menu.infoFrame`), you'll see "invalid fontstring" spam in `debug.log`. Vanilla pattern in `cleanup`:

```lua
function cleanup()
    RemoveAllUITriggeredEvent()
    menu.frame = nil
    menu.infoFrame = nil  -- critical
end
```

### Performance

Per-frame work in `onUpdate` runs on every visible frame. Heavy logic (FFI lookups, table rebuilds) tanks framerate. Batch updates on state-change events instead.

## Cross-references

- [Helper API](/lang/ui-lua/helper-api/) — Layer 2 reference
- [Globals](/lang/ui-lua/globals/) — Layer 1 event functions
- [FFI](/lang/ui-lua/ffi/) — Layer 1 C function calls
- [SN APIs](/lang/ui-lua/sn-apis/) — Layer 4 friendly wrappers

## Related architectural overviews

- [Save migration](/overviews/save-migration/) — Lua state can't be migrated; MD vars can

---

:::tip[Pattern — layered UI framework with string-based event bus]
UI Lua framework is **X4's most layered Lua system** — engine bindings up through SN APIs. Modders should choose their layer: complex custom UIs → Helper API; simple settings → SN APIs; state from MD → event bus. The string-based MD ↔ Lua bus is the only way to bridge Lua's volatile session with MD's persistent state.
:::

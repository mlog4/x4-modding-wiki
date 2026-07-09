---
title: Globals
description: The Lua global functions for bridging MD ↔ Lua — RegisterEvent, SetScript, CallEventScripts, CallUpdateScripts, AddUITriggeredEvent.
---

The **Lua globals** are a small set of functions injected into every Lua script's global scope by the engine. They provide the bridge between MD scripts and Lua UI code — sending events, registering handlers, calling Lua from MD.

If you're writing a mod with a custom UI menu, **these are the functions that let MD signal your menu**.

## Core globals

### MD → Lua bridge

| Function | Purpose |
|---|---|
| `RegisterEvent(eventname, handler)` | Subscribe to an MD event |
| `UnregisterEvent(eventname, handler)` | Unsubscribe |
| `RemoveAllUITriggeredEvent()` | Cleanup (call in menu close) |

### Lua → MD bridge

| Function | Purpose |
|---|---|
| `AddUITriggeredEvent(name, value)` | Fire an MD event from Lua |

### Script registration

| Function | Purpose |
|---|---|
| `SetScript(eventname, handler)` | Register UI event handler |
| `CallEventScripts(eventname, args...)` | Invoke registered scripts |
| `CallUpdateScripts(dt)` | Per-frame update tick |

### Misc

| Function | Purpose |
|---|---|
| `Helper` | Global table — see [Helper API](/lang/ui-lua/helper-api/) |
| `ffi` | Global table — see [FFI](/lang/ui-lua/ffi/) |
| `print(...)` | Write to debug log |

## Common patterns

### "Register an MD event listener"

```lua
function init()
    RegisterEvent("MyMod.UpdateState", onUpdateState)
end

function onUpdateState(_, value)
    -- value is the MD signal's param
    print("Got state update:", value)
end
```

In MD, fire the event:

```xml
<raise_lua_event
    name="'MyMod.UpdateState'"
    param="'new state'"/>
```

The MD action `<raise_lua_event>` is the canonical MD-side trigger. Lua's `RegisterEvent` is the canonical receive side.

### "Fire an event from Lua to MD"

```lua
AddUITriggeredEvent("MyMod_MenuClosed", "ok")
```

In MD:

```xml
<cue name="WatchClose" instantiate="true">
    <conditions>
        <event_ui_triggered
            screen="'MyMod_MenuClosed'"
            control="'ok'"/>
    </conditions>
    <actions>
        <!-- handle Lua-side menu close -->
    </actions>
</cue>
```

### "Per-frame update"

```lua
function onUpdate(dt)
    -- dt is delta seconds since last frame
    accumulator = (accumulator or 0) + dt
    if accumulator > 1.0 then
        -- tick once per second
        updateThing()
        accumulator = 0
    end
end

-- register
SetScript("onUpdate", onUpdate)
```

## Common gotchas

- ⚠ **`RegisterEvent` callbacks are global.** Re-registering replaces the previous handler. To support multiple handlers for the same event, use a dispatcher pattern.
- ⚠ **Callbacks fire AFTER MD action completes.** Don't expect synchronous response from `<raise_lua_event>`.
- ⚠ **`AddUITriggeredEvent` and `<event_ui_triggered>` use different parameter names.** Lua side: name + value. MD side: `screen=` (matches name) + `control=` (matches value). Mismatch silently drops events.
- ⚠ **Event names are STRINGS.** Don't use enums or constants — Lua-side and MD-side must use literally the same string. Convention: prefix with mod name.
- ⚠ **`RemoveAllUITriggeredEvent` should be called in menu cleanup.** Otherwise event handlers leak across menu lifecycles.
- ⚠ **`print()` output goes to `debug.log`.** Use it for debug logging; do not rely on a console. Vanilla also uses `DebugError`, `Helper.debugText`.
- ⚠ **`SetScript` is for menu scripts, not arbitrary handlers.** Specifically `onUpdate`, `onShowMenu`, `cleanup` and similar named lifecycle slots.

## Examples

### Example 1: Bi-directional MD ↔ Lua

```lua
-- Lua side
function init()
    RegisterEvent("MyMod.DataPush", onDataReceived)
end

function onDataReceived(_, payload)
    -- handle MD data
    print("Got:", payload)

    -- respond back
    AddUITriggeredEvent("MyMod_DataReceived", "ack")
end
```

```xml
<!-- MD side -->
<cue name="SendData" instantiate="true">
    <conditions>...</conditions>
    <actions>
        <raise_lua_event
            name="'MyMod.DataPush'"
            param="$myData"/>
    </actions>
</cue>

<cue name="OnAck" instantiate="true">
    <conditions>
        <event_ui_triggered
            screen="'MyMod_DataReceived'"
            control="'ack'"/>
    </conditions>
    <actions>
        <write_to_logbook text="'Lua received'"/>
    </actions>
</cue>
```

### Example 2: Per-frame UI update

```lua
local function onUpdate(dt)
    if menu and menu.frame then
        menu.frame:setText("Time: " .. tostring(GetCurTime()))
    end
end

SetScript("onUpdate", onUpdate)
```

### Example 3: Cleanup pattern

```lua
function cleanup()
    RemoveAllUITriggeredEvent()
    menu.frame = nil
    menu.infoFrame = nil  -- IMPORTANT: prevent invalid fontstring spam
end
```

## Architectural context

- **MD-Lua bridge is one-way per call.** `<raise_lua_event>` triggers Lua handlers (with param); `AddUITriggeredEvent` triggers MD `event_ui_triggered` cues. Round-trip requires both.
- **String-based wiring.** Engine doesn't validate event-name strings — typos silently fail. Convention: prefix with mod identifier (`mlog_X`).
- **Performance:** `RegisterEvent` callbacks fire on every matching event. Filter inside the callback for high-frequency events.

## Related

- [Helper API](/lang/ui-lua/helper-api/) — UI construction.
- [FFI](/lang/ui-lua/ffi/) — C function calls.
- [SN APIs](/lang/ui-lua/sn-apis/) — wrapper APIs.
- [MD Action](/lang/md-framework/action/) — `<raise_lua_event>` action.
- [MD Condition](/lang/md-framework/condition/) — `event_ui_triggered` event.

---

:::tip[Pattern — string-based MD ↔ Lua bridge]
Globals provide the **string-based event bus** between MD and Lua. No type safety — both sides must use identical string names. Always prefix with `mlog_X` or similar to avoid cross-mod collisions.
:::

---
title: FFI
description: LuaJIT's Foreign Function Interface — direct C function calls from Lua. X4 exposes hundreds of C functions through ffi.C, but the sandbox restricts many of them in X4 9.x.
---

**FFI** (Foreign Function Interface) is LuaJIT's mechanism for calling C functions from Lua. X4's Lua sandbox exposes engine C functions via the global `ffi` table — modders use `ffi.C.X()` to call them directly without going through Helper or MD events.

FFI is the **fastest** way to query engine state from Lua (no MD round-trip), but its surface is **largely undocumented** and **the X4 9.x sandbox restricts some calls** — see Common gotchas.

## Basic usage

```lua
local ffi = require("ffi")
local C = ffi.C

-- Get the player's ID
local playerID = C.GetPlayerID()

-- Read object data
local data = C.GetComponentData(component, "knownname")
```

## Exposed function families

Vanilla `ui/addons/*/menu_*.lua` files reveal the available functions. Common families:

| Family | Examples | Purpose |
|---|---|---|
| `GetComponentData` | `GetComponentData(component, "X")` | Read any object property |
| `GetPlayerID` | `GetPlayerID()` | Player's MD ID |
| `GetMacroData` | `GetMacroData(macro, "X")` | Read macro data |
| `GetSectorOwner` | `GetSectorOwner(sector)` | Sector ownership |
| `GetFactionData` | `GetFactionData(faction, "X")` | Faction props |
| `GetWareData` | `GetWareData(ware, "X")` | Ware props (⚠ 9.x restricted) |
| `IsValidComponent` | `IsValidComponent(c)` | Null-check |
| `IsObjectDocked` | `IsObjectDocked(o)` | Dock state |
| `Helper.C` | various | Higher-level wrappers |

The exposed surface is **hundreds of functions**. No formal catalog exists.

## Common patterns

### "Read object data quickly"

```lua
local function getShipName(component)
    if C.IsValidComponent(component) then
        return ffi.string(C.GetComponentName(component))
    end
    return "(invalid)"
end
```

`ffi.string` converts a C string return into a Lua string.

### "Use struct-style access for object data"

```lua
local data = ffi.new("ComponentData[1]")
C.GetComponentData2(component, data)
print(data[0].knownname)
```

Some engine functions write into out-parameter structs. Define the struct via `ffi.cdef` if not already exposed.

### "Wrap FFI in a try-catch"

```lua
local function safeCall(fn, ...)
    local ok, result = pcall(fn, ...)
    if not ok then
        DebugError("FFI call failed: " .. tostring(result))
        return nil
    end
    return result
end

local name = safeCall(C.GetComponentName, component)
```

X4 9.x throws on some restricted calls — wrap to avoid crashes.

## Common gotchas

- ⚠ **`C.GetWareData` is RESTRICTED in X4 9.x.** Direct calls trigger sandbox errors. `pcall` doesn't hide the log error and doesn't save the calling event handler. Resolve ware names **MD-side** and push via `raise_lua_event` wire. (Memory: `x4_lua_ffi_getwaredata_restricted`.)
- ⚠ **The X4 9.x sandbox likely restricts more `GetXData` family functions.** Test each function; if it errors in the log, find an MD-side workaround.
- ⚠ **`ffi.string` is REQUIRED for converting C-string returns to Lua strings.** Skipping it gives you a `cdata*char` that doesn't compare equal to anything.
- ⚠ **FFI is fast but DANGEROUS.** Engine functions don't validate inputs. Passing a null or invalid component crashes the engine — not just the Lua script.
- ⚠ **No documentation.** Read vanilla menu Lua files for usage. Vanilla `menu_object.lua`, `menu_map.lua`, etc. show the patterns.
- ⚠ **`ffi.C` is the same as raw `C` in most contexts.** Some scripts use `local C = ffi.C` to shorten access — convention only.
- ⚠ **Hot-reload of FFI calls may not work cleanly.** After a reload, cached FFI references may be stale. Re-initialize on `init()`.

## Examples

### Example 1: Read object name safely

```lua
local function getName(component)
    if not C.IsValidComponent(component) then
        return nil
    end
    return ffi.string(C.GetComponentName(component))
end
```

### Example 2: Fallback for restricted FFI

Memory note: `C.GetWareData` is restricted in 9.x. Instead of calling FFI:

```xml
<!-- MD side: pre-resolve ware data, push to Lua -->
<raise_lua_event
    name="'MyMod.WareDataPush'"
    param="$ware.name"/>
```

```lua
-- Lua side: receive resolved data via event
RegisterEvent("MyMod.WareDataPush", function(_, wareName)
    storedWareName = wareName
end)
```

Pre-compute MD-side; transport via the event bus. Avoids the sandbox.

### Example 3: Defensive FFI wrapper

```lua
local function safeFFI(callable, ...)
    local args = {...}
    local ok, result = pcall(function()
        return callable(table.unpack(args))
    end)
    if not ok then
        DebugError("FFI failed: " .. tostring(result))
        return nil
    end
    return result
end
```

Use for FFI calls that may throw.

## Architectural context

- **FFI is LuaJIT-native.** X4 ships with LuaJIT; standard Lua doesn't have FFI built-in.
- **C function discovery:** vanilla menu files have `ffi.cdef[[...]]` blocks that declare C signatures. Modders reuse these or read existing definitions.
- **9.x sandbox tightening:** Egosoft progressively restricts FFI access as security model evolves. Test mods against each version.

## Related

- [Helper API](/lang/ui-lua/helper-api/) — high-level UI alternative.
- [Globals](/lang/ui-lua/globals/) — MD-bridge alternative.
- [SN APIs](/lang/ui-lua/sn-apis/) — wrappers for common FFI patterns.

---

:::tip[Pattern — fast but fragile direct engine access]
FFI is the **fastest path from Lua to engine state**, but the surface is undocumented and the sandbox keeps tightening. For most mod queries, prefer the MD-bridge pattern (MD resolves data, fires Lua event with value). Use FFI only when MD round-trip is too slow.
:::

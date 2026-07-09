---
title: SN Mod Support APIs
description: Community-maintained wrapper APIs for X4 modding — Simple Menu API, Simple Menu Options, Interact Menu, Hotkey API, and others. Friendly abstractions over Helper / FFI.
---

The **SN Mod Support APIs** are a family of community-maintained Lua mod-support libraries — friendlier alternatives to raw [Helper API](/lang/ui-lua/helper-api/) and [FFI](/lang/ui-lua/ffi/). Authored by SirNukes (community modder), they're an effective dependency for any mod that builds custom menus or hotkeys.

These APIs hide the underlying engine quirks and provide stable interfaces that survive across X4 versions.

## Available APIs

| API | Purpose | Use case |
|---|---|---|
| **Simple Menu API (SMA)** | Build custom menus from MD without Lua | Most modders' first dependency |
| **Simple Menu Options** | Add entries to the Extension Options menu | Settings UI for mods |
| **Interact Menu API** | Add entries to the right-click "interact" menu | Object-specific actions |
| **Hotkey API** | Register custom keybindings | Quick-actions |
| **Named Pipes** | OS-level IPC to external programs | Discord bridge, etc. |
| **Time API** | Real-time timers | Long-running timers |
| **Chat Window API** | Custom chat overlay | Notifications |
| **Userdata API** | Per-save persistent storage outside MD vars | Larger blobs / structured data |

Each API is its own mod that you depend on via `<dependency id="ws_..."/>` in your `content.xml`.

## Simple Menu API (most common)

SMA lets you build entire menus from MD scripts — no Lua required. The vanilla menu primitives (Frame, Table, Button, Dropdown, Slider, Text, Editbox) are exposed as MD signals.

### Basic menu

```xml
<signal_cue_instantly
    cue="md.Simple_Menu_API.Reset_State"/>

<signal_cue_instantly
    cue="md.Simple_Menu_API.Register_Action"
    param="['mlog_my_menu_create',
        table[
            $callback = MenuCreate.run,
            $callbackparam = null
        ]]"/>
```

(Pattern from vanilla SMA examples. Real menus have many more registrations.)

### Common cues

| SMA cue | Purpose |
|---|---|
| `Reset_State` | Clear previous menu state |
| `Register_Action` | Register a button action |
| `Create_Menu` | Open the menu |
| `Close_Menu` | (does not exist — see gotcha) |
| `Make_Table` | Build a layout table |
| `Make_Row` / `Make_Cell` | Row and cell construction |
| `Make_Text` | Add text |
| `Make_Button` | Add a button |
| `Make_Dropdown` | Add a dropdown |
| `Display_Menu` | Render |

Each cue is signalled with parameters describing what to build.

## Common gotchas

- ⚠ **SMA has NO `Close_Menu` cue — `Create_Menu` REPLACES the open menu.** Signal `Create_Menu` again to replace; there's no explicit close. Used for confirmation dialogs.
- ⚠ **`Make_Button` in unselectable row crashes UI.** `Make_Button` in `$selectable=false` row triggers "Button in unselectable row" → UI reload. Default-selectable rows for action buttons; mark only text-only rows non-selectable.
- ⚠ **`Make_Button $text` is a TABLE, NOT a plain string.** `$text=TextProperty table`, plain string breaks render + silent onClick errors. Same for `$text2`. Pattern: `$text = table[$text='Click me']`.
- ⚠ **`Color.X` references work only via mappings, not raw `<color id=>`.** Setting `$cellBGColor='Color.azure_very_dark'` silently renders bright magenta. Add a `libraries/colors.xml` diff with `mlog_`-prefixed mappings (DA Scripts pattern). See `x4_simple_menu_color_mappings_only` memory.
- ⚠ **SMA vertical pixel budget.** Long `Make_Text` strings wrap multi-line; sum of min row heights > screen → SMA aborts whole table, menu renders empty header only. Limit text length.
- ⚠ **`$startOption` dropdown is 1-based INDEX, not value.** Option subtables use `$value` field; callback reads `event.param.$option.$value`. See `x4_simple_menu_dropdown_index` memory.
- ⚠ **`menu.infoFrame = nil` in cleanup.** Required to prevent "invalid fontstring" spam across menu events. Memorable bug (200k errors / 4h to find).

## Simple Menu Options

For mod settings, add an entry to the Extension Options menu:

```xml
<library name="OptionsRegistration" purpose="run_actions">
    <actions>
        <signal_cue_instantly
            cue="md.Simple_Menu_Options.Register_Option"
            param="['mlog_my_mod', 'My Mod Settings',
                table[
                    $optionTable = $myOptionsTable,
                    $onSave = OnSave.run
                ]]"/>
    </actions>
</library>
```

The player sees "My Mod Settings" in the Extension Options menu. Options stored via the `$optionTable` are persistent.

## Hotkey API

Register a hotkey:

```xml
<signal_cue_instantly
    cue="md.Hotkey_API.Register_Action"
    param="[
        'mlog_my_hotkey',
        'My hotkey label',
        OnHotkey.run,
        $myParam
    ]"/>
```

Player can bind a key via Extension Options → Hotkeys. When pressed, `OnHotkey.run` cue is signalled.

## Common patterns

### "Mod with menu + settings + hotkey"

A typical mod uses all three:

1. **SMA** for the main menu UI
2. **Simple Menu Options** for persistent settings
3. **Hotkey API** for quick-open the menu

Each has its own registration cue called from `Init`.

### "Confirmation dialog pattern"

```xml
<!-- Show confirmation -->
<signal_cue_instantly cue="md.Simple_Menu_API.Reset_State"/>
<signal_cue_instantly cue="md.Simple_Menu_API.Make_Table">
    <!-- ... build confirmation UI ... -->
</signal_cue_instantly>

<!-- When user clicks Yes, re-issue Create_Menu to "replace" -->
<!-- (no explicit close; new menu replaces old) -->
```

Since SMA has no Close_Menu, the canonical "confirm then return" is "replace menu via Create_Menu".

## Architectural context

- **Workshop IDs:** Each SN API is a separate Workshop mod with its own `ws_<id>`. Reference in your `content.xml`:
  ```xml
  <dependency id="ws_2042901274"/>  <!-- Simple Menu API -->
  ```
- **Community-maintained:** Egosoft does not officially support these. They evolve as community + SirNukes updates them.
- **De-facto standard:** Most major X4 mods depend on at least one. They're stable enough for production use.

## Related

- [Helper API](/lang/ui-lua/helper-api/) — underlying primitives.
- [Globals](/lang/ui-lua/globals/) — MD↔Lua bridge underneath.
- [FFI](/lang/ui-lua/ffi/) — engine access used internally.

---

:::tip[Pattern — community standard layer]
SN Mod Support APIs are **the de-facto standard for X4 UI mods**. Use them instead of raw Helper / FFI — friendlier API, version-stable, well-documented through community examples. The Workshop dependency model means players install the libraries automatically when subscribing to your mod.
:::

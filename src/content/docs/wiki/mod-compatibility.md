---
title: Mod compatibility
description: Making your mod play nice with other mods. Namespace prefixes, diff vs replace, dependency management, and the checklist before publishing.
---

A mod that works perfectly alone but breaks when other mods are installed is a mod that won't get played. X4's modding ecosystem expects mods to coexist — this page is the **compatibility discipline** to make sure yours does.

## The golden rules

1. **Prefix everything with `mlog_X` (or your own namespace)** — variables, cue names, libraries, faction IDs, mod parts. Never use generic names like `$state` at global scope.
2. **Use `<add>` over `<replace>` whenever possible** — adding to lists doesn't conflict; replacing them does.
3. **Use XPath that targets one thing** — `//entry[@id='X']` is specific; `//entry` matches everything and overwrites mass.
4. **Declare dependencies explicitly** — `<dependency id="...">` in content.xml.
5. **Never modify vanilla globals without isolation** — wrap your changes so other mods can still read the originals.

## Namespace discipline

### Variables

❌ Bad:
```xml
<set_value name="global.$state" exact="42"/>
```

`global.$state` collides with literally any other mod using the same name.

✅ Good:
```xml
<set_value name="global.$mlog_my_mod_state" exact="42"/>
```

OR scope it to your mod's namespace cue:

```xml
<cue name="MyMod" namespace="this">
    <actions>
        <set_value name="this.$state" exact="42"/>
    </actions>
</cue>
```

Other mods can't accidentally read or write `this.$state` in your cue tree.

### Cue names

Cue names within a script are local — `md.YourScript.YourCue` is the qualified form. But your SCRIPT NAME is global.

❌ Bad: `<mdscript name="state">` — collides with anyone else's `state` script
✅ Good: `<mdscript name="mlog_my_mod_state">` — unique

### Faction IDs

Same principle. `<faction id="myfaction">` collides; `<faction id="mlog_my_faction">` doesn't.

### MD ↔ Lua event names

Event-bus names are global strings. `RegisterEvent("update", ...)` may be intercepted by another mod listening for "update". Always prefix:

```lua
RegisterEvent("mlog_my_mod_update", onUpdate)
```

```xml
<raise_lua_event name="'mlog_my_mod_update'" param="$data"/>
```

## XML diff discipline

### Prefer `<add>` over `<replace>`

`<add>` extends lists; `<replace>` overwrites. Two mods adding new entries with `<add>` both succeed. Two mods replacing the same entry — one wins, the other silently loses.

❌ Bad:
```xml
<replace sel="//modules">
    <modules>
        <module macro="my_module"/>
    </modules>
</replace>
```

✅ Good:
```xml
<add sel="//modules">
    <module macro="my_module"/>
</add>
```

### Specific XPath selectors

❌ Bad: `<replace sel="//macro/properties/hull/@max">5000</replace>` — modifies ALL macros' hull/max

✅ Good: `<replace sel="//macro[@name='ship_X']/properties/hull/@max">5000</replace>` — only ship_X

The more specific the selector, the less likely another mod's diff will conflict with yours.

## Dependency declaration

In `content.xml`:

```xml
<content id="mlog_my_mod" name="My Mod" version="1.0">
    <dependency id="ws_2042901274" version="1.0"
        comment="Simple Menu API"/>
    <dependency id="ws_2454654898" version="1.0"
        comment="Simple Menu Options"/>
</content>
```

If dependency `<id>` doesn't match installed mods, your mod fails to load. Use the exact `ws_<workshop_id>` (case-sensitive).

### Optional dependencies

For mods you can integrate with but don't require:

```xml
<dependency id="ws_X" optional="true"/>
```

In MD, gate references with `<do_if value="@md.OptionalMod.$exists">`.

### Cyclical dependencies

If Mod A depends on Mod B and Mod B depends on Mod A, neither loads. Reorganise to break the cycle.

## Sharing data across mods

For mods that COOPERATE (not just coexist):

```xml
<!-- Producer mod -->
<set_value name="md.mlog_producer.$shared_state"
    exact="table[$ships = $list, $version = 1]"/>
```

```xml
<!-- Consumer mod -->
<do_if value="@md.mlog_producer.$shared_state
    and md.mlog_producer.$shared_state.$version ge 1">
    <set_value name="$ships"
        exact="md.mlog_producer.$shared_state.$ships"/>
</do_if>
```

Always null-check (`@`) and version-check before using cross-mod data. The producer may not be installed or may use an incompatible version.

## Common compatibility traps

### Modifying vanilla globals

❌ Bad: `<set_value name="md.FactionLogic.$BuildTick" exact="60s"/>` — overwrites vanilla

If vanilla uses `md.FactionLogic.$BuildTick`, your change affects vanilla AND all mods reading it. Either:
- Don't change vanilla globals — interact through your own state
- Coordinate with other mod authors

### Replacing vanilla cues

If you replace `<cue name="FactionLogic_Tick">`, your version runs INSTEAD of vanilla's. Other mods expecting vanilla behaviour break.

Better: add a parallel cue that runs ALONGSIDE vanilla and modifies its outputs.

### Vanilla script file overwrites

Putting a file at `extensions/your_mod/md/factionlogic.xml` REPLACES vanilla's factionlogic.xml entirely. This breaks vanilla. Use diff patches at `extensions/your_mod/md/factionlogic_diff.xml` (or the standard diff naming).

### Tax events that other mods listen for

If your mod fires `event_X` that vanilla cues listen for, you may accidentally trigger vanilla behaviour. Test in a save with vanilla content active.

## Pre-publish compatibility checklist

Before publishing your mod, verify:

- [ ] All variables use `mlog_X` (or your namespace) prefix
- [ ] All cue names use `mlog_X` prefix at script level
- [ ] All factions / mod parts / wares use `mlog_X` prefix
- [ ] Event-bus names use `mlog_X` prefix
- [ ] XML diffs use `<add>` instead of `<replace>` where possible
- [ ] XML selectors target specific entries, not broad matches
- [ ] Dependencies listed in content.xml
- [ ] Test with no other mods (baseline)
- [ ] Test with 5-10 popular community mods installed
- [ ] No debug.log errors when other mods are active
- [ ] No `Property lookup failed` errors with other mods loaded

## Testing compatibility

Take the same save and load with:

1. **Vanilla only** — your baseline
2. **Vanilla + your mod** — does it work?
3. **Vanilla + your mod + 5 random popular mods** — does it still work?

Many compatibility bugs are timing-related. A second mod loads scripts in a different order; suddenly your script's `event_cue_completed` listener doesn't fire because the watched cue completed BEFORE your script loaded.

## Related

- [Workflow](/wiki/workflow/) — deploy and testing iteration
- [Debugging strategies](/wiki/debugging-strategies/) — debug.log triage
- [Variable](/lang/md-framework/variable/) — variable scoping rules
- [Namespace](/lang/md-framework/namespace/) — cue tree namespace mechanism
- [Library](/lang/md-framework/library/) — library namespace conventions

---

*The X4 modding ecosystem rewards compatibility — popular mods get downloaded, recommended, and built upon. Following these conventions is what makes that ecosystem work.*

---
title: Save migration
description: How vanilla migrates older save formats forward when scripts evolve. The version= attribute + <patch sinceversion> mechanism that keeps multi-year saves loadable.
---

X4 has been actively developed since 2018. Player saves from 2020 still load in 2026 builds — even though scripts have evolved across DLCs and patches. This is possible because X4 has a **declarative save migration mechanism** built into MD and aiscript: the `version=` attribute and `<patch sinceversion>` blocks.

This overview explains the mechanism, when it kicks in, and how modders should version their own scripts.

Vanilla MD + aiscript has **1992 `sinceversion=` references** across the codebase — every long-lived feature has migration logic.

## The version= attribute

Cues, aiscripts, libraries, and individual parameters can carry a `version=` attribute:

```xml
<cue name="MyCue" version="3">
    ...
</cue>
```

```xml
<aiscript name="order.wait" version="8">
    ...
</aiscript>
```

```xml
<param name="fidget" type="internal" default="false" version="7">
    <patch value="false" sinceversion="7"/>
</param>
```

`version=` declares "this is the current schema version". The engine remembers per-save what version was active when the save was written.

## How migration runs

When a save is loaded, for every active cue / variable / order, the engine compares:

```
Engine reads from save:
   cue's last-active version = 2

Engine reads from current script file:
   cue's declared version = 4

Engine sees mismatch → look for <patch> blocks
```

`<patch sinceversion="N">` blocks declare migration logic:

```xml
<patch sinceversion="3">
    <!-- runs when migrating from version < 3 to current -->
    <set_value name="$newField" exact="0"/>
</patch>

<patch sinceversion="4">
    <!-- runs when migrating from version < 4 -->
    <set_value name="$anotherField" exact="true"/>
</patch>
```

The engine runs all `<patch>` blocks whose `sinceversion` exceeds the save's last-active version. Multiple patches run in order.

## Patch types

### Variable / parameter patches

```xml
<param name="newOption" type="bool" default="false">
    <patch value="false" sinceversion="3"/>
</param>
```

When a save from version < 3 loads, the `newOption` variable is initialised to `false` — even though the parameter is new.

### State patches (advanced)

Vanilla `finalisestations.xml`:

```xml
<patch sinceversion="2" state="waiting">
    <debug_text text="'Construction sequence generation was interrupted. Triggering again.'"/>
    <do_if value="$Conn_PlannedConnectors.count">
        ...
    </do_if>
</patch>
```

`state="waiting"` restricts the patch to cues that were in `waiting` state when the save was written. Used for fixing interrupted multi-stage operations.

### Default value patches

```xml
<patch value="true" sinceversion="5"/>
```

When the parameter default changes, this patch updates existing saves to the new default. Without it, old saves keep the previous default forever.

## When migration runs

| Trigger | Behaviour |
|---|---|
| Save loaded with script version > save version | All applicable `<patch>` blocks run |
| Save loaded with script version == save version | No patches run |
| Save loaded with script version < save version | Script was downgraded — engine warns, behaviour undefined |
| New cue added to script | New cue starts at its declared version |

Mods that decrease version numbers (downgrade) generally break saves.

## Vanilla patterns

### Pattern: new parameter with safe default

```xml
<param name="newSetting" type="bool" default="false">
    <patch value="false" sinceversion="7"/>
</param>
```

Old saves get `newSetting=false`. New saves use whatever the user sets.

### Pattern: changed param semantics

```xml
<param name="oldMeaningChanged" type="time" default="60s">
    <patch value="60s" sinceversion="5"
        comment="Old behaviour was instantaneous; new default is 60s"/>
</param>
```

Document the semantic change in the `comment`. Patch ensures old saves don't behave oddly.

### Pattern: state recovery

```xml
<cue name="MyLongRunningCue" version="3">
    <conditions>...</conditions>
    <actions>...</actions>

    <patch sinceversion="3" state="active">
        <!-- if a v2 save was mid-execution, fix up state -->
        <do_if value="not @$expectedField">
            <set_value name="$expectedField" exact="default"/>
        </do_if>
    </patch>
</cue>
```

Helps when a long-running cue was in mid-execution when the save was taken.

## Modder implications

### Always start at version 1

Your first version of a custom script:

```xml
<mdscript name="mlog_my_mod" version="1">
    ...
</mdscript>
```

When you make breaking changes, bump to version 2, 3, etc.

### Add `<patch>` for breaking changes

Don't just bump the version — also add `<patch>` blocks:

```xml
<param name="threshold" type="integer" default="100">
    <patch value="100" sinceversion="2"/>
</param>
```

Without the patch, old saves crash or behave incorrectly.

### Test save compatibility

After every schema change:

1. Load an old save with the OLD version of your mod — confirm works
2. Update to NEW version
3. Load the same save — confirm migrates cleanly

Without this test, save compatibility silently degrades.

### Cross-mod compatibility

Different mods have independent version numbers. Your mod's version 5 + someone else's mod's version 12 don't interact — each tracks its own save state.

### Don't decrease versions

A `version=2` script later changed to `version=1` confuses the engine. Save compatibility breaks. If you need to roll back, fork and ship as a different mod name.

## What can't be migrated

Some changes can't be cleanly migrated:

- **Renaming a cue** — old saves reference the old name; renaming breaks them
- **Removing required parameters** — saves still have old values that don't fit
- **Changing variable types** (e.g. integer to string) — runtime errors when accessed

For these changes, either:
- Don't make them (preserve compatibility)
- Accept that old saves can't load this mod version

## Cross-references

- [Cue](/lang/md-framework/cue/) — `version=` attribute
- [Order definition](/lang/aiscript/order-definition/) — `version=` on aiscript root and params
- [Variable](/lang/md-framework/variable/) — save persistence
- [Setup runs once memory](/game/objects/station/#common-gotchas) — related lifecycle gotcha

## Related architectural overviews

- *(none yet — Save migration is its own concern)*

---

:::tip[Pattern — declarative migration via versioned schemas]
Save migration is **X4's "active record" pattern** — scripts declare their schema version + how to migrate from prior versions. Vanilla has 1992 `sinceversion=` references. This is what lets X4 saves survive 4+ years of active development. Modders adding long-lived state to mods should follow the same discipline — bump version, add patches, test compatibility.
:::

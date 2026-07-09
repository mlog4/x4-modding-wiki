---
title: Save compatibility
description: How to make mod updates that don't break players' saves. The version= attribute discipline, <patch> blocks, and what changes can't be migrated.
---

X4 players play for hundreds of hours on the same save. A mod update that breaks the save is a disaster — the player loses progress, posts angry reviews, and uninstalls. This page is the **save compatibility discipline**.

For the engine's migration mechanism see [Architectural overview: Save migration](/overviews/save-migration/).

## The contract

When you publish a mod update, expect that **players have ACTIVE saves** using the old version. The update must:

1. Load cleanly into those saves
2. Migrate any new variables to safe defaults
3. Not change the meaning of existing data
4. Either preserve or version the existing state

If you can't do all four, the update must increment the major version and be marked as save-incompatible (and players who don't restart lose access to the mod).

## Use version= from version 1

Every mod script should declare `version="N"` from day one:

```xml
<mdscript name="mlog_my_mod" version="1">
    <cues>
        <cue name="Init" version="1" instantiate="false">
            <conditions>...</conditions>
            <actions>...</actions>
        </cue>
    </cues>
</mdscript>
```

When you make a breaking change, bump:

```xml
<mdscript name="mlog_my_mod" version="2">
    ...
```

The engine remembers the version per-save. When the player loads an older save, the engine knows it's loading from version 1 into version 2.

## Add patches for breaking changes

```xml
<param name="newOption" type="bool" default="false">
    <patch value="false" sinceversion="2"/>
</param>
```

When the save is from version < 2, the `<patch>` fires and initialises `$newOption` to `false`. Without the patch, the variable is undefined and accesses error.

### Patch for added variables

If you add `$newField` to a cue:

```xml
<patch sinceversion="2">
    <do_if value="not @$newField">
        <set_value name="$newField" exact="default_value"/>
    </do_if>
</patch>
```

The patch runs on saves loaded from < 2. The `do_if` is defensive — if a patch ran twice (rare), it skips.

### Patch for changed semantics

If a variable's meaning changes:

```xml
<patch sinceversion="3">
    <!-- Old $delay meant minutes; new $delay means seconds -->
    <set_value name="$delay" exact="$delay * 60s"/>
</patch>

<patch sinceversion="3" state="waiting">
    <!-- Recover from interrupted multi-stage operations -->
    <do_if value="@$pending_action">
        <signal_cue cue="RetryPending"/>
    </do_if>
</patch>
```

The `state="waiting"` patches only fire for cues that were in `waiting` state when the save was written — useful for fixing interrupted operations.

## What CAN be migrated

| Change | Migrate via |
|---|---|
| Added cue | New cue starts fresh in old saves |
| Added variable | `<patch>` with default value |
| Added parameter to a cue | `<patch>` with default |
| Changed default value | `<patch>` updating to new default |
| Added a new event listener | New listener starts firing immediately |
| Added a new library | Existing cues don't call it; new code does |

## What CAN'T be migrated

| Change | Why it breaks |
|---|---|
| Removing a variable | Old saves reference it; runtime error |
| Removing a cue | Old saves have `<cue ref>` references that fail to resolve |
| Renaming a cue | Same as remove + add |
| Removing a required param | Old saves have invalid param values |
| Changing variable type (int → string) | Old saves have int values; new code expects string |
| Changing event handler semantics | Old in-flight events behave incorrectly |

If you need these changes, you must:
- Bump major version
- Mark as save-incompatible in release notes
- Provide a save converter (rare) OR accept that saves don't carry over

## Strategy: phased deprecation

Instead of removing things, deprecate gradually:

### Phase 1: add the new thing, keep the old
```xml
<set_value name="$newField" exact="$oldField"/>  <!-- copy -->
<!-- code uses $newField; $oldField stays alive -->
```

### Phase 2: warn but keep
```xml
<patch sinceversion="3">
    <do_if value="@$oldField">
        <debug_text text="'$oldField deprecated; use $newField'"/>
    </do_if>
</patch>
```

### Phase 3 (much later): remove $oldField
At this point, most users have updated through phase 1 and 2. Removal is safer.

## What about scripts that were never run?

A new cue with a unique name has no prior save state. It starts fresh — no patch needed.

This is the easiest way to add features: introduce them as new cues that initialize themselves on first activation.

## Testing save compatibility

The discipline:

1. Mod at version 1 → make save → play 30 mins → save  
2. Update mod to version 2 → load the save → verify works
3. Update mod to version 3 → load the version-2 save → verify works
4. Update mod to version 3 → load the version-1 save → verify works

Each version step must remain loadable from any prior version. Iterating through versions verifies the patch chain.

## What about cross-mod state changes?

If your mod writes to `md.OtherMod.$state`, you can't migrate it via your own version. The other mod's version controls migration.

Better: don't write to other mods' state. Either:
- Add your own state and have OtherMod read it
- Use the event bus (`signal_cue` / `raise_lua_event`) instead of direct state writes

## Common save-compatibility traps

### Removing default values

```xml
<!-- Version 1 -->
<param name="$mode" default="'aggressive'"/>

<!-- Version 2 (bad) -->
<param name="$mode"/>  <!-- removed default -->
```

Old saves had `$mode='aggressive'`. New saves get the new default. But the param's TYPE is now unspecified — the engine may not allow this transition.

Solution: keep the default unchanged when possible. Add a `<patch>` to *override* if needed.

### Changing event listener semantics

```xml
<!-- Version 1 -->
<conditions>
    <event_object_destroyed group="$tracked"/>
</conditions>

<!-- Version 2 (bad) -->
<conditions>
    <event_object_destroyed group="$tracked"/>
    <check_value value="event.object.iscapitalship"/>
</conditions>
```

The version-2 cue is MORE RESTRICTIVE. Saves where the cue was waiting for ANY destruction now wait forever — capital ships are rare.

Solution: keep the original condition AND add a sub-cue that filters.

### Saving large lists

A `global.$tracked = $largeList` survives save/load. But the list is now persistent state across versions — you need patches if the list structure changes.

Prefer per-cue scoped variables when possible. Globals lock you into compatibility.

## Major version bumps

When you can't migrate cleanly, bump major version (1.x → 2.0) and:

1. Mark in release notes: "BREAKING — saves from 1.x are NOT compatible"
2. Keep the previous version available on Workshop
3. Encourage players to keep playing 1.x or start fresh on 2.x
4. Don't force-update — players hate that

Some mods maintain BOTH branches. Players pick the version that matches their save.

## Related

- [Architectural overview: Save migration](/overviews/save-migration/) — the engine mechanism
- [Variable](/lang/md-framework/variable/) — variable persistence rules
- [Cue](/lang/md-framework/cue/) — version= attribute
- [Mod compatibility](/wiki/mod-compatibility/) — broader compatibility
- [Workflow](/wiki/workflow/) — iteration testing

---

*The X4 community values stable mods. A mod with version-1-through-version-10 save compatibility is a mod that retains its players. The discipline pays for itself many times over.*

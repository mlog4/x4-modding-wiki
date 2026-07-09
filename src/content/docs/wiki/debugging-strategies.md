---
title: Debugging strategies
description: When your mod doesn't behave as expected — systematic approaches to finding what's wrong. Read debug.log, isolate variables, A/B test against vanilla.
---

Your mod's not working. Maybe it does nothing. Maybe it does something unexpected. Maybe vanilla NPCs are misbehaving. This page is the **systematic debugging guide** for X4 mods.

## The diagnosis ladder

```
   1. Is your mod loading?
            ↓
   2. Are your cues firing?
            ↓
   3. Are your actions executing?
            ↓
   4. Are entity writes succeeding?
            ↓
   5. Is the game-state changing as expected?
```

Walk down the ladder. Most "my mod doesn't work" is stuck at step 1, 2, or 4.

## Step 1: Is your mod loading?

### Check content.xml is valid

Open `<your_extension>/content.xml`. Verify:

- `<content id="...">` matches your folder name OR ws_<workshop_id>
- `<dependency id="...">` references match installed dependencies (case-sensitive)
- Valid XML — no malformed tags

If content.xml has a parse error, the entire extension fails to load silently.

### Check debug.log for load errors

```
debug.log → look for:
  Loading extension <your_mod_id>
  Failed to load extension <your_mod_id>
```

If the load line is absent, the engine doesn't see your extension. Verify:
- The extensions folder path (Steam path, NOT OneDrive)
- The folder is at `extensions/<mod_id>/`, NOT `extensions/<mod_id>/<mod_id>/`

### Check MD scripts load

```
debug.log → look for:
  Loading MD script: <your_script>.xml
  Failed to load MD script: <your_script>.xml — <error>
```

XML errors load-time abort the entire script. Common causes:
- `<` or `&` in attribute string (use `&lt;` / `&amp;`)
- Apostrophe escaping in strings (`'Duke''s'` often breaks)
- Mismatched tags or unclosed strings

If a single script fails, ALL of its cues are missing. Other mods that depend on those cues fail with cascading errors.

## Step 2: Are your cues firing?

Add a debug line at the top of your cue's actions:

```xml
<cue name="MyCue" instantiate="true">
    <conditions>...</conditions>
    <actions>
        <debug_text text="'MyCue fired: ' + event.name + ' ' + event.object"/>
        <!-- ... your real actions ... -->
    </actions>
</cue>
```

Then trigger the event and grep debug.log:

```bash
grep "MyCue fired" debug.log
```

### If the cue isn't firing

Check:

- **Conditions match** — does the event actually fire? Use a broader event (e.g. `event_cue_completed cue="md.GameStart"`) first to verify the cue activates at all.
- **`instantiate=` correct** — if you need repeated firing, `instantiate="true"` is required.
- **Filter attributes** — `event_object_destroyed group="$X"` requires `$X` to exist. If `$X` is empty/null, the listener won't fire.
- **Nested cue rules** — `event_X group=$Y` watchers MUST be nested inside the group-creating cue.

### If the cue fires too much / too rarely

- **Conditions too broad / narrow** — add `check_value` filters
- **Race conditions** — multiple events firing in the same frame; use Bridge + Worker pattern
- **State leaks** — `$busy` flag not being cleared

## Step 3: Are your actions executing?

Add debug lines BETWEEN actions:

```xml
<actions>
    <debug_text text="'Before find_ship'"/>
    <find_ship_by_true_owner ... />
    <debug_text text="'After find_ship: ' + $Ships.count"/>

    <do_for_each name="$ship" in="$Ships">
        <debug_text text="'Iterating: ' + $ship.knownname"/>
        <!-- ... -->
    </do_for_each>
</actions>
```

If "Before" appears but "After" doesn't, an action between them errored silently or aborted.

### Common silent-action-failures

| Action | Common cause |
|---|---|
| `find_*` returns 0 results | `space=` missing or wrong scope |
| `add_inventory` no effect | `instantiate=true` (use Bridge+Worker) OR string ware= instead of `ware.X` |
| `add_cargo` no effect | Wrong storage type (cargo vs inventory vs ammo) |
| `transfer_money` no effect | `amount=` is bare integer instead of `(N)Cr` |
| `set_owner` ship vanishes | Use library, not bare action |
| `signal_cue param=$x` param null | Use `signal_cue_instantly`, not `signal_cue` |

## Step 4: Are entity writes succeeding?

After an entity write, read back to verify:

```xml
<add_inventory ware="ware.inv_X" exact="5" entity="$npc"/>
<debug_text text="'NPC now has: '
    + $npc.inventory.{ware.inv_X}.amount
    + ' inv_X'"/>
```

If the count didn't change, the write was dropped. Most common cause: `instantiate="true"` parent cue. See [Bridge + Worker](/wiki/bridge-worker/).

## Step 5: Is the game-state changing?

If your actions execute but the player doesn't see the effect:

- **UI not refreshed** — some changes need a UI refresh event to display
- **Wrong object** — you modified the wrong target (e.g. macro template vs instance)
- **Cached state** — vanilla cached the old state; force re-read with `<set_value name="$X" exact="$X"/>` style refresh

## A/B testing against vanilla

The most powerful debug technique: compare YOUR debug.log to VANILLA's debug.log.

1. Save the game state where your mod misbehaves
2. Load the save WITH your mod → capture debug.log
3. Disable your mod (remove from extensions/ or via UI)
4. Load the same save WITHOUT → capture debug.log
5. Diff the two logs

What's different is your mod's footprint. Look for:
- New errors that appear only with your mod loaded
- Errors that DISAPPEAR with your mod (you're causing or revealing a bug)
- Different cue execution order

This isolates "is this my bug or vanilla's bug" decisively.

## Debug-log filter tricks

### Tag your output

```xml
<debug_text text="'[mlog_X] Loading state'" filter="$verbose"/>
```

Then grep:

```bash
grep "\[mlog_X\]" debug.log
```

### Filter by mod

Set `$verbose` from a per-mod options entry. Players disable verbose for clean logs; you enable it for debugging.

### Filter by event type

```xml
<debug_text text="'attack: '..."
    filter="combat_verbose"/>
```

Then filter:

```bash
grep "filter=combat_verbose" debug.log
```

## Common newbie traps

### "My change isn't appearing"

- You edited the source but didn't deploy to extensions/
- You deployed but the game is still running with the old version (need to restart OR reload script)
- You're testing against an old save where state is locked in

### "Vanilla doesn't work anymore"

- Your mod broke something — A/B test against vanilla-only
- DLC may have changed; check DLC version
- A new vanilla update may have changed APIs

### "Random errors I don't recognise"

- Look at the FULL stack trace, not just the top line
- Search the error string verbatim — vanilla has many shared error messages
- Check OTHER scripts' debug.log entries — sometimes errors are misattributed

## When to stop

If you've spent 5 attempts without progress, **stop and produce an escalation report**:

- What you tried
- What you expected
- What actually happened
- Debug.log excerpts

Step back. Ask for help. Look at the problem from a different angle. Often the bug is in a completely different file than you've been searching.

## Related

- [Workflow](/wiki/workflow/) — deploy paths, debug.log location
- [Bridge + Worker](/wiki/bridge-worker/) — silent entity-write drops
- [Cue](/lang/md-framework/cue/) — common cue gotchas
- [Expression](/lang/md-framework/expression/) — parse-time and runtime expression errors

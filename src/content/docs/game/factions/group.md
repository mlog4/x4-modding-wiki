---
title: Group
description: A runtime collection of components — used by event listeners (group= attribute) and the group=$X create/destroy lifecycle.
---

A **Group** is a runtime collection of components — used by `event_*` listeners (`group=$X`) and by `create_*` / `destroy_*` actions that operate on multiple components at once. Groups are how vanilla MD tracks "the cohort of objects I care about" without polling.

**Inheritance:** None — `group` is a builtin collection-like datatype.

## Properties

| Property | Type | Description |
|---|---|---|
| `.count` | int | Number of components in the group |
| `.list` | list | All components in the group |
| `.{numeric}` | component | The N-th component (1-based) |
| `.random` | component | Random member (group must be non-empty) |
| `.indexof.{component}` | int | 1-based index of component, or 0 if not present |

## Group lifecycle

Groups are created with `create_group` or implicitly via `groupname="$X"` on `create_*` actions. They are destroyed when:

- Explicitly via `destroy_group`
- When the owning cue is reset / cleaned up
- When all members are destroyed

## Common patterns

### "Create a group and watch member destruction"

Vanilla pattern (canonical setup-cue + worker):

```xml
<cue name="SetupGroup" instantiate="false">
    <conditions>
        <event_cue_completed cue="md.GameStart"/>
    </conditions>
    <actions>
        <create_group groupname="global.$MyTracked"/>
    </actions>

    <cues>
        <cue name="WatchDestroys" instantiate="true">
            <conditions>
                <event_object_destroyed group="global.$MyTracked"/>
            </conditions>
            <actions>
                <write_to_logbook
                    text="event.object.knownname + ' destroyed'"/>
            </actions>
        </cue>
    </cues>
</cue>
```

The `event_object_destroyed group="$X"` watcher MUST be nested inside the setup cue (vanilla [setup.xml:41 / 591](https://example.com)). Top-level group=$X listeners don't work.

### "Add and remove from group"

```xml
<add_to_group group="$MyTracked" exact="$NewShip"/>
<remove_from_group group="$MyTracked" exact="$OldShip"/>
```

### "Check membership"

```xml
<do_if value="$MyTracked.indexof.{$Ship} gt 0">
    <!-- ship is in the group -->
</do_if>
```

`.indexof` returns 1-based position; 0 means not present.

## Common gotchas

- ⚠ **`event_X group=$Y` watcher cue MUST be NESTED inside the setup cue.** Top-level group filters silently never fire. This is a vanilla rule; see [setup.xml:41/591] pattern.
- ⚠ **`global.$X` namespace alone is NOT enough.** Even with global scope, the watcher must be a child of the setup cue. The nesting + global access combo is what works.
- ⚠ **`.indexof` returns 1-based, NOT bool.** Returns position (1, 2, 3, ...) or 0 if not present. `gt 0` is the membership check.
- ⚠ **Groups don't auto-prune destroyed members.** If a ship in the group is destroyed, the group still references it (until the dead-ref is cleaned). Iterate `.list` and null-check.
- ⚠ **Use `groupname=` (not `group=`) when creating.** `create_ship groupname="$X"` adds to group; `group="$X"` doesn't exist as a create attribute.

## Related

- All `event_*` actions with `group=` filter — boarding, destroyed, attacked, changed_owner, etc.
- `create_ship` / `create_object` — `groupname=` attribute.
- [MD Framework Cue](/lang/md-framework/cue/) — group-watching cues.

---

:::tip[Pattern — collection with event integration]
Group is the bridge between collection semantics and the event system. Use group= filters on events to react to "any of these" rather than registering N individual listeners.
:::

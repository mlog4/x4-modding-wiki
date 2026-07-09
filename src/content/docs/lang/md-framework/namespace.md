---
title: Namespace
description: The namespace= attribute on cues. Anchors variable scope for child cues, enabling clean state sharing within a cue tree.
---

A **Namespace** is the cue that anchors *variable scope* for its children. Set with `namespace="this"` on a parent cue, it makes the parent's variables accessible via `namespace.$X` from any descendant. Namespaces are MD's mechanism for **sharing state inside a cue tree** without resorting to globals.

If you come from OOP, think of a namespace cue as the *class instance* that holds shared state for its methods (child cues).

## Default scope

Without an explicit `namespace=` attribute, child cues' `namespace.$X` references walk up to the **script-level namespace** (the MD script root). Most variables in vanilla don't use explicit namespaces — they live at the script level or within their cue.

## Explicit namespace anchor

```xml
<cue name="Parent" namespace="this">
    <actions>
        <set_value name="this.$shared" exact="42"/>
    </actions>

    <cues>
        <cue name="Child">
            <actions>
                <!-- Reads Parent's $shared -->
                <write_to_logbook
                    text="'shared=' + namespace.$shared"/>
            </actions>
        </cue>
    </cues>
</cue>
```

`namespace="this"` makes the parent cue the namespace anchor. Inside any descendant, `namespace.$X` looks up to this cue's variable set.

## When to use a namespace

### Sharing state between sibling cues

```xml
<cue name="Setup" namespace="this">
    <actions>
        <create_list name="this.$tracked"/>
    </actions>

    <cues>
        <!-- Producer: adds entries -->
        <cue name="Producer" instantiate="true">
            <conditions>
                <event_object_destroyed group="$X"/>
            </conditions>
            <actions>
                <append_to_list
                    name="namespace.$tracked"
                    exact="event.object"/>
            </actions>
        </cue>

        <!-- Consumer: reads entries -->
        <cue name="Consumer" instantiate="false">
            <delay exact="60s"/>
            <actions>
                <write_to_logbook
                    text="'Tracked count: '
                        + namespace.$tracked.count"/>
                <reset_cue cue="this"/>
            </actions>
        </cue>
    </cues>
</cue>
```

Both children operate on `namespace.$tracked` — Parent's list. No globals needed.

### Carving out a "context" for a feature

A mod feature lives in a single parent cue. The parent's `namespace="this"` makes all its variables addressable from the children — clean separation.

```xml
<cue name="HeroSystem" namespace="this">
    <actions>
        <set_value name="this.$heroes" exact="table[]"/>
        <set_value name="this.$money" exact="0Cr"/>
    </actions>

    <cues>
        <cue name="AddHero" .../>
        <cue name="ApplyMoney" .../>
        <cue name="DebugDump" .../>
    </cues>
</cue>
```

Every child sees `namespace.$heroes` and `namespace.$money`. The HeroSystem is self-contained.

## Scope vs visibility

`namespace` controls **read visibility** for the `namespace.$X` syntax. It doesn't:
- Affect the parent's own variable storage (those still live on the parent cue regardless)
- Make variables auto-shared (each cue still owns its own `$variables` by default)
- Change the script-level vs cue-level layering

The simplest way to think of `namespace`: it's a **named pointer for "where to look up variables"** from descendants.

## Namespace vs global

| Concern | Namespace | Global |
|---|---|---|
| Reach | Within a cue tree | Everywhere |
| Collision risk | Low (scoped) | High (must use `mlog_` prefix) |
| Lifetime | Parent cue's lifetime | Game lifetime |
| Discoverability | Tree-local | Implicit (must search the script) |
| Use for | Feature-local shared state | Top-level singleton state |

**Rule of thumb:** prefer namespace over global when the state belongs to a single feature. Reserve global for truly script-wide singletons.

## Common gotchas

- ⚠ **`namespace="this"` only affects DESCENDANT cues' `namespace.$X` syntax.** The parent's own access pattern is unchanged — it still uses `this.$X` or `$X` for its own variables.
- ⚠ **Without `namespace=`, `namespace.$X` falls back to the script-level namespace.** This can silently work *or* silently fail depending on whether a script-level `$X` happens to exist. Always set `namespace="this"` explicitly when intent is to share with children.
- ⚠ **Namespace only affects variable lookups, not actions/events.** `signal_cue cue="namespace.X"` doesn't work — signals target cues by name (relative or absolute), not by namespace.
- ⚠ **`namespace.$X` skips intermediate cues.** Even if there's a closer parent with `$X`, the lookup walks to the *namespace anchor* (the cue with `namespace="this"`). Useful for non-locality, but can surprise.
- ⚠ **Library cues have their own namespace semantics.** A library called via `<run_actions ref=...>` runs in the *caller's* namespace context. Don't expect the library's `namespace.$X` to walk to the library — it walks to the caller's tree.
- ⚠ **Nested namespaces work but are uncommon.** A namespace cue can be nested inside another namespace cue. Each descendant gets the nearest ancestor with `namespace="this"`. Vanilla rarely does this; mods usually flat-en.

## Examples

### Example 1: Simple feature-local state

```xml
<cue name="MyFeature" namespace="this">
    <actions>
        <set_value name="this.$enabled" exact="true"/>
        <set_value name="this.$counter" exact="0"/>
    </actions>

    <cues>
        <cue name="Tick" instantiate="true">
            <conditions>
                <event_cue_completed cue="md.GameStart"/>
            </conditions>
            <actions>
                <do_if value="namespace.$enabled">
                    <set_value name="namespace.$counter"
                        operation="add" exact="1"/>
                </do_if>
            </actions>
        </cue>
    </cues>
</cue>
```

### Example 2: Cross-cue producer/consumer

```xml
<cue name="Queue" namespace="this">
    <actions>
        <create_list name="this.$items"/>
    </actions>

    <cues>
        <cue name="Add" instantiate="true">
            <conditions>
                <event_cue_signalled cue="this"/>
            </conditions>
            <actions>
                <append_to_list
                    name="namespace.$items"
                    exact="event.param"/>
            </actions>
        </cue>

        <cue name="Drain" instantiate="false">
            <delay exact="5s"/>
            <actions>
                <do_for_each name="$item"
                    in="namespace.$items">
                    <!-- process $item -->
                </do_for_each>

                <create_list name="namespace.$items"/>
                <reset_cue cue="this"/>
            </actions>
        </cue>
    </cues>
</cue>
```

Producer/consumer pattern with a shared list in the namespace cue.

### Example 3: When namespace would WRONGLY be skipped

```xml
<cue name="Outer" namespace="this">
    <actions>
        <set_value name="this.$mode" exact="'active'"/>
    </actions>

    <cues>
        <cue name="Inner">
            <actions>
                <!-- this.$mode is null here (Inner's local) -->
                <!-- namespace.$mode = 'active' (Outer's) -->
                <write_to_logbook
                    text="namespace.$mode"/>
            </actions>
        </cue>
    </cues>
</cue>
```

Reading `this.$mode` from Inner would look in Inner's own variables (probably null). `namespace.$mode` walks to Outer.

## Architectural context

- **Vanilla namespace usage.** Most vanilla scripts use namespaces sparingly — preferring script-level globals or per-cue locals. Mods that build large self-contained features benefit more from explicit namespaces.
- **No nesting depth limit.** Engine allows arbitrarily deep nesting; lookup is O(depth) but caching makes it cheap in practice.
- **Library compatibility.** Libraries don't enforce a namespace contract — caller's namespace is whatever it is. Library authors should rely on params + return values rather than namespace lookups.

## Related

- [Variable](/lang/md-framework/variable/) — what namespaces scope.
- [Cue](/lang/md-framework/cue/) — `namespace=` attribute lives on cues.
- [Library](/lang/md-framework/library/) — libraries inherit caller's namespace.
- [Expression](/lang/md-framework/expression/) — `namespace.$X` lookup syntax.

---

:::tip[Pattern — scope anchor for feature-local state]
Namespace is **MD's clean alternative to globals for in-tree state sharing**. Set `namespace="this"` on a parent cue → children read its state via `namespace.$X`. The mechanism is simple; the discipline is to actually use it instead of reaching for `global.$X` every time.
:::

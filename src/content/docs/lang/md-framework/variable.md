---
title: Variable
description: The $-prefixed mutable state of MD scripts. Cue-local by default, can be scoped to namespace / global / cross-script. Survives save/load.
---

A **Variable** in MD is a mutable named value, always `$`-prefixed (`$x`, `$count`, `$state`). Variables are the **persistent state of cues** — they survive across action blocks, across waits/delays, and across save/load. The `$`-prefix is mandatory; no `$` = no variable.

Variables are typed dynamically — assignment determines type (`integer`, `string`, `list`, `table`, `component ref`, etc.). MD does no type-checking at script-load; type mismatches surface as null propagation at runtime.

## Declaring and assigning

```xml
<set_value name="$x" exact="42"/>
<set_value name="$name" exact="'Argon'"/>
<set_value name="$ships" exact="[$ship1, $ship2]"/>
```

There is no separate "declare" — assignment creates the variable if it didn't exist. To explicitly remove:

```xml
<remove_value name="$x"/>
```

## Scopes

Variables live in a **scope** — a cue or namespace that owns them. The scope determines lifetime and visibility.

| Scope | Lifetime | Syntax |
|---|---|---|
| Cue-local | Cue's lifetime | `$x` (default) |
| Namespace (explicit) | Containing namespace cue | `namespace.$x` |
| Parent cue | Parent cue's lifetime | `parent.$x` |
| Static (template) | Template cue's lifetime | `static.$x` |
| Global | Game lifetime | `global.$x` |
| Cross-script | Game lifetime, externally exposed | `md.MyScript.$x` |
| Cross-script cue var | Specific cue var | `md.MyScript.MyCue.$x` |

### Default scope rules

By default, `$x` is **cue-local** — owned by the current cue's instance. A cue with `instantiate="true"` has independent `$variables` per instance.

To explicitly write to current cue: `this.$x` (same effect as `$x`, but explicit). Used for clarity in nested cue blocks.

### Namespace scope

`namespace="this"` on a cue makes that cue the *namespace cue* — child cues' `namespace.$X` references walk up to this cue's variable set.

```xml
<cue name="Parent" namespace="this">
    <actions>
        <set_value name="this.$shared" exact="42"/>
    </actions>

    <cues>
        <cue name="Child">
            <actions>
                <!-- Child sees Parent's $shared as namespace.$shared -->
                <write_to_logbook
                    text="namespace.$shared"/>
            </actions>
        </cue>
    </cues>
</cue>
```

This is the cleanest way to share state between siblings in a cue tree.

### Global scope

```xml
<set_value name="global.$MyFlag" exact="true"/>
```

`global.$X` persists across script reloads and save/load. Used for top-level state that doesn't belong to a specific cue. Avoid overusing — collisions across mods are common with generic names.

### Cross-script scope

```xml
<set_value name="md.MyScript.$MyState" exact="42"/>
```

Other scripts can read this. Use `mlog_` prefix convention to avoid collisions.

## Variable types

Variables hold any expression result:

| Type | Example value | Notes |
|---|---|---|
| Integer | `42` | Numeric |
| Float | `1.5f` | Suffix-typed |
| Money | `5000Cr` | Suffix-typed |
| Time | `30s` | Suffix-typed |
| Length | `5km` | Suffix-typed |
| Bool | `true` / `false` | Numeric under the hood |
| String | `'hello'` | Single-quote preferred |
| List | `[1, 2, 3]` | Ordered, 1-based access |
| Table | `table[$key = value]` | $-key-string mapped |
| Component ref | `$ship`, `$station` | Object reference |
| Faction ref | `faction.argon` | Db reference |
| Macro ref | `macro.ship_X` | Db reference |
| Null | (missing or unset) | Treated as absent |

The same variable can hold different types at different times — MD is dynamic. The engine infers behaviour from the actual value.

## Variable lifecycle

```
   Assignment via set_value
            ↓
   Variable exists in scope
            ↓
   Read via $X / .{$X}
            ↓
   ┌──────────────────┐
   │  Survives:        │
   │  - save/load      │
   │  - delays         │
   │  - action blocks  │
   │  - cue waits      │
   └──────────────────┘
            ↓
   Removal via remove_value
   OR cue ends / instance destroyed
```

The most important property: **variables survive save/load**. This makes them the canonical persistent state mechanism for mods. State you want to keep across game sessions: store in `$variables`.

## Common patterns

### "Counter"

```xml
<set_value name="$count" exact="0"/>

<do_for_each name="$ship" in="$Ships">
    <set_value name="$count"
        operation="add" exact="1"/>
</do_for_each>
```

`operation="add"` on first write would fail (variable doesn't exist yet) — always initialise with `exact=` before incrementing.

### "Flag with default"

```xml
<do_if value="not $isInitialised?">
    <set_value name="$isInitialised" exact="true"/>
    <!-- one-time init -->
</do_if>
```

`$X?` checks "exists?" — distinguishes uninitialised from `false`.

### "Cross-cue shared state via namespace"

```xml
<cue name="Setup" namespace="this">
    <actions>
        <create_list name="this.$tracked"/>
    </actions>

    <cues>
        <cue name="Add" instantiate="true">
            <conditions>
                <event_cue_signalled cue="this"/>
            </conditions>
            <actions>
                <append_to_list
                    name="namespace.$tracked"
                    exact="event.param"/>
            </actions>
        </cue>
    </cues>
</cue>
```

The child writes to the parent's namespace — both cues read the same list.

### "Reset between runs"

For per-run-instance state in an instantiated cue:

```xml
<cue name="Worker" instantiate="true">
    <actions>
        <!-- this.$X is per-instance — fresh each time -->
        <set_value name="this.$progress" exact="0"/>
    </actions>
</cue>
```

For cross-instance shared state, use `static.$X`:

```xml
<set_value name="static.$totalRuns"
    operation="add" exact="1"/>
```

`static.$X` walks up to the template — survives across instances.

## Common gotchas

- ⚠ **`$`-prefix is MANDATORY.** `x = 42` is not a variable; `$x = 42` is. The XML attribute parser doesn't enforce this — incorrectly-prefixed names just silently don't work.
- ⚠ **First write must be `exact=`, not `operation=add`.** `operation="add"` reads the current value to add to. If the variable doesn't exist, it fails (or fails silently with 0). Always init via `exact=` first.
- ⚠ **Variables are dynamically typed.** A variable holding a list and then assigned a string is now a string. No type errors at script load; runtime null propagation reveals the mistake.
- ⚠ **Component refs go stale.** A variable holding `$ship` doesn't auto-update when the ship is destroyed. Read `@$ship` to null-safely check. After destruction, the ref becomes invalid; `@$ship` returns null.
- ⚠ **Global variables collide across mods.** Use `mlog_` prefix or `global.$mlog_X` to avoid conflicts. Naming like `global.$count` is a recipe for cross-mod chaos.
- ⚠ **Table keys MUST be `$`-prefixed strings.** `table[key = 1]` silently fails. Must be `table[$key = 1]`.
- ⚠ **`if @$X then $X else def` drops zero / false / empty list.** Returns `def` when X is 0/false/empty, not just null. Use `$X?` to distinguish exists-vs-truthy. (See [Expression](/lang/md-framework/expression/) gotchas.)
- ⚠ **`namespace.$X` requires `namespace="this"` on the namespace cue.** Without it, `namespace.$X` references the script-level namespace (often unintended).
- ⚠ **Save migration via `version=`.** New cue version triggers re-init of static variables in some scenarios. For breaking variable structure changes, bump `version=`.
- ⚠ **Variable names are case-sensitive.** `$myVar` ≠ `$myvar`. Convention: camelCase or snake_case, consistent within a mod.

## Examples

### Example 1: Heartbeat with counter

```xml
<cue name="Heartbeat" instantiate="false">
    <conditions>
        <event_cue_completed cue="md.GameStart"/>
    </conditions>
    <actions>
        <set_value name="static.$ticks" exact="0"/>
    </actions>

    <cues>
        <cue name="Tick" instantiate="false">
            <delay exact="60s"/>
            <actions>
                <set_value name="static.$ticks"
                    operation="add" exact="1"/>
                <write_to_logbook
                    text="'Tick #' + static.$ticks"/>
                <reset_cue cue="this"/>
            </actions>
        </cue>
    </cues>
</cue>
```

`static.$ticks` lives on the parent template — accessible from the looping child.

### Example 2: Tracked-objects table

```xml
<actions>
    <set_value name="$tracked"
        exact="table[]"/>

    <do_for_each name="$ship" in="$Ships">
        <set_value name="$tracked.{'$' + $ship.knownname}"
            exact="$ship"/>
    </do_for_each>

    <write_to_logbook
        text="'Tracking ' + $tracked.keys.count
            + ' ships'"/>
</actions>
```

Table with dynamic `$`-prefixed keys.

### Example 3: Cross-script communication

```xml
<!-- Producer script -->
<set_value name="md.mlog_my_mod.$exportedState"
    exact="table[$count = 42, $name = 'Foo']"/>

<!-- Consumer script (separate file) -->
<do_if value="@md.mlog_my_mod.$exportedState
    and md.mlog_my_mod.$exportedState.$count gt 0">
    <write_to_logbook
        text="md.mlog_my_mod.$exportedState.$name"/>
</do_if>
```

Cross-script via `md.scriptname.$varname`. Always null-check with `@`.

## Architectural context

- **Variables survive save/load.** This is the persistent-state contract; the engine serialises all `$variables` along with cue state.
- **No script overhead for variable access.** Engine-optimised hash lookup. Don't bother caching reads.
- **`global.$X` is implicitly an MD-level variable.** Vanilla treats `global.$X` and `md.<currentscript>.$X` as similar — slight scope difference. Convention is `global.$X` for "anyone can access".

## Related

- [Cue](/lang/md-framework/cue/) — the default scope for `$variables`.
- [Expression](/lang/md-framework/expression/) — `$X` lookups inside `value="..."`.
- [Action](/lang/md-framework/action/) — `set_value`, `remove_value`, list/table ops.
- [Namespace](/lang/md-framework/namespace/) — explicit scope mechanism.

---

:::tip[Pattern — $-prefixed mutable state with save/load persistence]
Variable is **MD's persistence primitive**. Anything you want to keep across saves goes in `$variables`. The dynamic type system means you can store anything (lists, tables, refs, primitives) under the same name — but discipline + `mlog_` naming + null-safety + explicit scoping (`this` / `namespace` / `global`) makes large mods maintainable.
:::

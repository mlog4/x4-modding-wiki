---
title: Expression
description: The value="..." syntax in MD — operators, property chains, list/table literals, null-safety. The mini-language inside XML attributes.
---

An **Expression** is the syntax used inside `value="..."`, `exact="..."`, `check="..."`, and similar attributes throughout MD. Expressions are a mini-language inside XML attribute strings — arithmetic, comparison, property lookup, literals, null-handling.

If you come from JavaScript or Python, expressions look familiar (`+`, `-`, `*`, `/`, `==`, `gt`, `and`, `or`) but with MD-specific quirks (suffixes for typed numbers, `@` for null-safe read, `?` for existence).

## Basic syntax

| Form | Example | Meaning |
|---|---|---|
| Number literal | `42`, `3.14`, `-7` | Plain integer / float |
| Number with suffix | `10km`, `5min`, `2000Cr`, `0.5f` | Typed number (length / time / money / float) |
| String literal | `'hello'`, `"world"` | String (single or double quotes) |
| Variable | `$x`, `$count` | Cue-local variable |
| Property chain | `$ship.sector.knownname` | Object property |
| Index lookup | `$list.{1}`, `$tbl.$key` | Indexed access |
| Function-like lookup | `$F.relationto.{faction.argon}` | Property-with-argument |

## Operators

### Arithmetic

| Op | Example | Notes |
|---|---|---|
| `+` | `$a + $b` | Add (also string concat) |
| `-` | `$a - $b` | Subtract |
| `*` | `$a * $b` | Multiply |
| `/` | `$a / $b` | Divide |
| `%` | `$a % $b` | Modulo |

### Comparison

| Op | Notes |
|---|---|
| `==` | Equal |
| `!=` | Not equal |
| `gt` | Greater than (MD uses keywords, NOT `>`) |
| `ge` | Greater than or equal |
| `lt` | Less than |
| `le` | Less than or equal |

**Important:** MD comparison uses **keywords** (`gt`, `lt`, etc.), NOT mathematical symbols. `$x > 5` is invalid; `$x gt 5` is correct. This is to avoid XML attribute parsing conflicts.

### Logical

| Op | Notes |
|---|---|
| `and` | Logical AND |
| `or` | Logical OR |
| `not` | Logical NOT |

### Conditional

```xml
value="if $x gt 0 then 'positive'
       else if $x lt 0 then 'negative'
       else 'zero'"
```

`if ... then ... else ...` is an inline ternary-like operator. Can chain via `else if`.

## Property access

### Direct property

```xml
value="$ship.macro"
value="$ship.macro.knownname"
```

Property chains evaluate left-to-right. Each `.X` resolves on the previous value.

### Indexed (dynamic) lookup with `{ }`

```xml
value="$list.{1}"                <!-- first element (1-based) -->
value="$list.{$index}"           <!-- via variable -->
value="$faction.relationto.{$other}" <!-- argument-style -->
```

The `.{ }` syntax means "look this up dynamically". Inside the braces is an expression.

### Static (literal) lookup

```xml
value="$ship.isclass.ship_m"            <!-- shortcut -->
value="$ship.isclass.{class.ship_m}"    <!-- explicit -->
```

Some properties have a `<shortcut>` form (no braces) when the argument is a known enum. Equivalent to `.{enumref}`.

## Variable scopes

| Form | What it accesses |
|---|---|
| `$x` | Current cue's local variable |
| `this.$x` | Current cue's variable (explicit) |
| `parent.$x` | Parent cue's variable |
| `static.$x` | The template cue's variable (if instance) |
| `namespace.$x` | Variable in the namespace cue |
| `global.$x` | Globally-scoped variable |
| `md.MyScript.$x` | Another script's exposed var |
| `md.MyScript.MyCue.$x` | Specific cue's var |

`global.$x` and `md.X.Y.$z` cross script boundaries. Most code uses `$x` (local) or `this.$x` (explicit).

## Literals

### Lists

```xml
value="[1, 2, 3]"
value="[ware.energycells, ware.silicon]"
value="[$x, $y, $z]"
```

Square brackets, comma-separated.

### Tables (string-keyed dictionaries)

```xml
value="table[
    $name = 'Argon',
    $age = 42,
    $items = [1, 2, 3]
]"
```

**Critical:** Table keys MUST be `$`-prefixed strings. `table[$key = value]` works; `table[key = value]` silently fails.

### Position / vector

```xml
value="position.[10km, 0, 5km]"
value="[$pos.x, $pos.y + 5km, $pos.z]"
```

`position.[x, y, z]` creates a position; bare `[x, y, z]` creates a list.

## Null-safety

```xml
value="@$x"             <!-- null-safe read -->
value="@$ship.sector"   <!-- null if anything in chain is null -->
```

`@` returns null instead of erroring when a chain step is null. Use this for any chain that may hit a null link.

```xml
value="$x?"             <!-- exists check (returns boolean) -->
```

`?` checks "does this variable exist". Different from `@$x` — `$x?` returns true/false, `@$x` returns the value or null.

### Critical idioms

```xml
<!-- Safe value with default -->
value="if @$x then $x else 0"

<!-- Safe comparison -->
value="@$ship.maxspeed gt 0"
```

## Typed number suffixes

| Suffix | Type | Example |
|---|---|---|
| `f` | Float | `0.5f`, `1.0f` |
| `m` | Length (meters) | `100m`, `2.5km` |
| `km` | Length (kilometers) | `10km` |
| `s` | Time (seconds) | `30s`, `2min` |
| `min` | Time (minutes) | `5min` |
| `h` | Time (hours) | `1h` |
| `rad` | Angle | `0.5rad` |
| `Cr` | Money | `5000Cr` |
| `i` | Integer (explicit) | `100i` |
| `L` | Large integer | `1000000L` |
| `F` | Large float | `1.5F` |
| `hp` | Hitpoints | `5000hp` |

Suffixes prevent type ambiguity. Vanilla math often uses `0.5f` to force float division: `$a / $b` (int / int = int truncation) vs `$a / $b * 1.0f` (float).

## Common patterns

### "Existence-checked property access"

```xml
<do_if value="@$ship.sector
    and @$ship.sector.owner">
    <!-- safe: both .sector and .sector.owner exist -->
</do_if>
```

### "Default with fallback"

```xml
value="if @$WorkforceBonus
       then $WorkforceBonus
       else 1.0f"
```

**Gotcha:** `if @$X then $X else def` returns `def` when X is null OR 0 OR false OR empty. Use `$X?` to distinguish "exists" from "truthy":

```xml
value="if $WorkforceBonus?
       then $WorkforceBonus
       else 1.0f"
```

### "Math with explicit float to avoid int truncation"

```xml
value="($Stations_Friend.count + 1)
    / ($Stations_Enemy.count + 1)f"
```

The `f` suffix on the divisor forces float division. Vanilla `lib_generic.xml:4724`.

### "Multi-class isclass check"

```xml
value="$Object.isclass.[class.lockbox,
    class.collectablewares, class.crate]"
```

The `isclass.[list]` form returns true if the object matches ANY class in the list. Vanilla `gm_bringitems.xml:391`.

## Common gotchas

- ⚠ **`@$X.$Y?` combo is a PARSE ERROR.** Trying to combine `@` (null-safe read) and `?` (exists check) fails at parse and kills the entire MD file. Use `@$X.$Y == false` instead for null-safe value compare. (Memory: `x4_md_at_question_combo_invalid`.)
- ⚠ **`if @$X then $X else def` drops zero.** Returns `def` for X=0/false/empty list, not just null. For counters/flags that could legitimately be 0, use `$X?` (true/false existence) instead.
- ⚠ **Boolean stringifies as int.** `'flag=' + $bool` emits `flag=1`/`flag=0`, NOT `flag=true`/`flag=false`. Log parsers must handle int form.
- ⚠ **Int32 overflow in chained multiplication.** `pct × count × price` wraps to negative when intermediate exceeds 2^31. Pre-divide: `(pct × price) / 100` first, then `× count`.
- ⚠ **String literals: prefer `'X'` over `"X"`.** Double quotes inside attribute strings need `&quot;` escaping; single quotes work cleanly. Don't double-quote-embed.
- ⚠ **Apostrophes in strings are fragile.** `'Duke''s'` doubled-quote escape often breaks parse with `']' expected`. Avoid contractions/possessives — use "Duke's faction" → "Duke faction" or "Flagship of Duke" patterns.
- ⚠ **`<` inside attribute string kills the WHOLE MD file via LIBXML2.** `'foo_<_50'` in `debug_text` attribute → LIBXML2 error → entire script unloaded → cascading `Property lookup failed` errors from OTHER scripts. Symptom looks unrelated. Use `&lt;` or rephrase.
- ⚠ **Table keys must be `$`-prefixed.** `$tbl.{'key'}` silently fails. Must be `$tbl.{'$key'}` or `$tbl.$key`.
- ⚠ **Comparison uses keywords, not symbols.** `$x > 5` is INVALID. Use `$x gt 5`. Reason: avoid XML attribute parser conflicts.
- ⚠ **`==` for equality, NOT `=`.** Single `=` is assignment in some contexts (table literals) but never comparison.
- ⚠ **`.{X}` vs `.X` matter.** `.{class.ship_m}` is the explicit dynamic form; `.ship_m` is the shortcut. Some properties only accept one form.

## Examples

### Example 1: Distance check between two ships

```xml
<do_if value="@$ship1
    and @$ship2
    and $ship1.distanceto.{$ship2} lt 5km">
    <write_to_logbook
        text="$ship1.knownname + ' near '
            + $ship2.knownname"/>
</do_if>
```

### Example 2: Compute weighted average

```xml
<set_value name="$weighted"
    exact="($a * $aWeight + $b * $bWeight)
        / ($aWeight + $bWeight)f"/>
```

`f` suffix on divisor → float division.

### Example 3: Build a table of results

```xml
<set_value name="$result"
    exact="table[
        $count = $stations.count,
        $worst = if @$stations.{1}
                 then $stations.{1}
                 else null,
        $factions = [faction.argon, faction.teladi]
    ]"/>

<do_if value="$result.$count gt 0">
    <write_to_logbook
        text="'First station: '
            + $result.$worst.knownname"/>
</do_if>
```

Table with `$`-keys; access via `$result.$count` (dot-prefixed key) or `$result.{'$count'}` (explicit).

## Architectural context

- **Expression evaluation is engine-side.** No script overhead for math/lookups. Optimisation happens at the engine level.
- **Type system is dynamic.** Numbers can become strings via `+`; lists / tables are runtime values. Most type errors surface as `null` propagation rather than crashes.
- **Parser is strict.** Invalid expressions fail at script LOAD time (XML parse error). Most expression bugs are caught early.

## Related

- [Action](/lang/md-framework/action/) — actions use expressions in attributes.
- [Condition](/lang/md-framework/condition/) — `check_value="..."` is an expression.
- [Variable](/lang/md-framework/variable/) — `$x` is a variable.
- [Cue](/lang/md-framework/cue/) — expressions evaluate in cue scope.

---

:::tip[Pattern — mini-language inside XML attributes]
Expression is **MD's embedded language** — a small, type-safe, side-effect-free sub-language for value computation. Stricter than JavaScript (keywords for comparison, suffixes for typed numbers), more permissive than typed languages (dynamic dispatch on properties). The `@` (null-safe) and `?` (exists) operators are what separate clean MD from crash-prone MD.
:::

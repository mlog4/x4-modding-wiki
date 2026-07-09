---
title: Library
description: A reusable cue-with-parameters. Called via run_actions ref="..." from other cues. The MD framework's function-with-return-value mechanism.
---

A **Library** is a reusable cue-with-parameters — MD's mechanism for *shared code*. Other cues call a library via `<run_actions ref="md.X.Y">` with parameters; the library executes its actions block and optionally returns a value.

Vanilla `md/lib_generic.xml` has **80+ libraries** that mods can call. Most are called as `md.LIB_Generic.X` — see [Sector → Libraries](/game/world/sector/#libraries), [Faction → Libraries](/game/factions/faction/#libraries), etc.

**Relationship to Cue:** A library IS a cue with a specific `purpose=` attribute. All the [Cue](/lang/md-framework/cue/) lifecycle still applies, but execution semantics differ.

## XML structure

```xml
<library name="MyLibrary" purpose="run_actions">
    <params>
        <param name="Input"/>
        <param name="Multiplier" default="1.0"/>
    </params>

    <actions>
        <set_value name="$Result"
            exact="$Input * $Multiplier"/>
        <return value="$Result"/>
    </actions>
</library>
```

Callers reach this library via:

```xml
<run_actions ref="md.MyScript.MyLibrary" result="$out">
    <param name="Input" value="42"/>
    <param name="Multiplier" value="2.0"/>
</run_actions>
```

`$out` now holds 84.

### Library attributes

| Attribute | Purpose |
|---|---|
| `name="X"` | Library identifier within its parent |
| `purpose="run_actions"` | Inline execution — actions run in caller's scope |
| `purpose="cue_ref"` | Cue-instantiation — library produces a runtime cue |
| `comment="X"` | Documentation comment (preserved in source) |
| `namespace="X"` | Variable namespace override |
| `version="N"` | Version for save migration |

### purpose= semantics

| purpose | Behaviour | When to use |
|---|---|---|
| `run_actions` | Caller's `<run_actions ref="..."/>` executes the library's actions block inline. Variables are local to the call. Can `<return value="..."/>` to caller's `result="..."`. | Most utility libraries — math, lookups, list operations |
| `cue_ref` | Caller's `<cue ref="...">` creates a NEW cue instance from the library template. Library's lifecycle (conditions, delay, actions) runs independently. | Spawning fire-and-forget cues — vanilla `CreateFleetAtExitGate` |

## Library placement (critical!)

Libraries MUST be placed **inside `<cues>` as siblings of `<cue>`**:

```xml
<mdscript name="MyScript">
    <cues>                              <!-- inside <cues> -->
        <library name="MyLib" ...>      <!-- sibling of <cue> -->
            ...
        </library>

        <cue name="Caller" ...>         <!-- normal cue -->
            ...
        </cue>
    </cues>
</mdscript>
```

**Common mistake:** placing libraries between `<mdscript>` and `<cues>`:

```xml
<mdscript name="MyScript">
    <library name="MyLib" ...>          <!-- WRONG -- top-level -->
        ...
    </library>
    <cues>
        ...
    </cues>
</mdscript>
```

A top-level library is silently broken — `run_actions ref="md.MyScript.MyLib"` returns empty. **From memory: this was a real production bug** (`mlog638` fix).

## Return values

```xml
<library name="ComputeValue" purpose="run_actions">
    <params>
        <param name="Input"/>
    </params>
    <actions>
        <set_value name="$Local" exact="$Input * 2"/>
        <return value="$Local"/>
    </actions>
</library>
```

Caller:

```xml
<run_actions ref="md.MyScript.ComputeValue" result="$out">
    <param name="Input" value="21"/>
</run_actions>
<!-- $out == 42 -->
```

`<return value="..."/>` ONLY works inside libraries (not in regular cue actions). Trying it elsewhere errors with `Script node 'return' is not allowed in this context`.

### Multi-value return via table

```xml
<library name="LookupShip" purpose="run_actions">
    <params>
        <param name="Faction"/>
    </params>
    <actions>
        <find_ship_by_true_owner name="$ship"
            space="player.galaxy"
            faction="$Faction"/>

        <return value="table[
            $ship = $ship,
            $found = @$ship
        ]"/>
    </actions>
</library>
```

Caller:

```xml
<run_actions ref="md.MyScript.LookupShip" result="$result">
    <param name="Faction" value="faction.argon"/>
</run_actions>

<do_if value="$result.$found">
    <write_to_logbook text="$result.$ship.knownname"/>
</do_if>
```

This is the canonical pattern for "return multiple things". Compare to **by-reference table** which does NOT work — see Common gotchas.

## Common patterns

### "Find nearest of X for faction Y" (vanilla `FindNearestStationForFaction`)

```xml
<library name="FindNearestStationForFaction"
    purpose="run_actions">
    <params>
        <param name="Faction"/>
        <param name="Position"/>
        <param name="Sector" default="null"/>
    </params>
    <actions>
        <find_station_by_true_owner name="$Stations"
            space="if @$Sector then $Sector else player.galaxy"
            faction="$Faction"
            multiple="true"
            sortbydistanceto="$Position"/>

        <do_if value="$Stations.count gt 0">
            <return value="$Stations.{1}"/>
        </do_if>
        <return value="null"/>
    </actions>
</library>
```

Pattern from vanilla `lib_generic.xml:1240`.

### "Side-effect library" — place mines/satellites

```xml
<run_actions ref="md.LIB_Generic.PlaceMinefield">
    <param name="SelectedTarget" value="$AmbushZone"/>
    <param name="MinSpawn" value="10"/>
    <param name="MaxSpawn" value="20"/>
    <param name="ExplosiveOwner" value="faction.player"/>
    <param name="MaxDistance" value="8km"/>
</run_actions>
```

The library mutates world state directly; no return value needed. Vanilla `lib_generic.xml:582`.

### "Cue-ref library" — spawn a long-lived cue

```xml
<cue ref="md.LIB_Generic.CreateFleetAtExitGate">
    <param name="Gate" value="$gate"/>
    <param name="Faction" value="faction.argon"/>
</cue>
```

A `purpose="cue_ref"` library produces a runtime cue when referenced. Vanilla `lib_generic.xml:889`.

## Common gotchas

- ⚠ **`<library>` MUST be inside `<cues>` as a sibling of `<cue>`.** Top-level libraries → `run_actions ref="..."` silently returns empty. Real production bug (`mlog638` fix).
- ⚠ **`<return value="..."/>` ONLY works in libraries.** In regular cue actions: `Script node 'return' is not allowed in this context`. Use `do_else` wrap + `reset_cue` for early-exit.
- ⚠ **By-reference table assignment doesn't propagate writes back.** This DOESN'T work:
  ```xml
  <run_actions ref="...">
      <param name="result" value="$snap"/>  <!-- pass empty table -->
  </run_actions>
  <!-- library sets $result.$X = ... -->
  <!-- BUT: $snap.$X is still undefined here -->
  ```
  Use `<return value="table[...]"/>` + caller `result="$snap"` (see GreedyCost / LookupAndValidate vanilla patterns).
- ⚠ **`run_actions` is for `purpose="run_actions"`; `<cue ref=...>` is for `purpose="cue_ref"`.** Mixing them silently no-ops.
- ⚠ **Library params are positional + named.** `<param name="X" value="Y"/>` order in caller doesn't matter (named matching); param order in library DOES (for defaults processing).
- ⚠ **Default values are evaluated at the library, not the caller.** `<param name="X" default="$callerVar"/>` reads `$callerVar` from the library's scope, which usually doesn't exist. Defaults should be literals.
- ⚠ **Library variables are local to the call.** Each `<run_actions>` invocation gets fresh `$variables`. Don't try to persist state across calls.

## Examples

### Example 1: Calculate fleet value (vanilla `CalculateAverageFleetValue`)

```xml
<run_actions
    ref="md.LIB_Generic.CalculateAverageFleetValue"
    result="$avg">
    <param name="Fleet" value="$myFleet"/>
</run_actions>

<write_to_logbook
    text="'Fleet value: ' + $avg + 'Cr'"/>
```

Vanilla `lib_generic.xml:445`.

### Example 2: Transfer ship ownership cleanly

```xml
<run_actions ref="md.LIB_Generic.TransferShipOwnership">
    <param name="Ship" value="$captured"/>
    <param name="NewOwner" value="faction.player"/>
</run_actions>
```

Side-effect library — no return. Vanilla `lib_generic.xml:1551`.

### Example 3: Custom library in your own MD script

```xml
<mdscript name="mlog_my_mod">
    <cues>
        <library name="GetTotalMoney" purpose="run_actions">
            <params>
                <param name="Faction"/>
            </params>
            <actions>
                <set_value name="$total" exact="0"/>
                <find_station_by_true_owner
                    name="$Stations"
                    space="player.galaxy"
                    faction="$Faction"
                    multiple="true"/>
                <do_for_each name="$s" in="$Stations">
                    <set_value name="$total"
                        operation="add"
                        exact="$s.money"/>
                </do_for_each>
                <return value="$total"/>
            </actions>
        </library>

        <cue name="Init">
            <conditions>
                <event_cue_completed cue="md.GameStart"/>
            </conditions>
            <actions>
                <run_actions
                    ref="md.mlog_my_mod.GetTotalMoney"
                    result="$argonMoney">
                    <param name="Faction"
                        value="faction.argon"/>
                </run_actions>
                <write_to_logbook
                    text="'Argon stations have: '
                        + $argonMoney + 'Cr'"/>
            </actions>
        </cue>
    </cues>
</mdscript>
```

## Architectural context

- **80+ vanilla libraries in `lib_generic.xml`.** See [Sector](/game/world/sector/), [Faction](/game/factions/faction/), [Ship](/game/objects/ship/) for catalogued lists.
- **Per-script libraries.** Bigger mods (`x4ep1_*`, story scripts) define their own library bundles. Pattern is universal.
- **Engine vs script libraries.** Some library-like actions (`create_construction_sequence`, `find_object_component`) are engine-implemented and behave like libraries but live in the engine code.

## Related

- [Cue](/lang/md-framework/cue/) — parent abstraction.
- [Action](/lang/md-framework/action/) — what goes inside `<actions>`.
- [Sector → Libraries](/game/world/sector/#libraries) — example call sites.
- [Faction → Libraries](/game/factions/faction/#libraries) — more examples.
- [Ship → Libraries](/game/objects/ship/#libraries) — many ship-specific helpers.

---

:::tip[Pattern — reusable cue with params and return]
Library is **MD's function abstraction** — params in, optional value out, side effects allowed. The `purpose=` attribute distinguishes "inline execution" (`run_actions`) from "cue spawning" (`cue_ref`). Most utility libraries are `run_actions`.
:::

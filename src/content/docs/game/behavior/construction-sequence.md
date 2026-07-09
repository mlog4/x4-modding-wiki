---
title: Construction sequence
description: The ordered list of station modules to build. Backbone of every multi-module construction. Supports staged construction for incremental player builds.
---

A **Construction sequence** is the ordered list of station modules to build. Every multi-module station construction is driven by a sequence — created via `<create_construction_sequence>`, applied via `<apply_construction_sequence>`, and tracked by the [Build module](/game/objects/build-module/) during execution.

X4 9.0+ supports **staged sequences** — the player can break a long construction into stages, building the first set of modules then continuing later. This is the source of the `.hasstagedconstruction` flag on [Station](/game/objects/station/).

**Inheritance:** None — `constructionsequence` is its own root datatype.

## Properties

### Identity and shape

| Property | Type | Description |
|---|---|---|
| `.count` | int | Number of entries in the sequence |
| `.isfixed` | bool | Flagged as fixed, cannot be adjusted |
| `.hasstages` | bool | Sequence has stages defined |

### Per-entry access

| Property | Type | Description |
|---|---|---|
| `.{numeric}` | constructionplanentrydata | The N-th entry (1-based) |
| `.{constructionplanentryid}` | constructionplanentrydata | Entry by its plan id |

The entry data type is `constructionplanentrydata` — a pseudo-type with `.id` / `.macro` / `.loadout` / `.stage` / `.exists`.

### Stage system (X4 9.0+)

| Property | Type | Description |
|---|---|---|
| `.finalsequence` | constructionsequence | Copy of the full staged sequence (null if not staged) |
| `.stage.count` | int | Number of stages |
| `.stage.current` | int | Current stage being constructed to |
| `.stage.{numeric}.first` | int | Index of first module in the stage |
| `.stage.{numeric}.last` | int | Index of last module |
| `.stage.{numeric}.sequence` | constructionsequence | Copy with current stage set to N |

## constructionplanentrydata

Each entry exposes:

| Property | Type | Description |
|---|---|---|
| `.exists` | bool | Entry exists |
| `.id` | constructionplanentryid | Entry id |
| `.macro` | macro | Module macro |
| `.loadout` | loadout | Upgrade loadout |
| `.stage` | int | Stage number this entry belongs to |

## Common patterns

### "Read all modules in a sequence"

```xml
<set_value name="$i" exact="1"/>
<do_while value="$i le $Sequence.count">
    <set_value name="$entry" exact="$Sequence.{$i}"/>
    <write_to_logbook
        text="$i + ': ' + $entry.macro.knownname"/>
    <set_value name="$i" operation="add" exact="1"/>
</do_while>
```

### "Stage-aware build (X4 9.0+)"

```xml
<do_if value="not $Station.hasstagedconstruction">
    <apply_construction_sequence
        station="$Station"
        sequence="$Sequence"/>
</do_if>
<do_else>
    <add_build_to_expand_station
        object="$Station.buildstorage"
        buildobject="$Station"
        constructionplan="$Sequence"
        result="$BuildID"/>
</do_else>
```

See [Build module → Actions](/game/objects/build-module/#actions) for the canonical X4 9.0+ build-append pattern.

### "Check sequence stage progress"

```xml
<do_if value="$Sequence.hasstages">
    <write_to_logbook
        text="'Stage ' + $Sequence.stage.current
            + ' of ' + $Sequence.stage.count"/>
</do_if>
```

## Common gotchas

- ⚠ **`.{numeric}` indexing is 1-based.** First entry is `$Sequence.{1}`, not `$Sequence.{0}`.
- ⚠ **`.isfixed` blocks editing.** A fixed sequence cannot be appended to or modified at runtime. Check before trying to extend.
- ⚠ **`.hasstages=false` means single-stage build.** All entries belong to "stage 1" (implicitly). Stage accessors still work but are less useful.
- ⚠ **`.stage.current` only meaningful when sequence is being used in a build task.** For abstract sequences (created but not yet applied), it's undefined.
- ⚠ **Two sequences with the same entries can have different stages.** Stage assignment is separate from entry composition. Sequences are not value-equal.
- ⚠ **`<create_construction_sequence>` errors on stations with `.hasstagedconstruction=true` in X4 9.0.** Use `<add_build_to_expand_station>` instead. See [Build module → Stage-aware build appending](/game/objects/build-module/#stage-aware-build-appending-x4-90).

## Related

- [Build module](/game/objects/build-module/) — runs sequences during construction.
- [Build](/game/behavior/build/) — `.constructionsequence` accessor.
- [Station](/game/objects/station/) — `.plannedconstruction.sequence` and `.hasstagedconstruction`.
- [Loadout](/game/behavior/loadout/) — entry-level loadout reference.

---

:::tip[Pattern — data-structure datatype with stage system]
Construction sequence is the only data-structure-style datatype in the game API — it's a list with stages, not a runtime entity. Same shape as table/list pseudo-types but with domain semantics (modules + stages).
:::

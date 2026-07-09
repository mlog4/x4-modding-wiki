---
title: Mission group
description: A grouping for related missions — primary and enemy faction, narrative theme. Lightweight db reference for mission discovery.
---

A **Mission group** is a grouping for related missions — used by the mission framework to bundle thematically related content. Each group has a primary and enemy faction.

**Inheritance:** `dbdata → missiongroup`.

## Properties

| Property | Type | Description |
|---|---|---|
| `.id` | string | Group id |
| `.name` | string | Display name |
| `.rawname` | string | Raw text entry reference |
| `.description` | string | Group description |
| `.faction` | faction | Primary faction (the "giver" side) |
| `.enemy` | faction | Enemy faction (the "target" side) |

That's the complete datatype. Mission groups are thin db references — modders interact with them when their custom missions need a thematic bucket.

## Common patterns

### "Filter missions by group"

```xml
<do_if value="$cue.missiongroup == missiongroup.argonbuccaneers">
    <!-- mission belongs to that group -->
</do_if>
```

### "Read enemy faction for combat context"

```xml
<set_value name="$enemy"
    exact="$group.enemy"/>

<find_ship_by_true_owner name="$Targets"
    space="player.galaxy"
    faction="$enemy"
    multiple="true"/>
```

## Common gotchas

- ⚠ **Mission groups are db-defined.** Add new groups via data files; modders can't create them at runtime.
- ⚠ **`.enemy` may be null.** Some groups are positive-only (rescue, transport) without an enemy. Always null-check before dereferencing.
- ⚠ **Group ID is the canonical reference.** Use `missiongroup.X` rather than ad-hoc string comparison.

## Related

- [Faction](/game/factions/faction/) — `.faction` and `.enemy` accessors.
- Mission framework — `gm_*` and `rml_*` cues use mission groups for thematic clustering.

---

:::tip[Pattern — thin thematic bucket]
Mission group is the most lightweight db datatype — just two faction pointers plus localization. Use as a category tag.
:::

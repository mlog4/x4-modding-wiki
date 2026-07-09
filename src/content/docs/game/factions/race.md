---
title: Race
description: One of the in-game races (Argon, Paranid, Teladi, Split, Terran, Boron, Xenon, Khaak). Drives faction primary race, NPC appearance, workforce consumption.
---

A **Race** is one of the in-game races — Argon, Paranid, Teladi, Split, Terran, Boron, Xenon, Khaak. Each race has its own workforce food chain, default NPC appearance, and home-space name. Race is a `dbdata` reference type.

**Inheritance:** `dbdata → race`.

## Properties

| Property | Type | Description |
|---|---|---|
| `.id` | string | Internal id (`"argon"`, `"khaak"`, ...) |
| `.name` | string | Display name |
| `.rawname` | string | Raw text entry reference |
| `.shortname` | string | Short form |
| `.spacename` | string | "Argon Space" type display |
| `.homespacename` | string | "Home of the Argons" display |
| `.description` | string | Description text |
| `.height` | float | Default character height for race NPCs |
| `.facecutscene` | string | Default face cutscene key |
| `.workforce.resources` | wareamountlist | Resources race workforce consumes |
| `.agent.icon` | string | Default icon for agents of this race |
| `.agent.femaleicon` | string | Female-agent icon override |

## Common patterns

### "Read what a race's workforce eats"

```xml
<do_for_each name="$ware"
    in="race.argon.workforce.resources.list">
    <set_value name="$amount"
        exact="race.argon.workforce.resources.{$ware}"/>
    <write_to_logbook
        text="$ware.name + ': ' + $amount"/>
</do_for_each>
```

### "Get faction's primary race"

```xml
<set_value name="$Race"
    exact="$Faction.primaryrace"/>
```

See [Faction → Properties](/game/factions/faction/#identity) for the primary race accessor.

### "Race-specific habitation"

[Habitation modules](/game/objects/habitation-module/) are race-specific. Read `.workforce.race` on a habitation module to know which race it houses.

## Common gotchas

- ⚠ **Faction race ≠ workforce race per se.** A faction can have multiple workforce types (rare) but only one primary race. Use `Faction.primaryrace` for the main race.
- ⚠ **Xenon and Khaak are races too.** Even though they're hostile alien factions. Their workforce mechanics don't apply (they don't use stations the same way).
- ⚠ **`.workforce.resources` is a wareamountlist — degrades on storage.** Iterate `.list` inline (same trap as [Ware](/game/economy/ware/) `.resources`).
- ⚠ **Riptide (Scavenger faction) primary race is Argon, NOT a separate race.** See [Faction](/game/factions/faction/) gotchas about Riptide vs Fallen Families.

## Related

- [Faction](/game/factions/faction/) — `.primaryrace` accessor.
- [Habitation module](/game/objects/habitation-module/) — race-specific workforce capacity.
- [NPC](/game/characters/npc/) — race drives default appearance.
- [Ware](/game/economy/ware/) — workforce-consumed wares.

---

:::tip[Pattern — dbdata reference type]
Race is a *db reference* — read-only data drawn from `libraries/races.xml`. Modders extending races define new entries in the data files; runtime code only reads `race.X` accessors.
:::

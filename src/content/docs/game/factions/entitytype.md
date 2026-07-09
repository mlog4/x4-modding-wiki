---
title: Entity type
description: An NPC's personality / appearance template. Used by entity roles and control posts to categorise characters.
---

An **Entity type** is an NPC's personality / appearance template — the broad-strokes character archetype. Each [NPC](/game/characters/npc/) has a `.type` of one of these. Used by [Entity role](/game/factions/entityrole/) and [Control post](/game/factions/controlpost/) configs to constrain who can fill what.

**Inheritance:** `dbdata → entitytype`.

## Properties

| Property | Type | Description |
|---|---|---|
| `.name` | string | Display name |
| `.rawname` | string | Raw text entry reference |
| `.description` | string | Description |
| `.icon` | string | Icon id |

Minimal datatype — just localization + icon.

## Vanilla entity types

(Verified types vary by DLC; check vanilla `libraries/entitytypes.xml` for the full list.) Common examples include:

- `entitytype.civilian`
- `entitytype.military`
- `entitytype.aipilot`
- `entitytype.engineer`
- `entitytype.shadyguy`
- `entitytype.passenger`

## Common patterns

### "Read an NPC's entity type"

```xml
<do_if value="$npc.type == entitytype.military">
    <!-- this NPC is military — treat differently -->
</do_if>
```

`.type` is on [Entity](/game/characters/npc/) / NPC.

### "Filter NPCs by type"

```xml
<do_for_each name="$npc" in="$Station.crew">
    <do_if value="$npc.type == entitytype.civilian">
        <!-- civilian NPC -->
    </do_if>
</do_for_each>
```

## Common gotchas

- ⚠ **Entity type is not the same as entity role.** Type is the broad archetype (military / civilian); role is the specific job (engineer / pilot / passenger). One NPC has one type but may have a role.
- ⚠ **Entity types are db-defined.** Mods extending NPCs add types via data files.

## Related

- [NPC](/game/characters/npc/) — `.type` accessor.
- [Entity role](/game/factions/entityrole/) — `.type` of role points to entity type.
- [Control post](/game/factions/controlpost/) — `.type` accessor for compatible NPCs.

---

:::tip[Pattern — broad-strokes archetype]
Entity type is the *archetypal layer* — broader than role, narrower than race. Use as a coarse filter when iterating NPCs.
:::

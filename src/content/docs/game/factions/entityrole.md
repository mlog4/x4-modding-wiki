---
title: Entity role
description: An NPC's specific job — pilot, engineer, marine, passenger, missionactor. Has tier system for skill levels and hireability flag.
---

An **Entity role** is an NPC's specific job — pilot, engineer, marine, passenger, missionactor, etc. Roles define what an NPC does on board (gameplay-wise) and gate skill-tier displays / hireability.

**Inheritance:** `dbdata → entityrole`.

## Properties

| Property | Type | Description |
|---|---|---|
| `.name` | string | Display name |
| `.rawname` | string | Raw text entry reference |
| `.femalename` | string | Female variant |
| `.pluralname` | string | Plural form |
| `.description` | string | Description |
| `.tag` | tag | Defined tag for this role |
| `.type` | entitytype | Underlying entity type |
| `.hirable` | bool | Can be hired by player |
| `.isindependent` | bool | Ownership independent of host |
| `.tiers` | list | Tier level values (integers) |
| `.tier.{level}.name` | string | Tier display name |
| `.tier.{level}.rawname` | string | Raw text reference |
| `.tier.{level}.level` | int | Lower-bound level value |
| `.icon` | string | Icon id |

## Vanilla entity roles

Common examples:

- `entityrole.pilot`
- `entityrole.aipilot`
- `entityrole.captain`
- `entityrole.engineer`
- `entityrole.marine`
- `entityrole.passenger`
- `entityrole.missionactor`
- `entityrole.shiptrader`

## Common patterns

### "Read an NPC's role"

```xml
<set_value name="$role" exact="$npc.role"/>

<do_if value="$role == entityrole.marine">
    <!-- this is a marine -->
</do_if>
```

### "Filter ship's people by role"

```xml
<set_value name="$Marines"
    exact="$ship.people.marine.list"/>

<set_value name="$Count"
    exact="$ship.people.marine.count"/>
```

`.people.<role>.list` / `.count` accessors on [Controllable](/game/objects/controllable/) — vanilla shortcut syntax (`.marine` is the rolename).

### "Hire from a role tier"

```xml
<do_if value="entityrole.engineer.hirable">
    <!-- can hire engineers -->
</do_if>

<do_for_each name="$tier"
    in="entityrole.marine.tiers">
    <write_to_logbook
        text="'Marine tier: '
            + entityrole.marine.tier.{$tier}.name"/>
</do_for_each>
```

## Common gotchas

- ⚠ **Role vs type vs control post — three distinct concepts.** Role is the *job* (engineer / marine). Type is the *archetype* (military / civilian). Control post is the *seat* on the ship (controlpost.engineer is the post; entityrole.engineer is the role). Often parallel but conceptually distinct.
- ⚠ **`.hirable=false` blocks player hiring.** Missionactor roles are non-hirable; engineer roles are hirable.
- ⚠ **`.tiers` are integer thresholds.** Each tier defines a lower-bound; values between thresholds belong to the lower tier.
- ⚠ **`.people.<rolename>` uses literal rolename, not `{$role}`.** `$ship.people.engineer.count` works; `$ship.people.{$myvar}.count` requires `{$myvar}` style. Don't mix.

## Related

- [NPC](/game/characters/npc/) — `.role` accessor.
- [Entity type](/game/factions/entitytype/) — `.type` points here.
- [Control post](/game/factions/controlpost/) — often parallel concept.
- [Controllable](/game/objects/controllable/) — `.people.<role>.X` accessors.

---

:::tip[Pattern — role with tier-based skill system]
Entity role is the canonical *job + skill-tier* structure. Tiers are how the engine projects continuous skill values into discrete UI categories. Mods adding new roles should define tier breakpoints for UI clarity.
:::

---
title: Control post
description: A job position on a controllable (ship/station) — pilot, engineer, trader, defence officer. Defines skill relevance for combined-skill calculations.
---

A **Control post** is a job position on a [Controllable](/game/objects/controllable/) — pilot, engineer, trade officer, defence NPC, etc. Each post defines which skills matter for the assigned entity's combined-skill.

**Inheritance:** `dbdata → controlpost`.

## Properties

| Property | Type | Description |
|---|---|---|
| `.name` | string | Display name |
| `.rawname` | string | Raw text entry reference |
| `.description` | string | Description |
| `.icon` | string | Icon id |
| `.type` | entitytype | Entity type for this post |
| `.tag` | tag | Tag for this post |
| `.skilltypes` | list | Relevant skill types |
| `.skillrelevance.{skilltype}` | int 0..100 | Per-skill contribution percentage |
| `.skillrelevance.<skillname>` | int | Shortcut by skill name |
| `.isindependent` | bool | Ownership independent of host object |

## Vanilla control posts

The common post enum values used in vanilla:

- `controlpost.aipilot` — AI pilot
- `controlpost.captain` — Player's captain on player-flown ship
- `controlpost.engineer` — Engineer
- `controlpost.defencenpc` — Defence officer
- `controlpost.tradenpc` — Trade officer
- `controlpost.shiptrader` — Shiptrader (shipyard)
- `controlpost.shadyguy` — Black-market dealer

## Common patterns

### "Assign an actor to a control post"

```xml
<assign_control_entity
    actor="$pilot"
    object="$ship"
    post="controlpost.aipilot"
    init="true"
    transfer="true"/>
```

Pattern from vanilla `cpu_ship_manager.xml:264`. See [NPC → Actions](/game/characters/npc/#assign-an-actor-to-a-control-post).

### "Find which actor is at a post"

```xml
<set_value name="$pilot"
    exact="$ship.controlentity.{controlpost.aipilot}"/>
```

The `.controlentity.{controlpost.X}` accessor lives on [Controllable](/game/objects/controllable/).

### "Read skill relevance for a post"

```xml
<do_for_each name="$skill"
    in="controlpost.aipilot.skilltypes">
    <write_to_logbook
        text="$skill.name + ': '
            + controlpost.aipilot.skillrelevance.{$skill}
            + '%'"/>
</do_for_each>
```

## Common gotchas

- ⚠ **`.skillrelevance.{skill}` returns a percentage (0..100), not a fraction.** Divide by 100 for multipliers.
- ⚠ **`.isindependent` controls ownership inheritance.** Crew at a non-independent post belong to the host's faction; independent post crew keep their own ownership (typical for mission actors).
- ⚠ **Control posts are db-defined.** Modders rarely add new posts — most additions go through entity roles.

## Related

- [NPC](/game/characters/npc/) — entities assigned to posts.
- [Controllable](/game/objects/controllable/) — `.controlentity.{post}` accessor.
- [Entity type](/game/factions/entitytype/) — `.type` reference.
- [Assignment](/game/factions/assignment/) — sibling but for subordinate roles.

---

:::tip[Pattern — post as skill-relevance template]
Control post is the *bridge between skills and behaviour*. Each post says "these skills count for combined-skill in this role." Use when designing custom posts for mods.
:::

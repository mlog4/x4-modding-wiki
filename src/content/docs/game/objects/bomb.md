---
title: Bomb
description: Engine class for deployable bomb-style explosives. Defined as a script class but with no dedicated datatype properties — distinct from missile and mine.
---

A **Bomb** is a deployable bomb-style explosive — a third explosive category alongside [Missile](/game/objects/missile/) (guided, in-flight) and [Mine](/game/objects/mine/) (placed, contact-triggered). The engine exposes `class.bomb` to scripts, but there is **no dedicated `bomb` datatype** in `scriptproperties.xml` — the class is a label, not a property bag.

**No inheritance beyond standard object.** A bomb is `class.bomb` and inherits everything from `object → destructible → component`. There are no bomb-specific accessors.

**Minimal vanilla usage.** Searching vanilla MD and aiscripts for `class.bomb` returns essentially nothing — like [Checkpoint](/game/objects/checkpoint/), bomb is an *engine class exposed for modders* without active vanilla content.

## Properties

There are no bomb-specific properties. Use inherited accessors from `object`:

| Property | Source | Description |
|---|---|---|
| `.sector` / `.zone` / `.position` | object | Where the bomb is |
| `.owner` / `.trueowner` | object | Faction that deployed it |
| `.macro` | component | Bomb macro |
| `.hull` | destructible | Can be shot |

## How bomb differs from sibling explosives

| Class | Behaviour | Datatype | Vanilla use |
|---|---|---|---|
| `class.missile` | Guided / dumb / torpedo, in-flight tracking | `missile` (2 props + explosive base) | Heavy |
| `class.mine` | Stationary / tracking / friend-foe, contact-trigger | `mine` (6 props) | Heavy via `PlaceMinefield` |
| `class.bomb` | Deployable bomb (proximity / timer / scripted detonation) | No datatype | None in vanilla |

`bomb` is positioned for *script-triggered* explosives — mod content that wants "set bomb here, detonate on cue" semantics distinct from missile lifecycle or mine arming.

## Actions

### Spawn a bomb (custom mod content)

```xml
<create_object
    name="$Bomb"
    macro="$BombMacro"
    owner="$Faction"
    sector="$Sector">
    <position x="$x" y="$y" z="$z"/>
</create_object>
```

### Find bombs in a sector

```xml
<find_object name="$Bombs"
    space="$Sector"
    class="class.bomb"
    multiple="true"/>
```

### Detonate a bomb on cue

```xml
<destroy_object object="$Bomb"
    explosiondamage="50000hp"/>
```

The `explosiondamage=` attribute is the canonical "set off this object with a blast" path. Note: the actual damage model depends on the bomb's macro definition — modders typically include AoE damage in the macro.

## Events

There is no `event_bomb_X` family. Bomb lifecycle is observed through standard object events:

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Bomb destroyed (detonation, shot, despawn) | Filter `event.object.isclass.{class.bomb}` |
| `event_object_killed_object` | Bomb killed something via blast | `event.object` = bomb, `event.param` = victim |

## Common gotchas

- ⚠ **No vanilla MD content uses `class.bomb`.** It's a mod hook. Treat it like [Checkpoint](/game/objects/checkpoint/) — safe to spawn-and-destroy without colliding with vanilla.
- ⚠ **No dedicated datatype properties.** No `.target`, no `.armed`, no `.timer`. Build state via parallel `$BombState.{$bomb}` tables in your mod.
- ⚠ **Don't conflate with `Mine`.** Mines have F/F logic and a dedicated framework; bombs are placeholders. If you want F/F detonation, use mine subclasses.
- ⚠ **Engine class enum exists but registry may be sparse.** Without a vanilla macro per faction, you'll need to define your own bomb macros in `libraries/macros.xml`-derived data.

## Architectural context

- **Why some classes exist without vanilla content:** Architectural overview *Reserved engine classes* — same pattern as [Checkpoint](/game/objects/checkpoint/).
- **Custom explosive mods:** Architectural overview *Custom explosive content* — bomb / IED mod design.

## Related

- [Missile](/game/objects/missile/) — sibling explosive (in-flight, guided).
- [Mine](/game/objects/mine/) — sibling explosive (placed, F/F).
- [Explosive](/game/objects/explosive/) — abstract parent type (though `bomb` doesn't strictly use this in vanilla).

---

:::tip[Pattern — class without datatype]
Bomb is the canonical example of *a class exposed for scripting with no datatype-level properties*. Combined with [Checkpoint](/game/objects/checkpoint/), this shows that not all engine classes have rich script API surfaces — some are placeholders for mod content.
:::

---
title: Attention
description: The engine's per-entity attention level — drives AI behaviour fidelity and aiscript action selection. Used in <attention> blocks to branch by proximity-to-player.
---

An **Attention level** is the engine's per-entity "how detailed should this entity behave right now" signal. The engine computes attention based on **proximity to the player** — far ships use cheap simulations; near ships get full fidelity. Aiscripts use the `<attention>` block to branch behaviour by attention level.

The attention system is one of the **two cost-control mechanisms** in X4's AI (alongside priority on [Interrupts](/lang/aiscript/interrupt/)). It lets the engine simulate thousands of ships without per-frame cost.

## Attention levels

Verified from vanilla aiscripts:

| Level | Distance to player (rough) | Behaviour |
|---|---|---|
| `attention.unknown` | Far / not loaded | Engine handles internally, scripts skip detailed work |
| `attention.adjacentzone` | Adjacent zone | Light AI |
| `attention.insector` | Same sector | Standard AI |
| `attention.inzone` | Same zone | Full fidelity |
| `attention.inroom` | Player can see the entity walking | Per-frame animation |
| `attention.nearby` | Very close | Highest fidelity |
| `attention.visible` | Player has visual | Camera-aware behaviour |

The actual numeric enum values and thresholds are engine-internal. Modders interact via the named symbols.

## `<attention>` block

In an aiscript order or library, the `<attention>` block defines actions specific to an attention range:

```xml
<attention min="unknown">
  <actions>
    <!-- runs at all attention levels >= unknown -->
    <stop_moving object="this.assignedcontrolled"/>
  </actions>
</attention>
```

`min="X"` specifies the **minimum attention level** for this block. The engine runs the block whenever the entity's attention reaches at least that level. There's also `max="X"` for ranges.

```xml
<attention min="inzone" max="nearby">
  <actions>
    <!-- only when in zone but not visible -->
  </actions>
</attention>
```

## Common usage patterns

### "Cheap-default, expensive-when-close"

```xml
<actions>
  <!-- Default action — runs at unknown -->
  <wait min="60s" max="120s"/>
</actions>

<attention min="insector">
  <actions>
    <!-- More detail when player is in the sector -->
    <move_to ... />
    <rotate ... />
  </actions>
</attention>
```

Cheap behaviour by default; richer behaviour when the player can observe. This is the canonical pattern for "ship is acting in the background until the player gets close".

### "Player-visible feedback"

```xml
<attention min="inroom">
  <actions>
    <!-- play an animation -->
    <play_voice line="$voiceline"/>
  </actions>
</attention>
```

Only run UI-relevant actions when the player can see them.

### "Different behaviours per attention"

```xml
<attention min="unknown" max="insector">
  <actions>
    <!-- coarse work — abstract patrol -->
  </actions>
</attention>

<attention min="insector">
  <actions>
    <!-- detailed work — actual flight -->
  </actions>
</attention>
```

Order body has multiple `<attention>` blocks; each runs at the matching level.

## Reading attention in conditions

Aiscript can read entity attention as an expression:

```xml
<do_if value="this.attention ge attention.insector">
  <!-- player is in the sector or closer -->
</do_if>
```

`.attention` lives on entities/objects. Compare with `ge` / `le` (attention is an ordered enum).

## Common gotchas

- ⚠ **Attention levels are an ORDERED ENUM.** `attention.unknown < .adjacentzone < .insector < .inzone < .inroom < .nearby < .visible`. Use `ge` / `le` for inclusive bounds.
- ⚠ **`<attention min="X">` runs whenever attention REACHES X.** Not just "transitions to X". If your entity is constantly at `attention.insector`, the block fires every tick. Add `delay=` for idle periods.
- ⚠ **Default `<actions>` runs at all levels.** It's the "no attention block matched" fallback. Both default and matched `<attention>` blocks can run in the same tick.
- ⚠ **Cost is per `<attention>` block evaluation.** A handler with 5 `<attention>` blocks evaluates 5 conditions per tick. Keep nesting flat.
- ⚠ **`attention.unknown` is for "not loaded / very far".** It's still a level; entities at this attention still tick (slowly). Don't conflate with "doesn't exist".
- ⚠ **NPCs and ships have different effective attention models.** Walk-around NPCs (entities in rooms) hit `.inroom`; ships hit `.inzone` / `.insector` based on player position. Vanilla `attention.inroom` is rare for ships.
- ⚠ **Attention is NOT a player-controlled setting.** It's engine-computed from camera, distance, and station rendering distance. Mods can't easily override.

## Examples

### Example 1: Background patrol with detail near player

```xml
<actions>
  <!-- baseline: idle wait at any attention -->
  <wait min="30s" max="120s"/>
</actions>

<attention min="insector">
  <actions>
    <!-- actual flight only when player is in sector -->
    <find_zone name="$z" space="this.sector" multiple="false"/>
    <move_to destination="$z"/>
  </actions>
</attention>
```

### Example 2: Branch by attention in expression

```xml
<do_if value="this.attention ge attention.inzone">
  <!-- player is in our zone — show detailed UI feedback -->
  <write_to_logbook
      text="this.knownname + ' visible to player'"/>
</do_if>
```

### Example 3: Multi-tier branching

```xml
<attention min="unknown" max="insector">
  <actions>
    <!-- coarse: just skip ahead -->
    <wait min="5min" max="10min"/>
  </actions>
</attention>

<attention min="insector" max="inzone">
  <actions>
    <!-- medium: simple movements -->
    <move_to destination="$waypoint"/>
  </actions>
</attention>

<attention min="inzone">
  <actions>
    <!-- detailed: full flight + animation -->
    <move_to destination="$waypoint"
        forceposition="true" forcerotation="true"/>
    <play_voice line="$line"/>
  </actions>
</attention>
```

## Architectural context

- **The two cost-control mechanisms:** Attention (entity-level fidelity) + Priority (interrupt-evaluation order). Together they let the engine handle thousands of entities.
- **Vanilla attention usage:** Most ship orders define one `<attention min="unknown">` block. Distinct branching by attention is rarer (typically reserved for NPC interactions in dock areas).
- **Modding implications:** Performance-sensitive mods should respect attention. A new order that runs heavy logic regardless of attention can tank framerate when many NPC ships use it.

## Related

- [Order definition](/lang/aiscript/order-definition/) — where `<attention>` blocks live.
- [Interrupt](/lang/aiscript/interrupt/) — sibling reactive mechanism, also performance-sensitive.
- [NPC](/game/characters/npc/) — entity that has `.attention` accessor.
- [Ship](/game/objects/ship/) — also has `.attention`.

---

:::tip[Pattern — engine-computed fidelity branching]
Attention is **the engine's fidelity dial** — let scripts say "cheap by default, expensive when observable". Cooperatively designed mods reduce CPU; ignoring attention pushes work to every entity and slows the game.
:::

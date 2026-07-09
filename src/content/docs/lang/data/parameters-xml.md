---
title: parameters.xml
description: Per-class tuning + NPC placement rules. Friendly-fire tolerance, ship/station defaults, NPC role tags. The "constants of the universe" file.
---

**`libraries/parameters.xml`** is the per-class tuning + behaviour-tweaks file — the "constants of the universe". It defines NPC role tags (which role plays which animation, what tag identifies a missionactor, etc.), ship/station defaults, friendly-fire tolerance per ship class, and many other engine-side knobs.

Vanilla `parameters.xml` is **2597 lines** — second-largest config file after god.xml. Modders touching combat balance or NPC placement diff here.

## File structure

```xml
<?xml version="1.0" encoding="utf-8"?>
<parameters xmlns:xsi="..."
    xsi:noNamespaceSchemaLocation="parameters.xsd">

  <playerflight>
    <!-- player-flight tuning -->
  </playerflight>

  <classes>
    <class id="ship">
      <!-- class-specific defaults -->
    </class>
    <class id="station">
      <!-- ... -->
    </class>
  </classes>

  <slots>
    <!-- NPC placement slot definitions -->
    <slot tag="npc_missionactor">
      <macros>
        <macro name="character_x_missionactor_macro"/>
      </macros>
    </slot>
  </slots>

</parameters>
```

## Most-modded sections

### `<playerflight>` — player ship physics

| Key tag | Tunes |
|---|---|
| `<turnratecap>` | Max turn rate |
| `<accelerationcap>` | Max acceleration |
| `<boostpenalty>` | Boost shield-recharge penalty |

### `<classes>` — per-class defaults

Friendly-fire response, alert-level transitions, hull regen per ship class are defined here.

### `<slots>` — NPC role-to-macro mapping

Maps NPC role tags (e.g. `npc_missionactor`, `npc_aipilot`) to character macros. Vanilla `<slot tag="npc_missionactor">` defines what missionactor NPCs look like.

This is also where the **two-layer entity icon** distinction documented elsewhere applies: the character-head floater is `set_entity_overrides icon=`, but the **ship-level marker** is per-role here (e.g. `missionactor → npc_missionactor`).

## Common patterns

### "Soften friendly-fire response per ship class"

```xml
<replace
    sel="//classes/class[@id='ship_m']/friendlyfire/@reactiondelay">
    2.0
</replace>

<replace
    sel="//classes/class[@id='ship_m']/friendlyfire/@reactiondecay">
    2.0
</replace>
```

Pattern from `mlog_friendly_fire_tweaks` mod. Doubles delay and decay so NPCs don't immediately turn hostile on accidental hits.

### "Add a custom NPC slot"

```xml
<add sel="//slots">
    <slot tag="mlog_my_npc_type">
        <macros>
            <macro name="character_mlog_x_macro"/>
        </macros>
    </slot>
</add>
```

Adds a new NPC tag the mod can reference from MD.

### "Override player-ship turn rate"

```xml
<replace sel="//playerflight/turnratecap">
    <turnratecap>5.0</turnratecap>
</replace>
```

For "faster turn for player ship" mod (rarely needed; usually balance-relevant).

## Common gotchas

- ⚠ **`reactiondelay` and `reactiondecay` are friendly-fire tunables.** Default values trigger combat too aggressively on accidental hits. `mlog_friendly_fire_tweaks` doubled both for player-friendly response. (Memory: `x4_mod_defaults_xml_ff_softening`.)
- ⚠ **NPC ship-marker icon is global per-role.** Setting `set_entity_overrides icon=` on a specific NPC only changes the head floater. The ship marker comes from parameters.xml's slot definition and is shared across all NPCs of that role.
- ⚠ **`<slot tag=>` references engine-side tag definitions.** Adding a new tag without engine awareness leaves the entries inert. Most NPC-content mods reuse existing tags.
- ⚠ **Friendly-fire tuning is X4-version-specific.** Vanilla balance evolves; mods tuning these need to retest each version.
- ⚠ **Removing default macros from a `<slot>` can break NPC spawning.** Engine needs at least one macro per slot. Test thoroughly after macro removals.
- ⚠ **NPC_Placement_Manager assertions reference parameters.xml.** If your MD spawns NPCs and they're invisible, check that the role tag has a `<slot>` entry. (Memory: `x4_md_npc_placement_manager_requires_slottags`.)

## Architectural context

- **Loaded at game start.** Like `god.xml`, parameters are baked into the running session.
- **Mod compatibility:** Different mods often touch the same `<class>` entries. Use precise `<replace sel="...">` selectors to avoid stepping on each other.
- **Balance mods diff parameters.xml heavily.** Friendly-fire mods, combat-feel mods, and player-physics mods all live here.

## Related

- [Friendly-fire softening](/game/objects/ship/) — `mlog_friendly_fire_tweaks` mod.
- [NPC](/game/characters/npc/) — `<slot>` entries map to NPC roles.
- [Entity role](/game/factions/entityrole/) — what `<slot tag=>` references.
- [Ship](/game/objects/ship/) — `<class id="ship_*">` tunes ship-class behaviour.

---

:::tip[Pattern — engine tunables file]
parameters.xml is **the engine-tunables catalog** — every number that drives combat / movement / NPC behaviour. Touching it lets you adjust balance without writing MD. But the file is huge and undocumented — always read surrounding context before modifying.
:::

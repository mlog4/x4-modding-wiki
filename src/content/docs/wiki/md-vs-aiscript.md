---
title: MD vs Aiscript
description: Which framework do you use for what? Decision tree + side-by-side comparison + common use cases mapped to each.
---

X4 has two scripting languages: **MD (Mission Director)** and **Aiscript**. They cover different domains, but the boundary isn't obvious from documentation. This page is the decision guide.

For the language references see [MD Framework](/lang/md-framework/) and [Aiscript Framework](/lang/aiscript/).

## The short answer

| You're writing | Use |
|---|---|
| Mission content (offers, acceptance, completion) | **MD** |
| Story content (cutscenes, characters) | **MD** |
| Faction logic (economy, goals, expansion) | **MD** |
| Faction relations + diplomacy | **MD** |
| UI menus + HUD widgets | **Lua** (see [UI/Lua](/lang/ui-lua/)) |
| Custom NPC ship behaviour | **Aiscript** |
| New ship orders (Patrol, Attack, Move, etc.) | **Aiscript** |
| Reactive ship reflexes (under attack, scanned) | **Aiscript** ([Interrupt](/lang/aiscript/interrupt/)) |

The boundary: **MD orchestrates THE GAME; Aiscript governs INDIVIDUAL SHIPS.**

## Decision tree

```
   You need to script something.
                ↓
   Does it involve a specific NPC ship's behaviour?
            (e.g. "if X happens, ship does Y")
   ┌─────────────────┴─────────────────┐
   │ YES                                NO
   ↓                                    ↓
   AISCRIPT                            Does it involve game state
                                       across factions / story / missions?
                                       ┌───────────┴───────────┐
                                       │ YES                    NO
                                       ↓                        ↓
                                       MD                       Is it about UI
                                                                visible to player?
                                                                ┌──────────┴──────────┐
                                                                │ YES                   NO
                                                                ↓                       ↓
                                                                LUA + SN APIs           Probably MD
                                                                                       (or you're solving
                                                                                       the wrong problem)
```

## Side-by-side

| Concern | MD | Aiscript |
|---|---|---|
| **Trigger** | Cue conditions (events + checks) | Order conditions OR interrupt handlers |
| **Lifecycle** | Per-cue (instantiate / queue / state machine) | Per-order on a ship |
| **State** | `$variables` per cue, `namespace.$X`, `global.$X` | `$variables` per order instance |
| **Persistence** | All vars saved automatically | Vars saved with the ship |
| **MD ↔ aiscript bridge** | `<signal_objects>`, `<create_order>` | `signal_cue` from `<on_finish>` |
| **Performance** | Tick-based; per-cue overhead | Per-frame for active orders + interrupts |
| **Where it runs** | Game-level | Per-ship |
| **Vanilla file extension** | `.xml` (in `md/`) | `.xml` (in `aiscripts/`) |
| **Root element** | `<mdscript>` | `<aiscript>` |

## Common patterns by use case

### "My mod adds a new mission type"

Use **MD**. Create `gm_X.xml` mirroring vanilla [Mission framework](/overviews/mission-framework/) patterns. The mission cue:

- Offers via `<create_offer>` from MD
- Listens for player accept
- Spawns objects via `<create_ship>` / `<create_object>`
- Awards rewards via `LIB_Reward_Balancing`

Mission cues drive everything. Aiscript orders are subsidiary — they make NPC ships do specific actions during the mission.

### "My mod adds a new NPC ship behaviour"

Use **Aiscript**. Create `order.X.xml`. The order:

- Defines its `<params>` (player-configurable settings)
- Implements `<actions>` (what the ship does)
- Subscribes to relevant `<interrupts>`
- Uses `<attention>` blocks to scale cost-of-execution

See [Order definition](/lang/aiscript/order-definition/).

### "My mod reacts to player actions"

Probably **MD**. Listen for player events:

```xml
<event_player_signalled/>
<event_player_trade_completed/>
<event_object_destroyed/>
```

MD is the right place for "watch and react" patterns. Don't try to wire this through aiscript — aiscript is per-ship, not per-event.

### "My mod adds a custom faction"

Use **MD** (mostly):

- Faction declaration in `libraries/factions.xml` (data, not script)
- Faction logic via MD cues (registered in FactionGoals)
- Initial seeding via god.xml (data)

Some aiscript may be needed if your faction has unique ship behaviour, but the bulk is MD.

See [New faction recipe](/wiki/new-faction-recipe/) for the data side.

### "My mod adds a UI menu"

Use **Lua + SN APIs**. See [UI/Lua](/lang/ui-lua/) and the [UI Lua framework](/overviews/ui-lua-framework/) overview.

For the data the menu displays, use MD (state lives in MD vars; menu reads via event bus).

### "My mod tracks faction state across the game"

Use **MD**. Variables like `global.$mlog_state` persist across the session. Cues read and update them.

Aiscript can't do this well — aiscript state is per-ship.

## Communication between MD and Aiscript

### MD spawns an order on a ship

```xml
<create_order id="'MyCustomOrder'" object="$ship">
    <param name="param1" value="$value"/>
</create_order>
```

The order is queued; aiscript runs it. See [Order definition](/lang/aiscript/order-definition/).

### Aiscript reports back to MD

In the order's `<on_finish>`:

```xml
<signal_objects object="this.$mission_cue"
    param="'order_done'"/>
```

In MD, listen:

```xml
<cue name="WatchOrderDone" instantiate="true">
    <conditions>
        <event_object_signalled
            object="this.$mission_cue"
            param="'order_done'"/>
    </conditions>
    <actions>...</actions>
</cue>
```

This is the canonical mission ↔ ship bridge.

## Decision pitfalls

### "I'll use aiscript because it runs faster"

The performance difference is not material for most use cases. Use the framework that fits the domain. Misusing aiscript for game-level logic results in convoluted code.

### "I'll use MD because it's easier to read"

For per-ship behaviour, MD is the WRONG tool. You'll fight the framework. Use aiscript and accept the learning curve.

### "I'll mix both in the same file"

You can't. MD lives in `md/`, aiscript in `aiscripts/`. Different XML roots, different schemas, different lifecycle. Pick one.

### "I'll do everything in MD via create_order"

You can drive ship behaviour purely from MD with continuous `<create_order>` calls — but the overhead is high, and you're recreating aiscript's job poorly. If you need ship behaviour, write an aiscript order.

## When you're unsure

Default to **MD** unless you're CERTAIN it's per-ship behaviour. MD is more flexible; aiscript is more specialised.

If your need is "make ships do X under condition Y" — aiscript.  
If your need is "make THE GAME do X under condition Y" — MD.

## Related

- [Cue](/lang/md-framework/cue/) — MD reference
- [Order definition](/lang/aiscript/order-definition/) — aiscript reference
- [Mission framework](/overviews/mission-framework/) — when MD is right
- [NPC orders](/overviews/npc-orders/) — when aiscript is right
- [UI Lua framework](/overviews/ui-lua-framework/) — when Lua is right

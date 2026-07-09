---
title: Condition
description: The XML elements inside <conditions> blocks. Declarative trigger logic — events, checks, matches. The "when" half of MD cues.
---

A **Condition** is an XML element inside a `<conditions>` block. Conditions are the *declarative* half of MD — they decide *when* a cue fires. Sister to [Action](/lang/md-framework/action/) (which decides *what it does* once triggered).

A `<conditions>` block consists of:
1. **Events** (`event_X`) — engine-fired triggers
2. **Checks** (`check_value`, `match_*`) — additional filters on the event
3. **Boolean logic** (implicit AND within block; explicit `<check_any>` / `<check_all>` for nesting)

## XML structure

```xml
<conditions>
    <event_object_destroyed/>
    <check_value
        value="event.object.isclass.{class.ship}"/>
    <check_value
        value="event.object.toplevelcommander
            == player.controlled"/>
</conditions>
```

All conditions in the block are **ANDed together**. The cue fires when *all* are satisfied. The first event is the *trigger*; subsequent `check_value` / `match_*` are filters.

## Event categories

MD has **~60 event types** across these families.

### Object events (most common)

| Event | When fires | event.object | event.param |
|---|---|---|---|
| `event_object_destroyed` | Object destroyed | the victim | killer (sometimes) |
| `event_object_killed_object` | Object killed something | killer | victim |
| `event_object_attacked` | Object attacked (MD-side, rare) | victim | attacker |
| `event_object_attacked_object` | Attack event (with object attribute) | (attacker?) | (varies) |
| `event_object_changed_owner` | Ownership changed | the object | new faction |
| `event_object_changed_sector` | Crossed sector boundary | the object | new sector |
| `event_object_changed_pilot` | Pilot changed | the object | new pilot |
| `event_object_destroyed group="$X"` | Destroyed within tracked group | victim | killer |
| `event_object_signalled object="$X"` | Custom signal via `signal_objects` | the signalled | param from signal |
| `event_object_construction_sequence_created` | Sequence applied | the station | sequence |
| `event_object_miningdrones_armed` | Drones armed | the ship | — |

Many `event_object_X` accept a `group="$X"` attribute to filter by membership — see [Group](/game/factions/group/).

### Faction events

| Event | When fires |
|---|---|
| `event_faction_relation_changed` | Bilateral relation changed |
| `event_faction_activated` | Faction transitioned to active |
| `event_faction_deactivated` | Faction deactivated |
| `event_faction_police_changed` | Police faction reassigned |

### Sector / cluster events

| Event | When fires |
|---|---|
| `event_sector_resource_depleted` | Resource region depleted |
| `event_contained_sector_changed_owner` | Sector ownership changed (fires on the cluster!) |
| `event_contained_sector_changed_true_owner` | Same but true-owner variant |

### Cue events

| Event | When fires |
|---|---|
| `event_cue_completed cue="X"` | Cue X reached complete state |
| `event_cue_signalled cue="X"` | Cue X RECEIVED a signal (not "sent"!) |

### Player events

| Event | When fires |
|---|---|
| `event_player_signalled` | Player received a custom signal |
| `event_player_trade_completed` | Player-side trade complete |
| `event_player_recyclable_processing_started` | Player processing scrap |
| `event_player_recyclable_processed` | Processing complete |
| `event_player_towed_recyclable_near_furnace` | Brought scrap near furnace |
| `event_player_interaction param2="..."` | UI interaction event |

### Trade events

| Event | When fires |
|---|---|
| `event_trade_started` | Trade order initiated |
| `event_trade_completed` | Trade completed |

### Boarding events

| Event | When fires |
|---|---|
| `event_boarding_operation_created` | Op exists in engine |
| `event_boarding_operation_started` | Player/faction committed |
| `event_boarding_phase_changed` | Any phase transition |
| `event_boarding_operation_removed` | Op concluded |

### Deployable launch events

| Event | When fires |
|---|---|
| `event_navbeacon_launched` | Nav beacon deployed |
| `event_resourceprobe_launched` | Resource probe deployed |

### NPC events

| Event | When fires |
|---|---|
| `event_npc_created` | NPC spawned (also fires on save load — HACK comment in vanilla) |
| `event_npc_walk_finished` | NPC arrived at target slot |
| `event_npc_slots_validated` | Slot system recomputed |
| `event_entity_entered space="$X"` | Entity entered space |
| `event_entity_left space="$X"` | Entity left space |
| `event_entity_transport_finished` | Transport pod arrived |

### Build / Construction events

| Event | When fires |
|---|---|
| `event_object_construction_sequence_created` | Sequence applied to station |

### Conversation events

| Event | When fires |
|---|---|
| `event_conversation_started actor="$X"` | Conversation began |
| `event_conversation_finished actor="$X"` | Conversation ended |

## Filter attributes

Most events accept filter attributes that narrow the match:

| Attribute | What it does |
|---|---|
| `object="$X"` | Only fire for this specific object |
| `group="$X"` | Only fire for members of this [Group](/game/factions/group/) |
| `space="$X"` | Restrict to a space (sector/cluster/galaxy) |
| `faction="$X"` | Restrict by faction |
| `actor="$X"` | Specific actor |
| `cue="$X"` | (For `event_cue_signalled`) X RECEIVED — *not* sent! |
| `check="false"` | Don't re-check during the same frame |

## Filter checks

After the event, use `check_value` or `match_*` for further filtering:

### check_value (boolean filter)

```xml
<check_value
    value="event.object.isclass.{class.ship}
        and event.object.owner == faction.player"/>
```

Pure boolean expression. Cue fires only if true.

### match_content / match_parent / match_object (data filters)

```xml
<match_content
    class="[class.engine, class.turret]"
    state="componentstate.operational"/>
```

Pattern-match against object structure. Used by mission generators (`gm_destroy_objects.xml`, `gm_buildstation.xml`).

```xml
<match_parent class="class.navcontext"/>
```

Match by parent. Used by cinematic camera filters.

## Boolean composition

By default, conditions inside `<conditions>` are **ANDed**. For OR / nesting:

```xml
<conditions>
    <event_object_destroyed/>
    <check_any>
        <check_value
            value="event.object.isclass.{class.ship}"/>
        <check_value
            value="event.object.isclass.{class.station}"/>
    </check_any>
</conditions>
```

`<check_any>` = OR. `<check_all>` = AND (rare; same as implicit block AND).

## Common patterns

### "Listener cue"

```xml
<cue name="WatchDestroys" instantiate="true">
    <conditions>
        <event_object_destroyed group="$MyTracked"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="event.object.knownname
                + ' destroyed'"/>
    </actions>
</cue>
```

The canonical instantiated listener. Vanilla `notifications.xml`, `setup.xml` use this hundreds of times.

### "Filtered listener"

```xml
<cue name="WatchPlayerCapShips" instantiate="true">
    <conditions>
        <event_object_destroyed/>
        <check_value
            value="event.object.isclass.{class.ship}
                and event.object.iscapitalship
                and event.object.toplevelcommander
                    == player.controlled"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Lost capital: '
                + event.object.knownname"/>
    </actions>
</cue>
```

Event + multi-check_value combo. Most production listener cues look like this.

### "Worker waiting on signal"

```xml
<cue name="Worker" instantiate="false">
    <conditions>
        <event_cue_signalled cue="Bridge"/>
    </conditions>
    <actions>
        <!-- do work -->
        <reset_cue cue="this"/>
    </actions>
</cue>
```

Worker side of Bridge+Worker pattern. See [Cue](/lang/md-framework/cue/) for full pattern.

## Common gotchas

- ⚠ **`event_cue_signalled cue="X"` means "X RECEIVED a signal", NOT "X sent one".** Confusing naming. Use no-attr form for canonical Init→Worker pattern, else the listener silently never fires.
- ⚠ **Conditions in a block are ANDed.** If you need OR, use `<check_any>`.
- ⚠ **The first condition must be an event** (or a `check_value` if there's no event trigger). Pure `check_value`-only conditions don't trigger — there's no event to react to.
- ⚠ **`event_object_destroyed group="$X"` requires the group to be set up in a no-conditions cue.** Setup cues with conditions fire too late; engine errors at time 0.00.
- ⚠ **`event_object_destroyed group="$X"` watcher MUST be NESTED inside the group-creating cue.** Top-level group filters silently never fire (vanilla `setup.xml:41/591` pattern).
- ⚠ **`event_npc_created` fires on save load too.** Vanilla has an open `<!-- HACK @Owen -->` comment about this. If your handler does setup, gate on `event.param != 'load'`-style checks.
- ⚠ **`event_player_trade_completed` is player-only.** NPC trades use `event_trade_completed`. Don't conflate.
- ⚠ **`event.param` semantics vary per event.** For `event_object_destroyed`: killer. For `event_object_killed_object`: victim. For `event_boarding_phase_changed`: new phase. Read the per-event docs.
- ⚠ **Conditions evaluate AT TRIGGER time, not later.** `event.object` is captured at firing; later changes don't propagate. Cache via `<set_value>` if you need persistence.
- ⚠ **`check="false"` on an event prevents re-check within the same frame.** Useful for events that fire multiple times in one tick — turns them into single-fire.

## Examples

### Example 1: Player territory expansion

```xml
<cue name="WatchPlayerTerritory" instantiate="true">
    <conditions>
        <event_contained_sector_changed_owner
            owner="faction.player"
            space="player.galaxy"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player gained '
                + event.param.knownname
                + ' in '
                + event.object.knownname"/>
    </actions>
</cue>
```

Pattern from vanilla `setup.xml:993`.

### Example 2: Trade completion filtered to player

```xml
<cue name="WatchPlayerTrades" instantiate="true">
    <conditions>
        <event_trade_completed/>
        <check_value
            value="event.object.buyer.isplayerowned
                or event.object.seller.isplayerowned"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player trade: '
                + event.object.ware.name"/>
    </actions>
</cue>
```

### Example 3: Boarding phase progression

```xml
<cue name="WatchInfiltration" instantiate="true">
    <conditions>
        <event_boarding_phase_changed/>
        <check_value
            value="event.object.owner == faction.player
                and event.param == boardingphase.infiltration"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="event.object.boardee.knownname
                + ': marines inserting'"/>
    </actions>
</cue>
```

## Architectural context

- **~60 event types in vanilla.** No exhaustive catalog — discoverable by reading vanilla.
- **Events are engine-side.** `signal_objects` and `signal_cue` are how scripts emit events; the engine emits the rest.
- **Conditions evaluation is throttled per frame.** Multiple conditions firing in one frame are coalesced where possible. Performance-critical mods filter aggressively.

## Related

- [Cue](/lang/md-framework/cue/) — conditions live in cue's `<conditions>` block.
- [Action](/lang/md-framework/action/) — sister concept (what happens once triggered).
- [Expression](/lang/md-framework/expression/) — `check_value="..."` expression syntax.
- [Group](/game/factions/group/) — `event_X group="$Y"` filter.
- Game-side pages — for the specific Events sections on each abstraction.

---

:::tip[Pattern — declarative trigger logic]
Condition is **MD's declarative half** — the `<conditions>` block reads like a database WHERE clause. Pair with `<actions>` (procedural body) to make a complete cue. Most condition mistakes are filter mistakes — over- or under-restricting the match.
:::

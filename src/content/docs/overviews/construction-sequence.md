---
title: Station construction sequence
description: How a station's physical modules get built. From create_construction_sequence to event_object_construction_sequence_created to apply_construction_sequence to signal_objects 'init station'.
---

How does a station go from "list of planned modules" to "physical modules visible in space"? Every multi-module station build — initial seeding, NPC expansion, player plot construction — runs through the **construction sequence pipeline**. This overview explains the four-step engine ↔ MD dance.

This overview is the *runtime mechanic* counterpart to [Galaxy seeding](/overviews/galaxy-seeding/) (which only covers the initial spawn). Construction sequence runs both at game start AND during gameplay.

## The pipeline

```
┌────────────────────────────────────────────────┐
│  Caller (MD script)                            │
│  <create_construction_sequence ...>            │
│     station=$Station                            │
│     macros=[$mod1, $mod2, ...]                  │
│     base=$existing_sequence (or empty)          │
│  </create_construction_sequence>                │
└────────────────────┬───────────────────────────┘
                     ↓
┌────────────────────────────────────────────────┐
│  Engine                                          │
│  - validates macros + connections                │
│  - computes geometry / build order               │
│  - emits event_object_construction_sequence_     │
│      created with event.param = sequence         │
└────────────────────┬───────────────────────────┘
                     ↓
┌────────────────────────────────────────────────┐
│  Listener cue                                    │
│  <event_object_construction_sequence_created/>   │
│  <apply_construction_sequence                    │
│     station=$Station                             │
│     sequence=event.param/>                       │
└────────────────────┬───────────────────────────┘
                     ↓
┌────────────────────────────────────────────────┐
│  Engine                                          │
│  - materializes modules                          │
│  - sets up build modules / processors            │
│  - fires <signal_objects 'init station'>         │
│    on the new station                            │
└────────────────────┬───────────────────────────┘
                     ↓
┌────────────────────────────────────────────────┐
│  Station operational                             │
└────────────────────────────────────────────────┘
```

## Step 1: create_construction_sequence

The caller (typically a faction-logic or finalisation cue) requests a sequence:

```xml
<create_construction_sequence
    station="$Station"
    macros="$NewPlannedModules"
    connectors="$Conn_PlannedConnectors"
    base="$BaseSequence"/>
```

Parameters:

| Param | Purpose |
|---|---|
| `station=` | The target station object |
| `macros=` | List of module macros to include |
| `connectors=` | Connection modules between them |
| `base=` | Existing sequence to extend (null for fresh start) |

The engine takes these as a request — it doesn't immediately build anything. It validates, computes, and fires the next-step event.

## Step 2: event_object_construction_sequence_created

The engine emits this event once the sequence is ready. Vanilla cues listen for it to know "the sequence I requested is ready to apply":

```xml
<cue name="ApplyAfterCreate" instantiate="true">
    <conditions>
        <event_object_construction_sequence_created
            object="$Station"/>
    </conditions>
    <actions>
        <apply_construction_sequence
            station="$Station"
            sequence="event.param"/>
    </actions>
</cue>
```

Pattern from vanilla `finalisestations.xml` (multiple cues use this).

The `event.param` holds the constructed sequence — a [Construction sequence](/game/behavior/construction-sequence/) datatype value. The listener immediately calls `<apply_construction_sequence>` to materialize.

## Step 3: apply_construction_sequence

```xml
<apply_construction_sequence
    station="$Station"
    sequence="event.param"/>
```

The engine now physically builds the modules. This involves:

1. **Module placement** — each module rendered at its computed position
2. **Connection wiring** — connectors linked between adjacent modules
3. **Build module activation** — if this is a player station, build modules get cargo storage
4. **Initial state setup** — production paused, defence modules unarmed, etc.

The sequence's modules become visible in the world.

## Step 4: signal_objects 'init station'

After all modules exist, the engine fires a `signal_objects` on the station with the parameter `'init station'`. This is the canonical "station is now fully operational" signal:

```xml
<signal_objects object="$Station" param="'init station'"/>
```

Listeners for `event_object_signalled` with `param="'init station'"` can react — vanilla uses this for:
- Trade subscription registration
- Faction logic notification
- NPC patrol assignment

After this signal, the station appears in `find_station_by_true_owner` queries, accepts trade orders, can be boarded, etc.

## X4 9.0+: staged construction

X4 9.0 added **staged construction** — player can specify "build these first, those later". The sequence tracks the current stage:

```
sequence
├── stage 1: pier + dock area + storage    ← current
├── stage 2: production module 1
└── stage 3: production module 2
```

`Sequence.stage.current` indicates the current stage. The engine builds modules in the current stage, then waits for player approval before advancing.

### 9.0 caller distinction

`<create_construction_sequence>` **errors on stations with staged construction**. For staged stations, use `<add_build_to_expand_station>` instead:

```xml
<do_if value="not $Station.hasstagedconstruction">
    <create_construction_sequence ...>
</do_if>
<do_else>
    <add_build_to_expand_station
        object="$Station.buildstorage"
        buildobject="$Station"
        constructionplan="$Plan"
        result="$BuildID"/>
</do_else>
```

Pattern from `factionsubgoal_buildstation.xml:211` + `finalisestations.xml:359`. See [Build module → Stage-aware build appending](/game/objects/build-module/#stage-aware-build-appending-x4-90).

## Use cases

### Initial galaxy seeding

[Galaxy seeding](/overviews/galaxy-seeding/) is the primary user. Every NPC station at game start runs through this pipeline.

### NPC faction expansion

When `factionlogic_economy` decides to build a new factory:

1. `<create_construction_sequence>` with the new factory's modules
2. Listener catches the event
3. `<apply_construction_sequence>` materializes
4. `signal_objects 'init station'` registers it with trade

### Player station construction

Player Plot UI adds modules → MD `<add_build_to_expand_station>` (X4 9.0+) → engine emits sequence events → engine materializes.

## Cross-references

- [Build module](/game/objects/build-module/) — what executes the sequence
- [Construction sequence (data)](/game/behavior/construction-sequence/) — the data structure
- [Station](/game/objects/station/) — what gets built
- [constructionplans.xml](/lang/data/constructionplans-xml/) — the source of plans
- [stationgroups.xml](/lang/data/stationgroups-xml/) — module composition templates

## Related architectural overviews

- [Galaxy seeding](/overviews/galaxy-seeding/) — initial spawn (parent context)
- *Faction economy* — drives runtime construction requests
- *Plot expansion UX* — player-side construction flow

---

:::tip[Pattern — engine-MD round-trip for physical construction]
Construction sequence is **a request-event-apply pattern**: MD requests, engine ACKs via event, MD applies, engine materializes. The split lets MD see / modify / abort sequences between steps. X4 9.0+ split player-staged builds into a separate `<add_build_to_expand_station>` path — modders need to handle both.
:::

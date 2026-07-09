---
title: Galaxy seeding
description: How the universe is populated at game start. From god.xml declarative input → engine event_god_created_factory → FinaliseStations MD pipeline → operational station in the world.
---

How does X4's universe come to exist at game start? Every shipyard, factory, defence station, NPC, and faction relationship has to be set up before the player presses Continue. This is the **galaxy seeding pipeline** — a three-stage flow from declarative XML to operational world objects.

## The pipeline

```
┌──────────────────────────────────────────┐
│  libraries/god.xml                       │
│  (declarative initial-content XML)       │
└────────────────┬─────────────────────────┘
                 ↓
┌──────────────────────────────────────────┐
│  Engine: parse god.xml,                  │
│  emit event_god_created_factory          │
│  for each <object> entry                 │
└────────────────┬─────────────────────────┘
                 ↓
┌──────────────────────────────────────────┐
│  md/finalisestations.xml                 │
│  God_DefaultFinaliseFactory cue          │
│  (the "finalize" pipeline)               │
└────────────────┬─────────────────────────┘
                 ↓
┌──────────────────────────────────────────┐
│  Engine: connect components,             │
│  apply construction sequences,           │
│  populate cargo & NPCs                   │
└────────────────┬─────────────────────────┘
                 ↓
┌──────────────────────────────────────────┐
│  Operational stations in the world       │
│  (ready for player + NPC interaction)    │
└──────────────────────────────────────────┘
```

## Stage 1: god.xml declarative input

[god.xml](/lang/data/god-xml/) declares every initial station with `<object>` entries:

```xml
<object id="argon_shipyard_1"
    macro="station_arg_shy_1_macro"
    sector="cluster_01_sector_001"
    faction="argon">
  <position x="0" y="0" z="0"/>
</object>
```

The engine reads this file ONCE at game start. After that, god.xml is no longer consulted — changes only affect new games.

## Stage 2: event_god_created_factory

For each `<object>` in god.xml, the engine fires `event_god_created_factory`. The vanilla `md/finalisestations.xml` listens for this event:

```xml
<cue name="God_DefaultFinaliseFactory" instantiate="true" namespace="this">
    <conditions>
        <event_god_created_factory space="player.galaxy"/>
        <check_value value="event.param.isgamestartgodentry"/>
    </conditions>
    <actions>
        <set_value name="$Station" exact="event.param"/>
        <!-- ... build planned modules + construction sequence ... -->
    </actions>
</cue>
```

The `isgamestartgodentry` check distinguishes initial-seed entries from runtime-spawned ones (NPC stations built during gameplay).

## Stage 3: FinaliseStations pipeline

The `FinaliseStations` script (~1100 lines) handles:

1. **Module composition** — reads the station macro to determine planned modules
2. **Construction sequence creation** — calls `<create_construction_sequence>` with the module list
3. **Construction application** — calls `<apply_construction_sequence>` to materialize the modules
4. **Cargo population** — adds initial wares to storage modules
5. **NPC populating** — populates habitation modules and walkable interiors
6. **Loadout** — applies equipment + drones via `set_module_loadout_level`
7. **Final signaling** — fires `signal_objects 'init station'` to notify the station is ready

The pipeline uses [stationgroups.xml](/lang/data/stationgroups-xml/) and [constructionplans.xml](/lang/data/constructionplans-xml/) to know which modules to build and in what order.

## Stage 4: operational stations

After FinaliseStations completes, the station has:
- All planned modules built and connected
- Initial cargo populated
- NPCs in habitation modules and walkable interiors
- Default loadout (turrets, shields, defence drones)
- Trade subscriptions registered
- Faction logic aware of the station

The station is now visible to `find_station_by_true_owner` queries, can receive trade offers, can be boarded, can build ships, etc.

## Variants

### Runtime additions (not god.xml)

For stations built DURING gameplay (NPC factions expanding, player constructing), the same `event_god_created_factory` fires but with `isgamestartgodentry=false`. The same FinaliseStations pipeline runs, except step 4 (cargo population) may be skipped or reduced.

### Player-built stations

Player station construction goes through a slightly different path — the player picks modules via the Plot UI, which calls `<create_construction_sequence>` + `<apply_construction_sequence>`. The same engine events fire, but FinaliseStations distinguishes player-owned vs NPC-owned.

### Headquarters (Player HQ)

The Player HQ has its own dedicated seed-and-init path — `setup.xml` registers it. The HQ doesn't exist until the player completes a quest arc, after which `player.headquarters` becomes non-null.

## Modder implications

### Adding new faction stations

A new faction's stations need:
1. Faction declaration in `libraries/factions.xml`
2. Station group in [stationgroups.xml](/lang/data/stationgroups-xml/)
3. Construction plan in [constructionplans.xml](/lang/data/constructionplans-xml/)
4. Initial seeding in [god.xml](/lang/data/god-xml/)
5. (Optional) god_factions logic for runtime expansion

Without all five, the station may seed but not build correctly, or may not be expandable by NPC faction logic.

### Setup runs once

A common modder mistake: putting init logic in a cue that fires only at GameStart. **This logic doesn't re-fire on save load.** Any runtime state set during seeding must be re-applied from a heartbeat cue on load. See [Setup runs once memory](/game/objects/station/#common-gotchas) for the Station-side gotcha.

### XML escapes

god.xml uses XML attribute values heavily. Standard MD attribute-string traps apply:
- Apostrophes need escaping
- `<` in attribute values needs `&lt;`
- See [Expression → Common gotchas](/lang/md-framework/expression/#common-gotchas)

## References to this overview

- [god.xml](/lang/data/god-xml/) — declarative input file
- [Construction sequence](/game/behavior/construction-sequence/) — runtime data structure
- [Build module](/game/objects/build-module/) — what executes the sequence
- [Station](/game/objects/station/) — what emerges
- [Faction](/game/factions/faction/) — what owns the seeded content
- [Sector](/game/world/sector/) — where seeding places things

## Related architectural overviews

- *Faction economy* — how factions GROW after initial seed
- *Construction sequence* — the runtime mechanism
- *NPC instantiation* — how NPCs populate stations during seeding

---

:::tip[Pattern — three-stage materialization]
Galaxy seeding is a *declarative → engine event → MD pipeline* pattern. Each stage is replaceable: mods can replace the declarative content (god.xml diff), the MD pipeline (replace FinaliseStations), or the engine event handler. Egosoft's design separates concerns cleanly — modders touch one stage without breaking others.
:::

---
title: New faction recipe
description: The three-file pattern for adding a new faction with stations. macros.xml + stationgroups.xml + constructionplans.xml plus god.xml for initial seeding.
---

Adding a new playable faction with its own stations is one of X4 modding's most ambitious tasks. It requires coordinating 4-5 separate data files. This page is the **three-file recipe** for the station side, plus surrounding gotchas.

For just a faction without stations, see [Faction](/game/factions/faction/). For the seed mechanism, see [Galaxy seeding](/overviews/galaxy-seeding/).

## The recipe

```
   Step 1: Declare the faction
   - libraries/factions.xml diff
   - Set primaryrace, default relations, tag
            ↓
   Step 2: Define station macros (per type)
   - Either reuse vanilla macros OR
   - Create new macro files
            ↓
   Step 3: Add station groups (composition)
   - libraries/stationgroups.xml diff
   - Group entries: shipyard_<faction>, wharf_<faction>, ...
            ↓
   Step 4: Add construction plans (build order)
   - libraries/constructionplans.xml diff
   - Plan entries: <faction>_shipyard, ...
            ↓
   Step 5: Add initial seed (god.xml)
   - libraries/god.xml diff
   - <object> entries placing stations in sectors
            ↓
   Step 6: Faction logic integration
   - god_factions / factionlogic_stations updates
   - For runtime expansion (NPC growth)
```

## Step 1: faction declaration

`libraries/factions.xml` diff to add your faction:

```xml
<add sel="//factions">
    <faction id="mlog_my_faction"
        name="My Faction"
        race="argon"
        primary="true"
        ...>
        <relations>
            <relation faction="argon" value="0.1"/>
            <relation faction="xenon" value="-0.5"/>
            ...
        </relations>
        <licences>
            <licence type="dock"/>
            <licence type="buildplot"/>
        </licences>
        <tags>
            <tag value="claim_space"/>
        </tags>
    </faction>
</add>
```

After this, MD scripts can reference `faction.mlog_my_faction` and the faction shows up in the diplomacy menu.

## Step 2: station macros

Decide: reuse or create?

- **Reuse vanilla macros** — your faction uses the same visual + properties as an existing faction. Simpler.
- **Create new macros** — your faction has unique visuals or capabilities. Harder; requires asset work.

For reuse, no work needed — just reference vanilla macros in steps 3-4.

For new macros, see [Assets pipeline](/overviews/assets-pipeline/) for the macro/component/index workflow.

## Step 3: station groups

`libraries/stationgroups.xml` diff. For each station type your faction needs:

```xml
<add sel="//groups">
    <group name="shipyard_mlog_my_faction">
        <module macro="module_x4ep1_pier_buildmodule_macro"/>
        <module macro="module_arg_dock_m_01_macro"/>
        <module macro="module_arg_hab_arg_01_macro"/>
        <!-- ... more modules ... -->
    </group>

    <group name="wharf_mlog_my_faction">
        <module ... />
    </group>
</add>
```

Each `<group>` lists the modules that compose this station type for your faction.

## Step 4: construction plans

`libraries/constructionplans.xml` diff. For each station group, define the build order:

```xml
<add sel="//plans">
    <plan id="mlog_my_faction_shipyard">
        <entry index="1"
            macro="module_x4ep1_pier_buildmodule_macro"/>
        <entry index="2"
            macro="module_arg_pier_connection_macro"/>
        <entry index="3"
            macro="module_arg_dock_m_01_macro"/>
        <!-- ... more entries ... -->
    </plan>
</add>
```

The plan determines what gets built and in what order. Mismatches between plan and group composition cause silent build failures.

## Step 5: god.xml seeding

`libraries/god.xml` diff. For each initial station:

```xml
<add sel="//objects">
    <object id="mlog_my_faction_hq_1"
        macro="station_arg_shy_1_macro"
        sector="cluster_01_sector_001"
        faction="mlog_my_faction">
      <position x="0" y="0" z="0"/>
    </object>
</add>
```

Each object becomes one initial station at game start. See [Galaxy seeding](/overviews/galaxy-seeding/) for the pipeline.

## Step 6: faction logic integration

For NPC expansion to work, your faction needs:

- An entry in faction logic data (so the engine schedules its growth tick)
- Possibly entries in `factionlogic_stations.xml` for placement preferences

This is the most variable step — depends on how integrated you want the faction to be. Vanilla factions get the full treatment; smaller mods may skip expansion and rely on god.xml seeds only.

## Common mistakes

### Forgetting the build module

A station group without a `module_*buildmodule*` doesn't have `.canbuildships`. Even if it's named `shipyard_X`, it won't actually build ships. Always include a build module in shipyard / wharf groups.

### Wrong sector reference in god.xml

`sector="argon_prime"` is wrong. Use the sector's internal id, often `cluster_01_sector_001`-style. Open vanilla `libraries/sectors/...` to find ids.

### Naming mismatches

Vanilla expects `shipyard_<3-letter-faction>` naming. Use `shipyard_mlog_my_faction` and you may have to manually wire up faction logic. Use `shipyard_mlf` (matching faction id `mlf`) for vanilla auto-discovery.

### Index entries not added

If you created new macros (step 2 new path), the engine can't find them without `index/macros.xml` updates. See [Assets pipeline](/overviews/assets-pipeline/).

### god.xml only seeds at game-start

A god.xml diff only affects NEW games. Existing saves don't get the new stations. For mid-save station addition, use MD `<create_object>` actions.

### Faction-relation defaults baked at start

Step 1's `<relation faction="X" value="..."/>` only applies at game-start (or first activation). Existing saves keep their old relation values. For runtime relation setup, use `<set_faction_relation>` from MD.

## Workflow

A typical "add Court of Curbs faction" iteration takes 5-10 builds:

1. First build: factions.xml + god.xml (faction exists, station spawns)
2. Iterate: relations, station modules, naming
3. Eventually: faction logic integration
4. Polish: voice lines, mission tie-ins

Each build adds one piece. Test compatibility with vanilla NPC behaviour each step.

## Related

- [Faction](/game/factions/faction/) — runtime accessors
- [Galaxy seeding](/overviews/galaxy-seeding/) — full pipeline context
- [Assets pipeline](/overviews/assets-pipeline/) — for new station macros
- [god.xml](/lang/data/god-xml/) — schema
- [stationgroups.xml](/lang/data/stationgroups-xml/) — schema
- [constructionplans.xml](/lang/data/constructionplans-xml/) — schema
- [Faction goals](/overviews/faction-goals/) — strategic integration
- [Workflow](/wiki/workflow/) — iteration discipline

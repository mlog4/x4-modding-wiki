---
title: god.xml
description: The galaxy-seed file. Declares which stations, ships, and NPCs spawn at game start, in which sector, owned by which faction.
---

**`libraries/god.xml`** is the galaxy seed file — declarative XML that tells the engine *what's in the world at game start*. Every faction's initial stations, patrol ships, NPC populations, and sector ownership are defined here. Modders extending the galaxy with new factions, stations, or content add entries to `god.xml` via XML diff.

Vanilla `god.xml` is **6133 lines** — the single largest data file modders typically diff against.

## File structure

```xml
<?xml version="1.0" encoding="utf-8"?>
<god xmlns:xsi="..."
    xsi:noNamespaceSchemaLocation="libraries.xsd">

  <objects>
    <!-- Stations: each <object> is one initial station -->
    <object id="argon_shipyard_1"
        macro="station_arg_shy_1_macro"
        sector="sector_001"
        faction="argon"
        comment="Initial Argon shipyard">
      <position x="0" y="0" z="0"/>
    </object>

    <object id="..." />
  </objects>

  <stations>
    <!-- ... -->
  </stations>

  <products>
    <!-- ... -->
  </products>

  <factions>
    <!-- ... -->
  </factions>

</god>
```

The `<objects>` block contains the initial placements. Other blocks handle products (default cargo per ware), factions (override defaults), and edge cases.

## Common `<object>` attributes

| Attribute | Purpose |
|---|---|
| `id="X"` | Unique identifier (referenceable from MD via `find_object` macro lookups) |
| `macro="X"` | Which station/ship macro to spawn |
| `sector="X"` | Where to spawn |
| `faction="X"` | Initial owner |
| `comment="X"` | Author comment |

Children:
- `<position x= y= z=>` — coordinates
- `<rotation roll= pitch= yaw=>` — orientation
- `<quotas>` — for NPC spawn definitions (count, max)
- `<resources>` — initial cargo

## Common patterns

### "Add a new faction's HQ"

```xml
<add sel="//objects">
    <object id="mlog_my_hq"
        macro="station_arg_hq_1_macro"
        sector="sector_007"
        faction="mlog_my_faction"
        comment="MyMod HQ">
      <position x="0" y="0" z="0"/>
    </object>
</add>
```

XML diff — `<add sel="...">` adds new content to the `<objects>` parent.

### "Replace a station's faction"

```xml
<replace
    sel="//objects/object[@id='argon_shipyard_1']/@faction">
    mlog_my_faction
</replace>
```

XML diff — `<replace sel="...">` updates an existing attribute. Used to switch which faction owns a seeded station.

### "Add NPC spawns to a station"

```xml
<add sel="//objects/object[@id='argon_shipyard_1']">
    <quotas>
        <quota galaxy="20" sector="5"/>
    </quotas>
</add>
```

Adds population quotas for the station.

## Common gotchas

- ⚠ **`id=` must be globally unique.** Two `<object>` entries with the same `id` causes one to silently overwrite the other.
- ⚠ **`macro=` must exist in `libraries/macros.xml`.** Referencing a non-existent macro fails silently or with cryptic engine errors.
- ⚠ **`sector=` is the sector ID, not the macro.** Use the sector's *macro-less id* (e.g. `cluster_01_sector_001`). Vanilla pattern in vanilla file.
- ⚠ **Faction must exist in `libraries/factions.xml`.** Custom factions need to be declared there before god.xml references them.
- ⚠ **Initial spawn position must be inside sector bounds.** Out-of-bounds positions may cause the engine to silently relocate or fail.
- ⚠ **Setup runs ONCE — not on save load.** Anything in god.xml affects new games only. To add content mid-save, use MD `<create_object>` actions.
- ⚠ **The full 6133-line god.xml has many implicit relationships.** Adding entries without understanding the surrounding context (god_factions blocks, products, quotas) often breaks NPC populations.

## Architectural context

- **Loaded ONCE at game start.** All entries materialize as runtime objects. After game start, the file isn't re-consulted.
- **Galaxy seeding is god.xml + factionlogic.xml.** god.xml seeds initial content; factionlogic.xml drives runtime growth (new stations, patrols).
- **Modders diff, don't replace.** Always use `<diff>` patches; replacing the entire file conflicts with vanilla updates and other mods.

## Related

- [Faction (game)](/game/factions/faction/) — owner field references factions.
- [Sector (game)](/game/world/sector/) — sector field.
- [Station (game)](/game/objects/station/) — macro field.
- [parameters.xml](/lang/data/parameters-xml/) — NPC placement parameters (separate file).
- [stationgroups.xml](/lang/data/stationgroups-xml/) — station composition (referenced by station macros).
- [Setup runs once, not on load](/game/objects/station/) — memory gotcha.

---

:::tip[Pattern — galaxy seed file]
god.xml is **the single source of truth for "what's in the world at game start"**. Modders extending the galaxy edit here. For runtime additions, use MD actions instead — god.xml is one-shot, MD is dynamic.
:::

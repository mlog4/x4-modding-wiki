---
title: DLC content handling
description: How to write mods that gracefully handle the presence or absence of DLCs. Conditional macros, faction guards, gotchas at script load.
---

X4 has expanded across multiple DLCs — Cradle of Humanity, Split Vendetta, Tides of Avarice, Pirate, Hyperion Pack, Kingdom End. A mod that references DLC content needs to handle players who don't own that DLC. This page is the **DLC-awareness guide**.

## The fundamental rule

**A script that references a non-existent macro / faction / ware fails at load.** Worse: it can cascade and break other scripts in the same file.

Defensive coding: assume any DLC content might be absent.

## Faction guards

```xml
<do_if value="@faction.terran">
    <!-- Terran-dependent logic -->
</do_if>
```

`@faction.terran` returns null if Cradle of Humanity isn't installed. Always null-check.

### Gating cue activation

If an entire cue is DLC-dependent:

```xml
<cue name="TerranSpecificLogic" instantiate="true">
    <conditions>
        <check_value value="@faction.terran"/>
        <!-- ... other conditions ... -->
    </conditions>
    <actions>
        <!-- Safe: only runs if Cradle of Humanity installed -->
    </actions>
</cue>
```

The `check_value` runs at condition-evaluation; without it, the cue references `faction.terran` at activation and errors.

## Macro guards

```xml
<do_if value="@macro.ship_ter_l_destroyer_01_a_macro">
    <create_ship macro="macro.ship_ter_l_destroyer_01_a_macro"
        sector="$sector"
        owner="faction.terran"/>
</do_if>
```

If the DLC isn't installed, the macro lookup returns null. Without the guard, the `create_ship` errors.

### Macro guards in DLC-specific tables

For DLC-specific content in `table[...]` literals, conditional appending is cleaner:

❌ Bad:
```xml
<set_value name="$ships" exact="[
    macro.ship_arg_l_destroyer_01_a_macro,
    macro.ship_ter_l_destroyer_01_a_macro
]"/>
```

This errors at table evaluation if Terran DLC absent.

✅ Good:
```xml
<set_value name="$ships" exact="[
    macro.ship_arg_l_destroyer_01_a_macro
]"/>

<do_if value="@faction.terran">
    <set_value name="$ships.{$ships.count + 1}"
        exact="macro.ship_ter_l_destroyer_01_a_macro"/>
</do_if>
```

Append conditionally rather than inline.

## Ware guards

```xml
<do_if value="@ware.ware_avarice_dlc_specific">
    <add_inventory ware="ware.ware_avarice_dlc_specific"
        exact="5"
        entity="player.entity"/>
</do_if>
```

Same null-check pattern.

## Vanilla DLC checks

Vanilla has a few patterns for detecting DLC presence:

### Check via faction

The most reliable indicator that a DLC is installed:

| Check | Indicates |
|---|---|
| `@faction.terran` not null | Cradle of Humanity installed |
| `@faction.terraintrigger` not null | Cradle of Humanity (alternate check) |
| `@faction.fallensplit` not null | Split Vendetta installed |
| `@faction.scavenger` not null | Pirate DLC installed |
| `@faction.atf` not null | Cradle of Humanity (ATF subfaction) |

### Check via macro

```xml
<do_if value="@macro.ship_atf_xl_carrier_01_a_macro">
    <!-- Cradle of Humanity carrier macros exist -->
</do_if>
```

Use a known-DLC macro as a marker.

### Check via influence (Tides of Avarice)

```xml
<do_if value="@player.influence">
    <!-- Tides of Avarice installed -->
</do_if>
```

The Influence resource only exists with that DLC.

## Cascading DLC chains

Some DLCs depend on others or interact:

- **Tides of Avarice** assumes Cradle of Humanity for some factions
- **Hyperion Pack** adds Argon ships, no faction-level changes
- **Pirate DLC** adds Riptide (scavenger faction) — distinct from Fallen Families (Split Vendetta)

If your mod references Tides content, you may also want to gate on Cradle. Test combinations.

## DLC-specific mission missions

Story missions (`story_*.xml`) are DLC-specific:

- `story_ventures.xml` — Ventures DLC
- `story_buccaneers.xml` — Pirate DLC
- `story_paranid.xml` — base game
- `story_research_welfare_1.xml` — base game

If your mod hooks into a story arc, gate the integration on the relevant DLC presence.

## Content.xml DLC dependencies

In `content.xml`, you can declare DLC dependencies:

```xml
<content id="mlog_my_mod" name="My Mod" version="1.0">
    <dependency id="ego_dlc_terran" optional="true"
        comment="Adds Terran integration"/>
    <dependency id="ego_dlc_pirate" optional="false"
        comment="REQUIRED — Riptide faction logic"/>
</content>
```

| `optional` | Behaviour |
|---|---|
| `true` | Mod loads with or without the DLC; uses runtime checks for DLC-specific paths |
| `false` | Mod refuses to load without the DLC |

Use `optional="true"` for mods with DLC integration that's "nice to have"; use `optional="false"` only when the mod cannot function without the DLC.

## Common DLC traps

### Default values in tables

```xml
<param name="default_macro"
    default="macro.ship_ter_l_destroyer_01_a_macro"/>
```

If the param's default references a DLC macro, the script fails to load when DLC absent. Always use vanilla macros for defaults.

### Faction defaults in factionlogic

```xml
<set_value name="$DefaultEnemy" exact="faction.terran"/>
```

Hardcoded DLC faction as default — breaks for players without DLC. Detect:

```xml
<do_if value="@faction.terran">
    <set_value name="$DefaultEnemy" exact="faction.terran"/>
</do_if>
<do_else>
    <set_value name="$DefaultEnemy" exact="faction.argon"/>
</do_else>
```

### god.xml entries referencing DLC

god.xml uses macro references. If your god.xml diff seeds a Terran station, you need to gate it on the DLC's presence. XML diffs don't support this directly — vanilla handles this via DLC-specific god.xml files in the DLC's extension folder.

For mod authors: split DLC content into a separate XML diff file referenced from content.xml.

### Workshop dependencies on DLC mods

Some Workshop mods require specific DLCs. Check before depending.

## Testing without DLC

To test your mod without DLC:

1. Disable the DLC in Steam (Properties → DLC tab)
2. Launch X4
3. Check that your mod still loads
4. Check that no `Property lookup failed: faction.terran` errors appear
5. Re-enable DLC and verify full integration works

Most DLC bugs in mods surface when the player doesn't own the DLC and the mod crashes at load.

## Related

- [Faction](/game/factions/faction/) — DLC factions and `@faction.X` pattern
- [Macro](/lang/data/macro/) — DLC-gated macros
- [Mod compatibility](/wiki/mod-compatibility/) — broader compatibility discipline
- [Debugging strategies](/wiki/debugging-strategies/) — diagnosing DLC-related errors

---

*Most "my mod doesn't work" bug reports from players turn out to be DLC presence/absence mismatches. Defensive coding pays for itself within the first week of publication.*

---
title: Build
description: A build task entity — represents an active ship/station construction, upgrade, or recycling order on a build module.
---

A **Build** is a build task entity — an active construction, upgrade, recycling, or restocking order on a [Build module](/game/objects/build-module/)'s [buildprocessor](/game/objects/build-module/#buildprocessor-sub-datatype). Each build has a target macro, a customer faction, and a state (waiting / processing / complete / cancelled).

**Inheritance:** None — `build` is its own root datatype.

## Properties

### Identity and state

| Property | Type | Description |
|---|---|---|
| `.exists` | bool | Build exists |
| `.iscancelled` | bool | Has been cancelled |
| `.isprocessing` | bool | Currently being processed |
| `.mayrequireconstructionvessel` | bool | May need a construction vessel |

### Build type flags

| Property | Type | Description |
|---|---|---|
| `.isshipbuild` | bool | Building a ship from scratch |
| `.isrecycleshipbuild` | bool | Recycling a ship |
| `.isexpansion` | bool | Expanding an existing station |
| `.isupgrade` | bool | Upgrading an existing ship |
| `.issoftwareonlyupgrade` | bool | Only updating software |
| `.isrestock` | bool | Restocking (refilling consumables) |
| `.isshipmodification` | bool | Restock OR upgrade |

These flags are mutually informative — vanilla code typically branches on the most-specific applicable flag.

### Parties

| Property | Type | Description |
|---|---|---|
| `.object` | container | The station/dock processing the build |
| `.buildmodule` | buildmodule | The module |
| `.buildprocessor` | buildprocessor | The specific processor |
| `.buildobject` | container | What's being built (whichever of `base` / `construction` is valid) |
| `.base` | container | Pre-existing target (for upgrades / restocks) |
| `.construction` | container | Newly-created target (for from-scratch builds) |
| `.faction` | faction | Faction the build is for |
| `.macro` | macro | What's being built |

`.base` and `.construction` are mutually exclusive — one is null. Use `.buildobject` to get whichever is valid.

### Timing

| Property | Type | Description |
|---|---|---|
| `.time` | time | When created (game time) |
| `.age` | time | How long ago created |

### Loadout

| Property | Type | Description |
|---|---|---|
| `.loadout` | string | Loadout id (null if custom or omitted) |
| `.loadoutfaction` | faction | Faction for loadout retrieval |

### Resources and finance

| Property | Type | Description |
|---|---|---|
| `.consumables` | table | Map of consumable macro → amount |
| `.price` | money | Price when build was added |
| `.transferredamount` | money | Money already moved (+ from buyer, - refunded) |

### Construction sequence

| Property | Type | Description |
|---|---|---|
| `.constructionsequence` | constructionsequence | The sequence backing this build |

### Position

| Property | Type | Description |
|---|---|---|
| `.zone` | zone | Where the build lives |
| `.position` | position | Position in zone |
| `.rotation` | rotation | Orientation in zone |

## Common patterns

### "Branch by build type"

```xml
<do_if value="$build.isshipbuild">
    <!-- new ship from a shipyard / wharf -->
</do_if>
<do_elseif value="$build.isexpansion">
    <!-- adding modules to a station -->
</do_elseif>
<do_elseif value="$build.isupgrade">
    <!-- refitting an existing ship -->
</do_elseif>
<do_elseif value="$build.isrecycleshipbuild">
    <!-- breaking down a ship for resources -->
</do_elseif>
```

### "Find what's being built — base or construction"

```xml
<set_value name="$Target"
    exact="if @$build.construction
           then $build.construction
           else $build.base"/>
```

Or simply:

```xml
<set_value name="$Target" exact="$build.buildobject"/>
```

The accessor `.buildobject` already abstracts this.

### "Track player build progress"

```xml
<find_station_by_true_owner name="$Stations"
    space="player.galaxy"
    faction="faction.player"
    multiple="true"/>

<set_value name="$ActiveBuilds" exact="0"/>

<do_for_each name="$s" in="$Stations">
    <do_for_each name="$build" in="$s.builds.inprogress">
        <set_value name="$ActiveBuilds"
            operation="add" exact="1"/>
    </do_for_each>
</do_for_each>

<write_to_logbook
    text="$ActiveBuilds + ' active player builds'"/>
```

The `.builds.inprogress` accessor is on [Container](/game/objects/container/).

## Common gotchas

- ⚠ **`.base` and `.construction` are mutually exclusive.** One is null. Use `.buildobject` to get whichever is valid.
- ⚠ **`.isshipmodification` is OR over `.isupgrade` + `.isrestock`.** Don't double-count.
- ⚠ **`.consumables` is a `table`, not a wareamountlist.** Iterate via table accessors, not `.list`.
- ⚠ **`.transferredamount` is signed.** Positive = paid by player, negative = refunded. Mod code that tracks "what's spent" should use absolute values.
- ⚠ **`.macro` is what's being built, not the build's own macro.** Build is not a physical object — it has no macro of its own.
- ⚠ **`.zone` is where the build will physically appear.** For shipyard builds, that's the shipyard's zone. For expansions, the host station's zone.

## Related

- [Build module](/game/objects/build-module/) — where builds run.
- [Buildprocessor](/game/objects/build-module/#buildprocessor-sub-datatype) — the specific processor executing a build.
- [Construction sequence](/game/behavior/construction-sequence/) — `.constructionsequence` accessor.
- [Loadout](/game/behavior/loadout/) — `.loadout` is the loadout id.
- [Container](/game/objects/container/) — `.builds.queued` / `.builds.inprogress` / `.builds.todelete` lists.

---

:::tip[Pattern — task entity with type flags]
Build is a *task* entity — long-lived but transient (minutes to hours). Branch by the type flags to handle ship-build vs station-expansion vs ship-upgrade differently. Same shape as [Trade](/game/behavior/trade/), [Boardingoperation](/game/behavior/boarding-operation/).
:::

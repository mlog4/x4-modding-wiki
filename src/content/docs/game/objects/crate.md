---
title: Crate
description: Destructible container inside dockingbays. Holds money, timeline entries, and audiologs. Story / interior content, NOT the floating cargo class.
---

A **Crate** is a destructible interior container — the box NPCs place inside a [Dockingbay](/game/objects/dockingbay/) for the player to walk up to and loot. Crates hold money (`$N` credits), timeline entries (story snippets), and audiologs (voice content). They are the dock-floor equivalent of [Lockboxes](/game/objects/lockbox/) (which are in space).

**Inheritance:** `component → destructible → crate`. Note: crate extends `destructible` directly, **not** `object`. Crates are interior objects placed in dockingbay slots — they don't have an independent `.sector` / `.zone` of their own; their position is the parent dockingbay.

**Don't confuse with:**
- [Lockbox](/game/objects/lockbox/) — floating in space, has shootable locks, found via `class.lockbox`.
- "Container" wares like `ware.containerstack` — those are wares for transport, not the runtime crate class.
- `tag.crate_s` — that's the SLOT tag at dockingbays (where crates can be placed), not the class.

## Properties

### Crate-specific

| Property | Type | Description |
|---|---|---|
| `.money` | money | Credits inside (paid to player on opening) |
| `.timeline` | list | Timeline entry ids revealed on opening |
| `.audiologs` | list | Audiolog entry ids revealed on opening |

### Inherited from destructible

| Property | Source | Description |
|---|---|---|
| `.hull` / `.hullpercentage` | destructible | Damage state |
| `.parent` | component | The dockingbay/room/component holding this crate |

## Placement model

Crates live in *crate slots* tagged `tag.crate_s` inside dockingbays. The vanilla pattern to find available slots:

```xml
<find_crate_slot
    name="$Slots"
    object="$DockingBay"
    tags="tag.crate_s"
    multiple="true"/>
```

Pattern from vanilla `story_paranid.xml:5210, 5247, 8669`, `gmc_retrieve_dead_drop.xml:2108`, `gm_prisonbreak.xml:552`. Use `find_crate_slot` (a dedicated action) — NOT `find_object`.

## Actions

### Find available crate slots in a station

```xml
<do_for_each name="$Station" in="$Candidates">
    <do_for_each name="$DockingBay" in="$Station.dockingbays">
        <find_crate_slot
            name="$Slots"
            object="$DockingBay"
            tags="tag.crate_s"
            multiple="true"/>
        <do_for_each name="$Slot" in="$Slots">
            <!-- one usable slot -->
        </do_for_each>
    </do_for_each>
</do_for_each>
```

### Place a story-content crate

The actual placement is engine-driven on story-cue triggers; modders typically reference the crate macro and let the `find_crate_slot` + cue-spawned crate path handle it. Vanilla doesn't expose a clean public `<create_crate>` action — work through story cues.

### Filter "this is a crate-class container"

```xml
<do_if value="$ItemHolder.isclass.crate">
    <!-- handle crate-specific reward delivery -->
</do_if>
```

Pattern from `gm_bringitems.xml:399, 1817, 1833`.

The canonical "any loot holder" check combines crate with lockbox and collectablewares:

```xml
<do_if value="$ItemHolder.isclass.[class.lockbox,
    class.collectablewares, class.crate]">
    <!-- any drop-target the player can collect from -->
</do_if>
```

Pattern from `gm_bringitems.xml:391`.

## Events

There is no `event_crate_X` family. Crate opening is signalled through general object events:

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Crate looted / destroyed | Filter `event.object.isclass.{class.crate}` |
| `event_object_attacked` | Crate attacked (player can shoot some) | Standard |

When the player loots a crate, the engine destroys it after distributing rewards.

## Common gotchas

- ⚠ **Crate is destructible-derived, not object-derived.** No `.sector` / `.zone` / `.position` on the crate itself — get them from `.parent.sector` (the containing dockingbay).
- ⚠ **`find_crate_slot` is a dedicated action, NOT `find_object`.** Trying `find_object class="class.crate" tags="tag.crate_s"` will not work — there's no class.crate_slot.
- ⚠ **`tag.crate_s` is the slot tag, not the crate tag.** Used by `find_crate_slot tags=` to filter where crates can go.
- ⚠ **`.money` is in 1/100-credit units.** Same scale as elsewhere. A `.money` of `5000000` = 50 000 Cr.
- ⚠ **Crates are NOT lockboxes.** Different class, different placement (interior vs space), different lifecycle. Don't conflate.
- ⚠ **`.timeline` / `.audiologs` are id lists, not entry texts.** Same as [Lockbox](/game/objects/lockbox/) — look up entries in `timelines.xml` / `audiologs.xml`.
- ⚠ **`find_crate_slot` returns slot components, not crate objects.** You then place a crate into the slot. Don't try to read crate properties directly from `find_crate_slot` results.

## Examples

### Example 1: Find any docking bay with a free crate slot

```xml
<find_station_by_true_owner name="$Stations"
    space="player.galaxy"
    faction="faction.player"
    multiple="true"/>

<set_value name="$found" exact="null"/>

<do_for_each name="$Station" in="$Stations">
    <do_for_each name="$DB" in="$Station.dockingbays">
        <find_crate_slot
            name="$Slots"
            object="$DB"
            tags="tag.crate_s"
            multiple="true"/>
        <do_if value="$Slots.count gt 0">
            <set_value name="$found" exact="$DB"/>
            <break/>
        </do_if>
    </do_for_each>
    <do_if value="@$found">
        <break/>
    </do_if>
</do_for_each>

<do_if value="@$found">
    <write_to_logbook
        text="'Free crate slot at: '
            + $found.parent.knownname"/>
</do_if>
```

### Example 2: Detect when the player looted a high-value crate

```xml
<cue name="WatchPlayerCrateLoot" instantiate="true">
    <conditions>
        <event_object_destroyed/>
        <check_value
            value="event.object.isclass.{class.crate}
                and event.object.money gt 100000Cr
                and event.param.isplayerowned"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player looted high-value crate: '
                + (event.object.money / 100) + 'Cr'"/>
    </actions>
</cue>
```

## Architectural context

- **Story-cue crate placement:** Architectural overview *Story rewards* — story cues find crate slots via `find_crate_slot`, place narrative crates (timeline / audiolog content), then watch for destruction to confirm player loot.
- **Crate vs lockbox vs collectable:** Architectural overview *Loot classes* — three distinct mechanisms for delivering wares / money to the player.

## Related

- [Lockbox](/game/objects/lockbox/) — sibling loot object, but in space with shootable locks (different mechanic).
- [Dockingbay](/game/objects/dockingbay/) — what hosts crates via `tag.crate_s` slots.
- [Station](/game/objects/station/) — top-level container; access via `Station.dockingbays`.
- [Ware](/game/economy/ware/) — what crates may give the player (sometimes).
- [Datavault](/game/objects/datavault/) — sibling story-content object (3-state lock vs single loot).

---

:::tip[Pattern — interior content via tagged slots]
Crate is the canonical example of "engine places content in tagged slots at runtime". The `find_crate_slot` + `tag.crate_s` idiom appears throughout story content. Same idiom for [NPC](/game/characters/npc/) placement at `tag.npc_*` slots.
:::

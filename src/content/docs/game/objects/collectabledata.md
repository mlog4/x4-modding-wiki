---
title: Collectable data
description: Floating data drop — gives timeline entries and audiologs on pickup. Story-content pickup separate from data vaults.
---

A **Collectable data** is a floating pickup that grants timeline entries and audiologs. Used for "found a data fragment in space" story moments. Distinct from [Data vault](/game/objects/datavault/) (which requires multi-stage unlock and has on-station UI).

**Inheritance:** `component → destructible → object → drop → collectable → collectabledata`.

## Properties

### Collectable-data-specific

| Property | Type | Description |
|---|---|---|
| `.timeline` | list | Timeline entry ids revealed on pickup |
| `.audiologs` | list | Audiolog entry ids revealed on pickup |

### Useful inherited

| Property | Source | Description |
|---|---|---|
| `.sector` / `.position` | object | Location |
| `.macro` | component | Macro |

## Comparison with Data vault

| | Collectable data | [Data vault](/game/objects/datavault/) |
|---|---|---|
| Location | Floating in space | On a station / world position |
| Pickup mechanic | Fly over | Walk up + multi-stage unlock |
| Repeat | One-shot | Three-state (locked / partial / unlocked) |
| Content | timeline + audiologs | timeline + audiologs (via unlock) |
| Class | `class.collectabledata` | `class.datavault` |

Both deliver the same content types (timeline / audiologs) but via different UX flows.

## Common patterns

### "Listen for player picking up data"

```xml
<cue name="WatchDataPickup" instantiate="true">
    <conditions>
        <event_object_destroyed/>
        <check_value
            value="event.object.isclass.{class.collectabledata}
                and event.param.isplayerowned"/>
    </conditions>
    <actions>
        <set_value name="$data" exact="event.object"/>
        <do_for_each name="$tl" in="$data.timeline">
            <write_to_logbook
                text="'Timeline entry: ' + $tl"/>
        </do_for_each>
    </actions>
</cue>
```

### "Filter for data-bearing drops in a sector"

```xml
<find_object
    groupname="$Drops"
    class="class.collectabledata"
    space="$Sector"
    multiple="true"/>
```

## Events

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Player picked it up | Standard |

## Common gotchas

- ⚠ **`.timeline` / `.audiologs` are ID lists, not entries.** Look up entries via `timelines.xml` / `audiologs.xml`. Same as [Lockbox](/game/objects/lockbox/) and [Crate](/game/objects/crate/).
- ⚠ **One-shot pickup.** Unlike data vaults, collectabledata is consumed on first pickup. No "partial unlock" state.
- ⚠ **Engine-driven content delivery.** Vanilla doesn't expose a `<grant_timeline>` action explicitly — the engine handles content delivery when the collectabledata is destroyed by player. Don't try to manually replicate.
- ⚠ **Rare in vanilla.** Most timeline / audiolog content arrives through data vaults, crates, or mission cues. Collectabledata is the simplest "find data in space" form.

## Related

- [Collectable](/game/objects/collectable/) — parent.
- [Datavault](/game/objects/datavault/) — sibling (different mechanic — on-station unlock).
- [Crate](/game/objects/crate/) — sibling (dock-slot content holder).
- [Lockbox](/game/objects/lockbox/) — sibling (shootable-lock content holder).

---

:::tip[Pattern — content pickup with engine-driven delivery]
Collectabledata is one of three vanilla mechanisms for delivering timeline/audiolog content (the others being [Lockbox](/game/objects/lockbox/) and [Crate](/game/objects/crate/)). All three end up calling the same engine pipeline; the differences are entirely UX.
:::

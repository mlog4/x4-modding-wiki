---
title: Signal leak
description: A hackable side-quest object that spawns on stations. Players approach and shoot/scan to gain wares, voice clips, or mission hooks.
---

A **Signal leak** is a hackable side-quest object that spawns at random positions on stations. The player approaches and interacts (shoot or scan) to receive a reward — depending on the leak's type, the reward can be a voice clip, a mission offer, or a data fragment. Signal leaks are how vanilla generates the bulk of side-mission discovery and ambient-flavour content.

**Inheritance:** `component → signalleak`. The datatype extends `component` directly (not `destructible`) — signal leaks are not physical objects you shoot to destroy; they are interactive markers handled by mission cues.

## Properties

### Signal-leak-specific

| Property | Type | Description |
|---|---|---|
| `.type` | signalleaktype | Type enum — `data` / `voice` / `mission` (verified vanilla values) |
| `.islocked` | bool | Leak is locked (player can't yet activate) |

### Useful inherited

| Property | Source | Description |
|---|---|---|
| `.parent` | component | Containing station / module |
| `.macro` | component | Leak macro |
| `.knownname` | component | Display name (typically generic) |

## Leak types (signalleaktype enum)

Verified from vanilla usage:

| Type | Behaviour | Vanilla sources |
|---|---|---|
| `signalleaktype.data` | Data fragment — unlocks blueprint pieces or ware drops | `gm_repairsignalleaks.xml:872, 877, 1028, 1210`, `placedobjects.xml:777-850` (heavy seeding) |
| `signalleaktype.voice` | Voice clip — flavour content from a station NPC | `notifications.xml:3330, 3362` |
| `signalleaktype.mission` | Mission offer — opens a side mission | `notifications.xml:3334, 3367` |

`data` is the most-common type — vanilla `placedobjects.xml` seeds many of them across stations.

## Actions

### Find signal leaks of a given type on a station

```xml
<find_object_component
    name="$Leaks"
    object="$TargetStation"
    signalleaktype="signalleaktype.data"
    multiple="true"/>
```

Pattern from vanilla `gm_repairsignalleaks.xml:1028`. The `signalleaktype=` filter is **a dedicated find attribute** — you can't filter by type in regular `find_object`.

### Match content (mission filter)

```xml
<match_content
    signalleaktype="signalleaktype.data"
    min="1"/>
```

Pattern from `gm_repairsignalleaks.xml:872, 877`. Used by mission cues to declare "this mission needs at least one data leak available".

### Update voice content on an existing leak

```xml
<update_signal_leak_voice
    object="$Leak"
    page="$Client.page"
    lines="$VoiceTable.$SignalLeakVoiceLine"/>
```

Pattern from `gm_hackpanel.xml:338`, `gm_bringitems.xml:570`, `gm_prisonbreak.xml:297`, `gm_transport_passengers.xml:570`, `gmc_improve_station_defences.xml:405`. Mission generators commonly attach custom voice to a leak when it becomes a mission-offer hook.

### Filter for "is this offer source a signal leak?"

```xml
<do_if value="$OfferObject.isclass.signalleak">
    <!-- handle leak-based offer differently from station-based -->
</do_if>
```

Pattern from `gm_hackpanel.xml:336`, `gm_bringitems.xml:568`, `gm_prisonbreak.xml:295`, `gm_transport_passengers.xml:523, 568`, `gmc_improve_station_defences.xml:403`. Most generic mission cues use this to branch leak-source vs station-source flows.

## Events

There is no `event_signalleak_X` family. Leak lifecycle is observed through:

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Leak destroyed (player activated it / cue cleaned up) | Standard |
| `event_player_signalled` (with custom params) | Used by `notifications.xml` to fire UI notifications |

## Common gotchas

- ⚠ **Signal leaks extend `component`, NOT `destructible`.** No `.hull` — they don't have HP; activation is mission-controlled, not damage-based.
- ⚠ **`signalleaktype` is a dedicated `find_object_component` attribute.** A bare `find_object class=class.signalleak` returns leaks but doesn't filter by type. Use the `signalleaktype=` attribute.
- ⚠ **Data vault signal leaks are filtered out by vanilla.** `signal_leaks.xml:323` explicitly ignores leaks tagged for data vaults — they're a separate quest mechanism. Don't expect data-vault leaks in your `signalleaktype.data` queries.
- ⚠ **`.islocked` controls UI activation.** A locked leak shows in the world but isn't yet interactive. Vanilla uses this for delayed-unlock content.
- ⚠ **`update_signal_leak_voice` is mission-cue territory.** It modifies an existing leak's voice content — used by generic missions to attach quest-specific dialogue. Don't call it on leaks your mod doesn't own.
- ⚠ **Leaks spawn per-station via `placedobjects.xml`.** `signalleaktype.data` is seeded heavily; `voice` and `mission` are dynamically attached by generic-mission cues at runtime. Don't expect equal distribution.

## Examples

### Example 1: Count data leaks on a station

```xml
<find_object_component
    name="$Leaks"
    object="$Station"
    signalleaktype="signalleaktype.data"
    multiple="true"/>

<write_to_logbook
    text="$Station.knownname + ' has '
        + $Leaks.count + ' data leaks'"/>
```

Pattern from `gm_repairsignalleaks.xml:1028`.

### Example 2: Attach a custom voice line to a leak (mission cue)

```xml
<do_if value="$OfferObject.isclass.signalleak">
    <update_signal_leak_voice
        object="$OfferObject"
        page="$Client.page"
        lines="$VoiceTable.$SignalLeakVoiceLine"/>
</do_if>
```

Standard pattern across vanilla generic missions when offer-objects can be either station or leak.

### Example 3: Find player-visible data leaks

```xml
<find_station_by_true_owner name="$Stations"
    space="player.galaxy"
    multiple="true"/>

<create_list name="$KnownLeaks"/>

<do_for_each name="$s" in="$Stations">
    <find_object_component
        name="$Leaks"
        object="$s"
        signalleaktype="signalleaktype.data"
        multiple="true"/>

    <do_for_each name="$leak" in="$Leaks">
        <do_if value="$leak.knowntoplayer
            and not $leak.islocked">
            <append_to_list name="$KnownLeaks"
                exact="$leak"/>
        </do_if>
    </do_for_each>
</do_for_each>

<write_to_logbook
    text="'Player knows ' + $KnownLeaks.count
        + ' active data leaks'"/>
```

## Architectural context

- **Generic missions hooked to leaks:** Architectural overview *Mission framework* — how `gm_*` cues filter `$OfferObject.isclass.signalleak` to branch flow.
- **Leak seeding mechanics:** Architectural overview *Random spawn placement* — `placedobjects.xml` seeds data leaks; voice and mission leaks attached at runtime.
- **Repair-leaks side-quest:** Architectural overview *Repair-leaks mission* — `gm_repairsignalleaks.xml` is the canonical "find and patch" mission template.

## Related

- [Station](/game/objects/station/) — host; leaks attach to stations.
- [Datavault](/game/objects/datavault/) — uses signal leaks as hint markers (filtered out of standard leak queries).
- [Ware](/game/economy/ware/) — data leaks can drop ware rewards.

---

:::tip[Pattern — component-only with mission-cue lifecycle]
Signal leak is the canonical *quest-anchor component* — no HP, no physical lifecycle, lifetime managed by mission cues. The `update_signal_leak_voice` action lets mission cues mutate existing leaks rather than spawning new ones.
:::

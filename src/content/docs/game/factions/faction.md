---
title: Faction
description: An entity that owns objects, has relations to other factions, accumulates money. The base unit of who-controls-what.
---

A **Faction** is an entity that owns objects in the universe, has bilateral relations with every other faction, accumulates money, and decides strategic actions. Every persistent thing in the universe ([Station](/game/objects/station/), [Ship](/game/objects/ship/), [Module](/game/objects/module/), [NPC](/game/characters/npc/)) is owned by some faction.

**Subtypes (by behavior):** *Player* (`faction.player`) and *NPC factions* share the same datatype but differ in how engine-side AI drives them — NPC factions run `factionlogic.xml` heartbeat, the player does not. Some properties (`willclaimspace`, `isaggressive`, `iseconomic`) are tag-driven; see `libraries/factions.xml` for the definitive list.

**Primary races:** Argon, Paranid, Teladi, Split, Terran, Boron, Xenon, Khaak — see `.primaryrace` accessor. Note that "Riptide" is a [scavenger](/game/factions/scavenger/) sub-faction with `primaryrace=argon`, **not** Fallen Families — easy mistake.

## Properties

The most-used accessors for modders. The full list (~60 properties) is in vanilla `libraries/scriptproperties.xml:1820`.

### Identity

| Property | Type | Description |
|---|---|---|
| `.id` | string | Internal id (e.g. `argon`, `khaak`) |
| `.name` | string | Display name (respects unknown-status — may show "???") |
| `.knownname` | string | Display name, ignoring unknown-status |
| `.shortname` / `.prefixname` | string | Short / prefix forms |
| `.primaryrace` | race | The race this faction is associated with |
| `.isactive` | bool | Currently active (some factions deactivate mid-game) |
| `.knowntoplayer` | bool | Player has met them |

### Relations

| Property | Type | Description |
|---|---|---|
| `.relationto.{faction}` | float | Relation to another faction. Raw float -1.0 .. +1.0 |
| `.relationto.{object}` | float | Relation to owner of an object |
| `.defaultrelationto.{faction}` | float | What relation would be without runtime changes |
| `.relation.{rangename}.min` / `.mid` / `.max` | float | Edges of a named relation range |
| `.relation.{numeric}.uivalue` | int | UI form (-30 .. +30) of a float relation value |
| `.hasrelation.{rangename}.{X}` | bool | Is relation to X in the given range |
| `.mayattack.{component or faction}` | bool | Will *this* faction shoot at X |
| `.ishostileto.{component or faction}` | bool | Either side may shoot |
| `.isrelationlocked` | bool | Relation cannot be changed |

**Relation ranges** (named ranges in `libraries/factions.xml`):

| Range | Float | UI | Meaning |
|---|---|---|---|
| nemesis | −30 only | −30 | Maximally hostile, flavour |
| kill | −25 .. −30 | −25 .. −30 | All assets attacked on sight |
| killmilitary | −20 .. −30 | −20 .. −30 | Military assets attacked |
| enemy | −10 .. −30 | −10 .. −30 | No docking; stations don't report player attacks |
| neutral | 0 (excl.) | 0 | Tolerated |
| friend / ally / dock | various positive | 10..30 | Docking and trading allowed |

### Money

| Property | Type | Description |
|---|---|---|
| `.money` | money (Cr × 100 internally) | Current faction account balance |
| `.hasownaccount` | bool | If false, uses dummy random-sum account |

### Tags & roles

| Property | Type | Description |
|---|---|---|
| `.tags` | list | All faction tags (`tag.claimspace`, `tag.economic`, `tag.aggressive`, ...) |
| `.hastag.{tag}` | bool | Has tag |
| `.isaggressive` / `.iseconomic` / `.ispolice` / `.isprotective` | bool | Behavioural tags |
| `.willclaimspace` | bool | Will claim sectors if it has a claim-granting station |
| `.policefaction` | faction | Which faction is its police force |

### Resources & licences

| Property | Type | Description |
|---|---|---|
| `.headquarters` | station | This faction's HQ station |
| `.representative` | entity | Embassy representative NPC |
| `.diplomat` | entity | Diplomat NPC |
| `.licences` | list | All licences this faction *grants* |
| `.heldlicences` | list | All licences this faction *holds* (from other factions) |
| `.haslicence.{type}.{faction}` | bool | Has licence of `<type>` from `{faction}` |
| `.doesresupply` | bool | Will resupply ships at owned docks |

## Actions

### Change a faction's relation to another faction (permanent)

```xml
<set_faction_relation
    faction="$Faction"
    otherfaction="faction.player"
    value="$Faction.relation.dock.min + 0.001"
    reason="relationchangereason.missioncompleted"/>
```

`reason=` is the engine's audit trail — pick a `relationchangereason.X` enum value. The comment in vanilla:
> `+ 0.001` to move into the 'docking' UI value range — range edges are exclusive on one side.

### Change a single object's relation (temporary, with decay)

```xml
<set_relation_boost
    object="$AttackedShip"
    otherobject="$Attacker"
    value="$AttackedShip.owner.relation.kill.min"
    delay="10min"
    decay="1"
    reason="relationchangereason.attackedobject"
    silent="true"/>
```

This affects only the object, decays over time. `silent="true"` suppresses the on-screen notification. Use this for "make this NPC hate the player for 10 min" rather than permanent shifts.

### Engine-computed reputation changes

For attacks, kills, and boarding the engine has dedicated actions that read damage / weapon / context and apply the right curve:

```xml
<change_relation_on_attack
    attacker="player.controlled"
    attacked="event.param"
    method="event.param2"
    weapon="event.param3.{2}"
    result="$relchange"/>

<change_relation_on_kill
    killer="player.controlled"
    killed="event.param"
    method="event.param2"
    result="$relchange"/>

<change_relation_on_boarding
    boarder="player.controlled"
    boarded="$object"
    attempt="true"
    result="$relchange"/>
```

See vanilla `notifications.xml:1515, 1737, 1796` for the canonical wiring.

### Find all factions with a given relation

```xml
<get_factions_by_relation
    result="$EnemyFactions"
    faction="$Faction"
    relation="enemy"
    activeonly="true"/>
```

`relation=` takes a named range; `activeonly=true` skips inactive factions.

### Transfer money

```xml
<transfer_money
    from="$Faction"
    to="faction.player"
    amount="($Reward)Cr"/>
```

`amount=` must be a `money` type — wrap dynamic numbers as `($N)Cr`, not bare integers.

### Change asset ownership

```xml
<set_owner object="$Station" faction="$NewOwner"/>
```

For ships, prefer `md.LIB_Generic.TransferShipOwnership` — it severs the old commander's fleet link, which bare `set_owner` does not. See [Station → Actions](/game/objects/station/#change-owner).

## Libraries

Vanilla helpers for working with factions. Source: `md/lib_generic.xml`.

| Library | Purpose | Source line |
|---|---|---|
| `md.LIB_Generic.DetermineEnemyFaction` | Find a random enemy of `$Faction` (or return all) | 1482 |
| `md.LIB_Generic.CalculateReputation` | Compute reputation gain from a contribution | 376 |
| `md.LIB_Generic.CalculateReputationDrop` | Compute reputation drop from a hostile act | 411 |
| `md.LIB_Generic.FixFactionRepresentative` | Restore missing representative NPC after save load | 1651 |
| `md.LIB_Generic.WaitForFactionsToHaveStations` | Wait until ALL given factions have at least one station | 4254 |
| `md.LIB_Generic.FindNearestStationForFaction` | Closest station of given faction to position | 1240 |
| `md.LIB_Generic.FindStationsForFactionByDistance` | All stations sorted by distance | 1270 |
| `md.LIB_Generic.FindNearestEnemySectorForFaction` | Nearest sector controlled by an enemy of $Faction | 1326 |
| `md.LIB_Generic.GetSectorSafety` | Friend/enemy station ratio in a sector, evaluated for a faction | 4703 |

## Events

| Event | When | Notes |
|---|---|---|
| `event_faction_relation_changed` | Bilateral relation between two factions changed | `event.param` = `[fA, fB]`. Use `faction=` and optionally `otherfaction=` attributes to filter |
| `event_faction_activated` | Faction transitioned to active | Vanilla uses for diplomacy intros |
| `event_faction_deactivated` | Faction transitioned to inactive | Triggers cleanup of pending operations |
| `event_faction_police_changed` | `policefaction` changed | Used by `faction_relations.xml` |
| `event_object_changed_owner` | An object changed faction (boarding, transfer, capture) | Object-side; not faction-side |

## Common gotchas

- ⚠ **`.relationto` returns a raw float (-1.0..+1.0), not the UI value.** Doing `.relationto.{Y}.uivalue` silently returns null. To get UI: `$F.relation.{$F.relationto.{Y}}.uivalue`. For float thresholds (most common), compare floats directly (0.10, 0.20, 0.50).
- ⚠ **`.money` is stored as 1/100-credit integer.** A reading of `1000000` means **10 000 Cr**. The same scale applies to `sellprice`/`buyprice` in logs. Divide by 100 only for display.
- ⚠ **`transfer_money amount=` needs `money` type.** A dynamic `($val)Cr` works; a bare integer logs *"not of type money"* and silently no-ops. See [memory: transfer_money requires money type](#).
- ⚠ **`set_faction_relation` vs `set_relation_boost`.** `set_faction_relation` is the *permanent baseline* between two factions. `set_relation_boost` is *time-decaying* per-object. For "this NPC ship is mad at the player for 10 min" use boost; for "Argon now likes the player +5 from a mission" use `set_faction_relation` (or let the engine do it via `change_relation_on_*`).
- ⚠ **Relation range edges are exclusive on one side.** Vanilla often adds `+0.001` to `relation.dock.min` to actually land *inside* the docking range. Read the property description: *"in 'neutral' and 'dock' the .min value is NOT included"*.
- ⚠ **`faction.X` lookups for missing factions return null silently.** A DLC-gated `faction.terran` is null on a Base-only install. Wrap DLC-faction references with `<do_if value="@faction.terran">`.

## Examples

### Example 1: Find a random enemy faction for AI raiders

```xml
<run_actions ref="md.LIB_Generic.DetermineEnemyFaction"
    result="$Enemy">
    <param name="Faction" value="faction.argon"/>
    <param name="ClaimSpaceFactionsOnly" value="true"/>
</run_actions>

<do_if value="@$Enemy">
    <write_to_logbook
        text="'Picked enemy: ' + $Enemy.knownname"/>
</do_if>
```

### Example 2: Reward the player when a side mission completes

```xml
<set_value name="$RewardCr" exact="50000"/>

<transfer_money
    from="$QuestGiver"
    to="faction.player"
    amount="($RewardCr)Cr"/>

<set_faction_relation
    faction="$QuestGiver"
    otherfaction="faction.player"
    value="$QuestGiver.relationto.{faction.player} + 0.05"
    reason="relationchangereason.missioncompleted"/>
```

### Example 3: Listen for player relation reaching docking with Argon

```xml
<cue name="WatchArgonRelation" instantiate="true">
    <conditions>
        <event_faction_relation_changed
            faction="faction.player"
            otherfaction="faction.argon"/>
        <check_value
            value="faction.player.hasrelation.dock.{faction.argon}"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Argon now allows player docking.'"/>
    </actions>
</cue>
```

## Architectural context

- **How factions decide what to produce, build, or buy:** Architectural overview *Faction economy* — per-faction `Econ_Manager` reads shortages, picks one of 7 corrective actions.
- **How factions pick strategic actions (invade, hold, plunder, patrol):** Architectural overview *Faction goals* — Registry + two-tier evaluation (PriorityGoals must-run + EvaluatedGoals competition).
- **How factions evaluate distress calls:** Architectural overview *Patrol coordination* — galaxy combat bus + per-faction priority queue.
- **Faction relations seeding:** `libraries/factions.xml` declares default relations; runtime changes go through `set_faction_relation` with `relationchangereason.X` audit.

## Related

- [Race](/game/factions/race/) — `primaryrace` of a faction (argon, paranid, ...).
- [NPC](/game/characters/npc/) — the people that belong to a faction.
- [Station](/game/objects/station/) — owned by a faction.
- [Ship](/game/objects/ship/) — owned by a faction.
- [Ware](/game/economy/ware/) — produced and traded by a faction's stations.
- [Licence](/game/factions/licence/) — diplomatic privileges a faction grants.

---
title: Control panel
description: Hackable interaction point on stations and ships. Players use inventory items to bypass — turrets, engineers, storage, watchdogs all become controllable via panel-specific hack types.
---

A **Control panel** is a hackable interaction point inside a [Ship](/game/objects/ship/) or on a [Station](/game/objects/station/) module. The player walks up to one, spends inventory items (security slicers, decryption systems), and gains control over a specific subsystem of the target — turrets, engineer, shield generators, storage, or watchdogs. Control panels are the core of the hacking gameplay loop.

**Inheritance:** `component → destructible → controlpanel`. Like [Weapon](/game/objects/weapon/), [Engine](/game/objects/engine/), [Shield generator](/game/objects/shield-generator/) — extends destructible directly, **not** object.

## Properties

### Control-panel-specific

| Property | Type | Description |
|---|---|---|
| `.type` | controlpaneltype | Type of panel — determines which subsystem it hacks |
| `.requireditems` | wareamountlist | Items needed to complete the hack |

### Inherited

| Property | Source | Description |
|---|---|---|
| `.hull` / `.hullpercentage` | destructible | Damage state |
| `.parent` | component | Containing room / object |

## Controlpaneltype enum

Verified from vanilla `signal_leaks.xml:1727-1742` (the canonical "what hack types exist" reference):

| Type | Hacks what | Required items (typical) |
|---|---|---|
| `controlpaneltype.hack_all_turrets` | All turrets on the target | `ware.inv_securityslicer` × 5 |
| `controlpaneltype.hack_engineer` | The target's engineer NPC | `ware.inv_securitydecryptionsystem` |
| `controlpaneltype.hack_shieldgenerators` | Shield generators | `ware.inv_securitydecryptionsystem` |
| `controlpaneltype.hack_storage` | Storage / cargo | `ware.inv_securitydecryptionsystem` |
| `controlpaneltype.hack_watchdogs` | Watchdog NPCs (alert/patrol) | `ware.inv_securitydecryptionsystem` |

Vanilla `rml_hack_object.xml:202-205` shows the item-checking pattern:

```xml
<do_if value="not player.entity.inventory.{ware.inv_securitydecryptionsystem}.exists
    and $PanelType != controlpaneltype.hack_all_turrets">
    <!-- player lacks decryption system for non-turret hacks -->
</do_if>
<do_elseif value="not player.entity.inventory.{ware.inv_securityslicer}.exists
    and $PanelType == controlpaneltype.hack_all_turrets">
    <!-- player lacks slicers for turret hack -->
</do_if>
```

## Related accessors on the target

The target object (ship or station container) exposes hack state via container accessors:

| Container property | Description |
|---|---|
| `.iscontrolpanelhacked.{controlpaneltype}` | True if this control panel type has been successfully hacked |

This is the **runtime hack-state read** — used heavily by mission cues to detect player progress:

```xml
<do_if value="$TargetObject.iscontrolpanelhacked.{$PanelType}">
    <!-- hack succeeded — apply consequences -->
</do_if>
```

Pattern from `gm_hackpanel.xml:222`, `signal_leaks.xml:1664`.

## Room-side accessor

[Room](/game/objects/room/) datatype exposes per-type panel presence:

```xml
.hascontrolpanel.{$controlpaneltype}
```

Used by vanilla mission cues to find the right room to navigate to:

```xml
<find_room
    name="$TargetRoom"
    object="$Target"
    hascontrolpanel="$PanelType"
    multiple="false"/>
```

Pattern from `rml_hack_object.xml:167`.

## Actions

### Find a control panel by type on a target

There is no `find_object_component class=class.controlpanel`. Vanilla goes through rooms:

```xml
<find_room
    name="$Room"
    object="$Station"
    hascontrolpanel="controlpaneltype.hack_all_turrets"
    multiple="false"/>
```

### Give player hacking items (mission reward)

```xml
<add_inventory
    entity="player.entity"
    ware="ware.inv_securityslicer"
    exact="5"
    comment="controlpaneltype.hack_all_turrets"/>
```

Pattern from `rml_hack_object.xml:94`. Note: the comment on the action specifies which hack type these items unlock — vanilla idiom for clarity.

### Check if a hack has been done

```xml
<do_if value="$TargetObject.iscontrolpanelhacked.{controlpaneltype.hack_all_turrets}">
    <write_to_logbook
        text="$TargetObject.knownname + ' turrets compromised'"/>
</do_if>
```

### Assert hack state at mission start (sanity check)

```xml
<assert value="not $TargetObject.iscontrolpanelhacked.{$PanelType}"/>
```

Pattern from `gm_hackpanel.xml:210`. Mission cues that GIVE the hack assert it's NOT already done before starting.

## Events

There is no `event_controlpanel_X` family. Hack progression is signalled through:

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Panel destroyed | Filter on `class.controlpanel` — rare |
| Custom signals via `signal_cue` | Mission cues fire signals on successful hack | Read `target.iscontrolpanelhacked` to confirm |

## Common gotchas

- ⚠ **Control panel extends `destructible`, NOT `object`.** No `.sector` directly — use `.parent.sector` (the containing room → station).
- ⚠ **`.requireditems` is the macro-defined requirement.** What the player actually possesses is in `player.entity.inventory.{ware.X}`. Compare to confirm the player can hack.
- ⚠ **`.iscontrolpanelhacked.{type}` lives on the TARGET CONTAINER, not the panel.** The panel itself doesn't track hack state — the result is on the ship / station that owns the panel.
- ⚠ **Per-type hack state is independent.** Hacking `controlpaneltype.hack_storage` does NOT hack turrets. Each type is a separate flag.
- ⚠ **`find_room hascontrolpanel=` is the canonical search path.** There's no `find_object class=class.controlpanel`. Always go through `find_room`.
- ⚠ **`controlpaneltype.hack_all_turrets` requires DIFFERENT items than other types.** Vanilla uses slicer for turrets, decryption system for the others. Don't conflate.
- ⚠ **Hack state persists save/load.** Once hacked, stays hacked (unless engine clears it via story-event). Mods that re-set state must explicitly write to `signal_objects`-style cue signals; you can't directly clear `.iscontrolpanelhacked`.

## Examples

### Example 1: Check if all 5 hack types are completed on a target

```xml
<set_value name="$Types" exact="[
    controlpaneltype.hack_all_turrets,
    controlpaneltype.hack_engineer,
    controlpaneltype.hack_shieldgenerators,
    controlpaneltype.hack_storage,
    controlpaneltype.hack_watchdogs
]"/>

<set_value name="$Done" exact="0"/>

<do_for_each name="$type" in="$Types">
    <do_if value="$TargetShip.iscontrolpanelhacked.{$type}">
        <set_value name="$Done"
            operation="add" exact="1"/>
    </do_if>
</do_for_each>

<write_to_logbook
    text="$Done + ' / ' + $Types.count + ' hacks done'"/>
```

### Example 2: Find a target with a hackable turret panel

```xml
<do_for_each name="$ship" in="$Candidates">
    <find_room
        name="$Room"
        object="$ship"
        hascontrolpanel="controlpaneltype.hack_all_turrets"
        multiple="false"/>

    <do_if value="@$Room
        and not $ship.iscontrolpanelhacked.{controlpaneltype.hack_all_turrets}">
        <!-- this ship has a hackable, un-hacked turret panel -->
        <write_to_logbook
            text="'Hackable turrets on: '
                + $ship.knownname"/>
    </do_if>
</do_for_each>
```

### Example 3: Reward setup — give player items keyed to hack types

```xml
<add_inventory
    entity="player.entity"
    ware="ware.inv_securityslicer"
    exact="5"
    comment="controlpaneltype.hack_all_turrets"/>

<add_inventory
    entity="player.entity"
    ware="ware.inv_securitydecryptionsystem"
    exact="3"
    comment="controlpaneltype.hack_engineer, hack_shieldgenerators, hack_storage, hack_watchdogs"/>
```

Pattern from `rml_hack_object.xml:94`.

## Architectural context

- **Hacking gameplay loop:** Architectural overview *Hacking* — `gm_hackpanel.xml` + `signal_leaks.xml` + `rml_hack_object.xml` form the full UX (find leak → tells player → walk to panel → use items → effect applied).
- **Hack-state persistence:** Architectural overview *Hack persistence* — how `iscontrolpanelhacked` survives save/load and what clears it.
- **NPC reactions to hack:** Architectural overview *Faction notoriety hits* — successful hacks may trigger relation drops with the target faction.

## Related

- [Room](/game/objects/room/) — `hascontrolpanel` accessor; `find_room hascontrolpanel=` is the search path.
- [Signal leak](/game/objects/signal-leak/) — hint mechanism that points players at hackable panels.
- [Container](/game/objects/container/) — `iscontrolpanelhacked.{type}` is the target-side runtime state.
- [Ship](/game/objects/ship/) / [Station](/game/objects/station/) — common hack targets.
- [NPC](/game/characters/npc/) — engineer / watchdog hacks affect specific NPCs.
- [Ware](/game/economy/ware/) — `ware.inv_securityslicer` / `inv_securitydecryptionsystem` are the inventory items.

---

:::tip[Pattern — interaction component with target-side runtime state]
Control panel is the canonical example of *the action object is one place, the state is on another*. The panel is on the room; the hack-result is on the ship/station. Same pattern as [Signal leak](/game/objects/signal-leak/) (component on station, mission state in cues).
:::

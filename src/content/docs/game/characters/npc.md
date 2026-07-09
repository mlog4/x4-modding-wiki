---
title: NPC
description: A non-player character — crew, mission actor, station staff. Carries skills, inventory, holds a control post.
---

An **NPC** is a non-player character — a person in the universe who can pilot a ship, run a station post, deliver a mission, or stand around a bar. Modders interact with NPCs to populate ships and stations, to create mission actors, and to give the player conversation partners.

Datatypes in the inheritance chain:

```
component → entity → nonplayer → npc
```

Modders almost always work at the `entity` level (which has the bulk of properties: race, role, skills, inventory, conversation state, control post) — `npc` adds only a few clothing/body/conversation-specific accessors.

**Where NPCs live:** Inside a [Ship](/game/objects/ship/) or [Station](/game/objects/station/) (`.environment` = the container). Position is described by `.roomslot` (which `componentslot` they're standing in).

**How NPCs get assigned to work:** Via *control posts* (`controlpost.aipilot`, `.engineer`, `.shiptrader`, `.shadyguy`, `.defencenpc`, `.tradenpc`, ...) and *roles* (`entityrole.passenger`, `.marine`, `.pilot`, `.captain`, `.engineer`, ...).

## Properties

Most of an NPC's accessors are inherited from `entity` (vanilla `scriptproperties.xml:1358`). NPC-specific additions at `:1429`.

### Identity (entity)

| Property | Type | Description |
|---|---|---|
| `.type` / `.typename` | entitytype / string | Personality vector |
| `.role` | entityrole | Current role (passenger, marine, engineer, ...) |
| `.roleobject` | controllable | Object this role is assigned to (their ship or station) |
| `.race` | race | argon / paranid / teladi / split / terran / boron / xenon / khaak |
| `.isfemale` | bool | Gender |
| `.icon` / `.iconoverride` | string | UI portrait |
| `.titleoverride` | string | Display title override |
| `.occupationname` | string | Job-title display |

### Control & assignment

| Property | Type | Description |
|---|---|---|
| `.controlpost` | controlpost | Current post (`controlpost.aipilot`, ...) |
| `.controlled` | controllable | Object this entity is currently controlling |
| `.assignedcontrolled` | controllable | Object assigned to control (may differ from `.controlled` if absent) |
| `.iscontrolentity` | bool | Acts as a control entity for a controllable |
| `.iscommable` / `.isremotecommable` | bool | Player can talk via comms / remote |
| `.ismissionactor` | bool | Is a mission actor |
| `.isintransit` | bool | Currently moving to assignment |
| `.isbusy` | bool | Engaged in something |
| `.isindependent` | bool | Ownership independent of host object |

### Skills

| Property | Type | Description |
|---|---|---|
| `.skill.{skilltype}` | int 0..15 | Per-skill value (`skilltype.boarding`, `.engineering`, ...) |
| `.combinedskill` | int 0..100 | Weighted skill for current post |
| `.potentialskill.{entityrole}` | int 0..100 | What combined skill would be in that role |
| `.experienceprogress` | int | Boarding XP toward next level |

### Position & motion

| Property | Type | Description |
|---|---|---|
| `.roomslot` | componentslot | Assigned / current slot |
| `.iswalking` | bool | In motion |
| `.walkspeed` / `.runspeed` / `.slowwalkspeed` | float | Defined speeds |
| `.dockarea` / `.walkablemodule` / `.buildmodule` | various | Where they currently are |
| `.spacesuit` | spacesuit | If in EVA |

### Inventory & state

| Property | Type | Description |
|---|---|---|
| `.inventory` | wareamountlist | Wares carried |
| `.stock` | warelist | Stocked wares (for traders) |
| `.cancraft.{ware}` | bool | Can craft a particular ware |
| `.command.value` / `.command.param` | command | Current command being executed |
| `.commandaction.value` / `.commandaction.param` | commandaction | Current step within command |
| `.$<variable>` | various | Per-entity blackboard variable |

### Conversation

| Property | Type | Description |
|---|---|---|
| `.isspeaking` | bool | Currently in voice line |
| `.isinspeakrange` / `.isinspeakrange.{entity}` | bool | Within direct-speak distance |
| `.lastspeaktime` | time | When they last spoke |
| `.facecutscene` | string | Face cutscene key |
| `.page` | int | Voice text page id |

### NPC-only additions

| Property | Type | Description |
|---|---|---|
| `.npctemplate` | npctemplate | Template ref (for `available` people queries) |
| `.currentchair` | componentslot | Chair currently occupied |
| `.targetslot` | componentslot | Next destination slot |
| `.hasclothingmod` / `.hasclothingmod.{ware}` | bool | Clothing mods |
| `.hastool` | bool | Currently carrying a tool |
| `.hasbody` | bool | Has a body (for animations — false for some script-only NPCs) |
| `.isinconversation` | bool | In a player conversation |

## Actions

### Create an NPC from a template

```xml
<create_npc_from_template
    name="$actor"
    object="$ship"
    template="$actortemplate"
    slot="$spawnslot"
    owner="faction.player"/>
```

The standard mission-actor spawn pattern. Without `slot=` the NPC may end up unplaced. From memory: **omitting both `slot=` and `slottags=` triggers an assertion failure** — the NPC is alive but invisible. Use `slottags=[tag.npc_generic]` if you don't have a specific slot.

To place into a different object than the template's host:

```xml
<create_npc_from_template
    name="$actor"
    object="$oldroleobject"
    template="$actortemplate"
    owner="faction.player"
    placementobject="$selectedobject.controlroom"
    required="true"/>
```

Vanilla pattern from `conversations.xml:1352`.

### Create a template from an existing entity

```xml
<create_npc_template
    name="$newtemplate"
    object="$selectedobject"
    entity="$actor"
    role="$selectedposition"/>
```

Used to "remember" an NPC so they can be re-instantiated elsewhere later. See `conversations.xml:1327, 1401`.

### Assign an actor to a control post

```xml
<assign_control_entity
    actor="$pilot"
    object="$ship"
    post="controlpost.aipilot"
    init="true"
    transfer="true"/>
```

This wires the NPC to a post on a controllable. Common posts: `controlpost.aipilot`, `.engineer`, `.shiptrader`, `.shadyguy`, `.defencenpc`, `.tradenpc`, `.captain` (player ship).

`transfer="true"` removes the actor from their previous post; without it you get two assignments. `init="true"` runs the post's init aiscript immediately.

Vanilla canonical pattern: `cpu_ship_manager.xml:264` (assign aipilot to a spawned ship), `gmc_supervised_mining.xml:1106` (assign to a mining ship).

### Set assignment / role (without changing post)

```xml
<set_npc_role entity="$actor" role="entityrole.passenger"/>
```

For roles that are not control-post-tied (passenger, missionactor, ...).

### Transfer / dismiss

```xml
<destroy_npc entity="$actor"/>
```

For mission cleanup. Permanent — they're gone.

## Libraries

NPC creation has a dedicated framework rather than `LIB_Generic` helpers:

| Library | File | Purpose |
|---|---|---|
| `md.NPC_Placement_Manager.Place_NPC` | `md/npc_instantiation.xml` | Handles all NPC placement: slot assignment, fallback positions, validation |
| `md.NPC_Instantiation.X` cues | `md/npc_instantiation.xml` | The 4000-line state machine for NPC lifecycle |
| `md.NPC_State_Machines.X` cues | `md/npc_state_machines.xml` | Per-state behaviour (walking, sitting, working) |
| `md.LIB_Generic.Find_NPC_Slots_By_Group` | `md/lib_generic.xml:5057` | Find slots matching a tag group |
| `md.LIB_Generic.GenerateSkillStars` | `md/lib_generic.xml:515` | Render skill bars in UI text |
| `md.LIB_Generic.GenerateRatingStarsText` | `md/lib_generic.xml:552` | Render rating in UI text |

For ad-hoc work, the most reliable path is the same one vanilla uses: `create_npc_from_template` + `assign_control_entity`. Don't try to call into the placement manager directly.

## Events

| Event | When | Notes |
|---|---|---|
| `event_npc_created` | NPC spawned | Also fires on save load (vanilla has a `<!--HACK-->` note about this) |
| `event_npc_walk_finished` | NPC arrived at target slot | `object=$NPC` filter |
| `event_npc_slots_validated` | NPC slot system recomputed for an object | `object=` or `group=`. Used heavily by mission system to detect when stations are "populated enough" to host missions |
| `event_entity_entered` | Entity entered a `space=` (cluster/sector/zone) | Used for boundary detection |
| `event_entity_left` | Entity left a `space=` | Same |
| `event_entity_transport_finished` | Entity transport pod arrived | Crew transfer between ships |

## Common gotchas

- ⚠ **`create_npc_from_template` without `$position=` OR `$slottags=` triggers an assertion failure.** The NPC is alive but unplaced (invisible). Use `$slottags=[tag.npc_generic]` for ship-class-agnostic placement. From vanilla `npc_instantiation.xml`.
- ⚠ **`event_npc_created` fires on save load too.** Vanilla has an open `<!--HACK @Owen-->` comment about this. If your handler does setup work, gate it on `event.param != 'load'`-style checks (vanilla pattern in `npc_state_machines.xml:54-56`).
- ⚠ **`assign_control_entity` without `transfer="true"` leaves the actor double-assigned.** They will appear in `.assigneddock` and `.assignedcontrolled` of two objects.
- ⚠ **`.controlled` vs `.assignedcontrolled`** — the first is the object they're *currently* on, the second is what they're *assigned to*. They differ during transit (`.isintransit=true`).
- ⚠ **Ship → NPC accessors use `<role>` shortcut not `{$role}` lookup.** Vanilla syntax: `$ship.people.engineer.count` (string-as-role shortcut), and `$ship.people.{$myrolevar}.count` (variable lookup). Mixing breaks.
- ⚠ **Entity icon has TWO layers.** `set_entity_overrides icon=` controls only the **character-head** floater. The ship-marker icon is per-role in `parameters.xml` (e.g. `missionactor → npc_missionactor`) and is **global per role**, not per individual.
- ⚠ **`isremotecommable` is auto-set/unset on instantiate.** Don't set it manually on a template — it's only meaningful on actors.
- ⚠ **`.npctemplate` returns null for some script-created NPCs.** Templates exist only for NPCs spawned from a template via `create_npc_from_template`. Hand-rolled `<create_npc>` actors have no template back-reference.

## Examples

### Example 1: Spawn a pilot for a created ship

```xml
<create_ship name="$ship" macro="$Macro" sector="$Sector">
    <owner exact="faction.argon"/>
    <pilot/>
</create_ship>
```

Then either:
```xml
<!-- Default pilot from <pilot/> is usually enough -->
```

Or with a specific pilot:
```xml
<create_npc_from_template
    name="$pilot"
    object="$ship"
    template="$myPilotTemplate"
    slottags="[tag.aipilot]"
    owner="faction.argon"/>
<assign_control_entity
    actor="$pilot"
    object="$ship"
    post="controlpost.aipilot"
    init="true"
    transfer="true"/>
```

Pattern from `cpu_ship_manager.xml:264`.

### Example 2: Find the most skilled marine on a ship

```xml
<do_for_each name="$slot" in="$ship.crew">
    <do_if value="$slot.role == entityrole.marine
                  and $slot.skill.boarding gt $bestSkill">
        <set_value name="$best" exact="$slot"/>
        <set_value name="$bestSkill" exact="$slot.skill.boarding"/>
    </do_if>
</do_for_each>

<do_if value="@$best">
    <write_to_logbook
        text="'Best marine: ' + $best.knownname + ' (' + $bestSkill + '/15)'"/>
</do_if>
```

### Example 3: Listen for the player meeting a specific NPC

```xml
<cue name="WatchPlayerConvo" instantiate="true">
    <conditions>
        <event_conversation_started actor="$myActor"/>
        <check_value value="event.param.{1} == player.entity"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player started talking to ' + $myActor.knownname"/>
    </actions>
</cue>
```

## Architectural context

- **How NPCs are placed at game start:** Architectural overview *Galaxy seeding* — `god.xml` declares NPC roles per station, `factionlogic.xml` runtime spawner fills posts.
- **How NPCs move around on a station:** Architectural overview *NPC state machines* — `npc_state_machines.xml` 14000-line state machine: idle → walk → sit → work → leave.
- **How crew skills affect ship behaviour:** Architectural overview *Crew skills* — `combinedskill` per post drives Travel Drive availability, scan range, boarding strength, trader margins.
- **Conversation lifecycle:** Architectural overview *Conversations* — `conversations.xml` pipeline from `<start_conversation>` to `<event_conversation_finished>`.

## Related

- [Ship](/game/objects/ship/) — where pilot / crew NPCs live.
- [Station](/game/objects/station/) — where staff / mission-giver NPCs live.
- [Faction](/game/factions/faction/) — owner of NPCs.
- [Ware](/game/economy/ware/) — what NPCs carry in inventory.
- [Order](/game/behavior/order/) — what ship-piloting NPCs execute.
- [Spacesuit](/game/objects/spacesuit/) — special ship for EVA NPCs.

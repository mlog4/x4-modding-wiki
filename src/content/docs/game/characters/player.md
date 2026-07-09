---
title: Player
description: The player keyword — global accessor for player-specific state. Provides player.entity, player.ship, player.galaxy, player.money, blueprints, agents, and 80+ other properties.
---

The **`player`** keyword is a global accessor providing access to all player-specific state. It is **not a datatype** — it's a special accessor that lives at the root of script lookups. Modders use `player.X` constantly: `player.ship`, `player.galaxy`, `player.entity`, `player.money`, `player.headquarters`, etc.

**Type:** `keyword` (not `datatype`) in `scriptproperties.xml:2405`. This distinguishes it from typed datatypes — `player` is the universal root accessor.

## Properties

The player keyword has ~90 properties. Organised by concern.

### Identity

| Property | Type | Description |
|---|---|---|
| `.exists` | bool | Player exists |
| `.name` | string | Player name |
| `.rawname` | string | Raw text entry reference |
| `.age` | time | Current game time |
| `.systemtime.{format}` | string | System time (strftime format) |
| `.money` | money | Player account balance |
| `.influence` | int | Player influence (Tides of Avarice) |

### Player position and control

| Property | Type | Description |
|---|---|---|
| `.entity` | entity | Player as an entity (NPC perspective) |
| `.controlled` | object | Currently controlled object (or null) |
| `.container` | container | Player's container context (ship or station) |
| `.ship` | ship | Player ship context (may be null when landed) |
| `.station` | station | Player station context (may be null in space) |
| `.occupiedship` | ship | Ship player is piloting (sitting in pilot seat) |
| `.spacesuit` | spacesuit | The spacesuit, if EVA |
| `.platform` | dockingbay | Landing platform player stands on |
| `.room` | room | Player room |
| `.zone` / `.sector` / `.cluster` / `.galaxy` | various | Spatial context |
| `.computer` | entity | Player's on-board computer (Betty) |
| `.headquarters` | station | Player HQ (null before quest unlock) |

### Targeting

| Property | Type | Description |
|---|---|---|
| `.target` | object | Currently targeted object |
| `.autopilottarget` | object | Autopilot target |
| `.activity` | activity | Current player activity |

### Conversation

| Property | Type | Description |
|---|---|---|
| `.conversation` | string | Current conversation ID |
| `.isinconversation` | bool | A conversation is active |
| `.conversationactor` | entity | Other actor in conversation |

### Diplomacy (Tides of Avarice)

| Property | Type | Description |
|---|---|---|
| `.diplomats` | list | Faction diplomats to player |
| `.agents.list` | list | Player's diplomacy agents |
| `.agents.max` / `.capacity` / `.free` | int | Agent slot counts |
| `.agents.research.{numeric}` | ware | Research needed to unlock N agent slots |
| `.diplomacygiftknown.{faction}.{ware}` | bool | Player knows gift effectiveness |

### Missions

| Property | Type | Description |
|---|---|---|
| `.hasactivemission` | bool | Has active mission |
| `.activemissiontype` | missiontype | Mission type |
| `.activemissionwaypoint` | component | Waypoint to next sector |
| `.hasacceptedonlinemission` | bool | Online mission accepted |

### Commissions and discounts

| Property | Type | Description |
|---|---|---|
| `.hascommission.{container or faction}` | bool | Player has commission |
| `.hascommission.{X}.{id}` | bool | Specific commission |
| `.hasdiscount.{container or faction}` | bool | Player has discount |
| `.hasdiscount.{X}.{id}` | bool | Specific discount |

### Teleport

| Property | Type | Description |
|---|---|---|
| `.canteleportto.{controllable}` | bool | Can teleport to (respects restrictions) |
| `.canforceteleportto.{controllable}` | bool | Can teleport ignoring restrictions |

### Scanner

| Property | Type | Description |
|---|---|---|
| `.hasscanner` | bool | Has scanner software |
| `.scanlevel` | int | Current scan level |
| `.maxscanlevel` | int | Max scan level |
| `.longrange` | bool | Has long-range scanner |

### Encyclopedia

| Property | Type | Description |
|---|---|---|
| `.encyclopedia.<libtype>.{id}.exists` | bool | Has encyclopedia entry |
| `.encyclopedia.<libtype>.{id}.name` | string | Entry name |
| `.encyclopedia.<libtype>.{id}.description` | string | Description |
| (and more) | various | Image, video, voice, date, group |

### Blueprints

| Property | Type | Description |
|---|---|---|
| `.blueprints.{ware}.any.exists` | bool | Has any blueprint for ware |
| `.blueprints.{ware}.any.cycle.time` | time | Cycle time of first blueprint |
| `.blueprints.{ware}.<method>.exists` | bool | Specific production method |
| (and many more) | various | Full blueprint introspection |

### Other

| Property | Type | Description |
|---|---|---|
| `.isincontrolposition` | bool | Sitting or standing in control |
| `.ismessageunread.{id}` | bool | Has unread message |
| `.debug` | bool | Debug options available |

## Common patterns

### "Where is the player right now?"

```xml
<do_if value="@player.occupiedship">
    <!-- player is piloting a ship -->
</do_if>
<do_elseif value="@player.station">
    <!-- player is on a station -->
</do_elseif>
<do_elseif value="@player.spacesuit">
    <!-- player is in EVA -->
</do_elseif>
```

### "Player money / wallet"

```xml
<do_if value="player.money ge 50000Cr">
    <transfer_money
        from="player.entity"
        to="$Vendor"
        amount="50000Cr"/>
</do_if>
```

### "Player blueprint check"

```xml
<do_if value="player.blueprints.{ware.shieldgenerator_arg_l_standard_01_mk2}.any.exists">
    <write_to_logbook
        text="'Player can build this shield'"/>
</do_if>
```

### "Galaxy-wide find"

```xml
<find_station_by_true_owner name="$Stations"
    space="player.galaxy"
    multiple="true"/>
```

`player.galaxy` is the canonical "the galaxy" reference for `space=` parameters.

## Common gotchas

- ⚠ **`player` is a keyword, NOT a datatype.** Don't try `typeof player == datatype.X`. It's the root accessor only.
- ⚠ **`.ship` vs `.occupiedship` vs `.controlled`.** `.ship` is the player's last ship context (may persist when landed). `.occupiedship` is what the player is *actually piloting*. `.controlled` is the currently controlled object (could be a ship, a turret, etc.).
- ⚠ **`.sector` can be NULL.** When in a super-highway, the player has a cluster but no sector. Always null-check.
- ⚠ **`.headquarters` is null before quest unlock.** Pre-HQ-quest, this is null. Story-aware mods gate on `@player.headquarters`.
- ⚠ **`.entity` is the canonical player NPC reference.** Use this when adding inventory wares, sending signals, etc.
- ⚠ **`.galaxy` is universally accessible.** Doesn't go null. Safe to use without null-check.
- ⚠ **`.money` is in 1/100-credit internal units.** Same as faction money — divide by 100 only for display.

## Examples

### Example 1: Where is player + give them context-appropriate message

```xml
<cue name="GreetPlayer" instantiate="true">
    <conditions>
        <event_player_signalled/>
    </conditions>
    <actions>
        <do_if value="@player.occupiedship">
            <write_to_logbook
                text="'Piloting '
                    + player.occupiedship.knownname"/>
        </do_if>
        <do_elseif value="@player.station">
            <write_to_logbook
                text="'On station '
                    + player.station.knownname"/>
        </do_elseif>
        <do_else>
            <write_to_logbook text="'Player in unknown context'"/>
        </do_else>
    </actions>
</cue>
```

### Example 2: Give the player money + a blueprint + an item

```xml
<transfer_money
    from="faction.argon"
    to="player.entity"
    amount="(500000)Cr"/>

<add_blueprints
    wares="[ware.module_gen_storage_solid_l_01]"/>

<add_inventory
    entity="player.entity"
    ware="ware.inv_spaceflycaviar"
    exact="10"/>
```

### Example 3: Check player can teleport to a station

```xml
<do_if value="player.canteleportto.{$TargetStation}">
    <!-- player has access — show teleport button -->
</do_if>
```

## Architectural context

- **The `player` keyword is engine-side.** Implemented in the script engine; not modifiable.
- **`player.entity` vs `faction.player`.** The entity is the NPC; the faction is the political entity. Both exist; serve different purposes.

## Related

- [NPC](/game/characters/npc/) — `player.entity` IS-A NPC.
- [Galaxy](/game/world/galaxy/) — `player.galaxy` is THE galaxy.
- [Faction](/game/factions/faction/) — `faction.player` is the political faction.
- [Headquarters](/game/objects/headquarters/) — `player.headquarters` accessor.
- [Ship](/game/objects/ship/) — `player.ship` / `player.occupiedship`.

---

:::tip[Pattern — root accessor keyword]
`player` is the only universal root keyword exposed to MD. It's not a datatype — it's the universe of player-specific accessors. Treat it as "the universe of the player".
:::

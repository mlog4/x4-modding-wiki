---
title: Headquarters
description: Station subtype with strategic / narrative weight — Player HQ and Faction HQs. Two distinct concepts.
---

A **Headquarters** is a [Station](/game/objects/station/) subtype that holds strategic / narrative weight. X4 has **two distinct concepts**, both called "HQ" colloquially but with different flags and behaviour:

| Type | Flag | Examples | Notes |
|---|---|---|---|
| **Player HQ** | `.isheadquarters` | The pre-defined Player Headquarters (Terraforming/HQ DLC content) | Special macro; player-owned; quest-driven progression |
| **Faction HQ** | `.isfactionheadquarters` | Argon Prime, Trinity Sanctum, Profit Center Alpha, Mars, etc. | Owned by NPC factions; politically significant |

These are independent — a station can be `.isheadquarters=true` without being `.isfactionheadquarters=true` (it's the *player's* HQ, not a *faction's* HQ in vanilla terms), or vice versa.

This page documents Headquarters-specific behavior. For all general station behavior (creation, ownership, hull, dockingbays, events), see the parent [Station](/game/objects/station/) page.

## Identification

| Flag | Meaning |
|---|---|
| `.isheadquarters` | Station macro is tagged headquarters. Normally only true for the Player HQ. |
| `.isfactionheadquarters` | Station is THIS faction's headquarters (set per-faction at runtime) |

To get a faction's HQ directly:

```xml
<set_value name="$ArgonHQ"
    exact="faction.argon.headquarters"/>
```

This is the canonical accessor — preferred over scanning all faction stations and filtering by `.isfactionheadquarters`. Returns `null` if the faction has no HQ (e.g. extinct faction).

To access the player's HQ:

```xml
<set_value name="$PlayerHQ" exact="player.headquarters"/>
```

`player.headquarters` is a vanilla shortcut used heavily by `diplomacy.xml`, `cpu_ship_manager.xml`, and quest content.

## Properties (HQ-relevant)

All accessors live on the parent `station` datatype (`scriptproperties.xml:848`). There is no separate `headquarters` datatype.

| Property | Type | Description |
|---|---|---|
| `.isheadquarters` | bool | Macro tagged headquarters (Player HQ in vanilla) |
| `.isfactionheadquarters` | bool | This is the owner faction's HQ |
| `.representative` | entity | Faction representative NPC at this HQ (faction HQs only) |
| `.diplomat` | entity | Faction diplomat NPC at this HQ |
| `.defencenpc` | entity | Defence officer NPC (player HQ has a special one with mod-parts inventory) |
| `.tradenpc` | entity | Trade officer NPC |
| `.shadyguy` | entity | Black-market dealer NPC (player HQ specifically) |

## Player HQ specifics

The Player HQ has unique gameplay roles:

1. **Quest hub.** Story content uses `player.headquarters` as a check (vanilla `cpu_ship_manager.xml:450`, `diplomacy.xml:261, 510, 682, 1550`).
2. **Mod parts and crafting wares.** The defence NPC's inventory is the source for crafting reagents (`player.headquarters.defencenpc.inventory`).
3. **Boso Ta and other persistent characters.** Story characters dock here (`md.$PersistentCharacters.$BosoTa.hascontext.{player.headquarters}`).
4. **Build storage cap.** Player HQ has the largest default build storage of any station.

To check "is the player at their HQ":

```xml
<do_if value="@player.headquarters
    and player.entity.controlled == player.headquarters">
    <!-- player is on their HQ -->
</do_if>
```

## Faction HQ specifics

Faction HQs are the destination for:

1. **Diplomacy missions.** Embassy intros, ambassador meetings — see `diplomacy.xml`.
2. **Story arc starts.** Each faction's story usually involves visiting their HQ.
3. **Top-tier rewards.** Highest-relation rewards (seminars, blueprints) are dispensed here.

To find all faction HQs in the galaxy:

```xml
<set_value name="$Factions" exact="[
    faction.argon, faction.paranid, faction.teladi,
    faction.split, faction.terran, faction.boron
]"/>

<create_list name="$HQs"/>

<do_for_each name="$f" in="$Factions">
    <do_if value="@$f.headquarters">
        <append_to_list name="$HQs" exact="$f.headquarters"/>
    </do_if>
</do_for_each>

<write_to_logbook
    text="'Found ' + $HQs.count + ' faction HQs'"/>
```

## Common HQ patterns

### "Send the player to a faction HQ"

```xml
<signal_cue
    cue="md.Guidance.NewTarget"
    param="[$Faction.headquarters, null, null, true]"/>
```

This creates a Guidance Mission with auto-arrival — the vanilla recruit-agent UX. Don't use `set_player_target` for cross-cluster targets; it errors. See [Order → set_player_target gotcha](/game/behavior/order/#common-gotchas).

### "Give the player a reward at their HQ"

```xml
<add_inventory
    ware="ware.inv_securitybypasssystem"
    exact="3"
    entity="player.headquarters.defencenpc"/>
```

Vanilla `diplomacy.xml:293` deposits crafting wares into the player HQ defence NPC's inventory.

### "Listen for the player capturing a faction HQ"

```xml
<cue name="WatchHQCapture" instantiate="true">
    <conditions>
        <event_object_changed_owner/>
        <check_value
            value="event.object.isfactionheadquarters
                and event.param == faction.player"/>
    </conditions>
    <actions>
        <write_to_logbook
            text="'Player captured faction HQ: '
                + event.object.knownname"/>
    </actions>
</cue>
```

In vanilla this is a near-impossible action because faction HQs have very high boarding resistance, but mods commonly create these scenarios.

## Common gotchas

- ⚠ **`.isheadquarters` and `.isfactionheadquarters` are independent.** A faction HQ usually is NOT `.isheadquarters` (the macro-flag); the Player HQ usually is. Don't conflate them.
- ⚠ **`faction.X.headquarters` returns null for extinct factions.** Always null-check (`@$faction.headquarters`) before dereferencing.
- ⚠ **The Player HQ exists from a quest event, not from game start.** `player.headquarters` is null before the player completes the HQ acquisition arc. Story-aware mods should gate on `@player.headquarters`.
- ⚠ **The Player HQ defence NPC is the crafting reagent store.** Adding wares to it (`add_inventory entity="player.headquarters.defencenpc"`) makes them craftable. Adding to `player.entity` does NOT trigger crafting access.
- ⚠ **A station can be BOTH `.isheadquarters` AND `.isfactionheadquarters`** if a faction's HQ shares the player-HQ macro (rare; possible in modded scenarios).
- ⚠ **Faction HQ can be lost mid-game.** Wars, boarding, and faction-deactivation events can leave a faction with `.headquarters` returning null. Listen for `event_object_changed_owner` and `event_faction_deactivated` if you depend on it.
- ⚠ **`set_player_target` errors for cross-cluster HQ targeting.** Use `md.Guidance.NewTarget` signal instead — see [Order](/game/behavior/order/) Common gotchas.

## Architectural context

- **How factions get assigned a HQ at game start:** Architectural overview *Galaxy seeding* — `god.xml` declares HQ macros per faction in initial sectors.
- **How a faction can lose its HQ:** Architectural overview *Faction lifecycle* — death conditions, HQ recapture mechanics, deactivation cascade.
- **Player HQ quest progression:** Architectural overview *HQ acquisition* — the story arc that grants `player.headquarters`.

## Related

- [Station](/game/objects/station/) — parent abstraction (all general properties/actions live there).
- [Shipyard](/game/objects/shipyard/) — sibling; some faction HQs are also shipyards (Mars, certain Terran stations).
- [Faction](/game/factions/faction/) — `.headquarters` accessor; `.representative` / `.diplomat` for HQ NPCs.
- [NPC](/game/characters/npc/) — `.defencenpc` / `.tradenpc` / `.shadyguy` are HQ-relevant NPCs.
- [Ware](/game/economy/ware/) — crafting wares stored at Player HQ.

---

:::tip[Pattern — IS-A subtype with two distinct concepts]
Headquarters is the only Station subtype where *two distinct flags* (`.isheadquarters` vs `.isfactionheadquarters`) cover two distinct concepts. Most modder code needs to be explicit about which one it means.
:::

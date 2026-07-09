---
title: Action
description: The XML elements that go inside <actions> blocks. Categorical tour of MD's action surface — variable, flow control, find, lifecycle, orders, events.
---

An **Action** is an XML element placed inside a `<actions>` block of a [Cue](/lang/md-framework/cue/) or [Library](/lang/md-framework/library/). Actions are the *imperative* side of MD — they mutate state, query the world, send signals, create objects. While `<conditions>` decide *when* a cue fires, `<actions>` decide *what it does*.

MD has **~150 distinct actions**, grouped into the categories below. This page is a *categorical tour* — for the canonical use of each action, follow the cross-references to the game-side pages where they're used.

## XML structure

```xml
<actions>
    <set_value name="$x" exact="42"/>

    <do_if value="$x gt 0">
        <write_to_logbook text="'positive'"/>
    </do_if>
    <do_else>
        <write_to_logbook text="'non-positive'"/>
    </do_else>
</actions>
```

Actions execute **top-to-bottom**, synchronously. There is no concurrency within a single actions block.

## Variable manipulation

| Action | Purpose | Example |
|---|---|---|
| `<set_value name="$X" exact="..."/>` | Assign value (replace) | `<set_value name="$count" exact="0"/>` |
| `<set_value name="$X" operation="add" exact="..."/>` | Add to existing | `<set_value name="$count" operation="add" exact="1"/>` |
| `<set_value name="$X" min="..." max="..."/>` | Random in range | `<set_value name="$d" min="10s" max="30s"/>` |
| `<set_value name="$X" exact="..." chance="50"/>` | Conditional set (50% chance) | |
| `<remove_value name="$X"/>` | Delete variable | |

The `operation=` attribute supports `add`, `subtract`, `multiply`, `divide`, `min`, `max`, `insert`, `append`, etc.

### List operations

| Action | Purpose |
|---|---|
| `<create_list name="$L"/>` | New empty list |
| `<append_to_list name="$L" exact="$item"/>` | Push to back |
| `<insert_in_list name="$L" at="1" exact="$item"/>` | Insert at index |
| `<remove_from_list name="$L" exact="$item"/>` | Remove specific |
| `<remove_from_list name="$L" index="1"/>` | Remove by index |
| `<sort_list name="$L" sortbyvalue="$loop.element.X"/>` | Sort by expression |
| `<shuffle_list list="$L"/>` | Randomise |

## Flow control

| Action | Purpose |
|---|---|
| `<do_if value="..."> ... </do_if>` | Conditional block |
| `<do_else> ... </do_else>` | Else (must follow `do_if`) |
| `<do_elseif value="..."> ... </do_elseif>` | Else-if |
| `<do_while value="..."> ... </do_while>` | Loop while condition true |
| `<do_for_each name="$X" in="$List"> ... </do_for_each>` | Iterate list / table |
| `<do_for_each_in_table name="$X" in="$Table"> ... </do_for_each_in_table>` | Iterate table keys |
| `<do_all min="N" max="M"> ... </do_all>` | Run block N-M times |
| `<do_any> ... </do_any>` | Pick one alternative randomly |
| `<break/>` | Exit innermost loop |
| `<continue/>` | Skip to next iteration |

## Find actions

The `find_*` family queries the world. Each `find_X` has a dedicated set of attributes specific to its target type:

| Action | What it finds | Key attributes |
|---|---|---|
| `find_object` | Any class.X object | `space=`, `class=`, `multiple=` |
| `find_object_component` | Sub-component of an object | `object=`, `class=`, `multiple=` |
| `find_ship_by_true_owner` | Ships of a faction | `space=`, `faction=`, `primarypurpose=`, `multiple=` |
| `find_station_by_true_owner` | Stations of a faction | `space=`, `faction=`, `multiple=` |
| `find_sector` | Sectors | `space=`, `owner=`, `macro=`, `reachablefrom=`, `multiple=` |
| `find_sector_in_range` | Sectors within N gate jumps | `object=`, `maxdistance=`, `multiple=` |
| `find_zone` | Zones in a space | `space=`, `normalzone=`, `multiple=` |
| `find_gate` | Gates | `space=`, `active=`, `destination=`, `multiple=` |
| `find_room` | Rooms in an object | `object=`, `hascontrolpanel=`, `multiple=` |
| `find_dockingbay` | Docks | `object=`, `checkoperational=`, `multiple=` |
| `find_crate_slot` | Crate placement slots | `object=`, `tags="tag.crate_s"`, `multiple=` |

For exhaustive find_* coverage, see the game-side pages — each documents its `find_*` patterns.

## Object lifecycle

| Action | Purpose |
|---|---|
| `<create_object>` | Spawn an `object` (asteroid, satellite, mine, etc.) |
| `<create_ship>` | Spawn a ship |
| `<create_object_at_position>` | Position-specific spawn |
| `<create_npc_from_template>` | Spawn an NPC |
| `<create_npc_template>` | Template from existing entity |
| `<destroy_object object="$X"/>` | Silent destruction |
| `<kill_object object="$X" killmethod="..."/>` | Combat destruction (fires events) |
| `<set_owner object="$X" faction="$Y"/>` | Change ownership (use library for ships!) |
| `<commandeer_object>` | Force takeover (job-manager only) |

## Inventory and cargo

| Action | What it modifies |
|---|---|
| `<add_inventory ware="ware.X" exact="N"/>` | Entity inventory (NPC) |
| `<remove_inventory>` | Same |
| `<transfer_inventory>` | Move between entities |
| `<add_cargo object="$X" ware="ware.X" exact="N"/>` | Container cargo |
| `<add_ammo object="$X" macro="..." amount="N"/>` | Ammostorage (deployables, missiles) |
| `<set_cargo_target>` | Per-ware stock target |

**Critical distinction:** `add_inventory` ≠ `add_cargo` ≠ `add_ammo`. See [Ware](/game/economy/ware/) for the storage-type rules.

## Money

| Action | Purpose |
|---|---|
| `<transfer_money from="$A" to="$B" amount="(N)Cr"/>` | Move credits |
| `<change_money object="$X" amount="(N)Cr"/>` | Direct modify |

**Critical:** `amount="(N)Cr"` is the only valid form for dynamic amounts. Bare integer fails as "not of type money".

## Orders and behaviour

| Action | Purpose |
|---|---|
| `<create_order id="'X'" object="$ship">` | Issue an order |
| `<create_order ... default="true">` | Replace default order |
| `<cancel_order order="$X"/>` | Cancel specific |
| `<cancel_all_orders object="$ship"/>` | Cancel everything |
| `<edit_order_param order="$X" param="'Y'" value="..."/>` | Live-modify |
| `<set_command commander="$X" assignment="..."/>` | Subordinate / assignment |

See [Order](/game/behavior/order/) for full coverage.

## Relations

| Action | Purpose |
|---|---|
| `<set_faction_relation faction="$A" otherfaction="$B" value="..." reason="..."/>` | Permanent change |
| `<set_relation_boost object="$X" otherobject="$Y" value="..." decay="..." delay="..."/>` | Decaying per-object |
| `<add_relation_boost>` | Additive boost |
| `<reset_relation_boost>` | Clear |
| `<change_relation_on_attack/kill/boarding>` | Engine-computed deltas |

See [Faction](/game/factions/faction/) for full coverage.

## Cue control

| Action | Purpose |
|---|---|
| `<signal_cue cue="X"/>` | Queue a signal to cue X |
| `<signal_cue_instantly cue="X" param="..."/>` | Immediate (with param) |
| `<reset_cue cue="this"/>` | Re-enable a non-instantiated cue |
| `<cancel_cue cue="X"/>` | Force cancellation |
| `<signal_objects object="$X" param="..."/>` | Signal an object (for `event_object_signalled`) |

See [Cue](/lang/md-framework/cue/) for canonical Bridge+Worker pattern.

## Construction

| Action | Purpose |
|---|---|
| `<create_construction_sequence>` | Build module list (X4 9.0 staged guard) |
| `<apply_construction_sequence>` | Apply to station |
| `<add_build>` | Queue a build task |
| `<add_build_to_expand_station>` | X4 9.0 staged-construction path |
| `<set_equipment_wares_included/excluded/absolute>` | Restrict buildables |
| `<set_ship_wares_included/excluded/absolute>` | Restrict ship builds |
| `<set_production_paused object="$X" paused="true"/>` | Pause production |

See [Build module](/game/objects/build-module/) for full coverage.

## NPCs

| Action | Purpose |
|---|---|
| `<create_npc_from_template>` | Spawn |
| `<create_npc_template>` | Template from entity |
| `<assign_control_entity>` | Wire to a control post |
| `<set_npc_role>` | Change role |
| `<destroy_npc>` | Remove |
| `<update_signal_leak_voice>` | Attach voice to a leak |

See [NPC](/game/characters/npc/) and [Signal leak](/game/objects/signal-leak/).

## Debug

| Action | Purpose |
|---|---|
| `<write_to_logbook text="..."/>` | Player-visible log entry |
| `<debug_text text="..."/>` | Debug log (with filters) |
| `<debug_text text="..." filter="economy_verbose"/>` | Filtered log |
| `<debug_text text="..." chance="$DebugChance"/>` | Probabilistic log |

## Library calls

| Action | Purpose |
|---|---|
| `<run_actions ref="md.X.Y" result="$out"> <param .../> </run_actions>` | Call a library |
| `<include_actions ref="md.X.Y"/>` | Inline another actions block |
| `<return value="..."/>` | Return from library (ONLY in libraries) |

See [Library](/lang/md-framework/library/) for full coverage.

## Common gotchas

- ⚠ **Actions run top-to-bottom synchronously.** There is no concurrency. Don't write code expecting parallel execution.
- ⚠ **`<break/>` exits the innermost loop only.** For multi-level break, set a flag and check between levels.
- ⚠ **`<return value="..."/>` only works inside libraries.** In regular cue actions: errors. Use `do_else` wrap + `reset_cue` for early-exit.
- ⚠ **Find actions need `space=` parameter.** Without it, most return 0 silently. Pass at least `space="player.galaxy"`.
- ⚠ **`set_value operation="add"` does NOT auto-create the variable.** First write must use `exact=` (or rely on defaults). For counters, init to 0 first.
- ⚠ **`add_inventory` / `add_cargo` / `add_ammo` are NOT interchangeable.** Different storage types. See [Ware](/game/economy/ware/) gotchas.
- ⚠ **`destroy_object` is silent; `kill_object` triggers events.** Pick based on whether the world should react.
- ⚠ **String literals require quotes in some contexts but not others.** `id="'X'"` (string) vs `id="X"` (identifier lookup) — context-sensitive. Vanilla idiom: always quote `id=` strings.
- ⚠ **`amount="(N)Cr"` for money.** Dynamic amounts need this wrap; bare `amount="N"` fails as "not of type money".
- ⚠ **`do_while` can infinite-loop.** No automatic timeout. Always include a bounded counter or external condition.

## Examples

### Example 1: Iterate and filter

```xml
<actions>
    <find_ship_by_true_owner name="$Ships"
        space="player.galaxy"
        faction="faction.player"
        multiple="true"/>

    <set_value name="$count" exact="0"/>

    <do_for_each name="$ship" in="$Ships">
        <do_if value="$ship.iscapitalship">
            <set_value name="$count"
                operation="add" exact="1"/>
        </do_if>
    </do_for_each>

    <write_to_logbook
        text="'Player has ' + $count
            + ' capitals'"/>
</actions>
```

### Example 2: Bridge + Worker (race-safe entity writes)

```xml
<cue name="Bridge" instantiate="true">
    <conditions>
        <event_object_destroyed group="$X"/>
        <check_value value="not $busy"/>
    </conditions>
    <actions>
        <set_value name="$busy" exact="true"/>
        <signal_cue_instantly cue="Worker"
            param="event.object"/>
    </actions>
</cue>

<cue name="Worker" instantiate="false">
    <conditions>
        <event_cue_signalled cue="Bridge"/>
    </conditions>
    <actions>
        <add_inventory entity="event.param.owner"
            ware="ware.inv_X" exact="1"/>
        <reset_cue cue="this"/>
    </actions>
</cue>
```

### Example 3: Compose actions with library

```xml
<actions>
    <run_actions ref="md.LIB_Generic.TransferShipOwnership">
        <param name="Ship" value="$capturedShip"/>
        <param name="NewOwner" value="faction.player"/>
    </run_actions>

    <cancel_all_orders object="$capturedShip"/>

    <create_order id="'ProtectPosition'"
        object="$capturedShip" default="true">
        <param name="destination"
            value="[$capturedShip.sector,
                $capturedShip.position]"/>
    </create_order>
</actions>
```

## Architectural context

- **~150 distinct actions across vanilla.** No exhaustive catalog exists — modders learn by reading vanilla scripts.
- **Engine vs script actions.** Some actions (`create_construction_sequence`) are engine-implemented; most are pure XML constructs that combine into action dispatch.
- **Action validation at load time.** Misspelled action names trigger XML parse errors at script load; runtime errors typically mean wrong attribute types or missing required attributes.

## Related

- [Cue](/lang/md-framework/cue/) — actions live in cue's `<actions>` blocks.
- [Library](/lang/md-framework/library/) — actions also live in library's `<actions>` blocks.
- [Condition](/lang/md-framework/condition/) — sibling concept (what goes in `<conditions>`).
- [Expression](/lang/md-framework/expression/) — `value="..."` expression syntax used by actions.
- Game-side pages — for the specific Action examples in context.

---

:::tip[Pattern — imperative side of MD]
Action is **MD's imperative half** — the `<actions>` block is procedural code. Pair with `<conditions>` (declarative trigger) to make a cue. Once you understand the categories above, exploring a new action is mostly a matter of reading vanilla for similar usage.
:::

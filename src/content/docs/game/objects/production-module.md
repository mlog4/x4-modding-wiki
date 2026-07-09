---
title: Production module
description: A station module that consumes resources and produces wares. The unit of station economy and trade.
---

A **Production module** is the station component that consumes [Wares](/game/economy/ware/) and produces other Wares. Every wheat farm, energy cells plant, refined metal foundry — they are all `class.production` instances of this datatype. Most station ware flow originates here.

**Inheritance:** `component → destructible → module → production`. The `module` parent provides `numdocks`, `haswalkableroom`. The `production` subtype adds production state, recipe accessors, and pause control.

**Sibling module subtypes** (all under `class.module`): [Build module](/game/objects/build-module/), [Connection module](/game/objects/connection-module/), [Defence module](/game/objects/defence-module/), [Habitation module](/game/objects/habitation-module/), [Welfare module](/game/objects/welfare-module/), [Pier](/game/objects/pier/), [Processing module](/game/objects/processing-module/), [Storage module](/game/objects/storage-module/), [Venture platform](/game/objects/venture-platform/).

## Properties

From the `production` datatype (`scriptproperties.xml:1118`) + inherited from `module`.

### Production state

| Property | Type | Description |
|---|---|---|
| `.isproducing` | bool | Currently producing a cycle |
| `.ispaused` | bool | Paused for ANY reason (damage, hacking, manual) |
| `.ispausedmanually` | bool | Paused via `set_production_paused` |
| `.iswaitingforresources` | bool | Has cargo room but missing input wares |
| `.iswaitingforstorage` | bool | Has inputs but no room for output |

### Recipe

| Property | Type | Description |
|---|---|---|
| `.products` | warelist | What this module produces (typically a single ware, but can be multi-output) |
| `.resources` | warelist | All input wares for the current recipe |
| `.resources.{ware}.primary` | bool | Is this a primary (always-required) resource |
| `.resources.{ware}.secondary` | bool | Is this a secondary (race-specific or optional) resource |
| `.research` | warelist | Wares being researched here (research-specific modules) |

### Inherited from module

| Property | Type | Description |
|---|---|---|
| `.numdocks.{docksize}` | int | Connected dockingbays of given size |
| `.haswalkableroom` | bool | Has NPC-accessible interior |

### Inherited from destructible (combat/state)

| Property | Type | Description |
|---|---|---|
| `.hull` / `.hullpercentage` | hp / float | Damage state |
| `.shield` / `.shieldpercentage` | hp / float | Shield state (if any) |

## Accessing the recipe (the canonical gotcha)

**The reliable way to read a module's recipe is through its macro's ware:**

```xml
<set_value name="$inputs"
    exact="$ProductionModule.macro.ware.resources"/>

<do_for_each name="$res" in="$ProductionModule.macro.ware.resources.list">
    <set_value name="$amount"
        exact="$ProductionModule.macro.ware.resources.{$res}"/>
    <write_to_logbook
        text="$res.name + ': ' + $amount"/>
</do_for_each>
```

`.products.list.{1}.resources` **looks** like it should work — but it returns null silently because `.products.list` entries are warerefs without back-reference to a recipe. Vanilla `factiongoal_hold_space.xml:1011, 1034` confirms the macro-route pattern.

**Always iterate `.X.list` inline.** Storing `<set_value name="$res" exact="$Mod.macro.ware.resources"/>` and using `$res.list` later returns null — `wareamountlist` degrades when stored in a variable.

## Actions

### Pause / resume production

```xml
<set_production_paused
    object="$ProductionModule"
    paused="true"/>

<set_production_paused
    object="$ProductionModule"
    paused="false"/>
```

Vanilla `factionlogic_economy.xml:276, 2298, 2323, 2429, 3027` uses this for economy management — pause modules when inputs are scarce, resume when supply restored.

Reading `.ispaused` reflects ALL pause reasons (damage, hack, manual). Reading `.ispausedmanually` isolates the script-set state.

### Query production state in a guard

```xml
<do_if value="$Module.isproducing">
    <!-- currently making something -->
</do_if>

<do_if value="$Module.iswaitingforresources">
    <write_to_logbook
        text="$Module.knownname + ' starved of inputs'"/>
</do_if>

<do_if value="$Module.iswaitingforstorage">
    <write_to_logbook
        text="$Module.knownname + ' product cargo full'"/>
</do_if>
```

`.iswaitingforresources` and `.iswaitingforstorage` are the two distinct "stalled" reasons.

### Find production modules of a station

There is no direct `.productionmodules` on station. Use:

```xml
<do_for_each name="$module" in="$Station.modules">
    <do_if value="$module.isclass.{class.production}">
        <!-- found one -->
    </do_if>
</do_for_each>
```

### Find what a station produces (cargo-side accessor)

`Station` and `Container` aggregate all production modules into a single warelist via `.products`:

```xml
<set_value name="$AllStationProducts"
    exact="$Station.products.list"/>
```

This is the right path for "what does this station sell". For "what does this specific module produce", use the module's own `.products`.

## Libraries

Production-module-specific libraries are sparse. Most ware-economy logic lives at the station/container level:

| Library | Purpose | Source line |
|---|---|---|
| `md.LIB_Generic.Add_Wares_For_Module` | Add the production wares of a module to a station's ware list | 5089 |

For higher-level operations (shortage detection, factory placement decisions, production scheduling), see the `factionlogic_economy.xml` framework rather than reaching for libraries.

## Events

There is no `event_production_X` family. Production module state is observed through container-side events or by polling:

| Indirect signal | Where |
|---|---|
| `event_object_changed_owner` | Station owner changed (production redirects to new faction's economy) |
| `event_trade_completed` | A trade completed at the parent station (output sold or input bought) |
| `event_sector_resource_depleted` | A resource region the producer depends on depleted (mining-supply chains) |
| Polling `.iswaitingforresources` | The cheapest way to detect stalls |

## Common gotchas

- ⚠ **`$Mod.products.list.{1}.resources` returns null silently.** The reliable recipe path is `$Mod.macro.ware.resources` (vanilla pattern, `factiongoal_hold_space.xml:1011, 1034`). The `.products.list` entries are warerefs, not full recipe entries.
- ⚠ **`wareamountlist` degrades when stored in a variable.** `<set_value name="$r" exact="$Mod.macro.ware.resources"/>` then later `$r.list` returns null. Access `.list` inline every iteration.
- ⚠ **`.ispaused` is TRUE for any reason, not just manual.** A damaged module is paused; a hacked module is paused. To distinguish "I paused this" use `.ispausedmanually`.
- ⚠ **`set_production_paused paused="true"` does NOT abort the current cycle.** Vanilla pauses *between* cycles — a half-complete production batch finishes, then halt. For instant stop, destroy and rebuild.
- ⚠ **`.products` may differ from the macro's products if the recipe was modded mid-game.** Always check the runtime `.products` not just the macro's static recipe when displaying to the player.
- ⚠ **Modules with `.research` populated are NOT regular producers.** Research modules consume input but the "product" is a tech unlock, not a ware in cargo. Check `.research.count > 0` before assuming standard ware output.
- ⚠ **`Station.products` aggregates ALL production modules.** A station with one shield factory and one weapons factory shows both in `Station.products.list`. To trace which module produces what, iterate modules.
- ⚠ **`set_production_paused` is silent if the object is not a production module.** Wrap with `isclass.{class.production}` check before pausing — typo on the variable name doesn't error.

## Examples

### Example 1: Find all stalled production modules in player factories

```xml
<find_station_by_true_owner name="$Stations"
    space="player.galaxy"
    faction="faction.player"
    multiple="true"/>

<create_list name="$Stalled"/>

<do_for_each name="$station" in="$Stations">
    <do_for_each name="$module" in="$station.modules">
        <do_if value="$module.isclass.{class.production}
            and ($module.iswaitingforresources
                or $module.iswaitingforstorage)">
            <append_to_list name="$Stalled" exact="$module"/>
        </do_if>
    </do_for_each>
</do_for_each>

<write_to_logbook
    text="'Player has ' + $Stalled.count + ' stalled modules'"/>
```

### Example 2: Dump a production module's recipe

```xml
<write_to_logbook
    text="'Module ' + $Module.knownname
        + ' produces: '
        + $Module.products.list.{1}.name"/>

<do_for_each name="$res"
    in="$Module.macro.ware.resources.list">
    <write_to_logbook
        text="'  needs ' + $Module.macro.ware.resources.{$res}
            + ' × ' + $res.name"/>
</do_for_each>
```

Pattern from vanilla `factiongoal_hold_space.xml:1011-1034`. **Note the inline iteration of `.list`** — do not store `.resources` first.

### Example 3: Pause player production during a story mission

```xml
<find_station_by_true_owner name="$Stations"
    space="player.galaxy"
    faction="faction.player"
    multiple="true"/>

<do_for_each name="$station" in="$Stations">
    <do_for_each name="$module" in="$station.modules">
        <do_if value="$module.isclass.{class.production}
            and $module.isproducing">
            <set_production_paused
                object="$module"
                paused="true"/>
        </do_if>
    </do_for_each>
</do_for_each>

<!-- Later, after the story event: -->
<do_for_each name="$station" in="$Stations">
    <do_for_each name="$module" in="$station.modules">
        <do_if value="$module.ispausedmanually">
            <set_production_paused
                object="$module"
                paused="false"/>
        </do_if>
    </do_for_each>
</do_for_each>
```

Note: filter resume by `.ispausedmanually` — modules paused for damage / hacking should NOT be force-resumed.

## Architectural context

- **How factions decide where to build new production modules:** Architectural overview *Faction economy* — `Econ_Manager` per-sector evaluates shortage formula → picks ware → places a module.
- **How production rates and yields work:** Architectural overview *Production cycle math* — cycle duration × workforce bonus × loadout level → ware output per minute.
- **Race-specific recipes:** Architectural overview *Race recipes* — Boron, Terran, Khaak override default recipes; check `.resources.{$ware}.secondary` for race-conditional inputs.
- **Workforce dependency:** Architectural overview *Workforce* — `workforce.bonus` multiplier on production rates, `workforce.optimal` thresholds.

## Related

- [Module](/game/objects/module/) — parent generic-module page.
- [Ware](/game/economy/ware/) — what production modules consume and produce.
- [Station](/game/objects/station/) — container of modules; aggregates all `.products`.
- [Storage module](/game/objects/storage-module/) — companion module providing cargo capacity.
- [Habitation module](/game/objects/habitation-module/) — provides workforce → production rate bonus.
- [Processing module](/game/objects/processing-module/) — sibling that recycles scrap into wares.
- [Faction](/game/factions/faction/) — owner; faction-level economy logic drives module placement.

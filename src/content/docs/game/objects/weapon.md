---
title: Weapon
description: A weapon component on a ship or station — laser, turret, missile launcher. Parent of turret, missileturret, and missilelauncher classes.
---

A **Weapon** is a destructible component installed on a [Ship](/game/objects/ship/) or [Station](/game/objects/station/) that fires projectiles. Lasers (primary weapons), turrets (auto-targeting defensive guns), and missile launchers (secondary weapons / heavy ordnance) all share the `weapon` datatype.

**Inheritance:** `component → destructible → weapon`. Note: weapon extends `destructible` directly, **not** `object`. Weapons are components of larger objects — they don't have their own `.sector` (read `.parent.sector`).

**Subtypes:**

| Subtype | Datatype | Notes |
|---|---|---|
| `class.weapon` | `weapon` | Generic — covers primary laser-type weapons |
| `class.turret` | `turret` (extends `weapon`, no extra props) | Auto-targeting defensive gun |
| `class.missileturret` | `missileturret` (extends `turret`) | Missile-firing turret |
| `class.missilelauncher` | (class only, no datatype) | Primary missile launcher (secondary weapon slot) |

The four classes form a hierarchy where missileturret IS-A turret IS-A weapon — `isclass.weapon` is true for all of them. `isclass.missilelauncher` is checked separately (vanilla `scenario_combat.xml:1211` uses `not .isclass.missilelauncher` to distinguish primary lasers from primary missiles).

## Properties

The `weapon` datatype is rich — these are common modder use cases.

### Identity and capability

| Property | Type | Description |
|---|---|---|
| `.mode` | weaponmode | Current operating mode (see weaponmode enum below) |
| `.isreadytofire` | bool | Weapon active and (if a turret) deployed |
| `.isinactiveweapongroup` | bool | Installed on a defensible AND in an active weapon group |
| `.iscombat` | bool | NOT for repairing or mining |
| `.ismining` | bool | Mining weapon (drills / extractors) |
| `.isrepairing` | bool | Repair weapon (welders) |
| `.isbeam` | bool | Fires a continuous beam (not discrete bullets) |
| `.isguided` | bool | Fires guided missiles |
| `.istorpedo` | bool | Fires torpedoes |

### Range and rate

| Property | Type | Description |
|---|---|---|
| `.maxfirerange` | length | Maximum effective range |
| `.reloadrate` | float | Shots per second |
| `.reloadtime` | time | Time between shots |
| `.barrelposition` | position | Barrel position (may be 0,0,0 for collision-free weapons) |

### Ammo (for missile-style weapons)

| Property | Type | Description |
|---|---|---|
| `.ammo.macro` | macro | Ammo macro (the missile/torpedo) |
| `.ammo.ware` | ware | Ware that provides the ammo |
| `.ammo.capacity` | int | Ammo storage capacity this weapon adds |
| `.ammo.iscompatible.{macro}` | bool | Can this weapon fire that missile macro |

## Weapon modes (weaponmode enum)

Modes verified from vanilla MD usage:

| Mode | Behaviour |
|---|---|
| `weaponmode.holdfire` | Disabled — never fires |
| `weaponmode.defend` | Fires only when ship is attacked |
| `weaponmode.attackenemies` | Fires at any hostile in range |
| `weaponmode.missiledefence` | Fires only at incoming missiles |
| `weaponmode.prefercapital` | Targets capitals first |
| `weaponmode.mining` | Mining drills active |

Set via `<set_weapon_mode>`:

```xml
<set_weapon_mode
    weapon="$turret"
    weaponmode="weaponmode.attackenemies"/>
```

Vanilla: `lib_generic.xml:2034, 2049` (HoldFire / Defend), `setup_gamestarts.xml:1595` (AttackEnemies), `tutorial_mining.xml:584` (mining), `scenario_tutorials.xml:6384, 6402` (prefercapital / missiledefence).

## Actions

### Set weapon mode (single weapon)

```xml
<set_weapon_mode
    weapon="$turret"
    weaponmode="weaponmode.attackenemies"/>
```

### Set all turrets on a ship to defend

Use the vanilla library:

```xml
<run_actions
    ref="md.LIB_Generic.Setup_Ship_Turrets_Defend">
    <param name="Ship" value="$ship"/>
</run_actions>
```

For hold-fire:

```xml
<run_actions
    ref="md.LIB_Generic.Setup_Ship_Turrets_HoldFire">
    <param name="Ship" value="$ship"/>
</run_actions>
```

Pattern from `lib_generic.xml:2026-2055`.

### Arm / disarm all turrets

```xml
<set_turrets_armed object="$Ship" armed="true"/>
<set_turrets_armed object="$Ship" armed="false"/>
```

Pattern from `scenario_tutorials.xml:5699`.

### Find all weapons on a ship

There is no direct `.weapons` list. Iterate via `.weapongroups` or compatible patterns:

```xml
<do_for_each name="$weapon" in="$Ship.weapons">
    <do_if value="$weapon.iscombat">
        <write_to_logbook
            text="$weapon.knownname + ' range: '
                + $weapon.maxfirerange"/>
    </do_if>
</do_for_each>
```

### Filter primary lasers vs missile launchers

```xml
<set_value name="$isprimary"
    exact="not $weapon.isclass.missilelauncher"/>
```

Pattern from `scenario_combat.xml:1211`. Used to bias damage calcs differently for laser vs missile primaries.

## Ship-side aggregate accessors

For "how much DPS does this ship have", use the [Defensible](/game/objects/defensible/) properties on the ship rather than iterating weapons:

| Ship property | Description |
|---|---|
| `.dps.all` | Combined DPS |
| `.dps.primary` / `.dps.secondary` | Per-slot type |
| `.dps.turrets.all` | Just turrets |
| `.dps.missiles.all` | Just missile weapons |
| `.maxcombatrange.all` | Furthest effective range across all weapons |
| `.shortestmaxcombatrange.all` | Shortest among all weapons (kiting decisions) |

These aggregates are much cheaper than iterating weapons and are vanilla's preferred path.

## Events

There is no `event_weapon_X` family. Weapon-related observations go through:

| Event | When | Notes |
|---|---|---|
| `event_object_destroyed` | Weapon destroyed | Filter `event.object.isclass.{class.weapon}` |
| `event_object_attacked` | Ship attacked — `event.param2` is often the weapon | `event.param3.{2}` is the weapon in some events (see `notifications.xml:1515`) |

For "weapon fired" / "weapon hit", vanilla observes at the [Bullet](/game/objects/bullet/) or [Missile](/game/objects/missile/) level, not the weapon.

## Common gotchas

- ⚠ **`weapon` extends `destructible`, NOT `object`.** No `.sector`, `.zone`, `.position` directly — use `.parent.sector` or `.macro.barrelposition` for the local offset.
- ⚠ **`.barrelposition` may be `[0,0,0]` for collision-free weapons.** Don't treat it as a guaranteed muzzle location.
- ⚠ **`.isclass.weapon` is TRUE for turret, missileturret, missilelauncher too** (inheritance). To target only "basic weapons", check `not .isclass.turret and not .isclass.missilelauncher`.
- ⚠ **`.isclass.missilelauncher` is a CLASS check with no dedicated datatype.** Same pattern as [Bomb](/game/objects/bomb/) / [Countermeasure](/game/objects/countermeasure/) — class exists but no `missilelauncher` datatype in scriptproperties.
- ⚠ **`set_weapon_mode` is per-weapon.** For "all turrets on this ship", use the `Setup_Ship_Turrets_*` libraries or iterate weapons.
- ⚠ **`.ammo.macro` is null for non-ammo weapons.** A laser has no ammo macro. Don't dereference without `@$weapon.ammo.macro` check.
- ⚠ **`.isreadytofire` requires BOTH active state AND deployed turret.** A turret-stowed weapon shows ready=false even if armed. To distinguish "off" from "stowed", check parent ship's `alertlevel`.
- ⚠ **Player ammo for missiles is `add_ammo`, not `add_inventory`.** Same as all ammostorage-based content. The weapon's `.ammo.ware` tells you what ware to add.

## Examples

### Example 1: All player ship turrets to defend mode

```xml
<run_actions
    ref="md.LIB_Generic.Setup_Ship_Turrets_Defend">
    <param name="Ship" value="player.ship"/>
</run_actions>

<write_to_logbook
    text="'Turrets set to defend on '
        + player.ship.knownname"/>
```

### Example 2: Compute weapon-value sum for a ship

```xml
<set_value name="$Total" exact="0"/>

<do_for_each name="$weapon" in="$Ship.weapons">
    <do_if value="@$weapon.macro.ware">
        <set_value name="$Total"
            operation="add"
            exact="$weapon.macro.ware.averageprice"/>
    </do_if>
</do_for_each>

<write_to_logbook
    text="'Weapon value: ' + $Total + 'Cr'"/>
```

### Example 3: Find ships with mining drills equipped

```xml
<find_ship_by_true_owner name="$Ships"
    space="player.galaxy"
    faction="faction.player"
    multiple="true"/>

<create_list name="$Miners"/>

<do_for_each name="$ship" in="$Ships">
    <do_for_each name="$weapon" in="$ship.weapons">
        <do_if value="$weapon.ismining">
            <append_to_list name="$Miners" exact="$ship"/>
            <break/>
        </do_if>
    </do_for_each>
</do_for_each>

<write_to_logbook
    text="$Miners.count + ' player miners armed'"/>
```

## Architectural context

- **Weapon-mode dispatching:** Architectural overview *Turret AI* — how `weaponmode.X` drives per-turret target selection.
- **DPS aggregation:** Architectural overview *Defensible damage model* — how `Ship.dps.X` is computed from individual weapons.
- **Ammo vs no-ammo weapons:** Architectural overview *Weapon ammo system* — when `.ammo.macro` is null vs populated.

## Related

- [Ship](/game/objects/ship/) — what weapons are installed on; aggregate DPS lives on the ship.
- [Station](/game/objects/station/) — also hosts weapons (turrets on defence stations).
- [Defensible](/game/objects/defensible/) — the type that aggregates `.dps.X`.
- [Missile](/game/objects/missile/) — what missile launchers fire.
- [Bullet](/game/objects/bullet/) — what laser weapons fire (component-level, brief lifecycle).
- [Ware](/game/economy/ware/) — `.macro.ware` is the inventory item.

---

:::tip[Pattern — class hierarchy with sparse subtype properties]
Weapon is a great example of *one rich parent, thin subclasses*. The `weapon` datatype has 16 properties; `turret`, `missileturret`, `missilelauncher` add nothing. The taxonomy exists for class-level filtering (`isclass.turret`), not for per-class API surfaces.
:::

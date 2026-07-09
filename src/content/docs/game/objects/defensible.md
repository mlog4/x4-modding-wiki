---
title: Defensible
description: Engine class for objects with shields/turrets/weapons + capture mechanics. Parent of ship/station via container. ~100 properties spanning boarding, loadouts, construction.
---

A **Defensible** is the X4 engine abstract class for objects that **defend themselves** — has shields, turrets, weapons, can be boarded, has loadouts. Inherits from [Controllable](/game/objects/controllable/) and is parent of [Container](/game/objects/container/) (stations) and [Ship](/game/objects/ship/) (mobile).

**Inheritance:** `object → controllable → defensible`. Subclass: [Container](/game/objects/container/) (most stations), Ship (mobile combat entities).

## Properties

### Boarding + capture

Critical for boarding mechanics:

| Property | Type | Description |
|---|---|---|
| `.iscapturable` | boolean | Can this be captured (signalleak S/M or boarding L+)? Also: S-ship pilot won't eject if false. |
| `.isalertlevel.<level>` | boolean | At alert level (`red`/`yellow`/`green`). Note: Turrets deactivate on green. |
| `.boardingoperation` | operation | Current boarding operation this object is part of |
| `.boardingoperations` | list | Inbound boarding operations to defend against |
| `.boardingbehaviour` | boardingbehaviour | Boarding behaviour assigned for current operation |
| `.boardingmarines.count` | integer | Total marines assigned for boarding |
| `.boardingmarines.combinedskill` | integer | Combined marine skill 0-100 |
| `.boardingmarines.{$level}.count` | integer | Marines at specific tier |
| `.allmarinesdispatched` | boolean | All marines dispatched? |
| `.boardingresistance` | integer | Total boarding resistance |
| `.baseboardingresistance` | integer | Base resistance defined for object |
| `.boardingstrength` | integer | Boarding strength of marines + officer |

### Shields / Turrets / Weapons

All defensive surface components share the same property pattern:

| Property pattern | Type | Description |
|---|---|---|
| `.shields.numslots` / `.turrets.numslots` / `.weapons.numslots` | integer | Number of slots |
| `.<X>.<state>.count` | integer | Count filtered by state (`all`/`construction`/`operational`/`wreck`) |
| `.<X>.<state>.list` | list | List filtered by state |
| `.<X>.<state>.indexof.{$component}` | integer | Index of $component (1-based) |
| `.<X>.<state>.random` | shieldgenerator/turret/weapon | Random component |

Where `<X>` is `shields`, `turrets`, or `weapons`.

### Construction sequence

| Property | Type | Description |
|---|---|---|
| `.constructionsequence` | constructionsequence | Current construction sequence |
| `.hasstagedconstruction` | boolean | Current/planned construction is staged |
| `.hasfutureconstructionstage` | boolean | Has future stages? |
| `.planmodule.{$constructionplanentryid}` | module | Module from construction plan entry |
| `.requiresconstructionvessel.{constructionsequence}` | boolean | Construction sequence needs construction vessel |

### Loadout overrides (ship/object loadout)

The loadout system controls equipment generation:

| Property | Type | Description |
|---|---|---|
| `.loadoutlevel` | float | Loadout level used to generate this object |
| `.rawloadoutlevel` | float | Without fallback to parameters.xml |
| `.minloadoutlevel` | float | Minimum allowed (e.g. lowerbound in job definition) |
| `.loadoutvariation` | float | Loadout variation range |
| `.moduleloadoutlevel` | float | Module loadout level (station) |
| `.rawmoduleloadoutlevel` | float | Without fallback |
| `.moduleloadoutvariation` | float | Module variation |

Plus quantity + quality variants:

| Property pattern | Description |
|---|---|
| `.loadoutquantity.level` / `.variation` | Quantity overrides |
| `.rawloadoutquantity.level` / `.variation` | Without fallback (check -1) |
| `.loadoutquality.level` / `.variation` | Quality overrides |
| `.rawloadoutquality.level` / `.variation` | Without fallback (check -1) |
| `.moduleloadoutquantity.level` / `.variation` | Module quantity (station) |
| `.moduleloadoutquality.level` / `.variation` | Module quality (station) |
| `.rawmoduleloadout...` | Without fallback variants |

The "raw" variants must be checked against -1 before use (signal that no override is in effect).

### Defence drone mode

| Property | Type | Description |
|---|---|---|
| `.defencedronemode` | dronemode | Current defence drone mode |

## Common access patterns

### "Get all operational turrets on a ship"

```xml
<set_value name="$turrets" exact="$ship.turrets.operational.list"/>
<do_for_each name="$turret" in="$turrets">
    <write_to_logbook text="$turret.name"/>
</do_for_each>
```

### "Check if a ship can be boarded"

```xml
<do_if value="$ship.iscapturable">
    <!-- can be captured -->
</do_if>
```

### "Check if boarding operation is in progress"

```xml
<do_if value="$ship.boardingoperation?">
    <write_to_logbook text="'Boarding active!'"/>
</do_if>
```

### "Find all shields on a station"

```xml
<set_value name="$shields" exact="$station.shields.all.list"/>
```

### "Set ship to highest alert"

```xml
<set_alert_level object="$ship" level="alertlevel.red"/>
```

## Common gotchas

- ⚠ **Turrets DEACTIVATE on alert level green.** Ships with green alert don't fight back.
- ⚠ **`.iscapturable` controls multiple things at once**: signalleak capture (S/M) AND boarding capture (L+) AND S-ship pilot eject behavior.
- ⚠ **The shield/turret/weapon `state` parameter is mandatory** — `<X>.list` without state is invalid. Use `.all.list`, `.operational.list`, etc.
- ⚠ **Raw loadout properties may return -1** — meaning "no override". Check `if $ship.rawloadoutlevel != -1` before using.
- ⚠ **`.boardingoperations` (plural) is for DEFENDING side** — `.boardingoperation` (singular) is the operation this object is in (attacking or defending).
- ⚠ **Construction stages are managed via container subclass** — defensible exposes the read API but not write.

## Inheritance hierarchy

```
object
  └── controllable
       └── defensible              ← this class
            ├── container (stations)
            │    └── station (concrete)
            └── ship (concrete mobile)
```

## Common actions

| Action | Purpose |
|---|---|
| `<set_alert_level>` | Set object's alert level |
| `<initiate_boarding>` | Begin a boarding operation |
| `<cancel_boarding>` | Abort boarding operation |
| `<generate_loadout>` | Generate a loadout (uses loadoutlevel, etc.) |
| `<apply_loadout>` | Apply a generated loadout |
| `<evaluate_ammo_storage>` | Evaluate ammo storage state |
| `<add_ammo>` | Add ammo to ammostorage (for deployables) |

## Related

- [Controllable](/game/objects/controllable/) — parent class
- [Container](/game/objects/container/) — child class (cargo/build/trade infrastructure)
- [Ship](/game/objects/ship/) — concrete mobile subclass
- [Shield generator](/game/objects/shield-generator/) — `.shields.*.list` items
- [Turret](/game/objects/turret/) — `.turrets.*.list` items
- [Weapon](/game/objects/weapon/) — `.weapons.*.list` items
- [Boarding operation](/game/objects/boarding-operation/) — `.boardingoperation` reference
- [Loadout](/game/objects/loadout/) — what loadout properties control
- [Architectural overview: Boarding](/overviews/boarding/) — full boarding mechanic

---

*Defensible adds defense mechanics on top of Controllable. Most modders interact with it via ship.shields / station.turrets / boarding mechanics. The loadout properties are critical for procedurally-generated content.*

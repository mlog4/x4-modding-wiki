---
title: Cargo
description: Cargo system for ware-holding entities. Engine types cargolist / containercargolist / modulecargolist. Used by ship cargo bay, station storage, build storage.
---

The **Cargo** system is X4's mechanism for **holding wares** in entities. The engine exposes three related cargo types — `cargolist` (base), `containercargolist` (container-scoped variant), `modulecargolist` (module-scoped) — that share the underlying ware-amount-list interface but add cargo-specific properties (free space, capacity, ware tags).

## Type hierarchy

```
wareamountlist
  └── cargolist (pseudo) — adds cargo-specific properties
       ├── containercargolist (pseudo) — adds container-level free/capacity
       └── modulecargolist (pseudo) — adds module-level free/capacity
```

All cargo types are **pseudo-types** (engine-internal abstraction over ware-amounts; not directly instantiable from MD).

## Cargolist properties (base)

Inherited from [wareamountlist](/lang/md-framework/expression/):
- `.list` — all wares as a script list
- `.table` — all wares + amounts as a table
- `.count` — number of distinct wares
- `.{$ware}.count` — amount of specific ware

Plus cargo-specific:

| Property | Type | Description |
|---|---|---|
| `.{$ware}.free` | integer | Amount of $ware that can be added (= max - current) |
| `.{$ware}.max` | integer | Maximum $ware in cargo (ignoring existing) |
| `.tags` | list | Compatible ware tags |
| `.hastag.{$tag}` | boolean | Compatible with ware tag? |
| `.hastag.<tagname>` | boolean | Shortcut for hastag.{tag.<tagname>} |
| `.hasanytag.{$list}` | boolean | Has any tag from list? |
| `.hasalltags.{$list}` | boolean | Has all tags from list? |

## Containercargolist (container-scoped)

Used as `container.cargo`. Adds free space + capacity tracking per ware-transport tag:

| Property | Type | Description |
|---|---|---|
| `.free.all` | largeint | Total free cargo volume |
| `.free.solid` | largeint | Free volume for solids |
| `.free.liquid` | largeint | Free volume for liquids |
| `.free.condensate` | largeint | Free volume for condensate |
| `.free.container` | largeint | Free volume for containers |
| `.free.universal` | largeint | Free volume for universal |
| `.free.{$tag}` | largeint | Free volume for specified tag |
| `.capacity.all` | largeint | Total volume available |
| `.capacity.solid` | largeint | Total solid capacity |
| `.capacity.liquid` | largeint | Total liquid capacity |
| `.capacity.condensate` | largeint | Total condensate capacity |
| `.capacity.container` | largeint | Total container capacity |
| `.capacity.universal` | largeint | Total universal capacity |
| `.capacity.{$tag}` | largeint | Total capacity for tag |

## Modulecargolist (module-scoped)

Used as `module.cargo` for module-level storage. Same properties as containercargolist but module-specific.

## Common access patterns

### "Check available cargo space on a ship"

```xml
<set_value name="$free" exact="$ship.cargo.free.all"/>
<do_if value="$free ge 100">
    <add_inventory entity="$ship" ware="ware.energycells" exact="100"/>
</do_if>
```

### "Get current cargo as a list"

```xml
<do_for_each name="$ware" in="$ship.cargo.list">
    <write_to_logbook text="$ware.{1}.name + ': ' + $ware.{2}"/>
</do_for_each>
```

### "Check container is compatible with ware tag"

```xml
<do_if value="$ship.cargo.hastag.tag.container">
    <!-- Can carry container wares -->
</do_if>
```

### "Find max amount of ware that fits"

```xml
<set_value name="$max" exact="$ship.cargo.{ware.energycells}.free"/>
```

## Common gotchas

- ⚠ **`wareamountlist` storage degrades when stored in a variable** — access inline always. See [Ware storage gotcha](/game/economy/ware/#common-gotchas).
- ⚠ **`cargolist.{$ware}.max` is the MAXIMUM possible** — not current. Use `cargolist.{$ware}.count` for current amount.
- ⚠ **Cargo is byte-level capacity tracked per WARE TRANSPORT TAG** — solid/liquid/condensate are separate budgets. Adding container-tagged ware doesn't shrink solid capacity.
- ⚠ **Ship/station modulecargolist and containercargolist differ slightly** — modulecargolist is per-module, containercargolist is aggregated across modules.
- ⚠ **`add_inventory ware="$string"` silently fails** — must wrap as `ware.{$string}`. See [add_inventory gotcha](/game/economy/ware/).

## Common actions

| Action | Purpose |
|---|---|
| `<add_inventory>` | Add a ware to cargo |
| `<remove_inventory>` | Remove a ware from cargo |
| `<transfer_inventory>` | Transfer wares between containers |
| `<set_cargo_target>` | Set target amount for a traded ware |

## Related

- [Ware](/game/economy/ware/) — what cargo holds
- [Container](/game/objects/container/) — uses containercargolist
- [Module](/game/objects/module/) — uses modulecargolist
- [Ship](/game/objects/ship/) — has cargo
- [Build storage](/game/objects/build-storage/) — cargo for construction
- [Trade offer](/game/economy/trade-offer/) — what cargo trades for

---

*Cargo is the central ware-storage abstraction. Modders interact with it via `container.cargo` (most stations) or `ship.cargo` (transports). The free/capacity per ware-transport-tag is the key to understanding why a "full" ship can still accept more wares — it depends on the tag.*

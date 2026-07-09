---
title: Welfare module
description: Station module providing workforce morale bonuses. Class label without datatype properties — interacts via the station-level workforce bonus.
---

A **Welfare module** is a station [Module](/game/objects/module/) that provides workforce morale bonuses. It contributes to `Station.workforce.bonus` — the multiplier that boosts production rates above baseline.

**Inheritance:** `component → destructible → module → welfaremodule`. The datatype declares **no own properties** (`scriptproperties.xml:1112`). Like [Defence module](/game/objects/defence-module/) and [Connection module](/game/objects/connection-module/), welfare module is a class label — its effect is folded into the station-level workforce bonus.

## Properties

No welfare-module-specific properties. Use:

- **Inherited from `module`:** `.numdocks.{docksize}`, `.haswalkableroom`
- **Inherited from `destructible`:** `.hull`

## Common patterns

### "Find all welfare modules on a station"

```xml
<do_for_each name="$mod" in="$Station.modules">
    <do_if value="$mod.isclass.welfaremodule">
        <!-- welfare module -->
    </do_if>
</do_for_each>
```

### "Detect player adding welfare modules"

```xml
<do_if value="event.param3.isclass.welfaremodule">
    <!-- player added a welfare module -->
</do_if>
```

### "Check workforce bonus impact at station level"

Welfare modules don't expose their own contribution. To know what a welfare module adds, compare `Station.workforce.bonus` before and after:

```xml
<set_value name="$Before"
    exact="$Station.workforce.bonus"/>
<!-- ... welfare module added ... -->
<set_value name="$After"
    exact="$Station.workforce.bonus"/>
<set_value name="$Gain"
    exact="$After - $Before"/>
```

## Common gotchas

- ⚠ **Welfare module declares NO datatype properties.** All effects are folded into the station-level `workforce.bonus`.
- ⚠ **No per-module "bonus value" accessor.** Vanilla doesn't expose per-welfare-module contribution. Read the aggregate at station level.
- ⚠ **Welfare without habitation is wasted.** Welfare scales workforce bonus — a station without habitation has no workforce, and welfare adds zero. Pair them.
- ⚠ **Different welfare types may stack differently.** Some moduletypes are "diminishing returns" — adding more of the same type yields less per module. The mechanic is engine-side and not directly modifiable from MD.

## Related

- [Module](/game/objects/module/) — parent abstraction.
- [Habitation module](/game/objects/habitation-module/) — provides the workforce that welfare scales.
- [Production module](/game/objects/production-module/) — final beneficiary of the workforce bonus.
- [Station](/game/objects/station/) — aggregator (`.workforce.bonus`).

---

:::tip[Pattern — class label that affects an aggregate]
Welfare module is the canonical example of "a module type whose contribution is opaque". You know it helps; you can't measure each module individually. Stations with N welfare modules show their total via `Station.workforce.bonus`.
:::

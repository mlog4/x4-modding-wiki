---
title: Licence
description: Permission to dock, trade, or build at a faction. Tied to relation thresholds; sometimes purchasable via traders.
---

A **Licence** is a permission slip from a [Faction](/game/factions/faction/) — typically for docking, trading, or building. The player acquires licences by raising relations or paying. NPC factions hold licences with each other based on faction logic.

**Inheritance:** None — `licence` is its own root datatype.

## Properties

| Property | Type | Description |
|---|---|---|
| `.exists` | bool | Licence exists |
| `.name` | string | Display name |
| `.rawname` | string | Raw text entry reference |
| `.description` | string | Description text |
| `.minrelation` | float | Min relation needed to acquire |
| `.precursor` | string | Licence type required as precursor |
| `.price` | money | Purchase price |
| `.issellable` | bool | Sellable via traders |
| `.faction` | faction | Granting faction |
| `.type` | string | Licence type (e.g. `"buildplot"`, `"dock"`) |

## Faction-side accessors

| Faction property | Description |
|---|---|
| `.licences` | List of own licences |
| `.heldlicences` | List of held licences (from other factions) |
| `.haslicence.<type>.{faction}` | Has licence of type from faction |
| `.canholdlicence.{licence}` | Currently eligible to hold |
| `.canholdlicence.<type>.{faction}` | Eligible for type from faction |
| `.licence.<type>` | Licence value of type (may not `.exists`) |

These let you query "does X hold a licence with Y" without iterating licence objects directly.

## Common patterns

### "Player has trading licence with Argon?"

```xml
<do_if value="faction.player.haslicence.trade.{faction.argon}">
    <!-- can trade freely with Argon -->
</do_if>
```

### "Check if a build plot is acquirable"

```xml
<do_if value="@$Station.buildplot
    and faction.player.canholdlicence.{$Station.buildplot}">
    <write_to_logbook
        text="'Player can buy build plot for: '
            + $Station.buildplot.price + 'Cr'"/>
</do_if>
```

## Common gotchas

- ⚠ **Licence is FACTION-PAIR data.** "Player holds licence with Argon" is different from "player holds licence with Teladi". Always specify the issuing faction.
- ⚠ **`.minrelation` is a float, not UI value.** Same as elsewhere — float -1..+1, NOT -30..+30. Use range edges via `Faction.relation.<range>.min/mid/max`.
- ⚠ **`.issellable` controls trader availability.** A non-sellable licence is acquired only by hitting `.minrelation`. Player can't shortcut via credits.
- ⚠ **`.precursor` chains licences.** Some licences require holding a precursor first. Read `.precursor` recursively for the full acquisition path.
- ⚠ **DLC content gates some licences.** Influence-system licences require Tides of Avarice. Check existence (`.exists`) before referencing.

## Related

- [Faction](/game/factions/faction/) — issuer; licences are faction-scoped permissions.
- [Station](/game/objects/station/) — `.buildplot.price` for build-plot licences.
- [Ware](/game/economy/ware/) — `.buyrestriction` / `.sellrestriction` per faction (related notoriety mechanic).

---

:::tip[Pattern — faction-pair data]
Licence is the canonical faction-pair structure — it always describes "X holds Y from Z". Use `Faction.haslicence.<type>.{otherFaction}` rather than iterating licence lists.
:::

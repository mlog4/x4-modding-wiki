---
title: Data vault
description: Side-quest unlock container with three-state lock progression. Signals 'datavault_unlocked' on player completion.
---

A **Data vault** is a side-quest object that the player progressively unlocks by finding scattered data fragments around the galaxy. Once fully unlocked, it reveals story content (timeline entries, blueprints, narrative payoffs). Modders engage with data vaults when adding mentor / story / discovery content.

**Inheritance:** `component → destructible → object → datavault`. The datatype adds 3 unlock-state flags; the rest is inherited.

**Unique lifecycle pattern:** unlike most game objects (binary alive/dead), a data vault has **three lock states** with mutually-exclusive flags.

## States

| Flag | Meaning |
|---|---|
| `.islocked` | Fully locked — no progress yet |
| `.ispartiallyunlocked` | Some lock-bypass progress made, but not all |
| `.isunlocked` | Fully unlocked — story payload revealed |

Exactly one of these is `true` at any given time. The transitions are one-way: `locked → partiallyunlocked → unlocked`. Vanilla never re-locks a data vault.

## Properties

### Datavault-specific

(All three above.)

### Useful inherited

| Property | Source | Description |
|---|---|---|
| `.sector` / `.zone` / `.position` | object | Location |
| `.knownname` | component | Display name |
| `.macro` | component | Vault variant |
| `.knowntoplayer` | component | Player has discovered it |

Data vaults belong to `faction.ownerless`. No `.owner` semantics for modder code.

## Actions

There is no `<unlock_datavault>` action — unlocking is driven by player interaction at the vault. Modder code typically:

- Spawns custom data vaults via `<create_object>`
- Listens for the `'datavault_unlocked'` signal
- Reads the state flags to gate story progression

### Spawn a data vault

```xml
<create_object
    name="$Vault"
    macro="$VaultMacro"
    owner="faction.ownerless"
    sector="$Sector">
    <position x="$x" y="$y" z="$z"/>
</create_object>
```

The vault macros are defined per-DLC; see `placedobjects.xml` for the vanilla set.

### Find all data vaults in a sector

```xml
<find_object name="$Vaults"
    space="$Sector"
    class="class.datavault"
    multiple="true"/>
```

### Filter by lock state

```xml
<do_for_each name="$vault" in="$Vaults">
    <do_if value="$vault.isunlocked">
        <!-- player has completed this one -->
    </do_if>
</do_for_each>
```

### Force-unlock a vault for testing / scripted scenarios

Vanilla uses the `'datavault_unlocked'` signal pathway rather than direct API. From `placedobjects.xml:1188`:

```xml
<signal_objects
    object="player.entity"
    param="'datavault_unlocked'"
    param2="[$Vault, $TimelineID]"/>
```

This fires the same engine path the player would trigger, registering the unlock and dispatching timeline content. **`signal_objects` is the canonical "unlock" trigger** — don't try to manipulate `.islocked` directly (it's read-only).

## Events

| Event | When | Notes |
|---|---|---|
| `event_object_signalled` (with `param='datavault_unlocked'`) | A data vault was unlocked | `event.param2.{1}` is the vault, `event.param2.{2}` is the timeline ID. Vanilla `placedobjects.xml:1188, 1224` |
| `event_object_destroyed` | Vault destroyed (rare; vaults are usually invincible) | Standard |

There is **no** `event_datavault_unlocked` event. Use the `event_object_signalled object="player.entity" param="'datavault_unlocked'"` pattern. Vanilla `notifications.xml:3851`, `x4ep1_mentor_subscription.xml:6097, 6157` all use this pattern.

## Common gotchas

- ⚠ **No dedicated `event_datavault_unlocked` event.** Use `event_object_signalled object="player.entity" param="'datavault_unlocked'"`. Don't write `event_datavault_X` — it doesn't exist.
- ⚠ **The unlock signal target is `player.entity`, not the vault itself.** Vanilla fires the signal on the player to allow listener cues to live on the player namespace.
- ⚠ **`.islocked` / `.ispartiallyunlocked` / `.isunlocked` are read-only state.** Don't try to set them. Trigger the engine pathway via `signal_objects param="'datavault_unlocked'"`.
- ⚠ **Data vaults don't auto-respawn.** Unlike lockboxes (sector-seeded), vaults are unique world objects placed by `placedobjects.xml`. If a mod destroys one, it's gone.
- ⚠ **Vault state persists across save/load.** Unlike most events, the unlock state survives. Don't re-fire `'datavault_unlocked'` on game start — listen to existing state instead.
- ⚠ **Signal leaks attached to vaults are filtered out by vanilla.** `signal_leaks.xml:323` explicitly ignores leaks tagged for data vaults. If your mod adds custom signal leaks, ensure they don't accidentally match the vault filter.
- ⚠ **`.knowntoplayer` is FALSE for undiscovered vaults.** Even though the object exists, the player needs to encounter it via story / proximity / exploration. Mod logic that lists "all player vaults" should filter on this.

## Examples

### Example 1: Listen for player unlocking any data vault

```xml
<cue name="WatchDataVaultUnlocked" instantiate="true">
    <conditions>
        <event_object_signalled
            object="player.entity"
            param="'datavault_unlocked'"/>
    </conditions>
    <actions>
        <set_value name="$vault" exact="event.param2.{1}"/>
        <set_value name="$timeline" exact="event.param2.{2}"/>
        <write_to_logbook
            text="'Data vault unlocked in '
                + $vault.sector.knownname
                + ' — timeline ' + $timeline"/>
    </actions>
</cue>
```

Pattern from vanilla `notifications.xml:3851`.

### Example 2: Count unlocked vaults

```xml
<find_object name="$Vaults"
    space="player.galaxy"
    class="class.datavault"
    multiple="true"/>

<set_value name="$Locked" exact="0"/>
<set_value name="$Partial" exact="0"/>
<set_value name="$Unlocked" exact="0"/>

<do_for_each name="$vault" in="$Vaults">
    <do_if value="$vault.isunlocked">
        <set_value name="$Unlocked" operation="add" exact="1"/>
    </do_if>
    <do_elseif value="$vault.ispartiallyunlocked">
        <set_value name="$Partial" operation="add" exact="1"/>
    </do_elseif>
    <do_else>
        <set_value name="$Locked" operation="add" exact="1"/>
    </do_else>
</do_for_each>

<write_to_logbook
    text="'Vaults — Unlocked: ' + $Unlocked
        + ' Partial: ' + $Partial
        + ' Locked: ' + $Locked"/>
```

### Example 3: Detect the LAST data vault — "is this the final one?"

```xml
<cue name="WatchFinalVault" instantiate="true">
    <conditions>
        <event_object_signalled
            object="player.entity"
            param="'datavault_unlocked'"/>
    </conditions>
    <actions>
        <find_object name="$Vaults"
            space="player.galaxy"
            class="class.datavault"
            multiple="true"/>

        <set_value name="$RemainingLocked" exact="0"/>

        <do_for_each name="$v" in="$Vaults">
            <do_if value="not $v.isunlocked">
                <set_value name="$RemainingLocked"
                    operation="add" exact="1"/>
            </do_if>
        </do_for_each>

        <do_if value="$RemainingLocked == 0">
            <write_to_logbook
                text="'Player unlocked the final data vault!'"/>
        </do_if>
    </actions>
</cue>
```

Pattern from vanilla `x4ep1_mentor_subscription.xml:6102` (`<!--This was the final datavault-->`).

## Architectural context

- **How data vaults are placed in the galaxy:** Architectural overview *Placed objects* — `placedobjects.xml` defines per-sector vault macros and timeline associations.
- **Timeline content delivery:** Architectural overview *Timeline content* — the timeline ID returned by the unlock signal selects which story chunk to display.
- **Mentor Subscription quest:** Architectural overview *Mentor Subscription* — `x4ep1_mentor_subscription.xml` uses cumulative `datavault_unlocked` events to gate quest progression.

## Related

- [Lockbox](/game/objects/lockbox/) — sibling "world-spawned with custom content" object. Lockbox is generic loot; data vault is story-specific.
- [Signal leak](/game/objects/signal-leak/) — sometimes attached to vaults as hint markers.
- [Sector](/game/world/sector/) — what data vaults exist in.
- [Ware](/game/economy/ware/) — collectable data wares can be vault-related rewards.

---

:::tip[Pattern — three-state lock with signal-driven unlock]
Data vault is the canonical example of *progressive unlock with side-channel signal*. The `signal_objects param="'datavault_unlocked'"` pathway is reused throughout vanilla for vault progression. Use the same pattern (signal on player.entity) for any custom mod that wants similar progression UX.
:::

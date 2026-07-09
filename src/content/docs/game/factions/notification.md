---
title: Notification
description: A notification type the player can enable/disable in settings — controls which engine alerts display.
---

A **Notification** is a notification type — one of the entries in the player's settings menu. Modders adding new alert types create new notification entries.

**Inheritance:** `dbdata → notification`.

## Properties

| Property | Type | Description |
|---|---|---|
| `.id` | string | Notification id |
| `.name` | string | Display name in settings |
| `.rawname` | string | Raw text entry reference |
| `.description` | string | Description (tooltip) |
| `.active` | bool | Player has this notification enabled |

## Common patterns

### "Check if player wants to see a specific notification"

```xml
<do_if value="notification.shipdestroyed.active">
    <write_to_logbook
        text="'Ship destroyed: ' + $Ship.knownname"/>
</do_if>
```

Skips the write if player has disabled the notification type — respects user preferences.

## Common gotchas

- ⚠ **`.active` is a per-player preference.** Vanilla's notification cues check this before displaying messages. Custom mods should do the same.
- ⚠ **Notifications are db-defined.** Add new types via data files; runtime code only reads `notification.X.active`.
- ⚠ **Reading `.active` is fine; writing isn't.** Player toggles via settings UI, not via MD actions.

## Related

- All vanilla notification cues — see `notifications.xml` (~4000 lines) for canonical usage.
- Settings UI — exposes `.active` to the player.

---

:::tip[Pattern — opt-in db reference]
Notification is the canonical *player preference toggle* — db data with a runtime-readable `.active` flag. Always check before noisy player output.
:::

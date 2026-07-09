---
title: Lock
description: Locked-state mechanism on lockboxes. Player picks / scans to open. Stub page.
---

**Lock** is the **locked-state mechanism** on a [Lockbox](/game/objects/lockbox/). The lock prevents access to the lockbox's contents until the player picks it open (typically via scan / EMP / mini-game).

## Properties

- `.parent` — the lockbox containing the lock
- `.islocked` — boolean: is this lock currently locked?

## Common context

Locks appear inside lockboxes. The player must defeat the lock to access the lockbox contents — typically:
- Scan with the scanner mode
- Wait for cooldown / animation
- Lock opens → lockbox accessible

## Related

- [Lockbox](/game/objects/lockbox/) — parent containing the lock
- [Scanner](/game/objects/scanner/) — used to bypass locks

---

*Stub page — full lock reference coming.*

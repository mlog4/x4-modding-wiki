---
title: Equipment
description: Blueprint scan progress for equipment wares. 9 sections — Missile Turrets / (Non-Missile) Turrets / Missile Launchers / Engines / Shield Generators / Weapons / Satellites / Missiles / Countermeasures.
sidebar:
  order: 3
---

Blueprint-progress viewer for equipment wares. 9 sections covering everything ship-mounted.

## In-game view

![Equipment — Missile Turrets and start of Non-Missile Turrets sections](/x4-modding-wiki/img/mods/deadair-scripts/bp-equipment.jpg)

## Sections

Fixed section order at [`md/deadairdynamicuniversemenus.xml:6863`](https://github.com/mlog4/deadair_scripts):

1. **Missile Turrets** — `class.missileturret` (default **100** fragments — heavy grind)
2. **Non-Missile Turrets** — `class.turret` (default **100**)
3. **Missile Launchers** — `class.missilelauncher` (default **100**)
4. **Engines** — `class.engine` (default **100**)
5. **Shield Generators** — `class.shieldgenerator` (default **100**)
6. **Weapons** — `class.weapon` (default **100**)
7. **Satellites** — `class.satellite` (default 20)
8. **Missiles** — `class.missile` (default 20)
9. **Countermeasures** — `class.countermeasure` (default 20)

**Design intent:** the six 100-count classes are the "high-value equipment blueprints" DA wants to make a genuine grind. Weapons, engines, and shield generators dictate ship combat power more than the ship hull itself — DA is opinionated that these should take significant scanning to acquire.

## Observed sample-save state

**Missile Turrets section (24 tracked entries visible), all at `0/100`:**

Format: `<FACTION> <SIZE> <TYPE> Turret Mk1`. Observed factions: ARG (Argon), BOR (Boron), PAR (Paranid), SPL (Split), TEL (Teladi), TER (Terran).

Sizes: L (large), M (medium).

Types shown: Dumbfire, Tracking.

Sample rows:
- ARG L Dumbfire Turret Mk1 — 0/100
- ARG L Tracking Turret Mk1 — 0/100
- ARG M Dumbfire Turret Mk1 — 0/100
- ARG M Tracking Turret Mk1 — 0/100
- BOR M Dumbfire Turret Mk1 — 0/100
- BOR M Tracking Turret Mk1 — 0/100
- PAR L Dumbfire, PAR L Tracking, PAR M Dumbfire, PAR M Tracking Mk1 — all 0/100
- SPL L/M Dumbfire + Tracking Mk1 — all 0/100
- TEL L/M Dumbfire + Tracking Mk1 — all 0/100
- TER L/M Dumbfire + Tracking Mk1 — all 0/100

**Non-Missile Turrets section (visible at bottom of screenshot):**

Similar format but shows more types — Beam / Mining / Plasma / Pulse / Bolt / Flak. Multiple rows visible for ARG: Beam Turret Mk1 (×2), Mining Turret Mk1 (×2), Plasma Turret Mk1 (×2), Bolt Turret Mk1 (×2), Flak Turret Mk1 (×2), Pulse Turret Mk1 (×2). L and M each get their own row.

**Duplicate rows** for the same name (Beam Turret Mk1 ×2, etc.) are the same knownname-share phenomenon seen in Ships — different macros (per-size) render the same display name.

## Read

- **No equipment blueprints completed** — makes sense given the 100-count requirement.
- **All Mk1 variants** — no Mk2/Mk3 turrets have been scanned yet. Higher-Mk equipment probably hasn't crossed the player's police-scan window yet.
- **Faction distribution roughly even** — 6 vanilla factions each × 2 sizes × 2 missile types = 24 rows, matching what's visible.

## Interaction with the [Scan Settings](../../#scan-settings--how-it-works)

The 100-count defaults on the six high-value classes are configurable — you can dial them down on the main menu if you find the grind too heavy. Lowering `missileturret` from 100 to 40 makes turret-blueprint hunting comparable to S-ship-hunting difficulty.

**Practical hint:** if you want to farm equipment blueprints, target enemy L/M ships (they carry more equipment slots) and use a top-tier scanner. The scan awards fragments per-equipment-piece too, so an L-ship carrying 8 turrets = 8 turret-fragment scans in one go.

## Missiles + countermeasures + satellites

These low-count (20) classes complete quickly:

- **Missiles** — pick up missile blueprints in ~5-6 encounter-scans.
- **Countermeasures** — same.
- **Satellites** — same.

You'll likely see these blueprints complete before any of the 100-count equipment types.

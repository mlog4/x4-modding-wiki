---
title: Mechanics deep dive
description: Under-the-hood architecture — modded-faction dynamic support, kill-based Xenon XP, save-safety, 6h Extension TTL, and engine integration points.
sidebar:
  order: 3
---

Architecture and internals that don't fit inside one specific menu. Useful for modders, integrators, and users diagnosing unusual behavior.

## Modded-faction dynamic support

**v2.0.0 architecture.** Instead of hardcoding vanilla-only faction lists for expedition eligibility, DA queries `get_factions_by_tag tag="tag.claimspace"` at runtime. Any faction with that tag is a candidate. This lets Apus, ETW, and future faction mods participate without patching DA.

Companion mods provide the actual expedition / SST job templates:

- **[Apus Compat Patch](/x4-modding-wiki/mods/apus-compat/)** — Apus Stellar Treaty
- **[ETW Compat Patch](/x4-modding-wiki/mods/etw-compat/)** — Eternal Twilight (3 factions)

Without a compat mod, the modded faction shows in the Jobs SST menu with **"No suitable ships available!"** — the roster query succeeds (faction is enumerated) but no matching job template exists to build ships from.

## Kill-based Xenon Evolution XP

Xenon evolution "points" accrue on **kills only**, not damage. Ship-mode damage without a kill = no XP contribution. This is by design — chip-damage from repeated engagements shouldn't cascade into runaway evolution.

## Save-safety

Every DA setting persists across save/load. Turning features on/off mid-save is safe — DA does state validation on load and re-applies preset semantics via the reconcile passes. If you change a preset mid-save, the new preset applies immediately without needing a save/reload.

**Exception:** the Presets system's runtime registry is rebuilt on every game load / start (mlog080+ pattern). This means edits to `md/mlog_da_presets.xml` between saves get picked up on the next load — but only after a full X4 restart, since MD scripts are cached at engine boot.

## 6h TTL on Extension Built lists

**mlog087 fix.** Previously a failed build attempt permanently blocked a cluster for that faction. If Zyarth's first shipyard attempt in Wretched Skies V failed for any reason, they'd never try again. Now Built entries carry a `player.age` timestamp; the observe cue re-evaluates entries older than 6 game-hours as fresh candidates.

**Data migration:** legacy raw cluster refs get a 6h grace period from the first observe pass (typeof check preserves backward-compat).

## Global integration points

DA integrates with vanilla systems at several places:

| Hook | Purpose |
|---|---|
| `md.Setup.GameStart` | Init cue trigger — DA installs its runtime globals here. |
| `md.Guidance.NewTarget` | Cross-cluster player-target commands from DA menu buttons. |
| `policeassetscannedship` engine signal | Blueprint Scanning subscription point. |
| `event_object_destroyed` | Xenon Evolution kill counter + Station Traders reconcile trigger. |
| `event_god_created_station` / `event_god_created_factory` | Trigger points for the mlog_da_extension / God passes. |

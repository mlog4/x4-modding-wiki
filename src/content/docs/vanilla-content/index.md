---
title: Vanilla content catalog
description: What ALREADY happens in vanilla X4 — story arcs, faction subscriptions, terraforming, game starts. Player-facing content reference for mod authors checking for conflicts.
---

This section is a **catalog of what already happens in vanilla X4**. It's not API documentation — it's a player-facing description of every storyline, subscription, terraforming project, and game start that vanilla ships with.

**Use this section to answer "will my mod conflict with vanilla content?"** before publishing.

For technical *how-to-write-missions*, see [Game API → Missions](/game/missions/) and [Architectural overview: Mission framework](/overviews/mission-framework/).

## Why this catalog exists

When you add a mod that touches faction relations, sector ownership, NPC spawning, mission templates, or economy — your changes may **conflict with vanilla content**. Symptoms:

- Vanilla story arc breaks (NPC despawned by your mod / sector ownership changed)
- Vanilla subscription mission can't complete (your mod hostile-flags the target)
- Terraforming projects unlocked when player hasn't earned them
- Your custom faction can't subscribe because vanilla expects specific factions

**A mod that respects vanilla content is a mod that ships without bug reports.** This catalog helps you check before pressing Upload.

## The vanilla content landscape

| Category | Pages | What's there |
|---|---|---|
| **Story arcs** | [Story arcs catalog](/vanilla-content/story-arcs/) | 7 hand-authored arcs across base + DLC (Paranid civil war, Buccaneers, Ventures, Welfare research, Embassy research, Xenon research, Diplomacy intro) |
| **Terraforming** | [Terraforming catalog](/vanilla-content/terraforming/) | 99 projects across 13 categories — water/atmosphere/biosphere/economy/amenities/training/Xenon/etc. |
| **Faction subscriptions** | [Faction subscriptions catalog](/vanilla-content/faction-subscriptions/) | 4 subscription types (War / Trade / Pirate / Mentor) with per-faction content |
| **Game starts** | [Game starts catalog](/vanilla-content/game-starts/) | 8 starts (Wayward Scion / Young Gun / Trader / Warrior / Scientist / Explorer / Boso Ta / Workshop) |
| **Mod-conflict checklist** | [Conflict checklist](/vanilla-content/mod-conflict-checklist/) | Practical "what to check" for common mod categories |

## Quick conflict matrix

If your mod does X, check vanilla coverage Y:

| Your mod does… | Check vanilla… |
|---|---|
| Adds new generic missions | [Generic mission catalog](/game/missions/generic-mission/) — don't duplicate gm_* templates |
| Adds faction subscriptions | [Faction subscriptions](/vanilla-content/faction-subscriptions/) — vanilla wars + trade routes |
| Touches sector ownership | [Story arcs](/vanilla-content/story-arcs/) (sector references) + [Game starts](/vanilla-content/game-starts/) (starting territories) |
| Adds new factions | [Story arcs](/vanilla-content/story-arcs/) (hostility hooks) + [Faction subscriptions](/vanilla-content/faction-subscriptions/) (subscription registry) |
| Spawns persistent NPCs | [Story arcs → Persistent characters](/vanilla-content/story-arcs/#persistent-characters) |
| Adds terraforming features | [Terraforming catalog](/vanilla-content/terraforming/) — 99 projects already cover most cases |
| Changes economy / ware values | None directly — but see [Architectural overview: Reward calculation](/overviews/reward-calculation/) for mission-reward implications |
| Adds custom game starts | [Game starts](/vanilla-content/game-starts/) — module= naming conventions |
| Modifies relations | [Story arcs](/vanilla-content/story-arcs/) — many arcs check specific relation thresholds to fire |

## The vanilla content scale (lines of MD code)

Just to set scale on what you're working alongside:

| Content | LoC |
|---|---|
| Paranid story arc (`story_paranid.xml`) | 20,236 |
| War subscriptions (`x4ep1_war_subscriptions.xml`) | 17,050 |
| Trade subscriptions | 6,574 |
| Terraforming system (`terraforming.xml`) | 5,616 |
| Pirate subscriptions | 3,851 |
| All `gm_*` mission templates (combined) | ~50,000 |
| All `rml_*` reusable libraries (combined) | ~30,000 |

Vanilla has been built and refined over **8+ years** of release. Your mod's challenge isn't writing new content — it's not breaking what's there.

## Related

- [Game API → Missions](/game/missions/) — how to write missions technically
- [Architectural overview: Mission framework](/overviews/mission-framework/) — layered composition
- [Wiki: DLC handling](/wiki/dlc-handling/) — content-presence checks
- [Wiki: Mod compatibility](/wiki/mod-compatibility/) — broader compatibility discipline

---

*A mod that respects vanilla content is invisible to vanilla. A mod that breaks vanilla content is the mod you see in negative Workshop reviews. The catalog helps you become the former.*

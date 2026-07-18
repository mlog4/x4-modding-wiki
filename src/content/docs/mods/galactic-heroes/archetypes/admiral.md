---
title: Admiral archetype
description: Faction military leader. Multi-sector campaigns, home-space defence, allied coordination. Decision inputs, branches, coverage, and ship scaling per star rank.
---

An **Admiral** leads a major faction's military. When faction relations shift, when an ally is under siege, when a border sector becomes contested — the admiral makes a strategic decision and commits their flagship + escort accordingly.

## Coverage

- **10 template pools** across **8 major factions** (Argon Federation, Antigone Republic, Teladi Company, Ministry of Finance, Godrealm of Paranid, Holy Order of Pontifex, Terran Protectorate, Zyarth Patriarchy — modded factions on the roadmap)
- Every major faction has **at least 1 active admiral** in a fully-developed save
- Typically **2–3 living admirals per faction** after 1–2 hours of game time
- Xenon currently share the Admiral archetype (placeholder — proper Xenon design pending)

## Decision inputs — what the admiral "sees"

Every HeroManager tick (~5 game-minutes) the admiral evaluates:

- **Faction reputation shifts** against ally / enemy factions — a large negative swing suggests active hostilities
- **Sector threat levels** — sourced from DA-Eco signals (station-loss events, ownership flips, resource-shortage alerts)
- **Hot-gate registry** — the mod tracks recently-contested gates; admirals prioritize responding to hot gates
- **Allied faction requests** — if a friendly faction is under serious siege, admirals may commit to help
- **Home-space status** — if the admiral's home sector is threatened, they always return to defend

## Decision branches

Based on the state read, the admiral picks one:

- **Offensive push** — advance into a contested enemy border sector. Highest-priority when a rep-shift indicates open hostility and the admiral has a full fleet.
- **Home-space defence** — return and hold when home is threatened. Always overrides all other options.
- **Allied coordination** — join a friendly faction's active engagement. Requires the ally to be at active war with a mutual enemy.
- **Sector reclaim** — after losing a sector, mount a retake operation. Runs when the recently-lost sector still has a viable retake path.
- **Idle patrol** — when no urgent state, patrol home sector. Fallback state — the admiral does not sit still even when nothing is on fire.

The admiral's decision is committed as a vanilla order (`patrol` / `attack` / `protect` / `commandeer`) sent to the flagship. All in-flight behaviour then delegates to X4's own AI — the mod does not implement combat logic.

## Ship scaling per star rank

Flagship and escort composition auto-scale with the admiral's [star rank](../../mechanics/xp-and-stars/):

| Rank | Flagship | Escort |
|---|---|---|
| ★ | Behemoth-class equivalent | 4× S fighters |
| ★★ | Improved destroyer | 4× S / 1× M corvette |
| ★★★ | Fleet destroyer | 2× M / 2× S |
| ★★★★ | Top-tier destroyer | 1× L / 4× M / 4× S |

Faction-flavour applies — an Argon admiral gets Argon ships; a Teladi admiral gets Teladi ships. Specific ship macro is drawn from the faction's own catalog, so mods that add faction-specific ships integrate automatically.

## Behaviour example — a typical shift

Playing as a neutral trader, you notice a Holy Order border sector flips to Argon control on the map. Ten minutes later:

- The Argon admiral of the Korkov lineage (★★★, 2,100 XP) commits an **allied coordination** push through the border. Their fleet enters the newly-contested sector to protect the Argon station foothold.
- Simultaneously, the Holy Order admiral of the Vasquez lineage (★★★★, 15,300 XP) makes a **sector reclaim** decision. Their fleet moves to the same sector from the opposite side.

The two admirals meet in-sector, engage, and the outcome plays out. If the Argon admiral wins, the sector holds; if the Holy Order admiral wins, the sector may flip back. Either way, one of them may be [wounded or KIA'd](../../mechanics/death-cycle/) at the end.

The player did nothing but observe. The whole event was driven by faction state, HeroManager decisions, and vanilla AI orders. This is the design goal: **emergent drama from system rules**.

![Godrealm of Paranid coordinator archetype example — High Strategos Tarkanius, ★★ (2/5), 200 XP, faction-appointed strategist. Coordinators are the Paranid variant of the Admiral pattern — same decision cycle, faction-flavour name and biography. HQ station PAR Paranid Shipyard in Trinity Sanctum III, Home sector Trinity Sanctum III (legacy), 0/2 fleets deployed, flagship class L (destroyer)](/x4-modding-wiki/img/mods/galactic-heroes/admiral-coordinator.jpg)

_Note: a combat-action screenshot of a Vanguard-class admiral flagship + escort engaging an enemy fleet in a contested sector is still pending — currently the mod is being observed from menu view. The Tarkanius entry above shows the archetype's data model in a stable form._

## Recovery cycle

If the admiral's flagship is destroyed:

- **d100 roll** — see [Death cycle](../../mechanics/death-cycle/). Default: 20% KIA / 60% wounded / 20% unscathed.
- On **wounded** or **unscathed**, the admiral goes into cooldown, then rebuilds from [Recovery Points](../../mechanics/recovery-points/). XP / ★ / kill count are preserved.
- On **KIA**, the admiral is archived. The lineage template goes vacant for 120 game-minutes, then a successor may spawn — new face, new name, fresh XP. See [Lineage succession](../../mechanics/lineage-succession/).

## What's next

- **Xenon proper archetype** — currently uses Admiral templates; the mechanic works but is narratively wrong. A proper Xenon design is on the roadmap (likely modular, faction-flavoured AI without human-style bios).
- **Player-rep gating** — heroes visible at rep ≥ 0; bio at ≥ 10; live tracking at ≥ 20 — spec'd but not enforced yet.
- **Alliance behaviour polish** — allied coordination currently commits without checking whether the ally actually wants help. Future work will tighten the handshake.

## Related pages

- [Pirate Raider archetype](../pirate-raider/) — the anti-admiral: pulls from Order Board, not faction command
- [Kha'ak Hive Lord](../khaak-hive-lord/) — the Kha'ak equivalent of a defensive admiral
- [Death cycle](../../mechanics/death-cycle/) — the d100 roll that decides an admiral's fate
- [Recovery Points](../../mechanics/recovery-points/) — how the fleet rebuilds after loss

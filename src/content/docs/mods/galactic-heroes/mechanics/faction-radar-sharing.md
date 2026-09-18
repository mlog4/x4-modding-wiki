---
title: Faction Radar Sharing
description: Invulnerable ghost satellites placed at the stations of factions that trust you, so an ally's radar becomes your map — gated on reputation or a trade subscription, with a self-healing registry.
---

An ally that trusts you with its trade prices already trusts you with its sky. **Faction Radar Sharing (FRS)** makes that literal: once a faction is friendly enough, its stations start feeding your map.

The mechanic is small and it is the one part of Galactic Heroes you will notice without opening a menu — the galaxy map simply stops being dark where your friends live.

![Galactic Heroes - Settings - FRS, headed "FRS (Faction Radar Sharing) - runtime settings". Rows: Enable Faction Radar Sharing (on), Reputation threshold, Allow via Trade Subscription, Satellite radar range set to 250 km, Require radar module, New satellites start Active. A tooltip over the threshold row reads "Satellites are placed near faction stations when your reputation with that faction is at or above this UI value (same number you see in the Diplomacy panel)." Three action buttons follow: Apply now (force sync), Activate all existing, Deactivate all existing](/x4-modding-wiki/img/mods/galactic-heroes/settings-frs.jpg)

## How a station qualifies

A station gets a satellite when **both** halves hold:

1. **It has real radar.** Its `maxradarrange` must exceed 100 km — in practice, a radar module. A mining outpost with no dish shares nothing, because there is nothing there to share.
2. **The faction trusts you** — either your reputation is at or above the threshold, **or** you hold a **trade subscription** with them.

The trade-subscription route is the interesting one. It means you can *buy* the sky: a faction sitting near neutral will still light up its stations for a paying subscriber, and losing the subscription takes it away again. The mod watches the licence being granted and revoked and re-syncs on both.

| Knob | Default | Note |
|---|---|---|
| Enable Faction Radar Sharing | on | Off destroys every ghost satellite and spawns none |
| Reputation threshold | 25 | A **UI** value — the number in the Diplomacy panel |
| Allow via Trade Subscription | on | The second, purchasable route past the threshold |
| Satellite radar range | 250 km | Also 600 km and 2000 km |
| Require radar module | on | Off gives every eligible station a satellite |
| New satellites start Active | on | Off places them dormant for you to switch on |

**The threshold is the number you can see, not the number the engine keeps.** X4 stores relations as a float and maps it to the displayed integer non-linearly, so a setting expressed in raw relation would mean nothing to the person moving the slider. The whole chain is resolved back to the UI integer before comparing — the slider says 25 and the Diplomacy panel says 25 and they are the same 25.

## Ghost satellites

The objects placed are not satellites you own and manage. They are **ghosts**: invulnerable, owned by the sharing faction, spawned and destroyed by the mod's own registry.

Invulnerability is not a convenience. A satellite that could be shot would turn a passive perk into a maintenance chore and a war target, and every lost one would silently put a hole back in your map. Every fresh spawn is pinned to full hull instead.

The three buttons under the settings are the manual overrides:

- **Apply now (force sync)** — re-evaluate every faction and station immediately, instead of waiting for the next pass.
- **Activate all existing** / **Deactivate all existing** — flip every placed satellite at once, which is how you turn the map off without losing the placements.

## The doctor

A periodic pass — every **2 minutes**, always on — re-checks the whole picture: new stations that became eligible, modules that gained or lost radar, factions whose relation crossed the line, satellites that should no longer exist.

That interval is **deliberately not on the settings screen.** Most of the mod's reactivity to a changing galaxy hangs off this poll, so an accidental toggle would not degrade the feature, it would freeze it. The two values are written fresh on every load; changing them means editing the script.

It is a fair criticism that a self-healing loop hides its own bugs. The counter-argument the mod takes is that the alternative — reacting only to events — misses every change X4 does not raise an event for, and station modules change constantly.

## Where it came from

FRS began as a **standalone mod** (`mlog_frs`, v1.00) and is now bundled into Galactic Heroes unchanged, with its own settings page.

⚠ **Do not install the standalone `mlog_frs` alongside Galactic Heroes.** It is the same code and the same IDs; loading both conflicts. If you already run it, remove it before installing this mod.

## Honest list

- **It is not a scanner.** Satellites reveal what a station's radar sees. Sectors with no friendly station stay dark no matter how good your reputation is.
- **The doctor's interval is fixed at 2 minutes.** Not tunable on purpose, as above.
- **Range is a menu of three, not a slider.** 250 / 600 / 2000 km. A free-form range invites the value that tanks your frame rate.
- **An earlier build wrote the dropdown index instead of the range.** Saves from before that fix stored 1, 2 or 3; the loader now maps those back to 250, 600 and 2000 rather than leaving a satellite with a radar range of "2".
- **Reputation changes apply on the next doctor pass**, not the instant a relation ticks over — so a freshly-earned ally lights up within a couple of minutes, not immediately.

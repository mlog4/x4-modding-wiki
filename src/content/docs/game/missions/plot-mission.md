---
title: Plot missions
description: '"Plot" in X4 has TWO meanings — main-plot narrative (handled by story scripts) and claim-a-sector-plot territorial missions. Plus the standalone actor-persistence cue in plot.xml.'
---

The word **"plot"** is overloaded in X4 modding. There are **three distinct things** with "plot" in their name, and they are not the same system. This page disambiguates.

## The three "plot" concepts

| What people call "plot missions" | Actual implementation | Real page |
|---|---|---|
| **Main story arc** (Paranid plot, Buccaneers plot, etc.) | `story_*.xml` | [Story missions](/game/missions/story-mission/) |
| **Claim a sector plot** (territorial expansion missions) | `gm_claimplot.xml` (Generic template) | This page |
| **The `plot.xml` script** | Actor-persistence storage cue, NOT a mission system | This page |

## "Plot" as sector claim — gm_claimplot.xml

The gameplay concept "claim a plot of space" (= establish sector ownership) is implemented as **one generic mission template** — `md/gm_claimplot.xml` (739 lines).

```
md.GM_ClaimPlot.Start
├── Do_Not_Start_Mission (early bail)
└── Do_Start_Mission
    ├── With_Offer
    │   ├── CreateOffer
    │   ├── Offer_Management (ref md.GenericMissions.OfferMission)
    │   └── Offer_End
    └── BriefingStarted
        ├── DisplayCutscene
        ├── MissionAccepted
        │   ├── ActivateImmediately
        │   ├── ActivateOnCondition
        │   └── ActivateMission
        │       └── ClaimPlot_Ref (ref md.RML_ClaimPlot.ClaimPlot)
        └── BriefingStopped
```

It uses the standard generic-mission lifecycle from [Generic missions](/game/missions/generic-mission/) — `With_Offer` / `BriefingStarted` / `MissionAccepted` / `ActivateMission` — and delegates the **actual claim-plot work** to `rml_claimplot.xml`.

### What the mission does

1. **Offer phase**: A faction representative offers "Claim Sector X for our faction"
2. **Accept phase**: Player chooses to accept, briefing plays
3. **Activate phase**: Mission becomes active; player must satisfy claim conditions
4. **Claim phase** (`rml_claimplot.xml`): Verify ownership criteria — own stations in sector, sufficient territorial presence
5. **Complete**: Sector ownership transfers to faction (typically player's faction for player-side claims)

### Modding context — sector ownership change

This is the **only vanilla mission template** that changes sector ownership. If your mod wants to:

- Add a new sector-claim variant (e.g. "Claim sector by destroying 50% of enemy stations")
- Reuse the claim-plot infrastructure in a custom mission

reference `md.RML_ClaimPlot.ClaimPlot` from your mission. The library handles the sector ownership transfer + map repaint + faction relation cascade.

## "Plot" as actor storage — plot.xml

`md/plot.xml` is **7 lines total**:

```xml
<mdscript name="Plot">
    <cues>
        <!-- This cue is used as a storage area for persistent NPCs that are used in story missions,
             so that multiple instances of the same actor are not created when two missions that
             use the same NPC run simultaneously -->
        <cue name="Actors" />
    </cues>
</mdscript>
```

It is NOT a mission system. It is a **shared namespace** for cross-mission actor persistence.

### What modders use it for

When two story missions both reference "the Cardinal" character, they can't both `create_actor` — that produces two Cardinals walking around. Pattern:

```xml
<!-- In your story mission: -->
<do_if value="not @md.Plot.Actors.$Cardinal">
    <create_actor name="md.Plot.Actors.$Cardinal" 
        race="paranid" 
        ... />
    <add_anchored_object 
        object="md.Plot.Actors.$Cardinal" 
        reason="PLOT_ACTOR_CARDINAL"/>
</do_if>

<!-- Then use: -->
<set_value name="$MyCardinalRef" 
    exact="md.Plot.Actors.$Cardinal"/>
```

The first mission that needs Cardinal creates him; subsequent missions reuse him. The `Actors` cue is just a named bucket for these globals — `md.Plot.Actors.$Cardinal`.

### Why it's a separate file

By living in its own `plot.xml`, the storage cue activates at game start regardless of which story plays — actors can be created lazily by any story that needs them.

## "Plot" as main story arc

When players say "the plot" colloquially they mean the **main story arc** the player follows (Paranid plot, Welfare research plot, Buccaneers plot). These are implemented in `story_*.xml`, not in `plot.xml`. See [Story missions](/game/missions/story-mission/).

## Common gotchas

- ⚠ **`plot.xml` is NOT the main plot script** — it's a 7-line actor storage cue; the main plot lives in `story_*.xml`
- ⚠ **`gm_claimplot` is a Generic template, not a separate category** — it follows the [Generic missions](/game/missions/generic-mission/) lifecycle
- ⚠ **`rml_claimplot` performs the actual ownership change** — if you customize claim conditions, reference `md.RML_ClaimPlot.ClaimPlot`
- ⚠ **`md.Plot.Actors.$X` is global** — name collisions between mods are silent corruption; always prefix `$mlog_X` style

## Code references (vanilla)

| Concern | File |
|---|---|
| Claim-plot mission template | `gm_claimplot.xml` (739 lines) |
| Claim-plot reusable library | `rml_claimplot.xml` |
| Persistent actor storage | `plot.xml` (7 lines) |
| Sector ownership change | `rml_claimplot.xml` — search for `set_owner sector=` |

## Related

- [Story missions](/game/missions/story-mission/) — main-plot narrative
- [Generic missions](/game/missions/generic-mission/) — the layer `gm_claimplot` uses
- [Sector](/game/world/sector/) — sector ownership accessors
- [Faction](/game/factions/faction/) — `set_owner` action
- [Mission events](/game/missions/mission-events/) — `event_mission_aborted` etc.

---

*If your mod docs say "adds new plot missions", be specific about which "plot" — vanilla uses three different things with that name. Future-you and future-modders will thank you.*

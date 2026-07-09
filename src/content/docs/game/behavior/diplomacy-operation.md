---
title: Diplomacy operation
description: Combined coverage of diplomacyactionoperation (player initiates diplomatic actions) and diplomacyeventoperation (engine produces diplomacy events). Both extend operation.
---

A **Diplomacy operation** is one of two operation subtypes for diplomatic content: `diplomacyactionoperation` (the player initiates an action — appease, threaten, gift, etc.) or `diplomacyeventoperation` (the engine generates a diplomacy event from world state — relations change, faction milestone reached). Both extend the abstract `operation` parent shared with [Boardingoperation](/game/behavior/boarding-operation/).

**Inheritance chain:**
```
operation
├── boardingoperation
├── diplomacyactionoperation
└── diplomacyeventoperation
```

Diplomacy operations are managed by the vanilla `diplomacy.xml` framework (~4500 lines). Modders extending diplomacy work through this framework rather than the operation datatypes directly.

## diplomacyactionoperation — player-initiated

### Properties

Plus inherited from `operation`: `.starttime`, `.duration`, `.owner`.

| Property | Type | Description |
|---|---|---|
| `.agent` | entity | The agent NPC executing the action |
| `.agentresult` | agentresult | Final state of the agent at conclusion |
| `.action.id` | string | Action id (e.g. `'appease'`, `'threaten'`) |
| `.action.name` | string | Display name |
| `.action.description` | string | Long description |
| `.action.shortdescription` | string | Short description |
| `.action.duration` | time | Base duration |
| `.action.gift` | ware | Gift ware (for `appease`-type actions) |
| `.action.agent.experience` | int | Required agent experience |
| `.action.$<param>` | various | Action-specific parameters |

## diplomacyeventoperation — engine-driven

### Properties

Plus inherited from `operation`.

| Property | Type | Description |
|---|---|---|
| `.faction` | faction | First involved faction |
| `.otherfaction` | faction | Second involved faction |
| `.source` | diplomacyactionoperation | Source action that triggered this event (may be null) |
| `.agent` | entity | Agent assigned to this event |
| `.agentresult` | agentresult | Agent state at conclusion |
| `.event.id` | string | Event id |
| `.event.source` | string | Source action id (or null) |
| `.event.name` | string | Display name |
| `.event.description` | string | Long description |
| `.event.shortdescription` | string | Short description |
| `.event.conclusiontext` | string | Conclusion text |
| `.event.duration` | time | Base duration |
| `.option` | diplomacyeventoperationoption | Currently selected option |
| `.outcome` | diplomacyeventoperationoption | Final outcome option |

### diplomacyeventoperationoption (pseudo-type)

| Property | Type | Description |
|---|---|---|
| `.exists` | bool | Option exists |
| `.id` | string | Option id |
| `.resulttext` | string | Text shown when this option is selected |
| `.conclusiontext` | string | Conclusion text |
| `.weight` | int | Base weight for selection as outcome |
| `.relation` | float | Resulting relation if chosen |
| `.agent.risk` | agentrisk | Risk to assigned agent |
| `.cost.influence` | int | Influence cost |
| `.cost.money` | money | Money cost |
| `.cost.wares` | wareamountlist | Wares to remove |

## Common patterns

### "Detect a diplomacy action completing"

Diplomacy operations don't have a dedicated event family; observe via the parent operation pattern (see `diplomacy.xml` for the framework). The conclusion typically signals back to the originating cue.

### "Read an agent's current diplomacy work"

```xml
<do_if value="@$Agent.diplomacy.ship">
    <!-- agent has an assigned ship for diplomacy missions -->
</do_if>
```

The `diplomacy.ship` is on [Ship](/game/objects/ship/) and [Entity](/game/characters/npc/) — the diplomacy framework uses this for agent assignment.

## Common gotchas

- ⚠ **Two distinct datatypes for "diplomacy".** `diplomacyactionoperation` (player-initiated) vs `diplomacyeventoperation` (engine-generated). Don't conflate.
- ⚠ **Vanilla `diplomacy.xml` is the canonical framework.** ~4500 lines of MD covering the full UI flow. Modders extending diplomacy should work through this rather than reimplementing.
- ⚠ **`.option` is what's currently selected; `.outcome` is what was finally applied.** They can differ if the agent / event resolver modifies the choice.
- ⚠ **Costs are deducted at conclusion, not selection.** `.cost.money` only leaves the player's wallet when the event concludes. Mods that need to gate based on cost must check at conclusion event.
- ⚠ **Agent risk is per-option.** Different choices have different `.agent.risk` levels — high risk may kill the agent. Vanilla UX surfaces this.
- ⚠ **DLC-gated content.** Some diplomacy actions / events require specific DLCs (Tides of Avarice influence system). Check macro availability.

## Architectural context

- **Diplomacy framework:** Architectural overview *Diplomacy system* — `diplomacy.xml` end-to-end pipeline (action selection → agent execution → event generation → outcome resolution).
- **Agent lifecycle:** Architectural overview *Diplomacy agents* — recruitment, experience, risk, death.
- **Influence economy:** Architectural overview *Influence* — Tides of Avarice resource that gates high-end diplomacy actions.

## Related

- [Boardingoperation](/game/behavior/boarding-operation/) — sibling operation subtype.
- [Faction](/game/factions/faction/) — `.representative` / `.diplomat` NPCs participate.
- [NPC](/game/characters/npc/) — `.agent` field.
- [Ware](/game/economy/ware/) — gift wares.

---

:::tip[Pattern — paired operation subtypes for cause/effect]
Diplomacy operations are unique: the API exposes both the *cause* (action) and the *effect* (event) as separate operation subtypes. Modders extending diplomacy work with both — track action initiation, then watch for the resulting event chain.
:::

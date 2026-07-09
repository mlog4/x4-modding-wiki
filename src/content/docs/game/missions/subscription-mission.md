---
title: Subscription missions
description: Pirate-DLC faction subscriptions. Repeating loyalty missions (War, Trade, Pirate, Mentor) tied to a faction contact NPC. The most complex MD mission code in vanilla.
---

A **Subscription mission** is a special category introduced by the Pirate DLC (x4ep1). The player **subscribes** to a faction's mission feed via a contact NPC; the script then repeatedly offers missions in a theme (war, trade, piracy, mentoring) until unsubscribed.

This is the **most complex MD mission code** in vanilla — `x4ep1_war_subscriptions.xml` alone is **17,050 lines**.

## Vanilla subscription scripts

| File | Subscription type | Theme |
|---|---|---|
| `x4ep1_war_subscriptions.xml` | War | "Help faction X fight faction Y" |
| `x4ep1_trade_subscriptions.xml` | Trade | "Deliver supplies / clear pirates from trade lanes" |
| `x4ep1_pirates_subscriptions.xml` | Pirate | "Raid faction X" |
| `x4ep1_mentor_subscription.xml` | Mentor | "Personal-progression coaching" |

All four require the Pirate DLC. Guard your mod accordingly.

## Joining a subscription

Two-step:

1. Player finds a **subscription contact NPC** (`gm_joinsubscription.xml` offers the find-the-contact mission)
2. Player talks to the contact → `event_npc_talked` fires → `Player_Subscribed_To_<Type>` cue activates

The subscription state lives in `md.X4Ep1_*_Subscriptions.$subscribed.{faction}` (per-faction tracking).

## Anatomy of war subscriptions

The war script structures itself as **N independent war flows**, one per faction pair:

```
md.X4Ep1_War_Subscriptions
├── Setup (defines wars, anchors contacts)
├── ARG_VS_XENON
│   ├── Init / Reset
│   ├── Subscribe / Unsubscribe handlers
│   ├── Cooldown timer (controls how often missions offer)
│   ├── Create_Contact (spawns the war contact NPC)
│   ├── Place_Contact (positions in dynamic interior)
│   ├── Generate_Mission (rolls dice on mission type)
│   └── Cleanup (faction-deactivated, war ended)
├── ARG_VS_KHAAK
├── TEL_VS_XENON
├── PAR_VS_XENON
├── SPLIT_VS_KHAAK
... (one block per war)
```

Each war flow is a **state machine** running in parallel with the others. The pattern is:

```xml
<cue name="ARG_VS_XENON_Check_Cooldown" 
      instantiate="true" 
      checkinterval="5s">
    <conditions>
        <check_value value="md.X4Ep1_War_Subscriptions.$ARG_VS_XENON_Active"/>
        <check_age min="$cooldown_seconds"/>
    </conditions>
    <actions>
        <signal_cue cue="ARG_VS_XENON_Generate_Mission"/>
    </actions>
</cue>
```

## Subscription tiers

Most subscriptions advance through tiers (typically 5 levels). Higher tier:

- Larger reward
- Higher difficulty
- Access to special items/equipment
- Unlocks rare mission variants

Tier is tracked per-faction-per-subscription:

```
md.X4Ep1_War_Subscriptions.$tier.{faction.argon} = 3
```

Tier progression is driven by **mission count + success rate**. Reset on unsubscribe.

## Pattern: contact-NPC lifecycle

Each subscription needs a **contact NPC** anchored in the world. Vanilla pattern:

```xml
<cue name="ARG_VS_XENON_Create_Contact">
    <actions>
        <create_actor name="$Contact" race="argon" ... />
        <add_anchored_object object="$Contact" reason="WAR_SUB_ARG_XENON"/>
        <set_value name="$Contact_Location" exact="..."/>
    </actions>
</cue>

<cue name="ARG_VS_XENON_Place_Contact" namespace="this">
    <actions>
        <!-- Spawn into a dynamic interior or place on a station -->
        <run_actions ref="md.NPC_Placement_Manager.PlaceNPC">
            <param name="actor" value="$Contact"/>
            <param name="object" value="$Station"/>
            <param name="slottags" value="[tag.contact, tag.subscription]"/>
        </run_actions>
    </actions>
</cue>

<cue name="ARG_VS_XENON_Contact_Killed">
    <conditions>
        <event_object_destroyed object="$Contact"/>
    </conditions>
    <actions>
        <!-- Cleanup subscription, optionally respawn -->
    </actions>
</cue>
```

The contact-NPC pattern is the **most reusable pattern** in subscription scripts — your own faction-mission mod will need it.

## Mission generation

When cooldown elapses + subscription active + faction states still valid → generate mission:

```xml
<cue name="ARG_VS_XENON_Generate_Mission">
    <actions>
        <!-- Roll which mission type -->
        <set_value name="$roll" exact="random.range@{1, 100}"/>
        <do_if value="$roll lt 30">
            <signal_cue cue="md.GenericMissions.OfferMission"
                cue_params="..."/>
            <!-- gm_assassinate variant -->
        </do_if>
        <do_else>
            <signal_cue cue="..."/>
            <!-- gm_destroy_objects variant -->
        </do_else>
    </actions>
</cue>
```

Subscriptions **piggyback on gm_*** for actual mission content — they orchestrate, but the templates do the heavy lifting. This is why all `gm_*` patterns apply.

## Threat report system

War subscriptions include a **threat report** mechanism — automatic faction-state updates the player receives between missions:

```xml
<cue name="GenerateThreatReports" instantiate="true" namespace="this">
    <conditions>
        <event_cue_signalled cue="md.X4Ep1_War_Subscriptions.Subscribed"/>
    </conditions>
    <actions>
        <!-- Build a notification: "ARG forces have advanced into..." -->
    </actions>
</cue>
```

The report system is separate from missions — it's the "between-mission newsfeed" the contact NPC delivers.

## Unsubscription

Three paths:

1. **Player-initiated** — dialog option at the contact
2. **Faction-deactivated** — the warring faction is destroyed/unhostile
3. **Cooldown breach** — player ignores subscription too long

Each path runs cleanup: remove contact, abort in-flight missions, reset tier.

## Common gotchas

- ⚠ **Subscription scripts assume contact NPC exists** — Place_Contact and Contact_Killed must always run; a stuck-spawn breaks subscription forever
- ⚠ **`event_npc_talked` to subscribe needs the EXACT contact actor** — not the faction, the specific instance
- ⚠ **State globals are SHARED across save/load** — version `<patch>` blocks recover stuck flags (see `Patch_Userdata_Player_Subscribed_To_War_V2`)
- ⚠ **DLC guard at script load** — entire subscription file fails to load if Pirate DLC absent
- ⚠ **War subscription wars must be DEFINED in DefineNonSubscriptionWars** — un-defined war flows skip mission generation
- ⚠ **Cooldown is per-war not per-subscription** — if you mod multiple wars, each needs own cooldown
- ⚠ **`add_anchored_object` leaks contact NPC** on save-with-subscription-active if not paired with `remove_anchored_object` on unsubscribe

## Code references (vanilla)

| Concern | Where to read |
|---|---|
| Contact NPC pattern | `x4ep1_war_subscriptions.xml` `ARG_VS_XENON_Create_Contact`/`Place_Contact` |
| Cooldown timer pattern | `Check_Cooldown` cues (`checkinterval="5s"`) |
| Save patch pattern | `Patch_Userdata_Player_Subscribed_To_War_V2` |
| Threat report system | `GenerateThreatReports` cue chain |
| Multi-war orchestration | The 10+ `*_VS_*` blocks in war_subscriptions |
| Mentor (single-flow simpler) | `x4ep1_mentor_subscription.xml` (3K lines) |
| Trade subscription as starter | `x4ep1_trade_subscriptions.xml` |

## Adding your own subscription

Start small:

1. Pick `x4ep1_mentor_subscription.xml` (simplest, single-flow)
2. Diff in your subscription type
3. Define one war/theme pair (don't try N parallel flows on first attempt)
4. Reuse `md.GenericMissions.OfferMission` for the actual missions
5. Use [NPC Placement Manager](/game/characters/npc/) for the contact NPC
6. Test the save-resume cycle — subscription scripts are heavily save-sensitive

## Related

- [Generic missions](/game/missions/generic-mission/) — what subscription scripts offer underneath
- [Story missions](/game/missions/story-mission/) — hand-authored alternative
- [Mission events](/game/missions/mission-events/) — events used by subscriptions
- [Architectural overview: Mission framework](/overviews/mission-framework/) — three-tier composition
- [Wiki: DLC handling](/wiki/dlc-handling/) — DLC guards required
- [Wiki: Save compatibility](/wiki/save-compatibility/) — patch blocks for subscription state

---

*Subscription scripts are the **deepest end of MD mission programming**. If your mod needs faction-loyalty repeating offers, copy the smallest vanilla example and adapt — don't write from scratch.*

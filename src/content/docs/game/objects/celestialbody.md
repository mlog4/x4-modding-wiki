---
title: Celestial body
description: Planet, sun, or other backdrop object. Engine-defined class for the visual celestial sphere of sectors; rarely scripted directly.
---

A **Celestial body** is a planet, sun, or other large background object visible in a sector. They are part of the sector's visual backdrop — players see them in the skybox but typically cannot interact with them in flight. Modders rarely script them; the class exists for filtering / camera framing.

**No dedicated datatype.** `class.celestialbody` exists in the class enum but `scriptproperties.xml` has no `celestialbody` datatype. Same shape as [Asteroid](/game/objects/asteroid/), [Bomb](/game/objects/bomb/), [Checkpoint](/game/objects/checkpoint/).

**Vanilla usage is minimal.** Celestial bodies are positioned at game start by `mapdefaults.xml` and don't move at runtime. Modders touch them only when building custom sector backdrops.

## Properties

There are no celestialbody-specific properties. Use inherited from `component`:

| Property | Source | Description |
|---|---|---|
| `.macro` | component | Backdrop macro |
| `.knownname` | component | Display name (planet name) |

### Related — Cluster terraforming

[Cluster](/game/world/cluster/) exposes terraforming-related accessors for the *terraformable planet* tied to a cluster:

| Cluster accessor | Description |
|---|---|
| `.terraforming.partname` | Template part name of the terraformable planet |
| `.terraforming.planetposition.{component}` | Position of the planet (relative to a component) |
| `.terraforming.activeproject.exists` | A terraforming project is active |

These are the practical hooks for celestial-body content — most "interact with the planet" code goes through cluster accessors.

## Common patterns

### "Find celestial bodies in a sector"

Rarely useful, but possible:

```xml
<find_object
    name="$Bodies"
    space="$Sector"
    class="class.celestialbody"
    multiple="true"/>
```

Returns backdrop objects. Most have no script-meaningful properties beyond `.knownname` and `.macro`.

### "Access the terraformable planet via cluster"

```xml
<do_if value="$Cluster.terraforming.partname != ''">
    <write_to_logbook
        text="'Cluster has terraformable planet: '
            + $Cluster.terraforming.partname"/>
</do_if>
```

This is the preferred path for terraforming content — see [Cluster](/game/world/cluster/).

## Events

Standard component events. No `event_celestialbody_X` family.

## Common gotchas

- ⚠ **No `celestialbody` datatype.** Class label only.
- ⚠ **No runtime interaction.** Players see celestial bodies but can't fly to them as physical destinations. They are not in the gate / highway / zone graph.
- ⚠ **Terraforming uses cluster accessors, NOT celestial body queries.** The terraformable planet's data lives on the [Cluster](/game/world/cluster/) via `.terraforming.X` accessors. The celestial body object itself isn't a useful entry point.
- ⚠ **Most celestialbody macros are DLC content.** Custom sectors typically come with DLC; modders adding new sectors need to define backdrop macros.

## Architectural context

- **Galaxy map backdrops:** Architectural overview *Sector visual composition* — how `mapdefaults.xml` positions celestial bodies.
- **Terraforming mission:** Architectural overview *Terraforming* — Tides of Avarice / DLC content using `Cluster.terraforming.X` accessors.

## Related

- [Cluster](/game/world/cluster/) — terraforming accessors live here.
- [Sector](/game/world/sector/) — visual host.
- [Region](/game/world/region/) — environmental layer (separate from backdrop).

---

:::tip[Pattern — visual-only class label]
Celestial body is the canonical *visual-only class* — exists in the world but has no scripting surface beyond name and macro. Modders rarely touch it; terraforming and planet content goes through cluster.
:::

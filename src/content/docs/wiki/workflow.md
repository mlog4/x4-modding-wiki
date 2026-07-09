---
title: Modder workflow
description: Deploy paths, debug.log reading, build versioning, save-test cycle. The practical day-to-day of X4 modding.
---

Day-to-day X4 modding has a routine: write changes → deploy to the right path → reload save → check debug.log → iterate. This page covers the practical workflow.

## Deploy paths

X4 looks for mod content in **extensions/** under the game install root, NOT in the user-data location:

| Platform | Deploy target |
|---|---|
| **Steam** | `<Steam>/steamapps/common/X4 Foundations/extensions/<mod_id>/` |
| **GOG** | `<GOG>/X4 Foundations/extensions/<mod_id>/` |

**Critical:** the `OneDrive\Egosoft\X4` folder (Windows) is for **logs, saves, screenshots** — NOT mod deployment. Deploying mods there does nothing. Verify your deploy script targets the Steam install path.

### Workshop mods

Steam Workshop mods land in `Steam/steamapps/workshop/content/392160/<workshop_id>/`. For development, deploy to your own `extensions/<mod_id>/` folder; for distribution, upload to Workshop.

### Workshop folder naming

Workshop mods use `ws_<workshop_id>` in their content.xml. The folder name is decorative; the `ws_` id is what dependency references must use.

## Full deploy/sync recipe

Don't selectively copy files — copy the entire deployable tree:

```bash
# from your mod's deploy/ directory
cp -r deploy/* "$STEAM_PATH/X4 Foundations/extensions/$MOD_ID/"
```

Selective copying ("just MD changed, only copy that file") leads to **Lua-vs-MD version skew** — you change MD but deploy script doesn't trigger Lua reload. Always sync the full tree.

## Mod folder structure

Convention for `your_mod/` source layout:

```
your_mod/
├── concepts/      ← design docs, mental models
├── plans/         ← roadmap, future-feature notes
├── research/      ← analysis of vanilla / other mods
├── builds/        ← versioned releases
├── deploy/        ← deployable tree (cp -r to extensions/)
│   ├── md/
│   ├── aiscripts/
│   ├── libraries/
│   ├── content.xml
│   └── ...
└── TESTING_BUILD.md   ← current build's test plan
```

`deploy/` is what gets copied to `extensions/<mod_id>/`. The rest stays in your workspace.

## Build versioning

Increment a build number on every code change. Typical pattern:

```xml
<set_value name="$build_number" exact="739"/>

<debug_text text="'mlog_heroes build ' + $build_number
    + ' / mlog' + ($build_number + 24) + ' init complete'"/>
```

Bump `$build_number` per change; the formula `+ 24` (or whatever offset you choose) gives a continuous log marker. Search for `mlog' + (...)` in debug.log to find your mod's events.

### TESTING_BUILD.md

Maintain a short test plan per build (1-3 features max):

```markdown
# Build 739 — Court of Curbs faction

## Test cycle
- [ ] Save load (verify init message appears)
- [ ] Court of Curbs appears in faction list
- [ ] Faction relations correct (-30 with Argon, +5 with Teladi)
- [ ] No new errors in debug.log

## Cross-test
- [ ] Existing mlog_heroes features still work
```

Regression tests live in a separate `TESTING_FULL.md`. The build-specific file is short and current.

## Reading debug.log

X4 writes to `<UserData>/X4 Foundations/debug.log` (NOT the Steam path). On Windows with OneDrive sync, this is typically `OneDrive/Documents/Egosoft/X4/<player_id>/debug.log`.

### Finding your mod's lines

```bash
grep "mlog_heroes" debug.log | tail -50
```

Or for specific build markers:

```bash
grep "build 739" debug.log
```

### Common error patterns

| Error pattern | Likely cause |
|---|---|
| `Property lookup failed: ...` | Variable null at access time — check `@$X` null-safety |
| `Script node 'return' is not allowed in this context` | `<return>` outside a library |
| `Operator expected` near apostrophes | String literal with `''` doubled escape |
| `']' expected` in long table[] | Likely apostrophe / nested string issue |
| LIBXML2 / "entity reference must end" | `<` or `&` in attribute string — use `&lt;` / `&amp;` |
| `no corresponding listeners` | Non-instantiated cue fired but already complete — add `reset_cue` |
| `Button in unselectable row` | SMA `Make_Button` in a row with `$selectable=false` |
| `invalid fontstring` spam | `menu.infoFrame` not nil-ed in cleanup |

## Save-test cycle

The typical iteration:

```
   1. Make MD/aiscript/Lua change
            ↓
   2. cp -r deploy/* <extensions path>
            ↓
   3. Launch X4 → load test save
            ↓
   4. Check debug.log for build marker
   5. Test the feature
            ↓
   6. If fail: read debug.log, edit, repeat
```

### Speed tips

- **Keep a small test save** dedicated to your mod — faster load.
- **Quicksave + quickload after change** — preserves test setup.
- **Use `<debug_text>` liberally during dev**, gate by `$verbose` flag, remove for release.

## Log gating with verbose flag

Don't pollute debug.log in release builds. Wrap debug output in a gate:

```xml
<do_if value="$verbose_logging">
    <debug_text text="'detailed state: ' + ..."/>
</do_if>
```

Set `$verbose_logging` at mod init from a configurable option. For dev: `true`. For release: `false`. Players appreciate clean logs.

## Avoid the "save runs once" trap

Some MD setup runs only on game-start (GameStart event), NOT on save-load. If your mod sets up state on game start (e.g. registers factions), that state is NOT re-initialised when the player loads the save — vanilla saves the state.

For state you need to re-apply on every save load:
- Set up via a `heartbeat` cue that re-initialises on save load detection
- Use `event_cue_completed cue="md.GameStart"` for "set up THIS state once"
- Use `event_cue_signalled cue="md.Setup.Init"` for periodic re-setup

See [Galaxy seeding](/overviews/galaxy-seeding/) for the architectural context.

## Local git remote

If you keep your mod under git (recommended):

```bash
# bare repository on your local disk as 'origin'
git init --bare ~/my_mod_remote
cd your_mod
git remote add origin ~/my_mod_remote
git push origin master
```

This gives you a checkpointable history without exposing the mod to public repositories until ready.

## Related

- [Galaxy seeding](/overviews/galaxy-seeding/) — explains the "setup runs once" semantics
- [Save migration](/overviews/save-migration/) — versioning discipline
- [Bridge + Worker](/wiki/bridge-worker/) — race-avoidance pattern
- [SN APIs](/lang/ui-lua/sn-apis/) — for UI mods

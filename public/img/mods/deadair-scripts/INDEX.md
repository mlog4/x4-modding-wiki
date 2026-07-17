# DA-Scripts Screenshot Index

Master reference for every screenshot used on `mods/deadair-scripts-fork.md`. Update this when adding, replacing, or removing images.

**Storage convention:**
- Public path: `/x4-modding-wiki/img/mods/deadair-scripts/<slug>.jpg`
- Filesystem: `public/img/mods/deadair-scripts/<slug>.jpg`
- Naming: kebab-case semantic slug matching the doc-page context (`menu-root`, `menu-presets`, `report-tradestations`, etc.).
- Source screenshots are Steam captures 3818x2032 (4K). Currently stored as-is; **cropping to menu region + optional web-optimization pass is a follow-up cleanup task**.

**How to add a new screenshot:**
1. User drops raw Steam capture in `C:\img3\`.
2. Copy + rename to `public/img/mods/deadair-scripts/<slug>.jpg`.
3. Add a row to the table below.
4. Reference in the doc via `![alt](/x4-modding-wiki/img/mods/deadair-scripts/<slug>.jpg)`.

---

## Live screenshots

| Slug | Original file | What it shows | Doc section |
|------|--------------|---------------|-------------|
| `menu-root.jpg` | `20260717103654_1.jpg` | DA Mod Main Menu top-level list — 13 items | Overview → In-game menu tour |
| `menu-presets.jpg` | `20260717103724_1.jpg` | Mlog: Configuration Presets submenu — 3 built-in presets with Apply buttons | configuration/presets |
| `menu-dynamic-war.jpg` | `20260717141123_1.jpg` | DA Dynamic War main menu — 20 options + 6 sub-menu list | configuration/dynamic-war (index) |
| `menu-dynamic-news.jpg` | `20260717151229_1.jpg` | DA Dynamic News main menu — 7 options + embedded Recent News feed (12+ live events visible) | configuration/dynamic-news |
| `menu-evolution.jpg` | `20260717151345_1.jpg` | DA Evolution main menu — 11 Options fields (incl. live Current/Active displays + Small/Medium/Large Fleet Size selector) + 5 Xenon Growth Rates sliders | configuration/evolution |
| `menu-fill.jpg` | `20260717154624_1.jpg` | DA Fill main menu — 15 options (4x TS %, 2x SY %, ship mods, credit limit, xenon protection) + 2 sub-menu links | configuration/fill |
| `fill-faction-menu.jpg` | `20260717154633_1.jpg` | Fill Faction Menu — 22 factions × 2 toggle columns (Trading Station + Ship Building Station) | configuration/fill/faction-menu |
| `fill-statistics-1.jpg` | `20260717154717_1.jpg` | Fill Statistics Menu — top half (Faction Account balances + start of Wares Added/Removed) | configuration/fill/statistics |
| `fill-statistics-2.jpg` | `20260717154724_1.jpg` | Fill Statistics Menu — bottom half (rest of Wares Added/Removed + Ships Modified table) | configuration/fill/statistics |
| `menu-jobs.jpg` | `20260717155834_1.jpg` | DA Jobs main menu — 6 options (Enable Expeditions/SST/Remove Exclusivity + 3 debug flags) + 2 sub-menu links | configuration/jobs (index) |
| `jobs-quotas.jpg` | `20260717155843_1.jpg` | Jobs Quotas — Antigone Republic panel with all 10 quota rows (4 Patrol + L/M Trader + L/M Mineral + L/M Gas Miner) + start of Argon Federation panel | configuration/jobs/quotas |
| `jobs-vanilla-spawned.jpg` | `20260717155906_1.jpg` | Vanilla Spawned Jobs Menu — 15 visible rows of the 22-entry whitelist (Hatikvah/Scale Plate/Buccaneers/Kha'ak) | configuration/jobs/vanilla-spawned |
| `menu-gate.jpg` | `20260717161756_1.jpg` | DA Gate main menu — 3 options + 8 Jump Gate connection rows (all Inactive) | configuration/gate |
| `menu-god.jpg` | `20260717162642_1.jpg` | DA God main menu — 9 options + Shortcut section + God Quotas sub-menu link | configuration/god (index) |
| `god-quotas.jpg` | `20260717162645_1.jpg` | God Quotas — Antigone Republic panel with all 33 wares listed (2-33 modules each) + start of Argon Federation panel | configuration/god/quotas |
| `menu-blueprint.jpg` | `20260717164035_1.jpg` | DA Blueprint Analysis main menu — 2 options + Scan Settings 34-class table + Progress Menus link | configuration/blueprint-analysis (index) |
| `bp-progress-menus.jpg` | `20260717164100_1.jpg` | Progress Menus root — 4 sub-menu links (Station Modules / Ships / Equipment / Misc) | configuration/blueprint-analysis/progress-menus (index) |
| `bp-station-modules.jpg` | `20260717164048_1.jpg` | BP Progress → Station Modules — Pier + Dock Area + start of Production Modules sections (with 4 completed rows) | configuration/blueprint-analysis/progress-menus/station-modules |
| `bp-ships.jpg` | `20260717164051_1.jpg` | BP Progress → Ships — XS Ships + start of S Ships (all 0/N — no ship blueprints completed yet) | configuration/blueprint-analysis/progress-menus/ships |
| `bp-equipment.jpg` | `20260717164055_1.jpg` | BP Progress → Equipment — Missile Turrets + start of Non-Missile Turrets sections | configuration/blueprint-analysis/progress-menus/equipment |
| `bp-misc.jpg` | `20260717164211_1.jpg` | BP Progress → Misc — 9 entries with Venture Platform + Wide Area Sensor Array completed | configuration/blueprint-analysis/progress-menus/misc |
| `dw-increase-relations.jpg` | `20260717141204_1.jpg` | Increase Relations — Buy +5 Relation via Diplomatic Favors | configuration/dynamic-war/increase-relations |
| `dw-decrease-relations.jpg` | `20260717141210_1.jpg` | Decrease Relations — Buy -5 Relation via Diplomatic Favors | configuration/dynamic-war/decrease-relations |
| `dw-unlock-relations.jpg` | `20260717141216_1.jpg` | Unlock Relations — Locked/Unlocked per faction | configuration/dynamic-war/unlock-relations |
| `dw-ignored-factions.jpg` | `20260717141223_1.jpg` | DW Ignored Factions — Allowed/Ignored per faction (with informational rows) | configuration/dynamic-war/ignored-factions |
| `dw-sector-faction-logic.jpg` | `20260717141314_1.jpg` | Sector Faction Logic Menu — per-sector Enabled/Disabled with cluster warning tooltip | configuration/dynamic-war/sector-faction-logic |
| `dw-war-history.jpg` | `20260717141321_1.jpg` | War History — statistics per faction pair (Fatigue, Score, ships/stations killed by class) | configuration/dynamic-war/war-history |

All screenshots are Steam 4K captures (3818x2032), uncropped. Web-optimization pass is a follow-up task.

---

## Pending screenshot needs

Reference list — user shoots as they play through each menu. Slug ready in doc; file arrives later.

**Root submenus (need to see each one opened):**

| Slug (planned) | Shows | Where in doc |
|---|---|---|
| `menu-dynamic-war.jpg` | DA Dynamic War submenu — all sliders + toggles | [Dynamic War](#dynamic-war) |
| `menu-dynamic-news.jpg` | DA Dynamic News submenu | [Dynamic News](#dynamic-news) |
| `menu-evolution.jpg` | DA Evolution submenu — main toggles + level cap | [Xenon Evolution](#xenon-evolution) |
| `menu-evolution-rates.jpg` | DA Evolution → Job Rate sliders | [Xenon Evolution — rates](#job-rate-multipliers) |
| `menu-fill.jpg` | DA Fill submenu | [Station Fill](#station-fill-da-fill) |
| `menu-trade-optimizer.jpg` | Mlog Trade Optimizer submenu | [Trade Optimizer](#trade-optimizer) |
| `menu-extension.jpg` | Mlog: Extension submenu — all Ext_* sliders | [Extension](#extension) |
| `menu-cheat.jpg` | Mlog: Cheat submenu — Observer Satellite button + any other cheat toggles | [Cheat Menu](#cheat-menu) |
| `menu-info-root.jpg` | DA Information Menus — root list of reports | [Reports and info menus](#reports-and-info-menus) |

**Info reports (opened from DA Information Menus):**

| Slug (planned) | Shows | Where in doc |
|---|---|---|
| `report-tradestations.jpg` | Trade Stations Report — multiple factions visible with 8-col layout | [Trade Stations Report](#trade-stations-report) |
| `report-extension.jpg` | Extension progress report — observed clusters + Built lists | [Extension progress reports](#extension-progress-reports) |
| `report-evolution.jpg` | Xenon Evolution status report | [Xenon Evolution status](#xenon-evolution-status) |
| `report-war-stats.jpg` | Dynamic War stats report | [Dynamic War stats](#dynamic-war-stats) |
| `report-bp-progress.jpg` | Blueprint scan progress | [Blueprint scan status](#blueprint-scan-status) |

**Miscellaneous in-game visuals:**

| Slug (planned) | Shows | Where in doc |
|---|---|---|
| `mainmenu-icon.jpg` | Main game menu with DA icon visible in the top-bar (highlight where the mod integrates with the Options row) | [Installation](#first-time-setup) |
| `news-logbook-entry.jpg` | In-game logbook entry from Dynamic News | [Dynamic News](#dynamic-news) |
| `bp-scan-notification.jpg` | Blueprint-fragment-collected notification popup | [Blueprint Scanning](#blueprint-scanning-da-blueprint-analysis) |

---

## Nested question marks

Items I documented but haven't seen a top-level menu entry for. Might be nested under DA Information Menus or somewhere else — need to verify:

- **UI settings** (`UI_*` fields) — where does the sub-menu live? Nested under Information? Or missing UI?

**Resolved 2026-07-17 (DA Jobs screenshots):**
- ~~Station Traders (ST)~~ — confirmed **MD-only, no UI**. Documented as "Related subsystems" inside `configuration/jobs/index.md`.
- ~~Prod Station Traders (PST)~~ — confirmed **MD-only, no UI**. Same treatment.
- DA Jobs sub-menus are only Jobs Quotas + Vanilla Spawned Jobs Menu (2, not 4-5 as I guessed).

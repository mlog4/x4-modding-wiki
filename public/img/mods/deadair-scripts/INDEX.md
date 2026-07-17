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

| Slug | Original file | What it shows | Doc section | Notes |
|------|--------------|---------------|-------------|-------|
| `menu-root.jpg` | `20260717103654_1.jpg` | DA Mod Main Menu top-level list — 13 items (Configuration Presets, Dynamic War, Dynamic News, Evolution, Fill, Jobs, Gate, God, Blueprint Analysis, Trade Optimizer, Extension, Cheat, Information Menus) | [In-game menu tour](../../../src/content/docs/mods/deadair-scripts-fork.md#in-game-menu-tour) | Uncropped; menu takes upper-right third. Could crop to that region for web. |
| `menu-presets.jpg` | `20260717103724_1.jpg` | Configuration Presets submenu — "Currently applied: (none)" + 3 Built-in presets rows (All disabled, Debug verbose logging, Default recommended) each with Apply button + explanation footer | [Presets system](../../../src/content/docs/mods/deadair-scripts-fork.md#presets-system) | Uncropped; same layout as menu-root. |

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
| `menu-jobs.jpg` | DA Jobs — root submenu list (should reveal expedition/SST/quotas/ST/PST layout) | [Jobs](#da-jobs) — |
| `menu-jobs-quotas-root.jpg` | DA Jobs → Quotas — list of factions | [Jobs SST](#jobs-sst-situational-sector-threat) |
| `menu-jobs-quotas-argon.jpg` | DA Jobs → Quotas → Argon — full quota-slider list | [Jobs SST — per-faction quotas](#per-faction-quotas) |
| `menu-jobs-quotas-apus.jpg` | DA Jobs → Quotas → Apus (if compat mod installed) | [Jobs SST — per-faction quotas](#per-faction-quotas) |
| `menu-gate.jpg` | DA Gate submenu | [Gates (DA Gate)](#gates-da-gate) |
| `menu-god.jpg` | DA God submenu — all station-creation sliders | [God (Station Creation)](#god-station-creation) |
| `menu-blueprint.jpg` | DA Blueprint Analysis submenu | [Blueprint Scanning (DA Blueprint Analysis)](#blueprint-scanning-da-blueprint-analysis) |
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

Items I documented but haven't seen a top-level menu entry for. Might be nested under DA Jobs or Information Menus — need to verify:

- **UI settings** (`UI_*` fields) — where does the sub-menu live? Nested under Information? Or missing UI?
- **Station Traders (ST)** — separate submenu? Nested under DA Jobs?
- **Prod Station Traders (PST)** — same question.

Once we open DA Jobs and DA Information Menus in-game and confirm, update this file + fix the doc's cross-references.

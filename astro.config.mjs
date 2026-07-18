import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Explicit sidebar tree for DeadAir Scripts (mlog4 fork).
// Ordered to match the in-game DA Menu top-to-bottom.
// Every top-level DA Menu item becomes an item or a nested group here.
// Overview pages sit at the top of their group so the mental model matches
// the in-game "click a submenu, see its options + sub-menus" pattern.
const daScriptsForkSidebar = {
  label: 'DeadAir Scripts (mlog4 fork)',
  collapsed: true,
  items: [
    { slug: 'mods/deadair-scripts-fork', label: 'Overview' },
    {
      label: 'Configuration reference',
      collapsed: true,
      items: [
        { slug: 'mods/deadair-scripts-fork/configuration', label: 'Overview' },
        { slug: 'mods/deadair-scripts-fork/configuration/presets' },
        {
          label: 'DA Dynamic War',
          collapsed: true,
          items: [
            { slug: 'mods/deadair-scripts-fork/configuration/dynamic-war', label: 'Overview' },
            { slug: 'mods/deadair-scripts-fork/configuration/dynamic-war/increase-relations' },
            { slug: 'mods/deadair-scripts-fork/configuration/dynamic-war/decrease-relations' },
            { slug: 'mods/deadair-scripts-fork/configuration/dynamic-war/unlock-relations' },
            { slug: 'mods/deadair-scripts-fork/configuration/dynamic-war/ignored-factions' },
            { slug: 'mods/deadair-scripts-fork/configuration/dynamic-war/sector-faction-logic' },
            { slug: 'mods/deadair-scripts-fork/configuration/dynamic-war/war-history' },
          ],
        },
        { slug: 'mods/deadair-scripts-fork/configuration/dynamic-news' },
        {
          label: 'DA Evolution',
          collapsed: true,
          items: [
            { slug: 'mods/deadair-scripts-fork/configuration/evolution', label: 'Overview' },
            { slug: 'mods/deadair-scripts-fork/configuration/evolution/xenon-ship-mods' },
          ],
        },
        {
          label: 'DA Fill',
          collapsed: true,
          items: [
            { slug: 'mods/deadair-scripts-fork/configuration/fill', label: 'Overview' },
            { slug: 'mods/deadair-scripts-fork/configuration/fill/faction-menu' },
            { slug: 'mods/deadair-scripts-fork/configuration/fill/statistics' },
          ],
        },
        {
          label: 'DA Jobs',
          collapsed: true,
          items: [
            { slug: 'mods/deadair-scripts-fork/configuration/jobs', label: 'Overview' },
            { slug: 'mods/deadair-scripts-fork/configuration/jobs/quotas' },
            { slug: 'mods/deadair-scripts-fork/configuration/jobs/vanilla-spawned' },
          ],
        },
        { slug: 'mods/deadair-scripts-fork/configuration/gate' },
        {
          label: 'DA God',
          collapsed: true,
          items: [
            { slug: 'mods/deadair-scripts-fork/configuration/god', label: 'Overview' },
            { slug: 'mods/deadair-scripts-fork/configuration/god/quotas' },
          ],
        },
        {
          label: 'DA Blueprint Analysis',
          collapsed: true,
          items: [
            { slug: 'mods/deadair-scripts-fork/configuration/blueprint-analysis', label: 'Overview' },
            {
              label: 'Progress Menus',
              collapsed: true,
              items: [
                { slug: 'mods/deadair-scripts-fork/configuration/blueprint-analysis/progress-menus', label: 'Overview' },
                { slug: 'mods/deadair-scripts-fork/configuration/blueprint-analysis/progress-menus/station-modules' },
                { slug: 'mods/deadair-scripts-fork/configuration/blueprint-analysis/progress-menus/ships' },
                { slug: 'mods/deadair-scripts-fork/configuration/blueprint-analysis/progress-menus/equipment' },
                { slug: 'mods/deadair-scripts-fork/configuration/blueprint-analysis/progress-menus/misc' },
              ],
            },
          ],
        },
        { slug: 'mods/deadair-scripts-fork/configuration/trade-optimizer' },
        { slug: 'mods/deadair-scripts-fork/configuration/extension' },
        { slug: 'mods/deadair-scripts-fork/configuration/cheat' },
      ],
    },
    {
      label: 'DA Information Menus',
      collapsed: true,
      items: [
        { slug: 'mods/deadair-scripts-fork/reports', label: 'Overview' },
        { slug: 'mods/deadair-scripts-fork/reports/military-ship-count' },
        { slug: 'mods/deadair-scripts-fork/reports/economic-ship-station-count' },
        { slug: 'mods/deadair-scripts-fork/reports/ware-stored-wanted' },
        { slug: 'mods/deadair-scripts-fork/reports/station-storage' },
        { slug: 'mods/deadair-scripts-fork/reports/production-module-count' },
        { slug: 'mods/deadair-scripts-fork/reports/trader-profit-menu' },
        { slug: 'mods/deadair-scripts-fork/reports/ship-details-menu' },
        { slug: 'mods/deadair-scripts-fork/reports/sector-details-menu' },
        { slug: 'mods/deadair-scripts-fork/reports/station-calculator' },
        { slug: 'mods/deadair-scripts-fork/reports/trade-stations' },
        { slug: 'mods/deadair-scripts-fork/reports/war-history' },
        { slug: 'mods/deadair-scripts-fork/reports/fill-statistics' },
        { slug: 'mods/deadair-scripts-fork/reports/progress-menus' },
      ],
    },
    { slug: 'mods/deadair-scripts-fork/mechanics' },
  ],
};

export default defineConfig({
  site: 'https://mlog4.github.io',
  base: '/x4-modding-wiki',
  integrations: [
    starlight({
      title: 'X4 Modding Wiki',
      description: 'API reference, architectural overviews, and tutorials for X4 Foundations modders.',
      sidebar: [
        { label: '🏠 Home', link: '/' },

        // Featured Mods (user guides).
        // DA Scripts fork uses an explicit tree so we can nest its 27+ pages by menu;
        // other mods stay as flat top-level entries in menu order.
        {
          label: '🧩 Featured Mods',
          collapsed: false,
          items: [
            { slug: 'mods' },
            daScriptsForkSidebar,
            { slug: 'mods/deadair-scripts-no-wares-fork' },
            {
              label: 'DeadAir Eco (mlog4 fork)',
              collapsed: true,
              items: [
                { slug: 'mods/deadair-eco-fork', label: 'Overview' },
                {
                  label: 'Mechanics',
                  collapsed: true,
                  items: [
                    { slug: 'mods/deadair-eco-fork/mechanics', label: 'Overview' },
                    { slug: 'mods/deadair-eco-fork/mechanics/da-wares' },
                    { slug: 'mods/deadair-eco-fork/mechanics/storage-sizing' },
                    { slug: 'mods/deadair-eco-fork/mechanics/station-improvements' },
                    { slug: 'mods/deadair-eco-fork/mechanics/xenon-specifics' },
                  ],
                },
                {
                  label: 'Reference',
                  collapsed: true,
                  items: [
                    { slug: 'mods/deadair-eco-fork/reference/library-changes' },
                    { slug: 'mods/deadair-eco-fork/reference/mlog6-fork-fixes' },
                  ],
                },
              ],
            },
            { slug: 'mods/deadair-eco-no-wares-fork' },
            {
              label: 'Galactic Heroes',
              collapsed: true,
              items: [
                { slug: 'mods/galactic-heroes', label: 'Overview' },
                {
                  label: 'Mechanics',
                  collapsed: true,
                  items: [
                    { slug: 'mods/galactic-heroes/mechanics/xp-and-stars' },
                    { slug: 'mods/galactic-heroes/mechanics/death-cycle' },
                    { slug: 'mods/galactic-heroes/mechanics/recovery-points' },
                    { slug: 'mods/galactic-heroes/mechanics/lineage-succession' },
                  ],
                },
                {
                  label: 'Archetypes',
                  collapsed: true,
                  items: [
                    { slug: 'mods/galactic-heroes/archetypes/admiral' },
                    { slug: 'mods/galactic-heroes/archetypes/pirate-raider' },
                    { slug: 'mods/galactic-heroes/archetypes/khaak-hive-lord' },
                    { slug: 'mods/galactic-heroes/archetypes/khaak-seeder' },
                  ],
                },
              ],
            },
            { slug: 'mods/apus-compat' },
            { slug: 'mods/etw-compat' },
          ],
        },

        // Game Model
        { label: '🌌 World',      collapsed: true, items: [{ autogenerate: { directory: 'game/world' } }] },
        { label: '🚀 Objects',    collapsed: true, items: [{ autogenerate: { directory: 'game/objects' } }] },
        { label: '🏴 Factions',   collapsed: true, items: [{ autogenerate: { directory: 'game/factions' } }] },
        { label: '💰 Economy',    collapsed: true, items: [{ autogenerate: { directory: 'game/economy' } }] },
        { label: '🎯 Behavior',   collapsed: true, items: [{ autogenerate: { directory: 'game/behavior' } }] },
        { label: '👤 Characters', collapsed: true, items: [{ autogenerate: { directory: 'game/characters' } }] },
        { label: '🎬 Missions',   collapsed: true, items: [{ autogenerate: { directory: 'game/missions' } }] },

        // Modding Languages
        { label: '⚙️ MD Framework', collapsed: true, items: [{ autogenerate: { directory: 'lang/md-framework' } }] },
        { label: '🤖 AI Script',    collapsed: true, items: [{ autogenerate: { directory: 'lang/aiscript' } }] },
        { label: '📦 Data Layer',   collapsed: true, items: [{ autogenerate: { directory: 'lang/data' } }] },
        { label: '🖥️ UI / Lua',    collapsed: true, items: [{ autogenerate: { directory: 'lang/ui-lua' } }] },

        // Tutorials + Reference
        { label: '📚 Architectural Overviews', collapsed: true, items: [{ autogenerate: { directory: 'overviews' } }] },
        { label: '🌐 Vanilla Content',         collapsed: true, items: [{ autogenerate: { directory: 'vanilla-content' } }] },
        { label: '📖 Modding Wiki',            collapsed: true, items: [{ autogenerate: { directory: 'wiki' } }] },
        { label: 'ℹ️ About',                   collapsed: true, items: [{ autogenerate: { directory: 'about' } }] },
      ],
    }),
  ],
});

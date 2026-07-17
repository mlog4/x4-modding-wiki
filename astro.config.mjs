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
        { slug: 'mods/deadair-scripts-fork/reports/trade-stations' },
        { slug: 'mods/deadair-scripts-fork/reports/extension-progress' },
        { slug: 'mods/deadair-scripts-fork/reports/evolution-status' },
        { slug: 'mods/deadair-scripts-fork/reports/war-stats' },
        { slug: 'mods/deadair-scripts-fork/reports/blueprint-progress' },
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
            { slug: 'mods/deadair-eco-fork' },
            { slug: 'mods/deadair-eco-no-wares-fork' },
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

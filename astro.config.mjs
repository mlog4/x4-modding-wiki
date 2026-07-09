import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://mlog4.github.io',
  base: '/x4-modding-wiki',
  integrations: [
    starlight({
      title: 'X4 Modding Wiki',
      description: 'API reference, architectural overviews, and tutorials for X4 Foundations modders.',
      sidebar: [
        { label: 'Home', link: '/' },
        {
          label: '🎮 Game Model',
          collapsed: false,
          items: [
            { label: '🌌 World',      items: [{ autogenerate: { directory: 'game/world' } }] },
            { label: '🚀 Objects',    items: [{ autogenerate: { directory: 'game/objects' } }] },
            { label: '🏴 Factions',   items: [{ autogenerate: { directory: 'game/factions' } }] },
            { label: '💰 Economy',    items: [{ autogenerate: { directory: 'game/economy' } }] },
            { label: '🎯 Behavior',   items: [{ autogenerate: { directory: 'game/behavior' } }] },
            { label: '👤 Characters', items: [{ autogenerate: { directory: 'game/characters' } }] },
            { label: '🎬 Missions',   items: [{ autogenerate: { directory: 'game/missions' } }] },
          ],
        },
        {
          label: '💻 Modding Languages',
          collapsed: true,
          items: [
            { label: '⚙️ MD Framework', items: [{ autogenerate: { directory: 'lang/md-framework' } }] },
            { label: '🤖 AI Script',    items: [{ autogenerate: { directory: 'lang/aiscript' } }] },
            { label: '📦 Data Layer',   items: [{ autogenerate: { directory: 'lang/data' } }] },
            { label: '🖥️ UI / Lua',    items: [{ autogenerate: { directory: 'lang/ui-lua' } }] },
          ],
        },
        {
          label: '📚 Architectural Overviews',
          collapsed: true,
          items: [{ autogenerate: { directory: 'overviews' } }],
        },
        {
          label: '🌐 Vanilla Content',
          collapsed: true,
          items: [{ autogenerate: { directory: 'vanilla-content' } }],
        },
        {
          label: '📖 Modding Wiki',
          collapsed: true,
          items: [{ autogenerate: { directory: 'wiki' } }],
        },
        {
          label: 'ℹ️ About',
          collapsed: true,
          items: [{ autogenerate: { directory: 'about' } }],
        },
      ],
    }),
  ],
});

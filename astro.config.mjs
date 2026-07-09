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
            {
              label: '🌌 World',
              autogenerate: { directory: 'game/world' },
            },
            {
              label: '🚀 Objects',
              autogenerate: { directory: 'game/objects' },
            },
            {
              label: '🏴 Factions',
              autogenerate: { directory: 'game/factions' },
            },
            {
              label: '💰 Economy',
              autogenerate: { directory: 'game/economy' },
            },
            {
              label: '🎯 Behavior',
              autogenerate: { directory: 'game/behavior' },
            },
            {
              label: '👤 Characters',
              autogenerate: { directory: 'game/characters' },
            },
            {
              label: '🎬 Missions',
              autogenerate: { directory: 'game/missions' },
            },
          ],
        },
        {
          label: '💻 Modding Languages',
          collapsed: true,
          items: [
            {
              label: '⚙️ MD Framework',
              autogenerate: { directory: 'lang/md-framework' },
            },
            {
              label: '🤖 AI Script',
              autogenerate: { directory: 'lang/aiscript' },
            },
            {
              label: '📦 Data Layer',
              autogenerate: { directory: 'lang/data' },
            },
            {
              label: '🖥️ UI / Lua',
              autogenerate: { directory: 'lang/ui-lua' },
            },
          ],
        },
        {
          label: '📚 Architectural Overviews',
          collapsed: true,
          autogenerate: { directory: 'overviews' },
        },
        {
          label: '🌐 Vanilla Content',
          collapsed: true,
          autogenerate: { directory: 'vanilla-content' },
        },
        {
          label: '📖 Modding Wiki',
          collapsed: true,
          autogenerate: { directory: 'wiki' },
        },
        {
          label: 'ℹ️ About',
          collapsed: true,
          autogenerate: { directory: 'about' },
        },
      ],
    }),
  ],
});

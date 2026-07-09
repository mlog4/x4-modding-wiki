import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://mlog4.github.io',
  base: '/x4-modding-wiki',
  integrations: [
    starlight({
      title: 'X4 Modding Wiki (prototype)',
      description: 'API reference + architectural overviews for X4 Foundations modders.',
      sidebar: [
        { label: 'Home', link: '/' },
        {
          label: 'API Reference',
          items: [
            { label: 'Overview', link: '/api/' },
            {
              label: '🌌 World',
              items: [{ autogenerate: { directory: 'api/world' } }],
            },
            {
              label: '🚀 Object types',
              items: [{ autogenerate: { directory: 'api/objects' } }],
            },
            {
              label: '🏴 Factions',
              items: [{ autogenerate: { directory: 'api/factions' } }],
            },
            {
              label: '💰 Economy',
              items: [{ autogenerate: { directory: 'api/economy' } }],
            },
            {
              label: '🎯 Behavior',
              items: [{ autogenerate: { directory: 'api/behavior' } }],
            },
            {
              label: '⚙️ MD Framework',
              items: [{ autogenerate: { directory: 'api/md-framework' } }],
            },
            {
              label: '🤖 Aiscript',
              items: [{ autogenerate: { directory: 'api/aiscript' } }],
            },
            {
              label: '📦 Data layer',
              items: [{ autogenerate: { directory: 'api/data' } }],
            },
            {
              label: '🖥️ UI / Lua',
              items: [{ autogenerate: { directory: 'api/ui-lua' } }],
            },
          ],
        },
        {
          label: 'Architectural overviews',
          link: '/overviews/',
        },
        {
          label: 'Modding Wiki',
          link: '/wiki/',
        },
        {
          label: 'About',
          link: '/about/',
        },
      ],
    }),
  ],
});

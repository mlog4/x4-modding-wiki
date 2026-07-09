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
        { label: '🏠 Home', link: '/' },

        // Featured Mods (user guides)
        { label: '🧩 Featured Mods', collapsed: false, items: [{ autogenerate: { directory: 'mods' } }] },

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

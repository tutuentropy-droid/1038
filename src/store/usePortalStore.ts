import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PortalStats, MemoryFragment, HiddenStory } from '@/types';
import { portalWorlds } from '@/data/portalWorlds';

interface PortalState {
  stats: PortalStats;
  showFragmentModal: boolean;
  currentFragment: MemoryFragment | null;
  showStoryModal: boolean;
  currentStory: HiddenStory | null;

  init: () => void;
  visitWorld: (worldId: string) => void;
  collectFragment: (fragment: MemoryFragment) => boolean;
  discoverStory: (story: HiddenStory) => boolean;
  isFragmentCollected: (fragmentId: string) => boolean;
  isStoryDiscovered: (storyId: string) => boolean;
  getWorldProgress: (worldId: string) => { fragments: number; totalFragments: number; stories: number; totalStories: number };
  getCollectedFragmentsByWorld: (worldId: string) => MemoryFragment[];
  getDiscoveredStoriesByWorld: (worldId: string) => HiddenStory[];
  canUnlockStory: (story: HiddenStory, worldId: string) => boolean;
  getRarityColor: (rarity: string) => string;
  getRarityBgColor: (rarity: string) => string;
  openFragmentModal: (fragment: MemoryFragment) => void;
  closeFragmentModal: () => void;
  openStoryModal: (story: HiddenStory) => void;
  closeStoryModal: () => void;
}

const initialStats: PortalStats = {
  unlockedWorlds: ['forest', 'ocean', 'space', 'school'],
  collectedFragments: [],
  discoveredStories: [],
  totalPoints: 0,
  visitCount: {},
  lastVisit: undefined,
};

export const usePortalStore = create<PortalState>()(
  persist(
    (set, get) => ({
      stats: initialStats,
      showFragmentModal: false,
      currentFragment: null,
      showStoryModal: false,
      currentStory: null,

      init: () => {
        const now = Date.now();
        const allWorlds = ['forest', 'ocean', 'space', 'school'];
        set((state) => {
          const currentUnlocked = state.stats.unlockedWorlds || [];
          const newUnlocked = [...new Set([...currentUnlocked, ...allWorlds])];
          return {
            stats: {
              ...state.stats,
              unlockedWorlds: newUnlocked,
              lastVisit: now,
            },
          };
        });
      },

      visitWorld: (worldId: string) => {
        set((state) => {
          const visitCount = { ...state.stats.visitCount };
          visitCount[worldId] = (visitCount[worldId] || 0) + 1;
          return {
            stats: {
              ...state.stats,
              visitCount,
            },
          };
        });
      },

      collectFragment: (fragment: MemoryFragment) => {
        if (get().stats.collectedFragments.includes(fragment.id)) {
          return false;
        }

        set((state) => ({
          stats: {
            ...state.stats,
            collectedFragments: [...state.stats.collectedFragments, fragment.id],
            totalPoints: state.stats.totalPoints + fragment.points,
          },
          showFragmentModal: true,
          currentFragment: fragment,
        }));

        return true;
      },

      discoverStory: (story: HiddenStory) => {
        const isNew = !get().stats.discoveredStories.includes(story.id);

        if (isNew) {
          set((state) => ({
            stats: {
              ...state.stats,
              discoveredStories: [...state.stats.discoveredStories, story.id],
            },
            showStoryModal: true,
            currentStory: story,
          }));
        } else {
          set({
            showStoryModal: true,
            currentStory: story,
          });
        }

        return isNew;
      },

      isFragmentCollected: (fragmentId: string) => {
        return get().stats.collectedFragments.includes(fragmentId);
      },

      isStoryDiscovered: (storyId: string) => {
        return get().stats.discoveredStories.includes(storyId);
      },

      getWorldProgress: (worldId: string) => {
        const world = portalWorlds.find(w => w.id === worldId);
        if (!world) return { fragments: 0, totalFragments: 0, stories: 0, totalStories: 0 };

        const collectedFragments = world.memoryFragments.filter(f =>
          get().stats.collectedFragments.includes(f.id)
        ).length;

        const discoveredStories = world.hiddenStories.filter(s =>
          get().stats.discoveredStories.includes(s.id)
        ).length;

        return {
          fragments: collectedFragments,
          totalFragments: world.memoryFragments.length,
          stories: discoveredStories,
          totalStories: world.hiddenStories.length,
        };
      },

      getCollectedFragmentsByWorld: (worldId: string) => {
        const world = portalWorlds.find(w => w.id === worldId);
        if (!world) return [];
        return world.memoryFragments.filter(f =>
          get().stats.collectedFragments.includes(f.id)
        );
      },

      getDiscoveredStoriesByWorld: (worldId: string) => {
        const world = portalWorlds.find(w => w.id === worldId);
        if (!world) return [];
        return world.hiddenStories.filter(s =>
          get().stats.discoveredStories.includes(s.id)
        );
      },

      canUnlockStory: (story: HiddenStory, worldId: string) => {
        if (get().stats.discoveredStories.includes(story.id)) {
          return true;
        }
        if (!story.requiredFragments) return true;
        const progress = get().getWorldProgress(worldId);
        return progress.fragments >= story.requiredFragments;
      },

      getRarityColor: (rarity: string) => {
        switch (rarity) {
          case 'common':
            return 'text-gray-400';
          case 'rare':
            return 'text-blue-400';
          case 'epic':
            return 'text-purple-400';
          case 'legendary':
            return 'text-yellow-400';
          default:
            return 'text-gray-400';
        }
      },

      getRarityBgColor: (rarity: string) => {
        switch (rarity) {
          case 'common':
            return 'from-gray-600 to-gray-700';
          case 'rare':
            return 'from-blue-500 to-blue-700';
          case 'epic':
            return 'from-purple-500 to-purple-700';
          case 'legendary':
            return 'from-yellow-400 to-orange-600';
          default:
            return 'from-gray-600 to-gray-700';
        }
      },

      openFragmentModal: (fragment: MemoryFragment) => {
        set({ showFragmentModal: true, currentFragment: fragment });
      },

      closeFragmentModal: () => {
        set({ showFragmentModal: false, currentFragment: null });
      },

      openStoryModal: (story: HiddenStory) => {
        set({ showStoryModal: true, currentStory: story });
      },

      closeStoryModal: () => {
        set({ showStoryModal: false, currentStory: null });
      },
    }),
    {
      name: 'anime-museum-portal',
    }
  )
);

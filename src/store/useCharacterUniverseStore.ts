import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UniverseStats } from '@/types';

interface CharacterUniverseState {
  stats: UniverseStats;
  expandedCharacters: string[];
  activeFilter: 'all' | 'friend' | 'rival' | 'mentor' | 'family';

  discoverRelation: (relationId: string) => void;
  discoverSimilar: (pairId: string) => void;
  completeQuest: (questId: string, reward: number) => void;
  toggleExpandCharacter: (characterId: string) => void;
  clearExpandedCharacters: () => void;
  setActiveFilter: (filter: 'all' | 'friend' | 'rival' | 'mentor' | 'family') => void;
  isRelationDiscovered: (relationId: string) => boolean;
  isSimilarDiscovered: (pairId: string) => boolean;
  isQuestCompleted: (questId: string) => boolean;
  isCharacterExpanded: (characterId: string) => boolean;
  reset: () => void;
}

const initialStats: UniverseStats = {
  discoveredRelations: [],
  discoveredSimilar: [],
  completedQuests: [],
  totalPoints: 0,
};

export const useCharacterUniverseStore = create<CharacterUniverseState>()(
  persist(
    (set, get) => ({
      stats: initialStats,
      expandedCharacters: [],
      activeFilter: 'all',

      discoverRelation: (relationId: string) => {
        const { stats } = get();
        if (stats.discoveredRelations.includes(relationId)) return;
        set({
          stats: {
            ...stats,
            discoveredRelations: [...stats.discoveredRelations, relationId],
            totalPoints: stats.totalPoints + 10,
          },
        });
      },

      discoverSimilar: (pairId: string) => {
        const { stats } = get();
        if (stats.discoveredSimilar.includes(pairId)) return;
        set({
          stats: {
            ...stats,
            discoveredSimilar: [...stats.discoveredSimilar, pairId],
            totalPoints: stats.totalPoints + 20,
          },
        });
      },

      completeQuest: (questId: string, reward: number) => {
        const { stats } = get();
        if (stats.completedQuests.includes(questId)) return;
        set({
          stats: {
            ...stats,
            completedQuests: [...stats.completedQuests, questId],
            totalPoints: stats.totalPoints + reward,
          },
        });
      },

      toggleExpandCharacter: (characterId: string) => {
        const { expandedCharacters } = get();
        if (expandedCharacters.includes(characterId)) {
          set({ expandedCharacters: expandedCharacters.filter((id) => id !== characterId) });
        } else {
          set({ expandedCharacters: [...expandedCharacters, characterId] });
        }
      },

      clearExpandedCharacters: () => {
        set({ expandedCharacters: [] });
      },

      setActiveFilter: (filter) => {
        set({ activeFilter: filter });
      },

      isRelationDiscovered: (relationId: string) => {
        return get().stats.discoveredRelations.includes(relationId);
      },

      isSimilarDiscovered: (pairId: string) => {
        return get().stats.discoveredSimilar.includes(pairId);
      },

      isQuestCompleted: (questId: string) => {
        return get().stats.completedQuests.includes(questId);
      },

      isCharacterExpanded: (characterId: string) => {
        return get().expandedCharacters.includes(characterId);
      },

      reset: () => {
        set({ stats: initialStats, expandedCharacters: [], activeFilter: 'all' });
      },
    }),
    {
      name: 'anime-museum-character-universe',
    }
  )
);

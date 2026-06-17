import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  HiddenCharacter,
  EasterEgg,
  SpecialCollection,
  Quest,
  Achievement,
  PlayerStats,
  EraType,
} from '@/types';
import {
  hiddenCharacters,
  easterEggs,
  achievements,
  generateQuests,
  generateSpecialCollections,
  getHiddenCharacterByCharacterId,
} from '@/data/treasureHunt';
import { getAllCharacters } from '@/data/characters';

interface TreasureHuntState {
  stats: PlayerStats;
  quests: Quest[];
  specialCollections: SpecialCollection[];
  lastSpecialRefresh: number;
  showNewDiscovery: boolean;
  newDiscoveryData: {
    type: 'character' | 'easterEgg' | 'special' | 'achievement' | 'quest';
    name: string;
    points: number;
    image?: string;
  } | null;

  init: () => void;
  findHiddenCharacter: (characterId: string) => boolean;
  findEasterEgg: (easterEggId: string) => boolean;
  collectSpecialCollection: (specialId: string) => boolean;
  refreshSpecialCollections: () => void;
  checkAchievements: () => Achievement[];
  updateQuestProgress: (type: string, characterId?: string, era?: EraType) => void;
  getHiddenCharactersByEra: (era: EraType) => HiddenCharacter[];
  getFoundHiddenCharactersByEra: (era: EraType) => string[];
  getActiveQuests: () => Quest[];
  getCompletedQuests: () => Quest[];
  getUnlockedAchievements: () => Achievement[];
  getLockedAchievements: () => Achievement[];
  getRarityColor: (rarity: string) => string;
  getAchievementRarityColor: (rarity: string) => string;
  closeNewDiscovery: () => void;
  isCharacterHidden: (characterId: string) => boolean;
  isEasterEggFound: (easterEggId: string) => boolean;
  getHintForCharacter: (characterId: string) => string | null;
  addPoints: (points: number) => void;
}

const initialStats: PlayerStats = {
  totalPoints: 0,
  hiddenCharactersFound: [],
  easterEggsFound: [],
  specialCollectionsFound: [],
  completedQuests: [],
  unlockedAchievements: [],
  visitCount: 0,
  lastVisit: 0,
  currentStreak: 1,
};

export const useTreasureHuntStore = create<TreasureHuntState>()(
  persist(
    (set, get) => ({
      stats: initialStats,
      quests: [],
      specialCollections: [],
      lastSpecialRefresh: 0,
      showNewDiscovery: false,
      newDiscoveryData: null,

      init: () => {
        const now = Date.now();
        const lastVisit = get().stats.lastVisit;
        const oneDay = 24 * 60 * 60 * 1000;

        let newStreak = get().stats.currentStreak;
        if (lastVisit > 0) {
          const daysSinceLastVisit = Math.floor((now - lastVisit) / oneDay);
          if (daysSinceLastVisit === 0) {
          } else if (daysSinceLastVisit === 1) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
        }

        set((state) => ({
          stats: {
            ...state.stats,
            visitCount: state.stats.visitCount + 1,
            lastVisit: now,
            currentStreak: newStreak,
          },
          quests: generateQuests(),
        }));

        const lastRefresh = get().lastSpecialRefresh;
        const sixHours = 6 * 60 * 60 * 1000;
        if (now - lastRefresh > sixHours || get().specialCollections.length === 0) {
          get().refreshSpecialCollections();
        }

        get().checkAchievements();
      },

      findHiddenCharacter: (characterId: string) => {
        const hidden = getHiddenCharacterByCharacterId(characterId);
        if (!hidden) return false;
        if (get().stats.hiddenCharactersFound.includes(characterId)) return false;

        set((state) => ({
          stats: {
            ...state.stats,
            hiddenCharactersFound: [...state.stats.hiddenCharactersFound, characterId],
            totalPoints: state.stats.totalPoints + hidden.points,
          },
          showNewDiscovery: true,
          newDiscoveryData: {
            type: 'character',
            name: hidden.id,
            points: hidden.points,
          },
        }));

        get().updateQuestProgress('find_characters', characterId, hidden.era);
        get().checkAchievements();

        return true;
      },

      findEasterEgg: (easterEggId: string) => {
        const easterEgg = easterEggs.find((e) => e.id === easterEggId);
        if (!easterEgg) return false;
        if (get().stats.easterEggsFound.includes(easterEggId)) return false;

        set((state) => ({
          stats: {
            ...state.stats,
            easterEggsFound: [...state.stats.easterEggsFound, easterEggId],
            totalPoints: state.stats.totalPoints + easterEgg.points,
          },
          showNewDiscovery: true,
          newDiscoveryData: {
            type: 'easterEgg',
            name: easterEgg.name,
            points: easterEgg.points,
            image: easterEgg.image,
          },
        }));

        get().updateQuestProgress('find_easter_eggs');
        get().checkAchievements();

        return true;
      },

      collectSpecialCollection: (specialId: string) => {
        const special = get().specialCollections.find((s) => s.id === specialId);
        if (!special) return false;
        if (get().stats.specialCollectionsFound.includes(specialId)) return false;

        set((state) => ({
          stats: {
            ...state.stats,
            specialCollectionsFound: [...state.stats.specialCollectionsFound, specialId],
            totalPoints: state.stats.totalPoints + special.points,
          },
          showNewDiscovery: true,
          newDiscoveryData: {
            type: 'special',
            name: special.name,
            points: special.points,
            image: special.image,
          },
        }));

        get().updateQuestProgress('collect_special');
        get().checkAchievements();

        return true;
      },

      refreshSpecialCollections: () => {
        set({
          specialCollections: generateSpecialCollections(),
          lastSpecialRefresh: Date.now(),
        });
      },

      checkAchievements: () => {
        const stats = get().stats;
        const newlyUnlocked: Achievement[] = [];

        achievements.forEach((achievement) => {
          if (stats.unlockedAchievements.includes(achievement.id)) return;

          let progress = 0;
          const req = achievement.requirement;

          switch (req.type) {
            case 'collect_characters':
              if (req.era) {
                const eraChars = hiddenCharacters.filter((hc) => hc.era === req.era);
                progress = eraChars.filter((hc) =>
                  stats.hiddenCharactersFound.includes(hc.characterId)
                ).length;
              } else {
                progress = stats.hiddenCharactersFound.length;
              }
              break;
            case 'find_easter_eggs':
              progress = stats.easterEggsFound.length;
              break;
            case 'complete_quests':
              progress = stats.completedQuests.length;
              break;
            case 'collect_specials':
              progress = stats.specialCollectionsFound.length;
              break;
            case 'visits':
              progress = stats.visitCount;
              break;
          }

          if (progress >= req.target) {
            newlyUnlocked.push(achievement);
            set((state) => ({
              stats: {
                ...state.stats,
                unlockedAchievements: [...state.stats.unlockedAchievements, achievement.id],
                totalPoints: state.stats.totalPoints + achievement.points,
              },
            }));
          }
        });

        if (newlyUnlocked.length > 0) {
          const latestAchievement = newlyUnlocked[newlyUnlocked.length - 1];
          set({
            showNewDiscovery: true,
            newDiscoveryData: {
              type: 'achievement',
              name: latestAchievement.name,
              points: latestAchievement.points,
            },
          });
        }

        return newlyUnlocked;
      },

      updateQuestProgress: (type: string, characterId?: string, era?: EraType) => {
        set((state) => {
          const updatedQuests = state.quests.map((quest) => {
            if (quest.status === 'completed') return quest;

            let shouldUpdate = false;
            let newProgress = quest.currentProgress;

            if (quest.type === type) {
              if (type === 'find_characters' || type === 'combo_era') {
                if (quest.era && era && quest.era !== era) return quest;
                if (quest.targetIds && characterId && quest.targetIds.includes(characterId)) {
                  shouldUpdate = true;
                  newProgress = quest.targetIds.filter((id) =>
                    state.stats.hiddenCharactersFound.includes(id)
                  ).length;
                } else if (!quest.targetIds) {
                  shouldUpdate = true;
                  if (era) {
                    const eraChars = hiddenCharacters.filter((hc) => hc.era === era);
                    newProgress = eraChars.filter((hc) =>
                      state.stats.hiddenCharactersFound.includes(hc.characterId)
                    ).length;
                  } else {
                    newProgress = state.stats.hiddenCharactersFound.length;
                  }
                }
              } else if (type === 'find_easter_eggs') {
                shouldUpdate = true;
                newProgress = state.stats.easterEggsFound.length;
              } else if (type === 'collect_special') {
                shouldUpdate = true;
                newProgress = state.stats.specialCollectionsFound.length;
              }
            }

            if (shouldUpdate) {
              const isCompleted = newProgress >= quest.targetCount;
              if (isCompleted) {
                return {
                  ...quest,
                  currentProgress: newProgress,
                  status: 'completed' as const,
                  completedAt: Date.now(),
                };
              }
              return {
                ...quest,
                currentProgress: newProgress,
                status: newProgress > 0 ? 'in_progress' as const : quest.status,
              };
            }

            return quest;
          });

          const newCompletedQuests = updatedQuests
            .filter(
              (q) =>
                q.status === 'completed' &&
                !state.stats.completedQuests.includes(q.id)
            )
            .map((q) => q.id);

          if (newCompletedQuests.length > 0) {
            const quest = updatedQuests.find((q) => q.id === newCompletedQuests[0]);
            if (quest) {
              set({
                showNewDiscovery: true,
                newDiscoveryData: {
                  type: 'quest',
                  name: quest.title,
                  points: quest.reward.points,
                },
              });
            }
          }

          return {
            quests: updatedQuests,
            stats: {
              ...state.stats,
              completedQuests: [...state.stats.completedQuests, ...newCompletedQuests],
              totalPoints:
                state.stats.totalPoints +
                newCompletedQuests.reduce((sum, qId) => {
                  const q = updatedQuests.find((quest) => quest.id === qId);
                  return sum + (q?.reward.points || 0);
                }, 0),
            },
          };
        });
      },

      getHiddenCharactersByEra: (era: EraType) => {
        return hiddenCharacters.filter((hc) => hc.era === era);
      },

      getFoundHiddenCharactersByEra: (era: EraType) => {
        const eraChars = get().getHiddenCharactersByEra(era);
        return eraChars
          .filter((hc) => get().stats.hiddenCharactersFound.includes(hc.characterId))
          .map((hc) => hc.characterId);
      },

      getActiveQuests: () => {
        return get().quests.filter(
          (q) => q.status === 'available' || q.status === 'in_progress'
        );
      },

      getCompletedQuests: () => {
        return get().quests.filter((q) => q.status === 'completed');
      },

      getUnlockedAchievements: () => {
        return achievements.filter((a) =>
          get().stats.unlockedAchievements.includes(a.id)
        );
      },

      getLockedAchievements: () => {
        return achievements.filter(
          (a) => !get().stats.unlockedAchievements.includes(a.id)
        );
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

      getAchievementRarityColor: (rarity: string) => {
        switch (rarity) {
          case 'bronze':
            return 'text-amber-600';
          case 'silver':
            return 'text-gray-300';
          case 'gold':
            return 'text-yellow-400';
          case 'platinum':
            return 'text-cyan-300';
          default:
            return 'text-gray-400';
        }
      },

      closeNewDiscovery: () => {
        set({ showNewDiscovery: false, newDiscoveryData: null });
      },

      isCharacterHidden: (characterId: string) => {
        return hiddenCharacters.some((hc) => hc.characterId === characterId);
      },

      isEasterEggFound: (easterEggId: string) => {
        return get().stats.easterEggsFound.includes(easterEggId);
      },

      getHintForCharacter: (characterId: string) => {
        const hidden = getHiddenCharacterByCharacterId(characterId);
        return hidden?.hint || null;
      },

      addPoints: (points: number) => {
        set((state) => ({
          stats: {
            ...state.stats,
            totalPoints: state.stats.totalPoints + points,
          },
        }));
      },
    }),
    {
      name: 'anime-museum-treasure-hunt',
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RepairStats, RepairProblemType } from '@/types';
import { repairBadges, repairableAnimations } from '@/data/repairCenter';

interface RepairState {
  stats: RepairStats;
  hasVisitedRepairCenter: boolean;

  visitRepairCenter: () => void;
  completeRepair: (animationId: string, problemTypes: RepairProblemType[], isPerfect: boolean, points: number) => void;
  earnBadge: (badgeId: string) => void;
  dismissNewBadge: (badgeId: string) => void;
  clearNewBadges: () => void;
  isBadgeEarned: (badgeId: string) => boolean;
  checkBadgeEligibility: () => string[];
  getProgress: () => { total: number; repaired: number; percentage: number };
}

const initialStats: RepairStats = {
  totalRepairs: 0,
  scratchRepairs: 0,
  fadingRepairs: 0,
  missingFrameRepairs: 0,
  perfectRepairs: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalPoints: 0,
  repairedAnimations: [],
  earnedBadges: [],
  newBadges: [],
};

export const useRepairStore = create<RepairState>()(
  persist(
    (set, get) => ({
      stats: initialStats,
      hasVisitedRepairCenter: false,

      visitRepairCenter: () => {
        set({ hasVisitedRepairCenter: true });
      },

      completeRepair: (animationId, problemTypes, isPerfect, points) => {
        const { stats } = get();
        const now = Date.now();
        const lastRepairDate = stats.lastRepairAt ? new Date(stats.lastRepairAt).toDateString() : null;
        const today = new Date(now).toDateString();
        const yesterday = new Date(now - 86400000).toDateString();

        let newStreak = stats.currentStreak;
        if (lastRepairDate === today) {
        } else if (lastRepairDate === yesterday || !lastRepairDate) {
          newStreak = stats.currentStreak + 1;
        } else {
          newStreak = 1;
        }

        const newStats: RepairStats = {
          ...stats,
          totalRepairs: stats.totalRepairs + 1,
          scratchRepairs: stats.scratchRepairs + problemTypes.filter(p => p === 'scratch').length,
          fadingRepairs: stats.fadingRepairs + problemTypes.filter(p => p === 'fading').length,
          missingFrameRepairs: stats.missingFrameRepairs + problemTypes.filter(p => p === 'missing_frame').length,
          perfectRepairs: isPerfect ? stats.perfectRepairs + 1 : stats.perfectRepairs,
          currentStreak: newStreak,
          longestStreak: Math.max(stats.longestStreak, newStreak),
          totalPoints: stats.totalPoints + points,
          repairedAnimations: stats.repairedAnimations.includes(animationId)
            ? stats.repairedAnimations
            : [...stats.repairedAnimations, animationId],
          lastRepairAt: now,
        };

        set({ stats: newStats });

        setTimeout(() => {
          const newlyEarned = get().checkBadgeEligibility();
          newlyEarned.forEach(badgeId => get().earnBadge(badgeId));
        }, 100);
      },

      earnBadge: (badgeId) => {
        const { stats } = get();
        if (!stats.earnedBadges.includes(badgeId)) {
          const badge = repairBadges.find(b => b.id === badgeId);
          const bonusPoints = badge?.points || 0;
          set({
            stats: {
              ...stats,
              earnedBadges: [...stats.earnedBadges, badgeId],
              newBadges: [...stats.newBadges, badgeId],
              totalPoints: stats.totalPoints + bonusPoints,
            },
          });
        }
      },

      dismissNewBadge: (badgeId) => {
        const { stats } = get();
        set({
          stats: {
            ...stats,
            newBadges: stats.newBadges.filter(id => id !== badgeId),
          },
        });
      },

      clearNewBadges: () => {
        const { stats } = get();
        set({
          stats: {
            ...stats,
            newBadges: [],
          },
        });
      },

      isBadgeEarned: (badgeId) => {
        return get().stats.earnedBadges.includes(badgeId);
      },

      checkBadgeEligibility: () => {
        const { stats, isBadgeEarned } = get();
        const newlyEarned: string[] = [];

        repairBadges.forEach(badge => {
          if (isBadgeEarned(badge.id)) return;

          let eligible = false;
          const req = badge.requirement;

          switch (req.type) {
            case 'repair_count':
              eligible = stats.totalRepairs >= req.target;
              break;
            case 'repair_type':
              if (req.problemType === 'scratch') {
                eligible = stats.scratchRepairs >= req.target;
              } else if (req.problemType === 'fading') {
                eligible = stats.fadingRepairs >= req.target;
              } else if (req.problemType === 'missing_frame') {
                eligible = stats.missingFrameRepairs >= req.target;
              }
              break;
            case 'perfect_repair':
              eligible = stats.perfectRepairs >= req.target;
              break;
            case 'streak':
              eligible = stats.longestStreak >= req.target;
              break;
          }

          if (eligible) {
            newlyEarned.push(badge.id);
          }
        });

        return newlyEarned;
      },

      getProgress: () => {
        const { stats } = get();
        const total = repairableAnimations.length;
        const repaired = stats.repairedAnimations.length;
        return {
          total,
          repaired,
          percentage: Math.round((repaired / total) * 100),
        };
      },
    }),
    {
      name: 'anime-museum-repair-center',
    }
  )
);

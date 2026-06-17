import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkshopState {
  earnedBadges: string[];
  learnedSteps: string[];
  learnedTerms: string[];
  learnedHistory: string[];
  completedStoryboardPuzzle: boolean;
  hasVisitedWorkshop: boolean;
  newBadges: string[];

  earnBadge: (badgeId: string) => void;
  markStepLearned: (stepId: string) => void;
  markTermLearned: (termId: string) => void;
  markHistoryLearned: (eventId: string) => void;
  completeStoryboardPuzzle: () => void;
  visitWorkshop: () => void;
  dismissNewBadge: (badgeId: string) => void;
  clearNewBadges: () => void;
  getEarnedBadgeCount: () => number;
  isBadgeEarned: (badgeId: string) => boolean;
}

export const useWorkshopStore = create<WorkshopState>()(
  persist(
    (set, get) => ({
      earnedBadges: [],
      learnedSteps: [],
      learnedTerms: [],
      learnedHistory: [],
      completedStoryboardPuzzle: false,
      hasVisitedWorkshop: false,
      newBadges: [],

      earnBadge: (badgeId: string) => {
        const { earnedBadges, newBadges } = get();
        if (!earnedBadges.includes(badgeId)) {
          set({
            earnedBadges: [...earnedBadges, badgeId],
            newBadges: [...newBadges, badgeId],
          });
        }
      },

      markStepLearned: (stepId: string) => {
        const { learnedSteps } = get();
        if (!learnedSteps.includes(stepId)) {
          set({ learnedSteps: [...learnedSteps, stepId] });
        }
      },

      markTermLearned: (termId: string) => {
        const { learnedTerms } = get();
        if (!learnedTerms.includes(termId)) {
          set({ learnedTerms: [...learnedTerms, termId] });
        }
      },

      markHistoryLearned: (eventId: string) => {
        const { learnedHistory } = get();
        if (!learnedHistory.includes(eventId)) {
          set({ learnedHistory: [...learnedHistory, eventId] });
        }
      },

      completeStoryboardPuzzle: () => {
        set({ completedStoryboardPuzzle: true });
      },

      visitWorkshop: () => {
        set({ hasVisitedWorkshop: true });
      },

      dismissNewBadge: (badgeId: string) => {
        const { newBadges } = get();
        set({ newBadges: newBadges.filter((id) => id !== badgeId) });
      },

      clearNewBadges: () => {
        set({ newBadges: [] });
      },

      getEarnedBadgeCount: () => {
        return get().earnedBadges.length;
      },

      isBadgeEarned: (badgeId: string) => {
        return get().earnedBadges.includes(badgeId);
      },
    }),
    {
      name: 'anime-museum-workshop',
    }
  )
);

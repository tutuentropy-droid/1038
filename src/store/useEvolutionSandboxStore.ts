import { create } from 'zustand';
import type { SandboxState, SandboxStats, TechEra } from '@/types';
import {
  STYLE_PHASES,
  TECH_MILESTONES,
  VISUAL_CAPABILITIES,
  PRODUCTION_TOOLS,
  ERA_ORDER,
} from '@/data/evolutionSandbox';

const STORAGE_KEY = 'evolution_sandbox_state';

const getInitialState = (): SandboxState => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fall through
      }
    }
  }

  const firstEra = ERA_ORDER[0];
  const firstPhase = STYLE_PHASES[firstEra];

  return {
    currentEra: firstEra,
    unlockedEras: [firstEra],
    researchPoints: 500,
    totalResearchPoints: 500,
    unlockedMilestones: [],
    unlockedCapabilities: [...firstPhase.unlockedCapabilities],
    unlockedTools: [...firstPhase.unlockedTools],
    currentView: 'timeline',
    selectedMilestone: null,
    selectedTool: null,
    selectedCapability: null,
    eraTransitionProgress: 0,
    isTransitioning: false,
  };
};

interface EvolutionSandboxStore extends SandboxState {
  stats: SandboxStats;
  actions: {
    setCurrentView: (view: SandboxState['currentView']) => void;
    selectEra: (era: TechEra) => void;
    unlockMilestone: (milestoneId: string) => boolean;
    unlockNextEra: () => boolean;
    addResearchPoints: (amount: number) => void;
    selectMilestone: (id: string | null) => void;
    selectTool: (id: string | null) => void;
    selectCapability: (id: string | null) => void;
    resetAll: () => void;
    saveState: () => void;
  };
}

export const useEvolutionSandboxStore = create<EvolutionSandboxStore>((set, get) => {
  const saveState = () => {
    if (typeof window !== 'undefined') {
      const state = get();
      const toSave: SandboxState = {
        currentEra: state.currentEra,
        unlockedEras: state.unlockedEras,
        researchPoints: state.researchPoints,
        totalResearchPoints: state.totalResearchPoints,
        unlockedMilestones: state.unlockedMilestones,
        unlockedCapabilities: state.unlockedCapabilities,
        unlockedTools: state.unlockedTools,
        currentView: state.currentView,
        selectedMilestone: state.selectedMilestone,
        selectedTool: state.selectedTool,
        selectedCapability: state.selectedCapability,
        eraTransitionProgress: state.eraTransitionProgress,
        isTransitioning: state.isTransitioning,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }
  };

  const computeStats = (state: SandboxState): SandboxStats => {
    const totalMilestones = Object.keys(TECH_MILESTONES).length;
    const totalCapabilities = Object.keys(VISUAL_CAPABILITIES).length;
    const totalTools = Object.keys(PRODUCTION_TOOLS).length;

    return {
      totalErasUnlocked: state.unlockedEras.length,
      totalMilestones: state.unlockedMilestones.length,
      totalCapabilities: state.unlockedCapabilities.length,
      totalTools: state.unlockedTools.length,
      researchEfficiency: state.totalResearchPoints > 0
        ? (state.unlockedMilestones.length / Math.max(state.totalResearchPoints / 1000, 1))
        : 0,
      evolutionSpeed: state.unlockedEras.length / ERA_ORDER.length,
    };
  };

  const initial = getInitialState();

  return {
    ...initial,
    stats: computeStats(initial),

    actions: {
      setCurrentView: (view) => {
        set({ currentView: view });
        saveState();
      },

      selectEra: (era) => {
        const { unlockedEras } = get();
        if (!unlockedEras.includes(era)) return;
        set({ currentEra: era });
        saveState();
      },

      unlockMilestone: (milestoneId) => {
        const milestone = TECH_MILESTONES[milestoneId];
        if (!milestone) return false;

        const state = get();
        if (state.unlockedMilestones.includes(milestoneId)) return false;

        if (!state.unlockedEras.includes(milestone.requiredEra)) return false;

        if (state.researchPoints < milestone.cost) return false;

        const newResearchPoints = state.researchPoints - milestone.cost;
        const newUnlockedMilestones = [...state.unlockedMilestones, milestoneId];

        set({
          researchPoints: newResearchPoints,
          unlockedMilestones: newUnlockedMilestones,
        });

        saveState();

        const newState = get();
        set({ stats: computeStats(newState) });

        return true;
      },

      unlockNextEra: () => {
        const state = get();
        const currentIndex = ERA_ORDER.indexOf(state.currentEra);
        if (currentIndex >= ERA_ORDER.length - 1) return false;

        const nextEra = ERA_ORDER[currentIndex + 1];
        const nextPhase = STYLE_PHASES[nextEra];

        if (state.unlockedEras.includes(nextEra)) {
          set({ currentEra: nextEra });
          saveState();
          return true;
        }

        const currentPhase = STYLE_PHASES[state.currentEra];
        const requiredMilestones = currentPhase.milestones;
        const unlockedCount = requiredMilestones.filter(
          (m) => state.unlockedMilestones.includes(m)
        ).length;

        if (unlockedCount < Math.ceil(requiredMilestones.length / 2)) {
          return false;
        }

        const newUnlockedEras = [...state.unlockedEras, nextEra];
        const newCapabilities = Array.from(
          new Set([...state.unlockedCapabilities, ...nextPhase.unlockedCapabilities])
        );
        const newTools = Array.from(
          new Set([...state.unlockedTools, ...nextPhase.unlockedTools])
        );
        const bonusPoints = 800;

        set({
          unlockedEras: newUnlockedEras,
          unlockedCapabilities: newCapabilities,
          unlockedTools: newTools,
          researchPoints: state.researchPoints + bonusPoints,
          totalResearchPoints: state.totalResearchPoints + bonusPoints,
          currentEra: nextEra,
          isTransitioning: true,
          eraTransitionProgress: 0,
        });

        setTimeout(() => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 5;
            set({ eraTransitionProgress: progress });
            if (progress >= 100) {
              clearInterval(interval);
              set({ isTransitioning: false, eraTransitionProgress: 0 });
            }
          }, 50);
        }, 0);

        saveState();

        const newState = get();
        set({ stats: computeStats(newState) });

        return true;
      },

      addResearchPoints: (amount) => {
        set((state) => ({
          researchPoints: state.researchPoints + amount,
          totalResearchPoints: state.totalResearchPoints + amount,
        }));
        saveState();

        const newState = get();
        set({ stats: computeStats(newState) });
      },

      selectMilestone: (id) => {
        set({ selectedMilestone: id });
      },

      selectTool: (id) => {
        set({ selectedTool: id });
      },

      selectCapability: (id) => {
        set({ selectedCapability: id });
      },

      resetAll: () => {
        const reset = getInitialState();
        set({ ...reset, stats: computeStats(reset) });
        saveState();
      },

      saveState,
    },
  };
});

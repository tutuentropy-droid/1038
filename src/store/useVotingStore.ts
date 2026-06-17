import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VoteRecord, BattleRecord } from '@/types';

const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

interface VotingState {
  votes: Record<string, number>;
  voteHistory: VoteRecord[];
  battleRecords: BattleRecord[];
  hasVotedToday: boolean;
  lastVoteDate: string;

  vote: (characterId: string) => boolean;
  canVoteToday: () => boolean;
  getVotes: (characterId: string) => number;
  getAllVotes: () => Record<string, number>;
  addBattleRecord: (record: Omit<BattleRecord, 'id' | 'timestamp'>) => void;
  getBattleRecords: () => BattleRecord[];
  resetVotes: () => void;
}

export const useVotingStore = create<VotingState>()(
  persist(
    (set, get) => ({
      votes: {},
      voteHistory: [],
      battleRecords: [],
      hasVotedToday: false,
      lastVoteDate: '',

      canVoteToday: () => {
        const today = getTodayString();
        return get().lastVoteDate !== today;
      },

      vote: (characterId: string) => {
        const state = get();
        const today = getTodayString();

        if (state.lastVoteDate === today) {
          return false;
        }

        set({
          votes: {
            ...state.votes,
            [characterId]: (state.votes[characterId] || 0) + 1,
          },
          voteHistory: [
            ...state.voteHistory,
            {
              characterId,
              date: today,
              timestamp: Date.now(),
            },
          ],
          hasVotedToday: true,
          lastVoteDate: today,
        });
        return true;
      },

      getVotes: (characterId: string) => {
        return get().votes[characterId] || 0;
      },

      getAllVotes: () => {
        return get().votes;
      },

      addBattleRecord: (record) => {
        const state = get();
        const newRecord: BattleRecord = {
          ...record,
          id: `battle-${Date.now()}`,
          timestamp: Date.now(),
        };
        set({
          battleRecords: [newRecord, ...state.battleRecords].slice(0, 100),
        });
      },

      getBattleRecords: () => {
        return get().battleRecords;
      },

      resetVotes: () => {
        set({
          votes: {},
          voteHistory: [],
          battleRecords: [],
          hasVotedToday: false,
          lastVoteDate: '',
        });
      },
    }),
    {
      name: 'anime-museum-voting',
    }
  )
);

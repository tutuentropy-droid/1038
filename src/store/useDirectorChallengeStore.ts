import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChallengeTemplate, Scene, MusicTrack } from '@/data/directorChallenge';
import { Character } from '@/types';

interface CompletedChallenge {
  challengeId: string;
  challengeTitle: string;
  score: number;
  maxScore: number;
  characterIds: string[];
  sceneId: string;
  musicId: string;
  completedAt: number;
  earnedPoints: number;
}

interface DirectorChallengeState {
  currentChallenge: ChallengeTemplate | null;
  selectedCharacters: string[];
  selectedScene: string | null;
  selectedMusic: string | null;
  completedChallenges: CompletedChallenge[];
  totalPoints: number;
  challengesCompleted: number;
  hasVisited: boolean;

  setCurrentChallenge: (challenge: ChallengeTemplate | null) => void;
  toggleCharacter: (characterId: string) => void;
  setSelectedScene: (sceneId: string | null) => void;
  setSelectedMusic: (musicId: string | null) => void;
  completeChallenge: (
    challenge: ChallengeTemplate,
    score: number,
    maxScore: number,
    characters: Character[],
    scene: Scene,
    music: MusicTrack
  ) => void;
  resetSelection: () => void;
  visit: () => void;
  getHighScore: (challengeId: string) => number;
  hasCompletedChallenge: (challengeId: string) => boolean;
}

export const useDirectorChallengeStore = create<DirectorChallengeState>()(
  persist(
    (set, get) => ({
      currentChallenge: null,
      selectedCharacters: [],
      selectedScene: null,
      selectedMusic: null,
      completedChallenges: [],
      totalPoints: 0,
      challengesCompleted: 0,
      hasVisited: false,

      setCurrentChallenge: (challenge) => {
        set({
          currentChallenge: challenge,
          selectedCharacters: [],
          selectedScene: null,
          selectedMusic: null,
        });
      },

      toggleCharacter: (characterId) => {
        const { selectedCharacters } = get();
        if (selectedCharacters.includes(characterId)) {
          set({
            selectedCharacters: selectedCharacters.filter((id) => id !== characterId),
          });
        } else {
          set({
            selectedCharacters: [...selectedCharacters, characterId],
          });
        }
      },

      setSelectedScene: (sceneId) => {
        set({ selectedScene: sceneId });
      },

      setSelectedMusic: (musicId) => {
        set({ selectedMusic: musicId });
      },

      completeChallenge: (challenge, score, maxScore, characters, scene, music) => {
        const { completedChallenges, totalPoints, challengesCompleted } = get();
        const earnedPoints = Math.round(challenge.basePoints * (score / maxScore));

        const completed: CompletedChallenge = {
          challengeId: challenge.id,
          challengeTitle: challenge.title,
          score,
          maxScore,
          characterIds: characters.map((c) => c.id),
          sceneId: scene.id,
          musicId: music.id,
          completedAt: Date.now(),
          earnedPoints,
        };

        set({
          completedChallenges: [...completedChallenges, completed],
          totalPoints: totalPoints + earnedPoints,
          challengesCompleted: challengesCompleted + 1,
        });
      },

      resetSelection: () => {
        set({
          selectedCharacters: [],
          selectedScene: null,
          selectedMusic: null,
        });
      },

      visit: () => {
        set({ hasVisited: true });
      },

      getHighScore: (challengeId) => {
        const { completedChallenges } = get();
        const challenges = completedChallenges.filter((c) => c.challengeId === challengeId);
        if (challenges.length === 0) return 0;
        return Math.max(...challenges.map((c) => c.score));
      },

      hasCompletedChallenge: (challengeId) => {
        const { completedChallenges } = get();
        return completedChallenges.some((c) => c.challengeId === challengeId);
      },
    }),
    {
      name: 'anime-museum-director-challenge',
    }
  )
);

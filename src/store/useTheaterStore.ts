import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRating, UserComment, RecommendedRoute, TheaterStats, UserPreference } from '@/types';
import { animes } from '@/data/animes';

interface TheaterState {
  ratings: UserRating[];
  comments: UserComment[];
  recommendedRoute: RecommendedRoute | null;
  attendedFestivals: string[];
  stats: TheaterStats;

  addRating: (animeId: string, festivalId: string, score: number) => void;
  getRating: (animeId: string, festivalId: string) => UserRating | undefined;
  getAverageRating: (animeId: string) => number;
  getRatingCount: (animeId: string) => number;

  addComment: (animeId: string, festivalId: string, content: string, score: number, author: string) => void;
  getComments: (animeId: string, festivalId: string) => UserComment[];
  deleteComment: (commentId: string) => void;

  getUserPreference: () => UserPreference;
  setRecommendedRoute: (route: RecommendedRoute) => void;
  attendFestival: (festivalId: string) => void;
  hasAttended: (festivalId: string) => boolean;
}

export const useTheaterStore = create<TheaterState>()(
  persist(
    (set, get) => ({
      ratings: [],
      comments: [],
      recommendedRoute: null,
      attendedFestivals: [],
      stats: {
        totalRatings: 0,
        totalComments: 0,
        festivalsAttended: [],
        averageRatingGiven: 0,
        topGenres: [],
      },

      addRating: (animeId, festivalId, score) => {
        set((state) => {
          const existing = state.ratings.findIndex(
            (r) => r.animeId === animeId && r.festivalId === festivalId
          );
          const newRating: UserRating = {
            animeId,
            festivalId,
            score,
            timestamp: Date.now(),
          };
          const newRatings =
            existing >= 0
              ? state.ratings.map((r, i) => (i === existing ? newRating : r))
              : [...state.ratings, newRating];

          const totalScore = newRatings.reduce((sum, r) => sum + r.score, 0);
          const avgRating = newRatings.length > 0 ? totalScore / newRatings.length : 0;

          const genreCount: Record<string, number> = {};
          newRatings.forEach((r) => {
            if (r.score >= 6) {
              const anime = animes.find((a) => a.id === r.animeId);
              if (anime) {
                anime.genres.forEach((g) => {
                  genreCount[g] = (genreCount[g] || 0) + (r.score - 5);
                });
              }
            }
          });
          const topGenres = Object.entries(genreCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([genre]) => genre);

          return {
            ratings: newRatings,
            stats: {
              ...state.stats,
              totalRatings: newRatings.length,
              averageRatingGiven: Math.round(avgRating * 10) / 10,
              topGenres,
            },
          };
        });
      },

      getRating: (animeId, festivalId) => {
        return get().ratings.find(
          (r) => r.animeId === animeId && r.festivalId === festivalId
        );
      },

      getAverageRating: (animeId) => {
        const animeRatings = get().ratings.filter((r) => r.animeId === animeId);
        if (animeRatings.length === 0) return 0;
        const total = animeRatings.reduce((sum, r) => sum + r.score, 0);
        return Math.round((total / animeRatings.length) * 10) / 10;
      },

      getRatingCount: (animeId) => {
        return get().ratings.filter((r) => r.animeId === animeId).length;
      },

      addComment: (animeId, festivalId, content, score, author) => {
        const newComment: UserComment = {
          id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          animeId,
          festivalId,
          content,
          score,
          timestamp: Date.now(),
          author,
        };
        set((state) => ({
          comments: [newComment, ...state.comments],
          stats: {
            ...state.stats,
            totalComments: state.comments.length + 1,
          },
        }));
      },

      getComments: (animeId, festivalId) => {
        return get()
          .comments.filter(
            (c) => c.animeId === animeId && c.festivalId === festivalId
          )
          .sort((a, b) => b.timestamp - a.timestamp);
      },

      deleteComment: (commentId) => {
        set((state) => ({
          comments: state.comments.filter((c) => c.id !== commentId),
          stats: {
            ...state.stats,
            totalComments: Math.max(0, state.comments.length - 1),
          },
        }));
      },

      getUserPreference: () => {
        const { ratings, comments } = get();

        const genreCount: Record<string, number> = {};
        const eraCount: Record<string, number> = {};
        const likedAnimeIds: string[] = [];

        ratings.forEach((r) => {
          if (r.score >= 6) {
            const anime = animes.find((a) => a.id === r.animeId);
            if (anime) {
              const weight = r.score - 5;
              anime.genres.forEach((g) => {
                genreCount[g] = (genreCount[g] || 0) + weight;
              });
              eraCount[anime.era] = (eraCount[anime.era] || 0) + weight;
              likedAnimeIds.push(r.animeId);
            }
          }
        });

        const favoriteGenres = Object.entries(genreCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([genre]) => genre);

        const favoriteEras = Object.entries(eraCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([era]) => era as '80s' | '90s' | '00s');

        const totalScore = ratings.reduce((sum, r) => sum + r.score, 0);
        const averageRating = ratings.length > 0 ? totalScore / ratings.length : 0;

        return {
          favoriteGenres,
          favoriteEras,
          averageRating: Math.round(averageRating * 10) / 10,
          ratedAnimeIds: likedAnimeIds,
          commentCount: comments.length,
        };
      },

      setRecommendedRoute: (route) => {
        set({ recommendedRoute: route });
      },

      attendFestival: (festivalId) => {
        set((state) => {
          if (state.attendedFestivals.includes(festivalId)) return state;
          const newAttended = [...state.attendedFestivals, festivalId];
          return {
            attendedFestivals: newAttended,
            stats: {
              ...state.stats,
              festivalsAttended: newAttended,
            },
          };
        });
      },

      hasAttended: (festivalId) => {
        return get().attendedFestivals.includes(festivalId);
      },
    }),
    {
      name: 'anime-museum-theater',
    }
  )
);

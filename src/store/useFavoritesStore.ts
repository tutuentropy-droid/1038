import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (id: string) => {
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites
            : [...state.favorites, id]
        }));
      },
      
      removeFavorite: (id: string) => {
        set((state) => ({
          favorites: state.favorites.filter((favId) => favId !== id)
        }));
      },
      
      isFavorite: (id: string) => {
        return get().favorites.includes(id);
      },
      
      toggleFavorite: (id: string) => {
        const isFav = get().isFavorite(id);
        if (isFav) {
          get().removeFavorite(id);
        } else {
          get().addFavorite(id);
        }
      },
      
      clearFavorites: () => {
        set({ favorites: [] });
      }
    }),
    {
      name: 'anime-museum-favorites',
    }
  )
);

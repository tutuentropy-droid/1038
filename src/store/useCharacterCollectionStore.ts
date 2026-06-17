import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CharacterCollectionState {
  collection: string[];

  addToCollection: (characterId: string) => void;
  removeFromCollection: (characterId: string) => void;
  isInCollection: (characterId: string) => boolean;
  toggleCollection: (characterId: string) => void;
  clearCollection: () => void;
  getCollectionCount: () => number;
}

export const useCharacterCollectionStore =
  create<CharacterCollectionState>()(
    persist(
      (set, get) => ({
        collection: [],

        addToCollection: (characterId: string) => {
          set((state) => ({
            collection: state.collection.includes(characterId)
              ? state.collection
              : [...state.collection, characterId],
          }));
        },

        removeFromCollection: (characterId: string) => {
          set((state) => ({
            collection: state.collection.filter((id) => id !== characterId),
          }));
        },

        isInCollection: (characterId: string) => {
          return get().collection.includes(characterId);
        },

        toggleCollection: (characterId: string) => {
          const isIn = get().isInCollection(characterId);
          if (isIn) {
            get().removeFromCollection(characterId);
          } else {
            get().addToCollection(characterId);
          }
        },

        clearCollection: () => {
          set({ collection: [] });
        },

        getCollectionCount: () => {
          return get().collection.length;
        },
      }),
      {
        name: 'anime-museum-character-collection',
      }
    )
  );

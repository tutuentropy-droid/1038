import { Character, CharacterWithVotes, Anime } from '@/types';
import { animes } from './animes';

export const getAllCharacters = (): Character[] => {
  const characters: Character[] = [];
  animes.forEach((anime) => {
    anime.characters.forEach((char) => {
      characters.push({
        ...char,
        animeId: anime.id,
        animeTitle: anime.title,
      });
    });
  });
  return characters;
};

export const getCharacterById = (id: string): Character | undefined => {
  return getAllCharacters().find((c) => c.id === id);
};

export const getCharactersByAnime = (animeId: string): Character[] => {
  return getAllCharacters().filter((c) => c.animeId === animeId);
};

export const getCharactersWithVotes = (
  votesMap: Record<string, number>
): CharacterWithVotes[] => {
  const characters = getAllCharacters();
  return characters
    .map((char) => ({
      ...char,
      votes: votesMap[char.id] || 0,
    }))
    .sort((a, b) => b.votes - a.votes)
    .map((char, index) => ({
      ...char,
      rank: index + 1,
    }));
};

export const getRandomCharacters = (count: number): Character[] => {
  const all = getAllCharacters();
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getRandomCharacterPair = (): [Character, Character] => {
  const all = getAllCharacters();
  if (all.length < 2) {
    return [all[0], all[0]];
  }
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
};

export const searchCharacters = (query: string): Character[] => {
  const lowerQuery = query.toLowerCase();
  return getAllCharacters().filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      (c.animeTitle && c.animeTitle.toLowerCase().includes(lowerQuery)) ||
      c.voiceActor.toLowerCase().includes(lowerQuery)
  );
};

export const getAnimeByCharacterId = (
  characterId: string
): Anime | undefined => {
  return animes.find((anime) =>
    anime.characters.some((c) => c.id === characterId)
  );
};

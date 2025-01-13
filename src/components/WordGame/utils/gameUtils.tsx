import { UNITS } from "../gameData";

export const scrambleWord = (word: string) => {
  return word
    .split("")
    .map((letter, index) => ({ letter: letter.toUpperCase(), position: index }))
    .sort(() => Math.random() - 0.5);
};

export const initializeAvailableWords = (
  unit: keyof typeof UNITS,
  setters: {
    setAvailableWords: (words: string[]) => void;
    setUsedWords: (words: Set<string>) => void;
    setCurrentWord: (word: string) => void;
    setScrambledLetters: (letters: Array<{ letter: string; position: number }>) => void;
    setSelectedLetters: (letters: string[]) => void;
    setSelectedPositions: (positions: number[]) => void;
  }
) => {
  const words = [...UNITS[unit].words];
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  
  setters.setAvailableWords(words);
  setters.setUsedWords(new Set());
  
  if (words.length > 0) {
    const firstWord = words[0];
    setters.setCurrentWord(firstWord);
    setters.setScrambledLetters(scrambleWord(firstWord));
    setters.setSelectedLetters([]);
    setters.setSelectedPositions([]);
    setters.setAvailableWords(words.slice(1));
    setters.setUsedWords(new Set([firstWord]));
  }
};
import { UNITS } from "../gameData";

export const scrambleWord = (word: string) => {
  // Create array of letter objects with random values
  const letters = word.split("")
    .map((letter, index) => ({ 
      letter: letter.toUpperCase(), 
      position: index,
      random: Math.random() 
    }));

  // Sort by random value to scramble
  let scrambledLetters = letters
    .sort((a, b) => a.random - b.random)
    .map((item, index) => ({
      letter: item.letter,
      position: index
    }));

  // Check if scrambled word matches original or is too similar
  const scrambledWord = scrambledLetters.map(l => l.letter).join("");
  const originalWord = word.toUpperCase();
  
  // If scrambled version is too similar to original, try again
  if (scrambledWord === originalWord || 
      countMatchingPositions(scrambledWord, originalWord) > word.length / 2) {
    return scrambleWord(word);
  }

  return scrambledLetters;
};

// Helper function to count matching letter positions
const countMatchingPositions = (word1: string, word2: string) => {
  let matches = 0;
  for (let i = 0; i < word1.length; i++) {
    if (word1[i] === word2[i]) matches++;
  }
  return matches;
};

export const initializeAvailableWords = (
  currentUnit: keyof typeof UNITS,
  {
    setAvailableWords,
    setUsedWords,
    setCurrentWord,
    setScrambledLetters,
    setSelectedLetters,
    setSelectedPositions,
  }: {
    setAvailableWords: (words: string[]) => void;
    setUsedWords: (words: Set<string>) => void;
    setCurrentWord: (word: string) => void;
    setScrambledLetters: (letters: Array<{ letter: string; position: number }>) => void;
    setSelectedLetters: (letters: string[]) => void;
    setSelectedPositions: (positions: number[]) => void;
  }
) => {
  const words = UNITS[currentUnit].words;
  setAvailableWords(words);
  setUsedWords(new Set());

  // Initialize first word
  if (words.length > 0) {
    const firstWord = words[0];
    setCurrentWord(firstWord);
    setScrambledLetters(scrambleWord(firstWord));
    setSelectedLetters([]);
    setSelectedPositions([]);
    setAvailableWords(words.slice(1));
    setUsedWords(new Set([firstWord]));
  }
};
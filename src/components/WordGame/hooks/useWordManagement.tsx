import { useEffect } from "react";
import { UNITS } from "../gameData";
import { initializeAvailableWords } from "../utils/gameUtils";

interface UseWordManagementProps {
  currentUnit: keyof typeof UNITS;
  availableWords: string[];
  setAvailableWords: (words: string[]) => void;
  setUsedWords: (words: Set<string>) => void;
  setCurrentWord: (word: string) => void;
  setScrambledLetters: (letters: Array<{ letter: string; position: number }>) => void;
  setSelectedLetters: (letters: string[]) => void;
  setSelectedPositions: (positions: number[]) => void;
  setWordsCompletedInUnit: (value: number) => void;
  moveToNextUnit: () => void;
}

export const useWordManagement = ({
  currentUnit,
  availableWords,
  setAvailableWords,
  setUsedWords,
  setCurrentWord,
  setScrambledLetters,
  setSelectedLetters,
  setSelectedPositions,
  setWordsCompletedInUnit,
  moveToNextUnit,
}: UseWordManagementProps) => {
  const startNewRound = () => {
    if (availableWords.length === 0) {
      moveToNextUnit();
      return;
    }

    const word = availableWords[0];
    const remainingWords = availableWords.slice(1);
    setAvailableWords(remainingWords);
    setCurrentWord(word);
    
    const scrambledLetters = word.split("").map((letter, index) => ({
      letter: letter.toUpperCase(),
      position: index,
    }));
    setScrambledLetters(scrambledLetters);
    
    setSelectedLetters([]);
    setSelectedPositions([]);
    
    // Create a new Set with the current word added
    const newUsedWords = new Set([...Array.from(availableWords), word]);
    setUsedWords(newUsedWords);
  };

  useEffect(() => {
    initializeAvailableWords(currentUnit, {
      setAvailableWords,
      setUsedWords,
      setCurrentWord,
      setScrambledLetters,
      setSelectedLetters,
      setSelectedPositions,
    });
  }, [currentUnit]);

  useEffect(() => {
    if (availableWords.length > 0) {
      startNewRound();
    }
  }, []);

  return { startNewRound };
};
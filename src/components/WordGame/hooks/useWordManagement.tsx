import { useEffect } from "react";
import { toast } from "sonner";
import { UNITS, successSound } from "../gameData";
import { initializeAvailableWords } from "../utils/gameUtils";

interface UseWordManagementProps {
  currentUnit: keyof typeof UNITS;
  availableWords: string[];
  setAvailableWords: (words: string[]) => void;
  setUsedWords: (fn: (prev: Set<string>) => Set<string>) => void;
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
    setAvailableWords((prev) => prev.slice(1));
    setCurrentWord(word);
    setScrambledLetters((letters) =>
      word.split("").map((letter, index) => ({
        letter: letter.toUpperCase(),
        position: index,
      }))
    );
    setSelectedLetters([]);
    setSelectedPositions([]);
    setUsedWords((prev) => new Set([...prev, word]));
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
    if (availableWords.length > 0 && !currentWord) {
      startNewRound();
    }
  }, [availableWords]);

  return { startNewRound };
};
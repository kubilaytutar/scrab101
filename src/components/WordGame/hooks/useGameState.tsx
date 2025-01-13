import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UNITS, successSound } from "../gameData";

export const useGameState = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledLetters, setScrambledLetters] = useState<Array<{ letter: string; position: number }>>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isExtendedTime, setIsExtendedTime] = useState(false);
  const [currentUnit, setCurrentUnit] = useState<keyof typeof UNITS>("unit1");
  const [wordsCompletedInUnit, setWordsCompletedInUnit] = useState(0);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [jokerCount, setJokerCount] = useState(2);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [usedJokers, setUsedJokers] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  return {
    currentWord,
    setCurrentWord,
    scrambledLetters,
    setScrambledLetters,
    selectedLetters,
    setSelectedLetters,
    selectedPositions,
    setSelectedPositions,
    score,
    setScore,
    timeLeft,
    setTimeLeft,
    isExtendedTime,
    setIsExtendedTime,
    currentUnit,
    setCurrentUnit,
    wordsCompletedInUnit,
    setWordsCompletedInUnit,
    usedWords,
    setUsedWords,
    availableWords,
    setAvailableWords,
    jokerCount,
    setJokerCount,
    wrongAttempts,
    setWrongAttempts,
    usedJokers,
    setUsedJokers,
    isGameOver,
    setIsGameOver,
  };
};
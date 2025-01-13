import { useEffect, useState } from "react";
import { toast } from "sonner";
import GameStats from "./GameStats";
import GameOver from "./GameOver";
import UnitSelector from "./UnitSelector";
import WordDisplay from "./WordDisplay";
import GameHeader from "./GameHeader";
import GameControls from "./GameControls";
import LettersDisplay from "./LettersDisplay";
import { UNITS, successSound, tickSound } from "./gameData";
import { useGameState } from "./hooks/useGameState";
import { useGameTimer } from "./hooks/useGameTimer";
import { useWordManagement } from "./hooks/useWordManagement";
import { initializeAvailableWords } from "./utils/gameUtils";

const GameBoard = () => {
  const gameState = useGameState();
  const {
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
  } = gameState;

  const [hasBonusTimeForCurrentWord, setHasBonusTimeForCurrentWord] = useState(false);
  const [recentSuccesses, setRecentSuccesses] = useState<number[]>([]);

  useGameTimer({
    timeLeft,
    setTimeLeft,
    isGameOver,
    setIsGameOver,
  });

  const moveToNextUnit = () => {
    const unitKeys = Object.keys(UNITS) as (keyof typeof UNITS)[];
    const currentIndex = unitKeys.indexOf(currentUnit);
    if (currentIndex < unitKeys.length - 1) {
      const nextUnit = unitKeys[currentIndex + 1];
      setCurrentUnit(nextUnit);
      setWordsCompletedInUnit(0);
      initializeAvailableWords(nextUnit, {
        setAvailableWords,
        setUsedWords,
        setCurrentWord,
        setScrambledLetters,
        setSelectedLetters,
        setSelectedPositions,
      });
      toast.success(`Moving to new unit: ${UNITS[nextUnit].name}!`);
    } else {
      toast.success("Congratulations! You've completed all units!");
    }
  };

  const { startNewRound } = useWordManagement({
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
  });

  const useJoker = () => {
    if (jokerCount > 0 && currentWord) {
      const nextLetter = currentWord[selectedLetters.length];
      if (nextLetter) {
        const position = scrambledLetters.findIndex(
          (l) => l.letter === nextLetter && !selectedPositions.includes(l.position)
        );
        if (position !== -1) {
          handleLetterClick(nextLetter, scrambledLetters[position].position);
          setJokerCount((prev) => prev - 1);
          setUsedJokers((prev) => prev + 1);
          setTimeLeft((prev) => Math.max(0, prev - 10));
          toast.info("Joker used! -10 seconds");
        }
      }
    } else if (jokerCount === 0) {
      toast.error("No jokers left!");
    }
  };

  const handleUnitSelect = (unit: keyof typeof UNITS) => {
    setCurrentUnit(unit);
    setWordsCompletedInUnit(0);
    setScore(0);
    setTimeLeft(isExtendedTime ? 120 : 60);
    setWrongAttempts(0);
    setUsedJokers(0);
    setIsGameOver(false);
    setJokerCount(2);
    setSelectedLetters([]);
    setSelectedPositions([]);
    initializeAvailableWords(unit, {
      setAvailableWords,
      setUsedWords,
      setCurrentWord,
      setScrambledLetters,
      setSelectedLetters,
      setSelectedPositions,
    });
    toast.success(`Switched to unit: ${UNITS[unit].name}`);
  };

  const handleTimeToggle = (checked: boolean) => {
    setIsExtendedTime(checked);
    setTimeLeft(checked ? 120 : 60);
    toast.success(`Game time set to ${checked ? '120' : '60'} seconds`);
  };

  const handleLetterClick = (letter: string, position: number) => {
    if (selectedPositions.includes(position)) return;
    
    const newSelected = [...selectedLetters, letter];
    const newPositions = [...selectedPositions, position];
    setSelectedLetters(newSelected);
    setSelectedPositions(newPositions);

    const attemptedWord = newSelected.join("");
    if (attemptedWord.length === currentWord.length) {
      if (attemptedWord === currentWord) {
        successSound.play().catch(console.error);
        toast.success("Correct!");
        setScore((prev) => prev + 10);
        setHasBonusTimeForCurrentWord(false); // Reset for next word
        
        const newWordsCompleted = wordsCompletedInUnit + 1;
        if (newWordsCompleted >= UNITS[currentUnit].words.length) {
          moveToNextUnit();
        } else {
          setWordsCompletedInUnit(newWordsCompleted);
          setTimeout(startNewRound, 1000);
        }
      } else {
        toast.error("Try again!");
        setWrongAttempts((prev) => prev + 1);
        setTimeout(() => {
          setSelectedLetters([]);
          setSelectedPositions([]);
        }, 1000);
      }
    } else {
      const now = Date.now();
      if (letter === currentWord[newSelected.length - 1]) {
        const newRecentSuccesses = [...recentSuccesses, now].filter(
          time => now - time <= 3000 // Changed from 5000 to 3000 ms (3 seconds)
        );
        setRecentSuccesses(newRecentSuccesses);
        
        // Check if we have 3 successes within 3 seconds and haven't given bonus time for this word
        if (newRecentSuccesses.length >= 3 && !hasBonusTimeForCurrentWord) {
          tickSound.pause(); // Stop the tick sound when bonus time is earned
          setTimeLeft(prev => prev + 5); // Changed from 10 to 5 seconds
          setRecentSuccesses([]); // Reset successes after adding bonus time
          setHasBonusTimeForCurrentWord(true); // Mark that we've given bonus time for this word
          toast.success("Bonus time! +5 seconds", { // Updated message
            style: { background: '#22c55e', color: 'white' }
          });
        }
      }
    }
  };

  const handleTryAgain = () => {
    setScore(0);
    setTimeLeft(isExtendedTime ? 120 : 60);
    setJokerCount(2);
    setWordsCompletedInUnit(0);
    setWrongAttempts(0);
    setUsedJokers(0);
    setIsGameOver(false);
    initializeAvailableWords(currentUnit, {
      setAvailableWords,
      setUsedWords,
      setCurrentWord,
      setScrambledLetters,
      setSelectedLetters,
      setSelectedPositions,
    });
    toast.success("Game restarted! Good luck!");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {isGameOver ? (
        <GameOver
          score={score}
          wordsCompletedInUnit={wordsCompletedInUnit}
          wrongAttempts={wrongAttempts}
          usedJokers={usedJokers}
          onTryAgain={handleTryAgain}
          currentUnit={currentUnit}
          onUnitSelect={handleUnitSelect}
        />
      ) : (
        <>
          <GameHeader currentUnit={currentUnit} />
          <GameStats
            score={score}
            timeLeft={timeLeft}
            wordsCompletedInUnit={wordsCompletedInUnit}
            totalWordsInUnit={UNITS[currentUnit].words.length}
            jokerCount={jokerCount}
          />
          <GameControls
            isExtendedTime={isExtendedTime}
            onTimeToggle={handleTimeToggle}
            jokerCount={jokerCount}
            onUseJoker={useJoker}
            onTryAgain={handleTryAgain}
            showTryAgain={timeLeft === 0}
          />
          <WordDisplay currentWord={currentWord} selectedLetters={selectedLetters} />
          <LettersDisplay
            scrambledLetters={scrambledLetters}
            selectedPositions={selectedPositions}
            onLetterClick={handleLetterClick}
          />
          <UnitSelector currentUnit={currentUnit} onUnitSelect={handleUnitSelect} />
        </>
      )}
    </div>
  );
};

export default GameBoard;

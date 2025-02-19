import { useEffect, useState } from "react";
import { toast } from "sonner";
import GameStats from "./GameStats";
import GameOver from "./GameOver";
import UnitSelector from "./UnitSelector";
import WordDisplay from "./WordDisplay";
import GameHeader from "./GameHeader";
import GameControls from "./GameControls";
import LettersDisplay from "./LettersDisplay";
import { UNITS, successSound, tickSound, wrongSound } from "./gameData";
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
  const [attemptedWords, setAttemptedWords] = useState<string[]>([]);
  const [bonusCount, setBonusCount] = useState(0);

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
      // Use Set to ensure uniqueness when adding the current word
      setAttemptedWords(prev => Array.from(new Set([...prev, currentWord])));
      
      if (attemptedWord === currentWord) {
        successSound.play().catch(console.error);
        toast.success("Correct!");
        setScore((prev) => prev + 10);
        setHasBonusTimeForCurrentWord(false);
        
        const newWordsCompleted = wordsCompletedInUnit + 1;
        if (newWordsCompleted >= UNITS[currentUnit].words.length) {
          moveToNextUnit();
        } else {
          setWordsCompletedInUnit(newWordsCompleted);
          setTimeout(startNewRound, 1000);
        }
      } else {
        wrongSound.play().catch(console.error);
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
          time => now - time <= 3000
        );
        setRecentSuccesses(newRecentSuccesses);
        
        if (newRecentSuccesses.length >= 3 && !hasBonusTimeForCurrentWord) {
          const bonusSeconds = 5;
          tickSound.pause();
          tickSound.currentTime = 0;
          setTimeLeft(prev => prev + bonusSeconds);
          setRecentSuccesses([]);
          setHasBonusTimeForCurrentWord(true);
          setBonusCount(prev => prev + 1);
          toast.success(`Bonus time! +${bonusSeconds} seconds`, {
            style: { background: '#22c55e', color: 'white' }
          });
          
          setTimeout(() => {
            if (timeLeft <= 13) {
              tickSound.play().catch(console.error);
            }
          }, 1000);
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
    setAttemptedWords([]);
    setBonusCount(0);
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
          attemptedWords={attemptedWords}
          bonusCount={bonusCount}
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

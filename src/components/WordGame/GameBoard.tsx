import { useEffect } from "react";
import { toast } from "sonner";
import GameStats from "./GameStats";
import GameOver from "./GameOver";
import UnitSelector from "./UnitSelector";
import WordDisplay from "./WordDisplay";
import GameHeader from "./GameHeader";
import GameControls from "./GameControls";
import LettersDisplay from "./LettersDisplay";
import { UNITS, successSound, tickSound, gameOverSound } from "./gameData";
import { useGameState } from "./hooks/useGameState";
import { initializeAvailableWords, scrambleWord } from "./utils/gameUtils";

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

  const startNewRound = () => {
    if (availableWords.length === 0) {
      moveToNextUnit();
      return;
    }

    const word = availableWords[0];
    setAvailableWords(prev => prev.slice(1));
    setCurrentWord(word);
    setScrambledLetters(scrambleWord(word));
    setSelectedLetters([]);
    setSelectedPositions([]);
    setUsedWords(prev => new Set([...prev, word]));
  };

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

  useEffect(() => {
    let hasPlayedTickSound = false;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 && !isGameOver) {
          clearInterval(timer);
          setIsGameOver(true);
          // Add 1 second delay before playing game over sound
          setTimeout(() => {
            gameOverSound.play().catch(console.error);
          }, 1000);
          return 0;
        }
        if (prev <= 13 && prev > 0 && !isGameOver && !hasPlayedTickSound) {
          tickSound.play().catch(console.error);
          hasPlayedTickSound = true;
        }
        if (isGameOver) {
          clearInterval(timer);
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentUnit, isGameOver]);

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
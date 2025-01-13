import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Letter } from "./Letter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import GameStats from "./GameStats";
import GameOver from "./GameOver";
import UnitSelector from "./UnitSelector";
import WordDisplay from "./WordDisplay";
import { UNITS, successSound } from "./gameData";

const GameBoard = () => {
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

  const scrambleWord = (word: string) => {
    return word
      .split("")
      .map((letter, index) => ({ letter: letter.toUpperCase(), position: index }))
      .sort(() => Math.random() - 0.5);
  };

  const initializeAvailableWords = (unit: keyof typeof UNITS) => {
    const words = [...UNITS[unit].words];
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }
    setAvailableWords(words);
    setUsedWords(new Set());
  };

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
      initializeAvailableWords(nextUnit);
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
    initializeAvailableWords(unit);
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
    initializeAvailableWords(currentUnit);
    toast.success("Game restarted! Good luck!");
  };

  useEffect(() => {
    initializeAvailableWords(currentUnit);
  }, [currentUnit]);

  useEffect(() => {
    if (availableWords.length > 0 && !currentWord) {
      startNewRound();
    }
  }, [availableWords]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          return 0;
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
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-800 mb-4"
            >
              Unscramble
            </motion.div>
            <div className="text-xl font-semibold text-gray-600 mb-4">
              Unit: {UNITS[currentUnit].name}
            </div>
            <GameStats
              score={score}
              timeLeft={timeLeft}
              wordsCompletedInUnit={wordsCompletedInUnit}
              totalWordsInUnit={UNITS[currentUnit].words.length}
              jokerCount={jokerCount}
            />
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-sm text-gray-600">60s</span>
              <Switch
                checked={isExtendedTime}
                onCheckedChange={handleTimeToggle}
              />
              <span className="text-sm text-gray-600">120s</span>
            </div>
            <Button
              onClick={useJoker}
              disabled={jokerCount === 0}
              variant="outline"
              className="mt-4"
            >
              Use Joker (-10s)
            </Button>
            {timeLeft === 0 && (
              <Button
                onClick={handleTryAgain}
                variant="default"
                className="mt-4 ml-2"
              >
                Try Again
              </Button>
            )}
          </div>

          <motion.div
            layout
            className="bg-gray-50 rounded-xl p-8 shadow-lg mb-8"
          >
            <WordDisplay currentWord={currentWord} selectedLetters={selectedLetters} />

            <div className="flex flex-wrap justify-center gap-3">
              <AnimatePresence>
                {scrambledLetters.map(({ letter, position }, index) => (
                  <motion.div
                    key={`${position}-${index}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Letter
                      letter={letter}
                      onClick={() => handleLetterClick(letter, position)}
                      isSelected={selectedPositions.includes(position)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          <UnitSelector currentUnit={currentUnit} onUnitSelect={handleUnitSelect} />
        </>
      )}
    </div>
  );
};

export default GameBoard;
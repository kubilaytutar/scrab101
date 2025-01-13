import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Letter } from "./Letter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const UNITS = {
  unit1: {
    name: "School Life",
    words: ["ENGLAND", "SCOTLAND", "IRELAND", "USA", "CANADA", "AUSTRALIA", "ITALY", "FRANCE", "GERMANY", "SPAIN", "RUSSIA", "INDIA", "JAPAN", "CHINA", "MEXICO", "KOREA", "ARGENTINA", "POLAND", "FINLAND", "TURKEY"]
  },
  unit2: {
    name: "Classroom Life",
    words: ["WAKE", "SHOWER", "DRESS", "STUDY", "LEARN", "READ", "WRITE", "PLAN", "NOTES", "REPEAT", "SLOWLY", "QUICKLY", "CAREFULLY", "NEATLY", "ALWAYS", "OFTEN", "SOMETIMES", "RARELY", "NEVER", "PARTICIPATE"]
  },
  unit3: {
    name: "Personal Life",
    words: ["PLUMP", "SLIM", "TALL", "SHORT", "BLOND", "WAVY", "CURLY", "STRAIGHT", "YOUNG", "OLD", "SMART", "CLEVER", "FUNNY", "CALM", "BRAVE", "HONEST", "GENTLE", "KIND", "POLITE", "FRIENDLY"]
  },
  unit4: {
    name: "Family Life",
    words: ["CLERK", "GUARD", "LAWYER", "DOCTOR", "ARCHITECT", "JOURNALIST", "PROGRAMMER", "SCIENTIST", "PHOTOGRAPHER", "ACCOUNTANT", "PSYCHOLOGIST", "MARKETER", "ASSISTANT", "CREATOR", "COUSIN", "NEPHEW", "NIECE", "FATHER", "MOTHER", "RELATIVE"]
  },
  unit5: {
    name: "Life in the House",
    words: ["HOUSE", "FLAT", "VILLA", "COTTAGE", "BEDROOM", "KITCHEN", "BATHROOM", "GARAGE", "SOFA", "TABLE", "CHAIR", "WARDROBE", "FRIDGE", "OVEN", "BATH", "CURTAIN", "CARPET", "PILLOW", "CLEAN", "RELAX"]
  },
  unit6: {
    name: "Life in the City",
    words: ["CUISINE", "FOOD", "CREAM", "SALMON", "BEEF", "RICE", "SPINACH", "PIZZA", "KEBAB", "NOODLES", "CURRY", "TACOS", "BURGER", "PASTA", "SOUP", "SPICY", "SALTY", "SWEET", "SOUR", "BITTER"]
  },
  unit7: {
    name: "Life in Nature",
    words: ["BEAR", "TURTLE", "ELEPHANT", "TIGER", "WHALE", "SHARK", "PENGUIN", "PANDA", "DOLPHIN", "JUNGLE", "OCEAN", "DESERT", "FOREST", "SURVIVE", "PROTECT", "DONATE", "BREED", "HUNT", "HIDE", "EXPLORE"]
  },
  unit8: {
    name: "Life in Future",
    words: ["COMEDY", "ACTION", "CARTOON", "ROMANCE", "ADVENTURE", "HORROR", "MYSTERY", "MUSICAL", "ROBOT", "ALIEN", "SPACE", "FUTURE", "DISCOVER", "INVENT", "DESIGN", "BUILD", "ADAPT", "VIRTUAL", "DIGITAL", "CONTROL"]
  }
};

const GameBoard = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isExtendedTime, setIsExtendedTime] = useState(false);
  const [currentUnit, setCurrentUnit] = useState<keyof typeof UNITS>("unit1");
  const [wordsCompletedInUnit, setWordsCompletedInUnit] = useState(0);

  const scrambleWord = (word: string) => {
    return word
      .split("")
      .sort(() => Math.random() - 0.5)
      .map((letter) => letter.toUpperCase());
  };

  const startNewRound = () => {
    const currentUnitWords = UNITS[currentUnit].words;
    const word = currentUnitWords[wordsCompletedInUnit];
    setCurrentWord(word);
    setScrambledLetters(scrambleWord(word));
    setSelectedLetters([]);
  };

  const moveToNextUnit = () => {
    const unitKeys = Object.keys(UNITS) as (keyof typeof UNITS)[];
    const currentIndex = unitKeys.indexOf(currentUnit);
    if (currentIndex < unitKeys.length - 1) {
      const nextUnit = unitKeys[currentIndex + 1];
      setCurrentUnit(nextUnit);
      setWordsCompletedInUnit(0);
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
    toast.success(`Switched to unit: ${UNITS[unit].name}`);
  };

  const handleTimeToggle = (checked: boolean) => {
    setIsExtendedTime(checked);
    setTimeLeft(checked ? 120 : 60);
    toast.success(`Game time set to ${checked ? '120' : '60'} seconds`);
  };

  useEffect(() => {
    startNewRound();
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast("Game Over! Final score: " + score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentUnit]);

  const handleLetterClick = (letter: string, index: number) => {
    const newSelected = [...selectedLetters, letter];
    setSelectedLetters(newSelected);

    const attemptedWord = newSelected.join("");
    if (attemptedWord.length === currentWord.length) {
      if (attemptedWord === currentWord) {
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
        setTimeout(() => setSelectedLetters([]), 1000);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-800 mb-4"
        >
          Word Scramble
        </motion.div>
        <div className="text-xl font-semibold text-gray-600 mb-4">
          Unit: {UNITS[currentUnit].name}
        </div>
        <div className="flex justify-center gap-4 text-lg">
          <div className="bg-white rounded-lg px-4 py-2 shadow-md">
            Score: {score}
          </div>
          <div className="bg-white rounded-lg px-4 py-2 shadow-md">
            Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <div className="bg-white rounded-lg px-4 py-2 shadow-md">
            Progress: {wordsCompletedInUnit}/{UNITS[currentUnit].words.length}
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="text-sm text-gray-600">60s</span>
          <Switch
            checked={isExtendedTime}
            onCheckedChange={handleTimeToggle}
          />
          <span className="text-sm text-gray-600">120s</span>
        </div>
      </div>

      <motion.div
        layout
        className="bg-gray-50 rounded-xl p-8 shadow-lg mb-8"
      >
        <div className="text-center mb-8">
          <div className="text-gray-500 mb-2">Your answer:</div>
          <div className="flex justify-center gap-2">
            {currentWord.split("").map((_, i) => (
              <div
                key={i}
                className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center text-xl font-semibold"
              >
                {selectedLetters[i] || ""}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <AnimatePresence>
            {scrambledLetters.map((letter, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ delay: index * 0.1 }}
              >
                <Letter
                  letter={letter}
                  onClick={() => handleLetterClick(letter, index)}
                  isSelected={selectedLetters.includes(letter)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Select a Unit</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(Object.keys(UNITS) as (keyof typeof UNITS)[]).map((unit) => (
            <Button
              key={unit}
              onClick={() => handleUnitSelect(unit)}
              variant={currentUnit === unit ? "default" : "outline"}
              className="w-full"
            >
              {UNITS[unit].name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
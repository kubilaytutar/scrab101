import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Letter } from "./Letter";
import { toast } from "sonner";

const WORDS = [
  "REACT",
  "TYPESCRIPT",
  "JAVASCRIPT",
  "PROGRAMMING",
  "DEVELOPER",
  "CODE",
  "WEB",
  "DESIGN",
  "COMPUTER",
  "SOFTWARE",
  "INTERFACE",
  "DATABASE",
  "FRONTEND",
  "BACKEND",
  "TESTING"
];

export const GameBoard = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const scrambleWord = (word: string) => {
    return word
      .split("")
      .sort(() => Math.random() - 0.5)
      .map((letter) => letter.toUpperCase());
  };

  const startNewRound = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(word);
    setScrambledLetters(scrambleWord(word));
    setSelectedLetters([]);
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
  }, []);

  const handleLetterClick = (letter: string, index: number) => {
    const newSelected = [...selectedLetters, letter];
    setSelectedLetters(newSelected);

    const attemptedWord = newSelected.join("");
    if (attemptedWord.length === currentWord.length) {
      if (attemptedWord === currentWord) {
        toast.success("Correct!");
        setScore((prev) => prev + 10);
        setTimeout(startNewRound, 1000);
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
        <div className="flex justify-center gap-4 text-lg">
          <div className="bg-white rounded-lg px-4 py-2 shadow-md">
            Score: {score}
          </div>
          <div className="bg-white rounded-lg px-4 py-2 shadow-md">
            Time: {timeLeft}s
          </div>
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
    </div>
  );
};
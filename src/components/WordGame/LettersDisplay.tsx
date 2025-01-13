import { motion, AnimatePresence } from "framer-motion";
import { Letter } from "./Letter";

interface LettersDisplayProps {
  scrambledLetters: Array<{ letter: string; position: number }>;
  selectedPositions: number[];
  onLetterClick: (letter: string, position: number) => void;
}

const LettersDisplay = ({
  scrambledLetters,
  selectedPositions,
  onLetterClick,
}: LettersDisplayProps) => {
  return (
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
              onClick={() => onLetterClick(letter, position)}
              isSelected={selectedPositions.includes(position)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default LettersDisplay;
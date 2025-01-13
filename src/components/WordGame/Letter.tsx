import { motion } from "framer-motion";
import { clickSound } from "./gameData";

interface LetterProps {
  letter: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export const Letter = ({ letter, onClick, isSelected }: LetterProps) => {
  const handleClick = () => {
    if (!isSelected && onClick) {
      // Play sound only on user interaction
      const playPromise = clickSound.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error playing sound:", error);
        });
      }
      onClick();
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`w-12 h-12 rounded-lg text-xl font-semibold flex items-center justify-center transition-colors
        ${
          isSelected
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white shadow-md hover:bg-gray-50 text-gray-800"
        }`}
      onClick={handleClick}
      disabled={isSelected}
    >
      {letter}
    </motion.button>
  );
};
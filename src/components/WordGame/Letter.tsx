import { motion } from "framer-motion";

interface LetterProps {
  letter: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export const Letter = ({ letter, onClick, isSelected }: LetterProps) => {
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
      onClick={onClick}
      disabled={isSelected}
    >
      {letter}
    </motion.button>
  );
};
import { motion } from "framer-motion";
import { UNITS } from "./gameData";

interface GameHeaderProps {
  currentUnit: keyof typeof UNITS;
}

const GameHeader = ({ currentUnit }: GameHeaderProps) => {
  return (
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
    </div>
  );
};

export default GameHeader;
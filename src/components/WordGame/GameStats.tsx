import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface GameStatsProps {
  score: number;
  timeLeft: number;
  wordsCompletedInUnit: number;
  totalWordsInUnit: number;
  jokerCount: number;
}

const GameStats = ({ score, timeLeft, wordsCompletedInUnit, totalWordsInUnit, jokerCount }: GameStatsProps) => {
  const [isTimeAdded, setIsTimeAdded] = useState(false);
  const isLastTenSeconds = timeLeft <= 10;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Track timeLeft changes to show green animation
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleTimeChange = () => {
      setIsTimeAdded(true);
      timeoutId = setTimeout(() => {
        setIsTimeAdded(false);
      }, 1000);
    };

    handleTimeChange();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeLeft]);

  return (
    <div className="flex justify-center gap-4 text-lg">
      <div className="bg-white rounded-lg px-4 py-2 shadow-md">
        Score: {score}
      </div>
      <motion.div 
        className={`bg-white rounded-lg px-4 py-2 shadow-md ${
          isLastTenSeconds ? 'text-[#ea384c] font-bold animate-pulse' : 
          isTimeAdded ? 'text-green-500 font-bold' : ''
        }`}
        animate={{
          backgroundColor: isTimeAdded ? '#22c55e' : 'white',
          color: isTimeAdded ? 'white' : isLastTenSeconds ? '#ea384c' : 'black'
        }}
        transition={{ duration: 0.5 }}
      >
        Time: {formattedTime}
      </motion.div>
      <div className="bg-white rounded-lg px-4 py-2 shadow-md">
        Progress: {wordsCompletedInUnit}/{totalWordsInUnit}
      </div>
      <div className="bg-white rounded-lg px-4 py-2 shadow-md">
        Joker: {jokerCount}
      </div>
    </div>
  );
};

export default GameStats;
import { motion } from "framer-motion";

interface GameStatsProps {
  score: number;
  timeLeft: number;
  wordsCompletedInUnit: number;
  totalWordsInUnit: number;
  jokerCount: number;
}

const GameStats = ({ score, timeLeft, wordsCompletedInUnit, totalWordsInUnit, jokerCount }: GameStatsProps) => {
  const isLastTenSeconds = timeLeft <= 10;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="flex justify-center gap-4 text-lg">
      <div className="bg-white rounded-lg px-4 py-2 shadow-md">
        Score: {score}
      </div>
      <div className={`bg-white rounded-lg px-4 py-2 shadow-md ${isLastTenSeconds ? 'text-[#ea384c] font-bold animate-pulse' : ''}`}>
        Time: {formattedTime}
      </div>
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
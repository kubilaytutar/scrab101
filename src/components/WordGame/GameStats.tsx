import { motion } from "framer-motion";

interface GameStatsProps {
  score: number;
  timeLeft: number;
  wordsCompletedInUnit: number;
  totalWordsInUnit: number;
  jokerCount: number;
}

const GameStats = ({ score, timeLeft, wordsCompletedInUnit, totalWordsInUnit, jokerCount }: GameStatsProps) => (
  <div className="flex justify-center gap-4 text-lg">
    <div className="bg-white rounded-lg px-4 py-2 shadow-md">
      Score: {score}
    </div>
    <div className="bg-white rounded-lg px-4 py-2 shadow-md">
      Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
    </div>
    <div className="bg-white rounded-lg px-4 py-2 shadow-md">
      Progress: {wordsCompletedInUnit}/{totalWordsInUnit}
    </div>
    <div className="bg-white rounded-lg px-4 py-2 shadow-md">
      Joker: {jokerCount}
    </div>
  </div>
);

export default GameStats;
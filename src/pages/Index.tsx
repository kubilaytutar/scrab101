import GameBoard from "@/components/WordGame/GameBoard";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

const Index = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 py-12 relative">
      <GameBoard />
      <div className="fixed bottom-4 right-4">
        <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
          <TooltipTrigger asChild>
            <button 
              onClick={() => setIsTooltipOpen(!isTooltipOpen)}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Info className="w-6 h-6 text-gray-600" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm p-4 bg-white border shadow-lg" side="top">
            <div className="space-y-2 text-sm">
              <h3 className="font-semibold">Game Rules</h3>
              <ul className="list-disc pl-4 space-y-1">
                <li>Form words by selecting letters in the correct order.</li>
                <li>Each correct word gives you 10 points.</li>
                <li>You have 2 jokers available to help with difficult words.</li>
                <li>Using a joker costs 10 seconds from your timer.</li>
                <li>Quick correct selections (3 in a row) earn 5 bonus seconds.</li>
                <li>Complete all words in a unit to advance to the next one.</li>
                <li>Game ends when the timer reaches zero.</li>
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default Index;
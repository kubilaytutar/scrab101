import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UNITS } from "./gameData";
import UnitSelector from "./UnitSelector";

interface GameOverProps {
  score: number;
  wordsCompletedInUnit: number;
  wrongAttempts: number;
  usedJokers: number;
  onTryAgain: () => void;
  currentUnit: keyof typeof UNITS;
  onUnitSelect: (unit: keyof typeof UNITS) => void;
  completedWords: string[];
}

const GameOver = ({ 
  score, 
  wordsCompletedInUnit, 
  wrongAttempts, 
  usedJokers, 
  onTryAgain,
  currentUnit,
  onUnitSelect,
  completedWords
}: GameOverProps) => (
  <Card className="w-full p-6">
    <CardHeader>
      <CardTitle className="text-center text-2xl">Congratulations! 🎉</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-gray-600">You showed an amazing performance!</p>
      </div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600">Score</p>
          <p className="text-2xl font-bold">{score}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600">Words Completed</p>
          <p className="text-2xl font-bold">{wordsCompletedInUnit}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600">Wrong Attempts</p>
          <p className="text-2xl font-bold">{wrongAttempts}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600">Jokers Used</p>
          <p className="text-2xl font-bold">{usedJokers}</p>
        </div>
      </div>
      
      {completedWords.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Completed Words:</h3>
          <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
            <ul className="space-y-1">
              {completedWords.map((word, index) => (
                <li key={index} className="text-gray-700">{word}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <Button onClick={onTryAgain} className="w-full mt-4">
        Try Again
      </Button>
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-center mb-4">Choose a unit and try it again</h3>
        <UnitSelector currentUnit={currentUnit} onUnitSelect={onUnitSelect} />
      </div>
    </CardContent>
  </Card>
);

export default GameOver;
interface WordDisplayProps {
  currentWord: string;
  selectedLetters: string[];
}

const WordDisplay = ({ currentWord, selectedLetters }: WordDisplayProps) => (
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
);

export default WordDisplay;
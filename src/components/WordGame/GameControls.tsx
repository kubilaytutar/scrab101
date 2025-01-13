import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GameControlsProps {
  isExtendedTime: boolean;
  onTimeToggle: (checked: boolean) => void;
  jokerCount: number;
  onUseJoker: () => void;
  onTryAgain: () => void;
  showTryAgain?: boolean;
}

const GameControls = ({
  isExtendedTime,
  onTimeToggle,
  jokerCount,
  onUseJoker,
  onTryAgain,
  showTryAgain
}: GameControlsProps) => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mt-4">
        <span className="text-sm text-gray-600">60s</span>
        <Switch checked={isExtendedTime} onCheckedChange={onTimeToggle} />
        <span className="text-sm text-gray-600">120s</span>
      </div>
      <Button
        onClick={onUseJoker}
        disabled={jokerCount === 0}
        variant="outline"
        className="mt-4"
      >
        Use Joker (-10s)
      </Button>
      {showTryAgain && (
        <Button onClick={onTryAgain} variant="default" className="mt-4 ml-2">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default GameControls;
import { useEffect } from "react";
import { gameOverSound, tickSound } from "../gameData";

interface UseGameTimerProps {
  timeLeft: number;
  setTimeLeft: (value: number | ((prev: number) => number)) => void;
  isGameOver: boolean;
  setIsGameOver: (value: boolean) => void;
}

export const useGameTimer = ({
  timeLeft,
  setTimeLeft,
  isGameOver,
  setIsGameOver,
}: UseGameTimerProps) => {
  useEffect(() => {
    let hasPlayedTickSound = false;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 && !isGameOver) {
          clearInterval(timer);
          setIsGameOver(true);
          setTimeout(() => {
            gameOverSound.play().catch(console.error);
          }, 1000);
          return 0;
        }
        if (prev <= 13 && prev > 0 && !isGameOver && !hasPlayedTickSound) {
          tickSound.play().catch(console.error);
          hasPlayedTickSound = true;
        }
        if (isGameOver) {
          clearInterval(timer);
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver, setIsGameOver, setTimeLeft]);
};
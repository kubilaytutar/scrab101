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
      if (isGameOver) {
        tickSound.pause();
        clearInterval(timer);
        return;
      }

      setTimeLeft((prev) => {
        if (prev <= 1 && !isGameOver) {
          clearInterval(timer);
          tickSound.pause();
          setIsGameOver(true);
          // Play game over sound immediately
          requestAnimationFrame(() => {
            gameOverSound.play().catch(console.error);
          });
          return 0;
        }
        
        // Reset hasPlayedTickSound when time is above 13 seconds
        if (prev > 13) {
          hasPlayedTickSound = false;
        }
        
        // Start playing tick sound at 13 seconds if not already playing
        if (prev <= 13 && prev > 0 && !isGameOver && !hasPlayedTickSound) {
          tickSound.play().catch(console.error);
          hasPlayedTickSound = true;
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      tickSound.pause();
    };
  }, [isGameOver, setIsGameOver, setTimeLeft]);
};
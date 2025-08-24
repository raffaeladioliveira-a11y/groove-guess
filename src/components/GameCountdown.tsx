import { useEffect, useState } from "react";
import { QuizCard } from "@/components/QuizCard";

interface GameCountdownProps {
  onCountdownEnd: () => void;
}

export function GameCountdown({ onCountdownEnd }: GameCountdownProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onCountdownEnd();
    }
  }, [count, onCountdownEnd]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <QuizCard variant="game" className="text-center">
        <div className="p-12">
          <h2 className="text-3xl font-bold mb-8">
            O jogo vai começar!
          </h2>
          <div className="text-8xl font-bold gradient-primary bg-clip-text text-transparent animate-score-bounce">
            {count > 0 ? count : '🎵'}
          </div>
          {count === 0 && (
            <p className="text-xl mt-4 text-primary animate-slide-up">
              Vamos lá!
            </p>
          )}
        </div>
      </QuizCard>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { QuizCard } from "@/components/QuizCard";
import { Avatar } from "@/components/Avatar";
import { Round, Player, GameSettings } from "@/types/quiz";
import { Clock, Music } from "lucide-react";
import { YouTubeClipPlayer } from "@/components/YouTubeClipPlayer";
import { cn } from "@/lib/utils";

interface GameQuestionProps {
  round: Round;
  timeLeft: number;
  currentUser: Player;
  settings: GameSettings;
  selectedOption?: number;
  isAnswered: boolean;
  playerAnswers: Record<string, number>;
  players: Player[];
  onAnswerSelect: (optionIndex: number) => void;
}

export function GameQuestion({
  round,
  timeLeft,
  currentUser,
  settings,
  selectedOption,
  isAnswered,
  playerAnswers,
  players,
  onAnswerSelect
}: GameQuestionProps) {
  const progress = (timeLeft / settings.questionTimeSec) * 100;
  const isClipPlaying = timeLeft > (settings.questionTimeSec - settings.clipTimeSec);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-lg text-muted-foreground">
              Pergunta {round.index} de 10
            </span>
            <span className="text-lg text-muted-foreground">•</span>
            <span className="text-lg text-primary font-bold">
              {round.style}
            </span>
          </div>
          
          <QuizCard variant="game" className="mb-4">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Valendo: {round.question.basePoints} pts
                </span>
                <span className="text-sm text-muted-foreground">
                  Bônus máx: +{round.question.bonusMax} pts
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold text-primary">
                  {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
                  {String(timeLeft % 60).padStart(2, '0')}
                </span>
                {isClipPlaying && (
                  <Music className="w-5 h-5 text-accent animate-music-pulse" />
                )}
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all duration-1000",
                    progress > 50 ? "bg-primary" :
                    progress > 25 ? "bg-accent" : "bg-destructive"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </QuizCard>
        </div>

        {/* Track Info */}
        <QuizCard className="mb-6">
          <div className="p-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-3">
                <Music className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-xl font-bold">{round.track.title}</h3>
                  <p className="text-muted-foreground">{round.track.artist}</p>
                </div>
              </div>

              {round.track.youtubeId && (
                <YouTubeClipPlayer
                  youtubeId={round.track.youtubeId}
                  playing={isClipPlaying}
                  clipDurationSec={settings.clipTimeSec}
                />
              )}

              {isClipPlaying && (
                <div className="text-sm text-accent">
                  🎵 Tocando agora... ({settings.clipTimeSec - (settings.questionTimeSec - timeLeft)}s)
                </div>
              )}
            </div>
          </div>
        </QuizCard>

        {/* Question */}
        <QuizCard className="mb-6">
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-6">
              {round.question.text}
            </h2>
          </div>
        </QuizCard>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {round.question.options.map((option, index) => {
            const playersOnOption = Object.entries(playerAnswers)
              .filter(([, answerIndex]) => answerIndex === index)
              .map(([playerId]) => players.find(p => p.id === playerId))
              .filter(Boolean);

            return (
              <QuizCard key={index} variant="option">
                <Button
                  variant="option"
                  className={cn(
                    "w-full h-auto min-h-[80px] relative p-4",
                    selectedOption === index && "border-primary bg-primary/10",
                    isAnswered && "cursor-not-allowed"
                  )}
                  onClick={() => !isAnswered && onAnswerSelect(index)}
                  disabled={isAnswered}
                >
                  <div className="flex flex-col items-center gap-2 w-full">
                    <span className="text-lg font-medium text-center">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                    
                    {/* Player avatars */}
                    {playersOnOption.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {playersOnOption.slice(0, 3).map((player) => (
                          <Avatar
                            key={player!.id}
                            name={player!.nickname}
                            url={player!.avatarUrl}
                            size="sm"
                            className="animate-score-bounce"
                          />
                        ))}
                        {playersOnOption.length > 3 && (
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs">
                            +{playersOnOption.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Button>
              </QuizCard>
            );
          })}
        </div>

        {/* Status */}
        <div className="text-center">
          {isAnswered ? (
            <p className="text-primary font-medium">
              ✓ Resposta enviada! Aguarde os outros jogadores...
            </p>
          ) : (
            <p className="text-muted-foreground">
              Escolha sua resposta antes que o tempo acabe
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
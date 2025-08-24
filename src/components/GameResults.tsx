import { Button } from "@/components/ui/button";
import { QuizCard } from "@/components/QuizCard";
import { Avatar } from "@/components/Avatar";
import { Round, Player, Answer } from "@/types/quiz";
import { CheckCircle, XCircle, Trophy, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameResultsProps {
  round: Round;
  players: Player[];
  answers: Answer[];
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export function GameResults({ round, players, answers, onNextQuestion, isLastQuestion }: GameResultsProps) {
  const correctIndex = round.question.correctIndex;
  
  // Calculate scores for this round
  const playerScores = answers.map(answer => {
    const player = players.find(p => p.id === answer.playerId);
    return {
      player,
      answer,
      points: answer.points,
      isCorrect: answer.isCorrect
    };
  }).sort((a, b) => b.points - a.points);

  // Group players by option
  const optionGroups = round.question.options.map((option, index) => ({
    option,
    index,
    isCorrect: index === correctIndex,
    players: answers.filter(a => a.optionIndex === index).map(a => {
      const player = players.find(p => p.id === a.playerId);
      return { player, answer: a };
    })
  }));

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Resultado da Pergunta {round.index}
          </h2>
          <p className="text-xl text-muted-foreground">
            Estilo: <span className="text-primary font-bold">{round.style}</span>
          </p>
        </div>

        {/* Track Info */}
        <QuizCard className="mb-8">
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">{round.track.title}</h3>
            <p className="text-muted-foreground text-lg">{round.track.artist}</p>
          </div>
        </QuizCard>

        {/* Question and Correct Answer */}
        <QuizCard variant="game" className="mb-8">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4 text-center">
              {round.question.text}
            </h3>
            <div className="flex items-center justify-center gap-3 p-4 bg-green-500/20 rounded-lg border border-green-500/30">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-lg font-bold">
                {String.fromCharCode(65 + correctIndex)}. {round.question.options[correctIndex]}
              </span>
            </div>
          </div>
        </QuizCard>

        {/* Options with Players */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {optionGroups.map(({ option, index, isCorrect, players: optionPlayers }) => (
            <QuizCard key={index} className={cn(
              "border-2",
              isCorrect ? "border-green-500/50 bg-green-500/10" : "border-red-500/30 bg-red-500/5"
            )}>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                  <span className="font-medium">
                    {String.fromCharCode(65 + index)}. {option}
                  </span>
                </div>
                
                {optionPlayers.length > 0 ? (
                  <div className="space-y-2">
                    {optionPlayers.map(({ player, answer }) => (
                      <div key={player!.id} className="flex items-center gap-3 p-2 bg-background/50 rounded">
                        <Avatar name={player!.nickname} url={player!.avatarUrl} size="sm" />
                        <span className="flex-1">{player!.nickname}</span>
                        <span className={cn(
                          "font-bold",
                          answer.isCorrect ? "text-green-400" : "text-red-400"
                        )}>
                          {answer.isCorrect ? `+${answer.points}` : '0'} pts
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhum jogador escolheu esta opção</p>
                )}
              </div>
            </QuizCard>
          ))}
        </div>

        {/* Top Scorers for this Round */}
        {playerScores.length > 0 && (
          <QuizCard className="mb-8">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                Pontuação desta Rodada
              </h3>
              <div className="space-y-3">
                {playerScores.slice(0, 3).map((score, index) => (
                  <div key={score.player!.id} className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                        index === 0 ? "bg-yellow-500 text-black" :
                        index === 1 ? "bg-gray-400 text-black" :
                        "bg-orange-600 text-white"
                      )}>
                        {index + 1}
                      </span>
                      <Avatar name={score.player!.nickname} url={score.player!.avatarUrl} size="sm" />
                      <span className="font-medium">{score.player!.nickname}</span>
                    </div>
                    <div className="flex-1" />
                    <div className="text-right">
                      <span className={cn(
                        "font-bold text-lg",
                        score.isCorrect ? "text-green-400" : "text-red-400"
                      )}>
                        {score.isCorrect ? `+${score.points}` : '0'} pts
                      </span>
                      {score.isCorrect && score.answer.timeMs < 5000 && (
                        <div className="text-xs text-accent">⚡ Bônus rapidez</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </QuizCard>
        )}

        {/* Next Button */}
        <div className="text-center">
          <Button
            onClick={onNextQuestion}
            variant="musical"
            size="hero"
            className="animate-slide-up"
          >
            {isLastQuestion ? (
              <>
                <Trophy className="w-6 h-6 mr-2" />
                Ver Resultado Final
              </>
            ) : (
              <>
                <ArrowRight className="w-6 h-6 mr-2" />
                Próxima Pergunta
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
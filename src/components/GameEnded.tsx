import { Button } from "@/components/ui/button";
import { QuizCard } from "@/components/QuizCard";
import { Avatar } from "@/components/Avatar";
import { Player } from "@/types/quiz";
import { Trophy, Medal, Award, RotateCcw, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameEndedProps {
  players: Player[];
  onPlayAgain: () => void;
  onShareResults: () => void;
}

export function GameEnded({ players, onPlayAgain, onShareResults }: GameEndedProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  const getPodiumIcon = (position: number) => {
    switch (position) {
      case 0: return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 1: return <Medal className="w-8 h-8 text-gray-400" />;
      case 2: return <Award className="w-8 h-8 text-orange-600" />;
      default: return null;
    }
  };

  const getPodiumBg = (position: number) => {
    switch (position) {
      case 0: return "gradient-success";
      case 1: return "bg-gray-500/20";
      case 2: return "bg-orange-500/20";
      default: return "bg-muted/20";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">🏆</div>
          <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-4">
            Jogo Finalizado!
          </h1>
          {winner && (
            <p className="text-xl text-muted-foreground">
              Parabéns <span className="text-primary font-bold">{winner.nickname}</span>! 
              Você foi o grande vencedor!
            </p>
          )}
        </div>

        {/* Winner Spotlight */}
        {winner && (
          <QuizCard variant="game" className="mb-8">
            <div className="p-8 text-center">
              <div className="gradient-success p-6 rounded-2xl inline-block mb-4">
                <Avatar 
                  name={winner.nickname} 
                  url={winner.avatarUrl} 
                  size="lg" 
                  className="border-4 border-white shadow-glow"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">{winner.nickname}</h2>
              <p className="text-3xl font-bold text-green-400 mb-2">
                {winner.score} pontos
              </p>
              <p className="text-muted-foreground">
                🎵 Mestre dos Quiz Musicais! 🎵
              </p>
            </div>
          </QuizCard>
        )}

        {/* Full Ranking */}
        <QuizCard className="mb-8">
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Ranking Final
            </h3>
            <div className="space-y-3">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-300",
                    getPodiumBg(index),
                    index < 3 ? "border-primary/30" : "border-border/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {getPodiumIcon(index) || (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                      )}
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 text-lg animate-music-pulse">
                          👑
                        </div>
                      )}
                    </div>
                    <Avatar 
                      name={player.nickname} 
                      url={player.avatarUrl} 
                      size="md" 
                      className={cn(
                        index < 3 && "border-primary/40 shadow-glow"
                      )}
                    />
                    <div>
                      <span className="font-bold text-lg">{player.nickname}</span>
                      {index === 0 && (
                        <div className="text-xs text-green-400 font-medium">CAMPEÃO</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1" />
                  
                  <div className="text-right">
                    <div className={cn(
                      "text-2xl font-bold",
                      index === 0 ? "text-green-400" :
                      index === 1 ? "text-gray-400" :
                      index === 2 ? "text-orange-400" : "text-foreground"
                    )}>
                      {player.score}
                    </div>
                    <div className="text-xs text-muted-foreground">pontos</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </QuizCard>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onPlayAgain}
            variant="musical"
            size="hero"
            className="flex-1 sm:flex-none"
          >
            <RotateCcw className="w-6 h-6 mr-2" />
            Jogar Novamente
          </Button>
          
          <Button
            onClick={onShareResults}
            variant="secondary"
            size="hero"
            className="flex-1 sm:flex-none"
          >
            <Share2 className="w-6 h-6 mr-2" />
            Compartilhar Resultado
          </Button>
        </div>

        {/* Stats */}
        <QuizCard className="mt-8">
          <div className="p-6">
            <h4 className="font-bold mb-4 text-center">Estatísticas da Partida</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{players.length}</div>
                <div className="text-sm text-muted-foreground">Jogadores</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">10</div>
                <div className="text-sm text-muted-foreground">Perguntas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">
                  {Math.max(...players.map(p => p.score))}
                </div>
                <div className="text-sm text-muted-foreground">Maior Pontuação</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {Math.round(players.reduce((acc, p) => acc + p.score, 0) / players.length)}
                </div>
                <div className="text-sm text-muted-foreground">Média de Pontos</div>
              </div>
            </div>
          </div>
        </QuizCard>
      </div>
    </div>
  );
}
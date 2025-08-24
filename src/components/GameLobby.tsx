import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuizCard } from "@/components/QuizCard";
import { Avatar } from "@/components/Avatar";
import { Player, Room } from "@/types/quiz";
import { Copy, Users, Play } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface GameLobbyProps {
  room: Room;
  currentUser: Player;
  onStartGame: () => void;
}

export function GameLobby({ room, currentUser, onStartGame }: GameLobbyProps) {
  const [roomLink] = useState(`${window.location.origin}/room/${room.code}`);
  const { toast } = useToast();

  const copyRoomLink = () => {
    navigator.clipboard.writeText(roomLink);
    toast({
      title: "Link copiado!",
      description: "Compartilhe com seus amigos para eles entrarem na sala.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-4">
            Quiz Musical
          </h1>
          <p className="text-muted-foreground text-lg">
            Sala: <span className="font-mono text-primary font-bold">{room.code}</span>
          </p>
        </div>

        {/* Room Link */}
        <QuizCard className="mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Convide seus amigos
            </h3>
            <div className="flex gap-2">
              <Input 
                value={roomLink} 
                readOnly 
                className="font-mono"
              />
              <Button onClick={copyRoomLink} variant="musical" size="icon">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </QuizCard>

        {/* Players Grid */}
        <QuizCard className="mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Jogadores ({room.players.length}/{room.maxPlayers})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {room.players.map((player) => (
                <div
                  key={player.id}
                  className="flex flex-col items-center gap-3 p-4 rounded-lg bg-muted/20 relative"
                >
                  {player.isHost && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-xs text-accent-foreground font-bold">👑</span>
                    </div>
                  )}
                  <Avatar 
                    name={player.nickname} 
                    url={player.avatarUrl} 
                    size="lg"
                  />
                  <span className="font-medium text-center">{player.nickname}</span>
                  {player.id === currentUser.id && (
                    <span className="text-xs text-primary font-bold">(Você)</span>
                  )}
                </div>
              ))}
              
              {/* Empty slots */}
              {Array.from({ length: room.maxPlayers - room.players.length }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="flex flex-col items-center gap-3 p-4 rounded-lg bg-muted/10 border-2 border-dashed border-muted"
                >
                  <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground text-sm">Aguardando...</span>
                </div>
              ))}
            </div>
          </div>
        </QuizCard>

        {/* Game Info */}
        <QuizCard className="mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Regras do Jogo</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="mb-2">• {room.totalQuestions} perguntas por partida</p>
                <p className="mb-2">• 20 segundos por pergunta</p>
                <p className="mb-2">• Música toca por 15 segundos</p>
              </div>
              <div>
                <p className="mb-2">• Pontuação base: 100 pontos</p>
                <p className="mb-2">• Bônus por rapidez: até +50 pontos</p>
                <p className="mb-2">• Cada jogador escolhe um estilo musical</p>
              </div>
            </div>
          </div>
        </QuizCard>

        {/* Start Game */}
        {currentUser.isHost && (
          <div className="text-center">
            <Button
              onClick={onStartGame}
              variant="musical"
              size="hero"
              disabled={room.players.length < 1}
              className="animate-music-pulse"
            >
              <Play className="w-6 h-6 mr-2" />
              Iniciar Jogo
            </Button>
            {room.players.length < 1 && (
              <p className="text-muted-foreground text-sm mt-2">
                Aguarde pelo menos 1 jogador para começar
              </p>
            )}
          </div>
        )}

        {!currentUser.isHost && (
          <div className="text-center">
            <p className="text-muted-foreground">
              Aguardando o host iniciar o jogo...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
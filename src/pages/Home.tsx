import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuizCard } from "@/components/QuizCard";
import { Music, Users, Trophy, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-music.jpg";

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    if (!nickname.trim()) return;
    // Generate random room code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/room/${code}?host=${encodeURIComponent(nickname)}`);
  };

  const joinRoom = () => {
    if (!roomCode.trim() || !nickname.trim()) return;
    navigate(`/room/${roomCode.toUpperCase()}?nickname=${encodeURIComponent(nickname)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat min-h-[70vh] flex items-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            Quiz Musical
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-slide-up">
            Teste seus conhecimentos musicais com amigos!
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-lg animate-slide-up">
            <div className="flex items-center gap-2">
              <Music className="w-6 h-6" />
              <span>10 Perguntas</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6" />
              <span>Até 8 Jogadores</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              <span>Ranking em Tempo Real</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Options */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Room */}
          <QuizCard variant="game">
            <div className="p-8 text-center">
              <div className="gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Play className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Criar Sala</h2>
              <p className="text-muted-foreground mb-6">
                Crie uma nova sala e convide seus amigos para jogar
              </p>
              <div className="space-y-4">
                <Input
                  placeholder="Seu nome"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="text-center"
                />
                <Button
                  onClick={createRoom}
                  variant="musical"
                  size="hero"
                  className="w-full"
                  disabled={!nickname.trim()}
                >
                  Criar Sala
                </Button>
              </div>
            </div>
          </QuizCard>

          {/* Join Room */}
          <QuizCard variant="game">
            <div className="p-8 text-center">
              <div className="gradient-secondary p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Users className="w-8 h-8 text-accent-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Entrar em Sala</h2>
              <p className="text-muted-foreground mb-6">
                Digite o código da sala para se juntar ao jogo
              </p>
              <div className="space-y-4">
                <Input
                  placeholder="Seu nome"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="text-center"
                />
                <Input
                  placeholder="Código da sala (ex: ABC123)"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="text-center font-mono"
                  maxLength={6}
                />
                <Button
                  onClick={joinRoom}
                  variant="host"
                  size="hero"
                  className="w-full"
                  disabled={!roomCode.trim() || !nickname.trim()}
                >
                  Entrar na Sala
                </Button>
              </div>
            </div>
          </QuizCard>
        </div>

        {/* Features */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center mb-12">
            Como Funciona
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <QuizCard>
              <div className="p-6 text-center">
                <div className="text-4xl mb-4">🎵</div>
                <h4 className="text-xl font-bold mb-3">Escute & Responda</h4>
                <p className="text-muted-foreground">
                  Cada música toca por 15 segundos. Você tem 20 segundos para responder!
                </p>
              </div>
            </QuizCard>

            <QuizCard>
              <div className="p-6 text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-xl font-bold mb-3">Bônus por Rapidez</h4>
                <p className="text-muted-foreground">
                  Responda rápido e ganhe pontos extras! Até +50 pontos de bônus.
                </p>
              </div>
            </QuizCard>

            <QuizCard>
              <div className="p-6 text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h4 className="text-xl font-bold mb-3">Ranking Dinâmico</h4>
                <p className="text-muted-foreground">
                  Veja sua posição em tempo real e dispute o primeiro lugar!
                </p>
              </div>
            </QuizCard>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <QuizCard variant="game">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Pronto para testar seus conhecimentos musicais?
              </h3>
              <p className="text-muted-foreground mb-6">
                Convide seus amigos e descubram quem é o verdadeiro expert em música!
              </p>
              <Button
                onClick={() => {
                  setNickname("Jogador" + Math.floor(Math.random() * 1000));
                  createRoom();
                }}
                variant="musical"
                size="hero"
                className="animate-music-pulse"
              >
                <Play className="w-6 h-6 mr-2" />
                Começar Agora
              </Button>
            </div>
          </QuizCard>
        </div>
      </div>
    </div>
  );
}
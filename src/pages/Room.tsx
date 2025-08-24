import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuizGame } from "@/hooks/useQuizGame";
import { GameLobby } from "@/components/GameLobby";
import { GameCountdown } from "@/components/GameCountdown";
import { GameQuestion } from "@/components/GameQuestion";
import { GameResults } from "@/components/GameResults";
import { GameEnded } from "@/components/GameEnded";
import { RoomStatus } from "@/types/quiz";
import { useToast } from "@/hooks/use-toast";

export default function Room() {
  const { code } = useParams<{ code: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    gameState,
    currentUser,
    settings,
    joinRoom,
    createRoom,
    startGame,
    submitAnswer,
    nextQuestion,
    resetGame
  } = useQuizGame();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!code || isInitialized) return;

    const hostName = searchParams.get('host');
    const nickname = searchParams.get('nickname');

    if (hostName) {
      // Creating a room as host
      createRoom(hostName);
      toast({
        title: "Sala criada!",
        description: `Código da sala: ${code}`,
      });
    } else if (nickname) {
      // Joining an existing room
      joinRoom(code, nickname);
      toast({
        title: "Entrou na sala!",
        description: `Bem-vindo ao Quiz Musical!`,
      });
    } else {
      // Invalid access
      navigate('/');
      return;
    }

    setIsInitialized(true);
  }, [code, searchParams, isInitialized, createRoom, joinRoom, navigate, toast]);

  const handleStartGame = () => {
    startGame();
  };

  const handleCountdownEnd = () => {
    // Game will automatically start the first question
  };

  const handleAnswerSelect = (optionIndex: number) => {
    submitAnswer(optionIndex);
  };

  const handleNextQuestion = () => {
    nextQuestion();
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  const handleShareResults = () => {
    const results = gameState.room.players
      .sort((a, b) => b.score - a.score)
      .map((player, index) => `${index + 1}. ${player.nickname}: ${player.score} pts`)
      .join('\n');

    const shareText = `🎵 Resultado do Quiz Musical! 🎵\n\n${results}\n\nJogue você também: ${window.location.origin}`;

    if (navigator.share) {
      navigator.share({
        title: 'Quiz Musical - Resultados',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Resultado copiado!",
        description: "Compartilhe com seus amigos.",
      });
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-music-pulse">🎵</div>
          <p className="text-muted-foreground">Entrando na sala...</p>
        </div>
      </div>
    );
  }

  // Render appropriate component based on game status
  switch (gameState.room.status) {
    case RoomStatus.LOBBY:
      return (
        <GameLobby
          room={gameState.room}
          currentUser={currentUser}
          onStartGame={handleStartGame}
        />
      );

    case RoomStatus.COUNTDOWN:
      return <GameCountdown onCountdownEnd={handleCountdownEnd} />;

    case RoomStatus.PLAYING:
      if (!gameState.currentRound) {
        return <div>Carregando pergunta...</div>;
      }
      return (
        <GameQuestion
          round={gameState.currentRound}
          timeLeft={gameState.timeLeft}
          currentUser={currentUser}
          settings={settings}
          selectedOption={gameState.selectedOption}
          isAnswered={gameState.isAnswered}
          playerAnswers={gameState.playerAnswers}
          players={gameState.room.players}
          onAnswerSelect={handleAnswerSelect}
        />
      );

    case RoomStatus.REVEAL:
      if (!gameState.currentRound) {
        return <div>Carregando resultados...</div>;
      }
      return (
        <GameResults
          round={gameState.currentRound}
          players={gameState.room.players}
          answers={gameState.currentRound.answers}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={gameState.currentRound.index >= gameState.room.totalQuestions}
        />
      );

    case RoomStatus.ENDED:
      return (
        <GameEnded
          players={gameState.room.players}
          onPlayAgain={handlePlayAgain}
          onShareResults={handleShareResults}
        />
      );

    default:
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Estado do jogo desconhecido</p>
          </div>
        </div>
      );
  }
}
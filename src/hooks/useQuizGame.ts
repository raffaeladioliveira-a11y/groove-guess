import { useState, useEffect, useCallback } from 'react';
import { GameState, Room, Round, Player, RoomStatus, GameSettings, ScoringMode } from '@/types/quiz';

// Mock data for development
const mockSettings: GameSettings = {
  basePoints: 100,
  scoringMode: ScoringMode.FIXED,
  growthPerRound: 20,
  bonusMax: 50,
  bonusStrategy: 'LINEAR_DECAY' as any,
  questionTimeSec: 20,
  clipTimeSec: 15,
};

const mockStyles = [
  'Rock Anos 80', 'Pop 2000s', 'Sertanejo', 'Funk Carioca', 
  'MPB', 'Internacional', 'Eletrônica', 'Hip Hop'
];

const mockQuestions = [
  {
    id: '1',
    text: 'Qual o nome desta música?',
    options: ['Bohemian Rhapsody', 'Stairway to Heaven', 'Hotel California', 'Sweet Child O Mine'],
    correctIndex: 0,
    basePoints: 100,
    bonusMax: 50,
  },
  {
    id: '2', 
    text: 'Quem canta esta música?',
    options: ['Madonna', 'Whitney Houston', 'Mariah Carey', 'Celine Dion'],
    correctIndex: 1,
    basePoints: 120,
    bonusMax: 50,
  }
];

export function useQuizGame() {
  const [gameState, setGameState] = useState<GameState>({
    room: {
      id: 'room-1',
      code: 'ABC123',
      hostId: 'user-1',
      status: RoomStatus.LOBBY,
      maxPlayers: 8,
      totalQuestions: 10,
      createdAt: new Date(),
      players: []
    },
    timeLeft: 0,
    isAnswered: false,
    showResults: false,
    playerAnswers: {}
  });

  const [currentUser, setCurrentUser] = useState<Player>({
    id: 'player-1',
    userId: 'user-1',
    roomId: 'room-1',
    nickname: 'Você',
    isHost: true,
    score: 0,
    joinedAt: new Date()
  });

  // Timer effect
  useEffect(() => {
    if (gameState.room.status === RoomStatus.PLAYING && gameState.timeLeft > 0) {
      const timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: Math.max(0, prev.timeLeft - 1)
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState.room.status, gameState.timeLeft]);

  const joinRoom = useCallback((code: string, nickname: string) => {
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      userId: `user-${Date.now()}`,
      roomId: 'room-1',
      nickname,
      isHost: false,
      score: 0,
      joinedAt: new Date()
    };

    setCurrentUser(newPlayer);
    setGameState(prev => ({
      ...prev,
      room: {
        ...prev.room,
        players: [...prev.room.players, newPlayer]
      }
    }));
  }, []);

  const createRoom = useCallback((hostName: string) => {
    const hostPlayer: Player = {
      id: 'player-host',
      userId: 'user-host',
      roomId: 'room-1',
      nickname: hostName,
      isHost: true,
      score: 0,
      joinedAt: new Date()
    };

    setCurrentUser(hostPlayer);
    setGameState(prev => ({
      ...prev,
      room: {
        ...prev.room,
        players: [hostPlayer]
      }
    }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      room: { ...prev.room, status: RoomStatus.COUNTDOWN }
    }));

    // Countdown
    setTimeout(() => {
      startQuestion(0);
    }, 3000);
  }, []);

  const startQuestion = useCallback((questionIndex: number) => {
    const question = mockQuestions[questionIndex % mockQuestions.length];
    
    setGameState(prev => ({
      ...prev,
      room: { ...prev.room, status: RoomStatus.PLAYING },
      currentRound: {
        id: `round-${questionIndex}`,
        matchId: 'match-1',
        index: questionIndex + 1,
        pickerPlayerId: prev.room.players[questionIndex % prev.room.players.length]?.id || '',
        style: mockStyles[questionIndex % mockStyles.length],
        track: {
          id: `track-${questionIndex}`,
          title: 'Música Misteriosa',
          artist: 'Artista Secreto',
          style: mockStyles[questionIndex % mockStyles.length],
          source: 'YOUTUBE' as any,
          youtubeId: 'dQw4w9WgXcQ',
          tags: [],
          durationSec: 180
        },
        question,
        answers: []
      },
      timeLeft: mockSettings.questionTimeSec,
      isAnswered: false,
      showResults: false,
      playerAnswers: {}
    }));
  }, []);

  const submitAnswer = useCallback((optionIndex: number) => {
    if (gameState.isAnswered || !gameState.currentRound) return;

    const timeElapsed = mockSettings.questionTimeSec - gameState.timeLeft;
    const isCorrect = optionIndex === gameState.currentRound.question.correctIndex;
    
    // Calculate points (simplified)
    let points = 0;
    if (isCorrect) {
      const basePoints = gameState.currentRound.question.basePoints;
      const bonus = Math.max(0, mockSettings.bonusMax - Math.floor(timeElapsed * 2));
      points = basePoints + bonus;
    }

    setGameState(prev => ({
      ...prev,
      isAnswered: true,
      selectedOption: optionIndex,
      playerAnswers: {
        ...prev.playerAnswers,
        [currentUser.id]: optionIndex
      }
    }));

    // Update player score
    setCurrentUser(prev => ({
      ...prev,
      score: prev.score + points
    }));

    // Show results after a delay
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        room: { ...prev.room, status: RoomStatus.REVEAL },
        showResults: true
      }));
    }, gameState.timeLeft * 1000);
  }, [gameState, currentUser.id]);

  const nextQuestion = useCallback(() => {
    if (!gameState.currentRound) return;

    const nextIndex = gameState.currentRound.index;
    if (nextIndex < gameState.room.totalQuestions) {
      startQuestion(nextIndex);
    } else {
      setGameState(prev => ({
        ...prev,
        room: { ...prev.room, status: RoomStatus.ENDED }
      }));
    }
  }, [gameState.currentRound, gameState.room.totalQuestions, startQuestion]);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      room: { ...prev.room, status: RoomStatus.LOBBY },
      currentRound: undefined,
      timeLeft: 0,
      isAnswered: false,
      showResults: false,
      playerAnswers: {}
    }));
    
    setCurrentUser(prev => ({ ...prev, score: 0 }));
  }, []);

  return {
    gameState,
    currentUser,
    settings: mockSettings,
    styles: mockStyles,
    joinRoom,
    createRoom,
    startGame,
    submitAnswer,
    nextQuestion,
    resetGame
  };
}
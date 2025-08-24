export interface User {
  id: string;
  displayName: string;
  avatarUrl?: string;
  providerId?: string;
}

export interface Room {
  id: string;
  code: string;
  hostId: string;
  status: RoomStatus;
  maxPlayers: number;
  totalQuestions: number;
  createdAt: Date;
  players: Player[];
  currentMatch?: Match;
}

export enum RoomStatus {
  LOBBY = 'LOBBY',
  COUNTDOWN = 'COUNTDOWN',
  PLAYING = 'PLAYING',
  REVEAL = 'REVEAL',
  SCOREBOARD = 'SCOREBOARD',
  ENDED = 'ENDED'
}

export interface Player {
  id: string;
  userId: string;
  roomId: string;
  nickname: string;
  avatarUrl?: string;
  isHost: boolean;
  score: number;
  joinedAt: Date;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  style: string;
  source: TrackSource;
  youtubeId?: string;
  fileUrl?: string;
  year?: number;
  tags: string[];
  durationSec?: number;
}

export enum TrackSource {
  YOUTUBE = 'YOUTUBE',
  FILE = 'FILE'
}

export interface Match {
  id: string;
  roomId: string;
  startedAt: Date;
  endedAt?: Date;
  rounds: Round[];
}

export interface Round {
  id: string;
  matchId: string;
  index: number;
  pickerPlayerId: string;
  style: string;
  track: Track;
  question: Question;
  startedAt?: Date;
  endedAt?: Date;
  answers: Answer[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  basePoints: number;
  bonusMax: number;
}

export interface Answer {
  id: string;
  roundId: string;
  playerId: string;
  optionIndex: number;
  isCorrect: boolean;
  timeMs: number;
  points: number;
}

export interface GameSettings {
  basePoints: number;
  scoringMode: ScoringMode;
  growthPerRound: number;
  bonusMax: number;
  bonusStrategy: BonusStrategy;
  questionTimeSec: number;
  clipTimeSec: number;
}

export enum ScoringMode {
  FIXED = 'FIXED',
  AUTO_GROW = 'AUTO_GROW'
}

export enum BonusStrategy {
  LINEAR_DECAY = 'LINEAR_DECAY',
  TOP_N = 'TOP_N'
}

export interface GameState {
  room: Room;
  currentRound?: Round;
  timeLeft: number;
  isAnswered: boolean;
  selectedOption?: number;
  showResults: boolean;
  playerAnswers: Record<string, number>;
}

export interface ScoreEntry {
  playerId: string;
  playerName: string;
  avatarUrl?: string;
  delta: number;
  total: number;
  position: number;
}

// WebSocket Events
export interface WebSocketEvent {
  type: string;
  payload?: any;
}

export interface RoomStateEvent extends WebSocketEvent {
  type: 'room:state';
  payload: {
    status: RoomStatus;
    players: Player[];
    currentRound?: Round;
    timeLeft?: number;
  };
}

export interface QuestionStartEvent extends WebSocketEvent {
  type: 'room:question:start';
  payload: {
    roundIndex: number;
    style: string;
    question: Question;
    track: Track;
    basePoints: number;
    bonusMax: number;
    timeLeft: number;
  };
}

export interface AnswerSubmitEvent extends WebSocketEvent {
  type: 'room:answer:submit';
  payload: {
    optionIndex: number;
    clientTs: number;
  };
}

export interface AnswerAvatarsEvent extends WebSocketEvent {
  type: 'room:answer:avatars';
  payload: {
    optionIndex: number;
    playerId: string;
    playerName: string;
    avatarUrl?: string;
  };
}

export interface QuestionRevealEvent extends WebSocketEvent {
  type: 'room:question:reveal';
  payload: {
    correctIndex: number;
    answers: Answer[];
  };
}

export interface ScoreboardEvent extends WebSocketEvent {
  type: 'room:scoreboard';
  payload: {
    entries: ScoreEntry[];
  };
}
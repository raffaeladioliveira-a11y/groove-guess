import { z } from "zod";

export const JoinRoomSchema = z.object({
  roomCode: z.string().length(6),
  userId: z.string().min(1),
  name: z.string().min(1),
  avatarUrl: z.string().url().optional(),
  isHost: z.boolean().optional(),
});

export const LeaveRoomSchema = z.object({
  roomCode: z.string().length(6),
  userId: z.string().min(1),
});

export const SelectGenreSchema = z.object({
  roomCode: z.string().length(6),
  genreId: z.string().min(1),
});

export const StartGameSchema = z.object({
  roomCode: z.string().length(6),
});

export const AnswerSubmitSchema = z.object({
  roomCode: z.string().length(6),
  questionId: z.string().min(1),
  optionIndex: z.number().int().min(0).max(3),
  timeMs: z.number().int().nonnegative(),
});

export type JoinRoomPayload = z.infer<typeof JoinRoomSchema>;
export type LeaveRoomPayload = z.infer<typeof LeaveRoomSchema>;
export type SelectGenrePayload = z.infer<typeof SelectGenreSchema>;
export type StartGamePayload = z.infer<typeof StartGameSchema>;
export type AnswerSubmitPayload = z.infer<typeof AnswerSubmitSchema>;

export type Participant = {
  socketId: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  score: number;
};

export type Question = {
  id: string;
  youtubeId: string;
  options: string[]; // length 4
  correctIndex: number; // 0..3
  genreId: string;
};

export type RoomStatus = "lobby" | "playing" | "ended";

export type RoomState = {
  code: string;
  hostUserId: string;
  hostSocketId: string;
  participants: Map<string, Participant>; // key: userId
  status: RoomStatus;
  round: number;
  currentQuestion?: Question;
  questionDeadlineTs?: number; // epoch ms
  answers: Map<string, { optionIndex: number; timeMs: number }>; // key: userId
  basePoints: number;
  speedBonusMultiplier: number; // per 100ms remaining
  totalRounds: number;
};

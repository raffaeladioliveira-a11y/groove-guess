import express from "express";
import http from "http";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import { PrismaClient } from "@prisma/client";
import {
  AnswerSubmitSchema,
  JoinRoomSchema,
  LeaveRoomSchema,
  SelectGenreSchema,
  StartGameSchema,
  RoomState,
  Participant,
} from "./types";
import { generateRoomCode } from "./utils/generateCode";
import { adminRouter } from "./admin";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/admin", adminRouter);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*" },
});

const prisma = new PrismaClient();

const roomCodeToState = new Map<string, RoomState>();
const socketIdToRoomCode = new Map<string, string>();
const socketIdToUserId = new Map<string, string>();

function getOrCreateRoom(hostUserId: string, hostSocketId: string): RoomState {
  const code = generateRoomCode();
  const state: RoomState = {
    code,
    hostUserId,
    hostSocketId,
    participants: new Map<string, Participant>(),
    status: "lobby",
    round: 0,
    answers: new Map(),
    basePoints: 100,
    speedBonusMultiplier: 2,
    totalRounds: 10,
  };
  roomCodeToState.set(code, state);
  return state;
}

function calculateScore(basePoints: number, speedBonusMultiplier: number, timeMs: number, deadlineTs: number): number {
  const remainingMs = Math.max(0, deadlineTs - (Date.now() - timeMs));
  const bonus = Math.floor((remainingMs / 100) * speedBonusMultiplier);
  return basePoints + bonus;
}

io.on("connection", (socket) => {
  socket.on("room:join", async (raw) => {
    const parsed = JoinRoomSchema.safeParse(raw);
    if (!parsed.success) return;
    const { roomCode, userId, name, avatarUrl, isHost } = parsed.data;

    let state = roomCodeToState.get(roomCode);
    if (!state && isHost) {
      state = getOrCreateRoom(userId, socket.id);
    }
    if (!state) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    socket.join(state.code);
    socketIdToRoomCode.set(socket.id, state.code);
    socketIdToUserId.set(socket.id, userId);

    state.participants.set(userId, {
      socketId: socket.id,
      userId,
      name,
      avatarUrl,
      score: 0,
    });

    io.to(state.code).emit("room:update", {
      code: state.code,
      participants: Array.from(state.participants.values()).map((p) => ({
        userId: p.userId,
        name: p.name,
        avatarUrl: p.avatarUrl,
        score: p.score,
      })),
      status: state.status,
    });
  });

  socket.on("room:leave", (raw) => {
    const parsed = LeaveRoomSchema.safeParse(raw);
    if (!parsed.success) return;
    const { roomCode, userId } = parsed.data;
    const state = roomCodeToState.get(roomCode);
    if (!state) return;
    state.participants.delete(userId);
    socket.leave(roomCode);
    io.to(roomCode).emit("room:update", {
      code: state.code,
      participants: Array.from(state.participants.values()),
      status: state.status,
    });
  });

  socket.on("game:start", async (raw) => {
    const parsed = StartGameSchema.safeParse(raw);
    if (!parsed.success) return;
    const { roomCode } = parsed.data;
    const state = roomCodeToState.get(roomCode);
    if (!state) return;
    if (state.participants.size < 1) return;
    state.status = "playing";
    state.round = 1;
    io.to(roomCode).emit("game:start", { round: state.round });
  });

  socket.on("question:select_genre", async (raw) => {
    const parsed = SelectGenreSchema.safeParse(raw);
    if (!parsed.success) return;
    const { roomCode, genreId } = parsed.data;
    const state = roomCodeToState.get(roomCode);
    if (!state) return;
    // Fetch a random song in the genre and prepare options
    const songs = await prisma.song.findMany({
      where: { album: { genreId } },
      include: { album: true },
      take: 4,
    });
    if (songs.length < 4) {
      socket.emit("error", { message: "Not enough songs for this genre" });
      return;
    }
    const correctIndex = Math.floor(Math.random() * 4);
    const correctSong = songs[correctIndex];
    const youtubeId = extractYouTubeId(correctSong.youtubeUrl);
    const options = songs.map((s) => `${s.title} — ${s.artist}`);
    const questionId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    state.currentQuestion = {
      id: questionId,
      youtubeId,
      options,
      correctIndex,
      genreId,
    };
    state.answers.clear();
    const deadline = Date.now() + 15_000;
    state.questionDeadlineTs = deadline;

    io.to(roomCode).emit("question:show", {
      id: questionId,
      youtubeId,
      options,
      deadlineTs: deadline,
      round: state.round,
      totalRounds: state.totalRounds,
    });
  });

  socket.on("answer:submit", (raw) => {
    const parsed = AnswerSubmitSchema.safeParse(raw);
    if (!parsed.success) return;
    const { roomCode, questionId, optionIndex, timeMs } = parsed.data;
    const state = roomCodeToState.get(roomCode);
    if (!state || !state.currentQuestion || state.currentQuestion.id !== questionId) return;
    const userId = socketIdToUserId.get(socket.id);
    if (!userId) return;
    if (!state.questionDeadlineTs || Date.now() > state.questionDeadlineTs) return; // timeout
    if (state.answers.has(userId)) return; // already answered
    state.answers.set(userId, { optionIndex, timeMs });

    // broadcast choice avatar positions (without revealing correctness)
    io.to(roomCode).emit("answer:update", {
      userId,
      optionIndex,
    });
  });

  socket.on("answer:reveal", () => {
    const roomCode = socketIdToRoomCode.get(socket.id);
    if (!roomCode) return;
    const state = roomCodeToState.get(roomCode);
    if (!state || !state.currentQuestion || !state.questionDeadlineTs) return;

    const correct = state.currentQuestion.correctIndex;
    const deadline = state.questionDeadlineTs;
    const updates: Array<{ userId: string; delta: number; total: number }> = [];
    for (const [userId, ans] of state.answers.entries()) {
      const participant = state.participants.get(userId);
      if (!participant) continue;
      if (ans.optionIndex === correct) {
        const delta = calculateScore(state.basePoints, state.speedBonusMultiplier, ans.timeMs, deadline);
        participant.score += delta;
        updates.push({ userId, delta, total: participant.score });
      }
    }

    const ranking = Array.from(state.participants.values())
      .map((p) => ({ userId: p.userId, name: p.name, score: p.score, avatarUrl: p.avatarUrl }))
      .sort((a, b) => b.score - a.score);

    io.to(roomCode).emit("answer:reveal", {
      correctIndex: correct,
      updates,
      ranking,
    });

    state.round += 1;
    if (state.round > state.totalRounds) {
      state.status = "ended";
      io.to(roomCode).emit("game:end", { ranking });
    }
  });

  socket.on("disconnect", () => {
    const roomCode = socketIdToRoomCode.get(socket.id);
    const userId = socketIdToUserId.get(socket.id);
    if (!roomCode || !userId) return;
    const state = roomCodeToState.get(roomCode);
    if (!state) return;
    state.participants.delete(userId);
    io.to(roomCode).emit("room:update", {
      code: state.code,
      participants: Array.from(state.participants.values()),
      status: state.status,
    });
    socketIdToRoomCode.delete(socket.id);
    socketIdToUserId.delete(socket.id);
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Realtime server listening on :${PORT}`);
});

function extractYouTubeId(url: string): string {
  const regex = /(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : url;
}


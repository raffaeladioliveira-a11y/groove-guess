"use client";
import { io, Socket } from "socket.io-client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type Participant = { userId: string; name: string; avatarUrl?: string; score: number };

export default function LobbyPage() {
  const params = useSearchParams();
  const name = params.get("name") || "Convidado";
  const avatarUrl = params.get("avatarUrl") || undefined;
  const [roomCode, setRoomCode] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const userId = useMemo(() => `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, []);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001");
    socketRef.current = socket;
    socket.on("connect", () => {
      if (!roomCode) {
        // ask server to create a room by joining with isHost
        socket.emit("room:join", { roomCode: "", userId, name, avatarUrl, isHost: true });
      }
    });
    socket.on("room:update", (data) => {
      setParticipants(data.participants);
      setRoomCode(data.code);
    });
    socket.on("game:start", () => {
      window.location.href = `/game/play?roomCode=${roomCode}&userId=${userId}`;
    });
    return () => socket.disconnect();
  }, [name, avatarUrl, roomCode, userId]);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">Lobby da Sala</h1>
      <div className="flex items-center gap-3">
        <span className="text-gray-600">Código da sala:</span>
        <code className="px-2 py-1 bg-gray-100 rounded font-mono">{roomCode || "…"}</code>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {participants.map((p) => (
          <div key={p.userId} className="border rounded p-3 flex items-center gap-3 bg-white">
            <img className="w-10 h-10 rounded-full object-cover" src={p.avatarUrl || `https://api.dicebear.com/7.x/thumbs/svg?seed=${p.userId}`} />
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-gray-500">{p.score} pts</div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => socketRef.current?.emit("game:start", { roomCode })} className="px-4 py-2 rounded bg-blue-600 text-white">Iniciar Jogo</button>
    </main>
  );
}

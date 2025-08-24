"use client";
import { io } from "socket.io-client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function JoinPage() {
  const params = useSearchParams();
  const name = params.get("name") || "Convidado";
  const avatarUrl = params.get("avatarUrl") || undefined;
  const [code, setCode] = useState("");

  const join = () => {
    const userId = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001");
    socket.on("connect", () => {
      socket.emit("room:join", { roomCode: code, userId, name, avatarUrl });
    });
    socket.on("room:update", () => {
      window.location.href = `/game/play?roomCode=${code}&userId=${userId}`;
    });
  };

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Entrar em Sala</h1>
      <input className="w-full border rounded px-3 py-2" placeholder="Código (6 caracteres)" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} />
      <button onClick={join} className="px-4 py-2 rounded bg-blue-600 text-white">Entrar</button>
    </main>
  );
}

"use client";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Quiz Musical</h1>
      <p className="text-sm text-gray-600">Faça login convidado por enquanto (NextAuth a seguir).</p>
      <div className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Seu nome" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="URL do avatar (opcional)" value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} />
        <div className="flex gap-2">
          <Link className="px-4 py-2 rounded bg-blue-600 text-white" href={{ pathname: "/game/lobby", query: { name, avatarUrl } }}>Criar Sala</Link>
          <Link className="px-4 py-2 rounded bg-gray-800 text-white" href={{ pathname: "/game/join", query: { name, avatarUrl } }}>Entrar em Sala</Link>
          <Link className="px-4 py-2 rounded bg-emerald-600 text-white" href="/admin">Admin</Link>
        </div>
      </div>
    </main>
  );
}

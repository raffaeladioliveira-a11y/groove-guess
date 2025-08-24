"use client";
import { io, Socket } from "socket.io-client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import YouTube from "react-youtube";

type Reveal = { correctIndex: number; updates: { userId: string; delta: number; total: number }[]; ranking: any[] };

export default function PlayPage() {
  const params = useSearchParams();
  const roomCode = params.get("roomCode") || "";
  const userId = params.get("userId") || "";
  const socketRef = useRef<Socket | null>(null);
  const [question, setQuestion] = useState<{ id: string; youtubeId: string; options: string[]; deadlineTs: number; round: number; totalRounds: number } | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [avatarsByOption, setAvatarsByOption] = useState<Record<number, string[]>>({0:[],1:[],2:[],3:[]});
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [leftMs, setLeftMs] = useState(0);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001");
    socketRef.current = socket;
    socket.on("question:show", (q) => {
      setQuestion(q);
      setPicked(null);
      setReveal(null);
      setAvatarsByOption({0:[],1:[],2:[],3:[]});
    });
    socket.on("answer:update", ({ userId: uid, optionIndex }) => {
      setAvatarsByOption((prev) => {
        const clone: Record<number, string[]> = {0:[...prev[0]],1:[...prev[1]],2:[...prev[2]],3:[...prev[3]]};
        for (let k=0;k<4;k++) clone[k] = clone[k].filter(x=>x!==uid);
        clone[optionIndex] = [...clone[optionIndex], uid];
        return clone;
      });
    });
    socket.on("answer:reveal", (payload: Reveal) => setReveal(payload));
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (!question) return;
    const id = setInterval(() => {
      setLeftMs(Math.max(0, question.deadlineTs - Date.now()));
    }, 100);
    return () => clearInterval(id);
  }, [question]);

  const submit = (idx: number) => {
    if (!question || leftMs <= 0) return;
    setPicked(idx);
    socketRef.current?.emit("answer:submit", { roomCode, questionId: question.id, optionIndex: idx, timeMs: Date.now() });
  };

  const revealAnswer = () => socketRef.current?.emit("answer:reveal");

  const opts = { playerVars: { autoplay: 1, controls: 0, disablekb: 1 } } as const;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>Rodada {question?.round ?? 0}/10</div>
        <div>Timer: {Math.ceil(leftMs/1000)}s</div>
      </div>
      {question && (
        <div className="space-y-4">
          <YouTube videoId={question.youtubeId} opts={opts} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((opt, i) => (
              <button key={i} onClick={()=>submit(i)} disabled={leftMs<=0}
                className={`border rounded p-4 text-left bg-white ${picked===i? 'ring-2 ring-blue-600':''}`}>
                <div className="font-medium">{String.fromCharCode(65+i)}. {opt}</div>
                <div className="mt-2 flex -space-x-2">
                  {(avatarsByOption[i]||[]).map((uid)=> (
                    <div key={uid} className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white" title={uid} />
                  ))}
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={revealAnswer} className="px-3 py-2 rounded bg-gray-800 text-white">Revelar</button>
          </div>
          {reveal && (
            <div className="p-4 bg-green-50 border rounded">
              <div>Correta: {String.fromCharCode(65 + reveal.correctIndex)}</div>
              <div className="mt-2">
                Ranking:
                <ol className="list-decimal ml-5">
                  {reveal.ranking.map((r) => (
                    <li key={r.userId}>{r.name} — {r.score} pts</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

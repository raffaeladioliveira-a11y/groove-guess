"use client";
import { useEffect, useState } from "react";

type Genre = { id: string; name: string };
type Album = { id: string; name: string; artist: string; genreId: string };
type Song = { id: string; title: string; artist: string; albumId: string };

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

export default function AdminPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  const refresh = async () => {
    const [g, a, s] = await Promise.all([
      fetch(`${SERVER}/admin/genres`).then(r=>r.json()),
      fetch(`${SERVER}/admin/albums`).then(r=>r.json()),
      fetch(`${SERVER}/admin/songs`).then(r=>r.json()),
    ]);
    setGenres(g); setAlbums(a); setSongs(s);
  };

  useEffect(() => { refresh(); }, []);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin</h1>
      <section>
        <h2 className="text-lg font-semibold mb-2">Gêneros</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {genres.map(g => <div key={g.id} className="border rounded p-2 bg-white">{g.name}</div>)}
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">Álbuns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {albums.map(a => <div key={a.id} className="border rounded p-3 bg-white"><div className="font-medium">{a.name}</div><div className="text-sm text-gray-600">{a.artist}</div></div>)}
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">Músicas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {songs.map(s => <div key={s.id} className="border rounded p-3 bg-white"><div className="font-medium">{s.title}</div><div className="text-sm text-gray-600">{s.artist}</div></div>)}
        </div>
      </section>
    </main>
  );
}

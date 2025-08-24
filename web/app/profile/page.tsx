"use client";
import { useState } from "react";

export default function ProfilePage() {
	const [name, setName] = useState("");
	const [avatar, setAvatar] = useState<File | null>(null);
	const [avatarUrl, setAvatarUrl] = useState("");

	const upload = async () => {
		if (!avatar) return;
		const form = new FormData();
		form.append("file", avatar);
		form.append("upload_preset", "unsigned" ); // configure seu preset no Cloudinary
		const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
		const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: "POST", body: form });
		const data = await res.json();
		setAvatarUrl(data.secure_url);
	};

	return (
		<main className="max-w-md mx-auto p-6 space-y-3">
			<h1 className="text-2xl font-bold">Perfil</h1>
			<input className="w-full border rounded px-3 py-2" placeholder="Seu nome" value={name} onChange={e=>setName(e.target.value)} />
			<input type="file" accept="image/*" onChange={e=>setAvatar(e.target.files?.[0]||null)} />
			<button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={upload}>Upload Avatar</button>
			{avatarUrl && <img src={avatarUrl} className="w-24 h-24 rounded-full" />}
		</main>
	);
}
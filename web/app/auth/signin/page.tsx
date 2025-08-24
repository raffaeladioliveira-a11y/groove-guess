"use client";
import { signIn } from "next-auth/react";

export default function SignInPage() {
	return (
		<main className="max-w-md mx-auto p-6 space-y-3">
			<h1 className="text-2xl font-bold">Entrar</h1>
			<button className="w-full px-4 py-2 bg-red-600 text-white rounded" onClick={()=>signIn("google")}>Entrar com Google</button>
			<button className="w-full px-4 py-2 bg-blue-700 text-white rounded" onClick={()=>signIn("facebook")}>Entrar com Facebook</button>
			<button className="w-full px-4 py-2 bg-indigo-700 text-white rounded" onClick={()=>signIn("microsoft")}>Entrar com Microsoft</button>
			<a className="block text-center text-sm text-gray-600" href="/">Continuar como convidado</a>
		</main>
	);
}
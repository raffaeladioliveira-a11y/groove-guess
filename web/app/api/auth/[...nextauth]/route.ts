import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Microsoft from "next-auth/providers/microsoft";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		Google({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! }),
		Facebook({ clientId: process.env.FACEBOOK_CLIENT_ID!, clientSecret: process.env.FACEBOOK_CLIENT_SECRET! }),
		Microsoft({ clientId: process.env.MICROSOFT_CLIENT_ID!, clientSecret: process.env.MICROSOFT_CLIENT_SECRET! })
	],
	pages: { signIn: "/auth/signin" },
	callbacks: {
		session: async ({ session, user }: any) => {
			if (session.user) {
				session.user.id = user.id;
				session.user.avatarUrl = (user as any).image || (user as any).avatarUrl || session.user.image;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
} as any;

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };
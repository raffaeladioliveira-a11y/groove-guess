/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

import NextAuth from "next-auth";

declare module "next-auth" {
	export interface Session {
		user?: {
			id?: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
			avatarUrl?: string | null;
		};
	}
}

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const supabase = createMiddlewareClient({ req, res });

	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Public paths that don't require authentication
	const publicPaths = ['/auth'];
	const isPublicPath = publicPaths.some((path) =>
		req.nextUrl.pathname.startsWith(path)
	);

	// If there's no session and the path is not public, redirect to auth
	if (!session && !isPublicPath) {
		const redirectUrl = req.nextUrl.clone();
		redirectUrl.pathname = '/auth';
		return NextResponse.redirect(redirectUrl);
	}

	// If there's a session and trying to access auth page, redirect to dashboard
	if (session && isPublicPath) {
		const redirectUrl = req.nextUrl.clone();
		redirectUrl.pathname = '/dashboard';
		return NextResponse.redirect(redirectUrl);
	}

	return res;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
	],
};

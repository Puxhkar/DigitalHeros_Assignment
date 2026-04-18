import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Aggressive mock detection to prevent SDK crashes
  const isMock = !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl.includes('your-project') ||
    supabaseKey.includes('your-anon-key') ||
    supabaseUrl === 'undefined';

  if (isMock) {
    const mockSession = request.cookies.get('digitalheros_mock_session');
    const user = mockSession ? JSON.parse(mockSession.value).user : null;
    const pathname = request.nextUrl.pathname;

    if (user && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (!user && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // Real Supabase logic below
  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      supabaseUrl!,
      supabaseKey!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: any[]) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith('/dashboard') && !user) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (pathname.startsWith('/admin') && !user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (user && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch (err) {
    console.error('Middleware auth error:', err);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

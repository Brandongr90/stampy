import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { routing } from '@/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First, run the intl middleware to handle locale routing
  const intlResponse = intlMiddleware(request);

  // Create a response that we'll modify with Supabase auth
  let response = intlResponse || NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // If intlResponse exists, use it; otherwise create a new response
          response = intlResponse
            ? NextResponse.redirect(intlResponse.headers.get('location') || request.url, {
                headers: intlResponse.headers,
              })
            : NextResponse.next({ request });

          // Copy cookies to the response
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Extract locale from pathname
  const localeMatch = pathname.match(/^\/(es|en)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  // Check if pathname matches protected routes (with locale prefix)
  const isDashboardRoute = pathname.match(/^\/(es|en)\/dashboard/);
  const isLoginRoute = pathname.match(/^\/(es|en)\/login$/);
  const isRegisterRoute = pathname.match(/^\/(es|en)\/register$/);

  // Protected routes - redirect to login if not authenticated
  if (!user && isDashboardRoute) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (user && (isLoginRoute || isRegisterRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  // Return the intl response with cookies preserved
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

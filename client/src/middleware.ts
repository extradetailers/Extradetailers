import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { EUserRole } from './types';
// import { refreshAccessToken } from './app/_requests/auth';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {



  // Define an array of protected pages
  const protectedPages = ["/dashboard", "/admin", "/checkout"];

  const unauthenticatedPages = ["/signin", "/signup", "/forgotten-password", "reset-password"];

  // Check to access protected pages
  const { pathname } = request.nextUrl;
  // It is not working with secure true
  // Get cookies in here 
  const cookies = request.cookies;

  if (unauthenticatedPages.some((page) => pathname.startsWith(page))) {
    const user_role = cookies.get('user_role')?.value;
    const access_token = cookies.get('access_token')?.value;
    if(user_role && access_token){
      if(user_role === EUserRole.ADMIN){
        return NextResponse.redirect(new URL('/admin', request.url));
      }
  
      if(user_role === EUserRole.CUSTOMER || user_role === EUserRole.DETAILER){
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }


  // Instead of checking one protedtected page /dashboard, check list/array of pages
  if (protectedPages.some((page) => pathname.startsWith(page))) {

    // Get access_token from cookies
    const access_token = cookies.get('access_token')?.value;
    const refresh_token = cookies.get('refresh_token')?.value;


    /*
    if(!access_token){
      const refresh_token = cookies.get('refresh_token')?.value;
      if(!refresh_token) return NextResponse.redirect(new URL('/signin', request.url));
      // Create a request with refresh token
      const response = await refreshAccessToken();
      if(response.status === 200){
        access_token = cookies.get('access_token')?.value;
      }else{
        return NextResponse.redirect(new URL('/signin', request.url));
      }
    }
    */
    const user_role = cookies.get('user_role')?.value;

    if (!refresh_token && !access_token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    if(!user_role){
      return NextResponse.redirect(new URL('/signin', request.url));
    }




    // Check admin user
    if (user_role === EUserRole.ADMIN) {
      if (pathname.startsWith('/admin')) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/admin', request.url));
      // Check customer and detailer user
    } 

    else if (user_role === EUserRole.CUSTOMER || user_role === EUserRole.DETAILER) {
      // Detailer can not go to checkout
      if (pathname.startsWith('/dashboard/checkout') && user_role === EUserRole.DETAILER) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }


      if (pathname.startsWith('/dashboard')) {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }


  return NextResponse.next();
  //   return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
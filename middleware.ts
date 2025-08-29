import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Secret used to encrypt/decrypt the JWT token
const secret = process.env.NEXTAUTH_SECRET

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl
  // 🛡️ Get the token from NextAuth session
  const token = await getToken({ req: request, secret });
  const adminToken = request.cookies.get('adminToken')?.value;
  console.log("user token is: ",token)
  // 🔐 Protect specific route (e.g., API route)
  if (pathname === '/api/get-address') {
    if (!token) {
      console.log("User is not authenticated (via next-auth)")
      const loginUrl = new URL('/login', origin)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  if (pathname === '/admin/dashboard') {
    if (!adminToken) {
      console.log("User is not authenticated (via next-auth)")
      const loginUrl = new URL('/admin/login', origin)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  if(pathname.startsWith('/proceed-to-payment') && !token){
      
      console.log("User is not authenticated (via next-auth)")
      const loginUrl = new URL('/', origin)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    
  }

  return NextResponse.next()
}

// 📍 Define the routes where middleware should run
export const config = {
  matcher: [
    '/payment',
    '/cart',
    '/api/get-address',
    '/api/razor-pay-order',
    '/api/add-to-cart',
    '/api/remove-cart-item',
    '/api/add-address',
    '/admin/:path*',
    '/proceed-to-payment/:path*'
  ],
}

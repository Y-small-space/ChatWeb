import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // 公开路由
  const publicRoutes = ['/login', '/register'];

  // 需要认证的路由
  const authRoutes = ['/chat', '/friends', '/groups', '/settings'];

  // 如果访问需要认证的路由但没有token，重定向到登录页
  if (authRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 如果已登录用户访问登录/注册页，重定向到聊天页
  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/chat/:path*',
    '/friends/:path*',
    '/groups/:path*',
    '/settings/:path*',
    '/login',
    '/register',
  ],
}; 
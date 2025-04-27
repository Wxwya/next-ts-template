import { NextRequest, NextResponse } from 'next/server';
import { IsLogin } from '@/enums/cacheEnums';
import { CacheEnums } from '@/enums/cacheEnums';
import { cookies } from 'next/headers';
export default async function authMiddleware(request: NextRequest) { 
  const cookieStore = await cookies();
  const isLogin = cookieStore.get(CacheEnums.COOKIE_KEY+IsLogin)?.value;
  const url = request.nextUrl.pathname
  if (url.includes("admin") && !url.includes("admin-login") && !isLogin) { 
    const path = new URL("/admin-login", request.url);
    path.searchParams.set('redirect', url);
    return NextResponse.redirect(path);
  }
  if (url.includes("admin-login") && isLogin) { 
    return NextResponse.redirect(new URL("/admin", request.url));
  }
}

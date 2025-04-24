import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) { 
  console.log("中间件",request);
  // if (request.nextUrl.pathname === "/") { 
  //   return NextResponse.redirect(new URL("/goodsType", request.url));
  // }
}
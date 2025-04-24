import { NextResponse } from 'next/server'
export function middleware(req: Request) {
  console.log('\x1b[32m%s\x1b[0m', `✅ ${req.url}`)
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|jpg|jpeg|png|webp|ico|js|css|json|woff|woff2|ttf)).*)'],
}


  // console.log('\x1b[31m%s\x1b[0m', '❌这是一条红色的消息');
  // console.log('\x1b[32m%s\x1b[0m', '✅这是一条绿色的消息');
  // console.log('\x1b[33m%s\x1b[0m', '⚠️这是一条黄色的消息');
  // console.log('\x1b[34m%s\x1b[0m', 'ℹ️ 这是一条蓝色的消息');
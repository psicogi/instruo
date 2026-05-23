import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const { pathname } = req.nextUrl

    // Se já está logado e tenta acessar o login, manda pro painel
    if (token && pathname === '/painel/login') {
        return NextResponse.redirect(new URL('/painel', req.url))
    }

    // Se não está logado e tenta acessar o painel (exceto login), manda pro login
    if (!token && pathname.startsWith('/painel') && pathname !== '/painel/login') {
        return NextResponse.redirect(new URL('/painel/login', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/painel/:path*'],
}
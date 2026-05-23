import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import type { AuthOptions } from 'next-auth'

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                senha: { label: 'Senha', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.senha) return null

                const conta = await (prisma as any).contaInstrutor.findUnique({
                    where: { email: credentials.email as string },
                    include: { instrutor: true },
                })

                if (!conta) return null

                const senhaOk = await bcrypt.compare(
                    credentials.senha as string,
                    conta.senha as string
                )
                if (!senhaOk) return null

                return {
                    id:    conta.instrutorId as string,
                    name:  (conta as any).instrutor.nome as string,
                    email: conta.email as string,
                }
            },
        }),
    ],
    session: { strategy: 'jwt' },
    pages: { signIn: '/painel/login' },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) token.instrutorId = user.id
            return token
        },
        async session({ session, token }: any) {
            if (session?.user) session.user.id = token.instrutorId
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
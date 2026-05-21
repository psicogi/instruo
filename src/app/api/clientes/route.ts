import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    const { nome, email, telefone } = await req.json()

    if (!nome || !email) {
        return NextResponse.json({ erro: 'Nome e email obrigatórios' }, { status: 400 })
    }

    const cliente = await prisma.cliente.upsert({
    where:  { email },
    update: { nome, telefone },
    create: { nome, email, telefone },
    })

    return NextResponse.json(cliente)
}
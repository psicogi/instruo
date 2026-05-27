import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    const { nome, email, telefone } = await req.json()

    if (!nome || !email || !telefone) {
    return NextResponse.json({ erro: 'Nome, email e telefone obrigatórios' }, { status: 400 })
    }

    // Salva telefone sempre sem formatação
    const telefoneLimpo = telefone?.replace(/\D/g, '') ?? null

    try {
        const cliente = await prisma.cliente.upsert({
        where:  { email },
        update: { nome, telefone: telefoneLimpo },
        create: { nome, email, telefone: telefoneLimpo },
        })
        return NextResponse.json(cliente)
    } catch (err) {
        console.error('Erro ao criar cliente:', err)
        return NextResponse.json({ erro: 'Erro interno' }, { status: 500 })
    }
}
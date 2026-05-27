import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const instrutorId = searchParams.get('instrutorId')
    const mes         = searchParams.get('mes')
    const ano         = searchParams.get('ano')

    if (!instrutorId || mes === null || ano === null) {
        return NextResponse.json({ erro: 'Parâmetros faltando' }, { status: 400 })
    }

    const inicio = new Date(Number(ano), Number(mes), 1)
    const fim    = new Date(Number(ano), Number(mes) + 1, 0, 23, 59)

    try {
        const agendamentos = await prisma.agendamento.findMany({
            where: {
                instrutorId,
                dataHora: { gte: inicio, lte: fim },
                status:   { in: ['PENDENTE', 'CONFIRMADO'] },
            },
            select: { dataHora: true },
    })

    const ocupados = agendamentos.map(a => ({
        dia:  a.dataHora.getDate(),
        hora: a.dataHora.toTimeString().slice(0, 5),
    }))

    return NextResponse.json(ocupados)
    } catch (err) {
        console.error('Erro ao buscar horários:', err)
        return NextResponse.json({ erro: 'Erro interno' }, { status: 500 })
    }
}
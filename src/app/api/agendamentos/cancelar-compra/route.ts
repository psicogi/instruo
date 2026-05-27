import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    const { compraId } = await req.json()
    if (!compraId) return NextResponse.json({ ok: true })

    try {
        const compra = await prisma.compra.findUnique({
            where: { id: compraId },
        })

        if (!compra || compra.statusPagamento !== 'PENDENTE') {
            return NextResponse.json({ ok: true })
        }

        // Transação atômica — ambos cancelam juntos ou nenhum cancela
        await prisma.$transaction([
            prisma.agendamento.updateMany({
                where: { compraId, status: 'PENDENTE' },
                data:  { status: 'CANCELADO' },
            }),
            prisma.compra.update({
                where: { id: compraId },
                data:  { statusPagamento: 'CANCELADO' },
            }),
        ])

    return NextResponse.json({ ok: true })
    } catch (err) {
        console.error('Erro ao cancelar compra:', err)
        return NextResponse.json({ erro: 'Erro interno' }, { status: 500 })
    }
}
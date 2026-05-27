import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Chamada por cron job ou manualmente
// Expira agendamentos pendentes com mais de 30 minutos
export async function POST() {
    const limite = new Date(Date.now() - 30 * 60 * 1000)

    const expirados = await prisma.agendamento.updateMany({
    where: {
        status:    'PENDENTE',
        createdAt: { lt: limite },
    },
    data: { status: 'CANCELADO' },
    })

    // Expira também as compras associadas
    await prisma.compra.updateMany({
        where: {
            statusPagamento: 'PENDENTE',
            createdAt:       { lt: limite },
        },
        data: { statusPagamento: 'CANCELADO' },
    })

    return NextResponse.json({
        ok:        true,
        expirados: expirados.count,
    })
}
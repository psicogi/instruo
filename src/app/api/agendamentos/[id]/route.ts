import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
    ) {
        const { id } = await params

        const agendamento = await prisma.agendamento.findUnique({
            where: { id },
            include: { compra: true },
        })

        if (!agendamento) {
            return NextResponse.json({ erro: 'Agendamento não encontrado' }, { status: 404 })
        }

        if (agendamento.status !== 'PENDENTE') {
            return NextResponse.json({ erro: 'Só é possível cancelar agendamentos pendentes' }, { status: 400 })
        }

        await prisma.agendamento.update({
            where: { id },
            data:  { status: 'CANCELADO' },
        })

        if (agendamento.compra?.statusPagamento === 'PENDENTE') {
            await prisma.compra.update({
                where: { id: agendamento.compraId },
                data:  { statusPagamento: 'CANCELADO' },
            })
        }

        return NextResponse.json({ ok: true })
}
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    // Remove formatação tanto do input quanto na busca
    const telefone = searchParams.get('telefone')?.replace(/\D/g, '')

    if (!telefone) {
        return NextResponse.json({ erro: 'Telefone obrigatório' }, { status: 400 })
    }

    try {
        // Busca com telefone limpo E formatado para cobrir os dois casos
        const cliente = await prisma.cliente.findFirst({
        where: {
            OR: [
                { telefone: { contains: telefone } },
                { telefone: telefone },
            ],
        },
    })

    if (!cliente) {
        return NextResponse.json(
            { erro: 'Nenhuma aula encontrada para este número' },
            { status: 404 }
        )
    }

    const compras = await prisma.compra.findMany({
        where: {
            clienteId:       cliente.id,
            statusPagamento: { in: ['PAGO', 'PENDENTE'] },
        },
        include: {
            pacote: {
                include: { veiculo: true },
            },
            agendamentos: {
                orderBy: { numeroAula: 'asc' },
                include: { endereco: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ cliente, compras })
    } catch (err) {
        console.error('Erro ao buscar aulas:', err)
        return NextResponse.json({ erro: 'Erro interno. Tente novamente.' }, { status: 500 })
    }
}
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const {
        clienteId, pacoteId, veiculoId, instrutorId,
        dataHora, rua, numero, complemento, bairro,
        cidade, cep, retorno, observacao,
    } = body

    // Valida campos obrigatórios
    if (!clienteId || !pacoteId || !veiculoId || !instrutorId || !dataHora) {
        return NextResponse.json({ erro: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    // Verifica conflito de horário
    const conflito = await prisma.agendamento.findFirst({
        where: {
            instrutorId,
            dataHora: new Date(dataHora),
            status: { in: ['PENDENTE', 'CONFIRMADO'] },
        },
    })
}
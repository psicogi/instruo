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

    if (conflito) {
        return NextResponse.json({ erro: 'Horário já ocupado' }, { status: 409 })
    }

    // Busca pacote
    const pacote = await prisma.pacote.findUnique({ where: { id: pacoteId } })
    if (!pacote) {
        return NextResponse.json({ erro: 'Pacote não encontrado' }, { status: 404 })
    }

    // Cria endereço
    const endereco = await prisma.endereco.create({
        data: { clienteId, rua, numero, complemento, bairro, cidade, cep, padrao: true },
    })
}
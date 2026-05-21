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

    // Cria compra
    const compra = await prisma.compra.create({
        data: {
            clienteId,
            pacoteId,
            valorPago: pacote.valorTotal,
            statusPagamento: 'PENDENTE',
        },
    })

    // Cria a 1ª aula
    const agendamento = await prisma.agendamento.create({
        data: {
            compraId:    compra.id,
            clienteId,
            instrutorId,
            veiculoId,
            enderecoId:  endereco.id,
            numeroAula:  1,
            dataHora:    new Date(dataHora),
            retornoMesmoEnd: retorno ?? true,
            observacao:  observacao ?? '',
            status:      'PENDENTE',
        },
    })

    return NextResponse.json({ compra, agendamento }, { status: 201 })
}

export async function GET() {
    const agendamentos = await prisma.agendamento.findMany({
        include: {
            cliente:  true,
            veiculo:  true,
            endereco: true,
            compra:   { include: { pacote: true } },
        },
        orderBy: { dataHora: 'asc' },
    })
    return NextResponse.json(agendamentos)
}
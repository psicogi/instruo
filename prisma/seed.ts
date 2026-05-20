import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

    await prisma.agendamento.deleteMany()
    await prisma.compra.deleteMany()
    await prisma.pacote.deleteMany()
    await prisma.veiculo.deleteMany()
    await prisma.bairroInstrutor.deleteMany()
    await prisma.endereco.deleteMany()
    await prisma.cliente.deleteMany()
    await prisma.bloqueio.deleteMany()
    await prisma.instrutor.deleteMany()

    const instrutor = await prisma.instrutor.create({
    data: {
        nome: 'Wallif Guedes',
        email: 'wallif.guedes@instruo.com',
        telefone: '(79) 99999-9999',
        bio: 'Instrutor autônomo com 3 anos de experiência. Aulas práticas para categorias A e B. Busco e levo na porta de casa.',
        credenciado: true,
        raioKm: 15,
        pixChave: 'wallif.guedes@instruo.com',
        bairros: {
            create: [
            { nome: 'Jardins' },
            { nome: '13 de Julho' },
            { nome: 'Atalaia' },
            { nome: 'Grageru' },
            { nome: 'Farolândia' },
            { nome: 'Luzia' },
            { nome: 'Centro' }
        ],
        },
        veiculos: {
        create: [
            {
            tipo: 'CARRO',
            modelo: 'VW Gol',
            categoriaCnh: 'B',
            valorAula: 120,
            ativo: true,
            },
            {
            tipo: 'MOTO',
            modelo: 'Honda CG 160 Start',
            categoriaCnh: 'A',
            valorAula: 90,
            ativo: true,
            },
        ],
        },
    },
    })
}
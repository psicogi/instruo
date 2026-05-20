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

    const veiculos = await prisma.veiculo.findMany({
    where: { instrutorId: instrutor.id },
    })
    const carro = veiculos.find(v => v.tipo === 'CARRO')!
    const moto  = veiculos.find(v => v.tipo === 'MOTO')!

    await prisma.pacote.createMany({
    data: [

        { instrutorId: instrutor.id, veiculoId: carro.id, nome: '2 aulas - Obrigatórias', quantidadeAulas: 2,  valorTotal: 200,  ativo: true },
        { instrutorId: instrutor.id, veiculoId: carro.id, nome: '4 aulas - Pacote Essencial', quantidadeAulas: 4,  valorTotal: 392,  ativo: true },
        { instrutorId: instrutor.id, veiculoId: carro.id, nome: '6 aulas - Pacote Experiente', quantidadeAulas: 6, valorTotal: 576,  ativo: true },
        { instrutorId: instrutor.id, veiculoId: carro.id, nome: '8 aulas - Pacote Intermediário', quantidadeAulas: 8, valorTotal: 752,  ativo: true },

        { instrutorId: instrutor.id, veiculoId: moto.id,  nome: '2 aulas - Obrigatórias', quantidadeAulas: 2,  valorTotal: 160,   ativo: true },
        { instrutorId: instrutor.id, veiculoId: moto.id,  nome: '4 aulas - Pacote Essencial', quantidadeAulas: 4,  valorTotal: 312.60,  ativo: true },
        { instrutorId: instrutor.id, veiculoId: moto.id,  nome: '6 aulas - Pacote Experiente', quantidadeAulas: 6, valorTotal: 460,  ativo: true },
        { instrutorId: instrutor.id, veiculoId: moto.id,  nome: '8 aulas - Pacote Intermediário', quantidadeAulas: 8, valorTotal: 601.60,  ativo: true },
    ],
    })

    console.log('✅ Seed concluído! Instrutor criado:', instrutor.nome)
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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
            // Pacotes de carro
            { instrutorId: instrutor.id, veiculoId: carro.id, nome: 'Avulsa',          quantidadeAulas: 1,  valorTotal: 120,  ativo: true },
            { instrutorId: instrutor.id, veiculoId: carro.id, nome: 'Pacote 6 aulas',  quantidadeAulas: 6,  valorTotal: 648,  ativo: true },
            { instrutorId: instrutor.id, veiculoId: carro.id, nome: 'Pacote 12 aulas', quantidadeAulas: 12, valorTotal: 1188, ativo: true },
            // Pacotes de moto
            { instrutorId: instrutor.id, veiculoId: moto.id,  nome: 'Avulsa',          quantidadeAulas: 1,  valorTotal: 90,   ativo: true },
            { instrutorId: instrutor.id, veiculoId: moto.id,  nome: 'Pacote 6 aulas',  quantidadeAulas: 6,  valorTotal: 486,  ativo: true },
            { instrutorId: instrutor.id, veiculoId: moto.id,  nome: 'Pacote 12 aulas', quantidadeAulas: 12, valorTotal: 900,  ativo: true },
        ],
    })

    const senhaHash = await bcrypt.hash('instruo123', 10)
    await prisma.contaInstrutor.upsert({
        where:  { instrutorId: instrutor.id },
        update: {},
        create: {
        email:       instrutor.email,
        senha:       senhaHash,
        instrutorId: instrutor.id,
        },
    })

    await prisma.disponibilidade.deleteMany({ where: { instrutorId: instrutor.id } })
    await prisma.disponibilidade.createMany({
        data: [1,2,3,4,5,6].map(dia => ({
        instrutorId: instrutor.id,
        diaSemana:   dia,
        horaInicio:  '07:00',
        horaFim:     '18:00',
        intervalo:   50,
        ativo:       true,
        })),
    })

    console.log('✅ Seed concluído! Instrutor criado:', instrutor.nome)
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())

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
}
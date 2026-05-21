import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const instrutor = await prisma.instrutor.findFirst({
        include: {
            veiculos: { where: { ativo: true } },
            pacotes:  { where: { ativo: true } },
        },
    })
    return NextResponse.json(instrutor)
}
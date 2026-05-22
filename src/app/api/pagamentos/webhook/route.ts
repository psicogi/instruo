import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function POST(req: NextRequest) {
    const body = await req.json()
    console.log('🔔 Webhook MP:', body)

    if (body.type === 'payment') {
        const paymentId = body.data?.id
        if (!paymentId) return NextResponse.json({ ok: true })

        try {
            const payment = new Payment(client)
            const dados   = await payment.get({ id: paymentId })

            const compraId = dados.external_reference
            const status   = dados.status

            if (!compraId) return NextResponse.json({ ok: true })

            if (status === 'approved') {
            await prisma.compra.update({
                where: { id: compraId },
                data: {
                statusPagamento: 'PAGO',
                mpPaymentId:     String(paymentId),
                metodoPagamento: 'PIX',
                },
            })

            // Confirma o agendamento
            await prisma.agendamento.updateMany({
                where: { compraId, status: 'PENDENTE' },
                data:  { status: 'CONFIRMADO' },
            })

            console.log('✅ Pagamento aprovado:', compraId)
            }

            if (status === 'cancelled' || status === 'rejected') {
                await prisma.compra.update({
                    where: { id: compraId },
                    data:  { statusPagamento: 'CANCELADO' },
                })
                console.log('❌ Pagamento cancelado:', compraId)
            }
        } catch (err) {
            console.error('Erro webhook:', err)
        }
    }

    return NextResponse.json({ ok: true })
}

export async function GET() {
    return NextResponse.json({ status: 'webhook ativo' })
}
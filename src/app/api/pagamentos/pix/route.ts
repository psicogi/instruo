import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function POST(req: NextRequest) {
    const { valor, email, nome, compraId } = await req.json()

    try {
    const payment = new Payment(client)

    const resultado = await payment.create({
            body: {
            transaction_amount: valor,
            description: 'Aula prática — Instruo',
            payment_method_id: 'pix',
            payer: {
                email,
                first_name: nome.split(' ')[0],
                last_name:  nome.split(' ').slice(1).join(' ') || 'Cliente',
            },
            external_reference: compraId,
            // notification_url: `${process.env.NEXTAUTH_URL}/api/pagamentos/webhook`,
        },
    })

    return NextResponse.json({
        id:          resultado.id,
        status:      resultado.status,
        qr_code:     resultado.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: resultado.point_of_interaction?.transaction_data?.qr_code_base64,
        ticket_url:  resultado.point_of_interaction?.transaction_data?.ticket_url,
    })
    } catch (err) {
        console.error('Erro MP:', err)
        return NextResponse.json({ erro: 'Erro ao gerar PIX' }, { status: 500 })
    }
}
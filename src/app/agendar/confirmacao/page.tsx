'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Calendar, Car, Bike, MapPin, Package, CircleCheckBig } from 'lucide-react'
import { formatarMoeda } from '@/lib/utils'

const PACOTES: Record<string, { label: string; qtd: number; totalCarro: number; totalMoto: number }> = {
    '1':  { label: 'Aula avulsa',     qtd: 1,  totalCarro: 120, totalMoto: 90  },
    '5':  { label: 'Pacote 5 aulas',  qtd: 5,  totalCarro: 550, totalMoto: 415 },
    '10': { label: 'Pacote 10 aulas', qtd: 10, totalCarro: 990, totalMoto: 765 },
}

function ConfirmacaoContent() {
    const router = useRouter()
    const params = useSearchParams()
    const [animado, setAnimado] = useState(false)

    const tipo   = params.get('tipo')   ?? 'carro'
    const pacote = params.get('pacote') ?? '1'
    const dia    = params.get('dia')    ?? ''
    const mes    = params.get('mes')    ?? ''
    const ano    = params.get('ano')    ?? ''
    const hora   = params.get('hora')   ?? ''

    const pk    = PACOTES[pacote] ?? PACOTES['1']
    const total = tipo === 'carro' ? pk.totalCarro : pk.totalMoto

    const dataAula = dia
    ? new Date(Number(ano), Number(mes), Number(dia))
        .toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : ''

    useEffect(() => {
    const t = setTimeout(() => setAnimado(true), 100)
    return () => clearTimeout(t)
    }, [])

    return (
    <main className="max-w-lg mx-auto min-h-screen flex flex-col">

      {/* NAV */}
        <nav className="flex items-center justify-center px-5 py-4"
            style={{ background: '#0a1628', borderBottom: '0.5px solid rgba(56,189,248,.15)' }}>
            <span className="text-xl font-bold" style={{ color: '#38bdf8' }}>instruo</span>
        </nav>

        <section className="px-5 py-8 flex flex-col items-center text-center flex-1">

            {/* Ícone animado */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 transition-all duration-500"
                    style={{
                        background: animado ? '#38bdf8' : '#0d1f3c',
                        transform: animado ? 'scale(1)' : 'scale(0.8)',
                        border: '3px solid rgba(56,189,248,.3)',
                    }}>
                <CircleCheckBig size={36} style={{ color: animado ? '#060e1e' : '#38bdf8' }} />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
                {pk.qtd === 1 ? 'Aula confirmada!' : 'Pacote confirmado!'}
            </h2>
            <p className="text-sm mb-8" style={{ color: '#94a3b8' }}>
                Pagamento recebido. Você e o instrutor foram notificados por e-mail.
            </p>
        </section>
    </main>
    )
}

export default function AgendarConfirmacao() {
    return (
        <Suspense>
            <ConfirmacaoContent />
        </Suspense>
    )
}
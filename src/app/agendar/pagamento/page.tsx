'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { ChevronLeft, QrCode, CreditCard, Barcode, Check } from 'lucide-react'
import { formatarMoeda } from '@/lib/utils'

const PACOTES: Record<string, { label: string; qtd: number; totalCarro: number; totalMoto: number }> = {
    '1':  { label: 'Aula avulsa',     qtd: 1,  totalCarro: 120,  totalMoto: 90  },
    '5':  { label: 'Pacote 5 aulas',  qtd: 5,  totalCarro: 550,  totalMoto: 415 },
    '10': { label: 'Pacote 10 aulas', qtd: 10, totalCarro: 990,  totalMoto: 765 },
}

const ECONOMIA: Record<string, { carro: number; moto: number }> = {
    '1':  { carro: 0,   moto: 0   },
    '5':  { carro: 50,  moto: 35  },
    '10': { carro: 210, moto: 135 },
}

type MetodoPag = 'pix' | 'cartao' | 'boleto'

function PagamentoContent() {
    const router  = useRouter()
    const params  = useSearchParams()

    const tipo    = params.get('tipo')    ?? 'carro'
    const pacote  = params.get('pacote')  ?? '1'
    const dia     = params.get('dia')     ?? ''
    const mes     = params.get('mes')     ?? ''
    const ano     = params.get('ano')     ?? ''
    const hora    = params.get('hora')    ?? ''
    const rua     = params.get('rua')     ?? ''
    const numero  = params.get('numero')  ?? ''
    const bairro  = params.get('bairro')  ?? ''
    const cidade  = params.get('cidade')  ?? ''

    const [metodo, setMetodo] = useState<MetodoPag>('pix')
    const [loading, setLoading] = useState(false)

    const pk    = PACOTES[pacote] ?? PACOTES['1']
    const total = tipo === 'carro' ? pk.totalCarro : pk.totalMoto
    const eco   = tipo === 'carro' ? ECONOMIA[pacote].carro : ECONOMIA[pacote].moto
    const base  = total + eco

    const dataAula = dia
    ? new Date(Number(ano), Number(mes), Number(dia))
        .toLocaleDateString('pt-BR', { weekday:'short', day:'numeric', month:'short' })
    : ''

    const endFormatado = [rua, numero, bairro, cidade].filter(Boolean).join(', ')

    const pagar = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    router.push(`/agendar/confirmacao?tipo=${tipo}&pacote=${pacote}&dia=${dia}&mes=${mes}&ano=${ano}&hora=${hora}`)
    }

    const metodos: { id: MetodoPag; label: string; icon: typeof QrCode }[] = [
    { id: 'pix',    label: 'PIX',    icon: QrCode     },
    { id: 'cartao', label: 'Cartão', icon: CreditCard },
    { id: 'boleto', label: 'Boleto', icon: Barcode    },
    ]

    return (
    <main className="max-w-lg mx-auto min-h-screen">

      {/* NAV */}
        <nav className="flex items-center gap-3 px-5 py-4"
            style={{ background: '#0a1628', borderBottom: '0.5px solid rgba(56,189,248,.15)' }}>
            <button onClick={() => router.back()} className="hover:opacity-70">
                <ChevronLeft size={20} style={{ color: '#38bdf8' }} />
            </button>
            <span className="text-xl font-bold" style={{ color: '#38bdf8' }}>instruo</span>
            <span className="text-sm ml-auto" style={{ color: '#94a3b8' }}>Passo 5 de 5</span>
        </nav>

        <section className="px-5 py-6">
            <h2 className="text-xl font-bold text-white mb-1">Resumo e pagamento</h2>
            <p className="text-sm mb-5" style={{ color: '#94a3b8' }}>
            Confira os detalhes antes de confirmar.
            </p>

            {/* Resumo */}
            <div className="rounded-2xl p-4 mb-5"
                style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.15)' }}>
                {[
                    { label: 'Instrutor',  valor: 'Wallif Guedes' },
                    { label: 'Tipo',       valor: tipo === 'carro' ? 'Carro — Cat. B' : 'Moto — Cat. A' },
                    { label: 'Pacote',     valor: pk.label },
                    { label: '1ª aula',    valor: `${dataAula} · ${hora}` },
                    { label: 'Embarque',   valor: endFormatado || '—' },
                ].map((item, i, arr) => (
                    <div key={item.label}>
                        <div className="flex justify-between items-start py-2 text-sm gap-4">
                            <span className="flex-shrink-0" style={{ color: '#94a3b8' }}>{item.label}</span>
                            <span className="font-medium text-white text-right">{item.valor}</span>
                        </div>
                        {i < arr.length - 1 && <div style={{ borderTop: '0.5px solid rgba(56,189,248,.08)' }} />}
                    </div>
                ))}

                <div style={{ borderTop: '0.5px solid rgba(56,189,248,.15)', marginTop: 4 }} />

                {/* Valores */}
                <div className="pt-2 space-y-1">
                    {eco > 0 && (
                    <>
                        <div className="flex justify-between text-sm">
                            <span style={{ color: '#94a3b8' }}>{pk.qtd} aulas (valor cheio)</span>
                            <span className="text-white">{formatarMoeda(base)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span style={{ color: '#4ade80' }}>Desconto do pacote</span>
                            <span style={{ color: '#4ade80' }}>– {formatarMoeda(eco)}</span>
                        </div>
                    </>
                    )}
                    <div className="flex justify-between items-center pt-1">
                        <span className="text-sm font-medium text-white">Total</span>
                        <span className="text-xl font-bold" style={{ color: '#38bdf8' }}>
                            {formatarMoeda(total)}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    </main>
    )
}

export default function AgendarPagamento() {
    return (
    <Suspense>
        <PagamentoContent />
    </Suspense>
    )
}
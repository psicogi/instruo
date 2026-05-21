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

            {/* Método de pagamento */}
            <p className="text-xs font-medium uppercase tracking-widest mb-3"
            style={{ color: '#94a3b8' }}>Forma de pagamento</p>

            <div className="grid grid-cols-3 gap-3 mb-4">
                {metodos.map(m => {
                    const Icon = m.icon
                    const ativo = metodo === m.id
                    return (
                    <button key={m.id}
                            onClick={() => setMetodo(m.id)}
                            className="py-3 rounded-xl flex flex-col items-center gap-1 text-xs font-medium transition-all"
                            style={{
                                background: ativo ? 'rgba(14,116,144,.15)' : '#0d1f3c',
                                border: ativo ? '1.5px solid #38bdf8' : '0.5px solid rgba(56,189,248,.15)',
                                color: ativo ? '#38bdf8' : '#94a3b8',
                            }}>
                        <Icon size={20} />
                        {m.label}
                    </button>
                    )
                })}
            </div>

            {/* PIX */}
            {metodo === 'pix' && (
            <div className="rounded-2xl p-4 mb-5 flex items-center gap-4"
                style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.15)' }}>
                {/* QR Code SVG simplificado */}
                <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: '#fff' }}>
                    <svg width="48" height="48" viewBox="0 0 44 44" fill="none">
                        <rect x="2"  y="2"  width="14" height="14" rx="2" fill="#111"/>
                        <rect x="5"  y="5"  width="8"  height="8"  fill="#fff"/>
                        <rect x="28" y="2"  width="14" height="14" rx="2" fill="#111"/>
                        <rect x="31" y="5"  width="8"  height="8"  fill="#fff"/>
                        <rect x="2"  y="28" width="14" height="14" rx="2" fill="#111"/>
                        <rect x="5"  y="31" width="8"  height="8"  fill="#fff"/>
                        <rect x="18" y="18" width="4" height="4" fill="#111"/>
                        <rect x="26" y="18" width="4" height="4" fill="#111"/>
                        <rect x="34" y="18" width="4" height="4" fill="#111"/>
                        <rect x="18" y="26" width="4" height="4" fill="#111"/>
                        <rect x="26" y="26" width="4" height="4" fill="#111"/>
                        <rect x="18" y="34" width="4" height="4" fill="#111"/>
                        <rect x="34" y="34" width="4" height="4" fill="#111"/>
                    </svg>
                </div>
                <div>
                    <p className="text-xs mb-1" style={{ color: '#64748b' }}>Chave PIX do instrutor</p>
                    <p className="text-sm font-medium" style={{ color: '#38bdf8' }}>
                        wallif@instruo.com
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#64748b' }}>
                        Pagamento direto ao instrutor
                    </p>
                </div>
            </div>
            )}

            {/* Cartão */}
            {metodo === 'cartao' && (
                <div className="rounded-2xl p-4 mb-5 space-y-3"
                    style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.15)' }}>
                    <input placeholder="Número do cartão"
                        className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                        style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.2)' }} />
                    <input placeholder="Nome no cartão"
                        className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                        style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.2)' }} />
                    <div className="grid grid-cols-2 gap-3">
                        <input placeholder="MM/AA"
                                className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                                style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.2)' }} />
                        <input placeholder="CVV"
                                className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                                style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.2)' }} />
                    </div>
                </div>
            )}

            {/* Boleto */}
            {metodo === 'boleto' && (
                <div className="rounded-2xl p-4 mb-5 text-sm"
                    style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.15)', color: '#94a3b8' }}>
                    O boleto será gerado após a confirmação e enviado para o seu e-mail.
                    O prazo de compensação é de até 3 dias úteis.
                </div>
            )}
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
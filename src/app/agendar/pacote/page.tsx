'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { ChevronLeft, Package } from 'lucide-react'
import { formatarMoeda } from '@/lib/utils'

const pacotesPorTipo = {
    carro: [
        { id: '1',  quantidade: 1,  total: 120,  porAula: 120, economia: 0,   label: 'Avulsa' },
        { id: '6',  quantidade: 6,  total: 648,  porAula: 108, economia: 72,  label: 'Pacote 6 aulas', popular: true },
        { id: '12', quantidade: 12, total: 1188, porAula: 99,  economia: 252, label: 'Pacote 12 aulas' },
    ],
    moto: [
        { id: '1',  quantidade: 1,  total: 90,  porAula: 90, economia: 0,   label: 'Avulsa' },
        { id: '6',  quantidade: 6,  total: 486, porAula: 81, economia: 54,  label: 'Pacote 6 aulas', popular: true },
        { id: '12', quantidade: 12, total: 900, porAula: 75, economia: 180, label: 'Pacote 12 aulas' },
    ],
}

const descricoes: Record<string, string> = {
    '1':  'Ideal para quem quer experimentar ou tem poucas aulas restantes.',
    '6':  'O pacote mais escolhido. 6 aulas no seu ritmo com desconto progressivo.',
    '12': 'Melhor custo-benefício! Ideal para quem está começando do zero.',
}

function PacotesContent() {
    const router = useRouter()
    const params = useSearchParams()
    const tipo = (params.get('tipo') ?? 'carro') as 'carro' | 'moto'
    const [selecionado, setSelecionado] = useState<string | null>(null)

    const pacotes = pacotesPorTipo[tipo] ?? pacotesPorTipo.carro
    const pacote  = pacotes.find(p => p.id === selecionado)

    return (
    <main className="max-w-lg mx-auto min-h-screen">

      {/* NAV */}
        <nav className="flex items-center gap-3 px-5 py-4"
            style={{ background: '#0a1628', borderBottom: '0.5px solid rgba(56,189,248,.15)' }}>
        <button onClick={() => router.back()} className="hover:opacity-70">
            <ChevronLeft size={20} style={{ color: '#38bdf8' }} />
        </button>
        <span className="text-xl font-bold" style={{ color: '#38bdf8' }}>instruo</span>
        <span className="text-sm ml-auto" style={{ color: '#94a3b8' }}>Passo 2 de 5</span>
        </nav>

        <section className="px-5 py-6">
        <h2 className="text-xl font-bold text-white mb-1">Escolha um pacote</h2>
        <p className="text-sm mb-6" style={{ color: '#94a3b8' }}>
            {tipo === 'carro' ? 'Aula de Carro — Categoria B' : 'Aula de Moto — Categoria A'}
        </p>

        {/* Dica */}
        <div className="flex items-start gap-2 rounded-xl px-4 py-3 mb-6 text-sm"
                style={{ background: 'rgba(56,189,248,.07)', border: '0.5px solid rgba(56,189,248,.2)', color: '#38bdf8' }}>
            <Package size={15} className="mt-0.5 flex-shrink-0" />
            <span>Pacotes com mais aulas têm desconto progressivo. Você agenda os horários individualmente após a compra.</span>
        </div>

        {/* Grid de pacotes */}
        <div className="grid grid-cols-3 gap-3 mb-6">
            {pacotes.map(p => {
            const ativo = selecionado === p.id
            return (
                <button key={p.id}
                        onClick={() => setSelecionado(p.id)}
                        className="rounded-2xl text-center transition-all relative overflow-hidden"
                        style={{
                        background: ativo ? 'rgba(14,116,144,.15)' : '#0d1f3c',
                        border: ativo ? '1.5px solid #38bdf8' : '0.5px solid rgba(56,189,248,.15)',
                        paddingTop: p.popular ? '28px' : '14px',
                        paddingBottom: '14px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        }}>

                {/* Badge popular */}
                {p.popular && (
                    <div className="absolute top-0 left-0 right-0 py-1 text-center"
                        style={{ background: '#38bdf8', fontSize: 9, fontWeight: 700,
                                color: '#060e1e', letterSpacing: '.4px' }}>
                    MAIS POPULAR
                    </div>
                )}

                {/* Check */}
                {ativo && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: '#38bdf8' }}>
                    <span style={{ color: '#060e1e', fontSize: 9, fontWeight: 700 }}>✓</span>
                    </div>
                )}

                <div className="text-2xl font-bold mb-0.5" style={{ color: '#38bdf8' }}>
                    {p.quantidade}
                </div>
                <div className="text-xs mb-2" style={{ color: '#94a3b8' }}>
                    {p.quantidade === 1 ? 'aula' : 'aulas'}
                </div>
                <div className="text-sm font-bold text-white mb-0.5">
                    {formatarMoeda(p.total)}
                </div>
                <div className="text-xs" style={{ color: '#94a3b8' }}>
                    {formatarMoeda(p.porAula)} / aula
                </div>
                {p.economia > 0 && (
                    <div className="text-xs mt-1.5 font-medium" style={{ color: '#4ade80' }}>
                    Economiza {formatarMoeda(p.economia)}
                    </div>
                )}
                </button>
            )
            })}
        </div>

        {/* Descrição do pacote selecionado */}
        {pacote && (
            <div className="rounded-xl px-4 py-3 mb-6"
                style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.15)' }}>
                <div className="text-sm font-medium text-white mb-1">{pacote.label}</div>
                <div className="text-sm" style={{ color: '#94a3b8' }}>{descricoes[pacote.id]}</div>
            </div>
        )}

        {/* Botão */}
        <button
            disabled={!selecionado}
            onClick={() => router.push(`/agendar/horario?tipo=${tipo}&pacote=${selecionado}`)}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={{
            background: selecionado ? '#38bdf8' : '#0d1f3c',
            color: selecionado ? '#060e1e' : '#94a3b8',
            border: selecionado ? 'none' : '0.5px solid rgba(56,189,248,.15)',
            opacity: selecionado ? 1 : 0.6,
            cursor: selecionado ? 'pointer' : 'not-allowed',
            }}>
            {pacote
            ? `Continuar com ${pacote.label} →`
            : 'Selecione um pacote'}
        </button>
        </section>
    </main>
    )
}

export default function AgendarPacote() {
    return (
    <Suspense>
        <PacotesContent />
    </Suspense>
    )
}
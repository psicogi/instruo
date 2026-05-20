'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Car, Bike, ShieldCheck, ChevronLeft } from 'lucide-react'
import { formatarMoeda } from '@/lib/utils'

const veiculos = [
    {
    id: 'carro',
    tipo: 'CARRO',
    nome: 'Carro',
    categoria: 'Categoria B',
    modelo: 'VW Gol',
    valorAula: 120,
    duracao: '50 minutos',
    icon: Car,
    },
    {
    id: 'moto',
    tipo: 'MOTO',
    nome: 'Moto',
    categoria: 'Categoria A',
    modelo: 'Honda CG 160 Start',
    valorAula: 90,
    duracao: '50 minutos',
    icon: Bike,
    },
]

export default function AgendarTipoAula() {
    const router = useRouter()
    const [selecionado, setSelecionado] = useState<string | null>(null)

    const veiculo = veiculos.find(v => v.id === selecionado)

    return (
    <main className="max-w-lg mx-auto min-h-screen">

      {/* NAV */}
        <nav className="flex items-center gap-3 px-5 py-4"
            style={{ background: '#0a1628', borderBottom: '0.5px solid rgba(56,189,248,.15)' }}>
            <button onClick={() => router.back()}
                    className="p-1 rounded-lg transition-opacity hover:opacity-70">
                <ChevronLeft size={20} style={{ color: '#38bdf8' }} />
            </button>
            <span className="text-xl font-bold" style={{ color: '#38bdf8' }}>instruo</span>
            <span className="text-sm ml-auto" style={{ color: '#94a3b8' }}>Passo 1 de 5</span>
        </nav>

        <section className="px-5 py-6">
            <h2 className="text-xl font-bold text-white mb-1">Qual tipo de aula?</h2>
            <p className="text-sm mb-6" style={{ color: '#94a3b8' }}>
                Cada modalidade tem veículo e valor diferentes.
            </p>

            {/* Dica */}
            <div className="flex items-start gap-2 rounded-xl px-4 py-3 mb-6 text-sm"
                    style={{ background: 'rgba(56,189,248,.07)', border: '0.5px solid rgba(56,189,248,.2)', color: '#38bdf8' }}>
                <ShieldCheck size={16} className="mt-0.5 flex-shrink-0" />
                <span>Instrutor DETRAN credenciado. Busca e retorno na porta de casa incluso.</span>
            </div>

            {/* Cards de tipo */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {veiculos.map(v => {
                const Icon = v.icon
                const ativo = selecionado === v.id
                return (
                    <button key={v.id}
                            onClick={() => setSelecionado(v.id)}
                            className="rounded-2xl p-4 text-left transition-all"
                            style={{
                            background: ativo ? 'rgba(14,116,144,.15)' : '#0d1f3c',
                            border: ativo ? '1.5px solid #38bdf8' : '0.5px solid rgba(56,189,248,.15)',
                            }}>
                    {/* Check */}
                    {ativo && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: '#38bdf8' }}>
                        <span style={{ color: '#060e1e', fontSize: 10, fontWeight: 700 }}>✓</span>
                        </div>
                    )}
                    <Icon size={32} className="mb-3"
                            style={{ color: ativo ? '#38bdf8' : '#94a3b8' }} />
                    <div className="text-base font-bold text-white mb-0.5">{v.nome}</div>
                    <div className="text-xs mb-3" style={{ color: '#94a3b8' }}>{v.categoria}</div>
                    <div className="text-lg font-bold" style={{ color: '#38bdf8' }}>
                        {formatarMoeda(v.valorAula)}
                        <span className="text-xs font-normal ml-1" style={{ color: '#94a3b8' }}>/ aula</span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#94a3b8' }}>{v.modelo}</div>
                    </button>
                )
                })}
            </div>

        </section>
    </main>
    )
}
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

        </section>
    </main>
    )
}
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { ChevronLeft } from 'lucide-react'

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

const HORARIOS = ['07:00','08:00','09:00','10:00','11:00',
                    '13:00','14:00','15:00','16:00','17:00','18:00']

// Horários fictícios ocupados para demonstração
const OCUPADOS_POR_DIA: Record<number, string[]> = {
    3:  ['08:00','10:00'],
    7:  ['09:00','14:00','16:00'],
    10: ['07:00','08:00','09:00'],
    15: ['08:00','09:00','16:00'],
    18: ['13:00','14:00'],
    22: ['10:00','11:00'],
}

// Dias sem nenhuma vaga
const DIAS_BLOQUEADOS = [1, 6, 8, 13, 20, 27]

function HorarioContent() {
    const router = useRouter()
    const params = useSearchParams()
    const tipo   = params.get('tipo')   ?? 'carro'
    const pacote = params.get('pacote') ?? '1'

    const hoje  = new Date()
    const [mes, setMes]       = useState(hoje.getMonth())
    const [ano, setAno]       = useState(hoje.getFullYear())
    const [diaSel, setDiaSel] = useState<number | null>(null)
    const [horaSel, setHoraSel] = useState<string | null>(null)

  // Primeiro dia do mês e total de dias
    const primeiroDia = new Date(ano, mes, 1).getDay()
    const totalDias   = new Date(ano, mes + 1, 0).getDate()

    const irMesAnterior = () => {
        if (mes === 0) { setMes(11); setAno(a => a - 1) }
        else setMes(m => m - 1)
        setDiaSel(null); setHoraSel(null)
    }
    const irProximoMes = () => {
        if (mes === 11) { setMes(0); setAno(a => a + 1) }
        else setMes(m => m + 1)
        setDiaSel(null); setHoraSel(null)
    }

    const isHoje   = (d: number) => d === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()
    const isPassed = (d: number) => new Date(ano, mes, d) < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
    const isBloq   = (d: number) => DIAS_BLOQUEADOS.includes(d)

    const horariosOcupados = diaSel ? (OCUPADOS_POR_DIA[diaSel] ?? []) : []

    const dataFormatada = diaSel
        ? new Date(ano, mes, diaSel).toLocaleDateString('pt-BR', { weekday:'short', day:'numeric', month:'short' })
        : null

    return (
    <main className="max-w-lg mx-auto min-h-screen">

      {/* NAV */}
        <nav className="flex items-center gap-3 px-5 py-4"
            style={{ background: '#0a1628', borderBottom: '0.5px solid rgba(56,189,248,.15)' }}>
            <button onClick={() => router.back()} className="hover:opacity-70">
            <ChevronLeft size={20} style={{ color: '#38bdf8' }} />
            </button>
            <span className="text-xl font-bold" style={{ color: '#38bdf8' }}>instruo</span>
            <span className="text-sm ml-auto" style={{ color: '#94a3b8' }}>Passo 3 de 5</span>
        </nav>

    </main>
    )
}
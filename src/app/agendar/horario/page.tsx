'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { ChevronLeft } from 'lucide-react'

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const HORARIOS = ['07:00','08:00','09:00','10:00','11:00',
                    '13:00','14:00','15:00','16:00','17:00','18:00']

type Ocupado = { dia: number; hora: string }

function HorarioContent() {
    const router = useRouter()
    const params = useSearchParams()
    const tipo   = params.get('tipo')   ?? 'carro'
    const pacote = params.get('pacote') ?? '1'

    const hoje  = new Date()
    const [mes, setMes]           = useState(hoje.getMonth())
    const [ano, setAno]           = useState(hoje.getFullYear())
    const [diaSel, setDiaSel]     = useState<number | null>(null)
    const [horaSel, setHoraSel]   = useState<string | null>(null)
    const [ocupados, setOcupados] = useState<Ocupado[]>([])
    const [instrutorId, setInstrutorId] = useState<string | null>(null)
    const [carregando, setCarregando]   = useState(false)

  // Busca o instrutorId uma vez
    useEffect(() => {
        fetch('/api/instrutor')
        .then(r => r.json())
        .then(data => setInstrutorId(data.id))
    }, [])

  // Busca horários ocupados quando mês/ano mudam
    useEffect(() => {
    if (!instrutorId) return
        setCarregando(true)
        fetch(`/api/horarios-ocupados?instrutorId=${instrutorId}&mes=${mes}&ano=${ano}`)
            .then(r => r.json())
            .then(data => { setOcupados(data); setCarregando(false) })
            .catch(() => setCarregando(false))
    }, [instrutorId, mes, ano])

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

    const diasComOcupacao = Array.from(new Set(ocupados.map(o => o.dia)))

    const diasCheios = new Set<number>(
        diasComOcupacao.filter(dia =>
        HORARIOS.every(hora =>
        ocupados.some(o => o.dia === dia && o.hora === hora)
        )
        )
    )

    const horariosOcupados = diaSel
    ? ocupados.filter(o => o.dia === diaSel).map(o => o.hora)
    : []

    const dataFormatada = diaSel
    ? new Date(ano, mes, diaSel).toLocaleDateString('pt-BR', { weekday:'short', day:'numeric', month:'short' })
    : null

    return (
    <main className="max-w-lg mx-auto min-h-screen">
        <nav className="flex items-center gap-3 px-5 py-4"
            style={{ background: '#0a1628', borderBottom: '0.5px solid rgba(56,189,248,.15)' }}>
            <button onClick={() => router.back()} className="hover:opacity-70">
                <ChevronLeft size={20} style={{ color: '#38bdf8' }} />
            </button>
            <span className="text-xl font-bold" style={{ color: '#38bdf8' }}>instruo</span>
            <span className="text-sm ml-auto" style={{ color: '#94a3b8' }}>Passo 3 de 5</span>
        </nav>

        <section className="px-5 py-6">
            <h2 className="text-xl font-bold text-white mb-1">Escolha o horário</h2>
            <p className="text-sm mb-6" style={{ color: '#94a3b8' }}>
                Data e hora da 1ª aula. As demais você agenda depois.
            </p>

            {/* CALENDÁRIO */}
            <div className="rounded-2xl p-4 mb-5"
                    style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.15)' }}>
                <div className="flex items-center justify-between mb-4">
                    <button onClick={irMesAnterior} className="hover:opacity-70 px-2 py-1 rounded-lg"
                            style={{ color: '#94a3b8', fontSize: 18 }}>‹</button>
                    <span className="text-sm font-bold text-white">
                    {MESES[mes]} {ano}
                    {carregando && <span className="ml-2 text-xs" style={{ color: '#38bdf8' }}>●</span>}
                    </span>
                    <button onClick={irProximoMes} className="hover:opacity-70 px-2 py-1 rounded-lg"
                            style={{ color: '#94a3b8', fontSize: 18 }}>›</button>
                </div>

                <div className="grid grid-cols-7 mb-2">
                    {DIAS_SEMANA.map((d, i) => (
                    <div key={i} className="text-center text-xs py-1" style={{ color: '#94a3b8' }}>{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: primeiroDia }).map((_, i) => <div key={`e-${i}`} />)}
                    {Array.from({ length: totalDias }).map((_, i) => {
                    const dia      = i + 1
                    const passado  = isPassed(dia)
                    const ehHoje   = isHoje(dia)
                    const sel      = diaSel === dia
                    const temVaga  = ocupados.some(o => o.dia === dia)
                    const disabled = passado

                    return (
                        <button key={dia}
                                disabled={disabled}
                                onClick={() => { setDiaSel(dia); setHoraSel(null) }}
                                className="aspect-square flex items-center justify-center text-xs rounded-lg transition-all relative"
                                style={{
                                background: sel   ? '#0e7490'
                                            : ehHoje ? '#38bdf8'
                                            : 'transparent',
                                color:      sel   ? '#fff'
                                            : ehHoje ? '#060e1e'
                                            : disabled ? '#334155'
                                            : '#e2e8f0',
                                border:     sel   ? '1px solid #38bdf8' : 'none',
                                cursor:     disabled ? 'not-allowed' : 'pointer',
                                fontWeight: (sel || ehHoje) ? 700 : 400,
                                opacity:    disabled ? 0.35 : 1,
                                }}>
                        {dia}
                        {/* Ponto indicando que tem horário ocupado */}
                        {temVaga && !sel && !ehHoje && (
                            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                                style={{ background: '#f97316' }} />
                        )}
                        </button>
                    )
                    })}
                </div>
            </div>

            {/* HORÁRIOS */}
            {diaSel && (
                <div className="mb-6">
                    <p className="text-xs font-medium uppercase tracking-widest mb-3"
                    style={{ color: '#94a3b8' }}>
                    Horários — {dataFormatada}
                    </p>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                    {HORARIOS.map(h => {
                        const ocupado = horariosOcupados.includes(h)
                        const sel     = horaSel === h
                        return (
                        <button key={h}
                                disabled={ocupado}
                                onClick={() => setHoraSel(h)}
                                className="py-2 rounded-xl text-xs font-medium transition-all"
                                style={{
                                    background: sel     ? '#0e7490'
                                            : ocupado ? 'rgba(239,68,68,.08)'
                                            : '#0d1f3c',
                                    color:      sel     ? '#fff'
                                            : ocupado ? '#ef4444'
                                            : '#e2e8f0',
                                    border:     sel     ? '1px solid #38bdf8'
                                            : ocupado ? '0.5px solid rgba(239,68,68,.3)'
                                            : '0.5px solid rgba(56,189,248,.15)',
                                    cursor:     ocupado ? 'not-allowed' : 'pointer',
                                    textDecoration: ocupado ? 'line-through' : 'none',
                                    opacity: ocupado ? 0.6 : 1,
                                }}>
                            {h}
                        </button>
                        )
                    })}
                </div>

                <div className="flex gap-4 text-xs" style={{ color: '#64748b' }}>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded inline-block"
                            style={{ background: '#0e7490', border: '1px solid #38bdf8' }} />
                        Selecionado
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded inline-block"
                            style={{ background: 'rgba(239,68,68,.08)', border: '0.5px solid rgba(239,68,68,.3)' }} />
                        Ocupado
                    </span>
                    <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded inline-block"
                            style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.15)' }} />
                    Disponível
                    </span>
                </div>
            </div>
        )}

            <button
                disabled={!diaSel || !horaSel}
                onClick={() => router.push(
                `/agendar/endereco?tipo=${tipo}&pacote=${pacote}&dia=${diaSel}&mes=${mes}&ano=${ano}&hora=${horaSel}`
                )}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                    background: (diaSel && horaSel) ? '#38bdf8' : '#0d1f3c',
                    color:      (diaSel && horaSel) ? '#060e1e' : '#94a3b8',
                    border:     (diaSel && horaSel) ? 'none' : '0.5px solid rgba(56,189,248,.15)',
                    opacity:    (diaSel && horaSel) ? 1 : 0.6,
                    cursor:     (diaSel && horaSel) ? 'pointer' : 'not-allowed',
                }}>
                {diaSel && horaSel
                ? `Confirmar — ${dataFormatada} às ${horaSel} →`
                : !diaSel ? 'Selecione uma data' : 'Selecione um horário'}
            </button>
        </section>
    </main>
    )
}

export default function AgendarHorario() {
    return <Suspense><HorarioContent /></Suspense>
}
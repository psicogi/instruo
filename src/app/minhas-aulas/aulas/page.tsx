'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Car, Bike, Calendar, MapPin, Clock, ChevronLeft, Package } from 'lucide-react'
import { formatarMoeda } from '@/lib/utils'

type Aula = {
    id:        string
    numeroAula: number
    dataHora:  string
    status:    string
    endereco:  { rua: string; numero: string; bairro: string }
}

type Compra = {
    id:     string
    valorPago: number
    statusPagamento: string
    pacote: {
        nome:           string
        quantidadeAulas: number
        veiculo: { tipo: string; modelo: string; categoriaCnh: string }
    }
    agendamentos: Aula[]
}

function AulasContent() {
    const params   = useSearchParams()
    const router   = useRouter()
    const telefone = params.get('telefone') ?? ''

    const [compras, setCompras]     = useState<Compra[]>([])
    const [nomeCliente, setNome]    = useState('')
    const [loading, setLoading]     = useState(true)
    const [erro, setErro]           = useState('')

    useEffect(() => {
        if (!telefone) { router.push('/minhas-aulas'); return }
        fetch(`/api/minhas-aulas?telefone=${telefone}`)
        .then(r => r.json())
        .then(data => {
            if (data.erro) { setErro(data.erro); return }
            setNome(data.cliente.nome)
            setCompras(data.compras)
        })
        .catch(() => setErro('Erro ao carregar aulas.'))
        .finally(() => setLoading(false))
    }, [telefone, router])

    const statusAula: Record<string, { label: string; cor: string; bg: string }> = {
        PENDENTE:   { label: 'Aguardando pgto', cor: '#f59e0b', bg: 'rgba(245,158,11,.12)' },
        CONFIRMADO: { label: 'Confirmada',      cor: '#22c55e', bg: 'rgba(34,197,94,.12)'  },
        CONCLUIDO:  { label: 'Concluída',       cor: '#38bdf8', bg: 'rgba(56,189,248,.12)' },
        CANCELADO:  { label: 'Cancelada',       cor: '#ef4444', bg: 'rgba(239,68,68,.12)'  },
    }

    if (loading) return (
        <main className="max-w-lg mx-auto min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: '#38bdf8', borderTopColor: 'transparent' }} />
        </main>
    )

    return (
        <main className="max-w-lg mx-auto min-h-screen">
            <nav className="flex items-center gap-3 px-5 py-4"
                style={{ background: '#0a1628', borderBottom: '0.5px solid rgba(56,189,248,.15)' }}>
                <button onClick={() => router.push('/minhas-aulas')} className="hover:opacity-70">
                <ChevronLeft size={20} style={{ color: '#38bdf8' }} />
                </button>
                <span className="text-xl font-bold" style={{ color: '#38bdf8' }}>instruo</span>
            </nav>

            <section className="px-5 py-6">
                <h2 className="text-xl font-bold text-white mb-1">Minhas aulas</h2>
                <p className="text-sm mb-6" style={{ color: '#94a3b8' }}>
                Olá, {nomeCliente.split(' ')[0]}! Aqui estão seus pacotes.
                </p>

                {erro && (
                <div className="rounded-xl p-4 mb-4 text-sm text-center"
                    style={{ background: 'rgba(239,68,68,.1)', color: '#f87171' }}>
                    {erro}
                </div>
                )}

                {compras.length === 0 && !erro && (
                <div className="rounded-2xl p-6 text-center"
                    style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.1)' }}>
                    <Package size={32} className="mx-auto mb-3" style={{ color: '#334155' }} />
                    <p className="text-sm" style={{ color: '#64748b' }}>Nenhuma compra encontrada.</p>
                </div>
                )}

                <div className="space-y-6">
                {compras.map(compra => {
                    const aulasAgendadas = compra.agendamentos.filter(a => a.status !== 'CANCELADO')
                    const total          = compra.pacote.quantidadeAulas
                    const agendadas      = aulasAgendadas.length
                    const progresso      = Math.round((agendadas / total) * 100)

                    return (
                    <div key={compra.id} className="rounded-2xl overflow-hidden"
                        style={{ border: '0.5px solid rgba(56,189,248,.2)' }}>

                        {/* Header do pacote */}
                        <div className="p-4"
                            style={{ background: '#0a1628' }}>
                        <div className="flex items-center gap-2 mb-3">
                            <div style={{ color: '#38bdf8' }}>
                            {compra.pacote.veiculo.tipo === 'CARRO'
                                ? <Car size={16} />
                                : <Bike size={16} />}
                            </div>
                            <span className="text-sm font-bold text-white">{compra.pacote.nome}</span>
                            <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                                style={{
                                    background: compra.statusPagamento === 'PAGO'
                                    ? 'rgba(34,197,94,.12)' : 'rgba(245,158,11,.12)',
                                    color: compra.statusPagamento === 'PAGO' ? '#22c55e' : '#f59e0b',
                                }}>
                            {compra.statusPagamento === 'PAGO' ? 'Pago' : 'Pendente'}
                            </span>
                        </div>

                        {/* Progresso */}
                        <div className="flex justify-between text-xs mb-1.5"
                            style={{ color: '#94a3b8' }}>
                            <span>Progresso</span>
                            <span style={{ color: '#38bdf8' }}>{agendadas} de {total} aulas agendadas</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden"
                            style={{ background: 'rgba(56,189,248,.1)' }}>
                            <div className="h-full rounded-full transition-all"
                                style={{ width: `${progresso}%`, background: '#38bdf8' }} />
                            </div>
                        </div>

                        {/* Lista de aulas */}
                        <div className="divide-y" style={{ background: '#0d1f3c', borderColor: 'rgba(56,189,248,.08)' }}>
                            {Array.from({ length: total }).map((_, idx) => {
                                const aula = aulasAgendadas.find(a => a.numeroAula === idx + 1)
                                const st   = aula ? statusAula[aula.status] : null
                                const data = aula
                                ? new Date(aula.dataHora).toLocaleDateString('pt-BR', {
                                    weekday: 'short', day: 'numeric', month: 'short',
                                    })
                                : null
                                const hora = aula
                                ? new Date(aula.dataHora).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit', minute: '2-digit',
                                    })
                                : null

                                return (
                                <div key={idx} className="flex items-center gap-3 px-4 py-3">
                                    {/* Número */}
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                        style={{
                                        background: aula ? '#38bdf8' : 'rgba(56,189,248,.1)',
                                        color:      aula ? '#060e1e' : '#475569',
                                        }}>
                                    {idx + 1}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                    {aula ? (
                                        <>
                                        <div className="flex items-center gap-1.5 text-xs text-white mb-0.5">
                                            <Calendar size={11} style={{ color: '#38bdf8' }} />
                                            <span>{data} · {hora}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs"
                                            style={{ color: '#94a3b8' }}>
                                            <MapPin size={11} />
                                            <span>{aula.endereco.rua}, {aula.endereco.numero} · {aula.endereco.bairro}</span>
                                        </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-xs"
                                            style={{ color: '#475569' }}>
                                        <Clock size={11} />
                                        <span>Aula {idx + 1} — a agendar</span>
                                        </div>
                                    )}
                                    </div>

                                    {/* Status ou botão agendar */}
                                    {aula ? (
                                    <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                                            style={{ background: st?.bg, color: st?.cor }}>
                                        {st?.label}
                                    </span>
                                    ) : (
                                    <button
                                        onClick={() => router.push(
                                        `/agendar/horario?tipo=${compra.pacote.veiculo.tipo.toLowerCase()}&pacote=${compra.pacote.quantidadeAulas}&compraId=${compra.id}&numeroAula=${idx + 1}`
                                        )}
                                        className="text-xs px-3 py-1.5 rounded-lg font-medium flex-shrink-0 transition-all hover:opacity-80"
                                        style={{ background: 'rgba(56,189,248,.1)', color: '#38bdf8',
                                                border: '0.5px solid rgba(56,189,248,.3)' }}>
                                        Agendar
                                    </button>
                                    )}
                                </div>
                                )
                            })}
                        </div>

                        {/* Rodapé com valor */}
                        <div className="px-4 py-3 flex justify-between items-center text-xs"
                            style={{ background: '#060e1e', color: '#64748b' }}>
                            <span>{compra.pacote.veiculo.modelo} · Cat. {compra.pacote.veiculo.categoriaCnh}</span>
                            <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                                {formatarMoeda(compra.valorPago)}
                            </span>
                        </div>
                    </div>
                    )
                })}
                </div>
            </section>
        </main>
    )
}

export default function MinhasAulasPage() {
    return <Suspense><AulasContent /></Suspense>
}
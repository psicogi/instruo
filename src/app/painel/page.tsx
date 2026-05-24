import { prisma } from '@/lib/prisma'
import { formatarMoeda } from '@/lib/utils'
import { Car, Bike, MapPin, Package, Clock } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Painel() {
    const session = await getServerSession()
    if (!session) redirect('/painel/login')

    const instrutor = await prisma.instrutor.findFirst()
    if (!instrutor) return null

    const hoje = new Date()
    const inicioDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
    const fimDia    = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59)

    const [agendamentosHoje, totalMes, totalSemana] = await Promise.all([
        prisma.agendamento.findMany({
            where: {
                instrutorId: instrutor.id,
                dataHora: { gte: inicioDia, lte: fimDia },
            },
            include: {
                cliente:  true,
                veiculo:  true,
                endereco: true,
                compra:   { include: { pacote: true } },
            },
            orderBy: { dataHora: 'asc' },
            }),
            prisma.compra.aggregate({
            where: {
                pacote: { instrutorId: instrutor.id },
                statusPagamento: 'PAGO',
                createdAt: {
                gte: new Date(hoje.getFullYear(), hoje.getMonth(), 1),
                },
            },
            _sum: { valorPago: true },
            }),
            prisma.compra.aggregate({
            where: {
                pacote: { instrutorId: instrutor.id },
                statusPagamento: 'PAGO',
                createdAt: {
                gte: new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000),
                },
            },
            _sum: { valorPago: true },
        }),
    ])

    const totalAgendamentosMes = await prisma.agendamento.count({
        where: {
            instrutorId: instrutor.id,
            dataHora: { gte: new Date(hoje.getFullYear(), hoje.getMonth(), 1) },
        },
    })

    const statusLabel: Record<string, { label: string; cor: string; bg: string }> = {
        PENDENTE:   { label: 'Pendente',   cor: '#f59e0b', bg: 'rgba(245,158,11,.12)'  },
        CONFIRMADO: { label: 'Confirmado', cor: '#22c55e', bg: 'rgba(34,197,94,.12)'   },
        CONCLUIDO:  { label: 'Concluído',  cor: '#38bdf8', bg: 'rgba(56,189,248,.12)'  },
        CANCELADO:  { label: 'Cancelado',  cor: '#ef4444', bg: 'rgba(239,68,68,.12)'   },
    }

    return (
    <main className="max-w-lg mx-auto min-h-screen">

      {/* NAV */}
        <nav className="flex items-center justify-between px-5 py-4"
            style={{ background: '#0a1628', borderBottom: '0.5px solid rgba(56,189,248,.15)' }}>
            <span className="text-xl font-bold" style={{ color: '#38bdf8' }}>instruo</span>
            <span className="text-xs px-3 py-1 rounded-full"
                    style={{ background: 'rgba(56,189,248,.1)', color: '#38bdf8' }}>
                Painel do instrutor
            </span>
        </nav>

      {/* HEADER */}
        <div className="px-5 py-5"
            style={{ background: '#0a1628', borderBottom: '0.5px solid rgba(56,189,248,.1)' }}>
            <h1 className="text-xl font-bold text-white mb-0.5">
                Olá, {instrutor.nome.split(' ')[0]} 👋
            </h1>
            <p className="text-sm" style={{ color: '#94a3b8' }}>
                {hoje.toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long' })}
                {' · '}{agendamentosHoje.length} aula{agendamentosHoje.length !== 1 ? 's' : ''} hoje
            </p>
        </div>

      {/* STATS */}
        <div className="grid grid-cols-3 gap-3 px-5 py-4">
            {[
                { label: 'Esta semana', valor: formatarMoeda(totalSemana._sum.valorPago ?? 0) },
                { label: 'Aulas no mês', valor: String(totalAgendamentosMes) },
                { label: 'Avaliação', valor: '4.9 ⭐' },
                ].map(s => (
                <div key={s.label} className="rounded-xl p-3 text-center"
                    style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.15)' }}>
                <div className="text-lg font-bold mb-0.5" style={{ color: '#38bdf8' }}>{s.valor}</div>
                <div className="text-xs" style={{ color: '#94a3b8' }}>{s.label}</div>
                </div>
            ))}
        </div>

      {/* AGENDA DO DIA */}
        <div className="px-5 pb-6">
            <p className="text-xs font-medium uppercase tracking-widest mb-4"
                style={{ color: '#94a3b8' }}>
                Agenda de hoje
            </p>

            {agendamentosHoje.length === 0 ? (
                <div className="rounded-2xl p-6 text-center"
                    style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.1)' }}>
                <Clock size={32} className="mx-auto mb-3" style={{ color: '#334155' }} />
                <p className="text-sm" style={{ color: '#64748b' }}>Nenhuma aula agendada para hoje.</p>
                </div>
            ) : (
            <div className="space-y-3">
                {agendamentosHoje.map(ag => {
                const hora  = ag.dataHora.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })
                const st    = statusLabel[ag.status] ?? statusLabel.PENDENTE
                const iniciais = ag.cliente.nome.split(' ').map(n => n[0]).slice(0,2).join('')

                return (
                    <div key={ag.id} className="rounded-2xl p-4"
                        style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.15)' }}>
                        <div className="flex items-center gap-3 mb-3">

                            {/* Hora */}
                            <div className="text-center min-w-[44px]">
                            <div className="text-base font-bold text-white">{hora}</div>
                            </div>

                            {/* Linha */}
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ background: '#38bdf8' }} />

                            {/* Cliente */}
                            <div className="flex items-center gap-2 flex-1">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                    style={{ background: '#38bdf8', color: '#060e1e' }}>
                                    {iniciais}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">{ag.cliente.nome}</div>
                                    <div className="text-xs" style={{ color: '#94a3b8' }}>
                                        {ag.cliente.telefone ?? ag.cliente.email}
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <span className="text-xs px-2 py-1 rounded-full font-medium"
                                style={{ background: st.bg, color: st.cor }}>
                                {st.label}
                            </span>
                        </div>

                        {/* Detalhes */}
                        <div className="space-y-1.5 pl-14">
                            <div className="flex items-center gap-2 text-xs" style={{ color: '#94a3b8' }}>
                                {ag.veiculo.tipo === 'CARRO'
                                    ? <Car size={12} />
                                    : <Bike size={12} />}
                                <span>
                                    {ag.veiculo.tipo === 'CARRO' ? 'Carro' : 'Moto'} — Cat. {ag.veiculo.categoriaCnh} · {ag.veiculo.modelo}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs" style={{ color: '#94a3b8' }}>
                                <MapPin size={12} />
                                <span>{ag.endereco.rua}, {ag.endereco.numero} · {ag.endereco.bairro}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs" style={{ color: '#94a3b8' }}>
                                <Package size={12} />
                                <span>
                                    {ag.compra.pacote.nome} · Aula {ag.numeroAula}/{ag.compra.pacote.quantidadeAulas}
                                </span>
                            </div>
                        </div>
                    </div>
                    )
                })}
            </div>
        )}
        </div>
    </main>
    )
}
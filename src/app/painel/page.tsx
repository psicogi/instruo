import { prisma } from '@/lib/prisma'
import { formatarMoeda } from '@/lib/utils'
import { Car, Bike, MapPin, Package, Clock } from 'lucide-react'

export default async function Painel() {
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
    </main>
    )
}
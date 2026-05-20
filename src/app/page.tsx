import { prisma } from '@/lib/prisma'
import { formatarMoeda } from '@/lib/utils'
import { MapPin, ShieldCheck, Star, Users, Car, Bike } from 'lucide-react'
import Link from 'next/link'

export default async function Home() {
  const instrutor = await prisma.instrutor.findFirst({
    include: {
      bairros:  true,
      veiculos: { where: { ativo: true } },
    },
  })

  if (!instrutor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400">Nenhum instrutor encontrado.</p>
      </div>
    )
  }

  const iniciais = instrutor.nome
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')

  return (
    <main className="max-w-lg mx-auto min-h-screen">

      {/* NAV */}
      <nav className="flex items-center justify-between px-5 py-4"
            style={{ background: 'var(--fundo2)', borderBottom: '0.5px solid var(--borda)' }}>
        <span className="text-xl font-bold" style={{ color: 'var(--azul)' }}>
          instruo
        </span>
        <button className="text-sm font-medium px-4 py-1.5 rounded-full"
                style={{ background: 'var(--azul)', color: 'var(--fundo)' }}>
          Entrar
        </button>
      </nav>

      {/* HERO */}
      <section className="px-5 py-6 relative overflow-hidden"
                style={{ background: 'var(--fundo2)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
              style={{ background: 'var(--azul)', transform: 'translate(30%,-30%)' }} />

        {/* Avatar + nome */}
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                style={{ background: 'var(--azul)', color: 'var(--fundo)', border: '2px solid rgba(56,189,248,.3)' }}>
            {iniciais}
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{instrutor.nome}</h1>
            <p className="text-sm" style={{ color: 'var(--subtexto)' }}>
              Instrutor autônomo de autoescola
            </p>
            {instrutor.credenciado && (
              <span className="inline-flex items-center gap-1 text-xs mt-1 px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(56,189,248,.1)', color: 'var(--azul)' }}>
                <ShieldCheck size={11} /> DETRAN credenciado
              </span>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4 relative z-10">
          {instrutor.veiculos.map(v => (
            <span key={v.id} className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full"
                  style={{ background: 'rgba(56,189,248,.14)', color: 'var(--azul)' }}>
              {v.tipo === 'CARRO' ? <Car size={11} /> : <Bike size={11} />}
              {v.tipo === 'CARRO' ? 'Carro' : 'Moto'}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(251,191,36,.12)', color: '#fbbf24' }}>
            <MapPin size={11} /> Sergipe
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(56,189,248,.14)', color: 'var(--azul)' }}>
            🏠 Busca na porta
          </span>
        </div>

        {/* Stats */}
        <div className="flex gap-6 relative z-10">
          {[
            { valor: '5.0', label: 'Avaliação' },
            { valor: '312', label: 'Alunos' },
            { valor: '3 anos', label: 'Experiência' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-xl font-bold" style={{ color: 'var(--azul)' }}>{s.valor}</div>
              <div className="text-xs" style={{ color: 'var(--subtexto)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
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

      {/* CONTEÚDO */}
      <section className="px-5 py-5 space-y-6">

        {/* CNH */}
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-3"
              style={{ color: 'var(--subtexto)' }}>Categorias CNH</p>
          <div className="flex gap-2">
            {(['A','B','C','D','E'] as const).map(cat => {
              const ativa = instrutor.veiculos.some(v => v.categoriaCnh === cat)
              return (
                <div key={cat}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={ativa
                        ? { background: 'var(--azul)', color: 'var(--fundo)' }
                        : { background: 'var(--fundo3)', color: 'var(--subtexto)',
                            border: '0.5px solid var(--borda)' }}>
                  {cat}
                </div>
              )
            })}
          </div>
        </div>

        {/* Veículos */}
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-3"
              style={{ color: 'var(--subtexto)' }}>Veículos</p>
          <div className="grid grid-cols-2 gap-3">
            {instrutor.veiculos.map(v => (
              <div key={v.id} className="rounded-xl p-3"
                    style={{ background: 'var(--fundo3)', border: '0.5px solid var(--borda)' }}>
                <div className="mb-2" style={{ color: 'var(--azul)' }}>
                  {v.tipo === 'CARRO' ? <Car size={18} /> : <Bike size={18} />}
                </div>
                <div className="text-xs mb-1" style={{ color: 'var(--subtexto)' }}>
                  {v.tipo === 'CARRO' ? 'Carro' : 'Moto'}
                </div>
                <div className="text-sm font-medium text-white">{v.modelo}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--azul)' }}>
                  {formatarMoeda(v.valorAula)} / aula
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área de atuação */}
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-3"
              style={{ color: 'var(--subtexto)' }}>Área de atuação</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3"
                  style={{ background: 'var(--fundo3)', border: '0.5px solid var(--borda)' }}>
              <MapPin size={17} className="mb-2" style={{ color: 'var(--azul)' }} />
              <div className="text-xs mb-1" style={{ color: 'var(--subtexto)' }}>Bairros</div>
              <div className="text-sm font-medium text-white">
                {instrutor.bairros.map(b => b.nome).join(', ')}
              </div>
            </div>
            <div className="rounded-xl p-3"
                  style={{ background: 'var(--fundo3)', border: '0.5px solid var(--borda)' }}>
              <MapPin size={17} className="mb-2" style={{ color: 'var(--azul)' }} />
              <div className="text-xs mb-1" style={{ color: 'var(--subtexto)' }}>Região de atendimento</div>
              <div className="text-sm font-medium text-white">Aracaju e região</div>
            </div>
          </div>
        </div>

        {/* Avaliações */}
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-3"
              style={{ color: 'var(--subtexto)' }}>Avaliações</p>
          {[
            { nome: 'Giovana Dantas',  texto: 'Ótimo instrutor, muito paciente. Me buscou em casa e passei na primeira!', tempo: 'há 3 dias' },
            { nome: 'Ana Martins',  texto: 'Fiz o pacote de moto, valeu demais. Pontual e profissional.', tempo: 'há 1 semana' },
          ].map(r => (
            <div key={r.nome} className="rounded-xl p-3 mb-3"
                  style={{ background: 'var(--fundo3)', border: '0.5px solid var(--borda)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'var(--azul)', color: 'var(--fundo)' }}>
                  {r.nome.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{r.nome}</div>
                  <div className="text-yellow-400 text-xs">★★★★★</div>
                </div>
                <span className="ml-auto text-xs" style={{ color: 'var(--subtexto)' }}>{r.tempo}</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--subtexto)' }}>{r.texto}</p>
            </div>
          ))}
        </div>

        {/* Botão */}
        <Link href="/agendar"
              className="block w-full text-center py-3 rounded-xl text-sm font-bold"
              style={{ background: 'var(--azul)', color: 'var(--fundo)' }}>
          Agendar aula →
        </Link>

      </section>
    </main>
  )
}
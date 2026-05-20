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
    </main>
  )
}
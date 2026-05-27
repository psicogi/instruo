'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, BookOpen } from 'lucide-react'

export default function MinhasAulas() {
    const router = useRouter()
    const [telefone, setTelefone] = useState('')
    const [loading, setLoading]   = useState(false)
    const [erro, setErro]         = useState('')

    const formatarTel = (v: string) => {
        const s = v.replace(/\D/g, '').slice(0, 11)
        if (s.length <= 2)  return s
        if (s.length <= 7)  return `(${s.slice(0,2)}) ${s.slice(2)}`
        if (s.length <= 11) return `(${s.slice(0,2)}) ${s.slice(2,7)}-${s.slice(7)}`
        return s
    }

    const buscar = async () => {
        if (telefone.replace(/\D/g, '').length < 10) {
        setErro('Digite um número válido com DDD.')
        return
    }
    setLoading(true)
    setErro('')

    const res = await fetch(`/api/minhas-aulas?telefone=${telefone.replace(/\D/g, '')}`)

    if (res.ok) {
        router.push(`/minhas-aulas/aulas?telefone=${telefone.replace(/\D/g, '')}`)
        } else {
        const data = await res.json()
        setErro(data.erro ?? 'Número não encontrado.')
        }
        setLoading(false)
    }

    return (
        <main className="max-w-sm mx-auto min-h-screen flex flex-col items-center justify-center px-5">

            {/* Logo */}
            <div className="mb-8 text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: '#38bdf8' }}>instruo</div>
                <p className="text-sm" style={{ color: '#94a3b8' }}>Acesse suas aulas</p>
            </div>

            <div className="w-full rounded-2xl p-6 space-y-4"
                style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.15)' }}>

                <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(56,189,248,.1)' }}>
                    <BookOpen size={18} style={{ color: '#38bdf8' }} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-white">Minhas aulas</h2>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>Digite seu WhatsApp para acessar</p>
                </div>
                </div>

                <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                        style={{ color: '#94a3b8' }}>WhatsApp com DDD</label>
                <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: '#475569' }} />
                    <input value={telefone}
                        onChange={e => setTelefone(formatarTel(e.target.value))}
                        onKeyDown={e => e.key === 'Enter' && buscar()}
                        type="tel"
                        placeholder="(79) 99999-9999"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-white outline-none"
                        style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.2)' }} />
                </div>
                </div>

                {erro && (
                <p className="text-xs text-center py-2 rounded-lg"
                    style={{ background: 'rgba(239,68,68,.1)', color: '#f87171' }}>
                    {erro}
                </p>
                )}

                <button onClick={buscar} disabled={loading}
                        className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                        style={{
                        background: loading ? '#0d1f3c' : '#38bdf8',
                        color:      loading ? '#94a3b8' : '#060e1e',
                        cursor:     loading ? 'not-allowed' : 'pointer',
                        }}>
                {loading ? 'Buscando...' : 'Acessar minhas aulas →'}
                </button>
            </div>
        </main>
    )
}
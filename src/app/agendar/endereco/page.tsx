'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { ChevronLeft, Car, Info } from 'lucide-react'

function EnderecoContent() {
    const router = useRouter()
    const params = useSearchParams()
    const tipo   = params.get('tipo')   ?? 'carro'
    const pacote = params.get('pacote') ?? '1'
    const dia    = params.get('dia')    ?? ''
    const mes    = params.get('mes')    ?? ''
    const ano    = params.get('ano')    ?? ''
    const hora   = params.get('hora')   ?? ''

    const [retorno, setRetorno] = useState(true)
    const [form, setForm] = useState({
        cep: '', rua: '', numero: '', complemento: '',
        bairro: '', cidade: 'Aracaju', observacao: '',
    })

    const set = (campo: string, val: string) =>
        setForm(f => ({ ...f, [campo]: val }))

    const formatarCep = (v: string) => {
        const s = v.replace(/\D/g, '').slice(0, 8)
        return s.length > 5 ? s.slice(0, 5) + '-' + s.slice(5) : s
    }

    const completo = form.cep.length >= 9 && form.rua && form.numero && form.bairro

    const queryBase = `tipo=${tipo}&pacote=${pacote}&dia=${dia}&mes=${mes}&ano=${ano}&hora=${hora}`
    const queryEnd  = `rua=${encodeURIComponent(form.rua)}&numero=${encodeURIComponent(form.numero)}`+
                    `&complemento=${encodeURIComponent(form.complemento)}`+
                    `&bairro=${encodeURIComponent(form.bairro)}&cidade=${encodeURIComponent(form.cidade)}`+
                    `&cep=${encodeURIComponent(form.cep)}&retorno=${retorno}`+
                    `&obs=${encodeURIComponent(form.observacao)}`

    return (
    <main className="max-w-lg mx-auto min-h-screen">

      {/* NAV */}
        <nav className="flex items-center gap-3 px-5 py-4"
            style={{ background: '#0a1628', borderBottom: '0.5px solid rgba(56,189,248,.15)' }}>
        <button onClick={() => router.back()} className="hover:opacity-70">
            <ChevronLeft size={20} style={{ color: '#38bdf8' }} />
        </button>
        <span className="text-xl font-bold" style={{ color: '#38bdf8' }}>instruo</span>
        <span className="text-sm ml-auto" style={{ color: '#94a3b8' }}>Passo 4 de 5</span>
        </nav>

        <section className="px-5 py-6">
        <h2 className="text-xl font-bold text-white mb-1">Endereço de embarque</h2>
        <p className="text-sm mb-5" style={{ color: '#94a3b8' }}>
            O instrutor vai buscar você neste endereço.
        </p>

        {/* Aviso */}
        <div className="flex items-start gap-2 rounded-xl px-4 py-3 mb-5 text-sm"
                style={{ background: 'rgba(56,189,248,.07)', border: '0.5px solid rgba(56,189,248,.2)', color: '#38bdf8' }}>
            <Car size={15} className="mt-0.5 flex-shrink-0" />
            <span>O instrutor confirmará se o endereço está na área de atendimento antes de aceitar o agendamento.</span>
        </div>
        </section>
    </main>
    )
}
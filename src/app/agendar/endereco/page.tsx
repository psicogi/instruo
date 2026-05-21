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

            {/* Formulário */}
                <div className="rounded-2xl p-4 mb-4 space-y-3"
                    style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.15)' }}>

                {/* CEP */}
                    <div>
                        <label className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                                style={{ color: '#94a3b8' }}>CEP</label>
                            <input value={form.cep}
                                onChange={e => set('cep', formatarCep(e.target.value))}
                                placeholder="00000-000"
                                maxLength={9}
                                className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none transition-all"
                                style={{ background: '#060e1e', border: `0.5px solid ${form.cep ? '#38bdf8' : 'rgba(56,189,248,.2)'}` }} />
                    </div>

                {/* Rua */}
                    <div>
                        <label className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                                style={{ color: '#94a3b8' }}>Rua / Avenida</label>
                            <input value={form.rua}
                                onChange={e => set('rua', e.target.value)}
                                placeholder="Ex: Av. Beira Mar"
                                className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none transition-all"
                                style={{ background: '#060e1e', border: `0.5px solid ${form.rua ? '#38bdf8' : 'rgba(56,189,248,.2)'}` }} />
                    </div>

                {/* Número e Complemento */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                                    style={{ color: '#94a3b8' }}>Número</label>
                            <input value={form.numero}
                                    onChange={e => set('numero', e.target.value)}
                                    placeholder="Ex: 1200"
                                    className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                                    style={{ background: '#060e1e', border: `0.5px solid ${form.numero ? '#38bdf8' : 'rgba(56,189,248,.2)'}` }} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                                    style={{ color: '#94a3b8' }}>Complemento</label>
                            <input value={form.complemento}
                                    onChange={e => set('complemento', e.target.value)}
                                    placeholder="Apto, bloco..."
                                    className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                                    style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.2)' }} />
                        </div>
                    </div>

                {/* Bairro e Cidade */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                                    style={{ color: '#94a3b8' }}>Bairro</label>
                            <input value={form.bairro}
                                    onChange={e => set('bairro', e.target.value)}
                                    placeholder="Ex: Jardins"
                                    className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                                    style={{ background: '#060e1e', border: `0.5px solid ${form.bairro ? '#38bdf8' : 'rgba(56,189,248,.2)'}` }} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                                    style={{ color: '#94a3b8' }}>Cidade</label>
                            <input value={form.cidade}
                                    onChange={e => set('cidade', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                                    style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.2)' }} />
                        </div>
                    </div>

            {/* Divider */}
                <div style={{ borderTop: '0.5px solid rgba(56,189,248,.1)' }} />

                {/* Toggle retorno */}
                    <button onClick={() => setRetorno(r => !r)}
                            className="flex items-center gap-3 w-full py-1">
                    <div className="relative w-9 h-5 rounded-full flex-shrink-0 transition-colors"
                            style={{ background: retorno ? '#38bdf8' : '#1e3a5f' }}>
                        <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                            style={{ left: retorno ? '18px' : '2px' }} />
                    </div>
                    <span className="text-sm text-left" style={{ color: '#e2e8f0' }}>
                        Retornar ao mesmo endereço após a aula
                    </span>
                    </button>
                </div>

            {/* Observação */}
            <div className="rounded-2xl p-4 mb-5"
                    style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.15)' }}>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                        style={{ color: '#94a3b8' }}>Observação ao instrutor (opcional)</label>
                <textarea value={form.observacao}
                        onChange={e => set('observacao', e.target.value)}
                        rows={3}
                        placeholder="Ex: Portão azul, campainha 2, ligar antes de chegar..."
                        className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none resize-none"
                        style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.2)' }} />
            </div>

            {/* Info */}
            <div className="flex items-start gap-2 mb-5 text-xs"
                    style={{ color: '#64748b' }}>
                <Info size={13} className="mt-0.5 flex-shrink-0" />
                <span>O endereço cadastrado será usado em todas as aulas do pacote. Você pode editar em cada aula individualmente.</span>
            </div>

            {/* Botão */}
            <button
                disabled={!completo}
                onClick={() => router.push(`/agendar/pagamento?${queryBase}&${queryEnd}`)}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                background: completo ? '#38bdf8' : '#0d1f3c',
                color:      completo ? '#060e1e' : '#94a3b8',
                border:     completo ? 'none' : '0.5px solid rgba(56,189,248,.15)',
                opacity:    completo ? 1 : 0.6,
                cursor:     completo ? 'pointer' : 'not-allowed',
                }}>
                {completo ? 'Confirmar endereço →' : 'Preencha o endereço completo'}
            </button>
        </section>
    </main>
    )
}

export default function AgendarEndereco() {
    return (
    <Suspense>
        <EnderecoContent />
    </Suspense>
    )
}
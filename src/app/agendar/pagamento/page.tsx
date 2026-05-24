'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { ChevronLeft, QrCode, CreditCard, Barcode, Check } from 'lucide-react'
import { formatarMoeda } from '@/lib/utils'

const PACOTES: Record<string, { label: string; qtd: number; totalCarro: number; totalMoto: number }> = {
    '1':  { label: 'Aula avulsa',      qtd: 1,  totalCarro: 120,  totalMoto: 90  },
    '6':  { label: 'Pacote 6 aulas',   qtd: 6,  totalCarro: 648,  totalMoto: 486 },
    '12': { label: 'Pacote 12 aulas',  qtd: 12, totalCarro: 1188, totalMoto: 900 },
}

const ECONOMIA: Record<string, { carro: number; moto: number }> = {
    '1':  { carro: 0,   moto: 0   },
    '6':  { carro: 72,  moto: 54  },
    '12': { carro: 252, moto: 180 },
}

type MetodoPag = 'pix' | 'cartao' | 'boleto'

function PagamentoContent() {
    const router  = useRouter()
    const params  = useSearchParams()

    const tipo    = params.get('tipo')    ?? 'carro'
    const pacote  = params.get('pacote')  ?? '1'
    const dia     = params.get('dia')     ?? ''
    const mes     = params.get('mes')     ?? ''
    const ano     = params.get('ano')     ?? ''
    const hora    = params.get('hora')    ?? ''
    const rua     = params.get('rua')     ?? ''
    const numero  = params.get('numero')  ?? ''
    const bairro  = params.get('bairro')  ?? ''
    const cidade  = params.get('cidade')  ?? ''

const [metodo, setMetodo]       = useState<MetodoPag>('pix')
const [loading, setLoading]     = useState(false)
const [nome, setNome]           = useState('')
const [email, setEmail]         = useState('')
const [telefone, setTelefone]   = useState('')
const [pixQr, setPixQr]         = useState<string | null>(null)
const [pixCopia, setPixCopia]   = useState<string | null>(null)
const [copiado, setCopiado]     = useState(false)
const [compraId, setCompraId]   = useState<string | null>(null)

const pk    = PACOTES[pacote] ?? PACOTES['1']
const total = tipo === 'carro' ? pk.totalCarro : pk.totalMoto
const eco   = tipo === 'carro' ? ECONOMIA[pacote].carro : ECONOMIA[pacote].moto
const base  = total + eco

const dataAula = dia
    ? new Date(Number(ano), Number(mes), Number(dia))
        .toLocaleDateString('pt-BR', { weekday:'short', day:'numeric', month:'short' })
    : ''

const endFormatado = [rua, numero, bairro, cidade].filter(Boolean).join(', ')

const pagar = async () => {
    if (!nome || !email) {
    alert('Preencha seu nome e e-mail para continuar.')
    return
    }
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!emailValido) {
        alert('Digite um e-mail válido. Ex: seunome@gmail.com')
        return
    }
    setLoading(true)
    try {
    const resCliente = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone }),
    })
    const cliente = await resCliente.json()

    const resInstrutor = await fetch('/api/instrutor')
    const instrutor    = await resInstrutor.json()
    const veiculo      = instrutor.veiculos.find(
        (v: { tipo: string }) => v.tipo === (tipo === 'carro' ? 'CARRO' : 'MOTO')
    )
    const pacoteDB = instrutor.pacotes.find(
        (p: { veiculoId: string; quantidadeAulas: number }) =>
        p.veiculoId === veiculo?.id && p.quantidadeAulas === pk.qtd
    )

    if (!pacoteDB) {
        alert('Pacote não encontrado. Tente novamente.')
        setLoading(false)
        return
    }

    const dataHora = new Date(
        Number(ano), Number(mes), Number(dia),
        Number(hora.split(':')[0]), Number(hora.split(':')[1])
    ).toISOString()

    const resAg = await fetch('/api/agendamentos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        clienteId:   cliente.id,
        pacoteId:    pacoteDB.id,
        veiculoId:   veiculo.id,
        instrutorId: instrutor.id,
        dataHora,
        rua:         params.get('rua')          ?? '',
        numero:      params.get('numero')        ?? '',
        complemento: params.get('complemento')   ?? '',
        bairro:      params.get('bairro')        ?? '',
        cidade:      params.get('cidade')        ?? '',
        cep:         params.get('cep')           ?? '',
        retorno:     params.get('retorno') === 'true',
        observacao:  params.get('obs')           ?? '',
    }),
    })

    if (!resAg.ok) {
    const erro = await resAg.json()
    if (resAg.status === 409) {
        alert('Este horário já foi reservado. Volte e escolha outro horário.')
    } else {
        alert(erro.erro ?? 'Erro ao criar agendamento.')
    }
    setLoading(false)
    return
    }

    const { compra } = await resAg.json()
    setCompraId(compra.id)

    if (metodo === 'pix') {
        const resPix = await fetch('/api/pagamentos/pix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                valor:    total,
                email:    cliente.email,
                nome:     cliente.nome,
                compraId: compra.id,
            }),
        })
        const pix = await resPix.json()

        if (pix.qr_code_base64) {
            setPixQr(pix.qr_code_base64)
            setPixCopia(pix.qr_code)
        } else {
        throw new Error('QR code não gerado')
        }
    } else {
        router.push(
            `/agendar/confirmacao?tipo=${tipo}&pacote=${pacote}&dia=${dia}&mes=${mes}&ano=${ano}&hora=${hora}`
        )
    }
    } catch (err) {
        console.error(err)
        alert('Erro ao processar. Tente novamente.')
    } finally {
        setLoading(false)
    }
}

const copiarPix = () => {
    if (pixCopia) {
        navigator.clipboard.writeText(pixCopia)
        setCopiado(true)
        setTimeout(() => setCopiado(false), 3000)
    }
}

    const metodos: { id: MetodoPag; label: string; icon: typeof QrCode }[] = [
    { id: 'pix',    label: 'PIX',    icon: QrCode     },
    { id: 'cartao', label: 'Cartão', icon: CreditCard },
    { id: 'boleto', label: 'Boleto', icon: Barcode    },
    ]

    return (
    <main className="max-w-lg mx-auto min-h-screen">

      {/* NAV */}
        <nav className="flex items-center gap-3 px-5 py-4"
            style={{ background: '#0a1628', borderBottom: '0.5px solid rgba(56,189,248,.15)' }}>
            <button onClick={() => router.back()} className="hover:opacity-70">
                <ChevronLeft size={20} style={{ color: '#38bdf8' }} />
            </button>
            <span className="text-xl font-bold" style={{ color: '#38bdf8' }}>instruo</span>
            <span className="text-sm ml-auto" style={{ color: '#94a3b8' }}>Passo 5 de 5</span>
        </nav>

        <section className="px-5 py-6">
            <h2 className="text-xl font-bold text-white mb-1">Resumo e pagamento</h2>
            <p className="text-sm mb-5" style={{ color: '#94a3b8' }}>
            Confira os detalhes antes de confirmar.
            </p>

            {/* Dados do cliente */}
            <div className="rounded-2xl p-4 mb-5 space-y-3"
                style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.15)' }}>
                <p className="text-xs font-medium uppercase tracking-widest"
                    style={{ color: '#94a3b8' }}>Seus dados</p>
                <input value={nome} onChange={e => setNome(e.target.value)}
                        placeholder="Nome completo *"
                        className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                        style={{ background: '#060e1e', border: `0.5px solid ${nome ? '#38bdf8' : 'rgba(56,189,248,.2)'}` }} />
                <input value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="E-mail *" type="email"
                        className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                        style={{ background: '#060e1e', border: `0.5px solid ${email ? '#38bdf8' : 'rgba(56,189,248,.2)'}` }} />
                <input value={telefone} onChange={e => setTelefone(e.target.value)}
                        placeholder="WhatsApp (opcional)"
                        className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                        style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.2)' }} />
            </div>

            {/* Resumo */}
            <div className="rounded-2xl p-4 mb-5"
                style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.15)' }}>
                {[
                    { label: 'Instrutor',  valor: 'Wallif Guedes' },
                    { label: 'Tipo',       valor: tipo === 'carro' ? 'Carro — Cat. B' : 'Moto — Cat. A' },
                    { label: 'Pacote',     valor: pk.label },
                    { label: '1ª aula',    valor: `${dataAula} · ${hora}` },
                    { label: 'Embarque',   valor: endFormatado || '—' },
                ].map((item, i, arr) => (
                    <div key={item.label}>
                        <div className="flex justify-between items-start py-2 text-sm gap-4">
                            <span className="flex-shrink-0" style={{ color: '#94a3b8' }}>{item.label}</span>
                            <span className="font-medium text-white text-right">{item.valor}</span>
                        </div>
                        {i < arr.length - 1 && <div style={{ borderTop: '0.5px solid rgba(56,189,248,.08)' }} />}
                    </div>
                ))}

                <div style={{ borderTop: '0.5px solid rgba(56,189,248,.15)', marginTop: 4 }} />

                {/* Valores */}
                <div className="pt-2 space-y-1">
                    {eco > 0 && (
                    <>
                        <div className="flex justify-between text-sm">
                            <span style={{ color: '#94a3b8' }}>{pk.qtd} aulas (valor cheio)</span>
                            <span className="text-white">{formatarMoeda(base)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span style={{ color: '#4ade80' }}>Desconto do pacote</span>
                            <span style={{ color: '#4ade80' }}>– {formatarMoeda(eco)}</span>
                        </div>
                    </>
                    )}
                    <div className="flex justify-between items-center pt-1">
                        <span className="text-sm font-medium text-white">Total</span>
                        <span className="text-xl font-bold" style={{ color: '#38bdf8' }}>
                            {formatarMoeda(total)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Método de pagamento */}
            <p className="text-xs font-medium uppercase tracking-widest mb-3"
            style={{ color: '#94a3b8' }}>Forma de pagamento</p>

            <div className="grid grid-cols-3 gap-3 mb-4">
                {metodos.map(m => {
                    const Icon = m.icon
                    const ativo = metodo === m.id
                    return (
                    <button key={m.id}
                            onClick={() => setMetodo(m.id)}
                            className="py-3 rounded-xl flex flex-col items-center gap-1 text-xs font-medium transition-all"
                            style={{
                                background: ativo ? 'rgba(14,116,144,.15)' : '#0d1f3c',
                                border: ativo ? '1.5px solid #38bdf8' : '0.5px solid rgba(56,189,248,.15)',
                                color: ativo ? '#38bdf8' : '#94a3b8',
                            }}>
                        <Icon size={20} />
                        {m.label}
                    </button>
                    )
                })}
            </div>

            {/* PIX — antes de gerar */}
            {metodo === 'pix' && !pixQr && (
            <div className="rounded-2xl p-4 mb-5 flex items-center gap-4"
                style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.15)' }}>
                <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: '#fff' }}>
                <QrCode size={32} style={{ color: '#0a1628' }} />
                </div>
                <div>
                    <p className="text-xs mb-1" style={{ color: '#64748b' }}>Chave PIX do instrutor</p>
                    <p className="text-sm font-medium" style={{ color: '#38bdf8' }}>
                        wallif@instruo.com
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#64748b' }}>
                        QR code gerado após confirmar
                    </p>
                </div>
            </div>
            )}

            {/* PIX — QR code real gerado */}
            {metodo === 'pix' && pixQr && (
            <div className="rounded-2xl p-5 mb-5 flex flex-col items-center gap-4"
                style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.3)' }}>
                <p className="text-sm font-medium" style={{ color: '#38bdf8' }}>
                Escaneie o QR code para pagar
                </p>
                <img src={`data:image/png;base64,${pixQr}`}
                    alt="QR Code PIX"
                    className="w-48 h-48 rounded-xl" />
                <button onClick={copiarPix}
                        className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={{
                        background: copiado ? 'rgba(34,197,94,.15)' : 'rgba(56,189,248,.1)',
                        color:      copiado ? '#22c55e' : '#38bdf8',
                        border:     `0.5px solid ${copiado ? '#22c55e' : '#38bdf8'}`,
                        }}>
                {copiado ? '✓ Código copiado!' : 'Copiar código PIX'}
                </button>
                <p className="text-xs text-center" style={{ color: '#64748b' }}>
                Após o pagamento, você receberá a confirmação por e-mail automaticamente.
                </p>
                <button onClick={() => router.push(
                            `/agendar/confirmacao?tipo=${tipo}&pacote=${pacote}&dia=${dia}&mes=${mes}&ano=${ano}&hora=${hora}`
                        )}
                        className="text-xs underline"
                        style={{ color: '#475569' }}>
                Já paguei, ir para confirmação →
                </button>
            </div>
            )}

            {/* Cartão */}
            {metodo === 'cartao' && (
                <div className="rounded-2xl p-4 mb-5 space-y-3"
                    style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.15)' }}>
                    <input placeholder="Número do cartão"
                        className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                        style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.2)' }} />
                    <input placeholder="Nome no cartão"
                        className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                        style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.2)' }} />
                    <div className="grid grid-cols-2 gap-3">
                        <input placeholder="MM/AA"
                                className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                                style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.2)' }} />
                        <input placeholder="CVV"
                                className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                                style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.2)' }} />
                    </div>
                </div>
            )}

            {/* Boleto */}
            {metodo === 'boleto' && (
                <div className="rounded-2xl p-4 mb-5 text-sm"
                    style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.15)', color: '#94a3b8' }}>
                    O boleto será gerado após a confirmação e enviado para o seu e-mail.
                    O prazo de compensação é de até 3 dias úteis.
                </div>
            )}

            {/* Botão pagar */}
            <button
                onClick={pagar}
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                style={{
                background: loading ? '#0d1f3c' : '#38bdf8',
                color:      loading ? '#94a3b8' : '#060e1e',
                cursor:     loading ? 'not-allowed' : 'pointer',
                }}>
                {loading ? (
                <>
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                        style={{ borderColor: '#38bdf8', borderTopColor: 'transparent' }} />
                    Processando...
                </>
                ) : (
                <>
                    <Check size={16} />
                    Confirmar pagamento — {formatarMoeda(total)}
                </>
                )}
            </button>
        </section>
    </main>
    )
}

export default function AgendarPagamento() {
    return (
    <Suspense>
        <PagamentoContent />
    </Suspense>
    )
}
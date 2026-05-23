'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function Login() {
    const router = useRouter()
    const [email, setEmail]       = useState('')
    const [senha, setSenha]       = useState('')
    const [mostrar, setMostrar]   = useState(false)
    const [loading, setLoading]   = useState(false)
    const [erro, setErro]         = useState('')

    const entrar = async () => {
        if (!email || !senha) { setErro('Preencha e-mail e senha.'); return }
        setLoading(true)
        setErro('')

    const res = await signIn('credentials', {
        email, senha, redirect: false,
    })

    if (res?.ok) {
        router.push('/painel')
    } else {
        setErro('E-mail ou senha incorretos.')
    }
    setLoading(false)
    }

    return (
    <main className="max-w-sm mx-auto min-h-screen flex flex-col items-center justify-center px-5">

        {/* Logo */}
        <div className="mb-8 text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: '#38bdf8' }}>instruo</div>
            <p className="text-sm" style={{ color: '#94a3b8' }}>Acesso do instrutor</p>
        </div>

        {/* Card */}
        <div className="w-full rounded-2xl p-6 space-y-4"
            style={{ background: '#0d1f3c', border: '0.5px solid rgba(56,189,248,.15)' }}>

            <h2 className="text-lg font-bold text-white mb-2">Entrar no painel</h2>

            {/* Email */}
            <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                        style={{ color: '#94a3b8' }}>E-mail</label>
                <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: '#475569' }} />
                    <input value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && entrar()}
                        type="email"
                        placeholder="seu@email.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-white outline-none"
                        style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.2)' }} />
                </div>
            </div>

            {/* Senha */}
            <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                        style={{ color: '#94a3b8' }}>Senha</label>
                <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: '#475569' }} />
                    <input value={senha}
                        onChange={e => setSenha(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && entrar()}
                        type={mostrar ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-white outline-none"
                        style={{ background: '#060e1e', border: '0.5px solid rgba(56,189,248,.2)' }} />
                    <button onClick={() => setMostrar(m => !m)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: '#475569' }}>
                    {mostrar ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                </div>
            </div>

            {/* Erro */}
            {erro && (
                <p className="text-xs text-center py-2 rounded-lg"
                    style={{ background: 'rgba(239,68,68,.1)', color: '#f87171' }}>
                {erro}
                </p>
            )}

            {/* Botão */}
            <button onClick={entrar} disabled={loading}
                    className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                    style={{
                        background: loading ? '#0d1f3c' : '#38bdf8',
                        color:      loading ? '#94a3b8' : '#060e1e',
                        cursor:     loading ? 'not-allowed' : 'pointer',
                    }}>
                {loading ? 'Entrando...' : 'Entrar →'}
            </button>

            <p className="text-xs text-center" style={{ color: '#475569' }}>
                Credenciais de teste: wallif@instruo.com / instruo123
            </p>
        </div>
    </main>
    )
}
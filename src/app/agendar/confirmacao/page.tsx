'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Calendar, Car, Bike, MapPin, Package, CircleCheckBig } from 'lucide-react'
import { formatarMoeda } from '@/lib/utils'

const PACOTES: Record<string, { label: string; qtd: number; totalCarro: number; totalMoto: number }> = {
    '1':  { label: 'Aula avulsa',     qtd: 1,  totalCarro: 120, totalMoto: 90  },
    '5':  { label: 'Pacote 5 aulas',  qtd: 5,  totalCarro: 550, totalMoto: 415 },
    '10': { label: 'Pacote 10 aulas', qtd: 10, totalCarro: 990, totalMoto: 765 },
}

function ConfirmacaoContent() {
    const router = useRouter()
    const params = useSearchParams()
    const [animado, setAnimado] = useState(false)

    const tipo   = params.get('tipo')   ?? 'carro'
    const pacote = params.get('pacote') ?? '1'
    const dia    = params.get('dia')    ?? ''
    const mes    = params.get('mes')    ?? ''
    const ano    = params.get('ano')    ?? ''
    const hora   = params.get('hora')   ?? ''

    const pk    = PACOTES[pacote] ?? PACOTES['1']
    const total = tipo === 'carro' ? pk.totalCarro : pk.totalMoto

    const dataAula = dia
    ? new Date(Number(ano), Number(mes), Number(dia))
        .toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : ''
}
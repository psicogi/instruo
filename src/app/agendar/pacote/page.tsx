'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { ChevronLeft, Package } from 'lucide-react'
import { formatarMoeda } from '@/lib/utils'

const pacotesPorTipo = {
    carro: [
    { id: '1', quantidade: 1,  total: 120, porAula: 120, economia: 0,   label: 'Avulsa' },
    { id: '5', quantidade: 5,  total: 550, porAula: 110, economia: 50,  label: 'Pacote 5 aulas', popular: true },
    { id: '10',quantidade: 10, total: 990, porAula: 99,  economia: 210, label: 'Pacote 10 aulas' },
    ],
    moto: [
    { id: '1', quantidade: 1,  total: 90,  porAula: 90,  economia: 0,   label: 'Avulsa' },
    { id: '5', quantidade: 5,  total: 415, porAula: 83,  economia: 35,  label: 'Pacote 5 aulas', popular: true },
    { id: '10',quantidade: 10, total: 765, porAula: 76,  economia: 135, label: 'Pacote 10 aulas' },
    ],
}

const descricoes: Record<string, string> = {
    '1':  'Ideal para quem quer experimentar ou tem poucas aulas restantes.',
    '5':  'O pacote mais escolhido. 5 aulas no seu ritmo com desconto progressivo.',
    '10': 'Melhor custo-benefício! Ideal para quem está começando do zero.',
}
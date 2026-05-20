'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Car, Bike, ShieldCheck, ChevronLeft } from 'lucide-react'
import { formatarMoeda } from '@/lib/utils'

const veiculos = [
    {
    id: 'carro',
    tipo: 'CARRO',
    nome: 'Carro',
    categoria: 'Categoria B',
    modelo: 'VW Gol',
    valorAula: 120,
    duracao: '50 minutos',
    icon: Car,
    },
    {
    id: 'moto',
    tipo: 'MOTO',
    nome: 'Moto',
    categoria: 'Categoria A',
    modelo: 'Honda CG 160 Start',
    valorAula: 90,
    duracao: '50 minutos',
    icon: Bike,
    },
]


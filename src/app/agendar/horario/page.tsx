'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { ChevronLeft } from 'lucide-react'

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

const HORARIOS = ['07:00','08:00','09:00','10:00','11:00',
                    '13:00','14:00','15:00','16:00','17:00','18:00']

// Horários fictícios ocupados para demonstração
const OCUPADOS_POR_DIA: Record<number, string[]> = {
    3:  ['08:00','10:00'],
    7:  ['09:00','14:00','16:00'],
    10: ['07:00','08:00','09:00'],
    15: ['08:00','09:00','16:00'],
    18: ['13:00','14:00'],
    22: ['10:00','11:00'],
}

// Dias sem nenhuma vaga
const DIAS_BLOQUEADOS = [1, 6, 8, 13, 20, 27]


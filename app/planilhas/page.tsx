'use client'

import { useState } from 'react'
import { FileSpreadsheet, Download, Filter } from 'lucide-react'

export default function PlanilhasPage() {
  const [tipo, setTipo] = useState('clientes')

  const tipos = [
    { id: 'clientes', nome: 'Base de Clientes', icone: '👥' },
    { id: 'conversas', nome: 'Histórico de Conversas', icone: '💬' },
    { id: 'agendamentos', nome: 'Agendamentos', icone: '📅' },
    { id: 'desempenho', nome: 'Desempenho do Robô', icone: '📊' },
  ]

  function exportar() {
    const csv = `Nome,Telefone,Data\nJoão Silva,(11) 99999-9999,2024-01-15\nMaria Santos,(11) 98888-8888,2024-01-16`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tipo}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Planilhas e Relatórios</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Seleção de tipo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tipos.map((t) => (
            <button
              key={t.id}
              onClick={() => setTipo(t.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                tipo === t.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="text-2xl mb-2">{t.icone}</div>
              <p className="font-medium text-gray-900">{t.nome}</p>
            </button>
          ))}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select className="px-3 py-2 border border-gray-200 rounded-lg">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
              <option>Este mês</option>
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-lg">
              <option>Todos os status</option>
              <option>Ativos</option>
              <option>Inativos</option>
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-lg">
              <option>CSV</option>
              <option>Excel</option>
              <option>PDF</option>
            </select>
          </div>
        </div>

        {/* Exportar */}
        <button
          onClick={exportar}
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium"
        >
          <Download className="w-5 h-5 mr-2" />
          Exportar {tipos.find(t => t.id === tipo)?.nome}
        </button>
      </main>
    </div>
  )
}

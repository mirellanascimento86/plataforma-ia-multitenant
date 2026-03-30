'use client'

import { useState } from 'react'
import { FileSpreadsheet, Download, Filter, Calendar } from 'lucide-react'

export default function PlanilhasPage() {
  const [tipoSelecionado, setTipoSelecionado] = useState('clientes')

  const tiposPlanilha = [
    { id: 'clientes', nome: 'Base de Clientes', descricao: 'Todos os clientes cadastrados' },
    { id: 'conversas', nome: 'Histórico de Conversas', descricao: 'Todas as mensagens trocadas' },
    { id: 'agendamentos', nome: 'Agendamentos', descricao: 'Compromissos e horários' },
    { id: 'desempenho', nome: 'Desempenho do Robô', descricao: 'Métricas de atendimento' },
  ]

  async function exportarPlanilha() {
    // Simulação - aqui você integraria com API de exportação
    alert(`Exportando planilha de ${tipoSelecionado}...`)
    
    // Exemplo de dados CSV
    const csv = `Nome,Telefone,Data
João Silva,(11) 99999-9999,2024-01-15
Maria Santos,(11) 98888-8888,2024-01-16`

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `planilha-${tipoSelecionado}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Planilhas e Relatórios</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tiposPlanilha.map((tipo) => (
          <div
            key={tipo.id}
            onClick={() => setTipoSelecionado(tipo.id)}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
              tipoSelecionado === tipo.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{tipo.nome}</h3>
                <p className="text-gray-500 mt-1">{tipo.descricao}</p>
              </div>
              <FileSpreadsheet className={`w-8 h-8 ${
                tipoSelecionado === tipo.id ? 'text-blue-600' : 'text-gray-400'
              }`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtros
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
            <select className="w-full px-3 py-2 border rounded-lg">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
              <option>Este mês</option>
              <option>Período personalizado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full px-3 py-2 border rounded-lg">
              <option>Todos</option>
              <option>Ativos</option>
              <option>Inativos</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Formato</label>
            <select className="w-full px-3 py-2 border rounded-lg">
              <option>Excel (.xlsx)</option>
              <option>CSV (.csv)</option>
              <option>PDF (.pdf)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botão Exportar */}
      <button
        onClick={exportarPlanilha}
        className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
      >
        <Download className="w-5 h-5 mr-2" />
        Exportar Planilha de {tiposPlanilha.find(t => t.id === tipoSelecionado)?.nome}
      </button>
    </div>
  )
}

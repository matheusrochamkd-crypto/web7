import React, { useState } from 'react';
import { X, Plus, FileText, Globe } from 'lucide-react';
import type { Report, ClientId } from '../types';
import { clientsList } from '../mockData';

interface NewReportModalProps {
  onClose: () => void;
  onAddReport: (report: Omit<Report, 'id' | 'uploadDate'>) => void;
}

export const NewReportModal: React.FC<NewReportModalProps> = ({ onClose, onAddReport }) => {
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState<ClientId>('web-7');
  const [fileUrl, setFileUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddReport({
      name,
      clientId,
      fileUrl: fileUrl.trim() || '#'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Novo Relatório Semanal</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Nome/Semana do Relatório *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Relatório Semana 1 - Outubro"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Cliente Associado *</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value as ClientId)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            >
              {clientsList.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Globe size={16} className="text-slate-400" />
              Link do Arquivo (.doc / Drive / Canva)
            </label>
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setUrlSecure(e.target.value)}
              placeholder="Ex: https://drive.google.com/..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-100 pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus size={18} />
              Adicionar Relatório
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  function setUrlSecure(val: string) {
    setFileUrl(val);
  }
};

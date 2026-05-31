import React, { useState } from 'react';
import { X, Plus, FileText, Link as LinkIcon } from 'lucide-react';
import type { Task, ClientId, TaskStatus } from '../types';

interface NewTaskModalProps {
  clientId: ClientId;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'comments'>) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ clientId, onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('a-fazer');
  const [copy, setCopy] = useState('');
  const [driveLinks, setDriveLinks] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      clientId,
      title,
      description,
      status,
      copy,
      driveLinks
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase mb-1 block">
              {clientId.replace('-', ' ')}
            </span>
            <h2 className="text-xl font-bold text-slate-800">Nova Demanda</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Título da Demanda *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Subir Campanha de Remarketing"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Coluna Inicial</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              >
                <option value="a-fazer">A Fazer</option>
                <option value="em-andamento">Em Andamento</option>
                <option value="aguardando-criativo">Aguardando Criativo</option>
                <option value="concluido">Concluído</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FileText size={16} className="text-slate-400" />
              Descrição / Briefing
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva os objetivos, públicos ou detalhes da campanha..."
              className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText size={16} className="text-slate-400" />
                Copy dos Anúncios (Opcional)
              </label>
              <textarea
                value={copy}
                onChange={(e) => setCopy(e.target.value)}
                placeholder="Cole o rascunho dos textos dos anúncios..."
                className="w-full h-28 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <LinkIcon size={16} className="text-slate-400" />
                Links de Ativos / Canva / Drive
              </label>
              <textarea
                value={driveLinks}
                onChange={(e) => setDriveLinks(e.target.value)}
                placeholder="Insira os links para imagens, vídeos ou pastas..."
                className="w-full h-28 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
              />
            </div>
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
              Criar Demanda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

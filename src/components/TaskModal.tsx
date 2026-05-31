import { useState } from 'react';
import { X, Send, Link as LinkIcon, FileText, MessageSquare, Trash2 } from 'lucide-react';
import type { Task } from '../types';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskModal = ({ task, onClose, onUpdateTask, onDeleteTask }: TaskModalProps) => {
  const [copy, setCopy] = useState(task.copy);
  const [driveLinks, setDriveLinks] = useState(task.driveLinks);
  const [newComment, setNewComment] = useState('');

  const handleSave = () => {
    onUpdateTask({ ...task, copy, driveLinks });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const updatedTask = {
      ...task,
      comments: [
        ...task.comments,
        { id: Date.now().toString(), author: 'Você', text: newComment, createdAt: new Date().toISOString() }
      ]
    };
    onUpdateTask(updatedTask);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase mb-1 block">
              {task.clientId}
            </span>
            <h2 className="text-xl font-bold text-slate-800">{task.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                if (window.confirm('Tem certeza que deseja excluir esta demanda?')) {
                  onDeleteTask(task.id);
                }
              }}
              title="Excluir Demanda" 
              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full transition-colors"
            >
              <Trash2 size={22} />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FileText size={18} className="text-slate-400" />
              Descrição
            </h3>
            <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">{task.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText size={18} className="text-slate-400" />
                Copy dos Anúncios
              </h3>
              <textarea
                value={copy}
                onChange={(e) => setCopy(e.target.value)}
                onBlur={handleSave}
                placeholder="Cole aqui os textos dos anúncios..."
                className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <LinkIcon size={18} className="text-slate-400" />
                Links de Ativos (Drive/Canva)
              </h3>
              <textarea
                value={driveLinks}
                onChange={(e) => setDriveLinks(e.target.value)}
                onBlur={handleSave}
                placeholder="Cole os links das pastas ou arquivos..."
                className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
              />
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-100 pt-8 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <MessageSquare size={18} className="text-slate-400" />
              Mini-Chat da Tarefa
            </h3>
            
            <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
              {task.comments.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Nenhum comentário ainda. Inicie a conversa!</p>
              ) : (
                task.comments.map((comment) => (
                  <div key={comment.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-slate-700">{comment.author}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(comment.createdAt).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">{comment.text}</p>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Escreva um comentário..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
              >
                <Send size={18} />
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

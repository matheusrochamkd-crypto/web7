import { useState } from 'react';
import { FileText, Download, Upload, Plus, Trash2 } from 'lucide-react';
import type { Report } from '../types';
import { NewReportModal } from './NewReportModal';

interface ReportsProps {
  reports: Report[];
  onAddReport: (report: Omit<Report, 'id' | 'uploadDate'>) => void;
  onDeleteReport: (id: string) => void;
}

export const Reports = ({ reports, onAddReport, onDeleteReport }: ReportsProps) => {
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Central de Relatórios</h2>
          <p className="text-slate-500">Gerencie e acesse os relatórios enviados em formato .doc</p>
        </div>
        
        <button 
          onClick={() => setIsNewReportModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={20} />
          Novo Relatório
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {reports.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Upload size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-1">Nenhum relatório encontrado</h3>
            <p className="text-slate-500 max-w-sm">
              Clique em "Novo Relatório" acima para fazer o upload do primeiro arquivo .doc para este cliente.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="font-medium p-4 pl-6">Nome do Relatório</th>
                <th className="font-medium p-4">Data de Envio</th>
                <th className="font-medium p-4 text-right pr-6">Ação</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FileText size={20} />
                      </div>
                      <div>
                        <a 
                          href={report.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-slate-700 hover:text-blue-600 hover:underline transition-colors block"
                        >
                          {report.name}
                        </a>
                        {report.fileUrl && report.fileUrl !== '#' && (
                          <a 
                            href={report.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline block mt-0.5 max-w-xs truncate"
                          >
                            {report.fileUrl}
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">
                    {new Date(report.uploadDate).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: 'long', year: 'numeric'
                    })}
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <a 
                      href={report.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600 px-4 py-2 rounded-lg transition-all shadow-sm"
                    >
                      <Download size={16} />
                      Download
                    </a>
                    <button 
                      onClick={() => {
                        if (window.confirm('Tem certeza que deseja excluir este relatório?')) {
                          onDeleteReport(report.id);
                        }
                      }}
                      className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 hover:text-rose-700 px-4 py-2 rounded-lg transition-all shadow-sm"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isNewReportModalOpen && (
        <NewReportModal
          onClose={() => setIsNewReportModalOpen(false)}
          onAddReport={(newReport) => {
            onAddReport(newReport);
            setIsNewReportModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

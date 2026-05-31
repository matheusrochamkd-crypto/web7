import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { Reports } from './components/Reports';
import type { ActiveView, ClientId, Task, Report } from './types';
import { clientsList } from './mockData';
import { getTasks, addTask, updateTask, deleteTask, getReports, addReport, deleteReport } from './services/db';

function App() {
  const [selectedView, setSelectedView] = useState<ActiveView>('web-7');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados iniciais do banco
  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedTasks = await getTasks();
        const fetchedReports = await getReports();
        setTasks(fetchedTasks);
        setReports(fetchedReports);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddTask = async (newTaskData: Omit<Task, 'id' | 'comments'>) => {
    try {
      const created = await addTask(newTaskData);
      setTasks(prev => [...prev, created]);
    } catch (err) {
      console.error('Erro ao criar demanda:', err);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const updated = await updateTask(updatedTask);
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch (err) {
      console.error('Erro ao atualizar demanda:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Erro ao excluir demanda:', err);
    }
  };

  const handleAddReport = async (newReportData: Omit<Report, 'id' | 'uploadDate'>) => {
    try {
      const created = await addReport(newReportData);
      setReports(prev => [created, ...prev]);
    } catch (err) {
      console.error('Erro ao criar relatório:', err);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await deleteReport(reportId);
      setReports(prev => prev.filter(r => r.id !== reportId));
    } catch (err) {
      console.error('Erro ao excluir relatório:', err);
    }
  };

  const isClientView = selectedView !== 'reports-view';
  const currentClientName = isClientView
    ? (clientsList.find(c => c.id === selectedView)?.name || 'Cliente')
    : 'Central Geral de Relatórios';

  const filteredTasks = isClientView
    ? tasks.filter(t => t.clientId === selectedView)
    : [];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar selectedView={selectedView} onSelectView={setSelectedView} />

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-6 flex-shrink-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                {isClientView ? 'Gestão de Campanhas' : 'Acompanhamento Semanal'}
              </p>
              <h2 className="text-3xl font-bold text-slate-800">{currentClientName}</h2>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : isClientView ? (
            <KanbanBoard 
              clientId={selectedView as ClientId} 
              tasks={filteredTasks} 
              onUpdateTask={handleUpdateTask} 
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          ) : (
            <Reports 
              reports={reports} 
              onAddReport={handleAddReport} 
              onDeleteReport={handleDeleteReport}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

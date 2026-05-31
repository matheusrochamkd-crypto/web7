import { useState } from 'react';
import type { Task, TaskStatus, ClientId } from '../types';
import { TaskModal } from './TaskModal';
import { NewTaskModal } from './NewTaskModal';
import { MessageSquare, Paperclip, MoreHorizontal } from 'lucide-react';
import { clsx } from 'clsx';

interface KanbanBoardProps {
  clientId: ClientId;
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onAddTask: (task: Omit<Task, 'id' | 'comments'>) => void;
  onDeleteTask: (id: string) => void;
}

const COLUMNS: { id: TaskStatus; title: string; colorClass: string }[] = [
  { id: 'a-fazer', title: 'A Fazer', colorClass: 'border-slate-200 bg-slate-100/50' },
  { id: 'em-andamento', title: 'Em Andamento', colorClass: 'border-blue-200 bg-blue-50/50' },
  { id: 'aguardando-criativo', title: 'Aguardando Criativo', colorClass: 'border-orange-200 bg-orange-50/50' },
  { id: 'concluido', title: 'Concluído', colorClass: 'border-green-200 bg-green-50/50' },
  { id: 'personalizado', title: 'Personalizado', colorClass: 'border-purple-200 bg-purple-50/50' },
];

export const KanbanBoard = ({ clientId, tasks, onUpdateTask, onAddTask, onDeleteTask }: KanbanBoardProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== status) {
      onUpdateTask({ ...task, status });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 h-full flex gap-6">
      {COLUMNS.map((column) => (
        <div 
          key={column.id} 
          className="flex-shrink-0 w-80 flex flex-col max-h-full"
          onDrop={(e) => handleDrop(e, column.id)}
          onDragOver={handleDragOver}
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className={clsx(
              "font-semibold flex items-center gap-2",
              column.id === 'aguardando-criativo' ? 'text-orange-600' : 'text-slate-700'
            )}>
              {column.title}
              <span className="bg-slate-200 text-slate-600 text-xs py-0.5 px-2 rounded-full font-medium">
                {tasks.filter(t => t.status === column.id).length}
              </span>
            </h3>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={18} />
            </button>
          </div>
          
          <div className={clsx("flex-1 overflow-y-auto rounded-2xl border p-3 space-y-3 transition-colors", column.colorClass)}>
            {tasks.filter(t => t.status === column.id).map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onClick={() => setSelectedTask(task)}
                className={clsx(
                  "bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-slate-300 transition-all group",
                  task.status === 'aguardando-criativo' && "border-orange-300 shadow-[0_2px_10px_rgba(251,146,60,0.15)]"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">
                    {task.clientId.replace('-', ' ')}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-800 mb-1 leading-tight group-hover:text-blue-600 transition-colors">
                  {task.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  {task.description}
                </p>
                <div className="flex items-center gap-3 text-slate-400 text-xs">
                  {task.comments.length > 0 && (
                    <div className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      <span>{task.comments.length}</span>
                    </div>
                  )}
                  {(task.copy || task.driveLinks) && (
                    <div className="flex items-center gap-1">
                      <Paperclip size={14} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => setIsNewTaskModalOpen(true)}
              className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-medium text-sm hover:border-slate-400 hover:text-slate-600 transition-colors"
            >
              + Nova Demanda
            </button>
          </div>
        </div>
      ))}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={(updated) => {
            onUpdateTask(updated);
            setSelectedTask(updated);
          }}
          onDeleteTask={(id) => {
            onDeleteTask(id);
            setSelectedTask(null);
          }}
        />
      )}

      {isNewTaskModalOpen && (
        <NewTaskModal
          clientId={clientId}
          onClose={() => setIsNewTaskModalOpen(false)}
          onAddTask={(newTask) => {
            onAddTask(newTask);
            setIsNewTaskModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

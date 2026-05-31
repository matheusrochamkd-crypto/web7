import { createClient } from '@supabase/supabase-js';
import type { Task, Report, ClientId } from '../types';

const generateUUID = (): string => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Inicializa o cliente do Supabase apenas se as credenciais existirem
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Chaves do LocalStorage para Fallback
const LOCAL_TASKS_KEY = 'web7_tasks_db';
const LOCAL_REPORTS_KEY = 'web7_reports_db';

const isUsingSupabase = (): boolean => {
  return supabase !== null;
};

// --- SERVIÇO DE TAREFAS (DEMANDAS) ---

export const getTasks = async (clientId?: ClientId): Promise<Task[]> => {
  if (isUsingSupabase() && supabase) {
    try {
      let query = supabase.from('web7_tasks').select('*');
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      const { data, error } = await query.order('created_at', { ascending: true });
      if (error) throw error;
      
      return (data || []).map(t => ({
        id: t.id,
        clientId: t.client_id,
        title: t.title,
        description: t.description || '',
        status: t.status,
        copy: t.copy || '',
        driveLinks: t.drive_links || '',
        comments: t.comments || []
      }));
    } catch (e) {
      console.warn('Erro ao buscar do Supabase, usando LocalStorage:', e);
    }
  }

  // Fallback LocalStorage
  const localData = localStorage.getItem(LOCAL_TASKS_KEY);
  const tasks: Task[] = localData ? JSON.parse(localData) : [];
  if (clientId) {
    return tasks.filter(t => t.clientId === clientId);
  }
  return tasks;
};

export const addTask = async (task: Omit<Task, 'id' | 'comments'>): Promise<Task> => {
  const newTask: Task = {
    ...task,
    id: generateUUID(),
    comments: []
  };

  if (isUsingSupabase() && supabase) {
    try {
      const { data, error } = await supabase.from('web7_tasks').insert([{
        id: newTask.id,
        client_id: newTask.clientId,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        copy: newTask.copy,
        drive_links: newTask.driveLinks,
        comments: newTask.comments
      }]).select();

      if (error) throw error;
      if (data && data[0]) {
        const created = data[0];
        return {
          id: created.id,
          clientId: created.client_id,
          title: created.title,
          description: created.description || '',
          status: created.status,
          copy: created.copy || '',
          driveLinks: created.drive_links || '',
          comments: created.comments || []
        };
      }
    } catch (e) {
      console.warn('Erro ao inserir no Supabase, usando LocalStorage:', e);
    }
  }

  // Fallback LocalStorage
  const localData = localStorage.getItem(LOCAL_TASKS_KEY);
  const tasks: Task[] = localData ? JSON.parse(localData) : [];
  tasks.push(newTask);
  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
  return newTask;
};

export const updateTask = async (task: Task): Promise<Task> => {
  if (isUsingSupabase() && supabase) {
    try {
      const { error } = await supabase.from('web7_tasks').update({
        title: task.title,
        description: task.description,
        status: task.status,
        copy: task.copy,
        drive_links: task.driveLinks,
        comments: task.comments
      }).eq('id', task.id);

      if (error) throw error;
      return task;
    } catch (e) {
      console.warn('Erro ao atualizar no Supabase, usando LocalStorage:', e);
    }
  }

  // Fallback LocalStorage
  const localData = localStorage.getItem(LOCAL_TASKS_KEY);
  let tasks: Task[] = localData ? JSON.parse(localData) : [];
  tasks = tasks.map(t => t.id === task.id ? task : t);
  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
  return task;
};

// --- SERVIÇO DE RELATÓRIOS ---

export const getReports = async (): Promise<Report[]> => {
  if (isUsingSupabase() && supabase) {
    try {
      const { data, error } = await supabase.from('web7_reports').select('*').order('upload_date', { ascending: false });
      if (error) throw error;
      
      return (data || []).map(r => ({
        id: r.id,
        clientId: r.client_id,
        name: r.name,
        uploadDate: r.upload_date,
        fileUrl: r.file_url
      }));
    } catch (e) {
      console.warn('Erro ao buscar relatórios do Supabase, usando LocalStorage:', e);
    }
  }

  // Fallback LocalStorage
  const localData = localStorage.getItem(LOCAL_REPORTS_KEY);
  return localData ? JSON.parse(localData) : [];
};

export const addReport = async (report: Omit<Report, 'id' | 'uploadDate'>): Promise<Report> => {
  const newReport: Report = {
    ...report,
    id: generateUUID(),
    uploadDate: new Date().toISOString()
  };

  if (isUsingSupabase() && supabase) {
    try {
      const { data, error } = await supabase.from('web7_reports').insert([{
        id: newReport.id,
        client_id: newReport.clientId,
        name: newReport.name,
        upload_date: newReport.uploadDate,
        file_url: newReport.fileUrl
      }]).select();

      if (error) throw error;
      if (data && data[0]) {
        const created = data[0];
        return {
          id: created.id,
          clientId: created.client_id,
          name: created.name,
          uploadDate: created.upload_date,
          fileUrl: created.file_url
        };
      }
    } catch (e) {
      console.warn('Erro ao salvar relatório no Supabase, usando LocalStorage:', e);
    }
  }

  // Fallback LocalStorage
  const localData = localStorage.getItem(LOCAL_REPORTS_KEY);
  const reports: Report[] = localData ? JSON.parse(localData) : [];
  reports.unshift(newReport);
  localStorage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(reports));
  return newReport;
};

export const deleteTask = async (id: string): Promise<void> => {
  if (isUsingSupabase() && supabase) {
    try {
      const { error } = await supabase.from('web7_tasks').delete().eq('id', id);
      if (error) throw error;
      return;
    } catch (e) {
      console.warn('Erro ao excluir no Supabase, usando LocalStorage:', e);
    }
  }

  // Fallback LocalStorage
  const localData = localStorage.getItem(LOCAL_TASKS_KEY);
  if (localData) {
    const tasks: Task[] = JSON.parse(localData);
    const updated = tasks.filter(t => t.id !== id);
    localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(updated));
  }
};

export const deleteReport = async (id: string): Promise<void> => {
  if (isUsingSupabase() && supabase) {
    try {
      const { error } = await supabase.from('web7_reports').delete().eq('id', id);
      if (error) throw error;
      return;
    } catch (e) {
      console.warn('Erro ao excluir no Supabase, usando LocalStorage:', e);
    }
  }

  // Fallback LocalStorage
  const localData = localStorage.getItem(LOCAL_REPORTS_KEY);
  if (localData) {
    const reports: Report[] = JSON.parse(localData);
    const updated = reports.filter(r => r.id !== id);
    localStorage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(updated));
  }
};

export type ClientId = 'web-7' | 'modena' | 'six-med' | 'all-quality';
export type ActiveView = ClientId | 'reports-view';

export type TaskStatus = 'a-fazer' | 'em-andamento' | 'aguardando-criativo' | 'concluido' | 'personalizado';

export type Comment = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export type Task = {
  id: string;
  clientId: ClientId;
  title: string;
  description: string;
  status: TaskStatus;
  copy: string;
  driveLinks: string;
  comments: Comment[];
}

export type Report = {
  id: string;
  clientId: ClientId;
  name: string;
  uploadDate: string;
  fileUrl: string;
}

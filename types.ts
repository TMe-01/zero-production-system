
export type TaskCategory = 'personal' | 'work' | 'learning' | 'studying' | 'entertainment' | 'exercise' | 'mental';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string; // Date part: 'YYYY-MM-DD'
  dueTime?: string; // Optional time part: 'HH:MM'
  isCompleted: boolean;
  createdAt: string; // ISO string format
}

export interface ArchivedTask extends Task {
  status: 'completed' | 'not_executed';
  archivedAt: string;
}

export interface Habit {
  id: string;
  titleKey: string; // Translation key for the title
  time?: string; // 'HH:MM' or 'geolocated'
  isCompleted: boolean;
}

export interface ArchivedHabit {
    id: string;
    titleKey: string;
    status: 'completed' | 'not_executed';
    archivedAt: string; // ISO string
    date: string; // 'YYYY-MM-DD'
}

export type InfoViewType = 'tech' | 'economic' | 'monthly' | 'daily' | null;

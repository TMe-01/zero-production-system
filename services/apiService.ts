import { Task, ArchivedTask } from '../types';

const TASKS_KEY = 'tasks';
const ARCHIVED_TASKS_KEY = 'archived_tasks';

// --- Task Functions ---

const getTasks = (): Task[] => {
  try {
    const tasksJson = localStorage.getItem(TASKS_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error('Failed to parse tasks from localStorage', error);
    return [];
  }
};

const saveTasks = (tasks: Task[]) => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage', error);
  }
};

export const fetchTasks = async (): Promise<Task[]> => {
  return Promise.resolve(getTasks());
};

export const addTask = async (task: Omit<Task, 'id' | 'isCompleted' | 'createdAt'>): Promise<Task> => {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: new Date().toISOString() + Math.random(),
    isCompleted: false,
    createdAt: new Date().toISOString(),
  };
  const updatedTasks = [...tasks, newTask];
  saveTasks(updatedTasks);
  return Promise.resolve(newTask);
};

export const updateTask = async (updatedTask: Task): Promise<Task> => {
    let tasks = getTasks();
    tasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    saveTasks(tasks);
    return Promise.resolve(updatedTask);
};

export const deleteTask = async (taskId: string): Promise<void> => {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks(tasks);
    return Promise.resolve();
};

// --- Archive Functions ---

const getArchivedTasks = (): ArchivedTask[] => {
  try {
    const tasksJson = localStorage.getItem(ARCHIVED_TASKS_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error("Failed to parse archived tasks from localStorage", error);
    return [];
  }
};

const saveArchivedTasks = (tasks: ArchivedTask[]) => {
  try {
    localStorage.setItem(ARCHIVED_TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save archived tasks to localStorage", error);
  }
};

export const archiveTask = async (task: Task, status: 'completed' | 'not_executed'): Promise<void> => {
    let tasks = getTasks();
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks(tasks);

    const archived: ArchivedTask = {
      ...task,
      status,
      archivedAt: new Date().toISOString()
    };
    
    const archivedTasks = getArchivedTasks();
    saveArchivedTasks([...archivedTasks, archived]);
    return Promise.resolve();
};

export const fetchArchivedTasks = async (): Promise<ArchivedTask[]> => {
    return Promise.resolve(getArchivedTasks());
};

export const deleteArchivedTask = async (taskId: string): Promise<void> => {
  let archivedTasks = getArchivedTasks();
  archivedTasks = archivedTasks.filter(task => task.id !== taskId);
  saveArchivedTasks(archivedTasks);
  return Promise.resolve();
};

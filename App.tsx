

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import TaskList from './components/TaskList';
import AddTaskModal from './components/AddTaskModal';
import EditTaskModal from './components/EditTaskModal';
import DailySummary from './components/DailySummary';
import HighPriorityAlert from './components/HighPriorityAlert';
import Sidebar from './components/Sidebar';
import ArchiveView from './components/ArchiveView';
import HabitTracker from './components/HabitTracker';
import HabitArchiveView from './components/HabitArchiveView';
import InfoNav from './components/InfoNav';
import InfoView from './components/InfoView';
import { Task, InfoViewType } from './types';
import * as api from './services/apiService';
import Spinner from './components/Spinner';

export type View = 'tasks' | 'archive' | 'habit_archive';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [view, setView] = useState<View>('tasks');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [infoView, setInfoView] = useState<InfoViewType>(null);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    const fetchedTasks = await api.fetchTasks();
    const sortedTasks = fetchedTasks.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      if(dateA !== dateB) return dateA - dateB;
      if (a.dueTime && b.dueTime) return a.dueTime.localeCompare(b.dueTime);
      if (a.dueTime) return -1;
      if (b.dueTime) return 1;
      return 0;
    });
    setTasks(sortedTasks);
    setIsLoading(false);
  }, []);

  const checkAndArchiveOverdueTasks = useCallback(async () => {
    const now = new Date();
    // A function to get current tasks without relying on state closure
    const currentTasks = await api.fetchTasks(); 
    const tasksToArchive = currentTasks.filter(task => {
      if(task.isCompleted) return false;
      const dueDateStr = task.dueTime ? `${task.dueDate}T${task.dueTime}` : `${task.dueDate}T23:59:59`;
      const dueDate = new Date(dueDateStr);
      return dueDate < now;
    });

    if (tasksToArchive.length > 0) {
      await Promise.all(tasksToArchive.map(task => api.archiveTask(task, 'not_executed')));
      if(view === 'tasks' && infoView === null){
        loadTasks();
      }
    }
  }, [view, infoView, loadTasks]);

  useEffect(() => {
    if(view === 'tasks') {
      loadTasks();
    }
  }, [loadTasks, view]);

  useEffect(() => {
    const interval = setInterval(checkAndArchiveOverdueTasks, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, [checkAndArchiveOverdueTasks]);

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'isCompleted' | 'createdAt'>) => {
    await api.addTask(taskData);
    loadTasks();
  };

  const handleEditTask = async (taskData: Task) => {
    await api.updateTask(taskData);
    setTaskToEdit(null);
    loadTasks();
  };

  const handleToggleComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        await api.archiveTask({ ...task, isCompleted: true }, 'completed');
        loadTasks();
    }
  };

  const handleDelete = async (taskId: string) => {
      await api.deleteTask(taskId);
      loadTasks();
  };
  
  const openEditModal = (task: Task) => {
    setTaskToEdit(task);
    setEditTaskModalOpen(true);
  };

  const renderContent = () => {
    if (infoView) {
        return <InfoView key={infoView} viewType={infoView} onBack={() => setInfoView(null)} />;
    }
    switch (view) {
      case 'archive':
        // FIX: Removed `onDelete` prop as it's not defined in `ArchiveViewProps`.
        // The `ArchiveView` component handles its own deletion logic.
        return <ArchiveView key="archive" onBack={() => setView('tasks')} />;
      case 'habit_archive':
        return <HabitArchiveView key="habit-archive" onBack={() => setView('tasks')} />;
      case 'tasks':
      default:
        return (
          <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HighPriorityAlert tasks={tasks} />
            <DailySummary tasks={tasks.filter(t => !t.isCompleted)} />
            <InfoNav onNavigate={setInfoView} />
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner />
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
                onEdit={openEditModal}
              />
            )}
            <HabitTracker />
          </motion.div>
        );
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen flex font-sans">
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={(newView) => { setView(newView); setInfoView(null); }} 
      />
      <div className="flex-1 flex flex-col h-screen">
        <Header 
          onAddTask={() => setAddTaskModalOpen(true)} 
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>
      <AnimatePresence>
        {isAddTaskModalOpen && (
          <AddTaskModal
            onClose={() => setAddTaskModalOpen(false)}
            onAddTask={handleAddTask}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isEditTaskModalOpen && taskToEdit && (
            <EditTaskModal
                onClose={() => setEditTaskModalOpen(false)}
                taskToEdit={taskToEdit}
                onEditTask={handleEditTask}
            />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
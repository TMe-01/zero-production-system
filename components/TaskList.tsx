import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { useTranslations } from '../hooks/useTranslations';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleComplete, onDelete, onEdit }) => {
  const { t } = useTranslations();
  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);
  
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {pendingTasks.map(task => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onToggleComplete={onToggleComplete} 
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </AnimatePresence>
      {completedTasks.length > 0 && (
          <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">{t.completed}</h2>
              <div className="space-y-4">
                <AnimatePresence>
                  {completedTasks.map(task => (
                      <TaskItem
                          key={task.id}
                          task={task}
                          onToggleComplete={onToggleComplete}
                          onDelete={onDelete}
                          onEdit={onEdit}
                      />
                  ))}
                </AnimatePresence>
              </div>
          </div>
      )}
    </div>
  );
};

export default TaskList;

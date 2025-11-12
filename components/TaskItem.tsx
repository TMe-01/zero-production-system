import React from 'react';
import { motion } from 'framer-motion';
import { Task, TaskCategory } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { useCountdown } from '../hooks/useCountdown';
import { 
  EditIcon, TrashIcon, CheckIcon, 
  PersonalIcon, WorkIcon, LearningIcon, StudyingIcon, 
  EntertainmentIcon, ExerciseIcon, MentalIcon 
} from './Icons';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const categoryIcons: Record<TaskCategory, React.FC<{className?: string}>> = {
  personal: PersonalIcon,
  work: WorkIcon,
  learning: LearningIcon,
  studying: StudyingIcon,
  entertainment: EntertainmentIcon,
  exercise: ExerciseIcon,
  mental: MentalIcon,
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const { getCategoryName, t, language } = useTranslations();
  const fullDueDate = task.dueTime ? `${task.dueDate}T${task.dueTime}` : `${task.dueDate}T23:59:59`;
  const { days, hours, minutes, isExpired } = useCountdown(fullDueDate);

  const priorityClasses = {
    low: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    medium: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    high: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
  };

  const priorityBorderClasses = {
    low: 'border-green-500',
    medium: 'border-yellow-500',
    high: 'border-red-500',
  };

  const handleToggle = () => onToggleComplete(task.id);
  const CategoryIcon = categoryIcons[task.category];

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col gap-3 border-l-4 ${priorityBorderClasses[task.priority]} ${task.isCompleted ? 'opacity-50' : ''}`}>
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <button
                    onClick={handleToggle}
                    className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 dark:border-gray-500 hover:border-indigo-400'}`}
                    aria-label={task.isCompleted ? 'Mark as pending' : 'Mark as complete'}
                >
                    {task.isCompleted && <CheckIcon className="w-4 h-4 text-white" />}
                </button>
                <div>
                    <h3 className={`font-bold text-lg ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>{task.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{task.description}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => onEdit(task)} className="text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors" aria-label={t.edit_task}><EditIcon className="w-5 h-5" /></button>
                <button onClick={() => onDelete(task.id)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label={t.delete}><TrashIcon className="w-5 h-5" /></button>
            </div>
        </div>

        <div className="flex items-center justify-between text-xs mt-2">
            <div className="flex items-center gap-2">
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full flex items-center gap-1.5">
                  <CategoryIcon className="w-3 h-3" />
                  {getCategoryName(task.category)}
                </span>
                <span className={`${priorityClasses[task.priority]} px-2 py-1 rounded-full font-medium`}>{t[`priority_${task.priority}`]}</span>
            </div>
            <div className={`text-sm font-mono ${isExpired ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                {isExpired ? t.expired : `${days}d ${hours}h ${minutes}m`}
            </div>
        </div>
    </motion.div>
  );
};

export default TaskItem;

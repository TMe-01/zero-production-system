import React from 'react';
import { Task } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface HighPriorityAlertProps {
  tasks: Task[];
}

const HighPriorityAlert: React.FC<HighPriorityAlertProps> = ({ tasks }) => {
  const { t } = useTranslations();
  
  const highPriorityTasks = tasks.filter(task => {
    if (task.isCompleted || task.priority !== 'high') return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    return dueDate <= threeDaysFromNow && dueDate >= today;
  });

  if (highPriorityTasks.length === 0) return null;

  return (
    <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 rounded-r-lg mb-6" role="alert">
      <p className="font-bold">{t.high_priority_alert}</p>
      <ul className="list-disc list-inside mt-2 text-sm">
        {highPriorityTasks.map(task => (
            <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default HighPriorityAlert;

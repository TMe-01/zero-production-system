import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../hooks/useTranslations';
import { TaskCategory, TaskPriority, Task } from '../types';

interface EditTaskModalProps {
  onClose: () => void;
  onEditTask: (task: Task) => void;
  taskToEdit: Task;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ onClose, onEditTask, taskToEdit }) => {
  const { t } = useTranslations();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('personal');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [isTimeEnabled, setIsTimeEnabled] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setCategory(taskToEdit.category);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate);
      if (taskToEdit.dueTime) {
        setDueTime(taskToEdit.dueTime);
        setIsTimeEnabled(true);
      } else {
        setDueTime('');
        setIsTimeEnabled(false);
      }
    }
  }, [taskToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !taskToEdit) return;
    onEditTask({ 
        ...taskToEdit, 
        title, 
        description, 
        category, 
        priority, 
        dueDate,
        dueTime: isTimeEnabled ? dueTime : undefined,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t.edit_task}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title-edit" className="block text-sm font-medium text-gray-600 dark:text-gray-300">{t.task_title}</label>
            <input type="text" id="title-edit" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full bg-slate-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
           <div>
            <label htmlFor="description-edit" className="block text-sm font-medium text-gray-600 dark:text-gray-300">{t.task_description}</label>
            <textarea id="description-edit" value={description} onChange={e => setDescription(e.target.value)} rows={2} className="mt-1 block w-full bg-slate-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category-edit" className="block text-sm font-medium text-gray-600 dark:text-gray-300">{t.category}</label>
              <select id="category-edit" value={category} onChange={e => setCategory(e.target.value as TaskCategory)} className="mt-1 block w-full bg-slate-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                 <option value="personal">{t.category_personal}</option>
                <option value="work">{t.category_work}</option>
                <option value="learning">{t.category_learning}</option>
                <option value="studying">{t.category_studying}</option>
                <option value="entertainment">{t.category_entertainment}</option>
                <option value="exercise">{t.category_exercise}</option>
                <option value="mental">{t.category_mental}</option>
              </select>
            </div>
            <div>
              <label htmlFor="priority-edit" className="block text-sm font-medium text-gray-600 dark:text-gray-300">{t.priority}</label>
              <select id="priority-edit" value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} className="mt-1 block w-full bg-slate-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="low">{t.priority_low}</option>
                <option value="medium">{t.priority_medium}</option>
                <option value="high">{t.priority_high}</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="dueDate-edit" className="block text-sm font-medium text-gray-600 dark:text-gray-300">{t.due_date}</label>
            <input type="date" id="dueDate-edit" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 block w-full bg-slate-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div>
             <div className="flex items-center">
              <input id="time-toggle-edit" type="checkbox" checked={isTimeEnabled} onChange={e => setIsTimeEnabled(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="time-toggle-edit" className="ml-2 block text-sm text-gray-600 dark:text-gray-300">{t.specify_time}</label>
            </div>
            {isTimeEnabled && (
              <input type="time" id="dueTime-edit" value={dueTime} onChange={e => setDueTime(e.target.value)} className="mt-2 block w-full bg-slate-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            )}
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all">{t.cancel}</button>
            <button type="submit" className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">{t.save}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditTaskModal;

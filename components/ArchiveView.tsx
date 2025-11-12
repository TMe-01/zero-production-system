import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { deleteArchivedTask, fetchArchivedTasks } from '../services/apiService';
import { ArchivedTask } from '../types';
import Spinner from './Spinner';
import { useTranslations } from '../hooks/useTranslations';
import { TrashIcon } from './Icons';

interface ArchiveViewProps {
    onBack: () => void;
}

const ArchiveView: React.FC<ArchiveViewProps> = ({ onBack }) => {
    const [archivedTasks, setArchivedTasks] = useState<ArchivedTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, getCategoryName, language } = useTranslations();

    const loadArchivedTasks = async () => {
        setIsLoading(true);
        const tasks = await fetchArchivedTasks();
        setArchivedTasks(tasks.sort((a, b) => new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime()));
        setIsLoading(false);
    };

    useEffect(() => {
        loadArchivedTasks();
    }, []);

    const handleDelete = async (taskId: string) => {
        if(confirm(t.confirm_delete)) {
            await deleteArchivedTask(taskId);
            loadArchivedTasks();
        }
    }

    const groupedTasks = useMemo(() => {
        return archivedTasks.reduce((acc, task) => {
            const date = new Date(task.archivedAt).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' });
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(task);
            return acc;
        }, {} as Record<string, ArchivedTask[]>);
    }, [archivedTasks, language]);

    const statusClasses = {
        completed: 'text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-300',
        not_executed: 'text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300'
    }

    return (
        <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t.archived_tasks}</h2>
                <button
                    onClick={onBack}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    {t.back_to_tasks}
                </button>
            </div>
            {isLoading ? (
                <div className="flex justify-center mt-16">
                    <Spinner />
                </div>
            ) : Object.keys(groupedTasks).length === 0 ? (
                 <p className="text-gray-500 dark:text-gray-400 text-center mt-8">{t.no_archived_tasks}</p>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedTasks).map(([date, tasks]: [string, ArchivedTask[]]) => (
                        <div key={date}>
                            <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">{date}</h3>
                            <div className="space-y-3">
                                {tasks.map(task => (
                                    <div key={task.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-gray-600 dark:text-gray-400 line-through">{task.title}</h4>
                                            <div className="flex items-center gap-2 mt-2 text-xs">
                                                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">{getCategoryName(task.category)}</span>
                                                <span className={`px-2 py-1 rounded-full font-medium ${statusClasses[task.status]}`}>{t[task.status]}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(task.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full" aria-label={t.delete}>
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default ArchiveView;

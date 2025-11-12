
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as habitService from '../services/habitService';
import { ArchivedHabit } from '../types';
import Spinner from './Spinner';
import { useTranslations } from '../hooks/useTranslations';

interface HabitArchiveViewProps {
    onBack: () => void;
}

const HabitArchiveView: React.FC<HabitArchiveViewProps> = ({ onBack }) => {
    const [archivedHabits, setArchivedHabits] = useState<ArchivedHabit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, language } = useTranslations();

    useEffect(() => {
        const loadArchivedHabits = async () => {
            setIsLoading(true);
            const habits = await habitService.fetchArchivedHabits();
            setArchivedHabits(habits.sort((a, b) => new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime()));
            setIsLoading(false);
        };
        loadArchivedHabits();
    }, []);

    const groupedHabits = useMemo(() => {
        return archivedHabits.reduce((acc, habit) => {
            const date = new Date(habit.archivedAt).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' });
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(habit);
            return acc;
        }, {} as Record<string, ArchivedHabit[]>);
    }, [archivedHabits, language]);

     const statusClasses = {
        completed: 'text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-300',
        not_executed: 'text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300'
    }

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
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
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t.habit_archive}</h2>
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
            ) : Object.keys(groupedHabits).length === 0 ? (
                 <p className="text-gray-500 dark:text-gray-400 text-center mt-8">{t.no_archived_tasks}</p>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedHabits).map(([date, habits]: [string, ArchivedHabit[]]) => (
                        <div key={date}>
                            <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">{date}</h3>
                            <div className="space-y-3">
                                {habits.map(habit => (
                                    <div key={habit.id + habit.archivedAt} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-gray-800 dark:text-gray-200">{t[habit.titleKey as keyof typeof t] || habit.titleKey}</h4>
                                            {habit.status === 'completed' && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{t.completed_status} at {formatTime(habit.archivedAt)}</p>
                                            )}
                                        </div>
                                        <span className={`px-2 py-1 rounded-full font-medium text-xs ${statusClasses[habit.status]}`}>{t[habit.status]}</span>
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

export default HabitArchiveView;

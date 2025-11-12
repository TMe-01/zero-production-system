import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../hooks/useTranslations';
import * as habitService from '../services/habitService';
import { Habit } from '../types';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { generateDietPlanTasks } from '../services/geminiService';
import { getInitialHabits } from '../utils/habitUtils';

const HabitTracker: React.FC = () => {
    const { t } = useTranslations();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isDietModalOpen, setDietModalOpen] = useState(false);
    const [dietPlan, setDietPlan] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const { prayerTimes, error: prayerTimesError } = usePrayerTimes();

    useEffect(() => {
        const initialHabits = getInitialHabits(prayerTimes);
        const savedStatuses = habitService.getHabitStatusesForToday();
        
        const mergedHabits = initialHabits.map(habit => ({
            ...habit,
            isCompleted: savedStatuses[habit.id] ?? false,
        }));

        setHabits(mergedHabits);
    }, [prayerTimes]);

    const handleToggleHabit = (habitId: string) => {
        const updatedHabits = habits.map(h => 
            h.id === habitId ? { ...h, isCompleted: !h.isCompleted } : h
        );
        setHabits(updatedHabits);
        const updatedStatuses = updatedHabits.reduce((acc, h) => {
            acc[h.id] = h.isCompleted;
            return acc;
        }, {} as Record<string, boolean>);
        habitService.saveHabitStatusesForToday(updatedStatuses);

        const habitToArchive = habits.find(h => h.id === habitId);
        if(habitToArchive){
            habitService.archiveHabit(habitToArchive, !habitToArchive.isCompleted ? 'completed' : 'not_executed');
        }
    };

    const handleSyncDiet = async () => {
        if (!dietPlan) return;
        setIsSyncing(true);
        const newDietHabits = await generateDietPlanTasks(dietPlan);
        const formattedNewHabits: Habit[] = newDietHabits.map(h => ({
            ...h,
            id: `diet_${h.time}`,
            isCompleted: false,
        }));
        
        // Replace old diet habits with new ones
        const nonDietHabits = habits.filter(h => !h.id.startsWith('diet_'));
        const updatedHabits = [...nonDietHabits, ...formattedNewHabits].sort((a,b) => (a.time || '23:59').localeCompare(b.time || '23:59'));
        
        setHabits(updatedHabits);
        
        // Update statuses
        const updatedStatuses = updatedHabits.reduce((acc, h) => {
            acc[h.id] = h.isCompleted;
            return acc;
        }, {} as Record<string, boolean>);
        habitService.saveHabitStatusesForToday(updatedStatuses);


        setIsSyncing(false);
        setDietModalOpen(false);
        setDietPlan('');
    }

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">{t.daily_habits}</h2>
            {prayerTimesError && <p className="text-red-500 text-sm mb-4">{prayerTimesError}</p>}
            <div className="space-y-3">
                {habits.map(habit => (
                    <div key={habit.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <input 
                                type="checkbox"
                                checked={habit.isCompleted}
                                onChange={() => handleToggleHabit(habit.id)}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label className={`font-medium ${habit.isCompleted ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                                {t[habit.titleKey as keyof typeof t] || habit.titleKey}
                            </label>
                        </div>
                        {habit.time && (
                            <span className="text-sm font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                {habit.time}
                            </span>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={() => setDietModalOpen(true)} className="mt-4 w-full text-center py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all">
                {t.sync_diet_plan}
            </button>

            {isDietModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
                    onClick={() => setDietModalOpen(false)}
                >
                    <motion.div
                        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold mb-4">{t.diet_plan_prompt}</h3>
                        <textarea 
                            value={dietPlan}
                            onChange={e => setDietPlan(e.target.value)}
                            rows={5}
                            className="w-full bg-slate-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2"
                        />
                        <div className="flex justify-end gap-4 mt-4">
                            <button onClick={() => setDietModalOpen(false)} className="py-2 px-4 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-semibold rounded-lg">{t.cancel}</button>
                            <button onClick={handleSyncDiet} disabled={isSyncing} className="py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg disabled:bg-teal-800">
                                {isSyncing ? t.syncing : t.sync_diet_plan}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default HabitTracker;

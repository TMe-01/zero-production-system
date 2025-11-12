import { Habit, ArchivedHabit } from '../types';

const getTodayKey = () => `habit_status_${new Date().toISOString().split('T')[0]}`;
const ARCHIVED_HABITS_KEY = 'archived_habits';

// --- Daily Status Functions ---

export const getHabitStatusesForToday = (): Record<string, boolean> => {
  try {
    const statusesJson = localStorage.getItem(getTodayKey());
    return statusesJson ? JSON.parse(statusesJson) : {};
  } catch (error) {
    console.error('Failed to parse habit statuses', error);
    return {};
  }
};

export const saveHabitStatusesForToday = (statuses: Record<string, boolean>) => {
  try {
    localStorage.setItem(getTodayKey(), JSON.stringify(statuses));
  } catch (error) {
    console.error('Failed to save habit statuses', error);
  }
};

// --- Archive Functions ---

const getArchivedHabits = (): ArchivedHabit[] => {
  try {
    const habitsJson = localStorage.getItem(ARCHIVED_HABITS_KEY);
    return habitsJson ? JSON.parse(habitsJson) : [];
  } catch (error) {
    console.error("Failed to parse archived habits", error);
    return [];
  }
};

const saveArchivedHabits = (habits: ArchivedHabit[]) => {
  try {
    localStorage.setItem(ARCHIVED_HABITS_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error("Failed to save archived habits", error);
  }
};

export const archiveHabit = async (habit: Habit, status: 'completed' | 'not_executed'): Promise<void> => {
    const todayStr = new Date().toISOString().split('T')[0];
    const archived: ArchivedHabit = {
      ...habit,
      status,
      date: todayStr,
      archivedAt: new Date().toISOString(),
    };
    
    let archivedHabits = getArchivedHabits();
    // Prevent duplicates for the same day
    archivedHabits = archivedHabits.filter(h => !(h.id === habit.id && h.date === todayStr));
    archivedHabits.push(archived);
    saveArchivedHabits(archivedHabits);
    return Promise.resolve();
};

export const fetchArchivedHabits = async (): Promise<ArchivedHabit[]> => {
    return Promise.resolve(getArchivedHabits());
};

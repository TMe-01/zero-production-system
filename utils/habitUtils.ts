
import { Habit } from '../types';

interface PrayerTimes {
  Fajr: string;
  Dhuhr?: string;
  Asr?: string;
  Maghrib?: string;
  Isha?: string;
}

export const getInitialHabits = (prayerTimes: PrayerTimes | null): Habit[] => {
  
  const habits: Omit<Habit, 'isCompleted'>[] = [
    { id: 'fajr_prayer', titleKey: 'habit_fajr_prayer', time: prayerTimes?.Fajr },
    { id: 'home_workout', titleKey: 'habit_home_workout', time: '07:30' },
    { id: 'face_exercises', titleKey: 'habit_face_exercises', time: '08:15' },
    { id: 'quran_recitation', titleKey: 'habit_quran_recitation', time: '20:00' },
    { id: 'mosque_prayer', titleKey: 'habit_mosque_prayer' }, // No time
    { id: 'sunnah_prayers', titleKey: 'habit_sunnah_prayers' }, // No time
    { id: 'qiyam_al_layl', titleKey: 'habit_qiyam_al_layl', time: '02:00' },
  ];

  return habits
    .filter(h => h.id !== 'fajr_prayer' || (h.id === 'fajr_prayer' && h.time)) // Filter out fajr if prayer times failed
    .map(h => ({ ...h, isCompleted: false }))
    .sort((a, b) => {
        if(a.time && b.time) return a.time.localeCompare(b.time);
        if(a.time) return -1;
        if(b.time) return 1;
        return 0;
    });
};

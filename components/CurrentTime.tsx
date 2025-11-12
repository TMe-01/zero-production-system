import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';

const CurrentTime: React.FC = () => {
    const { language } = useTranslations();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };
    
    return (
        <div className="text-center hidden lg:block">
            <div className="text-lg font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">
                {time.toLocaleTimeString('en-US', timeOptions)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {time.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', dateOptions)}
            </div>
        </div>
    );
};

export default CurrentTime;

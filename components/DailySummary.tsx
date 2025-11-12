import React, { useState } from 'react';
import { Task } from '../types';
import { generateDailySummary } from '../services/geminiService';
import { useTranslations } from '../hooks/useTranslations';
import Spinner from './Spinner';
import { SparklesIcon } from './Icons';

interface DailySummaryProps {
  tasks: Task[];
}

const DailySummary: React.FC<DailySummaryProps> = ({ tasks }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useTranslations();

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    try {
      const result = await generateDailySummary(tasks, language);
      setSummary(result);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      setSummary('Failed to generate summary.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.daily_summary}</h2>
        <button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all disabled:bg-purple-800 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Spinner />
              {t.summary_loading}
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              {t.generate_summary}
            </>
          )}
        </button>
      </div>
      {summary && (
        <div className="mt-4 text-gray-700 dark:text-gray-300 bg-slate-100 dark:bg-gray-700 p-3 rounded-md">
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default DailySummary;

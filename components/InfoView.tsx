
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { InfoViewType } from '../types';
import { useInfoContent } from '../hooks/useInfoContent';
import { useTranslations } from '../hooks/useTranslations';
import Spinner from './Spinner';

interface InfoViewProps {
    viewType: InfoViewType;
    onBack: () => void;
}

const InfoView: React.FC<InfoViewProps> = ({ viewType, onBack }) => {
    const { content, isLoading, error, isTopicModalOpen, handleSetTopic, monthlyTopic } = useInfoContent(viewType);
    const { t } = useTranslations();
    const [topicInput, setTopicInput] = useState('');

    const viewTitles: Record<Exclude<InfoViewType, null>, string> = {
        tech: t.tech_news,
        economic: t.economic_news,
        monthly: t.monthly_topic,
        daily: t.daily_info,
    };
    
    const title = viewType ? viewTitles[viewType] : '';

    const handleTopicSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(topicInput.trim()){
            handleSetTopic(topicInput.trim());
        }
    }

    // Helper to render text with bold highlighting
    const renderContent = (text: string) => {
        // Split by bold markdown markers (**)
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
                return <strong key={index} className="font-bold text-indigo-700 dark:text-indigo-300">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
         <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="p-4 md:p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
                <button
                    onClick={onBack}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    {t.back_to_tasks}
                </button>
            </div>

            {isTopicModalOpen && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">{t.monthly_topic_prompt_title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{t.monthly_topic_prompt_desc}</p>
                    <form onSubmit={handleTopicSubmit} className="flex gap-2">
                        <input 
                            type="text"
                            value={topicInput}
                            onChange={e => setTopicInput(e.target.value)}
                            className="flex-grow bg-slate-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                        <button type="submit" className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md">{t.save}</button>
                    </form>
                </div>
            )}

            {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <Spinner />
                </div>
            )}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {content && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {renderContent(content)}
                </div>
            )}
             {viewType === 'monthly' && monthlyTopic && !isLoading && content && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 opacity-70">{t.monthly_topic}: {monthlyTopic}</p>
             )}
        </motion.div>
    );
};

export default InfoView;


import { useState, useEffect, useCallback } from 'react';
import { InfoViewType } from '../types';
import * as gemini from '../services/geminiService';
import { useTranslations } from './useTranslations';

const getSessionCache = (key: string) => sessionStorage.getItem(key);
const setSessionCache = (key: string, value: string) => sessionStorage.setItem(key, value);

const getLocalCache = (key: string) => localStorage.getItem(key);
const setLocalCache = (key: string, value: string) => localStorage.setItem(key, value);


export const useInfoContent = (viewType: InfoViewType) => {
    const [content, setContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [monthlyTopic, setMonthlyTopic] = useState<string | null>(getLocalCache('monthlyTopic'));
    const [isTopicModalOpen, setTopicModalOpen] = useState(false);
    const { language, t } = useTranslations();

    const fetchContent = useCallback(async (currentView: InfoViewType) => {
        if (!currentView) return;

        // For real-time news (Tech, Econ), we DO NOT want daily caching.
        // We want fresh data every time the user clicks.
        const isRealTime = currentView === 'tech' || currentView === 'economic';
        const cacheKey = `info_${currentView}_${language}_${new Date().toISOString().split('T')[0]}`;
        
        if (!isRealTime) {
             const cachedContent = getSessionCache(cacheKey);
             if (cachedContent) {
                 setContent(cachedContent);
                 return;
             }
        }

        setIsLoading(true);
        setError(null);
        setContent(null);

        try {
            let result: string;
            switch (currentView) {
                case 'tech':
                    result = await gemini.getTechNews(language);
                    break;
                case 'economic':
                    result = await gemini.getEconomicNews(language);
                    break;
                case 'monthly':
                    if (!monthlyTopic) {
                        setTopicModalOpen(true);
                        setIsLoading(false);
                        return;
                    }
                    result = await gemini.getDailyTopicInfo(monthlyTopic, language);
                    break;
                case 'daily':
                    result = await gemini.getGeneralKnowledgeOrQuiz(language);
                    break;
                default:
                    throw new Error("Invalid view type");
            }
            setContent(result);
            if (!isRealTime) {
                setSessionCache(cacheKey, result);
            }
        } catch (err) {
            setError(t.error_info);
        } finally {
            setIsLoading(false);
        }
    }, [language, monthlyTopic, t.error_info]);
    
    useEffect(() => {
        if (viewType) {
            fetchContent(viewType);
        }
    }, [viewType, fetchContent]);

    const handleSetTopic = (topic: string) => {
        setMonthlyTopic(topic);
        setLocalCache('monthlyTopic', topic);
        setTopicModalOpen(false);
        // Refetch content with the new topic
        if (viewType === 'monthly') {
             // Manually trigger refetch since state update might be async
             (async () => {
                setIsLoading(true);
                setError(null);
                setContent(null);
                try {
                    const result = await gemini.getDailyTopicInfo(topic, language);
                    const cacheKey = `info_monthly_${language}_${new Date().toISOString().split('T')[0]}`;
                    setContent(result);
                    setSessionCache(cacheKey, result);
                } catch (err) {
                     setError(t.error_info);
                } finally {
                    setIsLoading(false);
                }
             })();
        }
    };

    return { content, isLoading, error, isTopicModalOpen, handleSetTopic, monthlyTopic };
};

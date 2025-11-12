
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../hooks/useTranslations';
import { InfoViewType } from '../types';
import { ComputerIcon, MoneyIcon, BookIcon, LightbulbIcon } from './Icons';

interface InfoNavProps {
    onNavigate: (view: InfoViewType) => void;
}

const InfoNav: React.FC<InfoNavProps> = ({ onNavigate }) => {
    const { t } = useTranslations();

    const navItems = [
        { view: 'tech', label: t.tech_news, Icon: ComputerIcon, color: 'bg-blue-500 hover:bg-blue-600' },
        { view: 'economic', label: t.economic_news, Icon: MoneyIcon, color: 'bg-yellow-500 hover:bg-yellow-600' },
        { view: 'monthly', label: t.monthly_topic, Icon: BookIcon, color: 'bg-purple-500 hover:bg-purple-600' },
        { view: 'daily', label: t.daily_info, Icon: LightbulbIcon, color: 'bg-green-500 hover:bg-green-600' },
    ] as const;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
            {navItems.map((item, index) => (
                <motion.button
                    key={item.view}
                    onClick={() => onNavigate(item.view)}
                    className={`p-4 rounded-lg text-white font-bold flex flex-col items-center justify-center text-center shadow-lg transition-all transform hover:scale-105 ${item.color}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <item.Icon className="w-8 h-8 mb-2" />
                    <span className="text-sm">{item.label}</span>
                </motion.button>
            ))}
        </div>
    );
};

export default InfoNav;

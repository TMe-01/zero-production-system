import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '../hooks/useTranslations';
import { ArchiveIcon } from './Icons';
import { View } from '../App';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate }) => {
  const { t } = useTranslations();

  const handleNavigate = (view: View) => {
    onNavigate(view);
    onClose();
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  const backdropVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            transition={{ duration: 0.3 }}
          />
          <motion.aside
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-4 space-y-4 flex flex-col flex-shrink-0 z-40 shadow-lg"
          >
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">ZERO Production</h2>
            </div>
            <nav className="flex-grow">
              <ul>
                <li>
                  <button
                    onClick={() => handleNavigate('tasks')}
                    className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span>{t.tasks}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('archive')}
                    className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ArchiveIcon className="w-5 h-5" />
                    <span>{t.task_archive}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('habit_archive')}
                    className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ArchiveIcon className="w-5 h-5" />
                    <span>{t.habit_archive}</span>
                  </button>
                </li>
              </ul>
            </nav>
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              <p>ZERO Production System v2.0</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ListBulletIcon } from './icons';

interface StartScreenProps {
  onStartCreating: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartCreating }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center w-full max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('startOptionsTitle')}</h1>
        <div className="flex justify-center">
            <OptionCard
              icon={<ListBulletIcon className="w-10 h-10 text-sky-400" />}
              title={t('createMyCVTitle')}
              description={t('createMyCVDesc')}
              onClick={onStartCreating}
            />
        </div>
      </div>
    </div>
  );
};

interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-lg p-6 text-left flex items-center space-x-6 hover:bg-gray-700 hover:border-sky-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
  >
    <div className="flex-shrink-0">
      {icon}
    </div>
    <div>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="text-gray-400 mt-1">{description}</p>
    </div>
  </button>
);

export default StartScreen;
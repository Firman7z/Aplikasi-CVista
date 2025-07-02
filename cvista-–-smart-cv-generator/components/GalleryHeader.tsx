import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const GalleryHeader: React.FC = () => {
    const { t } = useLanguage();

    return (
        <header className="p-4 flex items-center justify-center bg-gray-900 border-b border-gray-700/50 sticky top-0 z-20">
            <h1 className="text-xl font-bold text-white">{t('templateGalleryTitle')}</h1>
        </header>
    );
};

export default GalleryHeader;

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { TemplateId } from './TemplateSelector';
import GalleryHeader from './GalleryHeader';
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import { PREMA_TEMPLATE_IMG, TASYA_TEMPLATE_IMG, SHAWN_TEMPLATE_IMG } from './templateImages';

interface TemplateGalleryViewProps {
    onSelectTemplate: (templateId: TemplateId, themeColor: string) => void;
}

type TemplateConfig = {
    id: TemplateId;
    nameKey: 'modernTemplate' | 'professionalTemplate' | 'corporateTemplate';
    imageSrc: string;
    colors: string[];
};

const TemplateGalleryView: React.FC<TemplateGalleryViewProps> = ({ onSelectTemplate }) => {
    const { t } = useLanguage();
    
    const templates = useMemo((): TemplateConfig[] => [
        { id: 'prema', nameKey: 'corporateTemplate', imageSrc: PREMA_TEMPLATE_IMG, colors: ['#000000', '#556b2f', '#808000', '#f59e0b'] },
        { id: 'tasya', nameKey: 'modernTemplate', imageSrc: TASYA_TEMPLATE_IMG, colors: ['#2E8B57', '#f97316', '#1d4ed8', '#a3e635'] },
        { id: 'shawn', nameKey: 'professionalTemplate', imageSrc: SHAWN_TEMPLATE_IMG, colors: ['#1e3a8a', '#334155', '#c2410c', '#3f6212'] },
    ], []);

    const [currentIndex, setCurrentIndex] = useState(0);
    
    const [selectedColors, setSelectedColors] = useState<Record<TemplateId, string>>(() => {
      const initialColors: Partial<Record<TemplateId, string>> = {};
      templates.forEach(t => {
        initialColors[t.id] = t.colors[0];
      });
      return initialColors as Record<TemplateId, string>;
    });

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % templates.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + templates.length) % templates.length);
    };

    const handleColorSelect = (templateId: TemplateId, color: string) => {
        setSelectedColors(prev => ({ ...prev, [templateId]: color }));
    };

    const currentTemplate = templates[currentIndex];

    if (templates.length === 0) {
        return <div className="flex items-center justify-center h-full text-white">Loading templates...</div>;
    }

    return (
        <div className="w-full h-full bg-gray-900 flex flex-col text-white">
            <GalleryHeader />
            <div className="flex-grow flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Carousel */}
                <div className="w-full flex items-center justify-center">
                    <button onClick={handlePrev} className="absolute left-4 md:left-8 z-10 p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>

                    <div className="w-full max-w-md">
                        <div className="text-center mb-4">
                            <h2 className="text-2xl font-bold">{t(currentTemplate.nameKey)}</h2>
                            <p className="text-sm text-gray-400">{currentIndex + 1} / {templates.length}</p>
                        </div>
                        <div className="relative aspect-[3/4] bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
                            <img src={currentTemplate.imageSrc} alt={t(currentTemplate.nameKey)} className="w-full h-full object-cover" />
                             {/* Color Palette */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 p-2 rounded-full flex items-center space-x-2 backdrop-blur-sm">
                                {currentTemplate.colors.map(color => (
                                    <button 
                                        key={color}
                                        onClick={() => handleColorSelect(currentTemplate.id, color)}
                                        className="w-8 h-8 rounded-full border-2 transition-transform duration-200 transform hover:scale-110"
                                        style={{ 
                                            backgroundColor: color, 
                                            borderColor: selectedColors[currentTemplate.id] === color ? 'white' : 'transparent'
                                        }}
                                        aria-label={`Select color ${color}`}
                                    >
                                        {selectedColors[currentTemplate.id] === color && <CheckIcon className="w-5 h-5 text-white mx-auto" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={handleNext} className="absolute right-4 md:right-8 z-10 p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Sticky bottom button */}
            <div className="p-4 bg-gray-900/80 backdrop-blur-sm sticky bottom-0 z-20 w-full">
                <button
                    onClick={() => onSelectTemplate(currentTemplate.id, selectedColors[currentTemplate.id])}
                    className="w-full max-w-md mx-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    {t('useThisTemplate')}
                </button>
            </div>
        </div>
    );
};

export default TemplateGalleryView;
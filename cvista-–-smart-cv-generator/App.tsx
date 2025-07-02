
import React, { useState, useCallback } from 'react';
import { useCVData } from './hooks/useCVData';
import { useLanguage } from './contexts/LanguageContext';
import EditorView from './components/EditorView';
import BottomNav from './components/BottomNav';
import StartScreen from './components/StartScreen';
import TemplateGalleryView from './components/TemplateGalleryView';
import { TemplateId } from './components/TemplateSelector';

export type NavId = 'profile' | 'templates' | 'pdf' | 'tools' | 'settings';

// A placeholder for future features
const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex items-center justify-center h-full text-white bg-gray-900">
        <div className="text-center p-4">
            <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
            <p className="text-gray-400 mt-2">This feature is coming soon!</p>
        </div>
    </div>
);

const App: React.FC = () => {
  const { t } = useLanguage();
  const { 
    cvData, 
    resetCVData,
    ...restOfHandlers 
  } = useCVData();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeNav, setActiveNav] = useState<NavId>('profile');
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>('tasya');
  const [selectedThemeColor, setSelectedThemeColor] = useState<string>('#000000');

  const handleNavigate = useCallback((navId: NavId) => {
      setActiveNav(navId);
  }, []);

  const handleCreateCV = useCallback(() => {
    resetCVData(false); // reset without confirm
    setSelectedTemplateId('tasya'); // Default to Delta/Tasya
    setSelectedThemeColor('#000000'); // Default color for Delta
    setIsEditing(true);
  }, [resetCVData]);
  
  const handleSelectTemplate = useCallback((templateId: TemplateId, themeColor: string) => {
    setSelectedTemplateId(templateId);
    setSelectedThemeColor(themeColor);
    setIsEditing(true);
  }, []);

  const handleExitEditor = useCallback(() => {
    setIsEditing(false);
  }, []);

  const renderMainView = () => {
    switch (activeNav) {
      case 'profile':
        return <StartScreen onStartCreating={handleCreateCV} />;
      case 'templates':
        return <TemplateGalleryView onSelectTemplate={handleSelectTemplate} />;
      case 'pdf':
        return <PlaceholderView title={t('navMyPdf')} />;
      case 'tools':
        return <PlaceholderView title={t('navPdfTools')} />;
      case 'settings':
        return <PlaceholderView title={t('navSettings')} />;
      default:
        return <StartScreen onStartCreating={handleCreateCV} />;
    }
  };
  
  if (isEditing) {
    return (
      <EditorView
        cvData={cvData}
        resetCVData={resetCVData}
        templateId={selectedTemplateId}
        themeColor={selectedThemeColor}
        onExitEditor={handleExitEditor}
        {...restOfHandlers}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <main className="flex-grow overflow-hidden">
        {renderMainView()}
      </main>
      <BottomNav active={activeNav} onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
import React, { useRef, useState, useCallback } from 'react';
import CVForm from './CVForm';
import CVPreview from './CVPreview';
import { exportToDOCX } from '../services/cvExportService';
import { EyeIcon, TrashIcon, WordIcon, ArrowLeftIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import { TemplateId } from './TemplateSelector';
import { CVData, PersonalData, EducationEntry, WorkExperienceEntry, SkillEntry, ReferenceEntry, HobbyEntry, LanguageEntry } from '../types';

interface EditorViewProps {
  cvData: CVData;
  resetCVData: (confirm?: boolean) => void;
  templateId: TemplateId;
  themeColor: string;
  onExitEditor: () => void;
  
  handleCVDataChange: <K extends keyof CVData>(key: K, value: CVData[K]) => void;
  handlePersonalDataChange: <K extends keyof PersonalData>(key: K, value: PersonalData[K]) => void;
  handleLanguageProficiencyChange: <K extends keyof CVData['languageProficiency']>(key: K, value: string) => void;
  addEducation: (isFormal: boolean) => void;
  updateEducation: (index: number, field: keyof EducationEntry, value: string | boolean) => void;
  removeEducation: (id: string) => void;
  addWorkExperience: () => void;
  updateWorkExperience: (index: number, field: keyof WorkExperienceEntry, value: string | string[]) => void;
  removeWorkExperience: (id: string) => void;
  addResponsibility: (expIndex: number) => void;
  updateResponsibility: (expIndex: number, respIndex: number, value: string) => void;
  removeResponsibility: (expIndex: number, respIndex: number) => void;
  addSkill: (newItem: Omit<SkillEntry, 'id'>) => void;
  updateSkill: (index: number, field: keyof SkillEntry, value: any) => void;
  removeSkill: (id: string) => void;
  addLanguage: (newItem: Omit<LanguageEntry, 'id'>) => void;
  updateLanguage: (index: number, field: keyof LanguageEntry, value: any) => void;
  removeLanguage: (id: string) => void;
  addReference: (newItem: Omit<ReferenceEntry, 'id'>) => void;
  updateReference: (index: number, field: keyof ReferenceEntry, value: any) => void;
  removeReference: (id: string) => void;
  addHobby: (newItem: Omit<HobbyEntry, 'id'>) => void;
  updateHobby: (index: number, field: keyof HobbyEntry, value: any) => void;
  removeHobby: (id: string) => void;
}


const EditorView: React.FC<EditorViewProps> = ({ cvData, handlePersonalDataChange, resetCVData, templateId, themeColor, onExitEditor, ...props }) => {
  const { t } = useLanguage();
  
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showPreviewPane, setShowPreviewPane] = useState(true);

  const handleExportDOCX = useCallback(async () => {
    setIsExporting(true);
    alert("Note: DOCX export uses a standard formal layout and does not reflect the selected visual template.");
    try {
      let fileNameParts = [];
      if (cvData.personalData.fullName) fileNameParts.push(cvData.personalData.fullName.trim().replace(/\s+/g, '_'));
      if (cvData.personalData.proposedPosition) fileNameParts.push(cvData.personalData.proposedPosition.trim().replace(/\s+/g, '_'));
      
      const baseName = fileNameParts.length > 0 ? fileNameParts.join('_') : 'CV_Riwayat_Hidup';
      const fileName = `${baseName}.docx`;

      await exportToDOCX(cvData, fileName);
    } catch(e) {
      console.error("DOCX export failed:", e);
      alert(`Gagal mengekspor DOCX: ${(e as Error).message || 'Terjadi kesalahan.'}`);
    } finally {
      setIsExporting(false);
    }
  }, [cvData]);
  
  const togglePreviewPane = () => {
    setShowPreviewPane(prev => !prev);
  };
  
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert(t('imageSizeWarning'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handlePersonalDataChange('profilePicture', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const formHandlers = {
    onCVDataChange: props.handleCVDataChange,
    onPersonalDataChange: handlePersonalDataChange,
    onLanguageProficiencyChange: props.handleLanguageProficiencyChange,
    onAddEducation: props.addEducation,
    onUpdateEducation: props.updateEducation,
    onRemoveEducation: props.removeEducation,
    onAddWorkExperience: props.addWorkExperience,
    onUpdateWorkExperience: props.updateWorkExperience,
    onRemoveWorkExperience: props.removeWorkExperience,
    onAddResponsibility: props.addResponsibility,
    onUpdateResponsibility: props.updateResponsibility,
    onRemoveResponsibility: props.removeResponsibility,
    onAddSkill: props.addSkill,
    onUpdateSkill: props.updateSkill,
    onRemoveSkill: props.removeSkill,
    onAddLanguage: props.addLanguage,
    onUpdateLanguage: props.updateLanguage,
    onRemoveLanguage: props.removeLanguage,
    onAddReference: props.addReference,
    onUpdateReference: props.updateReference,
    onRemoveReference: props.removeReference,
    onAddHobby: props.addHobby,
    onUpdateHobby: props.updateHobby,
    onRemoveHobby: props.removeHobby,
  };

  return (
    <div className="flex flex-col h-screen bg-slate-200">
      <header className="bg-sky-800 text-white p-4 shadow-md no-print z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onExitEditor} className="p-2 rounded-full hover:bg-sky-700 transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold hidden sm:block">{t('appTitle')}</h1>
          </div>
          <div className="flex items-center space-x-2">
             <button
              onClick={togglePreviewPane}
              className="p-2 bg-sky-700 hover:bg-sky-600 rounded-md transition duration-150 flex items-center"
              title={showPreviewPane ? t('togglePreviewHide') : t('togglePreviewShow')}
            >
              <EyeIcon />
            </button>
            <button
              onClick={handleExportDOCX}
              disabled={isExporting}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-md transition duration-150 flex items-center disabled:opacity-50"
            >
              <WordIcon /> <span className="hidden md:inline-block ml-1">{isExporting ? t('exporting') : t('downloadDocx')}</span>
            </button>
            <button
              onClick={() => resetCVData(true)}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-md transition duration-150 flex items-center"
              title={t('resetAll')}
            >
              <TrashIcon /> <span className="hidden md:inline-block ml-1">{t('resetAll')}</span>
            </button>
          </div>
        </div>
      </header>
       <main className="flex-grow container mx-auto p-0 md:p-4 no-print overflow-hidden">
        <div className={`grid ${showPreviewPane ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-0 md:gap-4 h-full`}>
          <div className="overflow-y-auto h-full custom-scrollbar pr-2 bg-slate-50 md:bg-transparent rounded-lg md:rounded-none shadow-lg md:shadow-none">
            <CVForm
              cvData={cvData}
              onProfilePictureChange={handleProfilePictureChange}
              {...formHandlers}
            />
          </div>
          {showPreviewPane && (
            <div className="bg-slate-300 p-0 md:p-4 rounded-lg shadow-inner overflow-y-auto h-full custom-scrollbar cv-preview-container">
               <CVPreview cvData={cvData} previewRef={previewRef} templateId={templateId} themeColor={themeColor}/>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditorView;
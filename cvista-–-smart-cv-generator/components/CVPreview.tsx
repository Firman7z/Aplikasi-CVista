import React from 'react';
import { CVData } from '../types';
import { TemplateId } from './TemplateSelector';
import TasyaTemplate from './templates/TasyaTemplate';
import ShawnTemplate from './templates/ShawnTemplate';
import PremaTemplate from './templates/PremaTemplate';

interface CVPreviewProps {
  cvData: CVData;
  previewRef: React.RefObject<HTMLDivElement>;
  templateId: TemplateId;
  themeColor: string;
}

export const formatDatePreview = (dateString: string, t: (key: string) => string, type: 'date' | 'month' = 'date') => {
  if (!dateString) return '';
   // Handle 'Present' case for endDate
  if (typeof dateString === 'string' && dateString.toLowerCase() === 'present') {
      return t('present');
  }

  const date = new Date(dateString);
   if (isNaN(date.getTime())) {
    return dateString; 
  }

  if (type === 'month') {
    const [year, month] = dateString.split('-');
    if (year && month) {
      return new Date(parseInt(year), parseInt(month) - 1, 15).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
    }
    return dateString;
  }
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const CVPreview: React.FC<CVPreviewProps> = ({ cvData, previewRef, templateId, themeColor }) => {
  // The outer div with scaling is now managed by the parent,
  // this component just switches the template.
  
  const renderTemplate = () => {
    switch(templateId) {
      case 'tasya':
        return <TasyaTemplate cvData={cvData} ref={previewRef} themeColor={themeColor} />;
      case 'shawn':
        return <ShawnTemplate cvData={cvData} ref={previewRef} themeColor={themeColor} />;
      case 'prema':
      default:
        return <PremaTemplate cvData={cvData} ref={previewRef} themeColor={themeColor} />;
    }
  }

  return (
    <div className="w-full h-full flex items-start justify-center p-4">
      <div 
        className="transform origin-top transition-transform duration-300" 
        style={{ transform: 'scale(0.85)'}}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};

export default CVPreview;
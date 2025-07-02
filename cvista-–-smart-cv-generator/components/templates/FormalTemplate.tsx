import React from 'react';
import { CVData } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatDatePreview } from '../CVPreview';

interface TemplateProps {
  cvData: CVData;
  themeColor?: string;
}

const FormalTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ cvData, themeColor = '#0369a1' }, ref) => {
  const { t } = useLanguage();
  const { personalData, education, workExperience, languageProficiency } = cvData;

  const renderResponsibilitiesPreview = (responsibilities: string[]) => {
    if (!responsibilities || responsibilities.filter(r => r.trim() !== '').length === 0) return <p className="text-xs text-gray-500 italic ml-6">{t('noResponsibilities')}</p>;
    return (
      <ul className="list-disc list-inside ml-6 mt-1 space-y-0.5">
        {responsibilities.map((resp, index) => (
          resp.trim() && <li key={index} className="text-sm text-gray-700">{resp}</li>
        ))}
      </ul>
    );
  };
  
  const formalEducation = education.filter(edu => edu.isFormal);
  const nonFormalEducation = education.filter(edu => !edu.isFormal);

  return (
    <div ref={ref} id="cv-preview-area" className="cv-preview-area p-8 bg-white shadow-xl max-w-4xl mx-auto text-gray-800 leading-relaxed print:shadow-none print:max-w-full" style={{ fontFamily: "'Times New Roman', Times, serif", width: '21cm', minHeight: '29.7cm' }}>
      <div className="text-center border-b-2 border-gray-400 pb-4 mb-6">
        <h1 className="text-3xl font-bold" style={{ color: themeColor }}>{personalData.fullName || t('unfilledName')}</h1>
        {personalData.proposedPosition && <p className="text-lg mt-1" style={{ color: themeColor }}>{personalData.proposedPosition}</p>}
      </div>

      <PreviewSectionSimple title="1. Posisi yang diusulkan" content={personalData.proposedPosition || t('unfilled')} themeColor={themeColor} />
      <PreviewSectionSimple title="2. Nama Perusahaan" content={personalData.lastCompany || t('unfilled')} themeColor={themeColor} />
      <PreviewSectionSimple title="3. Nama Personil" content={personalData.fullName || t('unfilled')} isBoldContent themeColor={themeColor} />
      <PreviewSectionSimple title="4. Tempat/Tanggal Lahir" content={`${personalData.placeOfBirth || t('unfilledBirthPlace')}, ${formatDatePreview(personalData.dateOfBirth, t) || t('unfilledBirthDate')}`} themeColor={themeColor} />

      <PreviewSectionList title="5. Pendidikan (Formal)" themeColor={themeColor}>
        {formalEducation.length > 0 ? (
          formalEducation.map(edu => (
            <div key={edu.id} className="text-sm mb-1">
              - {edu.degree || t('unfilledDegree')}, {edu.institutionName || t('unfilledInstitution')}, Lulus {edu.graduationYear || t('unfilledYear')}
            </div>
          ))
        ) : <p className="text-sm text-gray-500 italic ml-4">{t('noFormalEducation')}</p>}
      </PreviewSectionList>

      <PreviewSectionList title="6. Pendidikan Non Formal" themeColor={themeColor}>
         {nonFormalEducation.length > 0 ? (
          nonFormalEducation.map(edu => (
            <div key={edu.id} className="text-sm mb-1">
              - {edu.degree || t('unfilledTraining')}, {edu.institutionName || t('unfilledProvider')}, Selesai {edu.graduationYear || t('unfilledYear')}
            </div>
          ))
        ) : <p className="text-sm text-gray-500 italic ml-4">{t('noNonFormalEducation')}</p>}
      </PreviewSectionList>
      
      <PreviewSectionList title="7. Penguasaan Bahasa" themeColor={themeColor}>
        <p className="text-sm ml-4">a. Bahasa Indonesia : {languageProficiency.indonesia || t('unfilled')}</p>
        <p className="text-sm ml-4">b. Bahasa Inggris : {languageProficiency.inggris || t('unfilled')}</p>
        <p className="text-sm ml-4">c. Bahasa Setempat : {languageProficiency.setempat || t('unfilled')}</p>
      </PreviewSectionList>

      <PreviewSectionList title="8. Pengalaman Kerja" themeColor={themeColor}>
        {workExperience.length > 0 ? (
          workExperience.map((exp, index) => (
            <div key={exp.id} className="mb-3 border-b border-dashed border-gray-300 pb-2 last:border-b-0">
              <p className="text-sm font-semibold text-gray-700">Pengalaman #{index + 1}: {exp.jobTitle || t('unfilledPosition')}</p>
              <p className="text-xs text-gray-600 ml-4"><strong>Nama Kegiatan:</strong> {exp.activityName || "[N/A]"}</p>
              <p className="text-xs text-gray-600 ml-4"><strong>Lokasi:</strong> {exp.location || "[N/A]"}</p>
              <p className="text-xs text-gray-600 ml-4"><strong>Pengguna Jasa:</strong> {exp.clientName || "[N/A]"}</p>
              <p className="text-xs text-gray-600 ml-4"><strong>Perusahaan:</strong> {exp.companyName || "[N/A]"}</p>
              <p className="text-xs text-gray-600 ml-4"><strong>Waktu:</strong> {(formatDatePreview(exp.startDate, t, 'month') || '[Mulai]') + ' - ' + (formatDatePreview(exp.endDate, t, 'month') || '[Selesai]')}</p>
              <p className="text-xs text-gray-600 ml-4"><strong>Status:</strong> {exp.employmentStatus || "[N/A]"}</p>
              <p className="text-xs text-gray-600 ml-4"><strong>Referensi:</strong> {exp.referenceInfo || "[N/A]"}</p>
              <p className="text-xs text-gray-600 ml-4 mt-1"><strong>Uraian Tugas:</strong></p>
              {renderResponsibilitiesPreview(exp.responsibilities)}
            </div>
          ))
        ) : <p className="text-sm text-gray-500 italic ml-4">{t('noWorkExperience')}</p>}
      </PreviewSectionList>
    </div>
  );
});

interface PreviewSectionSimpleProps {
  title: string;
  content: string;
  isBoldContent?: boolean;
  themeColor: string;
}
const PreviewSectionSimple: React.FC<PreviewSectionSimpleProps> = ({ title, content, isBoldContent = false, themeColor }) => (
  <section className="mb-3 py-1 border-b border-gray-200">
    <div className="flex">
      <span className="text-sm font-semibold w-1/3 md:w-1/4" style={{ color: themeColor }}>{title}</span>
      <span className="text-sm mx-1" style={{ color: themeColor }}>:</span>
      <span className={`text-sm text-gray-700 flex-1 ${isBoldContent ? 'font-bold' : ''}`}>{content}</span>
    </div>
  </section>
);

interface PreviewSectionListProps {
  title: string;
  children: React.ReactNode;
  themeColor: string;
}
const PreviewSectionList: React.FC<PreviewSectionListProps> = ({ title, children, themeColor }) => (
  <section className="mb-3 py-1 border-b border-gray-200">
    <h2 className="text-sm font-semibold mb-1" style={{ color: themeColor }}>{title} :</h2>
    <div className="ml-4">{children}</div>
  </section>
);

export default FormalTemplate;
import React from 'react';
import { CVData, PersonalData, EducationEntry, WorkExperienceEntry, SkillEntry, ReferenceEntry, HobbyEntry, LanguageEntry } from '../types';
import { PlusIcon, TrashIcon } from './icons';
import Section from './Section';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import { useLanguage } from '../contexts/LanguageContext';

interface CVFormProps {
  cvData: CVData;
  onCVDataChange: <K extends keyof CVData>(key: K, value: CVData[K]) => void;
  onPersonalDataChange: <K extends keyof PersonalData>(key: K, value: PersonalData[K]) => void;
  onProfilePictureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLanguageProficiencyChange: <K extends keyof CVData['languageProficiency']>(key: K, value: string) => void;
  
  onAddEducation: (isFormal: boolean) => void;
  onUpdateEducation: (index: number, field: keyof EducationEntry, value: string | boolean) => void;
  onRemoveEducation: (id: string) => void;

  onAddWorkExperience: () => void;
  onUpdateWorkExperience: (index: number, field: keyof WorkExperienceEntry, value: string | string[]) => void;
  onRemoveWorkExperience: (id: string) => void;
  onAddResponsibility: (expIndex: number) => void;
  onUpdateResponsibility: (expIndex: number, respIndex: number, value: string) => void;
  onRemoveResponsibility: (expIndex: number, respIndex: number) => void;

  onAddSkill: (newItem: Omit<SkillEntry, 'id'>) => void;
  onUpdateSkill: (index: number, field: keyof SkillEntry, value: any) => void;
  onRemoveSkill: (id: string) => void;
  
  onAddLanguage: (newItem: Omit<LanguageEntry, 'id'>) => void;
  onUpdateLanguage: (index: number, field: keyof LanguageEntry, value: any) => void;
  onRemoveLanguage: (id: string) => void;

  onAddReference: (newItem: Omit<ReferenceEntry, 'id'>) => void;
  onUpdateReference: (index: number, field: keyof ReferenceEntry, value: any) => void;
  onRemoveReference: (id: string) => void;

  onAddHobby: (newItem: Omit<HobbyEntry, 'id'>) => void;
  onUpdateHobby: (index: number, field: keyof HobbyEntry, value: any) => void;
  onRemoveHobby: (id: string) => void;
}

const CVForm: React.FC<CVFormProps> = ({
  cvData, onCVDataChange, onPersonalDataChange, onProfilePictureChange, onLanguageProficiencyChange,
  onAddEducation, onUpdateEducation, onRemoveEducation,
  onAddWorkExperience, onUpdateWorkExperience, onRemoveWorkExperience,
  onAddResponsibility, onUpdateResponsibility, onRemoveResponsibility,
  onAddSkill, onUpdateSkill, onRemoveSkill,
  onAddLanguage, onUpdateLanguage, onRemoveLanguage,
  onAddReference, onUpdateReference, onRemoveReference,
  onAddHobby, onUpdateHobby, onRemoveHobby,
}) => {
  const { t } = useLanguage();

  const handlePersonalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onPersonalDataChange(name as keyof PersonalData, value);
  };
  
  const handleAboutMeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onCVDataChange('aboutMe', e.target.value);
  };

  const handleLanguageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onLanguageProficiencyChange(name as keyof CVData['languageProficiency'], value);
  };
  
  const formalEducation = cvData.education.filter(edu => edu.isFormal);
  const nonFormalEducation = cvData.education.filter(edu => !edu.isFormal);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 rounded-lg shadow-lg">
      <Section title={t('profilePicture')}>
        <div className="flex items-center gap-4">
            {cvData.personalData.profilePicture && <img src={cvData.personalData.profilePicture} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover" />}
            <div className="flex-grow">
                <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">{t('uploadImage')}</label>
                <input type="file" name="profilePicture" id="profilePicture" onChange={onProfilePictureChange} accept="image/png, image/jpeg" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
                <p className="text-xs text-gray-500 mt-1">{t('imageSizeWarning')}</p>
            </div>
        </div>
      </Section>

      <Section title={t('aboutMe')}>
        <TextAreaInput label="" name="aboutMe" value={cvData.aboutMe} onChange={handleAboutMeChange} placeholder={t('aboutMePlaceholder')} rows={4} />
      </Section>
      
      <Section title={t('contactAndSocials')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label={t('email')} name="email" value={cvData.personalData.email} onChange={handlePersonalInputChange} type="email" />
            <TextInput label={t('phone')} name="phone" value={cvData.personalData.phone} onChange={handlePersonalInputChange} type="tel" />
            <TextInput label={t('address')} name="address" value={cvData.personalData.address} onChange={handlePersonalInputChange} className="md:col-span-2" />
            <TextInput label={t('website')} name="website" value={cvData.personalData.website} onChange={handlePersonalInputChange} type="url" />
            <TextInput label={t('linkedin')} name="linkedin" value={cvData.personalData.linkedin} onChange={handlePersonalInputChange} type="url" />
            <TextInput label={t('twitter')} name="twitter" value={cvData.personalData.twitter} onChange={handlePersonalInputChange} type="url" />
            <TextInput label={t('instagram')} name="instagram" value={cvData.personalData.instagram} onChange={handlePersonalInputChange} type="url" />
            <TextInput label={t('facebook')} name="facebook" value={cvData.personalData.facebook} onChange={handlePersonalInputChange} type="url" />
        </div>
      </Section>
      
      <Section title={t('personalDataTitle')}>
        <TextInput label={t('proposedPosition')} name="proposedPosition" value={cvData.personalData.proposedPosition} onChange={handlePersonalInputChange} placeholder={t('proposedPositionPlaceholder')} />
        <TextInput label={t('companyName')} name="lastCompany" value={cvData.personalData.lastCompany} onChange={handlePersonalInputChange} placeholder={t('companyNamePlaceholder')} />
        <TextInput label={t('personnelName')} name="fullName" value={cvData.personalData.fullName} onChange={handlePersonalInputChange} required placeholder={t('personnelNamePlaceholder')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput label={t('birthPlace')} name="placeOfBirth" value={cvData.personalData.placeOfBirth} onChange={handlePersonalInputChange} />
          <TextInput label={t('birthDate')} name="dateOfBirth" type="date" value={cvData.personalData.dateOfBirth} onChange={handlePersonalInputChange} />
          <TextInput label={t('gender')} name="gender" value={cvData.personalData.gender} onChange={handlePersonalInputChange} placeholder={t('genderPlaceholder')} />
          <TextInput label={t('religion')} name="religion" value={cvData.personalData.religion} onChange={handlePersonalInputChange} placeholder={t('religionPlaceholder')} />
          <TextInput label={t('maritalStatus')} name="maritalStatus" value={cvData.personalData.maritalStatus} onChange={handlePersonalInputChange} placeholder={t('maritalStatusPlaceholder')} />
          <TextInput label={t('nationality')} name="nationality" value={cvData.personalData.nationality} onChange={handlePersonalInputChange} placeholder={t('nationalityPlaceholder')} />
        </div>
      </Section>

      <Section title={t('skills')}>
         {cvData.skills.map((skill, index) => (
            <div key={skill.id} className="p-3 border rounded-md mb-3 relative bg-white">
                <div className="flex items-end gap-3">
                    <TextInput label={t('skillName')} name="name" value={skill.name} onChange={(e) => onUpdateSkill(index, 'name', e.target.value)} placeholder={t('skillNamePlaceholder')} className="flex-grow mb-0"/>
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('skillLevel')}</label>
                        <div className="flex items-center gap-2">
                            <input type="range" min="0" max="10" value={skill.level} onChange={(e) => onUpdateSkill(index, 'level', parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                            <span className="text-sm font-semibold text-sky-700 w-8 text-center">{skill.level}/10</span>
                        </div>
                    </div>
                    <button type="button" onClick={() => onRemoveSkill(skill.id)} className="text-red-500 hover:text-red-700 mb-1">
                        <TrashIcon />
                    </button>
                </div>
                <TextAreaInput label={t('skillDescription')} name="description" value={skill.description} onChange={(e) => onUpdateSkill(index, 'description', e.target.value)} placeholder={t('skillDescriptionPlaceholder')} rows={2} className="mt-2" />
            </div>
         ))}
        <button type="button" onClick={() => onAddSkill({ name: '', level: 5, description: '' })} className="mt-2 flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition duration-150">
          <PlusIcon /> <span className="ml-2">{t('addSkill')}</span>
        </button>
      </Section>
      
      <Section title={t('languages')}>
         {cvData.languages.map((lang, index) => (
            <div key={lang.id} className="p-3 border rounded-md mb-3 relative bg-white">
                <div className="flex items-end gap-3">
                    <TextInput label={t('languageName')} name="name" value={lang.name} onChange={(e) => onUpdateLanguage(index, 'name', e.target.value)} placeholder={t('languageNamePlaceholder')} className="flex-grow mb-0"/>
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('languageLevel')}</label>
                        <div className="flex items-center gap-2">
                            <input type="range" min="0" max="10" value={lang.level} onChange={(e) => onUpdateLanguage(index, 'level', parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                            <span className="text-sm font-semibold text-sky-700 w-8 text-center">{lang.level}/10</span>
                        </div>
                    </div>
                    <button type="button" onClick={() => onRemoveLanguage(lang.id)} className="text-red-500 hover:text-red-700 mb-1">
                        <TrashIcon />
                    </button>
                </div>
            </div>
         ))}
        <button type="button" onClick={() => onAddLanguage({ name: '', level: 5 })} className="mt-2 flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition duration-150">
          <PlusIcon /> <span className="ml-2">{t('addLanguage')}</span>
        </button>
      </Section>

      <Section title={t('formalEducationTitle')}>
        {formalEducation.map((edu) => {
          const originalIndex = cvData.education.findIndex(e => e.id === edu.id);
          return (
            <div key={edu.id} className="p-4 border border-gray-200 rounded-md mb-4 relative bg-white">
              <button type="button" onClick={() => onRemoveEducation(edu.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                <TrashIcon />
              </button>
              <TextInput label={t('institutionName')} name="institutionName" value={edu.institutionName} onChange={(e) => onUpdateEducation(originalIndex, 'institutionName', e.target.value)} required />
              <TextInput label={t('degreeMajor')} name="degree" value={edu.degree} onChange={(e) => onUpdateEducation(originalIndex, 'degree', e.target.value)} required />
              <TextInput label={t('graduationYear')} name="graduationYear" value={edu.graduationYear} onChange={(e) => onUpdateEducation(originalIndex, 'graduationYear', e.target.value)} required />
               <TextAreaInput label={t('educationDescription')} name="description" value={edu.description} onChange={(e) => onUpdateEducation(originalIndex, 'description', e.target.value)} placeholder={t('educationDescriptionPlaceholder')} rows={2} className="mt-2" />
            </div>
          );
        })}
        <button type="button" onClick={() => onAddEducation(true)} className="mt-2 flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition duration-150">
          <PlusIcon /> <span className="ml-2">{t('addFormalEducation')}</span>
        </button>
      </Section>

      <Section title={t('nonFormalEducationTitle')}>
        {nonFormalEducation.map((edu) => {
          const originalIndex = cvData.education.findIndex(e => e.id === edu.id);
          return (
            <div key={edu.id} className="p-4 border border-gray-200 rounded-md mb-4 relative bg-white">
              <button type="button" onClick={() => onRemoveEducation(edu.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                <TrashIcon />
              </button>
              <TextInput label={t('instituteName')} name="institutionName" value={edu.institutionName} onChange={(e) => onUpdateEducation(originalIndex, 'institutionName', e.target.value)} required />
              <TextInput label={t('certificationName')} name="degree" value={edu.degree} onChange={(e) => onUpdateEducation(originalIndex, 'degree', e.target.value)} required />
              <TextInput label={t('completionYear')} name="graduationYear" value={edu.graduationYear} onChange={(e) => onUpdateEducation(originalIndex, 'graduationYear', e.target.value)} required />
              <TextAreaInput label={t('educationDescription')} name="description" value={edu.description} onChange={(e) => onUpdateEducation(originalIndex, 'description', e.target.value)} placeholder={t('educationDescriptionPlaceholder')} rows={2} className="mt-2" />
            </div>
          );
        })}
        <button type="button" onClick={() => onAddEducation(false)} className="mt-2 flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition duration-150">
          <PlusIcon /> <span className="ml-2">{t('addNonFormalEducation')}</span>
        </button>
      </Section>

      <Section title={t('languageProficiencyTitle')}>
        <TextInput label={t('indonesianLang')} name="indonesia" value={cvData.languageProficiency.indonesia} onChange={handleLanguageInputChange} placeholder={t('indonesianLangPlaceholder')} />
        <TextInput label={t('englishLang')} name="inggris" value={cvData.languageProficiency.inggris} onChange={handleLanguageInputChange} placeholder={t('englishLangPlaceholder')} />
        <TextInput label={t('localLang')} name="setempat" value={cvData.languageProficiency.setempat} onChange={handleLanguageInputChange} placeholder={t('localLangPlaceholder')} />
      </Section>

      <Section title={t('workExperienceTitle')}>
        {cvData.workExperience.map((exp, expIndex) => (
          <div key={exp.id} className="p-4 border border-gray-200 rounded-md mb-4 relative bg-white">
            <h3 className="font-semibold text-lg mb-3 text-sky-700">{t('experienceItem', { index: expIndex + 1 })}</h3>
            <button type="button" onClick={() => onRemoveWorkExperience(exp.id)} className="absolute top-3 right-3 text-red-500 hover:text-red-700">
              <TrashIcon />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <TextInput label={t('projectName')} name="activityName" value={exp.activityName || ''} onChange={(e) => onUpdateWorkExperience(expIndex, 'activityName', e.target.value)} placeholder={t('projectNamePlaceholder')} />
              <TextInput label={t('activityLocation')} name="location" value={exp.location} onChange={(e) => onUpdateWorkExperience(expIndex, 'location', e.target.value)} placeholder={t('activityLocationPlaceholder')} />
              <TextInput label={t('clientName')} name="clientName" value={exp.clientName || ''} onChange={(e) => onUpdateWorkExperience(expIndex, 'clientName', e.target.value)} placeholder={t('clientNamePlaceholder')} />
              <TextInput label={t('yourCompanyName')} name="companyName" value={exp.companyName} onChange={(e) => onUpdateWorkExperience(expIndex, 'companyName', e.target.value)} placeholder={t('yourCompanyNamePlaceholder')} required/>
              <TextInput label={t('startDate')} name="startDate" type="month" value={exp.startDate} onChange={(e) => onUpdateWorkExperience(expIndex, 'startDate', e.target.value)} />
              <TextInput label={t('endDate')} name="endDate" type="month" value={exp.endDate} onChange={(e) => onUpdateWorkExperience(expIndex, 'endDate', e.target.value)} placeholder={t('endDatePlaceholder')} />
              <TextInput label={t('assignedPosition')} name="jobTitle" value={exp.jobTitle} onChange={(e) => onUpdateWorkExperience(expIndex, 'jobTitle', e.target.value)} placeholder={t('assignedPositionPlaceholder')} required/>
              <TextInput label={t('employmentStatus')} name="employmentStatus" value={exp.employmentStatus} onChange={(e) => onUpdateWorkExperience(expIndex, 'employmentStatus', e.target.value)} placeholder={t('employmentStatusPlaceholder')}/>
              <TextInput label={t('referenceLetter')} name="referenceInfo" value={exp.referenceInfo || ''} onChange={(e) => onUpdateWorkExperience(expIndex, 'referenceInfo', e.target.value)} placeholder={t('referenceLetterPlaceholder')} />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobDescription')}</label>
              {exp.responsibilities.map((resp, respIndex) => (
                <div key={respIndex} className="flex items-center mb-2">
                  <span className="mr-2 text-gray-500">-</span>
                  <input 
                    type="text" 
                    value={resp} 
                    onChange={(e) => onUpdateResponsibility(expIndex, respIndex, e.target.value)}
                    placeholder={t('jobDescriptionPlaceholder', { index: respIndex + 1 })}
                    className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  />
                  <button type="button" onClick={() => onRemoveResponsibility(expIndex, respIndex)} className="ml-2 text-red-500 hover:text-red-700">
                    <TrashIcon />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => onAddResponsibility(expIndex)} className="mt-1 flex items-center text-sm text-sky-600 hover:text-sky-800">
                <PlusIcon /> <span className="ml-1">{t('addJobDescription')}</span>
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={onAddWorkExperience} className="mt-2 flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition duration-150">
          <PlusIcon /> <span className="ml-2">{t('addWorkExperience')}</span>
        </button>
      </Section>
      
      <Section title={t('references')}>
         {cvData.references.map((ref, index) => (
            <div key={ref.id} className="p-3 border rounded-md mb-3 relative bg-white grid grid-cols-1 md:grid-cols-3 gap-3">
                <TextInput label={t('referenceName')} name="name" value={ref.name} onChange={(e) => onUpdateReference(index, 'name', e.target.value)} className="mb-0"/>
                <TextInput label={t('referenceCompany')} name="company" value={ref.company} onChange={(e) => onUpdateReference(index, 'company', e.target.value)} className="mb-0"/>
                <TextInput label={t('referenceContact')} name="contact" value={ref.contact} onChange={(e) => onUpdateReference(index, 'contact', e.target.value)} className="mb-0"/>
                <button type="button" onClick={() => onRemoveReference(ref.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                    <TrashIcon />
                </button>
            </div>
         ))}
        <button type="button" onClick={() => onAddReference({ name: '', company: '', contact: '' })} className="mt-2 flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition duration-150">
          <PlusIcon /> <span className="ml-2">{t('addReference')}</span>
        </button>
      </Section>

      <Section title={t('hobbies')}>
         {cvData.hobbies.map((hobby, index) => (
            <div key={hobby.id} className="p-3 border rounded-md mb-3 relative bg-white flex items-end gap-3">
                <TextInput label={t('hobbyName')} name="name" value={hobby.name} onChange={(e) => onUpdateHobby(index, 'name', e.target.value)} placeholder={t('hobbyNamePlaceholder')} className="flex-grow mb-0"/>
                <button type="button" onClick={() => onRemoveHobby(hobby.id)} className="text-red-500 hover:text-red-700 mb-1">
                    <TrashIcon />
                </button>
            </div>
         ))}
        <button type="button" onClick={() => onAddHobby({ name: '' })} className="mt-2 flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition duration-150">
          <PlusIcon /> <span className="ml-2">{t('addHobby')}</span>
        </button>
      </Section>
    </div>
  );
};

export default CVForm;
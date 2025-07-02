import React from 'react';
import { CVData } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatDatePreview } from '../CVPreview';
import { EmailIcon, PhoneIcon, AddressIcon, LinkedInIcon, TwitterIcon } from '../icons';

interface TemplateProps {
  cvData: CVData;
  themeColor?: string;
}

const ShawnTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ cvData, themeColor = '#334155' }, ref) => {
    const { personalData, aboutMe, education, workExperience, skills, references, hobbies, languages } = cvData;
    const { t } = useLanguage();

    const SectionTitle: React.FC<{title: string}> = ({title}) => (
        <h2 className="text-sm font-bold uppercase tracking-widest pb-1 mb-3" style={{ color: themeColor }}>{title}</h2>
    );
    
    const SkillBar: React.FC<{name: string, level: number}> = ({name, level}) => (
        <div>
            <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-gray-800">{name}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="h-1.5 rounded-full" style={{ width: `${level * 10}%`, backgroundColor: themeColor }}></div>
            </div>
        </div>
    );

    return (
        <div ref={ref} className="cv-preview-area bg-white shadow-xl max-w-4xl mx-auto font-['Montserrat'] flex" style={{ width: '21cm', minHeight: '29.7cm' }}>
            {/* Left Sidebar */}
            <div className="w-[38%] bg-gray-800 text-white p-6 flex flex-col">
                {personalData.profilePicture && (
                    <img src={personalData.profilePicture} alt="Profile" className="rounded-full w-36 h-36 mx-auto mb-4 object-cover border-4" style={{borderColor: themeColor}}/>
                )}
                <div className="mt-4">
                    <SectionTitle title="About Me"/>
                    <p className="text-xs text-gray-300 leading-relaxed">{aboutMe || t('unfilled')}</p>
                </div>
                 <div className="mt-6">
                    <SectionTitle title="Links"/>
                    <ul className="text-xs space-y-2 text-gray-300">
                        {personalData.linkedin && <li className="flex items-center break-all"><LinkedInIcon className="w-4 h-4 mr-2 flex-shrink-0" style={{color: themeColor}}/> {personalData.linkedin.replace('https://www.linkedin.com/in/','')}</li>}
                        {personalData.twitter && <li className="flex items-center break-all"><TwitterIcon className="w-4 h-4 mr-2 flex-shrink-0" style={{color: themeColor}}/> {personalData.twitter.replace('https://twitter.com/','')}</li>}
                    </ul>
                </div>
                <div className="mt-6">
                    <SectionTitle title="Reference"/>
                    {references.slice(0,1).map(ref =>(
                        <div key={ref.id} className="text-xs">
                             <p className="font-bold text-sm text-gray-100">{ref.name}</p>
                             <p className="text-gray-300">{ref.company}</p>
                             <p className="text-gray-400 mt-1">{ref.contact}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                     <SectionTitle title="Hobbies"/>
                     <ul className="text-xs text-gray-300 list-disc list-inside">
                        {hobbies.map(h => <li key={h.id}>{h.name}</li>)}
                     </ul>
                </div>

            </div>

            {/* Right Main Content */}
            <div className="w-[62%] p-8 bg-gray-50 text-gray-700">
                 <header className="text-left mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800">{personalData.fullName || t('unfilledName')}</h1>
                    <p className="text-lg mt-1 font-medium" style={{ color: themeColor }}>{personalData.proposedPosition || t('unfilledPosition')}</p>
                     <div className="text-xs mt-4 space-y-2 text-gray-600">
                        {personalData.address && <div className="flex items-start"><AddressIcon className="w-4 h-4 mr-2 mt-px flex-shrink-0"/><span>{personalData.address}</span></div>}
                        {personalData.phone && <div className="flex items-start"><PhoneIcon className="w-4 h-4 mr-2 mt-px flex-shrink-0"/><span>{personalData.phone}</span></div>}
                        {personalData.email && <div className="flex items-start"><EmailIcon className="w-4 h-4 mr-2 mt-px flex-shrink-0"/><span>{personalData.email}</span></div>}
                    </div>
                </header>
                
                <section className="mb-6">
                    <h2 className="text-xl font-bold border-b-2 border-gray-200 pb-1 mb-4">Work Experience</h2>
                    {workExperience.map(exp => (
                        <div key={exp.id} className="mb-4 relative pl-4">
                             <div className="absolute left-0 h-full w-0.5" style={{backgroundColor: themeColor}}></div>
                            <p className="font-bold text-md text-gray-800">{exp.jobTitle}</p>
                            <div className="flex justify-between items-baseline">
                                <p className="text-sm text-gray-700 font-semibold">{exp.companyName}</p>
                                <p className="text-xs text-gray-500">{formatDatePreview(exp.startDate, t, 'month')} - {formatDatePreview(exp.endDate, t, 'month')}</p>
                            </div>
                            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1 mt-1 marker:text-gray-400">
                                {exp.responsibilities.map((r, i) => r && <li key={i}>{r}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-bold border-b-2 border-gray-200 pb-1 mb-4">Education</h2>
                    {education.filter(e => e.isFormal).map(edu => (
                        <div key={edu.id} className="mb-3 relative pl-4">
                             <div className="absolute left-0 h-full w-0.5" style={{backgroundColor: themeColor}}></div>
                            <p className="font-bold text-md text-gray-800">{edu.degree}</p>
                            <p className="text-sm text-gray-600">{edu.institutionName}</p>
                            <p className="text-xs text-gray-500">{edu.graduationYear}</p>
                        </div>
                    ))}
                </section>
                
                 <section className="mb-6">
                    <h2 className="text-xl font-bold border-b-2 border-gray-200 pb-1 mb-4">Skills</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                        {skills.map(skill => <SkillBar key={skill.id} name={skill.name} level={skill.level} /> )}
                    </div>
                </section>
                
                <section>
                    <h2 className="text-xl font-bold border-b-2 border-gray-200 pb-1 mb-4">Languages</h2>
                     <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                        {languages.map(lang => <SkillBar key={lang.id} name={lang.name} level={lang.level} /> )}
                    </div>
                </section>

            </div>
        </div>
    );
});

export default ShawnTemplate;
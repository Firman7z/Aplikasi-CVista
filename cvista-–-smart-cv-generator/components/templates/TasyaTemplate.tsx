import React from 'react';
import { CVData } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatDatePreview } from '../CVPreview';
import { EmailIcon, PhoneIcon, WebsiteIcon, LinkedInIcon, AddressIcon } from '../icons';

interface TemplateProps {
  cvData: CVData;
  themeColor?: string;
}

const TasyaTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ cvData, themeColor = '#2d5b91' }, ref) => {
    const { personalData, aboutMe, education, workExperience, skills, references } = cvData;
    const { t } = useLanguage();

    const Section: React.FC<{ title: string, children: React.ReactNode, className?: string, titleClassName?: string }> = ({ title, children, className = "", titleClassName="" }) => (
        <div className={`mb-6 ${className}`}>
            <h2 className={`text-sm font-bold uppercase tracking-wider pb-2 border-b-2 ${titleClassName}`}>{title}</h2>
            <div className="mt-4">{children}</div>
        </div>
    );

    return (
        <div ref={ref} className="cv-preview-area bg-white shadow-xl max-w-4xl mx-auto font-['Poppins'] flex" style={{ width: '21cm', minHeight: '29.7cm' }}>
            {/* Left Sidebar */}
            <div className="w-1/3 text-white p-6" style={{ backgroundColor: themeColor }}>
                {personalData.profilePicture && (
                    <img src={personalData.profilePicture} alt="Profile" className="rounded-full w-32 h-32 mx-auto mb-6 object-cover border-4 border-white/50" />
                )}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">{personalData.fullName || t('unfilledName')}</h1>
                    <p className="text-md text-white/90">{personalData.proposedPosition || t('unfilledPosition')}</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Profil Pribadi</h3>
                        <p className="text-xs text-white/90 leading-relaxed">{aboutMe || t('unfilled')}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Keahlian Khusus</h3>
                        <ul className="text-xs text-white/90 space-y-1">
                            {skills.map(skill => <li key={skill.id}>• {skill.name}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Informasi Kontak</h3>
                        <ul className="text-xs text-white/90 space-y-2">
                            {personalData.address && <li className="flex items-start"><AddressIcon className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" /><span className="break-all">{personalData.address}</span></li>}
                            {personalData.email && <li className="flex items-start"><EmailIcon className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" /><span className="break-all">{personalData.email}</span></li>}
                             {personalData.website && <li className="flex items-start"><WebsiteIcon className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" /><span className="break-all">{personalData.website}</span></li>}
                            {personalData.linkedin && <li className="flex items-start"><LinkedInIcon className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" /><span className="break-all">{personalData.linkedin}</span></li>}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Main Content */}
            <div className="w-2/3 p-8 text-gray-700">
                <Section title="Pengalaman Kerja" titleClassName="border-gray-300 text-gray-700">
                     {workExperience.map(exp => (
                        <div key={exp.id} className="mb-5">
                            <div className="flex justify-between items-baseline">
                                <p className="font-bold text-md">{exp.jobTitle}</p>
                                <p className="text-xs font-medium text-gray-500">{formatDatePreview(exp.startDate, t, 'month')} - {formatDatePreview(exp.endDate, t, 'month')}</p>
                            </div>
                            <p className="text-sm font-semibold mb-1" style={{color: themeColor}}>{exp.companyName}</p>
                            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                                {exp.responsibilities.map((r, i) => r && <li key={i}>{r}</li>)}
                            </ul>
                        </div>
                    ))}
                </Section>
                
                <Section title="Riwayat Akademis" titleClassName="border-gray-300 text-gray-700">
                    {education.filter(e => e.isFormal).map(edu => (
                        <div key={edu.id} className="mb-4">
                             <div className="flex justify-between items-baseline">
                                <p className="font-bold text-md">{edu.degree}</p>
                                <p className="text-xs font-medium text-gray-500">{edu.graduationYear}</p>
                            </div>
                            <p className="text-sm font-semibold mb-1" style={{color: themeColor}}>{edu.institutionName}</p>
                            <p className="text-xs text-gray-600">{edu.description}</p>
                        </div>
                    ))}
                </Section>

                <Section title="Referensi Kerja" titleClassName="border-gray-300 text-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                    {references.map(ref => (
                        <div key={ref.id} className="text-sm">
                            <p className="font-bold">{ref.name}</p>
                            <p className="text-xs text-gray-600">{ref.company}</p>
                            <p className="text-xs text-gray-600">{ref.contact}</p>
                        </div>
                    ))}
                    </div>
                </Section>
            </div>
        </div>
    );
});

export default TasyaTemplate;
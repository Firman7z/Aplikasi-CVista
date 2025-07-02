import React from 'react';
import { CVData } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatDatePreview } from '../CVPreview';
import { UserIcon, BriefcaseIcon, AcademicCapIcon, SparklesIcon, IdentificationIcon, CakeIcon } from '../icons';

interface TemplateProps {
  cvData: CVData;
  themeColor?: string;
}

const PremaTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ cvData, themeColor = '#2563eb' }, ref) => {
    const { personalData, aboutMe, education, workExperience, skills } = cvData;
    const { t } = useLanguage();
    
    const Section: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
        <section className="mb-6">
            <div className="flex items-center mb-3">
                 <div className="w-8 h-8 flex items-center justify-center rounded-full mr-3" style={{ backgroundColor: themeColor + '20' }}>
                    {React.cloneElement(icon as React.ReactElement<any>, { style: { color: themeColor }, className: "w-5 h-5" })}
                </div>
                <h2 className="text-lg font-bold" style={{ color: themeColor }}>{title}</h2>
            </div>
            <div className="pl-11">{children}</div>
        </section>
    );

    const SkillBar: React.FC<{ name: string, level: number }> = ({ name, level }) => (
        <div>
            <span className="text-sm font-medium text-gray-700">{name}</span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="h-2 rounded-full" style={{ width: `${level * 10}%`, backgroundColor: themeColor }}></div>
            </div>
        </div>
    );
    
    const InfoItem: React.FC<{label: string, value: string | undefined}> = ({label, value}) => (
        value ? <div><p className="text-xs text-gray-500">{label}</p><p className="text-sm font-semibold text-gray-800">{value}</p></div> : null
    );

    return (
        <div ref={ref} className="cv-preview-area bg-white shadow-xl max-w-4xl mx-auto font-['Poppins']" style={{ width: '21cm', minHeight: '29.7cm' }}>
            <div className="p-8">
                <header className="flex items-center space-x-6 pb-6 border-b-2 border-gray-100">
                    {personalData.profilePicture && (
                        <img src={personalData.profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4" style={{ borderColor: themeColor }} />
                    )}
                    <div className="flex-grow">
                        <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: themeColor }}>DAFTAR RIWAYAT HIDUP</p>
                        <h1 className="text-4xl font-bold text-gray-800">{personalData.fullName || t('unfilledName')}</h1>
                        <p className="text-lg text-gray-600">{personalData.proposedPosition || t('unfilledPosition')}</p>
                    </div>
                </header>
                
                <main className="flex pt-6">
                    <div className="w-2/5 pr-6 border-r-2 border-gray-100">
                         <Section title="Data Pribadi" icon={<IdentificationIcon/>}>
                             <div className="space-y-3 text-sm">
                                <InfoItem label={t('personnelName')} value={personalData.fullName}/>
                                <InfoItem label="Tempat / Tanggal Lahir" value={`${personalData.placeOfBirth}, ${formatDatePreview(personalData.dateOfBirth, t)}`}/>
                                <InfoItem label={t('gender')} value={personalData.gender}/>
                                <InfoItem label={t('religion')} value={personalData.religion}/>
                                <InfoItem label={t('maritalStatus')} value={personalData.maritalStatus}/>
                                <InfoItem label={t('address')} value={personalData.address}/>
                                <InfoItem label={t('nationality')} value={personalData.nationality}/>
                             </div>
                         </Section>
                         <Section title="Kontak" icon={<UserIcon/>}>
                              <div className="space-y-3 text-sm">
                                <InfoItem label={t('phone')} value={personalData.phone}/>
                                <InfoItem label={t('email')} value={personalData.email}/>
                                <InfoItem label="LinkedIn" value={personalData.linkedin}/>
                                <InfoItem label="Facebook" value={personalData.facebook}/>
                                <InfoItem label="Instagram" value={personalData.instagram}/>
                             </div>
                         </Section>
                    </div>
                    <div className="w-3/5 pl-6">
                         <Section title="Tentang Saya" icon={<UserIcon />}>
                            <p className="text-sm text-gray-700 leading-relaxed">{aboutMe || t('unfilled')}</p>
                        </Section>
                        <Section title="Riwayat Pendidikan" icon={<AcademicCapIcon />}>
                           {education.filter(e => e.isFormal).map(edu => (
                                <div key={edu.id} className="mb-4">
                                    <p className="text-xs text-gray-500">{edu.graduationYear}</p>
                                    <p className="font-bold text-sm text-gray-800">{edu.institutionName}</p>
                                    <p className="text-sm text-gray-600">{edu.degree}</p>
                                </div>
                            ))}
                        </Section>
                        <Section title="Pengalaman Kerja" icon={<BriefcaseIcon />}>
                           {workExperience.map(exp => (
                                <div key={exp.id} className="mb-4">
                                     <p className="text-xs text-gray-500">{formatDatePreview(exp.startDate, t, 'month')} - {formatDatePreview(exp.endDate, t, 'month')}</p>
                                    <p className="font-bold text-sm text-gray-800">{exp.jobTitle}</p>
                                    <p className="text-sm text-gray-600 mb-1">{exp.companyName}</p>
                                     <ul className="list-disc list-inside text-xs text-gray-600 space-y-1 marker:text-gray-400">
                                        {exp.responsibilities.map((r, i) => r && <li key={i}>{r}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </Section>
                         <Section title="Keahlian" icon={<SparklesIcon />}>
                           <div className="space-y-3">
                                {skills.map(skill => (
                                    <SkillBar key={skill.id} name={skill.name} level={skill.level}/>
                                ))}
                            </div>
                        </Section>
                    </div>
                </main>
            </div>
        </div>
    );
});

export default PremaTemplate;
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { UserIcon, TemplateIcon, PdfIcon, SparklesIcon, CogIcon } from './icons';
import { NavId } from '../App';

interface BottomNavProps {
    active: NavId;
    onNavigate: (navId: NavId) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ active, onNavigate }) => {
    const { t } = useLanguage();

    const navItems: { id: NavId; labelKey: 'navProfile' | 'navTemplates' | 'navMyPdf' | 'navPdfTools' | 'navSettings'; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
        { id: 'profile', labelKey: 'navProfile', icon: UserIcon },
        { id: 'templates', labelKey: 'navTemplates', icon: TemplateIcon },
        { id: 'pdf', labelKey: 'navMyPdf', icon: PdfIcon },
        { id: 'tools', labelKey: 'navPdfTools', icon: SparklesIcon },
        { id: 'settings', labelKey: 'navSettings', icon: CogIcon },
    ];

    return (
        <nav className="bg-gray-800 text-white shadow-lg no-print">
            <div className="container mx-auto flex justify-around">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`flex flex-col items-center justify-center w-full pt-3 pb-2 transition-colors duration-200 ${active === item.id ? 'text-sky-400' : 'text-gray-400 hover:text-white'}`}
                        aria-current={active === item.id ? 'page' : undefined}
                    >
                        <item.icon className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">{t(item.labelKey)}</span>
                        {active === item.id && <div className="w-8 h-1 bg-sky-400 rounded-full mt-1"></div>}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
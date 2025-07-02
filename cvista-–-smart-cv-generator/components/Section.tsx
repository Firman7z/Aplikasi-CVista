
import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow mb-6 ${className}`}>
      <h2 className="text-xl font-semibold text-sky-700 mb-4 pb-2 border-b border-sky-200">{title}</h2>
      {children}
    </div>
  );
};

export default Section;
    
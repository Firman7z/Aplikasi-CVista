import { useState, useEffect, useCallback } from 'react';
import { CVData, PersonalData, EducationEntry, WorkExperienceEntry, SkillEntry, ReferenceEntry, HobbyEntry, LanguageEntry } from '../types';
import { DEFAULT_CV_DATA } from '../constants';

const LOCAL_STORAGE_KEY = 'cvistaData_v2'; // New key for the new structure

const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper to safely hydrate data from localStorage
const hydrateData = (savedData: any): CVData => {
  const parsedData = JSON.parse(savedData);
  // Start with a clean default structure to avoid undefined errors on old data
  const hydratedData = JSON.parse(JSON.stringify(DEFAULT_CV_DATA));

  // Deep merge to prevent crashes if structure is old
  if (parsedData.personalData) Object.assign(hydratedData.personalData, parsedData.personalData);
  if (parsedData.aboutMe) hydratedData.aboutMe = parsedData.aboutMe;
  if (parsedData.education) hydratedData.education = parsedData.education;
  if (parsedData.workExperience) hydratedData.workExperience = parsedData.workExperience;
  if (parsedData.languageProficiency) Object.assign(hydratedData.languageProficiency, parsedData.languageProficiency);
  if (parsedData.skills) hydratedData.skills = parsedData.skills;
  if (parsedData.references) hydratedData.references = parsedData.references;
  if (parsedData.hobbies) hydratedData.hobbies = parsedData.hobbies;
  if (parsedData.languages) hydratedData.languages = parsedData.languages;

  // Ensure all array items have unique IDs, fixing old data if necessary
  ['education', 'workExperience', 'skills', 'references', 'hobbies', 'languages'].forEach(key => {
    if (hydratedData[key as keyof CVData] && Array.isArray(hydratedData[key as keyof CVData])) {
      (hydratedData[key as keyof CVData] as any[]).forEach(item => {
        if (!item.id) item.id = generateId();
      });
    }
  });
  
  return hydratedData;
};


// A type helper to get the keys of CVData that are arrays of objects with an 'id' property.
type ArrayWithIdKeys<T> = {
    [K in keyof T]: T[K] extends { id: string }[] ? K : never
}[keyof T];

export const useCVData = () => {
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        return hydrateData(savedData);
      }
    } catch (error) {
      console.error("Error loading CV data from localStorage:", error);
    }
    return JSON.parse(JSON.stringify(DEFAULT_CV_DATA));
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cvData));
    } catch (error) {
      console.error("Error saving CV data to localStorage:", error);
    }
  }, [cvData]);

  const handleCVDataChange = useCallback(<K extends keyof CVData>(key: K, value: CVData[K]) => {
     setCvData(prev => ({ ...prev, [key]: value }));
  }, []);

  const handlePersonalDataChange = useCallback(<K extends keyof PersonalData>(key: K, value: PersonalData[K]) => {
    setCvData(prev => ({
      ...prev,
      personalData: { ...prev.personalData, [key]: value }
    }));
  }, []);

  const handleLanguageProficiencyChange = useCallback(<K extends keyof CVData['languageProficiency']>(key: K, value: string) => {
    setCvData(prev => ({
      ...prev,
      languageProficiency: { ...prev.languageProficiency, [key]: value }
    }));
  }, []);

  // Education Handlers
  const addEducation = useCallback((isFormal: boolean) => {
    setCvData(prev => ({ ...prev, education: [...prev.education, { id: generateId(), institutionName: '', degree: '', graduationYear: '', description: '', isFormal }]}));
  }, []);
  const updateEducation = useCallback((index: number, field: keyof EducationEntry, value: string | boolean) => {
    setCvData(prev => ({ ...prev, education: prev.education.map((edu, i) => i === index ? { ...edu, [field]: value } : edu)}));
  }, []);
  const removeEducation = useCallback((id: string) => {
    setCvData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id)}));
  }, []);

  // Work Experience Handlers
  const addWorkExperience = useCallback(() => {
    setCvData(prev => ({ ...prev, workExperience: [...prev.workExperience, { id: generateId(), activityName: '', location: '', clientName: '', companyName: '', responsibilities: [''], startDate: '', endDate: '', jobTitle: '', employmentStatus: 'Tidak Tetap', referenceInfo: 'Terlampir' }]}));
  }, []);
  const updateWorkExperience = useCallback((index: number, field: keyof WorkExperienceEntry, value: string | string[]) => {
    setCvData(prev => ({ ...prev, workExperience: prev.workExperience.map((exp, i) => i === index ? { ...exp, [field]: value } : exp)}));
  }, []);
  const removeWorkExperience = useCallback((id: string) => {
    setCvData(prev => ({ ...prev, workExperience: prev.workExperience.filter(exp => exp.id !== id)}));
  }, []);
  
  // Responsibility Handlers
  const addResponsibility = useCallback((expIndex: number) => {
    setCvData(prev => ({ ...prev, workExperience: prev.workExperience.map((exp, i) => i === expIndex ? { ...exp, responsibilities: [...exp.responsibilities, ''] } : exp)}));
  }, []);
  const updateResponsibility = useCallback((expIndex: number, respIndex: number, value: string) => {
    setCvData(prev => ({ ...prev, workExperience: prev.workExperience.map((exp, i) => i === expIndex ? { ...exp, responsibilities: exp.responsibilities.map((resp, j) => j === respIndex ? value : resp) } : exp)}));
  }, []);
  const removeResponsibility = useCallback((expIndex: number, respIndex: number) => {
    setCvData(prev => ({ ...prev, workExperience: prev.workExperience.map((exp, i) => i === expIndex ? { ...exp, responsibilities: exp.responsibilities.filter((_, j) => j !== respIndex)} : exp)}));
  }, []);

  // Generic list handlers factory
  const createListHandlers = <K extends ArrayWithIdKeys<CVData>>(listName: K) => {
      type T = CVData[K][number];

      const addItem = (newItem: Omit<T, 'id'>) => {
          setCvData(prev => {
              const currentList = prev[listName] as T[];
              const itemToAdd = { id: generateId(), ...newItem } as T;
              return { ...prev, [listName]: [...currentList, itemToAdd] };
          });
      };
      const updateItem = (index: number, field: keyof T, value: any) => {
          setCvData(prev => {
              const currentList = prev[listName] as T[];
              const updatedList = currentList.map((item, i) => i === index ? { ...item, [field]: value } : item);
              return { ...prev, [listName]: updatedList };
          });
      };
      const removeItem = (id: string) => {
          setCvData(prev => {
              const currentList = prev[listName] as T[];
              // We know T has an id because of the ArrayWithIdKeys type helper.
              const filteredList = currentList.filter(item => item.id !== id);
              return { ...prev, [listName]: filteredList };
          });
      };
      return { addItem, updateItem, removeItem };
  };

  const { addItem: addSkill, updateItem: updateSkill, removeItem: removeSkill } = createListHandlers('skills');
  const { addItem: addReference, updateItem: updateReference, removeItem: removeReference } = createListHandlers('references');
  const { addItem: addHobby, updateItem: updateHobby, removeItem: removeHobby } = createListHandlers('hobbies');
  const { addItem: addLanguage, updateItem: updateLanguage, removeItem: removeLanguage } = createListHandlers('languages');
  
  const resetCVData = useCallback((confirm: boolean = true) => {
    if (!confirm || window.confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setCvData(JSON.parse(JSON.stringify(DEFAULT_CV_DATA)));
    }
  }, []);

  return {
    cvData,
    handleCVDataChange,
    handlePersonalDataChange,
    handleLanguageProficiencyChange,
    addEducation, updateEducation, removeEducation,
    addWorkExperience, updateWorkExperience, removeWorkExperience,
    addResponsibility, updateResponsibility, removeResponsibility,
    addSkill, updateSkill, removeSkill,
    addReference, updateReference, removeReference,
    addHobby, updateHobby, removeHobby,
    addLanguage, updateLanguage, removeLanguage,
    resetCVData,
  };
};
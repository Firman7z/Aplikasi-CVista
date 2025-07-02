export interface PersonalData {
  fullName: string;
  proposedPosition: string; // Used as main title/tagline in modern templates
  lastCompany: string; // Can be used as current company
  placeOfBirth: string; 
  dateOfBirth: string;
  nationality: string;
  
  // New fields for modern templates
  profilePicture: string | null; // Base64 string
  address: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string; // New field for Tony Stark template
  gender: string; // New field for Agus Ananda template
  religion: string; // New field for Agus Ananda template
  maritalStatus: string; // New field for Agus Ananda template
}

export interface EducationEntry {
  id: string;
  institutionName: string;
  degree: string; 
  graduationYear: string;
  description: string;
  isFormal: boolean;
}

export interface WorkExperienceEntry {
  id: string;
  activityName?: string;
  location: string;
  clientName?: string;
  companyName: string;
  responsibilities: string[];
  startDate: string;
  endDate: string;
  jobTitle: string;
  employmentStatus: string;
  referenceInfo?: string;
}

export interface SkillEntry {
  id: string;
  name: string;
  level: number; // A number from 0 to 10 for rating
  description: string;
}

export interface ReferenceEntry {
    id: string;
    name: string;
    company: string;
    contact: string; // e.g., email or phone
}

export interface HobbyEntry {
    id: string;
    name: string;
}

export interface LanguageEntry {
  id: string;
  name: string;
  level: number; // A number from 0 to 10 for rating
}

export interface CVData {
  personalData: PersonalData;
  aboutMe: string; // For "Tentang Saya" sections
  education: EducationEntry[];
  workExperience: WorkExperienceEntry[];
  languageProficiency: {
    indonesia: string;
    inggris: string;
    setempat: string;
  };
  skills: SkillEntry[];
  references: ReferenceEntry[];
  hobbies: HobbyEntry[];
  languages: LanguageEntry[]; // New field for modern templates
}
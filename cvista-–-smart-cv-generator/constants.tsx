import React from 'react';
import { CVData } from './types';

export const AppTitle = "CVista – Smart CV Generator";

export const DEFAULT_CV_DATA: CVData = {
  personalData: {
    fullName: '',
    placeOfBirth: '',
    dateOfBirth: '',
    nationality: '',
    proposedPosition: '',
    lastCompany: '',
    profilePicture: null,
    address: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    twitter: '',
    gender: '',
    religion: '',
    maritalStatus: '',
  },
  aboutMe: '',
  education: [],
  workExperience: [],
  languageProficiency: {
    indonesia: 'Baik (Aktif dan Pasif)',
    inggris: '',
    setempat: '',
  },
  skills: [],
  references: [],
  hobbies: [],
  languages: [],
};
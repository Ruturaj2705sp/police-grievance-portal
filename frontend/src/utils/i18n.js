/**
 * i18n Configuration — English + Hindi
 * Add more languages by extending the translations object
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      about: 'About',
      services: 'Services',
      contact: 'Contact',
      faq: 'FAQ',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      dashboard: 'Dashboard',
      profile: 'My Profile',

      // Complaint actions
      fileComplaint: 'File a Complaint',
      trackComplaint: 'Track Complaint',
      submitComplaint: 'Submit Complaint',
      viewDetails: 'View Details',
      printReceipt: 'Print Receipt',

      // Status labels
      pending: 'Pending',
      inProgress: 'In Progress',
      resolved: 'Resolved',
      rejected: 'Rejected',

      // Priority labels
      high: 'High',
      medium: 'Medium',
      low: 'Low',

      // Form labels
      title: 'Complaint Title',
      description: 'Description',
      category: 'Category',
      location: 'Incident Location',
      date: 'Incident Date',
      evidence: 'Upload Evidence',

      // Messages
      loading: 'Loading...',
      noComplaints: 'No complaints found.',
      submitSuccess: 'Complaint submitted successfully!',
      updateSuccess: 'Updated successfully!',
      errorOccurred: 'An error occurred. Please try again.',

      // AI labels
      aiAnalysis: 'AI Analysis',
      aiSummary: 'AI Summary',
      aiCategory: 'AI Category',
      aiPriority: 'AI Priority',
      riskLevel: 'Risk Level',
      suggestedAction: 'Suggested Action',
      aiPowered: 'Powered by AI',

      // Hero section
      heroTitle: 'Your Voice, Our Priority',
      heroSubtitle: 'File police complaints online — securely, transparently, 24/7.',
      heroAction: 'File a Complaint',
      heroTrack: 'Track Status',
    },
  },
  hi: {
    translation: {
      // Navigation
      home: 'होम',
      about: 'हमारे बारे में',
      services: 'सेवाएं',
      contact: 'संपर्क',
      faq: 'सामान्य प्रश्न',
      login: 'लॉगिन',
      register: 'पंजीकरण',
      logout: 'लॉगआउट',
      dashboard: 'डैशबोर्ड',
      profile: 'मेरी प्रोफ़ाइल',

      // Complaint actions
      fileComplaint: 'शिकायत दर्ज करें',
      trackComplaint: 'शिकायत ट्रैक करें',
      submitComplaint: 'शिकायत जमा करें',
      viewDetails: 'विवरण देखें',
      printReceipt: 'रसीद प्रिंट करें',

      // Status labels
      pending: 'लंबित',
      inProgress: 'प्रगति में',
      resolved: 'हल किया गया',
      rejected: 'अस्वीकृत',

      // Priority labels
      high: 'उच्च',
      medium: 'मध्यम',
      low: 'निम्न',

      // Form labels
      title: 'शिकायत शीर्षक',
      description: 'विवरण',
      category: 'श्रेणी',
      location: 'घटना स्थान',
      date: 'घटना तिथि',
      evidence: 'साक्ष्य अपलोड करें',

      // Messages
      loading: 'लोड हो रहा है...',
      noComplaints: 'कोई शिकायत नहीं मिली।',
      submitSuccess: 'शिकायत सफलतापूर्वक जमा हुई!',
      updateSuccess: 'सफलतापूर्वक अपडेट किया गया!',
      errorOccurred: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',

      // AI labels
      aiAnalysis: 'AI विश्लेषण',
      aiSummary: 'AI सारांश',
      aiCategory: 'AI श्रेणी',
      aiPriority: 'AI प्राथमिकता',
      riskLevel: 'जोखिम स्तर',
      suggestedAction: 'सुझाई गई कार्रवाई',
      aiPowered: 'AI द्वारा संचालित',

      // Hero section
      heroTitle: 'आपकी आवाज़, हमारी प्राथमिकता',
      heroSubtitle: 'पुलिस शिकायतें ऑनलाइन दर्ज करें — सुरक्षित, पारदर्शी, 24/7।',
      heroAction: 'शिकायत दर्ज करें',
      heroTrack: 'स्थिति ट्रैक करें',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;

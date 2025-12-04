// Mock data for grade categories
export const gradeCategories = [
  {
    id: '1-5',
    title: 'Primary (Grades 1–5)',
    subjects: 'Maths, Sinhala, Tamil, Env',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '6-9',
    title: 'Middle School (Grades 6–9)',
    subjects: 'Science, History, Geog, Civics',
    image: 'https://images.unsplash.com/photo-1509062522246-375596ef7f47?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ol',
    title: 'O/L (Ordinary Level)',
    subjects: 'Past Papers, Model Papers, Notes',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'al',
    title: 'A/L (Advanced Level)',
    subjects: 'Sci, Arts, Comm, Tech Streams',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'university',
    title: 'University',
    subjects: 'Undergraduate, Postgraduate, Research',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80'
  }
];

// Mock resources data
const mockResources = [
  // Primary (Grades 1-5)
  {
    id: 'p1',
    gradeId: '1-5',
    title: 'Grade 3 Mathematics - Term 1',
    subject: 'Mathematics',
    type: 'Notes',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'p2',
    gradeId: '1-5',
    title: 'Grade 4 Sinhala - Lessons',
    subject: 'Sinhala',
    type: 'Study Material',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'p3',
    gradeId: '1-5',
    title: 'Grade 5 Environment - Workbook',
    subject: 'Environment',
    type: 'Workbook',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'p4',
    gradeId: '1-5',
    title: 'Grade 2 Tamil - Basic Lessons',
    subject: 'Tamil',
    type: 'Notes',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'p5',
    gradeId: '1-5',
    title: 'Grade 4 Mathematics - Practice Papers',
    subject: 'Mathematics',
    type: 'Practice Papers',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'p6',
    gradeId: '1-5',
    title: 'Grade 5 Scholarship Exam - Model Papers',
    subject: 'General',
    type: 'Model Papers',
    driveLink: 'https://drive.google.com'
  },

  // Middle School (Grades 6-9)
  {
    id: 'm1',
    gradeId: '6-9',
    title: 'Grade 7 Science - Term 2',
    subject: 'Science',
    type: 'Notes',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'm2',
    gradeId: '6-9',
    title: 'Grade 8 History - Ancient Civilizations',
    subject: 'History',
    type: 'Study Material',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'm3',
    gradeId: '6-9',
    title: 'Grade 9 Geography - Climate & Weather',
    subject: 'Geography',
    type: 'Notes',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'm4',
    gradeId: '6-9',
    title: 'Grade 6 Civics - Rights and Duties',
    subject: 'Civics',
    type: 'Notes',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'm5',
    gradeId: '6-9',
    title: 'Grade 8 Mathematics - Algebra',
    subject: 'Mathematics',
    type: 'Study Material',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'm6',
    gradeId: '6-9',
    title: 'Grade 9 Science - Biology Module',
    subject: 'Science',
    type: 'Notes',
    driveLink: 'https://drive.google.com'
  },

  // O/L (Ordinary Level)
  {
    id: 'o1',
    gradeId: 'ol',
    title: 'O/L Mathematics - 2023 Paper',
    subject: 'Mathematics',
    type: 'Past Paper',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'o2',
    gradeId: 'ol',
    title: 'O/L Science - Model Paper 2024',
    subject: 'Science',
    type: 'Model Paper',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'o3',
    gradeId: 'ol',
    title: 'O/L English - Grammar Notes',
    subject: 'English',
    type: 'Notes',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'o4',
    gradeId: 'ol',
    title: 'O/L Sinhala - 2022 Past Paper',
    subject: 'Sinhala',
    type: 'Past Paper',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'o5',
    gradeId: 'ol',
    title: 'O/L History - Important Notes',
    subject: 'History',
    type: 'Notes',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'o6',
    gradeId: 'ol',
    title: 'O/L Buddhism - Past Papers Collection',
    subject: 'Buddhism',
    type: 'Past Paper',
    driveLink: 'https://drive.google.com'
  },

  // A/L (Advanced Level)
  {
    id: 'a1',
    gradeId: 'al',
    title: 'A/L Combined Maths - 2023',
    subject: 'Mathematics',
    type: 'Past Paper',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'a2',
    gradeId: 'al',
    title: 'A/L Physics - Mechanics Module',
    subject: 'Physics',
    type: 'Notes',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'a3',
    gradeId: 'al',
    title: 'A/L Chemistry - Organic Chemistry',
    subject: 'Chemistry',
    type: 'Study Material',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'a4',
    gradeId: 'al',
    title: 'A/L Biology - 2022 Model Paper',
    subject: 'Biology',
    type: 'Model Paper',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'a5',
    gradeId: 'al',
    title: 'A/L Economics - Theory Notes',
    subject: 'Economics',
    type: 'Notes',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'a6',
    gradeId: 'al',
    title: 'A/L Business Studies - Past Paper 2023',
    subject: 'Business Studies',
    type: 'Past Paper',
    driveLink: 'https://drive.google.com'
  },

  // University
  {
    id: 'u1',
    gradeId: 'university',
    title: 'Computer Science - Algorithms Notes',
    subject: 'Computer Science',
    type: 'Lecture Notes',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'u2',
    gradeId: 'university',
    title: 'Business Management - Case Studies',
    subject: 'Business',
    type: 'Case Study',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'u3',
    gradeId: 'university',
    title: 'Engineering - Thermodynamics Handbook',
    subject: 'Engineering',
    type: 'Reference',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'u4',
    gradeId: 'university',
    title: 'Medicine - Anatomy Flashcards',
    subject: 'Medical',
    type: 'Study Aid',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'u5',
    gradeId: 'university',
    title: 'Law - Constitutional Law Summary',
    subject: 'Law',
    type: 'Summary',
    driveLink: 'https://drive.google.com'
  },
  {
    id: 'u6',
    gradeId: 'university',
    title: 'Psychology - Research Methods Guide',
    subject: 'Psychology',
    type: 'Guide',
    driveLink: 'https://drive.google.com'
  }
];

export const getResourcesByGrade = (gradeId) => {
  return mockResources.filter(resource => resource.gradeId === gradeId);
};

export const getAllResources = () => {
  return mockResources;
};
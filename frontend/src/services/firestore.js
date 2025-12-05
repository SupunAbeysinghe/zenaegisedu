import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, getDoc, writeBatch } from 'firebase/firestore';

// Collection names
const RESOURCES_COLLECTION = 'resources';
const GRADE_CATEGORIES_COLLECTION = 'gradeCategories';
const SUB_GRADES_COLLECTION = 'subGrades';
const STREAMS_COLLECTION = 'streams';
const FEEDBACK_COLLECTION = 'feedback'; // New collection for feedback

// Helper function to handle Firebase errors
const handleFirebaseError = (error) => {
  console.error('Firebase error:', error);
  
  // Check for common Firebase error codes
  if (error.code) {
    switch (error.code) {
      case 'permission-denied':
        return 'You do not have permission to perform this action. Please contact an administrator.';
      case 'unavailable':
        return 'The service is temporarily unavailable. Please try again later.';
      case 'deadline-exceeded':
        return 'Request timed out. Please check your connection and try again.';
      case 'resource-exhausted':
        return 'Service quota exceeded. Please try again later.';
      case 'failed-precondition':
        return 'Operation failed due to system state. Please try again.';
      case 'aborted':
        return 'Operation was aborted. Please try again.';
      case 'out-of-range':
        return 'Invalid request parameters. Please check your input.';
      case 'unimplemented':
        return 'This feature is not implemented. Please contact support.';
      case 'internal':
        return 'Internal server error. Please try again later.';
      case 'unauthenticated':
        return 'Authentication required. Please log in and try again.';
      default:
        // For security reasons, don't expose internal error details to users
        return 'An unexpected error occurred. Please try again.';
    }
  }
  
  // Handle non-Firebase errors
  return 'An unexpected error occurred. Please try again.';
};

// Add a new resource
export const addResource = async (resourceData) => {
  try {
    const docRef = await addDoc(collection(db, RESOURCES_COLLECTION), {
      ...resourceData,
      createdAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Get all resources
export const getResources = async () => {
  try {
    const q = query(collection(db, RESOURCES_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const resources = [];
    querySnapshot.forEach((doc) => {
      resources.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: resources };
  } catch (error) {
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Delete a resource
export const deleteResource = async (id) => {
  try {
    await deleteDoc(doc(db, RESOURCES_COLLECTION, id));
    return { success: true };
  } catch (error) {
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Update a resource
export const updateResource = async (id, updateData) => {
  try {
    await updateDoc(doc(db, RESOURCES_COLLECTION, id), updateData);
    return { success: true };
  } catch (error) {
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Get all grade categories
export const getGradeCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, GRADE_CATEGORIES_COLLECTION));
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: categories };
  } catch (error) {
    // Check if it's a permissions error
    if (error.code === 'permission-denied') {
      return { success: false, error: 'Missing or insufficient permissions. Please check Firestore security rules.' };
    }
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Update a grade category
export const updateGradeCategory = async (id, updateData) => {
  try {
    await updateDoc(doc(db, GRADE_CATEGORIES_COLLECTION, id), updateData);
    return { success: true };
  } catch (error) {
    // Check if it's a permissions error
    if (error.code === 'permission-denied') {
      return { success: false, error: 'Missing or insufficient permissions. Please check Firestore security rules.' };
    }
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Initialize grade categories (for first time setup)
export const initializeGradeCategories = async (categories) => {
  try {
    const batch = writeBatch(db);
    categories.forEach((category) => {
      const docRef = doc(collection(db, GRADE_CATEGORIES_COLLECTION));
      batch.set(docRef, category);
    });
    await batch.commit();
    return { success: true };
  } catch (error) {
    // Check if it's a permissions error
    if (error.code === 'permission-denied') {
      return { success: false, error: 'Missing or insufficient permissions. Please check Firestore security rules.' };
    }
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Check if grade categories exist, and initialize if not
export const initializeGradeCategoriesIfNeeded = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, GRADE_CATEGORIES_COLLECTION));
    if (querySnapshot.empty) {
      // Initialize with mock data
      const mockCategories = [
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

      const batch = writeBatch(db);
      mockCategories.forEach((category) => {
        const docRef = doc(db, GRADE_CATEGORIES_COLLECTION, category.id);
        batch.set(docRef, category);
      });
      await batch.commit();
      return { success: true, initialized: true };
    }
    return { success: true, initialized: false };
  } catch (error) {
    // Check if it's a permissions error
    if (error.code === 'permission-denied') {
      return { success: false, error: 'Missing or insufficient permissions. Please check Firestore security rules.' };
    }
    return { success: false, error: handleFirebaseError(error) };
  }
};

// ===== Sub Grade APIs =====

// Get all sub grades
export const getSubGrades = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, SUB_GRADES_COLLECTION));
    const subGrades = [];
    querySnapshot.forEach((docSnap) => {
      subGrades.push({ id: docSnap.id, ...docSnap.data() });
    });
    return { success: true, data: subGrades };
  } catch (error) {
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Add a new sub grade
export const addSubGrade = async (subGradeData) => {
  try {
    const docRef = await addDoc(collection(db, SUB_GRADES_COLLECTION), subGradeData);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Update a sub grade
export const updateSubGrade = async (id, updateData) => {
  try {
    await updateDoc(doc(db, SUB_GRADES_COLLECTION, id), updateData);
    return { success: true };
  } catch (error) {
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Delete a sub grade
export const deleteSubGrade = async (id) => {
  try {
    await deleteDoc(doc(db, SUB_GRADES_COLLECTION, id));
    return { success: true };
  } catch (error) {
    return { success: false, error: handleFirebaseError(error) };
  }
};

// ===== Stream APIs =====

// Get all streams
export const getStreams = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, STREAMS_COLLECTION));
    const streams = [];
    querySnapshot.forEach((docSnap) => {
      streams.push({ id: docSnap.id, ...docSnap.data() });
    });
    return { success: true, data: streams };
  } catch (error) {
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Add a new stream
export const addStream = async (streamData) => {
  try {
    const docRef = await addDoc(collection(db, STREAMS_COLLECTION), streamData);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Update a stream
export const updateStream = async (id, updateData) => {
  try {
    await updateDoc(doc(db, STREAMS_COLLECTION, id), updateData);
    return { success: true };
  } catch (error) {
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Delete a stream
export const deleteStream = async (id) => {
  try {
    await deleteDoc(doc(db, STREAMS_COLLECTION, id));
    return { success: true };
  } catch (error) {
    return { success: false, error: handleFirebaseError(error) };
  }
};

// ===== Feedback APIs =====

// Add new feedback
export const addFeedback = async (feedbackData) => {
  try {
    const docRef = await addDoc(collection(db, FEEDBACK_COLLECTION), {
      ...feedbackData,
      createdAt: new Date(),
      status: 'new' // Default status for new feedback
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Get all feedback
export const getFeedback = async () => {
  try {
    const q = query(collection(db, FEEDBACK_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const feedback = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Ensure rating is a number if it exists
      if (data.rating !== undefined) {
        data.rating = Number(data.rating);
      }
      feedback.push({ id: doc.id, ...data });
    });
    return { success: true, data: feedback };
  } catch (error) {
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Update feedback status
export const updateFeedbackStatus = async (id, status) => {
  try {
    await updateDoc(doc(db, FEEDBACK_COLLECTION, id), { status });
    return { success: true };
  } catch (error) {
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Delete feedback
export const deleteFeedback = async (id) => {
  try {
    await deleteDoc(doc(db, FEEDBACK_COLLECTION, id));
    return { success: true };
  } catch (error) {
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Initialize streams for A/L and University grades if they don't exist
export const initializeStreamsIfNeeded = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, STREAMS_COLLECTION));
    if (querySnapshot.empty) {
      // Initialize with mock stream data for A/L and University grades
      const mockStreams = [
        // A/L Streams
        {
          id: 'al-science',
          name: 'Science Stream',
          description: 'Physical Science, Biological Science, and Engineering',
          gradeId: 'al',
          image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
          order: 0
        },
        {
          id: 'al-arts',
          name: 'Arts Stream',
          description: 'Languages, Literature, History, and Social Sciences',
          gradeId: 'al',
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
          order: 1
        },
        {
          id: 'al-commerce',
          name: 'Commerce Stream',
          description: 'Business Studies, Accounting, and Economics',
          gradeId: 'al',
          image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80',
          order: 2
        },
        {
          id: 'al-technology',
          name: 'Technology Stream',
          description: 'Information Technology and Engineering Technology',
          gradeId: 'al',
          image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
          order: 3
        },
        // University Streams
        {
          id: 'uni-undergraduate',
          name: 'Undergraduate',
          description: 'Bachelor\'s Degree Programs',
          gradeId: 'university',
          image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
          order: 0
        },
        {
          id: 'uni-postgraduate',
          name: 'Postgraduate',
          description: 'Master\'s and Doctoral Programs',
          gradeId: 'university',
          image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
          order: 1
        },
        {
          id: 'uni-research',
          name: 'Research',
          description: 'PhD and Research Programs',
          gradeId: 'university',
          image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
          order: 2
        }
      ];

      const batch = writeBatch(db);
      mockStreams.forEach((stream) => {
        const docRef = doc(collection(db, STREAMS_COLLECTION));
        batch.set(docRef, stream);
      });
      await batch.commit();
      return { success: true, initialized: true };
    }
    return { success: true, initialized: false };
  } catch (error) {
    // Check if it's a permissions error
    if (error.code === 'permission-denied') {
      return { success: false, error: 'Missing or insufficient permissions. Please check Firestore security rules.' };
    }
    return { success: false, error: handleFirebaseError(error) };
  }
};

// Initialize sub-grades for streams if they don't exist
export const initializeSubGradesForStreamsIfNeeded = async () => {
  try {
    // First check if we have any sub-grades already
    const subGradeQuerySnapshot = await getDocs(collection(db, SUB_GRADES_COLLECTION));
    if (!subGradeQuerySnapshot.empty) {
      // Check if we have sub-grades assigned to streams
      let hasStreamSubGrades = false;
      subGradeQuerySnapshot.forEach((doc) => {
        const data = doc.data();
        // If any sub-grade is assigned to a stream (not directly to a grade), we have stream sub-grades
        if (data.gradeId && (data.gradeId.startsWith('al-') || data.gradeId.startsWith('uni-'))) {
          hasStreamSubGrades = true;
        }
      });
      
      if (hasStreamSubGrades) {
        return { success: true, initialized: false };
      }
    }
    
    // Get existing streams
    const streamQuerySnapshot = await getDocs(collection(db, STREAMS_COLLECTION));
    if (streamQuerySnapshot.empty) {
      return { success: true, initialized: false };
    }
    
    // Initialize with mock sub-grade data for streams
    const mockSubGrades = [];
    
    streamQuerySnapshot.forEach((doc) => {
      const stream = { id: doc.id, ...doc.data() };
      
      // Add sub-grades based on stream type
      if (stream.id === 'al-science') {
        mockSubGrades.push(
          {
            name: 'Physical Science',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
            order: 0
          },
          {
            name: 'Biological Science',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
            order: 1
          },
          {
            name: 'Engineering Technology',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
            order: 2
          }
        );
      } else if (stream.id === 'al-arts') {
        mockSubGrades.push(
          {
            name: 'Sinhala',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
            order: 0
          },
          {
            name: 'English',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1503676382389-480954665027?auto=format&fit=crop&w=600&q=80',
            order: 1
          },
          {
            name: 'History',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
            order: 2
          },
          {
            name: 'Geography',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1509062522246-375596ef7f47?auto=format&fit=crop&w=600&q=80',
            order: 3
          }
        );
      } else if (stream.id === 'al-commerce') {
        mockSubGrades.push(
          {
            name: 'Accounting',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80',
            order: 0
          },
          {
            name: 'Business Studies',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80',
            order: 1
          },
          {
            name: 'Economics',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80',
            order: 2
          }
        );
      } else if (stream.id === 'al-technology') {
        mockSubGrades.push(
          {
            name: 'Information Technology',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
            order: 0
          },
          {
            name: 'Engineering Technology',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
            order: 1
          }
        );
      } else if (stream.id === 'uni-undergraduate') {
        mockSubGrades.push(
          {
            name: 'Bachelor of Science',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
            order: 0
          },
          {
            name: 'Bachelor of Arts',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
            order: 1
          },
          {
            name: 'Bachelor of Commerce',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80',
            order: 2
          }
        );
      } else if (stream.id === 'uni-postgraduate') {
        mockSubGrades.push(
          {
            name: 'Master of Science',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
            order: 0
          },
          {
            name: 'Master of Arts',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
            order: 1
          }
        );
      } else if (stream.id === 'uni-research') {
        mockSubGrades.push(
          {
            name: 'PhD Programs',
            gradeId: stream.id,
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
            order: 0
          }
        );
      }
    });
    
    if (mockSubGrades.length > 0) {
      const batch = writeBatch(db);
      mockSubGrades.forEach((subGrade) => {
        const docRef = doc(collection(db, SUB_GRADES_COLLECTION));
        batch.set(docRef, subGrade);
      });
      await batch.commit();
      return { success: true, initialized: true };
    }
    
    return { success: true, initialized: false };
  } catch (error) {
    // Check if it's a permissions error
    if (error.code === 'permission-denied') {
      return { success: false, error: 'Missing or insufficient permissions. Please check Firestore security rules.' };
    }
    return { success: false, error: handleFirebaseError(error) };
  }
};
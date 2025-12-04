import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, getDoc, writeBatch } from 'firebase/firestore';

// Collection names
const RESOURCES_COLLECTION = 'resources';
const GRADE_CATEGORIES_COLLECTION = 'gradeCategories';
const SUB_GRADES_COLLECTION = 'subGrades';
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
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { addResource, getResources, deleteResource, getGradeCategories, updateGradeCategory, initializeGradeCategoriesIfNeeded, initializeStreamsIfNeeded, initializeSubGradesForStreamsIfNeeded, getSubGrades, getStreams, addStream, updateStream, deleteStream, getFeedback } from '../services/firestore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminSidebar from '../components/AdminSidebar';
import AdminStats from './AdminStats';
import AdminSettings from './AdminSettings';
import AdminResources from './AdminResources';
import AdminGradeImages from './AdminGradeImages';
import AdminSubGrades from './AdminSubGrades';
import AdminStreams from './AdminStreams';
import AdminFeedback from './AdminFeedback'; // Import the new AdminFeedback component
import ResourceManagement from '../components/admin/ResourceManagement';
import GradeImageManagement from '../components/admin/GradeImageManagement';

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [resources, setResources] = useState([]);
  const [gradeCategories, setGradeCategories] = useState([]);
  const [subGrades, setSubGrades] = useState([]);
  const [streams, setStreams] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    type: '',
    gradeId: '',
    driveLink: ''
  });
  const [gradeImages, setGradeImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine active tab based on current location
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/resources')) return 'resources';
    if (path.includes('/grade-images')) return 'grade-images';
    if (path.includes('/statistics')) return 'statistics';
    if (path.includes('/sub-grades')) return 'sub-grades';
    if (path.includes('/streams')) return 'streams';
    if (path.includes('/feedback')) return 'feedback'; // Add feedback tab
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  // Fetch resources from Firestore
  const fetchResources = async () => {
    try {
      const result = await getResources();
      if (result.success) {
        setResources(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initialize grade categories if needed
        const initResult = await initializeGradeCategoriesIfNeeded();
        if (!initResult.success) {
          throw new Error(initResult.error);
        }

        // Initialize streams if needed
        const streamInitResult = await initializeStreamsIfNeeded();
        if (!streamInitResult.success) {
          throw new Error(streamInitResult.error);
        }

        // Initialize sub-grades for streams if needed
        const subGradeStreamInitResult = await initializeSubGradesForStreamsIfNeeded();
        if (!subGradeStreamInitResult.success) {
          throw new Error(subGradeStreamInitResult.error);
        }

        // Fetch resources
        await fetchResources();

        // Fetch grade categories
        const gradeResult = await getGradeCategories();
        if (gradeResult.success) {
          setGradeCategories(gradeResult.data);
          // Initialize gradeImages state
          const initialGradeImages = {};
          gradeResult.data.forEach(category => {
            initialGradeImages[category.id] = category.image || '';
          });
          setGradeImages(initialGradeImages);
        } else {
          throw new Error(gradeResult.error);
        }

        // Fetch sub grades
        const subGradeResult = await getSubGrades();
        if (subGradeResult.success) {
          setSubGrades(subGradeResult.data);
        } else {
          throw new Error(subGradeResult.error);
        }

        // Fetch streams
        const streamResult = await getStreams();
        if (streamResult.success) {
          setStreams(streamResult.data);
        } else {
          throw new Error(streamResult.error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.subject || !formData.type || !formData.gradeId || !formData.driveLink) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await addResource(formData);
      if (result.success) {
        // Reset form
        setFormData({
          title: '',
          subject: '',
          type: '',
          gradeId: '',
          driveLink: ''
        });
        // Refresh resources
        await fetchResources();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error adding resource:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await deleteResource(id);
      if (result.success) {
        // Refresh resources
        await fetchResources();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeImageChange = (gradeId, imageUrl) => {
    setGradeImages(prev => ({
      ...prev,
      [gradeId]: imageUrl
    }));
  };

  const handleSaveGradeImage = async (gradeId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateGradeCategory(gradeId, { image: gradeImages[gradeId] });
      if (result.success) {
        // Refresh grade categories to get updated data
        const gradeResult = await getGradeCategories();
        if (gradeResult.success) {
          setGradeCategories(gradeResult.data);
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving grade image:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
      setError(error.message);
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Welcome, {currentUser?.email}! Manage educational resources here.
              </p>
            </div>

            <ResourceManagement
              resources={resources}
              subGrades={subGrades}
              formData={formData}
              setFormData={setFormData}
              loading={loading}
              handleSubmit={handleSubmit}
              handleDelete={handleDelete}
              handleInputChange={handleInputChange}
            />

            {/* Edit Grade Images Section */}
            <div className="mt-8">
              <GradeImageManagement
                gradeCategories={gradeCategories}
                gradeImages={gradeImages}
                handleGradeImageChange={handleGradeImageChange}
                handleSaveGradeImage={handleSaveGradeImage}
                loading={loading}
              />
            </div>
          </div>
        );
      case 'resources':
        return (
          <AdminResources
            resources={resources}
            subGrades={subGrades}
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            handleInputChange={handleInputChange}
          />
        );
      case 'grade-images':
        return (
          <AdminGradeImages
            gradeCategories={gradeCategories}
            gradeImages={gradeImages}
            handleGradeImageChange={handleGradeImageChange}
            handleSaveGradeImage={handleSaveGradeImage}
            loading={loading}
          />
        );
      case 'sub-grades':
        return <AdminSubGrades gradeCategories={gradeCategories} streams={streams} />;
      case 'streams':
        return <AdminStreams gradeCategories={gradeCategories} />;
      case 'feedback':
        return <AdminFeedback />; // Add the feedback component
      case 'statistics':
        return <AdminStats resources={resources} gradeCategories={gradeCategories} />;
      case 'settings':
        return <AdminSettings />;
      default:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coming Soon</h1>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 dark">
      <Header showAuth={false} />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar activeTab={activeTab} onLogout={handleLogout} />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              Error: {error}
            </div>
          )}

          {renderContent()}
        </main>
      </div>

      <Footer isAdmin={true} />
    </div>
  );
};

export default AdminDashboard;
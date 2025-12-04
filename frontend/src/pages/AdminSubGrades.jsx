import React, { useEffect, useState } from 'react';
import { getSubGrades, addSubGrade, updateSubGrade, deleteSubGrade } from '../services/firestore';
import { useAuth } from '../contexts/AuthContext';
import SubGradeManagement from '../components/admin/SubGradeManagement';

const AdminSubGrades = ({ gradeCategories }) => {
  const { currentUser } = useAuth();
  const [subGrades, setSubGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubGrades = async () => {
    try {
      const result = await getSubGrades();
      if (result.success) {
        setSubGrades(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Error fetching sub grades:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    fetchSubGrades();
  }, [currentUser]);

  const handleAddSubGrade = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await addSubGrade(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      await fetchSubGrades();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubGrade = async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateSubGrade(id, updateData);
      if (!result.success) {
        throw new Error(result.error);
      }
      await fetchSubGrades();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubGrade = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sub grade?')) return;
    setLoading(true);
    setError(null);
    try {
      const result = await deleteSubGrade(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      await fetchSubGrades();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          Error: {error}
        </div>
      )}

      <SubGradeManagement
        gradeCategories={gradeCategories}
        subGrades={subGrades}
        onAddSubGrade={handleAddSubGrade}
        onUpdateSubGrade={handleUpdateSubGrade}
        onDeleteSubGrade={handleDeleteSubGrade}
        loading={loading}
      />
    </div>
  );
};

export default AdminSubGrades;



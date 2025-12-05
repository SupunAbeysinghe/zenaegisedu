import React, { useEffect, useState } from 'react';
import { getStreams, addStream, updateStream, deleteStream } from '../services/firestore';
import { useAuth } from '../contexts/AuthContext';
import StreamManagement from '../components/admin/StreamManagement';

const AdminStreams = ({ gradeCategories }) => {
  const { currentUser } = useAuth();
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStreams = async () => {
    try {
      const result = await getStreams();
      if (result.success) {
        setStreams(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Error fetching streams:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    fetchStreams();
  }, [currentUser]);

  const handleAddStream = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await addStream(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      await fetchStreams();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStream = async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateStream(id, updateData);
      if (!result.success) {
        throw new Error(result.error);
      }
      await fetchStreams();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStream = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stream? This will also delete all sub-grades and resources associated with this stream.')) return;
    setLoading(true);
    setError(null);
    try {
      const result = await deleteStream(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      await fetchStreams();
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

      <StreamManagement
        gradeCategories={gradeCategories}
        streams={streams}
        onAddStream={handleAddStream}
        onUpdateStream={handleUpdateStream}
        onDeleteStream={handleDeleteStream}
        loading={loading}
      />
    </div>
  );
};

export default AdminStreams;
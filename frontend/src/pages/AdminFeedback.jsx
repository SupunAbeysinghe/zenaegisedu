import React, { useState, useEffect } from 'react';
import { getFeedback, updateFeedbackStatus, deleteFeedback } from '../services/firestore';
import { AlertCircle, MessageSquare, CheckCircle, XCircle, Clock, Star } from 'lucide-react';

const AdminFeedback = () => {
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'new', 'resolved'

  // Fetch feedback from Firestore
  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const result = await getFeedback();
      if (result.success) {
        setFeedbackItems(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const result = await updateFeedbackStatus(id, status);
      if (result.success) {
        // Update local state
        setFeedbackItems(prevItems => 
          prevItems.map(item => 
            item.id === id ? { ...item, status } : item
          )
        );
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Error updating feedback status:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      const result = await deleteFeedback(id);
      if (result.success) {
        // Remove from local state
        setFeedbackItems(prevItems => prevItems.filter(item => item.id !== id));
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError(err.message);
    }
  };

  // Filter feedback based on selected filter
  const filteredFeedback = feedbackItems.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  // Get status display info
  const getStatusInfo = (status) => {
    switch (status) {
      case 'new':
        return { 
          text: 'New', 
          icon: Clock, 
          color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' 
        };
      case 'resolved':
        return { 
          text: 'Resolved', 
          icon: CheckCircle, 
          color: 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
        };
      default:
        return { 
          text: status, 
          icon: Clock, 
          color: 'text-gray-500 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600' 
        };
    }
  };

  // Get feedback type display info
  const getTypeInfo = (type) => {
    switch (type) {
      case 'error':
        return { 
          text: 'Error Report', 
          icon: AlertCircle, 
          color: 'text-red-500 bg-red-50 dark:bg-red-900/20' 
        };
      case 'review':
        return { 
          text: 'Review/Suggestion', 
          icon: MessageSquare, 
          color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
        };
      default:
        return { 
          text: type, 
          icon: MessageSquare, 
          color: 'text-gray-500 bg-gray-50 dark:bg-gray-700' 
        };
    }
  };

  // Render star rating
  const renderStarRating = (rating) => {
    if (!rating || rating < 1 || rating > 5) return null;
    
    return (
      <div className="flex items-center gap-1 mt-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {rating}/5
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">User Feedback</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Manage feedback and reports from users
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Feedback Management</h2>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                Review and respond to user feedback
              </p>
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filter === 'all'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All ({feedbackItems.length})
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filter === 'new'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              New ({feedbackItems.filter(item => item.status === 'new').length})
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filter === 'resolved'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Resolved ({feedbackItems.filter(item => item.status === 'resolved').length})
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-center">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Feedback List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredFeedback.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No feedback</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filter === 'all' 
                ? 'No feedback has been submitted yet.' 
                : `No ${filter} feedback found.`}
            </p>
          </div>
        ) : (
          filteredFeedback.map((item) => {
            const StatusIcon = getStatusInfo(item.status).icon;
            const statusInfo = getStatusInfo(item.status);
            const typeInfo = getTypeInfo(item.type);
            const TypeIcon = typeInfo.icon;

            return (
              <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Feedback Type Badge */}
                  <div className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${typeInfo.color}`}>
                    <TypeIcon className="w-4 h-4" />
                    {typeInfo.text}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    {/* Status and Email */}
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.text}
                      </div>
                      
                      {item.email && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          From: {item.email}
                        </span>
                      )}
                      
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.createdAt?.seconds * 1000 || item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Feedback Message */}
                    <div className="mt-2">
                      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                        {item.message}
                      </p>
                      
                      {/* Show star rating for reviews */}
                      {item.type === 'review' && renderStarRating(item.rating)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    {item.status !== 'resolved' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'resolved')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Resolve
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;
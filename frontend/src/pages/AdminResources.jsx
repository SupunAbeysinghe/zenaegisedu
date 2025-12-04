import React from 'react';
import ResourceManagement from '../components/admin/ResourceManagement';

// Simple wrapper page that reuses the main ResourceManagement UI
// so the dashboard tab and the full Resources page look and behave
// consistently for admins.
const AdminResources = (props) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Resource Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">
          Add, update, filter, and organize all learning resources for your students in one place.
        </p>
      </div>

      <ResourceManagement {...props} />
    </div>
  );
};

export default AdminResources;
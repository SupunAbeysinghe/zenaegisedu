import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'ZenAegis Edu',
    contactEmail: 'admin@zenaegis.edu',
    maxFileSize: '10MB',
    allowedFileTypes: '.pdf,.doc,.docx,.jpg,.png'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save to a database
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Configure site-wide settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <Input
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  placeholder="Site Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <Input
                  name="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  placeholder="Contact Email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max File Size
                </label>
                <Input
                  name="maxFileSize"
                  value={settings.maxFileSize}
                  onChange={handleChange}
                  placeholder="Max File Size"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allowed File Types
                </label>
                <Input
                  name="allowedFileTypes"
                  value={settings.allowedFileTypes}
                  onChange={handleChange}
                  placeholder="Allowed File Types"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                Save Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Admin Accounts</h3>
                <p className="text-sm text-gray-500">Manage administrator accounts</p>
              </div>
              <Button variant="outline">Manage</Button>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">User Roles</h3>
                <p className="text-sm text-gray-500">Configure user permissions</p>
              </div>
              <Button variant="outline">Manage</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Version</h3>
              <p className="text-2xl font-bold text-emerald-600">1.0.0</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Last Updated</h3>
              <p className="text-lg font-medium text-gray-900">December 4, 2025</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Status</h3>
              <p className="text-lg font-medium text-green-600">Operational</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
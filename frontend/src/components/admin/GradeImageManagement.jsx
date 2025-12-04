import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const GradeImageManagement = ({ gradeCategories, gradeImages, handleGradeImageChange, handleSaveGradeImage, loading }) => {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Edit Grade Box Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gradeCategories.map((category) => (
            <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-700">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{category.title}</h3>
              <div className="mb-3">
                <img 
                  src={gradeImages[category.id] || category.image} 
                  alt={category.title} 
                  className="w-full h-32 object-cover rounded"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x150?text=Invalid+Image';
                  }}
                />
              </div>
              <div className="space-y-2">
                <Input
                  value={gradeImages[category.id] || ''}
                  onChange={(e) => handleGradeImageChange(category.id, e.target.value)}
                  placeholder="Enter Google image link"
                  className="w-full bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                />
                <Button 
                  onClick={() => handleSaveGradeImage(category.id)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Image'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GradeImageManagement;
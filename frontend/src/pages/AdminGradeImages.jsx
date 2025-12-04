import React from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const AdminGradeImages = ({ gradeCategories, gradeImages, handleGradeImageChange, handleSaveGradeImage, loading }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Grade Box Images</h1>
        <p className="mt-2 text-gray-600">
          Customize the images displayed for each grade category
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade Category Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gradeCategories.map((category) => (
              <div key={category.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                <div className="mb-3">
                  <img 
                    src={gradeImages[category.id] || category.image} 
                    alt={category.title} 
                    className="w-full h-40 object-cover rounded"
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
                    className="w-full"
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

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <h3>How to update grade images:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Find an image you want to use for each grade category</li>
              <li>Upload the image to Google Drive or another image hosting service</li>
              <li>Get the shareable link for the image</li>
              <li>Paste the link into the input field for the corresponding grade</li>
              <li>Click "Save Image" to apply the change</li>
            </ol>
            <p className="mt-4">
              <strong>Note:</strong> Make sure the image links you use are publicly accessible, 
              otherwise they won't display correctly on the website.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGradeImages;
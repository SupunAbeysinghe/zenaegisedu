import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { updateResource } from '../../services/firestore'; // Add this import

const ResourceManagement = ({ resources, subGrades, formData, setFormData, loading, handleSubmit, handleDelete, handleInputChange }) => {
  // Predefined content types
  const contentTypes = [
    'Notes',
    'Past Paper',
    'Model Paper',
    'Study Material',
    'Workbook',
    'Practice Papers',
    'Summary',
    'Reference',
    'Case Study',
    'Guide',
    'Lecture Notes',
    'Flashcards'
  ];

  // Extract unique subjects from existing resources
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [filterGrade, setFilterGrade] = useState(''); // For filtering by grade
  const [filterSubject, setFilterSubject] = useState(''); // For filtering by subject
  const [editingId, setEditingId] = useState(null); // Track which resource is being edited
  const [editFormData, setEditFormData] = useState({}); // Store form data for editing

  useEffect(() => {
    const subjects = [...new Set(resources.map(resource => resource.subject))];
    setAvailableSubjects(subjects);
  }, [resources]);

  // Filter resources based on selected filters
  const filteredResources = resources.filter(resource => {
    return (
      (filterGrade === '' || resource.gradeId === filterGrade) &&
      (filterSubject === '' || resource.subject === filterSubject)
    );
  });

  const handleTypeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      type: e.target.value
    }));
  };

  const handleSubjectChange = (e) => {
    setFormData(prev => ({
      ...prev,
      subject: e.target.value
    }));
  };

  const handleAddNewSubject = () => {
    if (newSubject.trim() && !availableSubjects.includes(newSubject.trim())) {
      setAvailableSubjects(prev => [...prev, newSubject.trim()]);
      setFormData(prev => ({
        ...prev,
        subject: newSubject.trim()
      }));
      setNewSubject('');
    }
  };

  // Handle edit button click
  const handleEditClick = (resource) => {
    setEditingId(resource.id);
    setEditFormData({
      title: resource.title,
      subject: resource.subject,
      type: resource.type,
      gradeId: resource.gradeId,
      subGrade: resource.subGrade || '',
      driveLink: resource.driveLink
    });
  };

  // Handle save edit
  const handleSaveEdit = async (id) => {
    try {
      const result = await updateResource(id, editFormData);
      if (result.success) {
        // Reset editing state
        setEditingId(null);
        setEditFormData({});
        // Refresh resources (this would typically be handled by a refresh function)
        alert('Resource updated successfully!');
      } else {
        alert('Error updating resource: ' + result.error);
      }
    } catch (error) {
      alert('Error updating resource: ' + error.message);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  // Get sub-grades for a specific grade
  const getSubGradesForGrade = (gradeId) => {
    return subGrades.filter(sg => sg.gradeId === gradeId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Add Resource Form */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Add New Resource</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Resource title"
                required
                className="bg-white text-gray-900 border-gray-300"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.subject}
                    onChange={handleSubjectChange}
                    className="flex-1 rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Select a subject</option>
                    {availableSubjects.map((subject, index) => (
                      <option key={index} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Add new subject"
                    className="flex-1 bg-white text-gray-900 border-gray-300"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddNewSubject}
                    className="bg-emerald-500 hover:bg-emerald-600"
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={handleTypeChange}
                  className="w-full rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">Select a type</option>
                  {contentTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade Category
              </label>
              <select
                name="gradeId"
                value={formData.gradeId}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">Select a grade</option>
                <option value="1-5">Primary (Grades 1-5)</option>
                <option value="6-9">Middle School (Grades 6-9)</option>
                <option value="ol">O/L (Ordinary Level)</option>
                <option value="al">A/L (Advanced Level)</option>
                <option value="university">University</option>
              </select>
            </div>
            
            {/* Sub-grade selection - only show when a grade is selected */}
            {formData.gradeId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Grade (Optional)
                </label>
                <select
                  name="subGrade"
                  value={formData.subGrade || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select a sub grade (optional)</option>
                  {getSubGradesForGrade(formData.gradeId).map((subGrade) => (
                    <option key={subGrade.id} value={subGrade.name}>
                      {subGrade.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Drive Link
              </label>
              <Input
                name="driveLink"
                value={formData.driveLink}
                onChange={handleInputChange}
                placeholder="https://drive.google.com/..."
                required
                className="bg-white text-gray-900 border-gray-300"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-emerald-500 hover:bg-emerald-600"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Resource'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resources List */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Existing Resources</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter Controls */}
          <div className="mb-4 flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Grade</label>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Grades</option>
                <option value="1-5">Primary (Grades 1-5)</option>
                <option value="6-9">Middle School (Grades 6-9)</option>
                <option value="ol">O/L (Ordinary Level)</option>
                <option value="al">A/L (Advanced Level)</option>
                <option value="university">University</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Subject</label>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Subjects</option>
                {availableSubjects.map((subject, index) => (
                  <option key={index} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            
            {(filterGrade || filterSubject) && (
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setFilterGrade('');
                    setFilterSubject('');
                  }}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
          
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-900">Title</TableHead>
                  <TableHead className="text-gray-900">Subject</TableHead>
                  <TableHead className="text-gray-900">Type</TableHead>
                  <TableHead className="text-gray-900">Grade</TableHead>
                  <TableHead className="text-gray-900">Sub Grade</TableHead>
                  <TableHead className="text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.id} className="bg-white hover:bg-gray-50">
                    {editingId === resource.id ? (
                      // Edit mode
                      <>
                        <TableCell>
                          <Input
                            value={editFormData.title}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-white text-gray-900 border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editFormData.subject}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, subject: e.target.value }))}
                            className="w-full bg-white text-gray-900 border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <select
                            value={editFormData.type}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, type: e.target.value }))}
                            className="rounded-md border border-gray-300 bg-white text-gray-900 px-2 py-1"
                          >
                            <option value="">Select a type</option>
                            {contentTypes.map((type, index) => (
                              <option key={index} value={type}>{type}</option>
                            ))}
                          </select>
                        </TableCell>
                        <TableCell>
                          <select
                            value={editFormData.gradeId}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, gradeId: e.target.value }))}
                            className="rounded-md border border-gray-300 bg-white text-gray-900 px-2 py-1"
                          >
                            <option value="">Select a grade</option>
                            <option value="1-5">Primary (Grades 1-5)</option>
                            <option value="6-9">Middle School (Grades 6-9)</option>
                            <option value="ol">O/L (Ordinary Level)</option>
                            <option value="al">A/L (Advanced Level)</option>
                            <option value="university">University</option>
                          </select>
                        </TableCell>
                        <TableCell>
                          <select
                            value={editFormData.subGrade || ''}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, subGrade: e.target.value }))}
                            className="rounded-md border border-gray-300 bg-white text-gray-900 px-2 py-1"
                          >
                            <option value="">None</option>
                            {getSubGradesForGrade(editFormData.gradeId).map((subGrade) => (
                              <option key={subGrade.id} value={subGrade.name}>
                                {subGrade.name}
                              </option>
                            ))}
                          </select>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            className="mr-2 bg-emerald-500 hover:bg-emerald-600"
                            onClick={() => handleSaveEdit(resource.id)}
                          >
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-gray-300 text-gray-700 hover:bg-gray-100"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      // Display mode
                      <>
                        <TableCell className="font-medium text-gray-900">{resource.title}</TableCell>
                        <TableCell className="text-gray-700">{resource.subject}</TableCell>
                        <TableCell className="text-gray-700">{resource.type}</TableCell>
                        <TableCell className="text-gray-700">{resource.gradeId}</TableCell>
                        <TableCell className="text-gray-700">{resource.subGrade || 'None'}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mr-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                            onClick={() => handleEditClick(resource)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mr-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                            onClick={() => navigator.clipboard.writeText(resource.driveLink)}
                          >
                            Copy Link
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => handleDelete(resource.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredResources.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No resources found. {filterGrade || filterSubject ? 'Try clearing the filters.' : 'Add your first resource!'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceManagement;
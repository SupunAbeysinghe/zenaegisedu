import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select } from '../ui/select';

const SubGradeManagement = ({
  gradeCategories,
  streams,
  subGrades,
  onAddSubGrade,
  onUpdateSubGrade,
  onDeleteSubGrade,
  loading,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    gradeId: '',
    image: '',
    order: 0,
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const subGradesByGrade = useMemo(() => {
    const grouped = {};
    subGrades.forEach((sg) => {
      if (!grouped[sg.gradeId]) grouped[sg.gradeId] = [];
      grouped[sg.gradeId].push(sg);
    });
    return grouped;
  }, [subGrades]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.gradeId) return;
    await onAddSubGrade(formData);
    setFormData({ name: '', gradeId: '', image: '' });
  };

  const startEdit = (subGrade) => {
    setEditingId(subGrade.id);
    setEditData({
      name: subGrade.name,
      gradeId: subGrade.gradeId,
      image: subGrade.image || '',
      order: typeof subGrade.order === 'number' ? subGrade.order : 0,
    });
  };

  const saveEdit = async (id) => {
    await onUpdateSubGrade(id, editData);
    setEditingId(null);
    setEditData({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sub Grade Management</h1>
        <p className="mt-2 text-gray-600">
          Create and manage sub grades under each main grade, including display images.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Add New Sub Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Grade 3"
                  required
                  className="bg-white border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Grade / Stream
                </label>
                <select
                  value={formData.gradeId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, gradeId: e.target.value }))
                  }
                  required
                  className="w-full rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select grade or stream</option>
                  {/* For all grades, show both direct assignment and streams if they exist */}
                  {gradeCategories
                    .map((g) => {
                      // Check if this grade has any streams
                      const gradeStreams = (streams || []).filter(s => s.gradeId === g.id);
                      
                      // If grade has streams, show both direct and stream options
                      if (gradeStreams.length > 0) {
                        return [
                          <optgroup key={`grade-${g.id}`} label={g.title}>
                            <option value={g.id}>{g.title} (Direct)</option>
                          </optgroup>,
                          ...gradeStreams.map((s) => (
                            <option key={s.id} value={s.id}>
                              └─ {s.name} (Stream)
                            </option>
                          ))
                        ];
                      } else {
                        // If no streams, just show direct assignment
                        return (
                          <option key={g.id} value={g.id}>
                            {g.title}
                          </option>
                        );
                      }
                    })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="Optional image link for sub grade card"
                  className="bg-white border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, order: Number(e.target.value) || 0 }))
                  }
                  placeholder="e.g. 1, 2, 3..."
                  className="bg-white border-gray-300"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Add Sub Grade'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Existing Sub Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-900">Sub Grade</TableHead>
                    <TableHead className="text-gray-900">Parent Grade</TableHead>
                    <TableHead className="text-gray-900">Order</TableHead>
                    <TableHead className="text-gray-900">Image</TableHead>
                    <TableHead className="text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subGrades.map((subGrade) => {
                    const parentGrade = gradeCategories.find((g) => g.id === subGrade.gradeId);
                    const isEditing = editingId === subGrade.id;

                    return (
                      <TableRow key={subGrade.id} className="bg-white hover:bg-gray-50">
                        {isEditing ? (
                          <>
                            <TableCell>
                              <Input
                                value={editData.name}
                                onChange={(e) =>
                                  setEditData((prev) => ({ ...prev, name: e.target.value }))
                                }
                                className="bg-white border-gray-300"
                              />
                            </TableCell>
                            <TableCell>
                              <select
                                value={editData.gradeId}
                                onChange={(e) =>
                                  setEditData((prev) => ({ ...prev, gradeId: e.target.value }))
                                }
                                className="w-full rounded-md border border-gray-300 px-2 py-1"
                              >
                                <option value="">Select grade or stream</option>
                                {/* For all grades, show both direct assignment and streams if they exist */}
                                {gradeCategories
                                  .map((g) => {
                                    // Check if this grade has any streams
                                    const gradeStreams = (streams || []).filter(s => s.gradeId === g.id);
                                    
                                    // If grade has streams, show both direct and stream options
                                    if (gradeStreams.length > 0) {
                                      return [
                                        <optgroup key={`grade-${g.id}`} label={g.title}>
                                          <option value={g.id}>{g.title} (Direct)</option>
                                        </optgroup>,
                                        ...gradeStreams.map((s) => (
                                          <option key={s.id} value={s.id}>
                                            └─ {s.name} (Stream)
                                          </option>
                                        ))
                                      ];
                                    } else {
                                      // If no streams, just show direct assignment
                                      return (
                                        <option key={g.id} value={g.id}>
                                          {g.title}
                                        </option>
                                      );
                                    }
                                  })}
                              </select>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                value={editData.order}
                                onChange={(e) =>
                                  setEditData((prev) => ({
                                    ...prev,
                                    order: Number(e.target.value) || 0,
                                  }))
                                }
                                className="bg-white border-gray-300"
                              />
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <Input
                                value={editData.image}
                                onChange={(e) =>
                                  setEditData((prev) => ({ ...prev, image: e.target.value }))
                                }
                                placeholder="Image URL"
                                className="bg-white border-gray-300"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                className="mr-2 bg-emerald-500 hover:bg-emerald-600"
                                onClick={() => saveEdit(subGrade.id)}
                                disabled={loading}
                              >
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelEdit}
                                disabled={loading}
                              >
                                Cancel
                              </Button>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="font-medium">{subGrade.name}</TableCell>
                            <TableCell>
                                                          {(streams?.find(s => s.id === subGrade.gradeId)?.name) || 
                                                           (gradeCategories?.find(g => g.id === subGrade.gradeId)?.title) || 
                                                           subGrade.gradeId}
                                                        </TableCell>
                            <TableCell>{typeof subGrade.order === 'number' ? subGrade.order : '-'}</TableCell>
                            <TableCell className="max-w-xs">
                              {subGrade.image ? (
                                <div className="flex items-center gap-3">
                                  <img
                                    src={subGrade.image}
                                    alt={subGrade.name}
                                    className="w-16 h-10 object-cover rounded"
                                    onError={(e) => {
                                      e.target.src =
                                        'https://via.placeholder.com/160x100?text=Image';
                                    }}
                                  />
                                  <span className="truncate text-xs text-gray-500">
                                    {subGrade.image}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">No image</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                                onClick={() => startEdit(subGrade)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDeleteSubGrade(subGrade.id)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })}
                  {subGrades.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500 py-6">
                        No sub grades yet. Add your first sub grade on the left.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubGradeManagement;



import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const StreamManagement = ({
  gradeCategories,
  streams,
  onAddStream,
  onUpdateStream,
  onDeleteStream,
  loading,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    gradeId: '',
    description: '',
    image: '',
    order: 0,
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const streamsByGrade = useMemo(() => {
    const grouped = {};
    streams.forEach((stream) => {
      if (!grouped[stream.gradeId]) grouped[stream.gradeId] = [];
      grouped[stream.gradeId].push(stream);
    });
    return grouped;
  }, [streams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.gradeId) return;
    await onAddStream(formData);
    setFormData({ name: '', gradeId: '', description: '', image: '', order: 0 });
  };

  const startEdit = (stream) => {
    setEditingId(stream.id);
    setEditData({
      name: stream.name,
      gradeId: stream.gradeId,
      description: stream.description || '',
      image: stream.image || '',
      order: typeof stream.order === 'number' ? stream.order : 0,
    });
  };

  const saveEdit = async (id) => {
    await onUpdateStream(id, editData);
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stream Management</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Create and manage streams for A/L and University grades.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Add New Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Science Stream"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Parent Grade
                </label>
                <select
                  value={formData.gradeId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, gradeId: e.target.value }))
                  }
                  required
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select grade</option>
                  {gradeCategories.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Stream description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image URL
                </label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Display Order
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      order: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Adding...' : 'Add Stream'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Existing Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stream</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Parent Grade</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {streams.map((stream) => {
                    const parentGrade = gradeCategories.find((g) => g.id === stream.gradeId);
                    const isEditing = editingId === stream.id;

                    return (
                      <TableRow key={stream.id}>
                        {isEditing ? (
                          <>
                            <TableCell>
                              <Input
                                value={editData.name}
                                onChange={(e) =>
                                  setEditData((prev) => ({ ...prev, name: e.target.value }))
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={editData.description}
                                onChange={(e) =>
                                  setEditData((prev) => ({ ...prev, description: e.target.value }))
                                }
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
                                {gradeCategories.map((g) => (
                                    <option key={g.id} value={g.id}>
                                      {g.title}
                                    </option>
                                  ))}
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
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={editData.image}
                                onChange={(e) =>
                                  setEditData((prev) => ({ ...prev, image: e.target.value }))
                                }
                                placeholder="Image URL"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                                onClick={() => saveEdit(stream.id)}
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
                            <TableCell className="font-medium">{stream.name}</TableCell>
                            <TableCell>{stream.description || '-'}</TableCell>
                            <TableCell>{parentGrade?.title || stream.gradeId}</TableCell>
                            <TableCell>{typeof stream.order === 'number' ? stream.order : '-'}</TableCell>
                            <TableCell className="max-w-xs">
                              {stream.image ? (
                                <div className="flex items-center gap-3">
                                  <img
                                    src={stream.image}
                                    alt={stream.name}
                                    className="w-16 h-10 object-cover rounded"
                                    onError={(e) => {
                                      e.target.src =
                                        'https://via.placeholder.com/160x100?text=Image';
                                    }}
                                  />
                                  <span className="truncate text-xs text-gray-500">
                                    {stream.image}
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
                                onClick={() => startEdit(stream)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDeleteStream(stream.id)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })}
                  {streams.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                        No streams yet. Add your first stream on the left.
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

export default StreamManagement;
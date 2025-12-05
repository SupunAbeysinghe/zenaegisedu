import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminStats = ({ resources, gradeCategories }) => {
  const [resourceStats, setResourceStats] = useState([]);
  const [gradeStats, setGradeStats] = useState([]);
  const [typeStats, setTypeStats] = useState([]);

  useEffect(() => {
    // Calculate resource statistics by grade
    const gradeStatMap = {};
    gradeCategories.forEach(category => {
      gradeStatMap[category.id] = {
        name: category.title,
        resources: 0
      };
    });

    resources.forEach(resource => {
      if (gradeStatMap[resource.gradeId]) {
        gradeStatMap[resource.gradeId].resources += 1;
      }
    });

    setGradeStats(Object.values(gradeStatMap));

    // Calculate resource statistics by type
    const typeStatMap = {};
    resources.forEach(resource => {
      if (!typeStatMap[resource.type]) {
        typeStatMap[resource.type] = {
          name: resource.type,
          count: 0
        };
      }
      typeStatMap[resource.type].count += 1;
    });

    setTypeStats(Object.values(typeStatMap));

    // Overall resource statistics
    const totalResources = resources.length;
    const totalGrades = gradeCategories.length;
    
    setResourceStats([
      { name: 'Total Resources', value: totalResources },
      { name: 'Total Grade Categories', value: totalGrades },
      { name: 'Avg Resources per Grade', value: totalGrades > 0 ? Math.round(totalResources / totalGrades) : 0 }
    ]);
  }, [resources, gradeCategories]);

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Statistics Overview</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Monitor platform usage and resource distribution
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resourceStats.map((stat, index) => (
          <Card key={stat.name} className="glass-card">
            <CardHeader>
              <CardTitle className="text-gray-200">{stat.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-emerald-400">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resources by Grade */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-gray-200">Resources by Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                    backdropFilter: 'blur(10px)',
                    borderColor: '#374151',
                    borderRadius: '0.5rem'
                  }} 
                  itemStyle={{ color: '#f3f4f6' }}
                />
                <Legend />
                <Bar dataKey="resources" fill="#10B981" name="Resources" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resources by Type */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-gray-200">Resources by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeStats}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {typeStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                    backdropFilter: 'blur(10px)',
                    borderColor: '#374151',
                    borderRadius: '0.5rem'
                  }} 
                  itemStyle={{ color: '#f3f4f6' }}
                  formatter={(value) => [value, 'Resources']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-gray-200">Detailed Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Grade Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Resources Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50 glass-table">
                {gradeStats.map((grade, index) => {
                  const percentage = resourceStats[0]?.value > 0 
                    ? ((grade.resources / resourceStats[0].value) * 100).toFixed(1) 
                    : 0;
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                        {grade.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {grade.resources}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
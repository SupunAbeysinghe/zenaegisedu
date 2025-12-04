import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, FileText } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getResourcesByGrade } from '../data/mockData';
import { getResources, getGradeCategories, getSubGrades } from '../services/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

const GradePage = () => {
  const { gradeId } = useParams();
  const { currentUser } = useAuth();
  const [grade, setGrade] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subGrades, setSubGrades] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Get grade information from Firestore
      const gradeResult = await getGradeCategories();
      if (gradeResult.success) {
        const foundGrade = gradeResult.data.find(g => g.id === gradeId);
        setGrade(foundGrade);
      }

      // Get sub grades for this grade
      const subGradeResult = await getSubGrades();
      if (subGradeResult.success) {
        const gradeSubGrades = subGradeResult.data.filter(sg => sg.gradeId === gradeId);
        setSubGrades(gradeSubGrades);
      }

      // Get resources from Firestore
      if (currentUser) {
        const result = await getResources();
        if (result.success) {
          const filteredResources = result.data.filter(resource => resource.gradeId === gradeId);
          setResources(filteredResources);
        }
      } else {
        // Fallback to mock data if not logged in
        setResources(getResourcesByGrade(gradeId));
      }

      setLoading(false);
    };

    fetchData();
  }, [gradeId, currentUser]);

  if (!grade) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Grade not found</h1>
          <Link to="/" className="text-emerald-500 hover:underline">Go back to home</Link>
        </div>
      </div>
    );
  }

  // Group resources by sub-grade so a grade can be divided into sub grades
  const resourcesBySubGrade = resources.reduce((acc, resource) => {
    const key = resource.subGrade || 'General';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(resource);
    return acc;
  }, {});

  // Build ordered list of sub grade labels:
  // 1) sub grades defined in admin for this grade, sorted by their 'order' field
  // 2) any remaining resource groups without a matching sub grade definition, sorted by name
  const definedOrderLabels = subGrades
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((sg) => sg.name);

  const remainingLabels = Object.keys(resourcesBySubGrade).filter(
    (label) => !definedOrderLabels.includes(label)
  );

  remainingLabels.sort((a, b) => a.localeCompare(b));

  const orderedSubGradeLabels = [...definedOrderLabels, ...remainingLabels].filter(
    (label) => resourcesBySubGrade[label]
  );

  return (
    <div className="min-h-screen dark bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all grades</span>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {grade.title}
          </h1>
          <p className="text-xl text-white/90">
            {grade.subjects}
          </p>
        </div>
      </section>

      {/* Resources Section - grouped by sub grade */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Available Resources
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Browse resources by sub grade within {grade.title}.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Loading resources...</p>
            </div>
          ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orderedSubGradeLabels.map((subGradeLabel) => {
                const subGradeResources = resourcesBySubGrade[subGradeLabel] || [];
                const subGradeMeta = subGrades.find((sg) => sg.name === subGradeLabel);
                const cardImage = subGradeMeta?.image;

                return (
                <div
                  key={subGradeLabel}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {cardImage ? (
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={cardImage}
                        alt={subGradeLabel}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            'https://via.placeholder.com/600x240?text=Sub+Grade+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <p className="text-xs uppercase tracking-wide text-emerald-100 mb-1">
                          Sub Grade
                        </p>
                        <h3 className="text-xl font-bold text-white">
                          {subGradeLabel}
                        </h3>
                        <p className="text-sm text-emerald-50/90">
                          {subGradeResources.length} resource{subGradeResources.length !== 1 && 's'} available
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-emerald-500/90 to-teal-600/90 flex items-end p-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_55%)]" />
                      <div className="relative z-10">
                        <p className="text-xs uppercase tracking-wide text-emerald-100 mb-1">
                          Sub Grade
                        </p>
                        <h3 className="text-xl font-bold text-white">
                          {subGradeLabel}
                        </h3>
                        <p className="text-sm text-emerald-50/90">
                          {subGradeResources.length} resource{subGradeResources.length !== 1 && 's'} available
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="space-y-3">
                      {subGradeResources.slice(0, 4).map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-start justify-between gap-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 px-3 py-2"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {resource.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                              {resource.subject} • {resource.type}
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="shrink-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                            onClick={() => window.open(resource.driveLink, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {subGradeResources.length > 4 && (
                      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        + {subGradeResources.length - 4} more resource{subGradeResources.length - 4 !== 1 && 's'} in this sub grade
                      </p>
                    )}

                    <Button
                      className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={() => {
                        // Open the first resource as a quick way to access the sub grade folder
                        const first = subGradeResources[0];
                        if (first?.driveLink) {
                          window.open(first.driveLink, '_blank');
                        }
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Full Folder
                    </Button>
                  </div>
                </div>
              );
            })}
            </div>
          ) : (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">No resources available yet for this grade.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GradePage;
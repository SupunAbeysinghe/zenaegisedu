import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getGradeCategories, initializeGradeCategoriesIfNeeded } from '../services/firestore';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme hook

const GradeCards = () => {
  const { theme } = useTheme(); // Get current theme
  const [gradeCategories, setGradeCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGradeCategories = async () => {
      try {
        setLoading(true);
        // Check if we need to initialize grade categories
        const initResult = await initializeGradeCategoriesIfNeeded();
        if (!initResult.success) {
          throw new Error(initResult.error);
        }

        // Fetch grade categories
        const result = await getGradeCategories();
        if (result.success) {
          setGradeCategories(result.data);
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        console.error('Error fetching grade categories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGradeCategories();
  }, []);

  if (loading) {
    return (
      <section className={`py-16 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
              Explore Resources by Grade
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Access educational materials tailored for your specific grade level
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} rounded-2xl overflow-hidden shadow-sm animate-pulse h-64`}></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`py-16 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
              Explore Resources by Grade
            </h2>
            <div className={`${theme === 'light' ? 'bg-red-100 border-red-300' : 'bg-red-900/20 border-red-800'} rounded-lg p-6 max-w-2xl mx-auto`}>
              <p className={theme === 'light' ? 'text-red-800' : 'text-red-200'}>
                Error loading grade categories: {error}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="grades" className={`py-16 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
            Explore Resources by Grade
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Access educational materials tailored for your specific grade level
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gradeCategories.map((category) => (
            <Link
              key={category.id}
              to={`/grade/${category.id}`}
              className={`group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-gray-800'}`}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'light' ? 'from-black/20' : 'from-black/40'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`text-xl font-bold group-hover:text-emerald-500 transition-colors ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {category.title}
                  </h3>
                  <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-all ${theme === 'light' ? 'text-gray-400 group-hover:text-emerald-500' : 'text-gray-400 group-hover:text-emerald-500'}`} />
                </div>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                  {category.subjects}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GradeCards;
import React from 'react';
import { BookOpen, Zap, Smartphone, DollarSign } from 'lucide-react';

const HowItWorks = () => {
  const features = [
    {
      icon: BookOpen,
      title: '1100+ Resources',
      description: 'Past papers, notes, and study materials'
    },
    {
      icon: Zap,
      title: 'Direct Download Links',
      description: 'Quick access to all materials'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized PDFs',
      description: 'Access on any device'
    },
    {
      icon: DollarSign,
      title: '100% Free Forever',
      description: 'No hidden costs or fees'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      {/* Blurred edge transition from previous section */}
      <div className="h-16 -mt-16 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-transparent backdrop-blur-sm"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              HOW IT WORKS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Instant Access to Education
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              No login required. Just click your subject and you'll be directed straight to{' '}
              <span className="font-semibold text-gray-900 dark:text-white">Google Drive</span> to view or download files.
            </p>

            {/* Features Grid */}
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://media.istockphoto.com/id/1277718299/vector/artificial-intelligence-looking-at-smart-city-connected-with-planet-through-global-mobile.jpg?s=612x612&w=0&k=20&c=YLnQa3z3UmapQnQsnlWCcJzvie_GG7OdW_BXmGpo3II="
                alt="Student studying"
                className="w-full h-[500px] object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-100 dark:bg-emerald-900/20 rounded-2xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
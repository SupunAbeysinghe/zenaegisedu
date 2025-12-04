import React, { useEffect, useRef } from 'react';
import { Phone, AlertTriangle, Cloud, Shield, Home, Droplet } from 'lucide-react';

const EmergencySupport = () => {
  const lightningRef = useRef(null);
  
  const emergencyContacts = [
    {
      icon: Phone,
      title: 'Suwa Seriya / සුව සැරිය',
      number: '1990',
      color: 'bg-red-50 text-red-600',
      darkColor: 'dark:bg-red-900/30 dark:text-red-400'
    },
    {
      icon: AlertTriangle,
      title: 'Disaster Mgmt / ආපදා කළමනාකරණ',
      number: '117 / 0112 136 136',
      color: 'bg-orange-50 text-orange-600',
      darkColor: 'dark:bg-orange-900/30 dark:text-orange-400'
    },
    {
      icon: Cloud,
      title: 'Met Dept / කාලගුණ විද්‍යා',
      number: '0112 694 841',
      color: 'bg-blue-50 text-blue-600',
      darkColor: 'dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      icon: Shield,
      title: 'Police Emergency / පොලිස් හදිසි',
      number: '119',
      color: 'bg-indigo-50 text-indigo-600',
      darkColor: 'dark:bg-indigo-900/30 dark:text-indigo-400'
    },
    {
      icon: Home,
      title: 'NBRO / ගොඩනැගිලි පර්යේෂණ',
      number: '0112 588 946',
      color: 'bg-purple-50 text-purple-600',
      darkColor: 'dark:bg-purple-900/30 dark:text-purple-400'
    },
    {
      icon: Droplet,
      title: 'Irrigation / වාරිමාර්ග',
      number: '0112 488 505',
      color: 'bg-cyan-50 text-cyan-600',
      darkColor: 'dark:bg-cyan-900/30 dark:text-cyan-400'
    }
  ];

  useEffect(() => {
    const triggerLightning = () => {
      if (lightningRef.current) {
        // Add lightning class to trigger the animation
        lightningRef.current.classList.add('lightning-active');
        
        // Remove the class after the animation completes
        setTimeout(() => {
          if (lightningRef.current) {
            lightningRef.current.classList.remove('lightning-active');
          }
        }, 100);
      }
    };

    // Randomly trigger lightning every 3-10 seconds
    const lightningInterval = setInterval(() => {
      triggerLightning();
    }, Math.random() * 7000 + 3000);

    return () => clearInterval(lightningInterval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Blurred edge transition from previous section */}
      <div className="h-16 -mt-16 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-transparent backdrop-blur-sm"></div>
      
      {/* Rain effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 w-0.5 bg-blue-300 opacity-70 animate-rain"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 1 + 0.5}s`
            }}
          />
        ))}
      </div>
      
      {/* Lightning effect overlay */}
      <div 
        ref={lightningRef}
        className="absolute inset-0 pointer-events-none transition-all duration-100"
      ></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            EMERGENCY SUPPORT
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Stay Safe, Sri Lanka
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            We built this platform to support students affected by the recent floods. While education is vital, your life and safety are our top priority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencyContacts.map((contact, index) => {
            const Icon = contact.icon;
            return (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 ${contact.color} ${contact.darkColor} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                      {contact.title}
                    </h4>
                    <a 
                      href={`tel:${contact.number.replace(/\s/g, '')}`}
                      className="text-xl font-bold text-gray-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                    >
                      {contact.number}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EmergencySupport;
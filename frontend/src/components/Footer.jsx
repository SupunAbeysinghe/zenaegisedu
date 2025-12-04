import React from 'react';
import { Heart, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Footer = ({ isAdmin = false }) => {
  const { theme } = useTheme();

  return (
    <footer className={`${theme === 'light' ? 'bg-white border-t border-gray-200' : 'bg-gray-800/30 backdrop-blur-lg border-t border-gray-700/50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto">
          {!isAdmin && (
            <>
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 flex items-center justify-center gap-3 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                Powered by <img src={theme === 'light' ? "https://i.postimg.cc/Zn2M65r8/Logo-Dark-(1).png" : "https://i.postimg.cc/HxfsFS6n/Logo-(1).png"} alt="ZenAegis Logo" className="h-16" />
              </h2>
              <p className={`text-lg mb-8 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                
              </p>

              {/* Disclaimer Box */}
              <div className={`${theme === 'light' ? 'bg-amber-100 border-amber-300' : 'bg-amber-900/20 border-amber-700/50'} rounded-xl p-6 text-left backdrop-blur-sm border`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                  <div>
                    <h3 className={`font-semibold mb-2 flex items-center gap-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      Disclaimer
                    </h3>
                    <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      The documents, papers, and short notes available on this website are sent by students and teachers from all over Sri Lanka. We do not claim ownership of any of these materials. All rights belong to their respective owners and authors.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Heartfelt Thanks */}
          <div className={`mt-12 pt-8 ${theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-700/50'}`}>
            <p className={`flex items-center justify-center gap-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Made with <Heart className={`w-5 h-5 ${theme === 'light' ? 'text-red-500' : 'text-red-400'}`} /> for the students of Sri Lanka
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
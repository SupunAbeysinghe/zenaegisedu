import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

const Hero = () => {
  const { theme } = useTheme();
  
  const scrollToGrades = () => {
    document.getElementById('grades')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Define background images for different themes
  const backgroundImages = {
    dark: 'url(https://wallpapercg.com/download/sitting-on-books-3840x2160-19892.jpg)',
    light: 'url(https://i.postimg.cc/Gp7zvfQk/Whats-App-Image-2025-12-04-at-23-08-15.jpg)'
  };

  const backgroundImage = backgroundImages[theme] || backgroundImages.dark;

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: backgroundImage,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${theme === 'dark' ? 'from-gray-900/80 via-gray-900/70 to-gray-900/80' : 'from-gray-100/80 via-gray-100/70 to-gray-100/80'}`}></div>
      </div>

      {/* Blurred edge transition to next section */}
      <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b ${theme === 'dark' ? 'from-transparent to-gray-900/80' : 'from-transparent to-gray-100/80'} backdrop-blur-sm`}></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        
        <h1 className={`text-5xl md:text-6xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6 leading-tight`}>
          Stay Safe.<br />
          Keep Learning.
        </h1>

        <p className={`text-lg md:text-xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-8 max-w-3xl mx-auto`}>
          Access <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>1100+</span> essential school documents, past papers, and short notes from Grade 1 to University. Designed to be fast and accessible, even during floods and power cuts.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button 
            onClick={scrollToGrades}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-8 py-6 text-base rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Find Your Grade
          </Button>
          <Button 
            variant="outline" 
            className={`bg-transparent font-medium px-8 py-6 text-base rounded-full transition-all duration-300 ${theme === 'light' ? 'border-2 border-black text-black hover:bg-black/10' : 'border-2 border-white/40 text-white hover:bg-white/10'}`}
          >
            How to Download
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
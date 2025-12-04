import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import GradeCards from '../components/GradeCards';
import HowItWorks from '../components/HowItWorks';
import EmergencySupport from '../components/EmergencySupport';
import Footer from '../components/Footer';
import FeedbackPopup from '../components/FeedbackPopup';

const Home = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header onOpenFeedback={() => setIsFeedbackOpen(true)} />
      <Hero />
      <GradeCards />
      <HowItWorks />
      <EmergencySupport />
      <Footer />
      
      {/* Feedback Popup */}
      <FeedbackPopup 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
      
      {/* Feedback Trigger Button (Floating Action Button) */}
      <button
        onClick={() => setIsFeedbackOpen(true)}
        className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
        aria-label="Provide feedback"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
};

export default Home;
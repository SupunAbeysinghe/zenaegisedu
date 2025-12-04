import React, { useState } from 'react';
import { X, AlertCircle, MessageSquare, Star } from 'lucide-react';
import { addFeedback } from '../services/firestore'; // Import the Firestore service

const FeedbackPopup = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState(''); // 'error' or 'review'
  const [rating, setRating] = useState(0); // 1-5 star rating
  const [hoverRating, setHoverRating] = useState(0); // For hover effect
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    // Simple validation
    if (!feedbackType) {
      setSubmitError('Please select a feedback type');
      setIsSubmitting(false);
      return;
    }

    // For reviews, rating is required
    if (feedbackType === 'review' && rating === 0) {
      setSubmitError('Please provide a rating');
      setIsSubmitting(false);
      return;
    }

    if (!message.trim()) {
      setSubmitError('Please enter your feedback');
      setIsSubmitting(false);
      return;
    }

    try {
      // Save feedback to Firestore
      const feedbackData = {
        type: feedbackType,
        message: message.trim(),
        email: email.trim() || null,
        createdAt: new Date()
      };

      // Add rating for reviews
      if (feedbackType === 'review') {
        feedbackData.rating = rating;
      }

      const result = await addFeedback(feedbackData);
      
      if (result.success) {
        // Reset form
        setFeedbackType('');
        setRating(0);
        setMessage('');
        setEmail('');
        setSubmitSuccess(true);
        
        // Close popup after 2 seconds
        setTimeout(() => {
          onClose();
          setSubmitSuccess(false);
        }, 2000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Provide Feedback
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="p-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <p className="text-green-800 dark:text-green-200 text-center">
                Thank you for your feedback! We appreciate your input.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        {!submitSuccess && (
          <form onSubmit={handleSubmit} className="p-6">
            {submitError && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 text-center">
                  {submitError}
                </p>
              </div>
            )}

            {/* Feedback Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What type of feedback are you providing?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFeedbackType('error')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    feedbackType === 'error'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <AlertCircle className={`w-8 h-8 mb-2 ${
                      feedbackType === 'error' ? 'text-red-500' : 'text-gray-400'
                    }`} />
                    <span className={`font-medium ${
                      feedbackType === 'error' ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      Report Error
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                      System bugs, crashes, or issues
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFeedbackType('review')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    feedbackType === 'review'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <MessageSquare className={`w-8 h-8 mb-2 ${
                      feedbackType === 'review' ? 'text-emerald-500' : 'text-gray-400'
                    }`} />
                    <span className={`font-medium ${
                      feedbackType === 'review' ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      Share Review
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                      Suggestions or general feedback
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Rating Section (only shown when "Share Review" is selected) */}
            {feedbackType === 'review' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {rating > 0 && (
                    <span>
                      {rating === 1 && 'Poor'}
                      {rating === 2 && 'Fair'}
                      {rating === 3 && 'Good'}
                      {rating === 4 && 'Very Good'}
                      {rating === 5 && 'Excellent'}
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Email (Optional) */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email (optional)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-500 dark:focus:border-emerald-500 transition-colors"
                placeholder="your.email@example.com"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                We'll only use this to follow up if needed
              </p>
            </div>

            {/* Feedback Message */}
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Feedback
              </label>
              <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-500 dark:focus:border-emerald-500 transition-colors"
                placeholder={feedbackType === 'error' 
                  ? "Describe the error you encountered..." 
                  : "Share your thoughts, suggestions, or experience..."}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackPopup;
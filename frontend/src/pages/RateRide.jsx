import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const RateRide = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    try {
      await api.post(`/bookings/${bookingId}/rate`, { rating, feedback });
      setSubmitted(true);
    } catch (err) {
      console.error('Rating error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-500 text-sm mb-6">Your feedback helps us improve.</p>
          <button
            onClick={() => navigate('/my-rides')}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium cursor-pointer"
          >
            Back to My Rides
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full"
      >
        <div className="text-center mb-6">
          <span className="text-4xl">⭐</span>
          <h2 className="text-xl font-bold text-gray-900 mt-2">Rate Your Ride</h2>
          <p className="text-gray-500 text-sm">How was your experience?</p>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="text-4xl cursor-pointer transition-transform hover:scale-110"
            >
              {star <= (hoveredRating || rating) ? '⭐' : '☆'}
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="text-center text-sm text-gray-500 mb-4">
            {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}
          </p>
        )}

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your feedback (optional)"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 resize-none h-24 mb-4"
          maxLength={500}
        />

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={rating === 0 || loading}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Submitting...' : 'Submit Rating'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default RateRide;

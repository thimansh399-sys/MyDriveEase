import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-10 sm:py-20">
    <motion.div
      className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    />
    <p className="mt-2 sm:mt-4 text-gray-500 text-xs sm:text-sm">{text}</p>
  </div>
);

export default LoadingSpinner;

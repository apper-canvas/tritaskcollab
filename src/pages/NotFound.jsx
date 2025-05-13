import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Define icons
const HomeIcon = getIcon('Home');
const AlertTriangleIcon = getIcon('AlertTriangle');

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4"
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
          className="flex justify-center mb-6"
        >
          <AlertTriangleIcon className="w-20 h-20 text-primary" />
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Page Not Found</h2>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link 
            to="/" 
            className="btn btn-primary flex items-center justify-center gap-2 mx-auto"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </motion.div>
        
        <div className="mt-12 pt-6 border-t border-surface-200 dark:border-surface-700">
          <div className="text-surface-500 dark:text-surface-400 text-sm">
            Want to create a new task instead?
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;
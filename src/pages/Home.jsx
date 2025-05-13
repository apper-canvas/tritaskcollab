import { useState } from 'react';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Define icons at the top
const CheckCircleIcon = getIcon('CheckCircle');
const ListChecksIcon = getIcon('ListChecks');
const LayersIcon = getIcon('Layers');

const Home = () => {
  const [isStatsVisible, setIsStatsVisible] = useState(false);

  // Sample stats for demonstration
  const stats = {
    totalTasks: 12,
    completedTasks: 5,
    categories: {
      primary: { total: 4, completed: 2 },
      secondary: { total: 5, completed: 1 },
      tertiary: { total: 3, completed: 2 }
    }
  };

  const toggleStats = () => {
    setIsStatsVisible(!isStatsVisible);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <header className="bg-white dark:bg-surface-800 shadow-sm">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <LayersIcon className="w-7 h-7 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
                TriTask
              </h1>
            </div>
            
            <button
              onClick={toggleStats}
              className="btn btn-outline btn-outline-secondary inline-flex items-center gap-2"
              aria-label="Toggle statistics"
            >
              <ListChecksIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Statistics</span>
            </button>
          </div>
        </div>
      </header>

      {isStatsVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-surface-100 dark:bg-surface-800 rounded-b-xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4 flex flex-col items-center justify-center">
              <span className="text-surface-500 text-sm">Total Tasks</span>
              <span className="text-2xl font-bold">{stats.totalTasks}</span>
            </div>
            <div className="card p-4 flex flex-col items-center justify-center">
              <span className="text-surface-500 text-sm">Completed</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{stats.completedTasks}</span>
                <span className="text-surface-500">
                  ({Math.round((stats.completedTasks / stats.totalTasks) * 100)}%)
                </span>
              </div>
            </div>
            <div className="card p-4 col-span-1 sm:col-span-2 lg:col-span-2">
              <div className="text-surface-500 text-sm mb-2">Completion by Category</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center">
                  <div className="category-badge category-badge-primary w-full text-center">
                    Primary
                  </div>
                  <span className="mt-1 font-semibold">
                    {stats.categories.primary.completed}/{stats.categories.primary.total}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="category-badge category-badge-secondary w-full text-center">
                    Secondary
                  </div>
                  <span className="mt-1 font-semibold">
                    {stats.categories.secondary.completed}/{stats.categories.secondary.total}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="category-badge category-badge-tertiary w-full text-center">
                    Tertiary
                  </div>
                  <span className="mt-1 font-semibold">
                    {stats.categories.tertiary.completed}/{stats.categories.tertiary.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MainFeature />
      </main>
      
      <footer className="bg-white dark:bg-surface-800 py-4 mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-surface-500 text-sm">
          <div className="flex justify-center items-center gap-2">
            <CheckCircleIcon className="w-4 h-4" />
            <span>TriTask - Organize tasks with triadic color themes</span>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default Home;
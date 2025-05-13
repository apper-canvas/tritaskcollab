import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Define icons at the top
const PlusIcon = getIcon('Plus');
const SearchIcon = getIcon('Search');
const XIcon = getIcon('X');
const TrashIcon = getIcon('Trash');
const CheckIcon = getIcon('Check');
const CircleIcon = getIcon('Circle');
const EditIcon = getIcon('Edit');
const AlertCircleIcon = getIcon('AlertCircle');
const ArrowDownIcon = getIcon('ArrowDown');

const MainFeature = () => {
  // Task states
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tritasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'primary',
    completed: false,
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [draggedTask, setDraggedTask] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tritasks', JSON.stringify(tasks));
  }, [tasks]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingTask !== null) {
      setTasks(tasks.map((task, index) => 
        index === editingTask ? { ...task, [name]: value } : task
      ));
    } else {
      setNewTask({ ...newTask, [name]: value });
    }
  };
  
  const addTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error("Task title cannot be empty!");
      return;
    }
    
    const task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      category: 'primary',
      completed: false,
    });
    
    toast.success("Task added successfully!");
    setIsFormOpen(false);
  };
  
  const updateTask = (e) => {
    e.preventDefault();
    
    if (!tasks[editingTask].title.trim()) {
      toast.error("Task title cannot be empty!");
      return;
    }
    
    toast.success("Task updated successfully!");
    setEditingTask(null);
  };
  
  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    toast.success("Task deleted successfully!");
  };
  
  const toggleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    
    if (updatedTasks[index].completed) {
      toast.success("Task completed! 🎉");
    }
  };
  
  const handleDragStart = (index) => {
    setDraggedTask(index);
  };
  
  const handleDragOver = (index) => {
    setDropTarget(index);
  };
  
  const handleDrop = () => {
    if (draggedTask === null || dropTarget === null || draggedTask === dropTarget) {
      setDraggedTask(null);
      setDropTarget(null);
      return;
    }
    
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(draggedTask, 1);
    updatedTasks.splice(dropTarget, 0, movedTask);
    
    setTasks(updatedTasks);
    setDraggedTask(null);
    setDropTarget(null);
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    // First apply category filter
    if (filter !== 'all' && task.category !== filter) {
      return false;
    }
    
    // Then apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Group tasks by category for column display
  const tasksByCategory = {
    primary: filteredTasks.filter(task => task.category === 'primary'),
    secondary: filteredTasks.filter(task => task.category === 'secondary'),
    tertiary: filteredTasks.filter(task => task.category === 'tertiary')
  };
  
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 w-full md:w-64"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-surface-200 dark:border-surface-700">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium ${
                filter === 'all' 
                  ? 'bg-surface-200 dark:bg-surface-700' 
                  : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('primary')}
              className={`px-3 py-1.5 text-sm font-medium flex items-center gap-1 ${
                filter === 'primary' 
                  ? 'bg-primary/20 text-primary-dark dark:text-primary-light' 
                  : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Primary
            </button>
            <button
              onClick={() => setFilter('secondary')}
              className={`px-3 py-1.5 text-sm font-medium flex items-center gap-1 ${
                filter === 'secondary' 
                  ? 'bg-secondary/20 text-secondary-dark dark:text-secondary-light' 
                  : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              Secondary
            </button>
            <button
              onClick={() => setFilter('tertiary')}
              className={`px-3 py-1.5 text-sm font-medium flex items-center gap-1 ${
                filter === 'tertiary' 
                  ? 'bg-tertiary/20 text-tertiary-dark dark:text-tertiary-light' 
                  : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              Tertiary
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Task</span>
          </motion.button>
        </div>
      </div>
      
      {/* Task Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add New Task</h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={addTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Task Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                  <textarea
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    placeholder="Add more details about this task"
                    className="input-field min-h-[100px]"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer
                      ${newTask.category === 'primary' 
                        ? 'border-primary bg-primary/10 dark:bg-primary/20' 
                        : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'}
                    `}>
                      <input
                        type="radio"
                        name="category"
                        value="primary"
                        checked={newTask.category === 'primary'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-primary"></span>
                        <span className="text-sm font-medium">Primary</span>
                      </div>
                    </label>
                    
                    <label className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer
                      ${newTask.category === 'secondary' 
                        ? 'border-secondary bg-secondary/10 dark:bg-secondary/20' 
                        : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'}
                    `}>
                      <input
                        type="radio"
                        name="category"
                        value="secondary"
                        checked={newTask.category === 'secondary'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-secondary"></span>
                        <span className="text-sm font-medium">Secondary</span>
                      </div>
                    </label>
                    
                    <label className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer
                      ${newTask.category === 'tertiary' 
                        ? 'border-tertiary bg-tertiary/10 dark:bg-tertiary/20' 
                        : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'}
                    `}>
                      <input
                        type="radio"
                        name="category"
                        value="tertiary"
                        checked={newTask.category === 'tertiary'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-tertiary"></span>
                        <span className="text-sm font-medium">Tertiary</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="btn btn-outline btn-outline-secondary mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Edit Task Modal */}
      <AnimatePresence>
        {editingTask !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setEditingTask(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Edit Task</h3>
                <button
                  onClick={() => setEditingTask(null)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={updateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Task Title</label>
                  <input
                    type="text"
                    name="title"
                    value={tasks[editingTask]?.title || ''}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                  <textarea
                    name="description"
                    value={tasks[editingTask]?.description || ''}
                    onChange={handleInputChange}
                    placeholder="Add more details about this task"
                    className="input-field min-h-[100px]"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer
                      ${tasks[editingTask]?.category === 'primary' 
                        ? 'border-primary bg-primary/10 dark:bg-primary/20' 
                        : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'}
                    `}>
                      <input
                        type="radio"
                        name="category"
                        value="primary"
                        checked={tasks[editingTask]?.category === 'primary'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-primary"></span>
                        <span className="text-sm font-medium">Primary</span>
                      </div>
                    </label>
                    
                    <label className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer
                      ${tasks[editingTask]?.category === 'secondary' 
                        ? 'border-secondary bg-secondary/10 dark:bg-secondary/20' 
                        : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'}
                    `}>
                      <input
                        type="radio"
                        name="category"
                        value="secondary"
                        checked={tasks[editingTask]?.category === 'secondary'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-secondary"></span>
                        <span className="text-sm font-medium">Secondary</span>
                      </div>
                    </label>
                    
                    <label className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer
                      ${tasks[editingTask]?.category === 'tertiary' 
                        ? 'border-tertiary bg-tertiary/10 dark:bg-tertiary/20' 
                        : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'}
                    `}>
                      <input
                        type="radio"
                        name="category"
                        value="tertiary"
                        checked={tasks[editingTask]?.category === 'tertiary'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-tertiary"></span>
                        <span className="text-sm font-medium">Tertiary</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="btn btn-outline btn-outline-secondary mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Update Task
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Tasks Display */}
      {filteredTasks.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 text-center"
        >
          <div className="bg-surface-100 dark:bg-surface-800 p-8 rounded-xl inline-block mx-auto">
            <AlertCircleIcon className="w-12 h-12 mx-auto mb-4 text-surface-400" />
            <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              {searchQuery 
                ? "No tasks match your search criteria" 
                : "You haven't created any tasks yet"}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFormOpen(true)}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Your First Task</span>
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Category Column */}
          <div className="card p-4">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <h3 className="font-semibold">Primary Tasks</h3>
              <span className="ml-2 text-sm px-2 py-0.5 bg-surface-100 dark:bg-surface-700 rounded-full">
                {tasksByCategory.primary.length}
              </span>
            </div>
            
            <div className="space-y-3 min-h-[200px]">
              {tasksByCategory.primary.length === 0 ? (
                <div className="h-20 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-lg flex items-center justify-center">
                  <p className="text-surface-400 text-sm">No tasks in this category</p>
                </div>
              ) : (
                tasksByCategory.primary.map((task, index) => {
                  const originalIndex = tasks.findIndex(t => t.id === task.id);
                  
                  return (
                    <div
                      key={task.id}
                      className={`task-card task-card-primary ${
                        task.completed ? 'opacity-60' : ''
                      } ${
                        draggedTask === originalIndex ? 'border border-primary scale-95' : ''
                      } ${
                        dropTarget === originalIndex ? 'border-2 border-primary-dark' : ''
                      }`}
                      draggable="true"
                      onDragStart={() => handleDragStart(originalIndex)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        handleDragOver(originalIndex);
                      }}
                      onDragEnd={handleDrop}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTaskCompletion(originalIndex)}
                          className="mt-1 flex-shrink-0 text-surface-400 hover:text-primary transition-colors"
                        >
                          {task.completed ? (
                            <CheckIcon className="w-5 h-5" />
                          ) : (
                            <CircleIcon className="w-5 h-5" />
                          )}
                        </button>
                        
                        <div className="flex-grow min-w-0">
                          <h4 className={`font-medium ${
                            task.completed ? 'line-through text-surface-400' : ''
                          }`}>
                            {task.title}
                          </h4>
                          
                          {task.description && (
                            <p className="text-sm text-surface-600 dark:text-surface-400 mt-1 truncate">
                              {task.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingTask(originalIndex)}
                            className="p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTask(originalIndex)}
                            className="p-1 text-surface-400 hover:text-primary"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                          <div className="cursor-move p-1 text-surface-400">
                            <ArrowDownIcon className="w-4 h-4 rotate-90" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          {/* Secondary Category Column */}
          <div className="card p-4">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
              <h3 className="font-semibold">Secondary Tasks</h3>
              <span className="ml-2 text-sm px-2 py-0.5 bg-surface-100 dark:bg-surface-700 rounded-full">
                {tasksByCategory.secondary.length}
              </span>
            </div>
            
            <div className="space-y-3 min-h-[200px]">
              {tasksByCategory.secondary.length === 0 ? (
                <div className="h-20 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-lg flex items-center justify-center">
                  <p className="text-surface-400 text-sm">No tasks in this category</p>
                </div>
              ) : (
                tasksByCategory.secondary.map((task, index) => {
                  const originalIndex = tasks.findIndex(t => t.id === task.id);
                  
                  return (
                    <div
                      key={task.id}
                      className={`task-card task-card-secondary ${
                        task.completed ? 'opacity-60' : ''
                      } ${
                        draggedTask === originalIndex ? 'border border-secondary scale-95' : ''
                      } ${
                        dropTarget === originalIndex ? 'border-2 border-secondary-dark' : ''
                      }`}
                      draggable="true"
                      onDragStart={() => handleDragStart(originalIndex)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        handleDragOver(originalIndex);
                      }}
                      onDragEnd={handleDrop}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTaskCompletion(originalIndex)}
                          className="mt-1 flex-shrink-0 text-surface-400 hover:text-secondary transition-colors"
                        >
                          {task.completed ? (
                            <CheckIcon className="w-5 h-5" />
                          ) : (
                            <CircleIcon className="w-5 h-5" />
                          )}
                        </button>
                        
                        <div className="flex-grow min-w-0">
                          <h4 className={`font-medium ${
                            task.completed ? 'line-through text-surface-400' : ''
                          }`}>
                            {task.title}
                          </h4>
                          
                          {task.description && (
                            <p className="text-sm text-surface-600 dark:text-surface-400 mt-1 truncate">
                              {task.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingTask(originalIndex)}
                            className="p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTask(originalIndex)}
                            className="p-1 text-surface-400 hover:text-primary"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                          <div className="cursor-move p-1 text-surface-400">
                            <ArrowDownIcon className="w-4 h-4 rotate-90" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          {/* Tertiary Category Column */}
          <div className="card p-4">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-tertiary mr-2"></div>
              <h3 className="font-semibold">Tertiary Tasks</h3>
              <span className="ml-2 text-sm px-2 py-0.5 bg-surface-100 dark:bg-surface-700 rounded-full">
                {tasksByCategory.tertiary.length}
              </span>
            </div>
            
            <div className="space-y-3 min-h-[200px]">
              {tasksByCategory.tertiary.length === 0 ? (
                <div className="h-20 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-lg flex items-center justify-center">
                  <p className="text-surface-400 text-sm">No tasks in this category</p>
                </div>
              ) : (
                tasksByCategory.tertiary.map((task, index) => {
                  const originalIndex = tasks.findIndex(t => t.id === task.id);
                  
                  return (
                    <div
                      key={task.id}
                      className={`task-card task-card-tertiary ${
                        task.completed ? 'opacity-60' : ''
                      } ${
                        draggedTask === originalIndex ? 'border border-tertiary scale-95' : ''
                      } ${
                        dropTarget === originalIndex ? 'border-2 border-tertiary-dark' : ''
                      }`}
                      draggable="true"
                      onDragStart={() => handleDragStart(originalIndex)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        handleDragOver(originalIndex);
                      }}
                      onDragEnd={handleDrop}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTaskCompletion(originalIndex)}
                          className="mt-1 flex-shrink-0 text-surface-400 hover:text-tertiary transition-colors"
                        >
                          {task.completed ? (
                            <CheckIcon className="w-5 h-5" />
                          ) : (
                            <CircleIcon className="w-5 h-5" />
                          )}
                        </button>
                        
                        <div className="flex-grow min-w-0">
                          <h4 className={`font-medium ${
                            task.completed ? 'line-through text-surface-400' : ''
                          }`}>
                            {task.title}
                          </h4>
                          
                          {task.description && (
                            <p className="text-sm text-surface-600 dark:text-surface-400 mt-1 truncate">
                              {task.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingTask(originalIndex)}
                            className="p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTask(originalIndex)}
                            className="p-1 text-surface-400 hover:text-primary"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                          <div className="cursor-move p-1 text-surface-400">
                            <ArrowDownIcon className="w-4 h-4 rotate-90" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainFeature;
import { useState, useCallback, useRef, useEffect } from 'react';
import { SlidersHorizontal, Plus, MoreVertical, Pencil, Trash2, X } from 'lucide-react';
import { Task } from '../../constants/types';
import { taskApi } from '../../services/api';
import { useApi } from '../../hooks/useApi';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchTasks = useCallback(() => taskApi.getAll(), []);
  const { data: tasks, loading, refetch } = useApi<Task[]>(fetchTasks, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close sidebar on Esc key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  const handleToggleTask = async (task: Task) => {
    try {
      await taskApi.update(task.id, { completed: !task.completed });
      refetch();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskApi.delete(taskId);
      refetch();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    setIsAdding(true);
    try {
      await taskApi.create(newTaskTitle.trim());
      setNewTaskTitle('');
      refetch();
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
    setOpenMenuId(null);
  };

  const handleSaveEdit = async () => {
    if (!editingTaskId || !editingTitle.trim()) return;
    try {
      await taskApi.update(editingTaskId, { title: editingTitle.trim() });
      setEditingTaskId(null);
      setEditingTitle('');
      refetch();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const toggleMenu = (taskId: string) => {
    setOpenMenuId(openMenuId === taskId ? null : taskId);
  };

  return (
    <aside
      className={`bg-white h-[calc(100vh-65px)] flex flex-col border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 ${
        isOpen ? 'w-[280px] lg:w-[300px]' : 'w-0 border-r-0'
      }`}
    >
      <div className={`flex flex-col h-full ${isOpen ? 'w-[280px] lg:w-[300px]' : 'w-0'}`}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900">To Do list</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors relative"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task)}
                className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500 cursor-pointer flex-shrink-0"
                aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
              />
              
              {editingTaskId === task.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={handleEditKeyPress}
                    className="flex-1 px-2 py-1 text-sm border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="px-2 py-1 text-xs font-medium text-white bg-primary-500 rounded hover:bg-primary-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={`flex-1 text-sm ${
                      task.completed ? 'text-gray-400 line-through' : 'text-gray-600'
                    }`}
                  >
                    {task.title}
                  </span>
                  
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => toggleMenu(task.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-all"
                      aria-label="Task options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {openMenuId === task.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1"
                      >
                        <button
                          onClick={() => handleStartEdit(task)}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteTask(task.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No tasks yet</p>
        )}
      </div>

      {/* Footer - Add New Task */}
      <div className="p-4 bg-blue-50">
        <div className="flex items-center gap-2">
          <input
            id="new-task-input"
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter task name..."
            className="flex-1 px-3 py-2 text-sm bg-transparent border-none outline-none placeholder-gray-400"
          />
        </div>
        <button
          onClick={handleAddTask}
          disabled={isAdding || !newTaskTitle.trim()}
          className="w-full mt-2 px-4 py-2 text-sm font-medium text-primary-500 bg-white border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Task
        </button>
      </div>
      </div>
    </aside>
  );
}

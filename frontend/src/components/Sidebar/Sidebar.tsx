import { useState, useCallback, useRef, useEffect } from 'react';
import { SlidersHorizontal, Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Task } from '../../constants/types';
import { taskApi } from '../../services/api';
import { useApi } from '../../hooks/useApi';

export default function Sidebar() {
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

  return (
    <aside className="w-[280px] lg:w-[320px] bg-white h-[calc(100vh-65px)] flex flex-col border-r border-gray-200">
      {/* Header */}
      <div className="p-4 flex items-center border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-500" />
          <h2 className="text-base font-semibold text-gray-900">To Do list</h2>
        </div>
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
              className="group flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task)}
                className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500 cursor-pointer"
                aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
              />
              <span
                className={`flex-1 text-sm ${
                  task.completed ? 'text-gray-400 line-through' : 'text-gray-600'
                }`}
              >
                {task.title}
              </span>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                aria-label={`Delete ${task.title}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
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
    </aside>
  );
}

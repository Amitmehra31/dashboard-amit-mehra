import React, { useEffect, useState } from 'react';
import { BaseWidget } from './BaseWidget';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Task } from '../../types';
import { CheckCircle, Circle, Edit, Trash2, Save, X } from 'lucide-react';

interface TasksWidgetProps {
  id: string;
  title: string;
  size: 'sm' | 'md' | 'lg';
}

export const TasksWidget: React.FC<TasksWidgetProps> = ({ id, title, size }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem(`tasks-${id}`);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem(`tasks-${id}`, JSON.stringify(tasks));
  }, [tasks, id]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const startEditTask = (task: Task) => {
    setEditTaskId(task.id);
    setEditTaskTitle(task.title);
  };

  const saveEditTask = () => {
    if (editTaskTitle.trim() && editTaskId) {
      setTasks(
        tasks.map((task) =>
          task.id === editTaskId ? { ...task, title: editTaskTitle.trim() } : task
        )
      );
      setEditTaskId(null);
    }
  };

  const cancelEditTask = () => {
    setEditTaskId(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <BaseWidget id={id} title={title} size={size}>
      <div className="flex h-full flex-col p-4">
        <form onSubmit={addTask} className="mb-4 flex gap-2">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow"
          />
          <Button type="submit" disabled={!newTaskTitle.trim()}>
            Add
          </Button>
        </form>

        <div className="mb-4 flex space-x-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === 'active' ? 'primary' : 'outline'}
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button
            size="sm"
            variant={filter === 'completed' ? 'primary' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>

        <div className="overflow-y-auto flex-grow">
          {filteredTasks.length === 0 ? (
            <div className="flex h-full items-center justify-center text-theme-secondary">
              <p>No tasks found</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className="rounded-md border border-theme p-3"
                >
                  {editTaskId === task.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editTaskTitle}
                        onChange={(e) => setEditTaskTitle(e.target.value)}
                        className="flex-grow"
                      />
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={saveEditTask}
                        aria-label="Save task"
                        className="px-2"
                      >
                        <Save size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditTask}
                        aria-label="Cancel edit"
                        className="px-2"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                            task.completed
                              ? 'text-success'
                              : 'text-theme-secondary'
                          }`}
                        >
                          {task.completed ? (
                            <CheckCircle size={20} />
                          ) : (
                            <Circle size={20} />
                          )}
                        </button>
                        <span
                          className={`${
                            task.completed
                              ? 'text-theme-disabled line-through'
                              : 'text-theme-primary'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditTask(task)}
                          aria-label="Edit task"
                          className="h-7 w-7 p-0"
                        >
                          <Edit size={15} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteTask(task.id)}
                          aria-label="Delete task"
                          className="h-7 w-7 p-0 text-theme-secondary hover:text-error"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </BaseWidget>
  );
};
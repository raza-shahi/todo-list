import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);

  const handleChange = (e) => {
    setNewTask(e.target.value);
  }

  const addTask = () => {
    if (newTask.trim() === '') return;
    setTasks([...tasks, {
      id: Date.now(),
      text: newTask,
      completed: false
    }]);
    setNewTask('');
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  }

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? {...task, completed: !task.completed} : task
    ));
  }

  // Drag and drop functions
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
  }

  const handleDragOver = (index) => {
    if (draggedItem === null) return;
    if (draggedItem !== index) {
      const newTasks = [...tasks];
      const item = newTasks[draggedItem];
      newTasks.splice(draggedItem, 1);
      newTasks.splice(index, 0, item);
      setTasks(newTasks);
      setDraggedItem(index);
    }
  }

  const handleDragEnd = () => {
    setDraggedItem(null);
  }

  return (
    <div className='app border-2 border-gray-300 rounded-lg p-4 h-150 w-100 mt-12 m-auto flex flex-col'>
      <h1 className='mb-4 text-center text-lg'>Todo List App</h1>
      <div className='add-task flex py-4 gap-1'>
        <input 
          className='p-2 border-1 w-100 rounded-lg outline-none' 
          type="text" 
          placeholder="Add a new task"  
          value={newTask}
          onChange={handleChange}
        />
        <button 
          className='py-2 px-2 bg-green-500 text-white rounded-lg hover:bg-green-700' 
          onClick={addTask}
        >
          Add
        </button>
      </div>
      <div className='task-list flex-1 overflow-y-auto'>
        {tasks.length === 0 ? (
          <p className='text-center text-gray-500'>No tasks available</p>
        ) : (
          <ul className='space-y-2'>
            {tasks.map((task, index) => (
              <li 
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={() => handleDragOver(index)}
                onDragEnd={handleDragEnd}
                className={`p-2 rounded-lg border border-gray-200 flex justify-between items-center ${
                  task.completed ? 'bg-gray-100' : 'bg-white'
                } ${
                  draggedItem === index ? 'opacity-50' : ''
                }`}
              >
                <div className='flex items-center'>
                  <span className='mr-2 text-gray-500 w-6 text-right'>
                    {index + 1}.
                  </span>
                  <span className={`${task.completed ? 'line-through text-gray-400' : ''}`}>
                    {task.text}
                  </span>
                </div>
                <div className='flex gap-1'>
                  <button 
                    className='py-1 px-2 bg-green-500 text-white rounded-lg hover:bg-green-700 text-sm'
                    onClick={() => toggleComplete(task.id)}
                  >
                    {task.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button 
                    className='py-1 px-2 bg-red-500 text-white rounded-lg hover:bg-red-700 text-sm'
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App;
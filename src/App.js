// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState('work');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');
  const [theme, setTheme] = useState('dark');
  const [voiceActive, setVoiceActive] = useState(false);
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    highPriority: 0
  });

  // Initialize with sample tasks
  useEffect(() => {
    const sampleTasks = [
      { id: 1, text: 'Design new dashboard UI', completed: false, priority: 'high', category: 'work', date: new Date() },
      { id: 2, text: 'Call with project team', completed: true, priority: 'medium', category: 'work', date: new Date() },
      { id: 3, text: 'Buy groceries', completed: false, priority: 'low', category: 'personal', date: new Date() },
      { id: 4, text: 'Morning workout', completed: false, priority: 'medium', category: 'health', date: new Date() },
    ];
    setTasks(sampleTasks);
    updateStats(sampleTasks);
  }, []);

  // Update statistics
  const updateStats = (tasksList) => {
    const completed = tasksList.filter(task => task.completed).length;
    const pending = tasksList.filter(task => !task.completed).length;
    const highPriority = tasksList.filter(task => task.priority === 'high' && !task.completed).length;
    
    setStats({ completed, pending, highPriority });
  };

  // Add new task
  const addTask = () => {
    if (inputValue.trim() === '') return;
    
    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      priority,
      category,
      date: new Date()
    };
    
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    setInputValue('');
    updateStats(newTasks);
  };

  // Toggle task completion
  const toggleTask = (id) => {
    const newTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    
    setTasks(newTasks);
    updateStats(newTasks);
  };

  // Delete task
  const deleteTask = (id) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
    updateStats(newTasks);
  };

  // Start voice recognition
  const startVoiceRecognition = () => {
    setVoiceActive(true);
    
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.start();
      
      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setInputValue(speechResult);
        setVoiceActive(false);
      };
      
      recognition.onerror = () => {
        setVoiceActive(false);
      };
      
      recognition.onend = () => {
        setVoiceActive(false);
      };
    } else {
      alert('Your browser does not support voice recognition');
      setVoiceActive(false);
    }
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    if (filter === 'high') return task.priority === 'high' && !task.completed;
    if (filter === 'work') return task.category === 'work';
    if (filter === 'personal') return task.category === 'personal';
    if (filter === 'health') return task.category === 'health';
    return true;
  });

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`app ${theme}`}>
      <div className="container">
        <header>
          <h1>Nexus<span>Task</span></h1>
          <div className="theme-toggle" onClick={toggleTheme}>
            <div className={`toggle-handle ${theme}`}></div>
          </div>
        </header>
        
        {/* Stats Dashboard */}
        <div className="stats-dashboard">
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-value">{stats.completed}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p className="stat-value">{stats.pending}</p>
          </div>
          <div className="stat-card">
            <h3>High Priority</h3>
            <p className="stat-value">{stats.highPriority}</p>
          </div>
        </div>
        
        {/* Task Input */}
        <div className="task-input">
          <div className="input-group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a new task..."
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <button 
              className={`voice-btn ${voiceActive ? 'active' : ''}`}
              onClick={startVoiceRecognition}
            >
              <i className="voice-icon"></i>
            </button>
            <button className="add-btn" onClick={addTask}>+</button>
          </div>
          
          <div className="task-options">
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="health">Health</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        {/* Filters */}
        <div className="filters">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending</button>
          <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
          <button className={filter === 'high' ? 'active' : ''} onClick={() => setFilter('high')}>High Priority</button>
        </div>
        
        {/* Task List */}
        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="hologram"></div>
              <p>No tasks found. Add a new task!</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem 
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Task Item Component
const TaskItem = ({ task, onToggle, onDelete }) => {
  const getPriorityClass = () => {
    if (task.priority === 'high') return 'high';
    if (task.priority === 'medium') return 'medium';
    return 'low';
  };
  
  const getCategoryClass = () => {
    return task.category;
  };
  
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <div 
          className={`check-box ${task.completed ? 'checked' : ''}`} 
          onClick={() => onToggle(task.id)}
        >
          {task.completed && <div className="check-mark"></div>}
        </div>
        
        <div className="task-details">
          <p className="task-text">{task.text}</p>
          <div className="task-meta">
            <span className={`priority ${getPriorityClass()}`}>{task.priority}</span>
            <span className={`category ${getCategoryClass()}`}>{task.category}</span>
            <span className="date">
              {task.date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>
      
      <button className="delete-btn" onClick={() => onDelete(task.id)}>
        <div className="delete-icon"></div>
      </button>
    </div>
  );
};

export default App;
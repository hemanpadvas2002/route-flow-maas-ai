
import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const HomeGreeting: React.FC = () => {
  const [greeting, setGreeting] = useState('Hello');
  const [userName, setUserName] = useState('User');
  const { theme } = useTheme();

  useEffect(() => {
    // Get user name from local storage or use default
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }

    // Set greeting based on time of day
    const currentHour = new Date().getHours();
    
    if (currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  return (
    <div 
      className={`p-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
      style={{ 
        background: theme === 'dark' 
          ? 'linear-gradient(to right, #0F2027, #203A43, #2C5364)' 
          : 'linear-gradient(to right, #e0e0e0, #f5f5f5)'
      }}
    >
      <h1 className="text-2xl font-bold">{greeting}, {userName}</h1>
      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        Where would you like to go today?
      </p>
    </div>
  );
};

export default HomeGreeting;

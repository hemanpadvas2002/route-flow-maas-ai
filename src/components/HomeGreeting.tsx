
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Sunrise, Sunset } from 'lucide-react';

interface HomeGreetingProps {
  userName?: string;
}

const HomeGreeting: React.FC<HomeGreetingProps> = ({ userName = 'User' }) => {
  const { theme } = useTheme();
  const [greeting, setGreeting] = useState('Hello');
  const [timeIcon, setTimeIcon] = useState<React.ReactNode>(null);
  
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let newGreeting = 'Hello';
      let newIcon;
      
      if (hour >= 5 && hour < 12) {
        newGreeting = 'Good Morning';
        newIcon = <Sunrise className="h-5 w-5 text-yellow-500" />;
      } else if (hour >= 12 && hour < 17) {
        newGreeting = 'Good Afternoon';
        newIcon = <Sun className="h-5 w-5 text-yellow-500" />;
      } else if (hour >= 17 && hour < 21) {
        newGreeting = 'Good Evening';
        newIcon = <Sunset className="h-5 w-5 text-orange-500" />;
      } else {
        newGreeting = 'Good Night';
        newIcon = <Moon className="h-5 w-5 text-blue-400" />;
      }
      
      setGreeting(newGreeting);
      setTimeIcon(newIcon);
    };
    
    updateGreeting();
    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`p-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex items-center">
        {timeIcon}
        <h1 className="text-2xl font-bold ml-2">
          {greeting}, <span className="text-[#00ADB5]">{userName}</span>
        </h1>
      </div>
      <p className="text-gray-400 dark:text-gray-300 mt-1">Where would you like to go today?</p>
    </div>
  );
};

export default HomeGreeting;

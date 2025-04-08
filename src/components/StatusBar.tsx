
import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface StatusBarProps {
  style?: 'light' | 'dark';
}

const StatusBar: React.FC<StatusBarProps> = ({ style = 'dark' }) => {
  const textColor = style === 'light' ? 'text-white' : 'text-gray-800';
  
  // Get current time
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const time = `${hours}:${minutes}`;

  return (
    <div className={`px-4 py-2 flex justify-between items-center ${textColor}`}>
      <div className="text-sm font-medium">{time}</div>
      <div className="flex items-center space-x-2">
        <Signal className="h-4 w-4" />
        <Wifi className="h-4 w-4" />
        <Battery className="h-4 w-4" />
      </div>
    </div>
  );
};

export default StatusBar;

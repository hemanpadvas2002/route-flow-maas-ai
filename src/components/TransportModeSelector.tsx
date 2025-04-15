
import React from 'react';
import { Bus, Train, Car, UserRound, Ship, Bike } from 'lucide-react';

interface TransportMode {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface TransportModeSelectorProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
}

const TransportModeSelector: React.FC<TransportModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
}) => {
  const transportModes: TransportMode[] = [
    {
      id: 'bus',
      name: 'Bus',
      icon: <Bus className="h-5 w-5" />,
      color: '#FFA500', // Orange
    },
    {
      id: 'train',
      name: 'Train',
      icon: <Train className="h-5 w-5" />,
      color: '#4CAF50', // Green
    },
    {
      id: 'metro',
      name: 'Metro',
      icon: <Train className="h-5 w-5" />,
      color: '#1E88E5', // Blue
    },
    {
      id: 'taxi',
      name: 'Taxi',
      icon: <Car className="h-5 w-5" />,
      color: '#FFEB3B', // Yellow
    },
    {
      id: 'walking',
      name: 'Walking',
      icon: <UserRound className="h-5 w-5" />,
      color: '#BDBDBD', // Light Grey
    },
    {
      id: 'ferry',
      name: 'Ferry',
      icon: <Ship className="h-5 w-5" />,
      color: '#0D47A1', // Navy Blue
    },
    {
      id: 'cycling',
      name: 'Cycling',
      icon: <Bike className="h-5 w-5" />,
      color: '#8BC34A', // Lime Green
    },
  ];

  return (
    <div className="transport-mode-selector overflow-x-auto py-4 px-2" style={{ background: 'linear-gradient(to right, #1E1E2F, #2C2C3A)' }}>
      <div className="flex space-x-3 min-w-max px-2">
        {transportModes.map((mode) => (
          <button
            key={mode.id}
            className={`
              flex flex-col items-center justify-center p-2 rounded-xl transition-all
              ${selectedMode === mode.id ? 'scale-105 shadow-md' : 'opacity-80'}
              ${selectedMode === mode.id ? 'ai-glow' : ''}
            `}
            style={{ 
              backgroundColor: selectedMode === mode.id ? mode.color : `${mode.color}20`,
              width: 70 
            }}
            onClick={() => onSelectMode(mode.id)}
          >
            <div 
              className="rounded-full p-2 mb-1" 
              style={{ backgroundColor: selectedMode === mode.id ? 'white' : `${mode.color}40` }}
            >
              <div className={`${selectedMode === mode.id ? `text-[${mode.color}]` : 'text-white'}`}>
                {mode.icon}
              </div>
            </div>
            <span className={`text-xs font-medium ${selectedMode === mode.id ? 'text-white' : 'text-gray-300'}`}>
              {mode.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TransportModeSelector;

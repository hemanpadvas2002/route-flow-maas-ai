
import React from 'react';
import { Bus, Train, Taxi, Walking, Ferry, Bike } from 'lucide-react';

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
      icon: <Taxi className="h-5 w-5" />,
      color: '#FFEB3B', // Yellow
    },
    {
      id: 'walking',
      name: 'Walking',
      icon: <Walking className="h-5 w-5" />,
      color: '#BDBDBD', // Light Grey
    },
    {
      id: 'ferry',
      name: 'Ferry',
      icon: <Ferry className="h-5 w-5" />,
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
    <div className="transport-mode-selector overflow-x-auto py-2">
      <div className="flex space-x-2 pb-1 px-2 min-w-max">
        {transportModes.map((mode) => (
          <button
            key={mode.id}
            className={`
              transport-pill flex-shrink-0 transition-all
              ${selectedMode === mode.id ? 'scale-105 shadow-md' : 'opacity-80'}
            `}
            style={{ backgroundColor: mode.color }}
            onClick={() => onSelectMode(mode.id)}
          >
            {mode.icon}
            <span>{mode.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TransportModeSelector;

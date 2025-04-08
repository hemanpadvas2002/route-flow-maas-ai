
import React, { useMemo } from 'react';
import { Bus, Train, Car, Ship, Bike } from 'lucide-react';

interface TicketCardProps {
  ticketId: string;
  transportMode: 'bus' | 'train' | 'metro' | 'taxi' | 'ferry' | 'cycling';
  startLocation: string;
  endLocation: string;
  departureTime: string;
  arrivalTime: string;
  passengerName: string;
  price: number;
  routeIdentifier?: string;
  date: string;
  expired?: boolean;
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticketId,
  transportMode,
  startLocation,
  endLocation,
  departureTime,
  arrivalTime,
  passengerName,
  price,
  routeIdentifier,
  date,
  expired = false,
}) => {
  const { color, icon, displayName } = useMemo(() => {
    const config = {
      bus: { color: '#FFA500', icon: <Bus className="h-5 w-5" />, displayName: 'Bus' },
      train: { color: '#4CAF50', icon: <Train className="h-5 w-5" />, displayName: 'Train' },
      metro: { color: '#1E88E5', icon: <Train className="h-5 w-5" />, displayName: 'Metro' },
      taxi: { color: '#FFEB3B', icon: <Car className="h-5 w-5" />, displayName: 'Taxi' },
      ferry: { color: '#0D47A1', icon: <Ship className="h-5 w-5" />, displayName: 'Ferry' },
      cycling: { color: '#8BC34A', icon: <Bike className="h-5 w-5" />, displayName: 'Bicycle' }
    };
    
    return config[transportMode];
  }, [transportMode]);

  // Generate a barcode-like pattern
  const generateBarcodePattern = (id: string) => {
    const barPattern = [];
    const idAsNumber = parseInt(id.replace(/[^0-9]/g, '').substring(0, 10), 10);
    
    for (let i = 0; i < 30; i++) {
      const width = ((idAsNumber + i) % 4) + 1;
      barPattern.push(width);
    }
    
    return barPattern;
  };

  const barcodePattern = generateBarcodePattern(ticketId);

  return (
    <div className={`boarding-pass relative max-w-sm mx-auto ${expired ? 'opacity-70' : ''}`}>
      {/* Top section with transport info */}
      <div style={{ backgroundColor: color }} className="p-5 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-full p-2 mr-3">
              {icon}
            </div>
            <div>
              <div className="font-bold text-lg">{displayName}</div>
              {routeIdentifier && <div>{routeIdentifier}</div>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80">Price</div>
            <div className="font-bold text-xl">₹{price.toFixed(2)}</div>
          </div>
        </div>
      </div>
      
      {/* Ticket details */}
      <div className="p-5 bg-white">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-xs text-gray-500">From</div>
            <div className="font-bold text-lg truncate">{startLocation}</div>
            <div className="text-sm">{departureTime}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">To</div>
            <div className="font-bold text-lg truncate">{endLocation}</div>
            <div className="text-sm">{arrivalTime}</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-xs text-gray-500">Date</div>
            <div className="font-medium">{date}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Passenger</div>
            <div className="font-medium">{passengerName}</div>
          </div>
        </div>
      </div>
      
      {/* Barcode & ticket ID section */}
      <div className="p-5 bg-gray-50 border-t border-dashed border-gray-300 flex flex-col items-center">
        <div className="mb-2 w-full">
          <div className="flex space-x-[2px] justify-center">
            {barcodePattern.map((width, i) => (
              <div
                key={i}
                style={{ width: `${width}px` }}
                className="h-14 bg-gray-800"
              />
            ))}
          </div>
        </div>
        <div className="text-center text-xs font-mono text-gray-600">
          {ticketId}
        </div>
      </div>
      
      {expired && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/80 px-6 py-2 rounded-full border-2 border-red-500 text-red-500 font-bold text-xl transform rotate-[-20deg]">
            EXPIRED
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketCard;

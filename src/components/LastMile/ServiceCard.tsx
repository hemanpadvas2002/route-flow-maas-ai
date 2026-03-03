import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, IndianRupee } from 'lucide-react';
import { LastMileService, RideMode } from './types';
import { calculateFare, calculateEta } from './lastMileData';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: LastMileService;
  distanceKm: number;
  rideMode: RideMode;
  selected: boolean;
  onSelect: (id: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  distanceKm,
  rideMode,
  selected,
  onSelect,
}) => {
  const isShared = rideMode === 'shared';
  const fare = calculateFare(service, distanceKm, isShared);
  const eta = calculateEta(service, distanceKm);

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md border-2',
        selected
          ? 'border-primary shadow-md ring-1 ring-primary/20'
          : 'border-transparent hover:border-muted-foreground/20',
        !service.available && 'opacity-50 pointer-events-none'
      )}
      onClick={() => service.available && onSelect(service.id)}
    >
      <CardContent className="p-3 flex items-center gap-3">
        <div className="text-3xl flex-shrink-0 w-10 text-center">{service.emoji}</div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{service.name}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {eta} min
            </span>
            <span className="flex items-center gap-0.5 text-xs font-medium text-foreground">
              <IndianRupee className="h-3 w-3" />
              {fare}
            </span>
          </div>
          {!service.available && (
            <p className="text-xs text-destructive mt-1">Unavailable</p>
          )}
        </div>
        {selected && (
          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground text-xs">✓</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
